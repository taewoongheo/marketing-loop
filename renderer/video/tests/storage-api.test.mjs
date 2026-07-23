import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("storage middleware owns project, asset, and render routes", async () => {
  const source = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");
  assert.match(source, /\/api\/projects/);
  assert.match(source, /\/api\/assets/);
  assert.match(source, /\/api\/render/);
  assert.match(source, /\/api\/renders\//);
  assert.match(source, /filename\*=UTF-8/);
  assert.doesNotMatch(source, /\^\[a-z0-9-\]\+/);
  assert.match(source, /\.mp3/);
  assert.match(source, /\.m4a/);
});
