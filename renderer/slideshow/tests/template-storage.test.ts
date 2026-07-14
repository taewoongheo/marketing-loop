import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { readTemplatePackages, writeTemplatePackage } from "../template-storage.ts";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isTemplate = (value: unknown): value is Record<string, unknown> & { slides: unknown[] } =>
  isRecord(value) && value.type === "tiktok-slide-template" && Array.isArray(value.slides) && value.slides.length > 0;

const withTemporaryDirectory = async (run: (directory: string) => Promise<void>) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "env-template-storage-"));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
};

test("reads one template.json from each template package directory", async () => {
  await withTemporaryDirectory(async (directory) => {
    await mkdir(path.join(directory, "list"));
    await writeFile(
      path.join(directory, "list", "template.json"),
      JSON.stringify({ type: "tiktok-slide-template", id: "wrong-id", name: "", slides: [{}] }),
    );
    await writeFile(
      path.join(directory, "legacy.json"),
      JSON.stringify({ type: "tiktok-slide-template", name: "legacy", slides: [{}] }),
    );
    await mkdir(path.join(directory, "invalid"));
    await writeFile(path.join(directory, "invalid", "template.json"), "{}", "utf8");

    const templates = await readTemplatePackages(directory, isTemplate);

    assert.deepEqual(templates, [
      { type: "tiktok-slide-template", id: "list", name: "list", slides: [{}] },
    ]);
  });
});

test("writes template JSON inside its package without replacing copywriting context", async () => {
  await withTemporaryDirectory(async (directory) => {
    const packageDirectory = path.join(directory, "list");
    await mkdir(packageDirectory);
    await writeFile(path.join(packageDirectory, "copywriting.md"), "# Keep me\n", "utf8");

    const template = { type: "tiktok-slide-template", id: "list", name: "list", slides: [{}] };
    await writeTemplatePackage(directory, "list", template);

    assert.deepEqual(
      JSON.parse(await readFile(path.join(packageDirectory, "template.json"), "utf8")),
      template,
    );
    assert.equal(await readFile(path.join(packageDirectory, "copywriting.md"), "utf8"), "# Keep me\n");
  });
});
