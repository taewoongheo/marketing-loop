import { createReadStream, createWriteStream } from "node:fs";
import { access, mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { assertVideoProject, MAX_ASSET_BYTES, MAX_PROJECT_BYTES, normalizeProject } from "./src/projectValidation.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const contentsDirectory = path.join(root, "contents");
const assetsDirectory = path.join(root, "public", "assets");
const rendersDirectory = path.join(root, "renders");
const renderScript = path.join(root, "scripts", "render-project.mjs");

const fileId = (value: string, fallback: string) => value
  .normalize("NFKC")
  .toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
  .replace(/^-+|-+$/g, "") || fallback;

const sendJson = (response: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

const readBody = async (request: Parameters<Connect.NextHandleFunction>[0], limit: number) => {
  request.setEncoding("utf8");
  let body = "";
  let bytes = 0;
  for await (const chunk of request) {
    bytes += Buffer.byteLength(chunk);
    if (bytes > limit) throw new Error("PAYLOAD_TOO_LARGE");
    body += chunk;
  }
  return body;
};

const readProjects = async () => {
  await mkdir(contentsDirectory, { recursive: true });
  const files = (await readdir(contentsDirectory)).filter((name) => name.endsWith(".json")).sort();
  const projects = await Promise.all(files.map(async (name) => {
    try {
      const projectPath = path.join(contentsDirectory, name);
      if ((await stat(projectPath)).size > MAX_PROJECT_BYTES) return null;
      const value = normalizeProject(JSON.parse(await readFile(projectPath, "utf8")));
      return { ...value, id: path.basename(name, ".json") };
    } catch {
      return null;
    }
  }));
  return projects.filter((project) => project !== null);
};

const runRender = (projectPath: string, outputPath: string) => new Promise<void>((resolve, reject) => {
  const child = spawn(process.execPath, [renderScript, "--project", projectPath, "--out", outputPath], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += String(chunk); });
  child.on("error", reject);
  child.on("close", (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `Render exited with code ${code}.`)));
});

const storageMiddleware: Connect.NextHandleFunction = async (request, response, next) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname = url.pathname;

  try {
    if (pathname === "/api/projects" && request.method === "GET") {
      sendJson(response, 200, { projects: await readProjects() });
      return;
    }

    if (pathname === "/api/projects" && request.method === "POST") {
      const value = JSON.parse(await readBody(request, MAX_PROJECT_BYTES));
      assertVideoProject(value);
      const project = normalizeProject(value);
      if (!project.name.trim()) {
        sendJson(response, 400, { error: "A project name is required." });
        return;
      }
      const id = fileId(project.name, "video-project");
      const stored = { ...project, id, updatedAt: new Date().toISOString() };
      await mkdir(contentsDirectory, { recursive: true });
      await writeFile(path.join(contentsDirectory, `${id}.json`), `${JSON.stringify(stored, null, 2)}\n`, "utf8");
      sendJson(response, 200, { project: stored, projects: await readProjects() });
      return;
    }

    if (pathname.startsWith("/api/projects/") && request.method === "DELETE") {
      const id = decodeURIComponent(pathname.slice("/api/projects/".length));
      if (!id || fileId(id, "") !== id) {
        sendJson(response, 400, { error: "Project id is invalid." });
        return;
      }
      try {
        await unlink(path.join(contentsDirectory, `${id}.json`));
      } catch (error) {
        if ((error as { code?: string }).code !== "ENOENT") throw error;
      }
      sendJson(response, 200, { projects: await readProjects() });
      return;
    }

    if (pathname === "/api/assets" && request.method === "POST") {
      const rawName = url.searchParams.get("name") ?? "video.mp4";
      const extension = path.extname(rawName).toLowerCase();
      if (!new Set([".mp4", ".mov", ".webm", ".m4v", ".mp3", ".wav", ".m4a", ".aac", ".ogg"]).has(extension)) {
        sendJson(response, 400, { error: "Use a supported video or audio file." });
        return;
      }
      const contentLength = Number(request.headers["content-length"] ?? 0);
      if (contentLength > MAX_ASSET_BYTES) {
        sendJson(response, 413, { error: "Video must not exceed 1 GB." });
        request.resume();
        return;
      }
      await mkdir(assetsDirectory, { recursive: true });
      const base = fileId(path.basename(rawName, extension), "video");
      const name = `${base}-${Date.now().toString(36)}${extension}`;
      const destination = path.join(assetsDirectory, name);
      let bytes = 0;
      request.on("data", (chunk) => {
        bytes += Buffer.byteLength(chunk);
        if (bytes > MAX_ASSET_BYTES) request.destroy(new Error("PAYLOAD_TOO_LARGE"));
      });
      await pipeline(request, createWriteStream(destination, { flags: "wx" }));
      sendJson(response, 200, { src: `/assets/${name}` });
      return;
    }

    if (pathname === "/api/render" && request.method === "POST") {
      const body = JSON.parse(await readBody(request, 16 * 1024));
      const id = typeof body.id === "string" ? body.id : "";
      if (!id || fileId(id, "") !== id) {
        sendJson(response, 400, { error: "Save the project before rendering." });
        return;
      }
      const projectPath = path.join(contentsDirectory, `${id}.json`);
      await access(projectPath);
      await mkdir(rendersDirectory, { recursive: true });
      const outputName = `${id}.mp4`;
      await runRender(projectPath, path.join(rendersDirectory, outputName));
      sendJson(response, 200, { downloadUrl: `/api/renders/${encodeURIComponent(outputName)}` });
      return;
    }

    if (pathname.startsWith("/api/renders/") && request.method === "GET") {
      const name = decodeURIComponent(pathname.slice("/api/renders/".length));
      const id = name.endsWith(".mp4") ? name.slice(0, -4) : "";
      if (!id || fileId(id, "") !== id || name !== `${id}.mp4`) {
        sendJson(response, 400, { error: "Render name is invalid." });
        return;
      }
      const outputPath = path.join(rendersDirectory, name);
      await access(outputPath);
      response.statusCode = 200;
      response.setHeader("Content-Type", "video/mp4");
      response.setHeader("Content-Disposition", `attachment; filename="video.mp4"; filename*=UTF-8''${encodeURIComponent(name)}`);
      createReadStream(outputPath).pipe(response);
      return;
    }

    next();
  } catch (error) {
    const message = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE"
      ? "Payload is too large."
      : error instanceof SyntaxError
        ? "Project JSON is invalid."
        : error instanceof Error
          ? error.message
          : "Request failed.";
    sendJson(response, message === "Payload is too large." ? 413 : 500, { error: message });
  }
};

const videoStoragePlugin = (): Plugin => ({
  name: "video-renderer-storage",
  configureServer(server) { server.middlewares.use(storageMiddleware); },
  configurePreviewServer(server) { server.middlewares.use(storageMiddleware); },
});

export default defineConfig({
  plugins: [react(), videoStoragePlugin()],
});
