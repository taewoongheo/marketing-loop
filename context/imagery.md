# Imagery

## Scope, inputs, and outputs

This file owns the current account-wide rules for translating approved content meaning into imagery for env: semantic visualization, art direction, cross-image variation, within-image composition, runtime request constraints, generation settings, and selection policy.

- The selected message owns persuasion strategy and claim limits.
- The approved copy owns the actual hook, body, CTA, title, caption, and all language.
- Format-specific materials own approved content inputs, not visual instructions.
- The live renderer template owns image-slot presence, source editability, fixed assets, placement, dimensions, crop behavior, and permitted layout variation.
- Raw reference assets remain evidence in their designated owner. This file owns only the current account-wide visual interpretation derived from them.
- The editable project owns the exact approved copy, final image bytes, and content-specific image geometry used for one content.

At generation time, the assistant reads the approved project copy, live image slot, and this file, then constructs the provider request as a transient execution value. Do not persist that request as a separate artifact. Do not store post-specific copy, duplicate layout values, final images, or object- and topic-specific default descriptions here. Concrete examples may explain a rule, but they are nonbinding and must not become default request content.

User-directed improvements update this file immediately. Imagery is not a hypothesis axis and has no imagery version.

## Semantic translation

For each live image slot whose source is editable, derive one visual scene from the approved meaning of that slide.

- Let the copy make the argument. Use the image as nonverbal support through a recognizable situation, mood, texture, or human-scale action.
- Extract the reader-facing situation, consequence, or action rather than converting the slide sentence word for word.
- Show one dominant idea per image. Do not combine every sentence or method from the slide into one scene.
- Keep all necessary argumentative meaning in the copy; the image must not introduce an unsupported claim or a second method.
- Do not default to a visible person when an environment, relationship between visual elements, trace of recent action, or partial human presence can communicate the same meaning.
- Respect fixed product imagery and non-editable sources declared by the live template.

## Art direction and cross-image variation

- Make the image feel like a familiar moment casually captured on a phone by the person living it or someone nearby.
- Use natural available light and believable indoor light, favoring warm or neutral exposure over dramatic or highly stylized lighting.
- Keep the palette soft and lived-in, with warm neutrals and occasional muted color. Create a gentle everyday aesthetic through light, texture, framing, and personal familiarity; never translate that aesthetic into a subject's gender.
- Favor candid, slightly imperfect framing: off-center subjects, natural cropping, partial human presence, and the perspective of an ordinary observer rather than a directed shoot.
- Preserve believable texture and incidental imperfection, including mild grain or compression, uneven shadows, reflections, small overlaps, and ordinary visual variation.
- Show people, when present, in unposed posture or mid-action rather than performing for the camera.
- Across one slideshow, do not make visible people the dominant subject of most generated images. Unless the approved meaning requires otherwise, use at most one person-centered generated image and let the remaining images communicate through environment, visual relationships, traces of action, or partial human presence.
- Keep generated images broadly compatible through naturalism rather than repeating one person, location, object cluster, viewpoint, exact palette, or color treatment.

Before making provider requests for one content, assign each generated slot a distinct primary visual carrier, setting, camera distance or angle, and dominant color treatment. Do not repeat the same primary object cluster or scene structure across adjacent generated images merely to create consistency.

## Within-image composition

- Read the live slot's aspect ratio, placement, dimensions, crop behavior, and permitted geometry variation; do not restate or own those layout values here.
- Compose for the final crop, with the focal subject or action inside a safe region defined by the live layout.
- Keep the dominant action immediately legible and avoid placing essential details at the edges.
- Use one plausible environment and only the visual elements needed to make the scene recognizable.

## Runtime request constraints

Construct one provider request from the approved semantic meaning, art direction, within-image composition, and the following exclusions. Use a plain semantic description instead of copying the approved slide wording when possible.

Encode these as request constraints:

- no readable captions, labels, logos, watermarks, or unapproved brand marks;
- no fake env interface or unapproved product UI;
- no visible interface content unless it is truthful, necessary, and approved;
- no visual claim that exceeds product truth or the selected message's evidence limits;
- no copied reference subject, composition, signature, or distinctive expression;
- no collage, split screen, before/after layout, or multiple competing scenes unless explicitly required by the approved content and live template;
- no commercial stock-photo polish, staged lifestyle-ad composition, or showroom-like perfection;
- no synthetic-looking smoothness, waxy or plastic surfaces, implausibly perfect symmetry, impossible lighting, excessive cinematic blur, or over-rendered detail;
- no inference that soft, warm, personal, or aesthetic direction requires a female subject; do not specify or emphasize gender unless the approved meaning requires it;
- no obvious anatomy defect, impossible object, or malformed visual element.

These exclusions guide the provider request. They do not authorize subjective selection or another paid generation after a technically usable image has been returned.

## Generation profile and selection policy

- Provider: OpenAI Images API
- Model: `gpt-image-2`
- Quality: `medium`
- Successful results per eligible slot: exactly `1`
- Subjective selection: none
- Subjective regeneration: none
- Output format: PNG
- Output dimensions: choose one supported source size after the permitted content-specific image geometry is selected from the live template
- Maximum technical retries after the initial request: `3`
- Maximum total attempts per eligible slot: `4`

A technical failure means that no usable image payload was returned because of a transport or API error, empty response, undecodable payload, or invalid output format or dimensions. Retry only such a failure and stop after at most three retries. The first technically usable image ends the attempt sequence and is used directly even when its aesthetics or adherence to non-safety request details are imperfect. Never spend another request merely because a successful image is less attractive than expected.

## Rationale

The account-wide direction is familiar, gently aesthetic, everyday, and naturally photographed. It is explicitly independent of subject gender, uses visible people sparingly, and seeks cross-image variety without making a repeated object cluster or color treatment the source of consistency. Approved copy and the live template remain runtime inputs rather than being duplicated here.
