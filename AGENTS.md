# LIFT CODE Marketing Loop

## Scope

- The ultimate business purpose of this repository is to help increase LIFT CODE app revenue. This marketing workspace directly owns qualified App Store inflow, not downstream download conversion, activation, retention, pricing, payment, or revenue by itself.
- The operating objective is to repeatedly identify and improve the marketing-funnel bottleneck that most limits qualified App Store inflow. `docs/marketing-funnel.md` owns the funnel stages, measurement contract, responsibility boundary, and bottleneck-selection model.
- The marketing system gathers a qualified audience by repeatedly delivering standalone value in the product's delegated decision space defined in `context/product.md`. It selects decision-relevant audience needs, evidence, and creative direction, then expresses practical, explanatory, emotional, entertaining, or other audience value in an immediately understandable or experienceable form. Do not reduce value to tips or utility. Research volume, technical implementation, and generic fitness information are not goals by themselves.
- Message strategy, copywriting, content production, channel growth, and their observed metrics are controllable levers, diagnostics, constraints, or intermediate outcomes. None is an independent final goal.
- During the current prelaunch phase, TikTok content follows the launch-phase contract in `docs/marketing-funnel.md`: it does not mention or promote the app or its planned capabilities and uses no audience-facing CTA. It delivers standalone value to the relevant strength-training audience while improving the nearest observable and actionable upstream constraint; product exposure and CTA use begin only after launch or an explicit user change to that owner. Attention, trust, and audience qualification are interpretations supported by evidence, not funnel stages.
- The user-provided 1,000-follower TikTok requirement is a current channel-access constraint on exposing the App Store link, not a separate goal. Follower movement may show progress toward removing that constraint but does not by itself prove audience quality, App Store inflow, or the effect of any hypothesis axis. Verify the platform requirement again when link activation becomes actionable.
- This is a personal-use, non-deployed workspace. When the user authorizes a structural change, prefer direct restructuring over legacy paths or compatibility artifacts.
- A hypothesis is a testable proposed improvement to something the assistant can directly materialize in marketing output, paired with the audience response expected to relieve the selected funnel bottleneck. Funnel stages and metrics are outcomes, not hypothesis axes.
- The two current durable hypothesis axes are message and copywriting.
- **Message strategy** decides what perception or belief should change and how the audience is persuaded.
- **Copywriting** decides how the message is expressed: hook wording, specificity, information density, rhythm, product reveal, caption, and—only when the current launch-phase contract permits one—CTA.
- Every content uses exactly one `medium`: `slideshow` or `video`. The assistant selects the medium and one format within it from the current hypothesis plan, project context, available evidence and assets, prior content records, and execution fit.
- Visual and audiovisual composition is not template-driven. The assistant designs each content project from the selected format's designated references, approved copy, current imagery guidance, and up to three retained same-medium same-format execution examples.
- `context/imagery.md` owns the current app/account-wide image tone, content rules, runtime request constraints, and generation/selection policy. It is updated in place from user direction and is not versioned because imagery is not a hypothesis axis.
- `docs/research-loop.md` owns open-ended research selection, evidence, review, and routing policy. `db/research.sqlite` owns the unbounded research lifecycle and accepted structured knowledge under `db/research-schema.sql`.
- `context/expertise.md`, `context/user-language.md`, and `context/marketing-methods.md` are bounded policy and retrieval entrypoints; their accumulated entries and provenance live in the Research DB.
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
- the recommended hypothesis actions and content allocation across active leaves, including one content for each scheduled slot;
- the copy approach;
- open-ended research questions that could materially improve LIFT CODE revenue or reliable marketing operation, without treating current examples as a closed domain list.

Base hypothesis recommendations on the current funnel diagnosis, project context, hypothesis lineage, and relevant DB observations. Every hypothesis must change a controllable output on exactly one current axis, name the audience response it expects to improve, and explain why that response should relieve the selected funnel bottleneck. A funnel stage, follower count, or metric is a target outcome or observation, never the changed element itself. Medium and format selection may use content fit, available evidence and assets, recent execution diversity, and observed distribution performance as operational inputs. Medium, format, imagery, layout, crop, motion, timing, and audio remain execution variables rather than hypothesis axes and must not be used to weaken, defer, branch, close, or adopt a message/copywriting hypothesis. Use designated references and retained same-medium same-format Project JSON only as execution evidence. Do not ask the user to choose the evaluation criteria, bottleneck, or hypothesis direction, but obtain confirmation before applying the day's hypothesis actions.

When creating a root or child hypothesis, record one concise `decision_reason` with the node explaining why the current diagnosis, evidence, and limitations justified selecting it. Keep this creation-time reason separate from the hypothesis statement and from later content-result observations.

The user controls:

- confirmation or revision of the day's hypothesis actions: continue a leaf, close a leaf, create root or child hypotheses, adopt a supported hypothesis into its final owner, and allocate content across active leaves;
- final copy approval;
- whether the final visual project is publication-ready;
- correction or withdrawal of a previously notified research finding;
- adding, ordering, or removing designated reference evidence outside the autonomous research-admission path;
- TikTok publication.

Ask for information only when a missing fact would materially affect product truth, audience fit, or the ability to produce a valid final copy. Do not publish to TikTok, commit changes, delete data, or contact anyone without explicit instruction.

### Autonomous system improvement

The user grants standing authorization to improve this marketing system's internal contents, implementation details, methods, and capabilities within its approved structure and operating model at the end of interactive work and scheduled runs. Always assess whether a concrete operational bottleneck, ownership defect, logical conflict, reliability failure, or missing capability materially limits the business purpose. When the necessary remedy would change the structure or operating model, prepare the approval request defined below instead of implementing it autonomously. An assessment may correctly produce no change; do not refactor for motion or create speculative infrastructure.

The user delegates full responsibility for every internal means used to pursue the objective. The qualified App Store inflow objective defined in `docs/marketing-funnel.md` is the sole immutable element of this marketing system. Within the existing approved structure and operating model, the assistant may freely change internal policy content, implementation details, prompts, algorithms, queries, validations, and other non-structural mechanics when doing so improves effectiveness or reliability. A change to the structure or operating model itself requires the user's prior approval through Telegram before implementation. This approval gate includes creating, removing, replacing, or materially redefining the hypothesis system or its axes, funnel operating model, research or measurement lifecycle, content workflow or approval gates, authoritative owner boundaries, schemas or durable state model, renderer architecture, scheduler topology, or top-level subsystem. The assistant must send the smallest concrete proposal, explain why the structural change is needed and what it replaces, and wait for explicit Telegram approval; standing authorization and the general autonomous-improvement mandate do not satisfy this gate. Existing structures remain replaceable current implementations rather than permanent constraints, but only after that approval. This delegation does not authorize changing product truth or taking external, destructive, credentialed, paid, publication, contact, or account-trust actions that otherwise require user involvement.

Every autonomous improvement must preserve four invariants:

1. **MECE coverage:** real cases are covered completely without overlapping authorities.
2. **One explicit owner:** every rule, datum, artifact, and lifecycle transition has exactly one documented file, database, or runtime owner; consumers reference that owner instead of restating it.
3. **Logical consistency:** inspect all affected owners and call paths, resolve contradictions rather than appending exceptions, and validate the final system end to end.
4. **Database-backed accumulation:** unbounded or repeatedly accumulating observations, evidence, results, findings, provenance, events, and history belong in the appropriate SQLite database. Files remain for bounded current policy, product context, schemas, executable code, configuration, immutable generation contracts, and media assets—not append-only knowledge logs.

Prefer simplifying or reusing an owner before adding another, but add or restructure owners when that is the smallest complete design. Before changing structure, define the new responsibility boundaries, identify every producer and consumer, migrate references and durable state, remove or retire superseded authority without losing required history, and verify that no duplicate owner or logical conflict remains. Inspect a candidate dependency or external capability for source, trust, network behavior, telemetry, generated files, maintenance, and cost before installation. Use compliant public access, official APIs, browser workflows, alternative sources, or paid providers when authorized; never bypass technical access controls, evade authentication, acquire credentials indirectly, violate the account-location boundary, or jeopardize platform trust.

During unattended work, first exhaust safe autonomous means within this system's authority, including repository and database state, compliant public sources, already approved capabilities, and any fallback that preserves a valid result. If information, access, an asset, or a user-only action that the assistant cannot obtain is materially necessary to make a valid decision or complete the work, request it through Telegram regardless of type. Ask for the smallest exact action or observation and state the decision or completion it unlocks; never request optional evidence, a choice already delegated to the assistant, or secret values in chat. A new authentication or permission, API key provisioning, paid spend, an irreversible or destructive data change, a structural or operating-model change, or a decision outside this marketing system's authority always requires escalation. The four invariants and the existing product-truth, account-trust, secret-handling, publication, dirty-tree-isolation, and scheduler-specific commit boundaries constrain a structural proposal but never replace its required prior Telegram approval. No spending cap exists yet, so any non-zero spend requires approval. Present one smallest viable proposal or request with its expected benefit, cost or credential purpose, risks, and fallback when applicable.

### Scheduled production and collection

One recurring reasoning-driven content-production job initiates one content workflow two hours before each fixed daily publication slot: 23:00 KST for the next day's 01:00 slot, then 09:00, 12:00, and 20:00 KST for the same day's 11:00, 14:00, and 22:00 slots. The current operating target is therefore four TikTok contents per day. Each scheduled run opens a continuable Telegram workflow, performs the required live diagnosis and content preflight, and presents the hypothesis action and one-content allocation for confirmation. It does not bypass or combine the hypothesis-confirmation, final-copy approval, publication-ready designation, or manual-publication gates. After the user replies, continue that same workflow through native-project creation, verification, delivery, and a manual posting request for the named slot.

Scheduled production never publishes to TikTok. If a run starts outside its intended lead-time window, or the required approvals and publication-ready artifact are not complete in time, skip that slot rather than producing a catch-up post at an unplanned time. Do not move unused slots to another day or increase another slot's allocation automatically.

The shared delayed-metric collector is the sole scheduled owner of due 24h, 48h, and 72h public checkpoint retrieval. Interactive content work reads normalized stored results rather than fetching due checkpoints again. Account follower observations diagnose the current link-access constraint on a separate low-frequency cadence: reuse the latest `account_results` row when it is less than 24 hours old, and refresh it only after that interval has elapsed. Do not add a collector for every funnel stage in advance; admit only the narrowest reliable source whose absence blocks diagnosis of the nearest actionable bottleneck.

### Event-driven autonomous research

Every content cycle performs `content_preflight`; insertion of a new 24h, 48h, or 72h content checkpoint triggers `result_review`; and an explicit interactive request may use `manual`. All triggers share `docs/research-loop.md`, `scripts/research_store.py`, and the singleton `research_runs` lease.

Each run frames the governing question as what would most improve the current qualified-audience or content decision. It reads prior quality feedback and may actively investigate any relevant domain, but selects no more than three independent bounded questions and selects zero when accepted evidence is sufficient. A result-review run treats one checkpoint as diagnostic evidence, not causal proof, and distinguishes distribution noise, measurement gaps, message, copywriting, topic, and execution conditions before proposing a next decision. Research may supply a hypothesis candidate but cannot mutate hypothesis lineage outside its separate contract.

Research admission remains autonomous. Every selected question is persisted before investigation and finishes as a bounded finding, duplicate, no-finding, outside-scope outcome, or failure. Every finding receives an agent-authored review; a supported finding may be adopted into exactly one valid owner under the four invariants. Adoption and approved blocked proposals use the durable `research_notifications` outbox. An event-run attempt token includes its scheduler job ID; a later event reconciles a prior `dispatching` attempt only from that job's unambiguous scheduler-owned delivery result. The current attempt is never marked delivered in the same run.

Every completed event research run returns a brief, plain-language Telegram update even when no external search was needed. A result update contains at most three short bullets: the newly observed key metrics, what they mean, and what changes next. Do not expose run or finding IDs, trigger names, database outcomes, owner names, file paths, integrity terminology, or feedback labels. Internal provenance remains in SQLite. Accept natural-language feedback and map it internally to `useful`, `weak_evidence`, `irrelevant`, `overstated`, or `correction` through `scripts/research_store.py quality-feedback`. `research_quality_feedback` owns this immutable user-quality history. Later research reads it to improve question selection, source sufficiency, scope, and admission without rewriting the original finding or agent review. A correction or removal still follows the exact withdrawal workflow and preserves provenance.

### Automated system-integrity discovery

`scripts/system_integrity.py` owns deterministic internal checks for SQLite integrity, lifecycle states, leases, required owners, scheduler topology, prior job outcomes, and Telegram delivery. It also reports operational-health warnings for hypothesis stagnation, result checkpoints without review, stale TikTok Studio requests, repeated low-yield research outcomes, and unexplained concentration in finding owners or source classes. A warning prompts live diagnosis; it is not a quota and does not block the cycle by itself. Structural failures block mutation and use the existing Telegram delivery route.

Each event research cycle separately checks semantic ownership, consistency, transition, and capability defects and may apply the smallest authorized correction. These checks run inside existing Hermes Scheduler jobs and cover executions that start, not scheduler-process availability.

### Private analytics requests

When a current funnel or content decision materially needs a private TikTok Studio observation, create or reuse a pending request through `scripts/manual_analytics_store.py`. Ask through Telegram for the exact metric, account/content scope, reporting window, TikTok Studio location, and decision it unlocks. Record the supplied value, Telegram evidence, observation time, and limitations through the same writer; never infer it from public counters or duplicate a matching pending request.

## Required context before creating content

1. Read `docs/marketing-funnel.md`, identify the current launch/channel constraints, and diagnose the nearest observable and actionable bottleneck from available funnel evidence. A missing metric is a measurement gap, not proof that its stage is the bottleneck.
2. Read product truth, the policy entrypoints `context/expertise.md`, `context/user-language.md`, and `context/marketing-methods.md`, query only relevant accepted entries in `db/research.sqlite`, and read the current account-wide imagery guidance in `context/`. When content uses a specific Exercise or training structure, also read the relevant linked detail under `context/product-details/`.
3. Review available versioned message definitions in `messages/`.
4. Read `docs/hypothesis-loop.md` and query SQLite for active leaves, relevant ancestors, generated contents, their `medium` and `format_id`, and normalized results.
5. Inventory the available format namespaces under both `renderer/slideshow/formats/` and `renderer/video/formats/`. A medium with no valid format is unavailable for that run.
6. Select exactly one medium and format for each allocated content from the approved hypothesis plan, message and copy needs, available references and production assets, execution feasibility, recent medium/format diversity, and relevant DB observations. Performance may inform operational distribution but never turns medium or format into a hypothesis axis.
7. Review the selected `renderer/<medium>/formats/<format-id>/copywriting/v<version>.md`, its `imagery.md` when present, and all designated evidence in its `references/` directory.
8. Inventory available same-medium same-format Project JSON under `contents/` as Project execution candidates. Publication status, hypothesis lineage, message/copywriting versions, and performance do not make a candidate execution-authoritative. A missing historical DB-linked project is expected after pruning because SQLite permanently retains the exact medium-specific copy snapshot.
9. Ask only for missing information that would materially affect product truth, audience fit, medium feasibility, or valid copy.
10. Prepare the current run's funnel diagnosis, hypothesis-action, and allocation proposal, then obtain user confirmation before creating or closing nodes, promoting a supported rule, or assigning content.
11. Apply the confirmed hypothesis actions and create the selected medium's native project from the approved evidence.

Before opening prior Project JSON, select at most three same-medium same-format projects solely as execution examples. Select from metadata, file validity, composition relevance to the current approved copy, recency, and cross-project execution diversity. Do not rank or select them by hypothesis lineage, message/copywriting identity, publication status, or performance. Three is a maximum, not a target; do not add a weaker candidate merely to fill the count.

Never load embedded image bytes or video/audio payloads from prior projects into the reasoning context. Extract only bounded execution metadata appropriate to the medium—text roles and lengths, typography, geometry, image dimensions/crops, timeline structure, clip and text timing, asset metadata, and checksums—and inspect rendered contact sheets, frames, or playback only as needed. Prior wording is not copy input. Full media bytes may pass only through file, render, validation, and media-inspection tools. Query and aggregate normalized SQLite metrics for all relevant contents, but read `raw_json` only when verifying provenance, diagnosing a collection problem, or reintroducing a late correction.

## Content workflow

1. Any user message expressing an intent to create content starts the workflow; the recurring production job also starts one workflow for each scheduled slot. No fixed command phrase or user-supplied problem, situation, hook, or direction is required.
2. The assistant reads `docs/marketing-funnel.md`, product truth, relevant accepted Research DB expertise, audience language and marketing methods through their policy entrypoints, current account-wide imagery guidance, `docs/hypothesis-loop.md`, message definitions, available medium/format namespaces, and relevant DB lineage and results. It then performs one `content_preflight` research run through `docs/research-loop.md`, selecting zero questions when accepted evidence is sufficient and up to three only when the answer could materially change the content decision.
3. Read newly collected funnel observations and 24h, 48h, and 72h content results. When evaluating a leaf, read detailed ancestry back to the nearest 72h-complete ancestor and reintroduce older late corrections when present.
4. Diagnose the current bottleneck, then independently evaluate whether to continue an active leaf, create one or more root or child hypotheses that change a controllable output to address it, close a leaf, or adopt a supported hypothesis, and recommend the requested `n`-content allocation.
5. Present the concise current-run funnel-diagnosis and hypothesis-action proposal and wait for user confirmation or revision. For a scheduled run, name its target publication slot and allocate exactly one content. Do not mutate hypothesis lineage, close a branch, update a durable owner from performance evidence, or assign new content before confirmation.
6. Apply the confirmed hypothesis actions and allocation. A hypothesis may generate several contents; one parent may generate any number of child hypotheses.
7. Independently select the problem, situation, message, content direction, product exposure, medium, format, copy approach, and full medium-appropriate composition inside the confirmed hypothesis plan.
8. Ask the user only if a missing fact blocks truthful, audience-appropriate, or valid copy.
9. Read the selected format's copywriting version, format-specific `imagery.md` when present, all designated references, and only the selected at-most-three same-medium same-format Project examples. Draft, evaluate, and improve the copy internally using relevant accepted `expertise_entries`, the selected message, product truth, the selected copywriting version, and reviewed preflight findings. If a needed claim remains unresolved, do not add an ad-hoc tip directly to copy.
10. Show only the refined final-copy proposal and caption. For a slideshow, show the exact ordered text layers for every slide. For a video, show the exact ordered on-screen text and spoken text separately, explicitly showing an empty channel when unused. Revise from every user feedback without persisting intermediate versions. Infer the narrowest reusable scope of the feedback and update its proper owner immediately when it changes durable guidance.
11. When the user approves the final copy, create the native editable project under `renderer/<medium>/formats/<format-id>/contents/` with the same `formatId`. Derive recurring format characteristics separately from one-off execution and design the complete project without copying exact coordinates or timeline values. When managed imagery is selected, read the approved project copy, current account-wide `context/imagery.md`, and selected format's `imagery.md` when present, choose content-specific geometry, then generate or select each eligible image accordingly. Project and asset creation do not create a content DB record.
12. The user fine-tunes that project and identifies the publication-ready final.
13. Record the content under the hypothesis that generated it, together with `medium`, format identity, message identity/version, copywriting version, the exact medium-specific copy snapshot, caption, and final project path and hash. Slideshow snapshots contain one non-empty text array per slide. Video snapshots contain ordered `on_screen_text` and `spoken_text` arrays; either or both may be empty.
14. Render or deliver the exact final project only when explicitly requested. For a slideshow, extract its PNG slides and send them in exact order as one Telegram document media group so Telegram preserves the original bytes; do not send the ZIP, separate documents, or compressed photos unless explicitly requested. For a video, send the exact rendered video file. Attach the approved post title followed by the approved caption—description plus tags—to the slideshow group's first document or the video message. When the delivered content contains any AI-generated imagery, video, or audio, append a clearly separated publisher-only note—outside the audience-facing title and caption—to turn TikTok's `AI-generated content` setting on. The user publishes manually and provides the TikTok URL.
15. Resolve the supplied TikTok URL to one publication-ready content before writing anything. A URL-only message may be linked automatically only when the conversation and the set of publication-ready contents without URLs identify exactly one clear candidate. If no candidate or several plausible candidates remain, ask which content was published and do not record the URL or `published_at` until the user resolves it.
16. Once the content identity is certain, record the URL and `published_at` together; the shared collector then records results at 24, 48, and 72 hours. Keep observations separate from interpretations.

If the previous final content has no TikTok URL, ask naturally at the start of the next relevant conversation. Do not create a separate reminder by default.

## Ownership

- Marketing-funnel stages, measurement contract, direct-responsibility boundary, and bottleneck selection: `docs/marketing-funnel.md`
- Product definition, user value, core mechanisms, reference-app differences, and boundaries: `context/product.md`
- Detailed product-supported Exercise and training structures used to validate content compatibility: `context/product-details/`
- Open-ended research selection, routing, review, and admission policy: `docs/research-loop.md`
- Research runs, questions, sources, findings, agent reviews, immutable user quality feedback, adoption and withdrawal receipts, durable notification outbox and delivery receipts, accepted structured knowledge, and format-reference metadata: local `db/research.sqlite`; canonical structure: `db/research-schema.sql`; lifecycle writer: `scripts/research_store.py`
- Strength-training knowledge policy and retrieval contract: `context/expertise.md`; admitted facts, mechanisms, practical applications, evidence status, and content-use limits: Research DB `expertise_entries`
- Audience-language policy and retrieval contract: `context/user-language.md`; collected expressions and provenance: Research DB `audience_language_entries`
- Reusable external marketing-method policy and retrieval contract: `context/marketing-methods.md`; admitted methods and evidence: Research DB `marketing_method_entries`
- Versioned target situation, problem pattern, belief shift, persuasion logic, resistance and response, product role, and evidence limits: `messages/msg-<message-name>/v<version>.md`; use the descriptive `msg-` name as the message ID without a numeric sequence.
- All reusable medium-and-format-specific wording rules, empathy technique, voice, hook, progression, density, product reveal, title, caption, language interpretation of references, adaptation reasoning, and CTA expression when the current launch phase permits a CTA: immutable used versions under `renderer/<medium>/formats/<format-id>/copywriting/v<version>.md`
- Current app/account-wide image tone, semantic translation, image-copy relationship, within-image composition, cross-image variation, runtime request constraints, and generation/selection policy: unversioned `context/imagery.md`
- Reusable medium-and-format-specific visual interpretation of designated references, including subject/media mix, capture types, composition roles, and format-specific exclusions: `renderer/<medium>/formats/<format-id>/imagery.md`
- Hypothesis branching, delayed-evidence traversal, and active-leaf operation: `docs/hypothesis-loop.md`
- Hypothesis nodes and their creation-time decision reasons, generated content medium/format identities, exact final medium-specific copy snapshots, publication details, public results, TikTok Studio measurement requests and supplied observations, and evidence links: `db/hypothesis-loop.sqlite`
- Hypothesis-loop SQLite structure: `db/schema.sql`
- Due public checkpoint selection, TikWM normalization, retry, and insertion mechanics: `scripts/collect_due_content_results.py`
- Low-frequency public follower observation, TikWM profile normalization, 24-hour freshness guard, and insertion mechanics: `scripts/collect_account_followers.py`
- TikTok Studio request deduplication, pending/terminal lifecycle, supplied-value validation, provenance, and immutable observations: `scripts/manual_analytics_store.py`
- Agent identity: `~/.hermes/profiles/marketing-liftcode/SOUL.md`
- Adopted compact profile-level lessons: `~/.hermes/profiles/marketing-liftcode/memories/MEMORY.md`
- Reusable multi-step procedures: Hermes skills
- Ordered raw medium-specific execution evidence: `renderer/<medium>/formats/<format-id>/references/`
- While retained, exact content-specific visual or audiovisual execution: the native project and referenced local assets under the selected `renderer/<medium>/` namespace. The project materializes the DB-recorded final copy for editing and rendering but is not its permanent copy-evidence owner.

Do not duplicate one fact, rule, layout value, or result across owners.

## Renderer boundary

- A renderer receives an already selected medium, format, approved copy, and content-specific composition. It only reads, edits, validates, stores, and renders native projects; it never selects strategy, medium, format, or content direction.
- Neither renderer has a reusable coordinate, timeline, scene, or per-property lock template. Format folders own evidence, copywriting grammar, and bounded visual interpretation of their references, not reusable Project JSON.
- Write generated editable content only to `renderer/<medium>/formats/<format-id>/contents/` with a matching `formatId`. Project JSON and production assets are local Git-ignored artifacts; do not force-add them.
- `renderer/slideshow/src/projectValidation.ts` solely owns the slideshow Project JSON safety envelope. `renderer/video/src/projectValidation.ts` solely owns the video Project JSON safety envelope. In each renderer, editor loading, storage middleware, and render CLI must consume its owner rather than restating limits.
- A slideshow project owns its exact slide count and order, canvas, coordinates, dimensions, typography, colors, image crops, editable layers, and either embedded image bytes or references to local production assets under `renderer/slideshow/public/assets/`. Referenced assets remain part of the retained execution and may be pruned only when no retained project uses them.
- A video project owns its exact canvas, fps, clip order and trims, timeline positions and durations, crop and fit, typography, colors, audio layers and levels, and references to its local production assets. Referenced assets remain part of the retained execution and may be pruned only when no retained project uses them.
- Renderer CLI output arguments must resolve under that medium's `renderer/<medium>/renders/` directory. Rendered files are derived delivery artifacts, not a second content or copy owner.
- The selected copywriting version owns hook function, medium-appropriate copy roles, progression, rhythm, information density, reader relationship, product reveal, CTA, title, and caption approach.
- `context/imagery.md` owns only account-wide semantic visualization, art direction, image-copy coordination, within-image composition, cross-image variation, runtime request constraints, generation/selection policy, and visual exclusions. It must not name a format or own a format-specific reference interpretation.
- A selected format's `imagery.md` owns only that format's reusable visual interpretation of its designated references and consumes the account-wide rules without restating them. It must not own project coordinates, content-specific scenes, provider configuration, or final image bytes.
- The assistant derives the content-specific provider request transiently from approved copy, selected geometry, account-wide `context/imagery.md`, and the selected format's `imagery.md` when present. Do not persist it as a separate artifact. `context/imagery.md` solely owns assistant-level candidate counts, call budgets, acceptance gates, and selection outcomes. The active Hermes image tool/profile solely owns backend/model configuration, credential resolution, provider-internal retry, response decoding, and cache storage. Native project construction plus the applicable renderer validator own project mutation and verification. For this project's OpenAI Codex OAuth setup and troubleshooting procedure, follow `docs/hermes-openai-codex-image-generation.md` rather than falling back to FAL when that authenticated route applies; the document does not override the active tool's request schema or runtime capabilities.
- `context/expertise.md` and Research DB `expertise_entries` are global across formats and platforms. A format may define how to express relevant expertise but must not duplicate or become a second owner of the underlying domain knowledge.
- A copywriting version must not restate project coordinates or content-specific geometry.
- Do not modify renderer code unless the user explicitly requests it.

## Reference evidence

- A reference may be user-designated or autonomously admitted from a reviewed research finding. Do not call it viral from one public count. Store canonical source URL and acquisition metadata only in the Research DB; keep raw media under the renderer reference namespace. Public performance is context, not proof that the execution will transfer.
- Store durable raw evidence under `renderer/<medium>/formats/<format-id>/references/<post-id>/`. Slideshow posts use numerically named screenshots in exact slide order. Video posts use the designated source video or numerically named frame evidence in playback order.
- References are the primary execution-grammar evidence. Slideshow evidence supports slide roles, image-text relationships, visual area, whitespace, crop, and cross-slide rhythm. Video evidence supports hook timing, shot and text progression, framing, motion, pacing, transitions, and audio-text relationships.
- Before creating a slideshow, inspect each reference post through one transient ordered contact sheet and open a full-resolution slide only when selected or illegible. Before creating a video, inspect a bounded storyboard/contact sheet for every reference and play or sample the full-resolution source only when selected or when timing or audio cannot otherwise be evaluated. Delete transient inspection artifacts after review.
- Use one primary reference-derived composition principle per slide or video sequence rather than blending several posts into one execution. Review the full render against the reference family and revise work that merely repeats recent contents or drifts outside it.
- Retained same-medium same-format Project JSON is secondary execution evidence only. Use recurring composition patterns and renderer feasibility without treating publication, hypothesis lineage, or performance as execution validation; never promote incidental coordinates or timeline values into a reusable rule or hidden template.
- Reference files are raw evidence, not production assets. Copywriting versions own language interpretation; the selected format's `imagery.md` owns reusable visual interpretation. Do not use reference media in production unless the user separately designates it as a production asset.
- A user-designated viral reference does not automatically validate the LIFT CODE adaptation, and its wording, subject matter, and distinctive expressions must not be copied.

## Evidence and claims

- Do not invent product features, user evidence, performance results, scientific support, or private TikTok metrics.
- Keep observed metrics separate from hypotheses, interpretations, and bottleneck judgments. Label a proxy as a proxy; never silently substitute engagement or followers for content views, profile views, bio-link clicks, or attributed App Store product-page views.
- Treat desk-research language as low-confidence language evidence, not testimony.
- Treat references as evidence of structure, rhythm, and technique. Never copy their wording, subject matter, or distinctive expressions.
- Prefer limited claims grounded in `context/product.md` and, when relevant, its linked `context/product-details/` owner.

## Feedback and durable learning

- Apply every user feedback to the current content, including one-off feedback.
- Infer the narrowest scope that preserves the feedback's meaning. Do not turn a content-specific edit into a universal rule, but do not discard a reusable correction merely because it appeared once.
- When feedback changes durable guidance, update exactly one proper owner immediately. Replace or narrow conflicting guidance instead of appending a contradictory rule.
- Product corrections belong in `context/product.md`, or in its linked `context/product-details/` owner when they change a detailed support taxonomy or catalog; research-selection rules in `docs/research-loop.md`; item review feedback in Research DB `research_reviews`; strength-training knowledge policy in `context/expertise.md` and admitted facts in `expertise_entries`; audience-language policy in `context/user-language.md` and expressions in `audience_language_entries`; marketing-method policy in `context/marketing-methods.md` and methods in `marketing_method_entries`; app/account-wide image tone, content, and generation corrections in `context/imagery.md`; medium-and-format-specific visual reference interpretation in the selected format's `imagery.md`; target-situation, belief, resistance, and persuasion changes in the selected message version; every wording, voice, empathy, hook, progression, rhythm, reveal, CTA, title, and caption rule in the selected format's copywriting version; project-wide operating and ownership rules in `AGENTS.md`.
- A message or copywriting version may be refined in place until a content record references it. After first use, its generation-affecting meaning is immutable: a durable change creates the next version, while a content-specific edit remains only in the final content artifact. Do not create a new version for formatting, evidence-only corroboration, or wording cleanup that cannot change future generation decisions. `context/imagery.md` and each format's `imagery.md` are unversioned current guidance; update the applicable one in place when user direction or its designated reference interpretation changes.
- A message or copywriting version change does not by itself create a hypothesis node. Record the exact selected message and copywriting versions on each content row; several contents generated by one hypothesis may therefore reference different copywriting versions while testing that hypothesis. The hypothesis loop currently has only `message` and `copywriting` axes: create a child only when eligible performance evidence supports a distinct controllable-output claim on one of those axes and the user confirms it. A funnel stage or metric may define the expected response but is never the changed element.
- A content-specific correction remains embodied in the approved final content and its DB medium-specific copy snapshot and does not need a separate durable feedback log.
- The assistant autonomously judges whether performance evidence operationally supports a hypothesis. Two or more directly generated contents showing a consistent relevant signal are a useful default promotion signal, not a mechanical threshold; account for checkpoint maturity, comparison quality on the tested message/copywriting axis, metric relevance, topic and publication conditions, sample diversity, limitations, and contradictory evidence. Visual execution is not part of that judgment because it is not a hypothesis axis.
- Present operational adoption as part of the daily hypothesis-action proposal. Once the user confirms it, update the one proper final owner directly. Keep the underlying observations, interpretations, and lineage in SQLite; do not duplicate them in a learning inbox.
- Later conflicting feedback or evidence may replace, narrow, or reverse a promoted rule in a new message or copywriting version. User-directed account-wide imagery corrections replace the current rule in `context/imagery.md` immediately; format-specific visual corrections update only the selected format's `imagery.md`.
- Use `MEMORY.md` only for compact, adopted, high-value lessons that should be present in every `marketing-liftcode` session and do not already belong to a more specific project owner.
- Use a skill for repeatable procedures, not marketing facts or content-specific preferences.

## Keep the system small

Do not add:

- n8n or Docker workflow infrastructure;
- workflow builders or AI node chains;
- prompt-composition systems;
- fixed generation stages such as final-copy, polish, or normalize;
- generic registries or untyped knowledge dumps outside the explicitly scoped Research DB lifecycle;
- multi-app abstractions;
- automatic TikTok publishing;
- draft or approval content directories;
- package scripts or durable helper code unless repeated real usage proves they are necessary.
