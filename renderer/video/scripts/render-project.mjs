import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const rendererRoot = fileURLToPath(new URL("..", import.meta.url));

const readFlag = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] ?? null;
};

const projectArg = readFlag("--project");
const outputArg = readFlag("--out");

if (!projectArg || !outputArg) {
  console.error("Usage: npm run render -- --project <project.json> --out <video.mp4>");
  process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectArg);
const outputPath = path.resolve(process.cwd(), outputArg);
await access(projectPath);
const project = JSON.parse(await readFile(projectPath, "utf8"));

if (project.type !== "lift-code-video-project") {
  throw new Error("Project must be a lift-code-video-project object.");
}

await mkdir(path.dirname(outputPath), { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.join(rendererRoot, "src", "remotionEntry.tsx"),
  rootDir: rendererRoot,
  publicDir: path.join(rendererRoot, "public"),
  symlinkPublicDir: true,
});
const inputProps = { project };
const composition = await selectComposition({
  serveUrl,
  id: "LiftCodeVideo",
  inputProps,
});

await renderMedia({
  serveUrl,
  composition,
  codec: "h264",
  outputLocation: outputPath,
  inputProps,
  overwrite: true,
  pixelFormat: "yuv420p",
});

console.log(outputPath);
