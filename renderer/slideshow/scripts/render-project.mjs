#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const HELP = `Usage:
  npm run render -- --project <project.json> --out <directory>

Options:
  --project  Path to a self-contained tiktok-slide-project JSON file
  --out      Directory for slide PNGs and contact-sheet.png
  --help     Show this help
`;

const rendererRoot = fileURLToPath(new URL("..", import.meta.url));

const parseArgs = (args) => {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help") return { help: true };
    if (argument !== "--project" && argument !== "--out") {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value.`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  if (!options.project || !options.out) throw new Error("Both --project and --out are required.");
  return options;
};

const findChrome = async () => {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue to the next known browser location.
    }
  }
  throw new Error("Chrome or Chromium was not found. Set CHROME_PATH to its executable.");
};

const safeFileName = (value, fallback) => {
  const normalized = String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
};

const pngFromDataUrl = (dataUrl) => {
  const match = dataUrl.match(/^data:image\/png;base64,(.+)$/s);
  if (!match) throw new Error("Browser renderer returned an invalid PNG data URL.");
  return Buffer.from(match[1], "base64");
};

const projectMiddleware = (projectPayload) => ({
  name: "render-project-json",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      if (pathname !== "/__render-project.json") {
        next();
        return;
      }
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.setHeader("Cache-Control", "no-store");
      response.end(projectPayload);
    });
  },
});

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const startChrome = (chrome, profileDirectory) => new Promise((resolve, reject) => {
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-component-update",
    "--force-device-scale-factor=1",
    `--user-data-dir=${profileDirectory}`,
    "--remote-debugging-port=0",
    "about:blank",
  ]);
  child.stdout.resume();
  let stderr = "";
  const timeout = setTimeout(() => {
    child.kill("SIGKILL");
    reject(new Error("Chrome DevTools endpoint did not start within 15 seconds."));
  }, 15_000);

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString("utf8");
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (!match) return;
    clearTimeout(timeout);
    const debuggerUrl = new URL(match[1]);
    resolve({ child, httpOrigin: `http://${debuggerUrl.host}` });
  });
  child.on("error", (error) => {
    clearTimeout(timeout);
    reject(error);
  });
  child.on("close", (code) => {
    clearTimeout(timeout);
    reject(new Error(stderr.trim() || `Chrome exited with ${code} before DevTools became ready.`));
  });
});

const stopChrome = async ({ child }) => {
  if (child.exitCode !== null) return;
  const closed = new Promise((resolve) => child.once("close", resolve));
  child.kill("SIGTERM");
  await Promise.race([closed, delay(5_000)]);
  if (child.exitCode === null) {
    child.kill("SIGKILL");
    await closed;
  }
};

const createCdpClient = async (webSocketUrl) => {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", () => reject(new Error("Could not connect to the Chrome DevTools page.")), { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const callbacks = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callbacks.reject(new Error(message.error.message));
    else callbacks.resolve(message.result);
  });
  socket.addEventListener("close", () => {
    for (const callbacks of pending.values()) callbacks.reject(new Error("Chrome DevTools page closed unexpectedly."));
    pending.clear();
  });

  return {
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      socket.close();
    },
  };
};

const renderUrl = async (browser, url) => {
  const response = await fetch(`${browser.httpOrigin}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (!response.ok) throw new Error(`Chrome could not open the render target (${response.status}).`);
  const target = await response.json();
  const cdp = await createCdpClient(target.webSocketDebuggerUrl);

  try {
    await cdp.send("Runtime.enable");
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      const evaluation = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const output = document.querySelector("#render-output");
          if (output) return output.textContent;
          const error = document.querySelector("#render-error");
          return error ? "__RENDER_ERROR__" + error.textContent : null;
        })()`,
        returnByValue: true,
      });
      const value = evaluation.result?.value;
      if (typeof value === "string" && value.startsWith("data:image/png;base64,")) {
        return pngFromDataUrl(value);
      }
      if (typeof value === "string" && value.startsWith("__RENDER_ERROR__")) {
        throw new Error(`Browser renderer failed: ${value.slice("__RENDER_ERROR__".length)}`);
      }
      await delay(100);
    }
    throw new Error("Browser renderer did not produce PNG data within 60 seconds.");
  } finally {
    cdp.close();
    await fetch(`${browser.httpOrigin}/json/close/${target.id}`, { method: "PUT" }).catch(() => undefined);
  }
};

const run = async () => {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n\n${HELP}`);
    process.exitCode = 1;
    return;
  }
  if (options.help) {
    process.stdout.write(HELP);
    return;
  }

  const projectPath = path.resolve(options.project);
  const outputDirectory = path.resolve(options.out);
  const projectPayload = await readFile(projectPath, "utf8");
  const project = JSON.parse(projectPayload);
  if (project?.type !== "tiktok-slide-project" || !Array.isArray(project.slides) || project.slides.length === 0) {
    throw new Error("--project must point to a non-empty tiktok-slide-project JSON file.");
  }
  if (typeof project.formatId !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.formatId)) {
    throw new Error("--project must include a lowercase format identity.");
  }

  const chrome = await findChrome();
  const profileDirectory = await mkdtemp(path.join(os.tmpdir(), "env-render-chrome-"));
  let server;
  let browser;
  try {
    server = await createServer({
      root: rendererRoot,
      configFile: path.join(rendererRoot, "vite.config.ts"),
      logLevel: "silent",
      server: { host: "127.0.0.1", port: 0, strictPort: false, hmr: false },
      plugins: [projectMiddleware(projectPayload)],
    });
    await mkdir(outputDirectory, { recursive: true });
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") throw new Error("Renderer server did not expose a local port.");
    const baseUrl = `http://127.0.0.1:${address.port}/render-cli.html`;
    browser = await startChrome(chrome, profileDirectory);

    for (const [index, slide] of project.slides.entries()) {
      const fileName = `${String(index + 1).padStart(2, "0")}-${safeFileName(slide.name, `slide-${index + 1}`)}.png`;
      const png = await renderUrl(browser, `${baseUrl}?slide=${index}`);
      await writeFile(path.join(outputDirectory, fileName), png);
      process.stdout.write(`${fileName}\n`);
    }

    await writeFile(
      path.join(outputDirectory, "contact-sheet.png"),
      await renderUrl(browser, `${baseUrl}?contact=1`),
    );
    process.stdout.write("contact-sheet.png\n");
  } finally {
    if (browser) await stopChrome(browser);
    if (server) await server.close();
    await rm(profileDirectory, { recursive: true, force: true });
  }
};

run().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
