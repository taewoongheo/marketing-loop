export type CanvasPreset = {
  id: string;
  name: string;
  width: number;
  height: number;
};

export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: "tiktok_4_5", name: "TikTok 4:5", width: 1080, height: 1350 },
  { id: "tiktok_9_16", name: "TikTok 9:16", width: 1080, height: 1920 },
];

export const DEFAULT_CANVAS_PRESET = CANVAS_PRESETS[0];
export const DEFAULT_TEXT_WIDTH = 420;
export const DEFAULT_LABEL_WIDTH = 320;
export const DEFAULT_BACKGROUND_FILL = "#ffffff";
export const FIXED_WEIGHT_FONTS = new Set(["Arial Black", "Impact"]);

export type Align = "left" | "center" | "right";

export type BackgroundLayer = {
  id: string;
  src: string;
  name: string;
  naturalWidth: number;
  naturalHeight: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  overlay: {
    enabled: boolean;
    fill: string;
    opacity: number;
  };
};

export type TextLayerModel = {
  id: string;
  type: "text";
  name: string;
  text: string;
  marks: TextMark[];
  templateRules?: TemplateRules;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  align: Align;
  lineHeight: number;
  letterSpacing: number;
  opacity: number;
  rotation: number;
  box: {
    enabled: boolean;
    fill: string;
    radius: number;
    paddingX: number;
    paddingY: number;
  };
};

export type TextMark = {
  start: number;
  end: number;
  underline?: boolean;
};

export type ImageLayerModel = {
  id: string;
  type: "image";
  name: string;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  crop?: ImageLayerCrop;
  placement?: ImageLayerPlacement;
  templateRules?: TemplateRules;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  rotation: number;
};

export type ImageLayerCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImagePlacementMode = "grid-2x2" | "rows-3";

export type ImageLayerPlacement = {
  mode: ImagePlacementMode;
  slotIndex: number;
};

export type TemplateEditableProperty =
  | "text"
  | "marks"
  | "src"
  | "crop"
  | "fontSize"
  | "fontFamily"
  | "fontWeight"
  | "lineHeight"
  | "letterSpacing"
  | "align"
  | "x"
  | "y"
  | "width"
  | "height"
  | "rotation"
  | "fill"
  | "stroke"
  | "strokeWidth"
  | "box"
  | "opacity"
  | "placement"
  | "name";

export type TemplateRules = {
  aiEditableProperties: TemplateEditableProperty[];
};

export type SlideLayerModel = TextLayerModel | ImageLayerModel;

export type SlideBackground = {
  type: "color";
  fill: string;
};

export type Slide = {
  id: string;
  name: string;
  canvas: CanvasPreset;
  background: SlideBackground;
  layers: SlideLayerModel[];
};

export type ProjectFile = {
  type: "tiktok-slide-project";
  version: 2;
  preset: CanvasPreset;
  slides: Slide[];
};

export type Selection = "background" | string | null;

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const DEFAULT_TEXT_AI_EDITABLE_PROPERTIES = ["text", "marks"] as const satisfies readonly TemplateEditableProperty[];
export const DEFAULT_IMAGE_AI_EDITABLE_PROPERTIES = ["src", "crop"] as const satisfies readonly TemplateEditableProperty[];

export const TEXT_AI_EDITABLE_PROPERTIES = [
  "text",
  "marks",
  "fontSize",
  "fontFamily",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "align",
  "x",
  "y",
  "width",
  "rotation",
  "fill",
  "stroke",
  "strokeWidth",
  "box",
  "opacity",
  "name",
] as const satisfies readonly TemplateEditableProperty[];

export const IMAGE_AI_EDITABLE_PROPERTIES = [
  "src",
  "crop",
  "x",
  "y",
  "width",
  "height",
  "rotation",
  "opacity",
  "placement",
  "name",
] as const satisfies readonly TemplateEditableProperty[];

const uniqueEditableProperties = (properties: TemplateEditableProperty[]) => Array.from(new Set(properties));

export const getDefaultTemplateRules = (layerType: SlideLayerModel["type"]): TemplateRules => ({
  aiEditableProperties: [
    ...(layerType === "image" ? DEFAULT_IMAGE_AI_EDITABLE_PROPERTIES : DEFAULT_TEXT_AI_EDITABLE_PROPERTIES),
  ],
});

export const normalizeTemplateRules = (
  rules: unknown,
  layerType: SlideLayerModel["type"],
): TemplateRules => {
  if (!isRecord(rules) || !Array.isArray(rules.aiEditableProperties)) {
    return getDefaultTemplateRules(layerType);
  }

  const allowed = layerType === "image" ? IMAGE_AI_EDITABLE_PROPERTIES : TEXT_AI_EDITABLE_PROPERTIES;
  const allowedSet = new Set<TemplateEditableProperty>(allowed);
  return {
    aiEditableProperties: uniqueEditableProperties(
      rules.aiEditableProperties.filter((property): property is TemplateEditableProperty => allowedSet.has(property)),
    ),
  };
};

const normalizeRangeBoundary = (value: unknown, textLength: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return clamp(Math.round(value), 0, textLength);
};

export const normalizeTextMarks = (marks: unknown, textLength: number): TextMark[] => {
  if (!Array.isArray(marks)) return [];

  const underlineMarks = marks
    .filter((mark): mark is Record<string, unknown> => isRecord(mark) && mark.underline === true)
    .map((mark) => {
      const start = normalizeRangeBoundary(mark.start, textLength);
      const end = normalizeRangeBoundary(mark.end, textLength);
      return {
        start: Math.min(start, end),
        end: Math.max(start, end),
        underline: true,
      };
    })
    .filter((mark) => mark.end > mark.start)
    .sort((left, right) => left.start - right.start || left.end - right.end);

  const merged: TextMark[] = [];
  for (const mark of underlineMarks) {
    const previous = merged[merged.length - 1];
    if (previous && previous.end >= mark.start) {
      previous.end = Math.max(previous.end, mark.end);
    } else {
      merged.push({ ...mark });
    }
  }

  return merged;
};

export const isTextRangeUnderlined = (marks: TextMark[], start: number, end: number) => {
  if (end <= start) return false;

  let cursor = start;
  for (const mark of marks) {
    if (!mark.underline || mark.end <= cursor) continue;
    if (mark.start > cursor) return false;
    cursor = Math.max(cursor, mark.end);
    if (cursor >= end) return true;
  }

  return false;
};

export const toggleUnderlineMark = (marks: TextMark[], start: number, end: number, textLength: number) => {
  const normalizedStart = normalizeRangeBoundary(start, textLength);
  const normalizedEnd = normalizeRangeBoundary(end, textLength);
  const rangeStart = Math.min(normalizedStart, normalizedEnd);
  const rangeEnd = Math.max(normalizedStart, normalizedEnd);
  if (rangeEnd <= rangeStart) return normalizeTextMarks(marks, textLength);

  const normalizedMarks = normalizeTextMarks(marks, textLength);
  if (!isTextRangeUnderlined(normalizedMarks, rangeStart, rangeEnd)) {
    return normalizeTextMarks(
      [...normalizedMarks, { start: rangeStart, end: rangeEnd, underline: true }],
      textLength,
    );
  }

  return normalizeTextMarks(
    normalizedMarks.flatMap((mark) => {
      if (!mark.underline || mark.end <= rangeStart || mark.start >= rangeEnd) return [mark];

      const nextMarks: TextMark[] = [];
      if (mark.start < rangeStart) nextMarks.push({ start: mark.start, end: rangeStart, underline: true });
      if (mark.end > rangeEnd) nextMarks.push({ start: rangeEnd, end: mark.end, underline: true });
      return nextMarks;
    }),
    textLength,
  );
};

export const MAX_BACKGROUNDS = 4;

export type BackgroundRenderArea = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

export const BACKGROUND_QUADRANTS = [
  { label: "Q2", column: 0, row: 0 },
  { label: "Q1", column: 1, row: 0 },
  { label: "Q3", column: 0, row: 1 },
  { label: "Q4", column: 1, row: 1 },
] as const;

export const normalizeCanvasPreset = (preset?: Partial<CanvasPreset>): CanvasPreset => {
  if (!preset) return DEFAULT_CANVAS_PRESET;

  const matchedById = CANVAS_PRESETS.find((candidate) => candidate.id === preset.id);
  if (matchedById) return matchedById;

  const matchedBySize = CANVAS_PRESETS.find(
    (candidate) => candidate.width === preset.width && candidate.height === preset.height,
  );
  if (matchedBySize) return matchedBySize;

  if (typeof preset.width === "number" && typeof preset.height === "number") {
    return {
      id: preset.id ?? `custom-${preset.width}x${preset.height}`,
      name: preset.name ?? `${preset.width}x${preset.height}`,
      width: preset.width,
      height: preset.height,
    };
  }

  return DEFAULT_CANVAS_PRESET;
};

export const defaultTextLayer = (): TextLayerModel => ({
  id: uid("text"),
  type: "text",
  name: "Hook text",
  text: "",
  marks: [],
  templateRules: getDefaultTemplateRules("text"),
  x: 100,
  y: 760,
  width: DEFAULT_TEXT_WIDTH,
  fontSize: 82,
  fontFamily: "Inter",
  fontWeight: "900",
  fill: "#ffffff",
  stroke: "#000000",
  strokeWidth: 10,
  align: "center",
  lineHeight: 1.14,
  letterSpacing: 0,
  opacity: 1,
  rotation: 0,
  box: {
    enabled: false,
    fill: "#ffffff",
    radius: 28,
    paddingX: 36,
    paddingY: 18,
  },
});

export const defaultLabelLayer = (): TextLayerModel => ({
  id: uid("label"),
  type: "text",
  name: "Pill label",
  text: "active recall",
  marks: [],
  templateRules: getDefaultTemplateRules("text"),
  x: 350,
  y: 620,
  width: DEFAULT_LABEL_WIDTH,
  fontSize: 58,
  fontFamily: "Inter",
  fontWeight: "700",
  fill: "#050505",
  stroke: "#050505",
  strokeWidth: 0,
  align: "center",
  lineHeight: 1,
  letterSpacing: 0,
  opacity: 1,
  rotation: 0,
  box: {
    enabled: true,
    fill: "#ffffff",
    radius: 26,
    paddingX: 34,
    paddingY: 18,
  },
});

export const createSlide = (index: number): Slide => ({
  id: uid("slide"),
  name: `Slide ${index}`,
  canvas: DEFAULT_CANVAS_PRESET,
  background: { type: "color", fill: DEFAULT_BACKGROUND_FILL },
  layers: [],
});

export const normalizeSlideBackground = (background?: Partial<SlideBackground>): SlideBackground => ({
  type: "color",
  fill: typeof background?.fill === "string" ? background.fill : DEFAULT_BACKGROUND_FILL,
});

export const normalizeTextLayer = (layer: Partial<TextLayerModel>, resetId = true): TextLayerModel => {
  const fallback = defaultTextLayer();
  const text = String(layer.text ?? fallback.text);
  return {
    ...fallback,
    ...layer,
    id: resetId ? uid("text") : String(layer.id ?? fallback.id),
    type: "text",
    text,
    marks: normalizeTextMarks(layer.marks, text.length),
    templateRules: normalizeTemplateRules(layer.templateRules, "text"),
    letterSpacing: layer.letterSpacing ?? 0,
    box: {
      ...fallback.box,
      ...(layer.box ?? {}),
    },
  };
};

export const normalizeImageLayer = (layer: Partial<ImageLayerModel>, resetId = true): ImageLayerModel => {
  const naturalWidth = typeof layer.naturalWidth === "number" && Number.isFinite(layer.naturalWidth) ? layer.naturalWidth : 1;
  const naturalHeight = typeof layer.naturalHeight === "number" && Number.isFinite(layer.naturalHeight) ? layer.naturalHeight : 1;
  const rawCrop = isRecord(layer.crop) ? layer.crop : null;
  const cropX = rawCrop
    ? clamp(typeof rawCrop.x === "number" && Number.isFinite(rawCrop.x) ? rawCrop.x : 0, 0, naturalWidth - 1)
    : 0;
  const cropY = rawCrop
    ? clamp(typeof rawCrop.y === "number" && Number.isFinite(rawCrop.y) ? rawCrop.y : 0, 0, naturalHeight - 1)
    : 0;
  const crop = rawCrop
    ? {
        x: cropX,
        y: cropY,
        width: clamp(
          typeof rawCrop.width === "number" && Number.isFinite(rawCrop.width) ? rawCrop.width : naturalWidth,
          1,
          naturalWidth - cropX,
        ),
        height: clamp(
          typeof rawCrop.height === "number" && Number.isFinite(rawCrop.height) ? rawCrop.height : naturalHeight,
          1,
          naturalHeight - cropY,
        ),
      }
    : undefined;
  const rawPlacement = isRecord(layer.placement) ? layer.placement : null;
  const placement =
    rawPlacement &&
    (rawPlacement.mode === "grid-2x2" || rawPlacement.mode === "rows-3") &&
    typeof rawPlacement.slotIndex === "number" &&
    Number.isFinite(rawPlacement.slotIndex)
      ? {
          mode: rawPlacement.mode,
          slotIndex: Math.max(0, Math.round(rawPlacement.slotIndex)),
      }
    : undefined;
  const width = typeof layer.width === "number" && Number.isFinite(layer.width) ? layer.width : naturalWidth;
  const height =
    !crop && !placement
      ? Math.round(width * (naturalHeight / naturalWidth))
      : typeof layer.height === "number" && Number.isFinite(layer.height)
        ? layer.height
        : naturalHeight;

  return {
    id: resetId ? uid("image") : String(layer.id ?? uid("image")),
    type: "image",
    name: String(layer.name ?? "Image"),
    src: String(layer.src ?? ""),
    naturalWidth,
    naturalHeight,
    crop,
    placement,
    templateRules: normalizeTemplateRules(layer.templateRules, "image"),
    x: typeof layer.x === "number" && Number.isFinite(layer.x) ? layer.x : 0,
    y: typeof layer.y === "number" && Number.isFinite(layer.y) ? layer.y : 0,
    width,
    height,
    opacity: clamp(layer.opacity ?? 1, 0, 1),
    rotation: typeof layer.rotation === "number" && Number.isFinite(layer.rotation) ? layer.rotation : 0,
  };
};

export const isTextLayer = (layer: SlideLayerModel): layer is TextLayerModel => layer.type === "text";

export const isImageLayer = (layer: SlideLayerModel): layer is ImageLayerModel => layer.type === "image";

export const normalizeSlideLayer = (layer: unknown, resetId = true): SlideLayerModel => {
  if (isRecord(layer) && layer.type === "image") return normalizeImageLayer(layer as Partial<ImageLayerModel>, resetId);
  return normalizeTextLayer(isRecord(layer) ? (layer as Partial<TextLayerModel>) : {}, resetId);
};

export const makePreset = (preset = DEFAULT_CANVAS_PRESET): ProjectFile["preset"] => normalizeCanvasPreset(preset);

export function calculateCover(naturalWidth: number, naturalHeight: number, canvas: CanvasPreset) {
  return calculateCoverForArea(naturalWidth, naturalHeight, { width: canvas.width, height: canvas.height });
}

export function calculateCoverForArea(
  naturalWidth: number,
  naturalHeight: number,
  area: Pick<BackgroundRenderArea, "width" | "height">,
) {
  const scale = Math.max(area.width / naturalWidth, area.height / naturalHeight);
  return {
    x: (area.width - naturalWidth * scale) / 2,
    y: (area.height - naturalHeight * scale) / 2,
    scale,
  };
}

export function getMinCoverScale(background: BackgroundLayer, canvas: CanvasPreset) {
  return getMinCoverScaleForArea(background, { width: canvas.width, height: canvas.height });
}

export function getMinCoverScaleForArea(
  background: BackgroundLayer,
  area: Pick<BackgroundRenderArea, "width" | "height">,
) {
  return Math.max(area.width / background.naturalWidth, area.height / background.naturalHeight);
}

export function constrainBackground(background: BackgroundLayer, canvas: CanvasPreset): BackgroundLayer {
  return constrainBackgroundToArea(background, { x: 0, y: 0, width: canvas.width, height: canvas.height, label: "Full" });
}

export function constrainBackgroundToArea(background: BackgroundLayer, area: BackgroundRenderArea): BackgroundLayer {
  const scale = Math.max(background.scale, getMinCoverScaleForArea(background, area));
  const renderedWidth = background.naturalWidth * scale;
  const renderedHeight = background.naturalHeight * scale;
  const minX = Math.min(0, area.width - renderedWidth);
  const minY = Math.min(0, area.height - renderedHeight);
  const x = renderedWidth <= area.width ? (area.width - renderedWidth) / 2 : clamp(background.x, minX, 0);
  const y = renderedHeight <= area.height ? (area.height - renderedHeight) / 2 : clamp(background.y, minY, 0);

  return { ...background, x, y, scale, overlay: normalizeBackgroundOverlay(background.overlay) };
}

export function fitBackgroundToCover(background: BackgroundLayer, canvas: CanvasPreset): BackgroundLayer {
  return fitBackgroundToArea(background, { x: 0, y: 0, width: canvas.width, height: canvas.height, label: "Full" });
}

export function fitBackgroundToArea(background: BackgroundLayer, area: BackgroundRenderArea): BackgroundLayer {
  return constrainBackgroundToArea(
    {
      ...background,
      ...calculateCoverForArea(background.naturalWidth, background.naturalHeight, area),
    },
    area,
  );
}

export function normalizeBackgroundOverlay(overlay?: Partial<BackgroundLayer["overlay"]>): BackgroundLayer["overlay"] {
  return {
    enabled: overlay?.enabled ?? false,
    fill: overlay?.fill ?? "#000000",
    opacity: clamp(overlay?.opacity ?? 0.35, 0, 1),
  };
}

type LegacyBackgroundSlide = {
  background?: BackgroundLayer;
  backgrounds?: BackgroundLayer[];
  backgroundOverlay?: BackgroundLayer["overlay"];
};

export function getSlideBackgrounds(slide: Pick<LegacyBackgroundSlide, "background" | "backgrounds">) {
  if (Array.isArray(slide.backgrounds) && slide.backgrounds.length > 0) {
    return slide.backgrounds.slice(0, MAX_BACKGROUNDS);
  }
  return slide.background ? [slide.background] : [];
}

export function getBackgroundRenderArea(index: number, canvas: CanvasPreset, backgroundCount: number): BackgroundRenderArea {
  if (backgroundCount <= 1) {
    return { x: 0, y: 0, width: canvas.width, height: canvas.height, label: "Full" };
  }

  const quadrant = BACKGROUND_QUADRANTS[index] ?? BACKGROUND_QUADRANTS[BACKGROUND_QUADRANTS.length - 1];
  const width = canvas.width / 2;
  const height = canvas.height / 2;
  return {
    x: quadrant.column * width,
    y: quadrant.row * height,
    width,
    height,
    label: quadrant.label,
  };
}

export function getSlideBackgroundOverlay(slide: LegacyBackgroundSlide) {
  const backgrounds = getSlideBackgrounds(slide);
  if (backgrounds[0]) return normalizeBackgroundOverlay(backgrounds[0].overlay);
  if (slide.backgroundOverlay) return normalizeBackgroundOverlay(slide.backgroundOverlay);
  return undefined;
}
