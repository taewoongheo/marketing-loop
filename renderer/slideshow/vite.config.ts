import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const templatesDirectory = fileURLToPath(new URL("./templates", import.meta.url));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isTemplate = (value: unknown): value is Record<string, unknown> & { slides: unknown[] } =>
  isRecord(value) && value.type === "tiktok-slide-template" && Array.isArray(value.slides) && value.slides.length > 0;

const templateIdFromName = (name: string) => {
  const id = name
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return id || "template";
};

const sendJson = (response: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

const readTemplates = async () => {
  await mkdir(templatesDirectory, { recursive: true });
  const fileNames = (await readdir(templatesDirectory))
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  const templates = await Promise.all(
    fileNames.map(async (fileName) => {
      try {
        const template = JSON.parse(await readFile(path.join(templatesDirectory, fileName), "utf8"));
        if (!isTemplate(template)) return null;

        const id = path.basename(fileName, ".json");
        return {
          ...template,
          id,
          name: typeof template.name === "string" && template.name.trim() ? template.name : id,
        };
      } catch {
        return null;
      }
    }),
  );

  return templates.filter((template) => template !== null);
};

const templateApiMiddleware: Connect.NextHandleFunction = async (request, response, next) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (pathname !== "/api/templates") {
    next();
    return;
  }

  try {
    if (request.method === "GET") {
      sendJson(response, 200, { templates: await readTemplates() });
      return;
    }

    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    request.setEncoding("utf8");
    let rawBody = "";
    for await (const chunk of request) rawBody += chunk;

    const template = JSON.parse(rawBody);
    const name = isRecord(template) && typeof template.name === "string" ? template.name.trim() : "";
    if (!name || !isTemplate(template)) {
      sendJson(response, 400, { error: "A template name and at least one slide are required." });
      return;
    }

    const id = templateIdFromName(name);
    const storedTemplate = {
      ...template,
      type: "tiktok-slide-template",
      version: 2,
      id,
      name,
      updatedAt: new Date().toISOString(),
    };

    await mkdir(templatesDirectory, { recursive: true });
    await writeFile(
      path.join(templatesDirectory, `${id}.json`),
      `${JSON.stringify(storedTemplate, null, 2)}\n`,
      "utf8",
    );

    sendJson(response, 200, { template: storedTemplate, templates: await readTemplates() });
  } catch (error) {
    const message = error instanceof SyntaxError ? "Template JSON is invalid." : "Template could not be saved.";
    sendJson(response, 500, { error: message });
  }
};

const templateStoragePlugin = (): Plugin => ({
  name: "slideshow-template-storage",
  configureServer(server) {
    server.middlewares.use(templateApiMiddleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(templateApiMiddleware);
  },
});

export default defineConfig({
  plugins: [react(), templateStoragePlugin()],
});
