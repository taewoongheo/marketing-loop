# LIFT CODE marketing loop

A local system for producing and improving LIFT CODE's U.S.-English organic TikTok marketing. Its direct objective is qualified App Store inflow; during prelaunch it improves the nearest observable upstream constraint without mentioning or promoting the unreleased app.

## How it works

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

1. diagnoses the current bottleneck and selects a hypothesis action;
2. selects `slideshow` or `video` and one available format;
3. reads product truth, accepted research, the selected message and copywriting version, format references, and a bounded set of prior same-format projects;
4. drafts the final copy and obtains approval in interactive work;
5. builds and validates a native editable project;
6. records the publication-ready copy, project identity, medium, format, and hypothesis lineage;
7. delivers the final media to Telegram for manual TikTok publication.

The user supplies the published TikTok URL. Publication time and later results are then attached to the existing content record. There is currently no content-production cron registered.

### Performance collection

Public post performance is collected from TikWM at 24, 48, and 72 hours after publication:

- views;
- likes;
- comments;
- shares;
- saves.

The collector runs hourly but writes only a due checkpoint; it does not create hourly metric snapshots. A separate low-frequency collector can record the public follower count once the operating account handle is available.

TikTok Studio remains the first-party manual source for profile views, watch quality, per-post follows, and viewer/follower composition. These private metrics are not inferred from public engagement or scraper data.

### Research

An hourly autonomous research loop selects at most three decision-relevant questions from the current project state. Questions may cover audience language, strength-training expertise, marketing methods, formats, references, measurement, platform changes, or operational reliability.

Each question is recorded before research and must end as a bounded finding, duplicate, no-finding result, outside-scope result, or failure. Supported findings may update exactly one existing owner; structural, credential, permission, or paid-cost needs are escalated instead. Research evidence and notifications are stored in `db/research.sqlite` through `scripts/research_store.py`.

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
| Hourly open-ended research | Every hour at minute `00` | Run the research lifecycle and send only findings or required actions to Telegram |
| Hourly due content results | Every hour at minute `05` | Insert due 24h/48h/72h TikWM checkpoints; remain silent on success |

Follower collection is intentionally unscheduled until the operating TikTok handle is supplied. TikTok Studio checks are deferred until content is being published and account analytics exist.

## Sources of truth

- `AGENTS.md`: operating rules, approval boundaries, ownership, and scheduled autonomy.
- `docs/marketing-funnel.md`: funnel stages, measurement contract, and bottleneck selection.
- `docs/hypothesis-loop.md`: hypothesis branching and delayed-evidence rules.
- `docs/research-loop.md`: research selection, review, adoption, and notification lifecycle.
- `context/`: product truth and bounded policy entrypoints for imagery, expertise, audience language, and marketing methods.
- `messages/`: versioned message strategies.
- `renderer/<medium>/formats/<format-id>/`: format copywriting, ordered execution references, and local editable projects.
- `db/hypothesis-loop.sqlite`: hypotheses, contents, publication details, public results, follower observations, and evidence links.
- `db/research.sqlite`: research lifecycle, sources, findings, reviews, accepted knowledge, and notifications.
- `scripts/collect_due_content_results.py`: delayed public post checkpoints.
- `scripts/collect_account_followers.py`: low-frequency public follower observations.
- `scripts/research_store.py`: the sole Research DB lifecycle writer.

Runtime SQLite databases, credentials, editable projects, production assets, renders, and TikTok Studio exports are local and Git-ignored.
