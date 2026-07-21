# Imagery

## Scope, inputs, and outputs

This file owns the current account-wide rules for translating approved content meaning into imagery for LIFT CODE: semantic visualization, art direction, cross-image variation, within-image composition, runtime request constraints, and generation/selection policy.

- The selected message owns persuasion strategy and claim limits.
- The approved copy owns the actual hook, body, CTA, title, caption, and all language.
- `context/expertise.md` owns reusable strength-training domain knowledge and provenance, not visual instructions.
- The content project owns image-layer presence, fixed assets, placement, dimensions, crop behavior, and all content-specific layout decisions.
- Raw reference assets remain evidence in their designated owner. This file owns only the current account-wide visual interpretation derived from product and brand direction.
- The editable project owns the exact approved copy, final image bytes, and content-specific image geometry used for one content.

At generation time, read the approved project copy, selected image geometry, and this file, then construct the provider request as a transient execution value. Do not persist that request as a separate artifact. Do not store post-specific copy, duplicate layout values, final images, or object-specific default scenes here.

User-directed improvements update this file immediately. Imagery is not a hypothesis axis and has no imagery version.

## Semantic translation

For each generated image layer selected for the content project, derive one visual scene from the approved meaning of that slide.

- Let copy make the argument. Let the image embody the physical stake: load, effort, uncertainty, discipline, accumulated work, or controlled aggression.
- Extract the reader-facing situation, consequence, or action rather than illustrating the sentence word for word.
- Show one dominant idea per image. Do not combine every exercise, input, or method from the slide into one scene.
- Keep all necessary argumentative meaning in copy; the image must not introduce an unsupported performance or physique claim.
- Prefer moments around real strength training: preparing a bar, gripping equipment, bracing before a Set, logging a completed Set, resting under visible effort, or moving through a credible Gym environment.
- Use bodies as evidence of effort and physical ambition, not as fabricated before/after proof or a promise that LIFT CODE produced the physique.
- Preserve product imagery intentionally selected as a fixed layer in the content project.

## Art direction and cross-image variation

The account-wide visual identity is `restrained wildness`: masculine physical force contained by deliberate training structure.

- Favor dark, high-contrast, near-black environments with controlled highlights, steel, rubber, chalk, worn leather, sweat, and believable Gym texture.
- Use one restrained signal color when useful; do not flood the image with multiple neon accents.
- Make strength feel heavy and immediate through loaded equipment, close physical detail, compressed space, and purposeful posture.
- Make control feel visible through clean framing, stable geometry, ordered equipment, repeated Set structure, measured preparation, and the absence of chaotic spectacle.
- Prefer grounded realism over glossy supplement advertising, superhero fantasy, luxury fitness campaigns, or generic motivational poster polish.
- When people are present, prioritize adult male lifters consistent with the primary audience unless approved meaning requires otherwise. Show unposed concentration, strain, preparation, or recovery rather than performative flexing for the camera.
- Do not require a face. Hands, forearms, back, torso, stance, equipment contact, and partial body crops can carry masculine physicality without turning every slide into a portrait.
- Vary the primary carrier across a slideshow: person, loaded implement, plates and increments, training log, machine stack, empty rack after effort, or another copy-relevant scene.
- Vary camera distance and angle across adjacent slides while maintaining the same controlled, dark visual world.
- Do not repeat one lifter, one rack, one object cluster, or one exact composition merely to manufacture consistency.

Before provider requests, assign each generated slot a distinct primary carrier, Gym setting, camera distance or angle, and dominant light treatment.

## Within-image composition

- Read the selected image layer's aspect ratio, placement, dimensions, and crop behavior; do not restate or own those layout values here.
- Compose for the final crop, with the decisive action or equipment detail inside the content-specific safe region.
- Protect copy space through simple local backgrounds and controlled negative space rather than empty studio backdrops.
- Keep the primary physical action immediately legible at slideshow size.
- Use one plausible Gym environment and only the elements needed to communicate the moment.
- Do not place essential anatomy, hands, plates, pin settings, or bar contact at crop edges.

## Runtime request constraints

Construct one provider request from approved meaning, art direction, composition, and the following exclusions. Use a plain semantic scene description instead of copying approved slide wording when possible.

Encode these constraints:

- no readable captions, labels, logos, watermarks, or unapproved brand marks;
- no fake LIFT CODE interface or unapproved product UI;
- no visual claim that LIFT CODE already exists, has users, or produced a depicted result;
- no fabricated before/after transformation;
- no copied reference subject, composition, signature, or distinctive expression;
- no collage, split screen, or multiple competing scenes unless explicitly required by approved content and layout;
- no glossy stock-fitness advertising, supplement-ad aesthetic, stage lighting, or showroom perfection;
- no cartoonish aggression, roaring stereotype, weapon imagery, violence, domination of another person, or sexualized humiliation;
- no hacker, terminal, source-code, cyberpunk, or Matrix imagery used to literalize `CODE`;
- no impossible plates, malformed barbell, broken cable path, unusable machine geometry, unsafe rack setup, or obvious anatomy defect;
- no synthetic plastic skin, excessive sharpening, implausible symmetry, impossible lighting, or over-rendered muscle detail.

These exclusions guide provider requests. They do not authorize subjective selection or another paid generation after a technically usable image has been returned.

## Generation and selection policy

- Execution surface: the currently configured Hermes image-generation tool.
- Backend, provider, model, and credential resolution belong to the active Hermes tool/profile configuration and are not duplicated here.
- If the active tool does not expose a request parameter, do not pretend this file can select it.
- Successful results per eligible slot: exactly `1`.
- Subjective selection: none.
- Subjective regeneration: none.
- Final embedded format: PNG.
- Source aspect ratio or size: choose one supported option after content-specific image geometry is selected.
- Embed the first technically usable provider PNG bytes as returned. Do not resize, downscale, recompress, or convert generated imagery merely to reduce Project JSON or storage size.
- Maximum technical retries after the initial request: `3`.
- Maximum total attempts per eligible slot: `4`.

A technical failure means no usable image payload was returned because of transport or API failure, empty response, undecodable payload, or invalid output format or dimensions. Retry only such failures. The first technically usable image ends the attempt sequence even when its aesthetics or adherence to non-safety details are imperfect.

## Rationale

LIFT CODE must attract men through physical ambition and controlled aggression while earning recommendation trust through precision, restraint, and visible training reality. The imagery therefore cannot be only feral, only clinical, or only motivational. It should make force feel real and system feel necessary without pretending an unbuilt product has already produced results.