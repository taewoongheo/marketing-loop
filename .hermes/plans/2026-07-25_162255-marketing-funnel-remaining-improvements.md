# Marketing Funnel Remaining Improvements

**Status:** Open items only; inactive future integrations are excluded. Do not implement measurement storage or ingestion until the dedicated MacBook is configured and a real TikTok Studio export is available.

**Goal:** Resolve the remaining decisions and evidence gaps required to operate a measurable four-event acquisition funnel, then apply the approved changes coherently across the final owners.

## Accepted operating input

This is established context, not an improvement item owned by this plan:

```text
TikTok content view
→ TikTok profile view
→ bio-link request/click
→ App Store product-page view
```

The loop diagnoses and improves the three transitions between these four events. TikTok is the channel, not a step. The 1,000-follower condition is a current platform constraint, not a funnel step or independent goal. Likes, comments, shares, saves, viewing depth, retention, and follows are separate diagnostics rather than additional required steps or one composite score. First-time download and later product outcomes are downstream quality feedback beyond the direct marketing handoff.

During prelaunch, the bio-link and App Store events are inactive rather than zero.

---

## R1 — Define qualified App Store inflow

**Problem:** `qualified` is still not operationally defined. A campaign-attributed product-page view establishes inflow but does not by itself prove target-market fit, download likelihood, or downstream product quality.

**Decision required:**

- define the minimum property that makes App Store inflow qualified;
- distinguish source attribution from audience qualification;
- specify which downstream signals are quality feedback rather than part of the marketing-owned conversion;
- state what qualification can and cannot mean during prelaunch when no App Store path exists.

**Completion condition:** One concise definition can be applied consistently in the objective, measurement contract, bottleneck selection, and reporting without inventing unavailable user-level evidence.

**Final owner:** `docs/marketing-funnel.md`.

---

## R2 — Decide whether bottleneck diagnoses need durable persistence

**Problem:** SQLite stores hypotheses, contents, public content checkpoints, follower snapshots, and content-result evidence links, but not which funnel bottleneck was selected, which cross-source observations supported it, or why it moved.

**Decision required:**

1. Determine whether recomputing the current diagnosis from stored observations and session history is sufficient for repeated operation.
2. If durable persistence is necessary, define the smallest model that records:
   - selected bottleneck or limiting transition;
   - diagnosis time and applicable phase;
   - exact supporting observations without duplicating their values;
   - interpretation and limitations;
   - reason for a later bottleneck change.
3. Decide how account-level and future funnel observations may inform a diagnosis without becoming direct evidence for a content hypothesis.
4. Do not add a generic event registry, one collector per stage, confidence score, or speculative source abstraction.

**Completion condition:** Either document why no new persistence is required, or approve a minimal schema whose repeated operating use is clear.

**Final owners if storage is approved:** `docs/marketing-funnel.md`, `docs/hypothesis-loop.md`, and `db/schema.sql` within their existing boundaries.

---

## R3 — Prepare and migrate to the dedicated New York-environment MacBook

**Problem:** The real TikTok Studio export must be obtained without exposing the U.S./New York-targeted account to a Korean location signal, and the current workspace includes local Git-ignored runtime artifacts that may be required on the new MacBook.

**Required work:**

1. Configure the dedicated MacBook with the stable New York VPN endpoint, kill switch, no split tunneling, U.S. region, `en-US`, and `America/New_York`.
2. Before TikTok login, verify that IP, DNS, WebRTC, and IPv6 expose no Korean network signal.
3. Use one persistent TikTok-only browser profile and keep TikTok session/cookie data outside the repository.
4. Inventory the exact migration scope for:
   - repository-tracked files;
   - the local SQLite runtime database;
   - retained renderer projects and referenced assets;
   - Hermes profile, skills, and scheduled jobs actually required to run this workspace;
   - ignored configuration and credential placeholders without copying unnecessary secrets.

**Completion condition:** The repository and required local runtime state execute on the dedicated MacBook, and TikTok Studio can be accessed through the approved New York environment without a detected leak.

**Safety stop:** Do not access TikTok Studio if any Korean IP, DNS, WebRTC, IPv6, locale, or timezone signal remains unresolved.

---

## R4 — Inspect a real TikTok Studio export

**Problem:** The actual export columns, identifiers, granularity, time semantics, and retention representation are unknown. Designing columns before seeing the export would be speculative.

**Required work:**

1. Export a representative Analytics period from TikTok Studio web on the dedicated MacBook.
2. Record the UI section, selected range, account timezone, export time, and file type.
3. Inventory every file/sheet and exact source column name.
4. Classify each field as account-level, content-level, viewer-level aggregate, snapshot, period value, or cumulative value.
5. Verify whether post identifiers map reliably to `contents.tiktok_url`.
6. Determine the actual availability and representation of:
   - views;
   - profile views;
   - average watch time;
   - completion rate;
   - retention/drop-off;
   - unique and returning viewers;
   - per-post new followers;
   - traffic sources and search terms.
7. Check nullability, rounding, percentage units, duplicate rows, locale-dependent numbers, attribution opacity, and timezone semantics.
8. Do not commit private account exports or preserve credentials/session data.

**Completion condition:** A bounded capability and field mapping is available from the real export. If stable identifiers or time semantics are absent, record the gap and stop instead of guessing a schema.

---

## R5 — Finalize and implement the minimum Studio measurement contract

**Trigger:** Start only after R4 is complete.

**Required decisions:**

1. Keep existing TikWM `content_results` checkpoints source-specific unless Studio observations share compatible windows and semantics.
2. Use a separate Studio observation owner when source meaning, update cadence, or granularity differs.
3. Keep account-level profile views separate from content-level observations.
4. Treat views as funnel-entry volume and watch time, completion, retention, engagement, viewer mix, and new followers as diagnostics.
5. Label ratios made from unjoined account/content aggregates as directional, never as user-level conversion rates.
6. Normalize only fields that answer a repeated operating decision; retain bounded raw source data only for provenance and import debugging.
7. Do not add a retention-curve representation unless the export supplies it and a repeated decision requires it.

**Implementation after approval:**

- add the minimal schema to `db/schema.sql`;
- add an offline, idempotent importer under `scripts/`;
- add matching schema and importer tests;
- update viewer queries only for approved operating outputs;
- update the measurement contract from verified source semantics.

**Importer requirements:**

- accept explicit export and database paths;
- make no TikTok network request;
- validate headers, units, dates, percentages, source keys, and post mappings before insertion;
- separate account and content observations;
- preserve windows and timezones;
- make repeated import idempotent;
- fail without a partial commit;
- never print or store credentials, cookies, or session data.

**Verification:**

- `node --test db/tests/schema.test.mjs`;
- `python3 -m unittest discover -s tests -p 'test_*.py'`;
- the existing viewer tests;
- `git diff --check`;
- confirmation that private exports, credentials, runtime databases, and generated local artifacts remain untracked.

---

## R6 — Apply final ownership cleanup in one batch

**Trigger:** R1 and R2 are decided, and R5 has either been completed or explicitly deferred with its limitations preserved.

**Required work:**

- `docs/marketing-funnel.md`: own the accepted four-event funnel, qualification definition, phase applicability, measurement contract, responsibility boundary, and bottleneck model;
- `docs/hypothesis-loop.md`: own hypothesis lineage, evidence use, branching, and any approved diagnosis relationship;
- `AGENTS.md`: retain imperative operating workflow, authority, safety, and scheduled behavior without redefining the funnel;
- `README.md`: retain only a concise project summary and owner map;
- `db/schema.sql`: own only approved storage structures.

Remove obsolete mixed funnel stages, separate follower-funnel proposals, repeated hypothesis/execution definitions, and stale measurement claims instead of maintaining compatibility text.

**Completion condition:** Consistency searches and relevant tests show one semantic owner for each approved rule and no obsolete parallel model remains.
