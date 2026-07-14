import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readTemplatePackages, writeTemplatePackage } from "./template-storage";

const templatesDirectory = fileURLToPath(new URL("./templates", import.meta.url));
const contentsDirectory = fileURLToPath(new URL("./contents", import.meta.url));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isTemplate = (value: unknown): value is Record<string, unknown> & { slides: unknown[] } =>
  isRecord(value) && value.type === "tiktok-slide-template" && Array.isArray(value.slides) && value.slides.length > 0;

const isContent = (value: unknown): value is Record<string, unknown> & { slides: unknown[] } =>
  isRecord(value) && value.type === "tiktok-slide-project" && Array.isArray(value.slides) && value.slides.length > 0;

const fileIdFromName = (name: string, fallback: string) => {
  const id = name
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return id || fallback;
};

const sendJson = (response: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

const readJsonLibrary = async (
  directory: string,
  acceptsFile: (value: unknown) => value is Record<string, unknown> & { slides: unknown[] },
) => {
  await mkdir(directory, { recursive: true });
  const fileNames = (await readdir(directory))
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  const templates = await Promise.all(
    fileNames.map(async (fileName) => {
      try {
        const value = JSON.parse(await readFile(path.join(directory, fileName), "utf8"));
        if (!acceptsFile(value)) return null;

        const id = path.basename(fileName, ".json");
        return {
          ...value,
          id,
          name: typeof value.name === "string" && value.name.trim() ? value.name : id,
        };
      } catch {
        return null;
      }
    }),
  );

  return templates.filter((template) => template !== null);
};

const readTemplates = () => readTemplatePackages(templatesDirectory, isTemplate);
const readContents = () => readJsonLibrary(contentsDirectory, isContent);

const templateApiMiddleware: Connect.NextHandleFunction = async (request, response, next) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const isContentItemRequest = pathname.startsWith("/api/contents/");
  if (pathname !== "/api/templates" && pathname !== "/api/contents" && !isContentItemRequest) {
    next();
    return;
  }

  try {
    if (request.method === "GET" && pathname === "/api/templates") {
      sendJson(response, 200, { templates: await readTemplates() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/contents") {
      sendJson(response, 200, { contents: await readContents() });
      return;
    }

    if (request.method === "DELETE" && isContentItemRequest) {
      const id = decodeURIComponent(pathname.slice("/api/contents/".length));
      if (!id || fileIdFromName(id, "") !== id) {
        sendJson(response, 400, { error: "Content id is invalid." });
        return;
      }

      try {
        await unlink(path.join(contentsDirectory, `${id}.json`));
      } catch (error) {
        if ((error as { code?: string }).code !== "ENOENT") throw error;
      }

      sendJson(response, 200, { contents: await readContents() });
      return;
    }

    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    request.setEncoding("utf8");
    let rawBody = "";
    for await (const chunk of request) rawBody += chunk;

    const value = JSON.parse(rawBody);
    const name = isRecord(value) && typeof value.name === "string" ? value.name.trim() : "";
    if (pathname === "/api/templates" && (!name || !isTemplate(value))) {
      sendJson(response, 400, { error: "A template name and at least one slide are required." });
      return;
    }

    if (pathname === "/api/contents" && (!name || !isContent(value))) {
      sendJson(response, 400, { error: "A content name and at least one slide are required." });
      return;
    }

    const isTemplateRequest = pathname === "/api/templates";
    const id = fileIdFromName(name, isTemplateRequest ? "template" : "content");
    const storedValue = {
      ...value,
      type: isTemplateRequest ? "tiktok-slide-template" : "tiktok-slide-project",
      version: 2,
      id,
      name,
      updatedAt: new Date().toISOString(),
    };

    if (isTemplateRequest) {
      await writeTemplatePackage(templatesDirectory, id, storedValue);
    } else {
      await mkdir(contentsDirectory, { recursive: true });
      await writeFile(
        path.join(contentsDirectory, `${id}.json`),
        `${JSON.stringify(storedValue, null, 2)}\n`,
        "utf8",
      );
    }

    if (isTemplateRequest) {
      sendJson(response, 200, { template: storedValue, templates: await readTemplates() });
    } else {
      sendJson(response, 200, { content: storedValue, contents: await readContents() });
    }
  } catch (error) {
    const label = pathname === "/api/templates" ? "Template" : "Content";
    const message = error instanceof SyntaxError ? `${label} JSON is invalid.` : `${label} could not be saved.`;
    sendJson(response, 500, { error: message });
  }
};

const rendererStoragePlugin = (): Plugin => ({
  name: "slideshow-renderer-storage",
  configureServer(server) {
    server.middlewares.use(templateApiMiddleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(templateApiMiddleware);
  },
});

export default defineConfig({
  plugins: [react(), rendererStoragePlugin()],
});
