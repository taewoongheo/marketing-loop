# env Marketing Loop

## Scope

- This repository exists to produce increasingly viral organic TikTok slideshow content for `env` through autonomous, evidence-driven improvement.
- The two primary optimization axes are message and copywriting.
- **Message strategy** decides what perception or belief should change and how the audience is persuaded.
- **Copywriting** decides how the message is expressed inside the fixed format: hook wording, specificity, information density, rhythm, product reveal, CTA, and caption.
- The user controls the fixed format and renderer template because frequent format changes would weaken the account's brand consistency. Format is an execution condition, not a hypothesis axis.
- `renderer/slideshow/templates/<format-id>/` is one format package: `template.json` implements the fixed slideshow structure, `copywriting/v<version>.md` stores immutable used versions of the language grammar, `imagery/v<version>.md` stores immutable used versions of visual expression and image-generation guidance, optional `materials.md` owns pre-approved content inputs required by that format, and `references/` stores the ordered reference evidence.
- `renderer/slideshow/` owns format packages, required visual assets, editable project JSON, editor code, and rendered images.
- Do not place project-wide product context, general raw user-language evidence, message strategy, content records, or performance data under `renderer/`. A format package may contain its own approved content inputs in `materials.md` without becoming the owner of project-wide evidence.

## Decision rights

The assistant autonomously analyzes the content loop and proposes the day's hypothesis actions. Any user message that expresses an intent to create content starts the workflow; no fixed phrase, problem statement, situation, hook, or direction is required.

The assistant independently selects:

- the problem and situation to address;
- hook and content direction;
- core perspective and product exposure;
- the recommended hypothesis actions and daily content allocation across active leaves;
- the copy approach.

Base those recommendations on project context, the current fixed renderer template, the hypothesis lineage, and relevant DB performance. Do not ask the user to choose the evaluation criteria or develop the hypothesis direction, but obtain confirmation before applying the day's hypothesis actions.

The user controls:

- confirmation or revision of the day's hypothesis actions: continue a leaf, close a leaf, create root or child hypotheses, adopt a supported hypothesis into its final owner, and allocate content across active leaves;
- final copy approval;
- whether the final visual project is publication-ready;
- adding or changing the fixed format and renderer template;
- TikTok publication.

Ask for information only when a missing fact would materially affect product truth, audience fit, or the ability to produce a valid final copy. Do not publish to TikTok, commit changes, delete data, or contact anyone without explicit instruction.

## Required context before creating content

1. Read product truth and user-language evidence in `context/`.
2. Review available versioned message definitions in `messages/`.
3. Review the relevant format package's selected `copywriting/v<version>.md`, selected `imagery/v<version>.md` when managed imagery is used, optional `materials.md`, and stored reference images.
4. Inspect the live templates in `renderer/slideshow/templates/`; never rely on duplicated layout notes.
5. Read `docs/hypothesis-loop.md` and query SQLite for active leaves, relevant ancestors, generated content, and results.
6. Ask only for missing information that would materially affect product truth, audience fit, or valid copy.
7. Prepare the day's hypothesis-action and allocation proposal, then obtain user confirmation before creating or closing nodes, promoting a supported rule, or assigning content.
8. Apply the confirmed hypothesis actions and draft to the current fixed template’s actual editable text slots and constraints.

## Content workflow

1. Any user message expressing an intent to create content starts the workflow; no fixed command phrase or user-supplied problem, situation, hook, or direction is required.
2. The assistant reads product truth, user-language evidence, `docs/hypothesis-loop.md`, message definitions, format-specific copywriting and imagery rules, optional approved materials, references, the fixed live template, and relevant DB lineage and results.
3. Collect due 24h, 48h, and 72h results. When evaluating a leaf, read detailed ancestry back to the nearest 72h-complete ancestor and reintroduce older late corrections when present.
4. Independently evaluate whether to continue an active leaf, create one or more root or child hypotheses, close a leaf, or adopt a supported hypothesis, and recommend the requested `n`-content allocation.
5. Present the concise daily hypothesis-action proposal and wait for user confirmation or revision. Do not mutate hypothesis lineage, close a branch, update a durable owner from performance evidence, or assign new content before confirmation.
6. Apply the confirmed hypothesis actions and allocation. A hypothesis may generate several contents; one parent may generate any number of child hypotheses.
7. Independently select the problem, situation, message, content direction, product exposure, and copy approach inside the confirmed hypothesis plan and user-controlled fixed format.
8. Ask the user only if a missing fact blocks truthful, audience-appropriate, or valid copy.
9. Draft, evaluate, and improve the copy internally using the current format's approved materials when present and against its selected copywriting version and live template slots.
10. Show only the refined final-copy proposal, including slide copy and caption, then revise it from every user feedback without persisting intermediate versions. Infer the narrowest reusable scope of the feedback and update its proper owner immediately when it changes durable guidance.
11. When the user approves the final copy, create an editable project under `renderer/slideshow/contents/`. When managed imagery is selected, read the approved project copy, live image slots, and selected imagery version together, then generate each eligible image exactly as that imagery version specifies. Project creation and image generation do not create a content DB record.
12. The user fine-tunes that project and identifies the publication-ready final.
13. Record the content under the hypothesis that generated it, together with message identity/version, format identity, copywriting version, nullable imagery version, fixed template identity, caption, and final project path and hash.
14. Render or deliver the exact final project only when explicitly requested. For Telegram delivery of a slideshow ZIP, extract its PNG slides and send them in exact slide order as one document media group so Telegram preserves the original bytes and presents one grouped download; do not send the ZIP itself, send separate document messages, or use compressed photo delivery unless the user explicitly requests it. Attach the approved post title followed by the approved caption—description plus tags—to the first slide in the group. The user publishes manually and provides the TikTok URL.
15. Resolve the supplied TikTok URL to one publication-ready content before writing anything. A URL-only message may be linked automatically only when the conversation and the set of publication-ready contents without URLs identify exactly one clear candidate. If no candidate or several plausible candidates remain, ask which content was published and do not record the URL or `published_at` until the user resolves it.
16. Once the content identity is certain, record the URL and `published_at` together, then collect results at 24, 48, and 72 hours. Keep observations separate from interpretations.

If the previous final content has no TikTok URL, ask naturally at the start of the next relevant conversation. Do not create a separate reminder by default.

## Ownership

- Verified product facts and claim boundaries: `context/product.md`
- Project-wide collected user-language expressions and provenance only: `context/user-language.md`
- Versioned target situation, problem pattern, belief shift, persuasion logic, resistance and response, product role, and evidence limits: `messages/msg-<message-name>/v<version>.md`; use the descriptive `msg-` name as the message ID without a numeric sequence.
- All template-coupled wording, empathy technique, voice, hook, progression, density, product reveal, CTA, title, caption, language evidence, and adaptation reasoning: immutable used versions under `renderer/slideshow/templates/<format-id>/copywriting/v<version>.md`
- All template-coupled visual tone, image-copy relationship, slide-role visualization, composition, cross-slide consistency, prompt adaptation, image-generation settings, visual exclusions, and visual evidence: immutable used versions under `renderer/slideshow/templates/<format-id>/imagery/v<version>.md`
- Pre-approved content inputs required by one format, with a structure defined only by that format: optional `renderer/slideshow/templates/<format-id>/materials.md`
- Hypothesis branching, delayed-evidence traversal, and active-leaf operation: `docs/hypothesis-loop.md`
- Hypothesis nodes, generated content, publication details, results, and evidence links: `db/hypothesis-loop.sqlite`
- SQLite structure: `db/schema.sql`
- Agent identity: `~/.hermes/profiles/marketing-env/SOUL.md`
- Adopted compact profile-level lessons: `~/.hermes/profiles/marketing-env/memories/MEMORY.md`
- Reusable multi-step procedures: Hermes skills
- Layout, slide count, typography, geometry, editable layers, and rendered media: `renderer/slideshow/`
- Reusable template JSON: `renderer/slideshow/templates/`
- Editable content project JSON: `renderer/slideshow/contents/`

Do not duplicate one fact, rule, layout value, or result across owners.

## Renderer boundary

- Read the live renderer template before generating a project.
- Read each format package from `renderer/slideshow/templates/<format-id>/` and write generated editable content only to `renderer/slideshow/contents/`.
- The renderer template owns slide count, order, canvas, coordinates, dimensions, typography, colors, image crop, and editable properties.
- The selected copywriting version owns hook function, slide-copy roles, progression, rhythm, information density, reader relationship, product reveal, CTA, title, and caption approach.
- The selected imagery version owns visual tone, image-copy coordination, semantic slide-role adaptation, composition, cross-slide consistency, prompt construction, generation settings, and visual exclusions. It consumes approved copy and live template slots at generation time without owning or duplicating either one.
- Optional `materials.md` owns the approved content inputs available to that format. It must not own message strategy, product truth, wording rules, layout, or final slide copy, and no common materials schema is imposed across formats.
- A copywriting version must not restate coordinates or other `template.json` implementation values even though both are colocated.
- Store the exact template path and SHA-256 with final content so later template edits do not obscure what was used.
- Do not modify renderer code or templates unless the user explicitly requests it.

## Reference evidence

- The user decides which references qualify as viral; do not ask for or store source URL, account, capture date, or post performance.
- Store durable reference screenshots under `renderer/slideshow/templates/<format-id>/references/` in the exact slide order designated by the user, using numeric filenames such as `1.png`, `2.png`, `3.png`, and `4.png`.
- References support later re-analysis of hook hierarchy, slide roles, copy density, progression, and image-text relationships.
- Reference screenshots are evidence, not renderer assets. Do not use them as production imagery unless the user separately adds them to `renderer/slideshow/public/assets/` for that purpose.
- A user-designated viral reference does not automatically validate the env adaptation, and its wording, subject matter, and distinctive expressions must not be copied.

## Evidence and claims

- Do not invent product features, user evidence, performance results, scientific support, or private TikTok metrics.
- Keep observed metrics separate from hypotheses and interpretations.
- Treat desk-research language as low-confidence language evidence, not testimony.
- Treat references as evidence of structure, rhythm, and technique. Never copy their wording, subject matter, or distinctive expressions.
- Prefer limited claims grounded in `context/product.md`.

## Feedback and durable learning

- Apply every user feedback to the current content, including one-off feedback.
- Infer the narrowest scope that preserves the feedback's meaning. Do not turn a content-specific edit into a universal rule, but do not discard a reusable correction merely because it appeared once.
- When feedback changes durable guidance, update exactly one proper owner immediately. Replace or narrow conflicting guidance instead of appending a contradictory rule.
- Product corrections belong in `context/product.md`; general expression or provenance corrections in `context/user-language.md`; changes to a format's approved content pool in its `materials.md`; target-situation, belief, resistance, and persuasion changes in the selected message version; every wording, voice, empathy, hook, progression, rhythm, reveal, CTA, title, and caption rule in the selected copywriting version; every visual tone, image-copy, composition, consistency, prompt-adaptation, model, quality, generation-count, and visual-exclusion rule in the selected imagery version; project operating rules in `AGENTS.md`.
- A message, copywriting, or imagery version may be refined in place until a content record references it. After first use, its generation-affecting meaning is immutable: a durable change creates the next version, while a content-specific edit remains only in the final content artifact. Do not create a new version for formatting, evidence-only corroboration, or wording cleanup that cannot change future generation decisions.
- A message, copywriting, or imagery version change does not by itself create a hypothesis node. Record the exact selected versions on each content row; several contents generated by one hypothesis may therefore reference different copywriting or imagery versions while testing that hypothesis. The hypothesis loop still has only `message` and `copywriting` axes: create a child only when eligible performance evidence supports a distinct claim on one of those axes and the user confirms it, never merely because a version number increased. Imagery remains a user-controlled format execution condition unless the project explicitly adopts it as a hypothesis axis later.
- A content-specific correction remains embodied in the approved final content and does not need a separate durable feedback log.
- The assistant autonomously judges whether performance evidence operationally supports a hypothesis. Two or more directly generated contents showing a consistent relevant signal are a useful default promotion signal, not a mechanical threshold; account for checkpoint maturity, comparison quality, metric relevance, confounders, sample diversity, limitations, and contradictory evidence.
- Present operational adoption as part of the daily hypothesis-action proposal. Once the user confirms it, update the one proper final owner directly. Keep the underlying observations, interpretations, and lineage in SQLite; do not duplicate them in a learning inbox.
- Later conflicting feedback or evidence may replace, narrow, or reverse a promoted rule in a new message, copywriting, or imagery version. Preserve used versions and historical database evidence rather than rewriting history.
- Use `MEMORY.md` only for compact, adopted, high-value lessons that should be present in every `marketing-env` session and do not already belong to a more specific project owner.
- Use a skill for repeatable procedures, not marketing facts or content-specific preferences.

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
