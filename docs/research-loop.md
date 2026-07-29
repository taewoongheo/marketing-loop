# Research loop

## Purpose

The research loop discovers the most valuable unknown that could improve LIFT CODE's business purpose or the reliability of this marketing system. Its subject space is open. Formats, strength-training expertise, audience language, marketing methods, measurement, distribution, tools, and platform changes are examples, not an allowlist or a rotation.

Research is not an output goal. A useful question must name why it matters now and the decision that could change if the evidence is credible.

During prelaunch, research normally creates leverage by helping the target audience choose a suitable Program, judge whether it is working, or reduce recurring progression decisions, and by improving how that value is packaged and distributed. The exact product problem remains owned by `context/product.md`; these are priority applications, not a closed research taxonomy.

## MECE ownership model

Every research object has exactly one durable owner.

| Object | Owner | Not owned here |
| --- | --- | --- |
| Selection, routing, review, and admission policy | This document | Individual findings or sources |
| Runs, questions, sources, findings, review history, user quality feedback, adoption links, delivery outbox, and accepted structured knowledge | `db/research.sqlite` using `db/research-schema.sql` | Hypotheses, content results, exact media bytes |
| Product truth and current bounded brand context | Existing files under `context/` | External research history |
| Message and copywriting strategy | Versioned files under `messages/` and format `copywriting/` | Raw sources or general knowledge |
| Internal hypotheses, content identities, publication links, and results | `db/hypothesis-loop.sqlite` | External-source knowledge |
| Raw format media and native content execution | The selected `renderer/<medium>/` namespace | Source metadata and review state |
| Exact schedule, delivery, workdir, and attached skills | Hermes cron job | Research policy or findings |

Markdown entrypoints such as `context/expertise.md`, `context/user-language.md`, and `context/marketing-methods.md` own bounded policy and retrieval instructions only. They must not accumulate evidence rows that are already owned by the Research DB.

## Open discovery, closed admission

Discovery may investigate any question with a plausible causal path to LIFT CODE revenue or reliable marketing operation. Automatic mutation remains limited to this marketing workspace and its decision rights, but the owner map itself may be improved autonomously under the four invariants in `AGENTS.md`.

For each run:

1. Read the current funnel diagnosis, launch constraints, active hypotheses, recent content/results, accepted Research DB knowledge, unresolved findings, and recent duplicate/no-finding decisions.
2. Generate candidate questions without selecting from fixed research categories.
3. Prefer questions that can improve a near-term content decision, audience understanding, useful synthesis, expression, or distribution; are materially uncertain and novel relative to stored evidence; and are answerable from credible sources at justified cost.
4. Select no more than three independent questions. The limit controls execution, not subject matter.
5. Research each question with the narrowest suitable live capability and preserve exact source URLs and material limitations.
6. Record one bounded finding per question, or explicitly record `no_finding`, `outside_scope`, `duplicate`, or `failed`.
7. Never force a novel result into the nearest owner. When an in-scope result has no valid marketing owner, assess and implement the smallest complete owner-map change under `AGENTS.md`; use `new_owner_proposal` only when that change is blocked from autonomous implementation.

Do not accumulate broad strength-training knowledge merely because credible information is available. A domain question must have a plausible route to the target problem, a near-term content need, or a current marketing decision. When accepted evidence is already sufficient, select zero questions rather than manufacturing work for a trigger.

Research may examine adjacent evidence only when it informs a marketing-owned decision. If the bounded result cannot route to a valid marketing owner, including one that can be created autonomously without violating `AGENTS.md`, close the question as `outside_scope` without creating a finding. Reserve `new_owner_proposal` for an in-scope marketing result whose required owner change is blocked by credentials, permissions, paid spend, destructive migration, an out-of-scope decision, or unresolved consistency risk; it cannot silently change product, pricing, retention, or another non-marketing owner.

## Event triggers and concurrency

Research is coupled to a decision event rather than an independent cadence:

- **Content preflight (`content_preflight`):** every interactive or scheduled content cycle checks accepted evidence before making the content decision. It may select zero questions; external search starts only when a credible answer could materially change the content or hypothesis action.
- **Result review (`result_review`):** the shared collector starts research only after it inserts a new 24h, 48h, or 72h checkpoint. A no-op collector tick starts no agent. The run diagnoses what the observation can and cannot distinguish before researching the highest-value uncertainty.
- **Manual (`manual`):** an explicit interactive request may investigate a current marketing decision through the same lifecycle.

There is no standalone hourly discovery run, fixed topic rotation, or continuously running AI worker. `research_runs` owns a singleton lease across all triggers. A new trigger records `skipped` when an unexpired run is active. An expired lease is failed before another run starts. Hermes Scheduler must not implement a second lock owner.

Each run starts through `scripts/research_store.py start-run` with the exact event trigger and a decision-specific objective. Every successful run finishes as `completed` or `failed`; a run cannot complete while a selected question is unresolved, and interruption is recovered by lease expiry.

Result-review evidence is diagnostic, not automatic causal attribution. Evaluate exposure/distribution variation, sample maturity, missing funnel metrics, message fit, copywriting, topic, and execution conditions before deciding whether external knowledge is missing. A 24h result is an early signal, 48h gives direction, and 72h is the more mature checkpoint; none alone proves a hypothesis.

## Evidence and deduplication

- Canonical source identities are globally unique. Tracking parameters and fragments are removed only from that identity key.
- `research_source_captures` preserves each access separately, including the original URL, resolved URL, observation time, retrieval method, and optional response status or content checksum. Mutable source evidence is never overwritten by a later access.
- Exact normalized findings are globally fingerprinted. A repeat becomes a `duplicate` question decision and may add genuinely new source support to the existing finding; it does not create a second fact.
- Every finding proposed for adoption must have at least one linked source and a bounded evidence note.
- Preserve contradiction and context links rather than treating every source as support.
- Public metrics, headlines, popularity, and one competitor example do not by themselves establish causality or generality.
- Source records own provenance. Structured knowledge owners reference the finding instead of copying citations into a second store.

## Review and admission

Research admission is always autonomous under standing user authorization. There is no per-finding user-approval mode or mutable authorization flag.

1. The agent reviews every bounded finding first and records one immutable decision with its rationale. A review is not adoption.
2. A supported finding may be adopted only into its exact recorded valid owner. When no owner exists, the agent may first create or restructure the owner map under `AGENTS.md`, migrate every producer and consumer, and update the finding route before adoption.
3. Adoption is a separate immutable receipt. It must match the finding's route, exactly one final owner, and the materialized owner state.
4. After each event run, Telegram receives a compact digest containing every question's finding ID or terminal outcome, bounded result, limitations, sources, action, owner, system-integrity result, and resulting content-decision change. This is a reviewable report, not an approval request.
5. New owners and structural changes are autonomous when they satisfy the four invariants. Credentials or permissions, paid access, destructive migrations, out-of-scope decisions, and unresolved consistency risks remain Telegram action requests and are never represented as adoptions.
6. Content creation, publication, and hypothesis decisions retain their separate contracts; research admission does not bypass them.
7. Validate the final owner and adoption receipt. An autonomous event run may commit and push only its exact clean tracked changes under the dirty-tree isolation rules in `AGENTS.md`.

If the user later says a notified finding is wrong or should not be used, inspect the live finding, sources, adoption, and current owner before changing anything. Remove the materialized structured owner entry or raw-reference designation, or correct the tracked owner first, then record an immutable `research_withdrawals` receipt through `scripts/research_store.py withdraw`. A user-directed withdrawal must preserve the user's actual reason and a non-secret transport-bound actor-evidence reference. Never rewrite or delete the original finding, review, adoption, or source provenance. An unadopted proposal rejected after user feedback receives a new agent review whose rationale cites that feedback without falsely attributing the review to the user.

`research_notifications` is the durable outbox for adopted owner changes and approved blocked proposals. Adoption and each approved proposal revision enqueue one notification in the same transaction as their state change. Withdrawal cancels an undelivered adoption notification; a later proposal review cancels undelivered older revisions. Each event's attempt token includes the scheduler job ID. At the start of a later event, reconcile a `dispatching` attempt only against that job's unambiguous previous `last_status`, `last_delivery_error`, and `last_run_at`; mark it delivered with a non-secret scheduler receipt or failed so it remains retryable. Never resolve the current event's attempt in the same run.

`research_quality_feedback` is the immutable owner of the user's evaluation of a whole run or one finding. Record `useful`, `weak_evidence`, `irrelevant`, `overstated`, or `correction` with the actual rationale and a non-secret Telegram evidence reference. Later runs read recurring feedback patterns to improve question selection, source sufficiency, scope, and admission. Feedback never rewrites the historical finding or agent review; `correction` also requires the exact withdrawal/correction workflow when materialized knowledge must change.

A `new_owner_proposal` is evidence for an owner change that the agent cannot safely implement under current authority or evidence. It records the smallest owner contract and the exact blocker; the proposal itself is not adoptable. A structural change that satisfies `AGENTS.md` is implemented and validated directly instead of being routed through a proposal merely because it is structural.

## Admission routing

Route by what the accepted result changes, not by the query's topic.

| Accepted result | Final owner |
| --- | --- |
| Reusable strength-training fact | `expertise_entries` |
| Reusable external marketing mechanism or method | `marketing_method_entries` |
| Traceable audience expression | `audience_language_entries` |
| Raw format execution evidence | Media under renderer references plus `format_reference_entries` metadata |
| Current product fact or bounded context correction | Existing canonical context file, linked by `research_adoptions` |
| Message/copywriting strategy worth testing | Confirmed hypothesis/version owner, linked by `research_adoptions` |
| Operating procedure | `AGENTS.md`, this document, or a reusable skill, linked by `research_adoptions` |
| Missing responsibility | Autonomously create or restructure one owner under `AGENTS.md`; use `new_owner_proposal` only when blocked |
| Outside marketing responsibility | `outside_scope` question outcome; no finding or owner |
| Unsupported or immaterial result | Rejected review; no final owner |

One finding has one adoption row. If one source supports several independent facts, create several bounded findings linked to the same source. If one finding appears to require several final owners, split it before review.

## Retrieval before use

The database is not automatically in model context. Before content or strategy work, query only the accepted owners relevant to the current decision. Do not load the entire research history or raw source bodies.

Examples:

```bash
sqlite3 -json db/research.sqlite \
  "SELECT * FROM expertise_entries WHERE topic LIKE '%progression%';"

sqlite3 -json db/research.sqlite \
  "SELECT * FROM marketing_method_entries WHERE application_context LIKE '%TikTok%';"

python3 scripts/research_store.py pending
```

A missing accepted entry means the project has not admitted that knowledge; it does not prove the claim false.

## Event response and system integrity

- Reconcile prior delivery attempts before starting and return one compact Korean digest for every completed event run, even when accepted evidence was sufficient and zero questions were selected.
- Identify the run, trigger, questions and finding IDs/outcomes, sources and limitations, disposition, exact owner/action, semantic integrity result, and resulting content-decision change. Omit routine execution detail.
- Invite quality evaluation with the five `research_quality_feedback` labels; do not ask the user to approve ordinary findings or existing-owner adoptions.
- If user action is required because of credentials, cost, source access, destructive migration, an out-of-scope decision, or a blocked owner proposal, return one concise action request.
- A result-review run does not create content. A content-preflight run may continue into the separately authorized content lifecycle but cannot publish to TikTok.

`scripts/system_integrity.py` is the deterministic scheduler-internal checker. It validates both SQLite databases, expected schema versions, terminal research states, lease expiry, required owners, absence of standalone research jobs, collector/production job topology, prior job failures, and Telegram delivery. The due-results and production wrappers run it before mutation and use their existing Telegram delivery route for failures. Event research additionally inspects semantic ownership, logical consistency, lifecycle reliability, and missing capabilities. Do not add a launchd daemon, heartbeat, or external Runtime Watchdog; this design intentionally cannot detect the Hermes scheduler process itself being stopped.
