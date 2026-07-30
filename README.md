# LIFT CODE marketing loop

A local system for gathering a relevant U.S.-English TikTok audience and turning that reach into qualified App Store inflow for LIFT CODE. During prelaunch it does this without mentioning the unreleased app: it identifies audience needs and creates standalone value that is immediately understandable or experienceable. Value may be practical, explanatory, emotional, or entertaining; the system is not limited to tips.

The product problem defines the content territory: choosing a suitable strength-training Program, judging whether it is working, and reducing recurring progression decisions. Research volume, generic fitness information, and follower growth are inputs or diagnostics—not the final purpose.

## What it does

- discovers audience needs, language, evidence, formats, and distribution methods;
- turns relevant evidence and creative direction into content with standalone audience value;
- produces one native slideshow or video from the current funnel and hypothesis state;
- sends publication-ready media to Telegram while leaving TikTok publication to the user;
- collects delayed public results and uses them to continue, branch, close, or adopt message and copywriting hypotheses.

## How it works

```text
Product problem + audience need
→ targeted research and evidence synthesis
→ content with standalone audience value
→ manual TikTok publication
→ content views and profile views
→ delayed response and audience-fit diagnostics
→ better research, message, and copywriting decisions
→ qualified App Store inflow after launch
```

Attention, trust, and audience qualification are interpretations, not additional funnel events. Watch quality, engagement, follows, and audience composition can support those interpretations but do not replace the measured user path.

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

The user supplies the published TikTok URL. Publication time and later results are then attached to the existing content record. Content production keeps the hypothesis and copy approval gates and never publishes to TikTok.

### Performance collection

TikWM supplies public views, likes, comments, shares, and saves at 24, 48, and 72 hours after publication.

The collector runs hourly but writes only a due checkpoint; it does not create hourly metric snapshots. A newly inserted checkpoint triggers one bounded result-review research cycle, while a no-op collector tick starts no reasoning agent. Public follower observations use a separate collector with a 24-hour freshness guard.

TikTok Studio is the first-party source for profile views, watch quality, per-post follows, and viewer/follower composition. When one of these observations materially blocks a current decision, the assistant creates or reuses a pending measurement request and asks through Telegram for the exact metric, scope, reporting window, and TikTok Studio location. Supplied values are stored with source evidence and limitations; private metrics are never inferred from public counters.

### Event-driven research

Every content cycle performs `content_preflight`, each newly inserted 24h/48h/72h checkpoint triggers `result_review`, and an explicit request may use `manual`. A run asks what would most improve the current audience or content decision, reads accepted evidence and prior quality feedback, and investigates at most three independent bounded questions—or zero when current evidence is sufficient.

Each selected question is recorded before investigation and must end as a bounded finding, duplicate, no-finding result, outside-scope result, or failure. A result review treats one checkpoint as diagnostic evidence, not causal proof, and separates sample maturity, distribution noise, measurement gaps, message, copywriting, topic, and execution conditions. Supported findings update exactly one valid owner. Research evidence, reviews, adoptions, user quality feedback, and durable owner-change notifications are stored in `db/research.sqlite` through `scripts/research_store.py`.

After each event run, Telegram shows only the key metrics, their plain-language meaning, and what changes next. Internal IDs, routing, provenance, and feedback classification remain in SQLite.

### Autonomous system improvement

The agent may improve this system's structure, schemas, workflows, methods, jobs, dependencies, and owner map while preserving MECE coverage, one owner per responsibility, logical consistency, and database storage for accumulating observations and history.

It escalates external credentials or permissions, paid spend, destructive or irreversible data changes, decisions outside this workspace, and consistency risks it cannot safely resolve.

### Automated integrity checks

Before collection or production mutates state, `scripts/system_integrity.py` checks SQLite integrity, lifecycle states, leases, required owners, scheduler topology, job outcomes, and Telegram delivery. It also reports operational-health warnings: hypothesis stagnation, checkpoints without result review, stale TikTok Studio requests, repeated low-yield research outcomes, and unexplained concentration in finding owners or source classes. These are diagnostic warnings rather than mechanical quotas; the agent checks live context before correcting or escalating them.

Event research checks semantic ownership, consistency, transition, and capability defects. The checks run inside existing Hermes Scheduler jobs and therefore cover executions that start, not the availability of the scheduler process itself.

### External data sources

| Source | Purpose | Current use |
| --- | --- | --- |
| TikWM public API | Published-post checkpoints and public follower observations | Primary public funnel/diagnostic source |
| Apify TikTok actors | Public content, author, comment, search, and reference research | Primary TikTok research provider |
| Bright Data TikTok datasets | Public TikTok research fallback | Configured; used only when Apify is insufficient |
| TikTok Studio | Private operating-account analytics | Requested through Telegram when a current decision needs an exact private observation |
| App Store Connect Analytics Reports | Product-page views and downstream App Store outcomes | Deferred until the App Store destination is live |

Public research providers receive no operating-account password, cookie, token, or authenticated session.

## Automation

The Hermes scheduler record is the authority for exact timing. The current runtime snapshot is:

| Job | Schedule | Behavior |
| --- | --- | --- |
| Hourly due content results | Every hour at minute `05` | Run integrity checks; insert due 24h/48h/72h TikWM checkpoints; start result-review research only after a new insertion |

Content production is interactive. Private TikTok Studio observations follow the pending-request lifecycle above.

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
| `db/hypothesis-loop.sqlite` | Hypotheses, content identities and copy snapshots, publication links, public results, TikTok Studio requests, and supplied private observations |
| `db/research.sqlite` | Research runs, questions, sources, findings, reviews, quality feedback, accepted knowledge, and notification outbox |
| `scripts/research_store.py` | Sole writer for the Research DB lifecycle |
| `scripts/collect_due_content_results.py` | Due 24h/48h/72h public post collection |
| `scripts/collect_account_followers.py` | Freshness-guarded public follower collection |
| `scripts/manual_analytics_store.py` | Pending TikTok Studio requests and immutable supplied observations |
| `scripts/run_event_research.py` | Bounded result-review/manual research-agent launcher and digest contract |
| `scripts/system_integrity.py` | Deterministic scheduler-internal integrity checks |
| Hermes `marketing-liftcode` cron records | Exact schedules, delivery route, workdir, and script or prompt linkage |
| Hermes `marketing-liftcode` profile config | Runtime model, provider, and tool configuration |
| Hermes profile script wrappers | Scheduler-safe entrypoints into repository collectors |

Runtime SQLite databases, credentials, editable projects, production assets, renders, and TikTok Studio exports are local and Git-ignored.
