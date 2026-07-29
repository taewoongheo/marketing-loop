# LIFT CODE marketing loop

A local system for gathering a qualified U.S.-English TikTok audience and turning that attention into qualified App Store inflow for LIFT CODE. During prelaunch it does this without mentioning the unreleased app: it identifies what the target audience needs, collects and synthesizes the necessary knowledge, and delivers the result in an immediately understandable or usable form.

The product problem defines the content territory: choosing a suitable strength-training Program, judging whether it is working, and reducing recurring progression decisions. Research volume, generic fitness information, and follower growth are inputs or diagnostics—not the final purpose.

## What it does

- discovers audience needs, language, evidence, formats, and distribution methods;
- turns relevant evidence into bounded, useful conclusions instead of accumulating information for its own sake;
- produces one native slideshow or video from the current funnel and hypothesis state;
- sends publication-ready media to Telegram while leaving TikTok publication to the user;
- collects delayed public results and uses them to continue, branch, close, or adopt message and copywriting hypotheses.

## How it works

```text
Product problem + audience need
→ targeted research and evidence synthesis
→ immediately useful content
→ qualified audience attention and trust
→ manual TikTok publication
→ delayed observations
→ better research, message, and copywriting decisions
→ qualified App Store inflow after launch
```

### Funnel diagnosis

The system reads the current funnel evidence, launch constraints, product truth, and prior results to identify the nearest observable and actionable bottleneck. Missing data is treated as a measurement gap, not proof that a stage is the bottleneck.

The current prelaunch path is:

```text
TikTok content view → TikTok profile view
```

Bio-link clicks and App Store product-page views remain inactive until the link and App Store destination exist. The 1,000-follower requirement is tracked as a channel-access constraint, not as the final goal.

### Hypothesis loop

Each content belongs to one testable hypothesis on exactly one axis:

- **Message:** what audience perception or belief should change.
- **Copywriting:** how that message is expressed.

The system evaluates active hypothesis leaves against delayed evidence, proposes whether to continue, close, branch, or adopt a supported rule, and records the confirmed lineage in SQLite. Funnel stages, metrics, medium, format, and visual execution are not hypothesis axes.

### Content production

For each content, the system:

1. runs a content-preflight evidence check/research cycle, diagnoses the current bottleneck, and selects a hypothesis action;
2. selects `slideshow` or `video` and one available format;
3. reads product truth, accepted research, the selected message and copywriting version, format references, and a bounded set of prior same-format projects;
4. drafts the final copy and obtains approval in interactive work;
5. builds and validates a native editable project;
6. records the publication-ready copy, project identity, medium, format, and hypothesis lineage;
7. delivers the final media to Telegram for manual TikTok publication.

The user supplies the published TikTok URL. Publication time and later results are then attached to the existing content record. Interactive production keeps the hypothesis and copy approval gates; the scheduled daily run uses the autonomous-production exception in `AGENTS.md` and still never publishes to TikTok.

### Performance collection

Public post performance is collected from TikWM at 24, 48, and 72 hours after publication:

- views;
- likes;
- comments;
- shares;
- saves.

The collector runs hourly but writes only a due checkpoint; it does not create hourly metric snapshots. A newly inserted checkpoint triggers one bounded result-review research cycle, while a no-op collector tick starts no reasoning agent. Public follower observations use a separate collector with a 24-hour freshness guard.

TikTok Studio remains the first-party manual source for profile views, watch quality, per-post follows, and viewer/follower composition. These private metrics are not inferred from public engagement or scraper data.

### Event-driven research

Research is not an independent hourly activity. It runs from a real decision event: every content cycle performs `content_preflight`, each newly inserted 24h/48h/72h checkpoint triggers `result_review`, and an explicit interactive request may use `manual`. Every run asks what would most improve the current qualified-audience or content decision, reads accepted evidence and prior quality feedback first, then actively investigates at most three independent bounded questions—or zero when current evidence is sufficient.

Each selected question is recorded before investigation and must end as a bounded finding, duplicate, no-finding result, outside-scope result, or failure. A result review treats one checkpoint as diagnostic evidence, not causal proof, and separates sample maturity, distribution noise, measurement gaps, message, copywriting, topic, and execution conditions. Supported findings update exactly one valid owner. Research evidence, reviews, adoptions, user quality feedback, and durable owner-change notifications are stored in `db/research.sqlite` through `scripts/research_store.py`.

After each event run, Telegram receives a compact Korean digest with the run/question/finding IDs, sources and limitations, disposition and owner/action, system-integrity result, and the resulting content-decision change. Feedback can be recorded as `useful`, `weak_evidence`, `irrelevant`, `overstated`, or `correction`, so later runs can improve selection and evidence thresholds without rewriting history.

### Autonomous system improvement

The agent has standing authority to improve this system's structure, content, schemas, workflows, methods, jobs, dependencies, and owner map. Every change must preserve four invariants: MECE coverage, exactly one documented owner for every responsibility, no unresolved logical conflict, and database storage for unbounded accumulated observations, evidence, results, findings, provenance, events, and history. Files remain bounded owners for current policy, product context, schemas, code, configuration, immutable generation contracts, and media assets.

Structural change alone does not require approval. The agent escalates only external credentials or permissions, paid spend, destructive or irreversible migration, decisions outside this marketing workspace, or a consistency risk it cannot safely resolve.

### Automated integrity checks

Before the hourly results collector or exact-minute production job mutates state, `scripts/system_integrity.py` checks both SQLite databases, foreign keys and schema versions, terminal research states, expired leases, required owners, event-driven scheduler topology, previous job failures, and Telegram delivery. Event research separately checks semantic problems such as duplicate or missing ownership, logical conflicts, stale workflow instructions, unreliable transitions, and missing capabilities, then applies the smallest authorized verified correction.

This automation intentionally runs inside existing Hermes Scheduler jobs. No launchd service, daemon, heartbeat, or external Runtime Watchdog is installed, so it does not claim to detect Hermes Scheduler itself being stopped.

### External data sources

| Source | Purpose | Current use |
| --- | --- | --- |
| TikWM public API | Published-post checkpoints and public follower observations | Primary public funnel/diagnostic source |
| Apify TikTok actors | Public content, author, comment, search, and reference research | Primary TikTok research provider |
| Bright Data TikTok datasets | Public TikTok research fallback | Configured; used only when Apify is insufficient |
| TikTok Studio | Private operating-account analytics | Manual, after account analytics exist |
| App Store Connect Analytics Reports | Product-page views and downstream App Store outcomes | Deferred until the App Store destination is live |

TikTok Display API is not used. Public research providers never receive the operating account's password, cookies, OAuth token, or authenticated session.

## Automation

The Hermes scheduler record is the authority for exact timing. The current runtime snapshot is:

| Job | Schedule | Purpose |
| --- | --- | --- |
| Hourly due content results | Every hour at minute `05` | Run integrity checks; insert due 24h/48h/72h TikWM checkpoints; start result-review research only after a new insertion |
| Daily publication-ready content | Every day at `07:00` KST | Run integrity and preflight research, diagnose the funnel, create and verify one content, deliver the exact media and research digest to Telegram; never publish |

Follower collection has no separate cron: production reuses an observation younger than 24 hours and refreshes it only when stale. TikTok Studio checks are deferred until content is being published and account analytics exist.

The daily job uses a script-only scheduler gate before launching its reasoning agent. If the machine wakes after the configured minute, the gate exits silently and abandons the missed slot instead of creating catch-up content.

## Files and responsibilities

| Owner | Responsibility |
| --- | --- |
| `AGENTS.md` | Operating rules, authority boundaries, owner map, content workflow, and scheduled autonomy |
| `context/product.md` | Marketing-facing product truth, target audience, delegated decisions, value, and claim boundaries |
| `context/imagery.md` | Current account-wide imagery and image-generation policy |
| `context/expertise.md`, `context/user-language.md`, `context/marketing-methods.md` | Retrieval and use policy for accepted research knowledge |
| `docs/marketing-funnel.md` | Funnel stages, measurement contract, responsibility boundary, and bottleneck selection |
| `docs/hypothesis-loop.md` | Message/copywriting hypothesis lineage and delayed-evidence decisions |
| `docs/research-loop.md` | Event-driven research selection, review, routing, quality feedback, adoption, delivery, and integrity rules |
| `messages/` | Versioned message strategies |
| `renderer/<medium>/formats/<format-id>/` | Format copywriting, ordered references, editable native projects, and renderer-specific execution |
| `db/hypothesis-loop.sqlite` | Hypotheses, content identities and copy snapshots, publication links, results, and follower observations |
| `db/research.sqlite` | Research runs, questions, sources, findings, reviews, quality feedback, accepted knowledge, and notification outbox |
| `scripts/research_store.py` | Sole writer for the Research DB lifecycle |
| `scripts/collect_due_content_results.py` | Due 24h/48h/72h public post collection |
| `scripts/collect_account_followers.py` | Freshness-guarded public follower collection |
| `scripts/run_event_research.py` | Bounded result-review/manual research-agent launcher and digest contract |
| `scripts/system_integrity.py` | Deterministic scheduler-internal integrity checks |
| `scripts/run_scheduled_content_production.py` | Exact-minute gate, pre-mutation integrity check, and autonomous daily production/preflight launch |
| Hermes `marketing-liftcode` cron records | Exact schedules, delivery route, workdir, and script or prompt linkage |
| Hermes `marketing-liftcode` profile config | Runtime model, provider, and tool configuration |
| Hermes profile script wrappers | Scheduler-safe entrypoints into repository collectors and production |

Runtime SQLite databases, credentials, editable projects, production assets, renders, and TikTok Studio exports are local and Git-ignored.
