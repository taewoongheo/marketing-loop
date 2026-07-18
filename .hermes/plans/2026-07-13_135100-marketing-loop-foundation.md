# env Marketing Loop Folder Plan — Superseded

**Status:** Superseded pre-refactor planning artifact. Everything below records the architecture proposed at that time and is non-normative; its paths and ownership statements must not be used as current instructions. `AGENTS.md`, `README.md`, `docs/hypothesis-loop.md`, and `db/schema.sql` are authoritative for the current project.

**Goal:** Keep durable env marketing knowledge and evidence in their project owners while `renderer/slideshow/` owns visual templates, editable content JSON, and rendered images.

---

## 1. Minimal proposed structure

```text
marketing-loop/
├── AGENTS.md
├── README.md
├── .gitignore
│
├── context/
│   ├── product.md
│   ├── audience.md
│   ├── user-language.md
│   └── voice.md
│
├── messages/
│   └── msg-001-<slug>.md
│
├── formats/
│   └── list.md
│
├── learning.md
│
└── db/
    ├── schema.sql
    └── marketing.sqlite      # local runtime data; gitignored
```

Not included initially:

- `package.json`
- `scripts/`
- `messages/active.md`
- `formats/active.md`
- `learning/` directory or separate candidate/approved files
- `content/drafts/`
- `content/approved/`
- renderer implementation details inside marketing strategy files
- workflow, prompt, schema-registry, or automation-builder directories

---

## 2. Hermes profile context outside this project

The current Hermes profile is `marketing-env`. Agent identity and built-in memory belong to the profile, not the repository:

```text
~/.hermes/profiles/marketing-env/
├── SOUL.md
└── memories/
    └── MEMORY.md
```

Current live inspection shows that `SOUL.md` already exists and defines this profile as env's dedicated marketing collaborator. The `memories/` directory exists but `MEMORY.md` is absent because the memory store is empty. Hermes reads a missing memory file as empty and creates it on the first memory-tool write.

### `SOUL.md`

The durable identity of the `marketing-env` agent:

- env-specific marketing collaborator identity;
- broad mission and scope;
- default posture toward truth, ownership, approval, and learning;
- boundaries that should apply across every session under this profile.

`SOUL.md` is edited as an explicit profile file change. It is not part of the repository and must not be duplicated inside `marketing-loop`.

### `MEMORY.md`

Profile-wide agent notes:

- stable environment facts;
- cross-session conventions not already owned by project context;
- tool quirks and reusable lessons that should always be present.

Limit in the current built-in backend: 2,200 characters.

### What does not belong in either file

- Product facts already owned by `context/product.md`.
- Project operating rules already owned by `AGENTS.md`.
- Raw content or performance data in SQLite.
- One-off feedback.
- Detailed procedures that belong in a Hermes skill.

The official Hermes memory guidance explicitly says not to duplicate information already stored in context files.

`USER.md` is intentionally unused unless a future need emerges for a separate user-profile store.

---

## 3. `AGENTS.md` versus Hermes profile context

### `AGENTS.md`

Purpose: the operating contract for this repository.

It should contain:

- source-of-truth ownership;
- user/assistant decision rights;
- the required direction-approval gate;
- the copy approval → renderer handoff → final project → Telegram → TikTok workflow;
- claim-safety rules;
- the boundary between marketing knowledge and `renderer/slideshow/`;
- the rule that generalization requires user approval;
- instructions for reading the current message, format analysis, template, and DB history.

Hermes loads the root `AGENTS.md` when a session starts in this project. Current official docs also state that nested `AGENTS.md` files are progressively discovered when tools access those subdirectories.

`AGENTS.md` is not automatically maintained by the Hermes memory backend. The agent can edit it with normal file tools when a durable project rule changes. For this project, such edits should be proposed and approved by the user before being made permanent.

It is not a learning log and should remain concise.

### Difference from `MEMORY.md`

| | `AGENTS.md` | `MEMORY.md` |
|---|---|---|
| Scope | This repository | Entire `marketing-env` profile |
| Owner | Project | Hermes profile |
| Typical content | Operating rules, source ownership, project boundaries | Stable environment facts and cross-project notes |
| Version control | Yes | No |
| Capacity | Context-file limit, currently 20,000 chars by default | 2,200 chars |
| Updated by | Explicit file edit | `memory` tool/background review |
| Suitable for env product facts | No; point to `context/` | No |
| Suitable for project workflow | Yes | Usually no, to avoid duplication |

---

## 4. Root project files

### `AGENTS.md`

Agent-facing project contract described above.

### `README.md`

Human-facing overview:

- project purpose;
- folder ownership map;
- daily collaboration lifecycle;
- DB record timing;
- relationship with the local `renderer/slideshow/` implementation;
- how final project paths, Telegram delivery, TikTok URLs, and performance collection connect.

It explains owners but does not repeat their facts or rules.

### `.gitignore`

Ignore:

- `db/hypothesis-loop.sqlite`;
- SQLite `-wal`, `-shm`, and journal files;
- local API credentials;
- temporary handoff payloads;
- macOS files.

### Why there is no `package.json`

The initial proposal used package scripts to make DB operations repeatable. That indirection is unnecessary when the assistant is the operator and can use `sqlite3` directly.

For the initial version:

- initialize with `sqlite3 db/hypothesis-loop.sqlite < db/schema.sql`;
- modify/query with explicit SQLite commands or a small temporary script when needed;
- verify with `PRAGMA foreign_key_check` and focused SQL queries.

Only add a durable script later if the same multi-step operation repeatedly causes errors. Even then, evaluate whether a Hermes skill is the better owner of the procedure.

---

## 5. `context/`

### `context/product.md`

Sole owner of verified env capabilities, exact behavior, supported claims, and claim boundaries.

### `context/audience.md`

Sole owner of target users, situations, behaviors, motivations, and clearly labeled assumptions.

### `context/user-language.md`

Sole owner of observed user language and provenance. It must distinguish direct env-user evidence from desk research.

### `context/voice.md`

Sole owner of brand-wide English tone, rhythm, vocabulary, and recurring language constraints.

Content-specific edits do not belong in these files.

---

## 6. `messages/`

Each durable persuasion hypothesis gets one stable file:

```text
messages/msg-001-setup-is-not-the-work/v1.md
messages/msg-002-<next-message>/v1.md
```

A message file owns:

- target situation;
- current belief;
- intended belief shift;
- core perspective;
- persuasion mechanism;
- why env fits;
- evidence limits and prohibited exaggerations;
- current status such as `testing`, `promising`, `validated`, or `retired`.

### Why there is no `messages/active.md`

The active/recently tested message can be derived from final content records ordered by publication or creation time. A separate pointer creates synchronization risk without adding information.

Before the first final content for a brand-new message exists, the current conversation and the message file being discussed are sufficient.

The DB stores the stable message ID used by every final content item, so historical comparisons remain possible.

---

## 7. `formats/`

Initial structure:

```text
formats/list/guide.md
```

The filename aligns with the renderer template ID:

```text
renderer/slideshow/templates/list.json
```

### Sole responsibility of `renderer/slideshow/templates/list.json`

- slide count and order;
- canvas dimensions;
- image/text layer geometry;
- text positions and widths;
- fonts, sizes, weights, colors, and line height;
- image crop and placement;
- editable properties;
- concrete renderer implementation.

`marketing-loop` must read the live template when generating content and must not duplicate those values.

### Responsibility of `formats/list/guide.md`

One merged format-analysis document containing:

- renderer template ID/path;
- viral reference source and provenance;
- structural/content technique observed in the reference;
- hook mechanism;
- narrative or persuasion progression;
- why the format may hold attention;
- how to adapt the technique to env without copying wording or subject matter;
- hypotheses currently being tested;
- content IDs that provide supporting or conflicting results.

It must not restate slide count, coordinates, font values, layer widths, or other implementation details available in `list.json`.

### Why `guide.md` and `references.md` are merged

For the first format, `formats/list/guide.md` keeps the format-specific observation and adaptation reasoning together while ordered reference images live beside it in `formats/list/references/`.

If a future format has many raw references, a subdirectory can be introduced only when the real volume requires it.

### Why there is no `formats/active.md`

The template ID used by the latest content is queryable from SQLite. New directions are agreed in conversation. A separate active pointer would duplicate state.

### Exact template identity in the DB

For every final content item, store:

- template ID;
- template path;
- SHA-256 of the exact template used.

This preserves historical reproducibility even if `list.json` changes later, without maintaining a duplicate layout guide.

---

## 8. `db/`

### `db/schema.sql`

A small, reviewable source of truth for SQLite structure. This remains useful even without `package.json`, because it allows the DB to be recreated and inspected.

### `db/hypothesis-loop.sqlite`

Local, gitignored runtime data.

It records only publication-ready final content, not draft history.

Core records:

1. Final content
   - content ID;
   - problem/hook/core perspective;
   - exact final slide copy and caption;
   - message ID;
   - template ID/path/hash;
   - final project path/hash;
   - Telegram delivery time;
   - TikTok URL and publication time.

2. Performance snapshots
   - 24h, 48h, and 72h collection points;
   - observable metrics;
   - raw collector output and source.

3. Content result interpretation
   - observed result summary;
   - message-specific interpretation;
   - format-specific interpretation;
   - confidence/limitations;
   - whether the result supports or contradicts the original hypothesis.

The DB therefore provides the evidence needed to find repeated lessons without a separate candidate backlog.

---

## 9. `learning.md` and learning flow

Use one `learning.md` as a temporary review inbox for patterns that may generalize across content. Do not split it into candidate/approved files.

`learning.md` is not the final owner of an approved rule. After user approval, move the rule to its proper owner and remove the temporary candidate from `learning.md`.

### Trigger A: direct user correction during content creation

1. Apply it to the current content immediately.
2. Decide whether it is one-off or potentially durable.
3. If the user explicitly identifies it as a durable rule, propose the exact generalized rule and intended owner immediately; save only after approval.
4. If it is not yet general enough but may repeat, add a compact candidate to `learning.md` only after a second supporting occurrence or other meaningful cross-content evidence.

Possible owners:

- agent identity or broad profile mission → Hermes `SOUL.md`;
- stable environment/tool fact → Hermes `MEMORY.md`;
- project operating rule → `AGENTS.md`;
- product fact → `context/product.md`;
- audience fact → `context/audience.md`;
- voice rule → `context/voice.md`;
- persuasion insight → relevant `messages/<message-id>/v<version>.md`;
- format insight → `formats/<format-id>/guide.md`;
- reusable multi-step procedure → Hermes skill.

### Trigger B: performance validates or contradicts a hypothesis

1. Store the content-specific observation and interpretation in SQLite.
2. Compare it with previous content records using the same message/template.
3. If evidence is strong enough for immediate promotion, propose a generalized update and intended owner.
4. If it is promising but not yet strong enough, record one compact candidate in `learning.md` with the supporting content IDs and what evidence is still missing.
5. After user approval, update the proper owner and remove the candidate from `learning.md`.

### Required shape of a `learning.md` candidate

- candidate lesson;
- scope: user preference, project rule, voice, message, format, or procedure;
- supporting content IDs or explicit correction references;
- counterexample or uncertainty, if any;
- next evidence needed;
- intended final owner if approved.

Do not copy performance metrics into this file; cite content IDs and query SQLite. Do not add one-off corrections, raw feedback, already-approved rules, or completed-work history.

---

## 10. Final ownership boundary

| Information | Owner |
|---|---|
| Agent identity and broad profile mission | Hermes profile `SOUL.md` |
| Profile-wide environment notes | Hermes profile `MEMORY.md` |
| Project operating contract | `marketing-loop/AGENTS.md` |
| Product/audience/language/voice | `marketing-loop/context/` |
| Persuasion hypotheses | `marketing-loop/messages/` |
| Viral-format analysis and adaptation reasoning | `formats/<format-id>/guide.md` |
| Repeated, not-yet-promoted lesson candidates | `marketing-loop/learning.md` |
| Hypotheses, generated content, results, and evidence | `marketing-loop/db/hypothesis-loop.sqlite` |
| SQLite structure | `marketing-loop/db/schema.sql` |
| Slide count, placement, typography, editable layers | `renderer/slideshow/templates/*.json` |
| Editable final project | `renderer/slideshow/contents/*.json` |
| Rendered images | `renderer/slideshow/` |
| Reusable procedures | Hermes skills |

---

## 11. Learning promotion rule

`learning.md` remains intentionally small. It is a temporary holding area, not a permanent knowledge base. The final knowledge base is distributed among the correct owners (`SOUL.md`, `MEMORY.md`, `AGENTS.md`, `context/`, `messages/`, `formats/`, or a skill). Review and clear promoted or disproven candidates as part of performance review.
