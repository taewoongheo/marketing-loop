import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSlideLayer } from "../src/editorModel.ts";

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
