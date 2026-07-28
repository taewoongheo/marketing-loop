# Research loop

## Purpose

The research loop discovers the most valuable unknown that could improve LIFT CODE's business purpose or the reliability of this marketing system. Its subject space is open. Formats, strength-training expertise, audience language, marketing methods, measurement, distribution, tools, and platform changes are examples, not an allowlist or a rotation.

Research is not an output goal. A useful question must name why it matters now and the decision that could change if the evidence is credible.

## MECE ownership model

Every research object has exactly one durable owner.

| Object | Owner | Not owned here |
| --- | --- | --- |
| Selection, routing, review, and admission policy | This document | Individual findings or sources |
| Runs, questions, sources, findings, review history, adoption links, and accepted structured knowledge | `db/research.sqlite` using `db/research-schema.sql` | Hypotheses, content results, exact media bytes |
| Product truth and current bounded brand context | Existing files under `context/` | External research history |
| Message and copywriting strategy | Versioned files under `messages/` and format `copywriting/` | Raw sources or general knowledge |
| Internal hypotheses, content identities, publication links, and results | `db/hypothesis-loop.sqlite` | External-source knowledge |
| Raw format media and native content execution | The selected `renderer/<medium>/` namespace | Source metadata and review state |
| Exact schedule, delivery, workdir, and attached skills | Hermes cron job | Research policy or findings |

Markdown entrypoints such as `context/expertise.md`, `context/user-language.md`, and `context/marketing-methods.md` own bounded policy and retrieval instructions only. They must not accumulate evidence rows that are already owned by the Research DB.

## Open discovery, closed admission

Discovery may investigate any question with a plausible causal path to LIFT CODE revenue or reliable marketing operation. Automatic mutation remains limited to the marketing workspace's declared owners and decision rights.

For each run:

1. Read the current funnel diagnosis, launch constraints, active hypotheses, recent content/results, accepted Research DB knowledge, unresolved findings, and recent duplicate/no-finding decisions.
2. Generate candidate questions without selecting from fixed research categories.
3. Prefer questions that are decision-relevant, materially uncertain, novel relative to stored evidence, actionable after resolution, answerable from credible sources, and worth their cost.
4. Select no more than three independent questions. The limit controls execution, not subject matter.
5. Research each question with the narrowest suitable live capability and preserve exact source URLs and material limitations.
6. Record one bounded finding per question, or explicitly record `no_finding`, `outside_scope`, `duplicate`, or `failed`.
7. Never force a novel result into the nearest existing owner. Use `new_owner_proposal` when an in-scope result has no valid marketing owner.

Research may examine adjacent evidence only when it informs a marketing-owned decision. If the bounded result cannot route to an existing or proposed marketing owner, close the question as `outside_scope` without creating a finding. Reserve `new_owner_proposal` for an in-scope marketing result that requires a new owner inside this workspace; it cannot silently change product, pricing, retention, or another non-marketing owner.

## Triggers and concurrency

The same Research DB lifecycle is used by two triggers:

- **Scheduled discovery:** the Hermes job runs hourly.
- **Content preflight:** content production starts research immediately when a missing fact, execution capability, audience understanding, marketing method, or measurement answer could materially change the content or hypothesis action.

`research_runs` owns a singleton lease across all triggers. A new trigger records `skipped` when an unexpired run is active. An expired lease is failed before another run starts. The cron scheduler must not implement a second lock owner.

Each run starts through:

```bash
python3 scripts/research_store.py start-run \
  --trigger scheduled \
  --objective "Resolve the most valuable current unknown."
```

Every successful run must finish as `completed` or `failed`; a run cannot complete while a selected question is unresolved, and interruption is recovered by lease expiry.

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
2. A supported finding may be adopted only into its exact recorded existing owner when the change is non-structural, no-cost, credential-free, and verifiable under `AGENTS.md`.
3. Adoption is a separate immutable receipt. It must match the finding's route, exactly one final owner, and the materialized owner state.
4. After successful adoption, Telegram receives a compact notification containing the finding ID, bounded result, limitations, sources, action, and owner. This is a notice, not an approval request.
5. New owners, credentials or permissions, paid access, destructive migrations, and major structural changes remain Telegram action requests and are never represented as adoptions.
6. Content creation, publication, and hypothesis decisions retain their separate contracts; research admission does not bypass them.
7. Validate the final owner and adoption receipt. A scheduled run may commit and push only its exact clean tracked changes under the dirty-tree isolation rules in `AGENTS.md`.

If the user later says a notified finding is wrong or should not be used, inspect the live finding, sources, adoption, and current owner before changing anything. Remove the materialized structured owner entry or raw-reference designation, or correct the tracked owner first, then record an immutable `research_withdrawals` receipt through `scripts/research_store.py withdraw`. A user-directed withdrawal must preserve the user's actual reason and a non-secret transport-bound actor-evidence reference. Never rewrite or delete the original finding, review, adoption, or source provenance. An unadopted proposal rejected after user feedback receives a new agent review whose rationale cites that feedback without falsely attributing the review to the user.

`research_notifications` is the durable delivery outbox. Adoption and each approved structural-proposal review enqueue a revision-bound notification in the same transaction as their state change. Withdrawal cancels an undelivered adoption notification; a later proposal review cancels undelivered notifications for older revisions. Preparation rechecks current withdrawal and latest-review state before dispatch, so obsolete events cannot enter a digest. At the start of a scheduled tick, reconcile any `dispatching` attempt against the scheduler's previous delivery result: mark it `delivered` with a non-secret scheduler receipt, or `failed` so it can be retried. Before returning a notification digest, atomically prepare all current pending or failed notifications under the current run ID. Never mark that attempt delivered in the same run; the following tick owns reconciliation because only the scheduler knows whether final-response delivery succeeded. An interrupted run therefore leaves a recoverable attempt instead of silently losing the notification.

A `new_owner_proposal` is only evidence for a possible structural change. Present the smallest owner contract and receive separate structural confirmation before creating it; the proposal itself is not adoptable.

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
| Missing responsibility | `new_owner_proposal`; notify and request separate structural confirmation |
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

## Scheduled response

- Reconcile the previous notification attempt before research, then return one compact digest for the newly prepared durable outbox attempt when an owner changed or an approved structural proposal requires action.
- Do not ask the user to approve ordinary findings or existing-owner adoptions.
- If no notification is pending after reconciliation and all selected questions were duplicates, produced no credible finding, caused no owner change, or the run was skipped, return exactly `[SILENT]`.
- If user action is required because of credentials, cost, source access, or a structural owner proposal, return one concise action request.
- The research job does not create content, alter hypotheses outside their own decision contract, or publish.
