# env Marketing Loop

## Scope

- This repository exists to produce increasingly viral organic TikTok slideshow content for `env` through autonomous, evidence-driven improvement.
- The two primary optimization axes are message strategy and copywriting format.
- **Message strategy** decides what perception or belief should change and how the audience is persuaded.
- **Copywriting format** is the template-coupled system for expressing that message: hook function, wording, specificity, slide roles, information order, rhythm, image-text relationship, product reveal, and caption.
- `renderer/slideshow/templates/*.json` implements the fixed slideshow structure; `formats/<format-id>/guide.md` owns the copywriting grammar and adaptation reasoning tied to that structure.
- `renderer/slideshow/` owns only slideshow templates, required visual assets, editable project JSON, editor code, and rendered images.
- Do not place marketing context, message strategy, format-copy knowledge, content records, or performance data under `renderer/`.

## Decision rights

The assistant operates the content loop autonomously. Any user message that expresses an intent to create content starts the workflow; no fixed phrase, problem statement, situation, hook, or direction is required.

The assistant independently selects:

- the problem and situation to address;
- hook and content direction;
- core perspective and product exposure;
- experiment objective, fixed elements, and changed elements;
- the `renderer/slideshow` template;
- the copy approach.

Base those decisions on project context, unresolved learning, the live renderer templates, and relevant DB performance. Do not ask the user to approve the direction, experiment boundary, or template choice.

The user controls:

- final copy approval;
- whether the final visual project is publication-ready;
- TikTok publication.

Ask for information only when a missing fact would materially affect product truth, audience fit, or the ability to produce a valid final copy. Do not publish to TikTok, commit changes, delete data, or contact anyone without explicit instruction.

## Required context before creating content

1. Read the relevant files in `context/`.
2. Review available message hypotheses in `messages/`.
3. Review the relevant `formats/<format-id>/guide.md` and its stored reference images.
4. Inspect the live templates in `renderer/slideshow/templates/`; never rely on duplicated layout notes.
5. Read `learning.md` for unresolved recurring candidates.
6. Query SQLite for relevant final content, experiments, and results.
7. Ask only for missing information that would materially affect product truth, audience fit, or valid copy.
8. Independently select one problem, situation, message, format-copy approach, experiment boundary, and renderer template.
9. Draft to the selected template’s actual editable text slots and constraints.

## Content workflow

1. Any user message expressing an intent to create content starts the workflow; no fixed command phrase or user-supplied problem, situation, hook, or direction is required.
2. The assistant reads the project context, message hypotheses, format-copy guides and references, unresolved learning, live renderer templates, and relevant DB history.
3. The assistant independently selects the problem, situation, message, format-copy approach, product exposure, experiment boundary, and `renderer/slideshow` template.
4. Ask the user only if a missing fact blocks truthful, audience-appropriate, or valid copy.
5. The assistant drafts, evaluates, and improves the copy internally against the selected format-copy grammar and the template’s actual text slots.
6. Show only the refined final-copy proposal to the user, including the slide copy and caption. The template choice may be disclosed for context but is not a separate approval gate.
7. Revise the working copy from user feedback. Do not persist intermediate copy versions.
8. When the user approves the final copy, create an editable content JSON with the already-selected template under `renderer/slideshow/contents/`; this does not create a content DB record.
9. The user fine-tunes that content project and provides its path inside `renderer/slideshow/contents/` as the publication-ready final.
10. Record the exact final content, final project path and hash, message ID, format/template identity, and experiment context in SQLite.
11. Render the exact final project and deliver its images with the approved caption to Telegram when explicitly requested.
12. The user publishes manually to TikTok and provides the post URL.
13. Connect the URL and publication time, then collect performance at 24, 48, and 72 hours.
14. Review observed results separately from interpretations.

If the previous final content has no TikTok URL, ask naturally at the start of the next relevant conversation. Do not create a separate reminder by default.

## Ownership

- Verified product facts and claim boundaries: `context/product.md`
- Audience facts and labeled assumptions: `context/audience.md`
- User language and provenance: `context/user-language.md`
- Brand-wide English voice and cross-format language constraints: `context/voice.md`
- Persuasion hypotheses and evidence-backed message strategy: `messages/msg-*.md`
- Template-coupled copywriting grammar, reference evidence, and adaptation reasoning: `formats/<format-id>/`
- Repeated but not-yet-promoted lesson candidates: `learning.md`
- Final content, publication details, performance, and content-level interpretation: `db/marketing.sqlite`
- SQLite structure: `db/schema.sql`
- Agent identity: `~/.hermes/profiles/marketing-env/SOUL.md`
- Approved compact profile-level lessons: `~/.hermes/profiles/marketing-env/memories/MEMORY.md`
- Reusable multi-step procedures: Hermes skills
- Layout, slide count, typography, geometry, editable layers, and rendered media: `renderer/slideshow/`
- Reusable template JSON: `renderer/slideshow/templates/`
- Editable content project JSON: `renderer/slideshow/contents/`

Do not duplicate one fact, rule, layout value, or result across owners.

## Renderer boundary

- Read the live renderer template before generating a project.
- Read templates from `renderer/slideshow/templates/` and write generated editable content only to `renderer/slideshow/contents/`.
- The renderer template owns slide count, order, canvas, coordinates, dimensions, typography, colors, image crop, and editable properties.
- The matching format guide owns hook function, slide-copy roles, progression, rhythm, information density, image-copy relationship, product reveal, and caption approach.
- `formats/` must not restate renderer coordinates or other JSON implementation values.
- Store the exact template path and SHA-256 with final content so later template edits do not obscure what was used.
- Do not modify renderer code or templates unless the user explicitly requests it.

## Reference evidence

- The user decides which references qualify as viral; do not ask for or store source URL, account, capture date, or post performance.
- Store durable reference screenshots under `formats/<format-id>/references/` in the exact slide order designated by the user, using numeric filenames such as `1.png`, `2.png`, `3.png`, and `4.png`.
- References support later re-analysis of hook hierarchy, slide roles, copy density, progression, and image-text relationships.
- Reference screenshots are evidence, not renderer assets. Do not use them as production imagery unless the user separately adds them to `renderer/slideshow/public/assets/` for that purpose.
- A user-designated viral reference does not automatically validate the env adaptation, and its wording, subject matter, and distinctive expressions must not be copied.

## Evidence and claims

- Do not invent product features, user evidence, performance results, scientific support, or private TikTok metrics.
- Keep observed metrics separate from hypotheses and interpretations.
- Treat desk research as a demand signal, not verified env-user language.
- Treat references as evidence of structure, rhythm, and technique. Never copy their wording, subject matter, or distinctive expressions.
- Prefer limited claims grounded in `context/product.md`.

## Learning and promotion

- Apply one-off feedback to the current content without turning it into a permanent rule.
- Add an item to `learning.md` only when it has meaningful cross-content evidence or a repeated correction but is not yet approved for promotion.
- Each candidate must state scope, supporting content IDs or correction references, uncertainty, next evidence needed, and intended final owner.
- When the user approves a lesson, move it to exactly one final owner and remove it from `learning.md`.
- Use `MEMORY.md` only for compact, approved, high-value lessons that should be present in every `marketing-env` session and do not already belong to a more specific project owner.
- Use a skill for repeatable procedures, not marketing facts or one-off preferences.

## Keep the system small

Do not add:

- n8n or Docker workflow infrastructure;
- workflow builders or AI node chains;
- prompt-composition systems;
- fixed generation stages such as final-copy, polish, or normalize;
- generic registries;
- multi-app abstractions;
- automatic TikTok publishing;
- draft or approval content directories;
- package scripts or durable helper code unless repeated real usage proves they are necessary.
