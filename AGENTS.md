# LIFT CODE Marketing Loop

## Scope

- This repository pursues three simultaneous goals: continuously improve message strategy, continuously improve copywriting, and grow the LIFT CODE TikTok account to 1,000 followers.
- Across those goals, the marketing mission is to make the target audience aware of LIFT CODE and build justified trust that its planned weight-and-rep recommendations are worth following.
- During the current prelaunch phase, TikTok content does not mention or promote the app or its planned capabilities. It earns relevant audience attention and trust through useful strength-training content while growing the LIFT CODE account; product exposure begins only after launch or an explicit user change to this rule.
- Message and copywriting improvement are open-ended goals with no terminal threshold. They remain the only hypothesis axes.
- The 1,000-follower target is a finite account-level outcome that message and copywriting improvements should support. Observe follower movement separately; never treat it by itself as proof that either axis caused the change.
- Reaching 1,000 followers completes that finite goal but does not stop scheduled production; continue improving message and copywriting until the user changes or stops the scheduler job.
- This is a personal-use, non-deployed workspace. When the user authorizes a structural change, prefer direct restructuring over backward-compatible migrations, legacy schemas, or compatibility artifacts.
- The two primary optimization axes are message and copywriting.
- **Message strategy** decides what perception or belief should change and how the audience is persuaded.
- **Copywriting** decides how the message is expressed: hook wording, specificity, information density, rhythm, product reveal, CTA, and caption.
- Every content uses exactly one `medium`: `slideshow` or `video`. The assistant selects the medium and one format within it from the current hypothesis plan, project context, available evidence and assets, prior content records, and execution fit.
- Visual and audiovisual composition is not template-driven. The assistant designs each content project from the selected format's designated references, approved copy, current imagery guidance, and up to three retained same-medium same-format execution examples.
- `context/imagery.md` owns the current app/account-wide image tone, content rules, runtime request constraints, and generation/selection policy. It is updated in place from user direction and is not versioned because imagery is not a hypothesis axis.
- `context/expertise.md` defines the rules and index for project-wide strength-training knowledge; admitted knowledge and provenance live in topic files under `context/expertise/`.
- `renderer/<medium>/formats/<format-id>/copywriting/v<version>.md` stores immutable used versions of that format's language grammar, `references/` stores its ordered raw execution evidence, and `contents/` stores editable projects generated in that format.
- `renderer/<medium>/formats/<format-id>/` is an evidence and content namespace, not a reusable coordinate, timeline, or scene template. Each project records its `formatId` and owns its complete content-specific execution.
- `renderer/slideshow/` and `renderer/video/` each own only their medium's editor, project validation and storage mechanics, render implementation, format-scoped local projects, required local assets, and rendered outputs. They do not choose the medium, format, message, or content direction and own no reusable template or format JSON.
- Do not place project-wide product context, domain expertise, general raw user-language evidence, message strategy, content records, or performance data under `renderer/`.

## Decision rights

The assistant autonomously analyzes the content loop and proposes the day's hypothesis actions. Any user message that expresses an intent to create content starts the workflow; no fixed phrase, problem statement, situation, hook, or direction is required.

The assistant independently selects:

- the problem and situation to address;
- `slideshow` or `video`, then one available format within that medium;
- hook and content direction;
- core perspective and, when the current launch phase permits it, product exposure;
- the complete text, image, motion, timing, and audio composition applicable to each project;
- the recommended hypothesis actions and daily content allocation across active leaves;
- the copy approach.

Base hypothesis recommendations on project context, the hypothesis lineage, and relevant DB performance. Medium and format selection may use content fit, available evidence and assets, recent execution diversity, and observed distribution performance as operational inputs. Medium, format, imagery, layout, crop, motion, timing, and audio remain execution variables rather than hypothesis axes and must not be used to weaken, defer, branch, close, or adopt a message/copywriting hypothesis. Use designated references and retained same-medium same-format Project JSON only as execution evidence. Do not ask the user to choose the evaluation criteria or develop the hypothesis direction, but obtain confirmation before applying the day's hypothesis actions.

The user controls:

- confirmation or revision of the day's hypothesis actions: continue a leaf, close a leaf, create root or child hypotheses, adopt a supported hypothesis into its final owner, and allocate content across active leaves;
- final copy approval;
- whether the final visual project is publication-ready;
- adding, ordering, or removing the designated reference evidence;
- TikTok publication.

Ask for information only when a missing fact would materially affect product truth, audience fit, or the ability to produce a valid final copy. Do not publish to TikTok, commit changes, delete data, or contact anyone without explicit instruction.

### Scheduled autonomous production

Recurring content-generation cron runs operate under standing user authorization and are the exception to the interactive hypothesis-confirmation, copy-approval, and publication-ready designation gates below. They advance all three project goals while preserving truthful claims and the existing repository structure. The scheduler job is the sole owner of exact run times and delivery routing; do not duplicate its schedule here.

Production may start only during the exact cron minute configured on its scheduler job. A delayed or wake-time catch-up trigger outside a configured production minute must be suppressed before the agent starts: create no content, mutate no project or database owner, render nothing, and deliver nothing. A missed production slot is abandoned and production resumes at the next configured slot. This restriction applies only to content production; the shared delayed-metric collector retains its own due-check and catch-up behavior.

For each scheduled run, the assistant may autonomously read newly collected evidence, continue or close leaves, create root or child hypotheses, adopt supported rules into their proper owners, allocate one content, admit bounded sourced domain knowledge to the relevant topic file under `context/expertise/` according to `context/expertise.md`, refine unused message or copywriting versions, create new messages, and create new immutable versions when used guidance changes. These changes must stay inside the current owner map and schema; scheduled autonomy does not authorize repository restructuring, new workflow infrastructure, TikTok publication, or unrelated work.

After a scheduled cycle has produced and verified its publication-ready content and updated all proper owners, commit and push only its tracked repository-owner changes. Project JSON under `contents/` and the runtime SQLite database are local Git-ignored artifacts: never force-add them. If the cycle changed no tracked owner file, do not create an empty commit. Capture the pre-run working tree first, stage only exact tracked files created or changed by the cycle, and never include unrelated or pre-existing user changes. If the cycle must modify a tracked file that was already dirty, stop and report the conflicting path through Telegram instead of absorbing it. Use a new commit for later rejection-driven revisions; do not amend or rewrite pushed history. Report commit or push failures through Telegram and preserve the local verified artifact.

The shared delayed-metric collector is the sole scheduled owner of due 24h, 48h, and 72h public checkpoint retrieval. Production runs read normalized stored results and do not fetch due content metrics again. Account follower observations use a separate low-frequency cadence: reuse the latest `account_results` row when it is less than 24 hours old, and refresh it only after that interval has elapsed.

After a scheduled cycle has successfully delivered and recorded its new content, prune local same-medium same-format Project JSON that was not selected as one of that cycle's Project execution examples, except DB-linked projects whose `tiktok_url` is still NULL and the newly delivered project. Prune video assets only when no retained video project references them. This is standing authorization to delete only those exact local Project JSON and unreferenced asset files. Never delete content rows, results, reference evidence, or the current editable/rejection target. Project pruning is storage hygiene, not hypothesis evidence mutation.

When a scheduled run judges that an additional Hermes skill, plugin, package, API-backed integration, or other external capability is materially needed, it may inspect and install that capability without advance approval. Admit only the narrow missing operational capability: do not install anything that creates a parallel owner for product truth, messages, copywriting, imagery, hypotheses, content records, or publication, and do not install automatic TikTok publishing. Inspect source, trust, credentials, network calls, cost, telemetry, generated files, and side effects before installation. After any installation, report through Telegram what was installed, its source, why it was needed, and any ongoing cost, credential requirement, or material side effect. If installation cannot succeed without a new credential or structural change, request that exact user action through Telegram instead of bypassing the boundary.

The assistant autonomously selects a medium and format, then drafts, creates, validates, renders, records, and sends one publication-ready TikTok content to the configured Telegram destination. The user publishes it manually. A delivered content row remains unpublished until a TikTok URL is received; the receipt time of that URL is `published_at`. If a previously delivered content has no URL, ask for it in the next scheduled Telegram update without blocking the next content run. If the user rejects a delivered post, apply the feedback, revise or regenerate the same unpublished content and project, update its exact medium-specific copy snapshot, caption, and checksum, and redeliver it rather than creating another content identity. If credentials, unavailable product truth, or a structural change blocks valid completion, explain the exact blocker and required user action through Telegram instead of guessing or changing the structure.

After a successful medium-appropriate delivery, suppress the scheduler's separate text response by returning exactly `[SILENT]`; the delivered media is the success notification. Send a scheduler text response only when user action is required, such as a blocker, failure, or missing publication URL, and keep it to one concise line containing only the essential action. Do not send routine hypothesis, version, hash, path, metric, verification, commit, or follower details in the scheduler response; their proper owners retain that evidence, while local cron output retains the execution audit.

## Required context before creating content

1. Read product truth, `context/expertise.md`, relevant admitted topic files under `context/expertise/`, user-language evidence, and the current account-wide imagery guidance in `context/`. When content uses a specific Exercise or training structure, also read the relevant linked detail under `context/product-details/`.
2. Review available versioned message definitions in `messages/`.
3. Read `docs/hypothesis-loop.md` and query SQLite for active leaves, relevant ancestors, generated contents, their `medium` and `format_id`, and normalized results.
4. Inventory the available format namespaces under both `renderer/slideshow/formats/` and `renderer/video/formats/`. A medium with no valid format is unavailable for that run.
5. Select exactly one medium and format for each allocated content from the approved hypothesis plan, message and copy needs, available references and production assets, execution feasibility, recent medium/format diversity, and relevant DB observations. Performance may inform operational distribution but never turns medium or format into a hypothesis axis.
6. Review the selected `renderer/<medium>/formats/<format-id>/copywriting/v<version>.md` and all designated evidence in its `references/` directory.
7. Inventory available same-medium same-format Project JSON under `contents/` as Project execution candidates. Publication status, hypothesis lineage, message/copywriting versions, and performance do not make a candidate execution-authoritative. A missing historical DB-linked project is expected after pruning because SQLite permanently retains the exact medium-specific copy snapshot.
8. Ask only for missing information that would materially affect product truth, audience fit, medium feasibility, or valid copy.
9. Prepare the day's hypothesis-action and allocation proposal, then obtain user confirmation before creating or closing nodes, promoting a supported rule, or assigning content.
10. Apply the confirmed hypothesis actions and create the selected medium's native project from the approved evidence.

Before opening prior Project JSON, select at most three same-medium same-format projects solely as execution examples. Select from metadata, file validity, composition relevance to the current approved copy, recency, and cross-project execution diversity. Do not rank or select them by hypothesis lineage, message/copywriting identity, publication status, or performance. Three is a maximum, not a target; do not add a weaker candidate merely to fill the count.

Never load embedded image bytes or video/audio payloads from prior projects into the reasoning context. Extract only bounded execution metadata appropriate to the medium—text roles and lengths, typography, geometry, image dimensions/crops, timeline structure, clip and text timing, asset metadata, and checksums—and inspect rendered contact sheets, frames, or playback only as needed. Prior wording is not copy input. Full media bytes may pass only through file, render, validation, and media-inspection tools. Query and aggregate normalized SQLite metrics for all relevant contents, but read `raw_json` only when verifying provenance, diagnosing a collection problem, or reintroducing a late correction.

## Content workflow

1. Any user message expressing an intent to create content starts the workflow; no fixed command phrase or user-supplied problem, situation, hook, or direction is required.
2. The assistant reads product truth, project-wide domain expertise, user-language evidence, current account-wide imagery guidance, `docs/hypothesis-loop.md`, message definitions, available medium/format namespaces, and relevant DB lineage and results.
3. Read newly collected 24h, 48h, and 72h results. When evaluating a leaf, read detailed ancestry back to the nearest 72h-complete ancestor and reintroduce older late corrections when present.
4. Independently evaluate whether to continue an active leaf, create one or more root or child hypotheses, close a leaf, or adopt a supported hypothesis, and recommend the requested `n`-content allocation.
5. Present the concise daily hypothesis-action proposal and wait for user confirmation or revision. Do not mutate hypothesis lineage, close a branch, update a durable owner from performance evidence, or assign new content before confirmation.
6. Apply the confirmed hypothesis actions and allocation. A hypothesis may generate several contents; one parent may generate any number of child hypotheses.
7. Independently select the problem, situation, message, content direction, product exposure, medium, format, copy approach, and full medium-appropriate composition inside the confirmed hypothesis plan.
8. Ask the user only if a missing fact blocks truthful, audience-appropriate, or valid copy.
9. Read the selected format's copywriting version, all designated references, and only the selected at-most-three same-medium same-format Project examples. Draft, evaluate, and improve the copy internally using the relevant bounded knowledge admitted under `context/expertise/`, the selected message, product truth, and the selected copywriting version. If a needed domain claim is missing, follow `context/expertise.md`, research it, and admit it to the relevant topic file with provenance before using it rather than adding an ad-hoc tip directly to copy.
10. Show only the refined final-copy proposal and caption. For a slideshow, show the exact ordered text layers for every slide. For a video, show the exact ordered on-screen text and spoken text separately, explicitly showing an empty channel when unused. Revise from every user feedback without persisting intermediate versions. Infer the narrowest reusable scope of the feedback and update its proper owner immediately when it changes durable guidance.
11. When the user approves the final copy, create the native editable project under `renderer/<medium>/formats/<format-id>/contents/` with the same `formatId`. Derive recurring format characteristics separately from one-off execution and design the complete project without copying exact coordinates or timeline values. When managed imagery is selected, read the approved project copy and current `context/imagery.md`, choose content-specific geometry, then generate each eligible image accordingly. Project and asset creation do not create a content DB record.
12. The user fine-tunes that project and identifies the publication-ready final.
13. Record the content under the hypothesis that generated it, together with `medium`, format identity, message identity/version, copywriting version, the exact medium-specific copy snapshot, caption, and final project path and hash. Slideshow snapshots contain one non-empty text array per slide. Video snapshots contain ordered `on_screen_text` and `spoken_text` arrays; either or both may be empty.
14. Render or deliver the exact final project only when explicitly requested. For a slideshow, extract its PNG slides and send them in exact order as one Telegram document media group so Telegram preserves the original bytes; do not send the ZIP, separate documents, or compressed photos unless explicitly requested. For a video, send the exact rendered video file. Attach the approved post title followed by the approved caption—description plus tags—to the slideshow group's first document or the video message. The user publishes manually and provides the TikTok URL.
15. Resolve the supplied TikTok URL to one publication-ready content before writing anything. A URL-only message may be linked automatically only when the conversation and the set of publication-ready contents without URLs identify exactly one clear candidate. If no candidate or several plausible candidates remain, ask which content was published and do not record the URL or `published_at` until the user resolves it.
16. Once the content identity is certain, record the URL and `published_at` together; the shared collector then records results at 24, 48, and 72 hours. Keep observations separate from interpretations.

If the previous final content has no TikTok URL, ask naturally at the start of the next relevant conversation. Do not create a separate reminder by default.

## Ownership

- Product definition, user value, core mechanisms, reference-app differences, and boundaries: `context/product.md`
- Detailed product-supported Exercise and training structures used to validate content compatibility: `context/product-details/`
- Strength-training knowledge rules and index: `context/expertise.md`; admitted facts, mechanisms, practical applications, provenance, evidence status, and content-use limits: topic files under `context/expertise/`
- Project-wide collected user-language expressions and provenance only: `context/user-language.md`
- Versioned target situation, problem pattern, belief shift, persuasion logic, resistance and response, product role, and evidence limits: `messages/msg-<message-name>/v<version>.md`; use the descriptive `msg-` name as the message ID without a numeric sequence.
- All reusable medium-and-format-specific wording rules, empathy technique, voice, hook, progression, density, product reveal, CTA, title, caption, language interpretation of references, and adaptation reasoning: immutable used versions under `renderer/<medium>/formats/<format-id>/copywriting/v<version>.md`
- Current app/account-wide image tone, content selection, image-copy relationship, within-image composition, cross-image variation, runtime request constraints, and generation/selection policy: unversioned `context/imagery.md`
- Hypothesis branching, delayed-evidence traversal, and active-leaf operation: `docs/hypothesis-loop.md`
- Hypothesis nodes, generated content medium/format identities, exact final medium-specific copy snapshots, publication details, results, and evidence links: `db/hypothesis-loop.sqlite`
- SQLite structure: `db/schema.sql`
- Due public checkpoint selection, TikWM normalization, retry, and insertion mechanics: `scripts/collect_due_content_results.py`
- Agent identity: `~/.hermes/profiles/marketing-liftcode/SOUL.md`
- Adopted compact profile-level lessons: `~/.hermes/profiles/marketing-liftcode/memories/MEMORY.md`
- Reusable multi-step procedures: Hermes skills
- Ordered raw medium-specific execution evidence: `renderer/<medium>/formats/<format-id>/references/`
- While retained, exact content-specific visual or audiovisual execution: the native project and referenced local assets under the selected `renderer/<medium>/` namespace. The project materializes the DB-recorded final copy for editing and rendering but is not its permanent copy-evidence owner.

Do not duplicate one fact, rule, layout value, or result across owners.

## Renderer boundary

- A renderer receives an already selected medium, format, approved copy, and content-specific composition. It only reads, edits, validates, stores, and renders native projects; it never selects strategy, medium, format, or content direction.
- Neither renderer has a reusable coordinate, timeline, scene, or per-property lock template. Format folders own evidence and copywriting grammar, not reusable Project JSON.
- Write generated editable content only to `renderer/<medium>/formats/<format-id>/contents/` with a matching `formatId`. Project JSON and production assets are local Git-ignored artifacts; do not force-add them.
- `renderer/slideshow/src/projectValidation.ts` solely owns the slideshow Project JSON safety envelope. `renderer/video/src/projectValidation.ts` solely owns the video Project JSON safety envelope. In each renderer, editor loading, storage middleware, and render CLI must consume its owner rather than restating limits.
- A slideshow project owns its exact slide count and order, canvas, coordinates, dimensions, typography, colors, image crops and bytes, and editable layers.
- A video project owns its exact canvas, fps, clip order and trims, timeline positions and durations, crop and fit, typography, colors, audio layers and levels, and references to its local production assets. Referenced assets remain part of the retained execution and may be pruned only when no retained project uses them.
- The selected copywriting version owns hook function, medium-appropriate copy roles, progression, rhythm, information density, reader relationship, product reveal, CTA, title, and caption approach.
- `context/imagery.md` owns current account-wide semantic visualization, art direction, image-copy coordination, within-image composition, cross-image variation, runtime request constraints, generation/selection policy, and visual exclusions. It consumes approved copy and content-specific geometry without owning or duplicating either one.
- The assistant derives the content-specific provider request transiently from approved copy, selected geometry, and `context/imagery.md`. Do not persist it as a separate artifact. The active Hermes image tool/profile solely owns backend/model configuration and credential resolution. The reusable image-generation procedure solely owns invocation, retry, decoding, project mutation, and verification mechanics; credential values belong only in the ignored secret environment.
- `context/expertise.md` and its topic files under `context/expertise/` are global across formats and platforms. A format may define how to express relevant expertise but must not duplicate or become a second owner of the underlying domain knowledge.
- A copywriting version must not restate project coordinates or content-specific geometry.
- Do not modify renderer code unless the user explicitly requests it.

## Reference evidence

- The user decides which references qualify as viral; do not ask for or store source URL, account, capture date, or post performance.
- Store durable raw evidence under `renderer/<medium>/formats/<format-id>/references/<post-id>/`. Slideshow posts use numerically named screenshots in exact slide order. Video posts use the designated source video or numerically named frame evidence in playback order.
- References are the primary execution-grammar evidence. Slideshow evidence supports slide roles, image-text relationships, visual area, whitespace, crop, and cross-slide rhythm. Video evidence supports hook timing, shot and text progression, framing, motion, pacing, transitions, and audio-text relationships.
- Before creating a slideshow, inspect each reference post through one transient ordered contact sheet and open a full-resolution slide only when selected or illegible. Before creating a video, inspect a bounded storyboard/contact sheet for every reference and play or sample the full-resolution source only when selected or when timing or audio cannot otherwise be evaluated. Delete transient inspection artifacts after review.
- Use one primary reference-derived composition principle per slide or video sequence rather than blending several posts into one execution. Review the full render against the reference family and revise work that merely repeats recent contents or drifts outside it.
- Retained same-medium same-format Project JSON is secondary execution evidence only. Use recurring composition patterns and renderer feasibility without treating publication, hypothesis lineage, or performance as execution validation; never promote incidental coordinates or timeline values into a reusable rule or hidden template.
- Reference files are raw evidence, not production assets. Copywriting versions and `context/imagery.md` may own their separate language and image interpretations. Do not use reference media in production unless the user separately designates it as a production asset.
- A user-designated viral reference does not automatically validate the LIFT CODE adaptation, and its wording, subject matter, and distinctive expressions must not be copied.

## Evidence and claims

- Do not invent product features, user evidence, performance results, scientific support, or private TikTok metrics.
- Keep observed metrics separate from hypotheses and interpretations.
- Treat desk-research language as low-confidence language evidence, not testimony.
- Treat references as evidence of structure, rhythm, and technique. Never copy their wording, subject matter, or distinctive expressions.
- Prefer limited claims grounded in `context/product.md` and, when relevant, its linked `context/product-details/` owner.

## Feedback and durable learning

- Apply every user feedback to the current content, including one-off feedback.
- Infer the narrowest scope that preserves the feedback's meaning. Do not turn a content-specific edit into a universal rule, but do not discard a reusable correction merely because it appeared once.
- When feedback changes durable guidance, update exactly one proper owner immediately. Replace or narrow conflicting guidance instead of appending a contradictory rule.
- Product corrections belong in `context/product.md`, or in its linked `context/product-details/` owner when they change a detailed support taxonomy or catalog; strength-training knowledge rules and indexing in `context/expertise.md`; admitted domain facts, evidence, practical applications, and source corrections in the relevant topic file under `context/expertise/`; general expression or provenance corrections in `context/user-language.md`; app/account-wide image tone, content, and generation corrections in `context/imagery.md`; target-situation, belief, resistance, and persuasion changes in the selected message version; every wording, voice, empathy, hook, progression, rhythm, reveal, CTA, title, and caption rule in the selected format's copywriting version; project operating and reference-interpretation rules in `AGENTS.md`.
- A message or copywriting version may be refined in place until a content record references it. After first use, its generation-affecting meaning is immutable: a durable change creates the next version, while a content-specific edit remains only in the final content artifact. Do not create a new version for formatting, evidence-only corroboration, or wording cleanup that cannot change future generation decisions. `context/imagery.md` is unversioned and user-directed improvements update it immediately.
- A message or copywriting version change does not by itself create a hypothesis node. Record the exact selected message and copywriting versions on each content row; several contents generated by one hypothesis may therefore reference different copywriting versions while testing that hypothesis. The hypothesis loop has only `message` and `copywriting` axes: create a child only when eligible performance evidence supports a distinct claim on one of those axes and the user confirms it.
- A content-specific correction remains embodied in the approved final content and its DB medium-specific copy snapshot and does not need a separate durable feedback log.
- The assistant autonomously judges whether performance evidence operationally supports a hypothesis. Two or more directly generated contents showing a consistent relevant signal are a useful default promotion signal, not a mechanical threshold; account for checkpoint maturity, comparison quality on the tested message/copywriting axis, metric relevance, topic and publication conditions, sample diversity, limitations, and contradictory evidence. Visual execution is not part of that judgment because it is not a hypothesis axis.
- Present operational adoption as part of the daily hypothesis-action proposal. Once the user confirms it, update the one proper final owner directly. Keep the underlying observations, interpretations, and lineage in SQLite; do not duplicate them in a learning inbox.
- Later conflicting feedback or evidence may replace, narrow, or reverse a promoted rule in a new message or copywriting version. User-directed imagery corrections replace the current rule in `context/imagery.md` immediately.
- Use `MEMORY.md` only for compact, adopted, high-value lessons that should be present in every `marketing-liftcode` session and do not already belong to a more specific project owner.
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
