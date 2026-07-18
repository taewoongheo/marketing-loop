import assert from "node:assert/strict";
import test from "node:test";

import { normalizeCanvasPreset, normalizeSlideLayer } from "../src/editorModel.ts";

test("normalization discards legacy template property locks", () => {
  const textLayer = normalizeSlideLayer({
    type: "text",
    text: "Editable text",
    templateRules: { aiEditableProperties: ["text"] },
  });
  const imageLayer = normalizeSlideLayer({
    type: "image",
    src: "data:image/png;base64,AA==",
    naturalWidth: 1,
    naturalHeight: 1,
    templateRules: { aiEditableProperties: ["src"] },
  });

  assert.equal("templateRules" in textLayer, false);
  assert.equal("templateRules" in imageLayer, false);
});

test("canvas normalization rejects unsafe custom dimensions", () => {
  for (const preset of [
    { width: -1, height: 400 },
    { width: 4097, height: 400 },
    { width: 64, height: 320 },
  ]) {
    assert.throws(() => normalizeCanvasPreset(preset), /canvas|aspect ratio/i);
  }
});
