# env marketing loop

A local workspace for autonomously producing and improving env's organic TikTok slideshow content.

## Goal

The final goal is to create content that becomes increasingly viral as the agent learns from editorial feedback and published performance.

The two primary optimization axes are:

1. **Message strategy — how the audience is persuaded**
   - Which problem or tension to surface.
   - What the audience currently believes.
   - What perception or belief should change.
   - Which perspective makes env relevant without forcing the product.

2. **Copywriting format — how the message is expressed inside a reference-derived visual structure**
   - Hook function, wording, specificity, slide roles, information order, rhythm, image-text relationship, product reveal, and caption.
   - The copywriting grammar is analyzed together with the reference and tied to a live `slides-marketing` JSON template.
   - Natural U.S. English, recognizable situations, and enough tension and clarity to earn attention and continued swipes.

The user implements the fixed visual structure as JSON in `slides-marketing`. This repository owns the copywriting grammar and evidence attached to that structure. A visually correct slideshow is not successful if its message does not persuade or its format-copy does not hold attention.

## Project boundary

This repository owns marketing context, message strategy, template-coupled copywriting format analysis, reference evidence, final content records, performance, and pending cross-content lessons.

The renderer is separate:

```text
/Users/taewoongheo/Projects/slides-marketing
```

`slides-marketing` owns templates, image assets, editable project JSON, renderer code, and rendered images. Any marketing context still present there is a legacy copy, not a source of truth.

Hermes profile context is also external:

```text
/Users/taewoongheo/.hermes/profiles/marketing-env/
├── SOUL.md
└── memories/
    └── MEMORY.md
```

## Folder and file responsibilities

### Root files

#### `AGENTS.md`

The project operating contract for the agent. It defines autonomy, user approval boundaries, required context, the creation lifecycle, ownership, renderer boundaries, evidence rules, and learning promotion.

#### `README.md`

The human-facing explanation of the project's goal, structure, workflow, and ownership. It explains the system but is not the source of product facts, copy rules, or results.

#### `learning.md`

A small durable inbox for repeated but not-yet-approved lesson candidates. It stores only the candidate, scope, supporting content IDs or correction references, uncertainty, next evidence needed, and intended final owner. Approved or disproven candidates are removed.

#### `.gitignore`

Excludes the local SQLite database and journals, temporary renderer handoffs, credentials, and macOS files.

### `context/`

Stable inputs used before content decisions.

#### `context/product.md`

Verified env capabilities, exact product behavior, supported claims, prohibited claims, and unverified product assumptions.

#### `context/audience.md`

Priority audience, study situations, current behavior, possible resistance, and clearly labeled audience assumptions.

#### `context/user-language.md`

Observed expressions and their provenance. It distinguishes direct env-user evidence from low-confidence desk research and prevents research language from being presented as testimony.

#### `context/voice.md`

Brand-wide English voice and cross-format language constraints. It owns stable guidance for tone, reader distance, product naming, claims, and language to avoid.

Template-specific hook, progression, and slide-copy rules do not live here; they belong to the relevant format guide. Individual final copy and its result live in SQLite.

### `messages/`

Durable persuasion hypotheses. Each `msg-*.md` file defines a target situation, current belief, intended belief shift, core perspective, persuasion mechanism, why env fits, evidence limits, and current status.

This directory answers: **What are we trying to make the audience believe, and how will that persuasion work?**

Final content records reference the message ID so message performance can be compared over time.

### `formats/`

Each format is a directory:

```text
formats/
└── <format-id>/
    ├── guide.md
    └── references/
```

`guide.md` owns the copywriting grammar tied to a renderer-backed format: reference provenance, hook function, slide roles, information order, sentence density, rhythm, image-text relationship, product reveal, caption approach, adaptation reasoning, current hypotheses, and supporting or conflicting content IDs.

`references/` preserves the screenshots used to derive the format so later sessions can re-check the original hierarchy and progression instead of relying on a compressed description. Source URL, account, capture date, slide order, and known performance context belong in `guide.md`; missing provenance must remain explicit.

Reference screenshots are analysis evidence, not production assets. Images used by the renderer remain in `slides-marketing`.

This directory does not copy coordinates, typography values, image crop, or editable-slot implementation. Those details remain in the live `slides-marketing` template. The guide may describe what each slot accomplishes in the copy progression without duplicating how the slot is implemented.

### `db/`

Structured evidence and final publication records.

#### `db/schema.sql`

The reviewable and reproducible SQLite schema.

#### `db/marketing.sqlite`

The local runtime database. It stores:

- publication-ready final slide copy and caption;
- problem, hook direction, core perspective, and experiment context;
- message, format, and exact template identity;
- final project path and hashes;
- Telegram delivery and TikTok publication details;
- 24h, 48h, and 72h performance snapshots;
- content-level message and format-copy interpretations.

Intermediate drafts are not stored.

### `.hermes/`

Local Hermes planning artifacts. Files here may document implementation planning but are not runtime marketing context or evidence.

## External responsibilities

### Profile `SOUL.md`

Defines the identity and broad mission of the dedicated env marketing agent, including autonomous direction selection and the message/format-copy optimization goal.

### Profile `MEMORY.md`

Stores compact, approved, high-value lessons that should be present in every `marketing-env` session and do not already belong to a more specific project owner. Hermes creates it when the first memory is saved.

### Hermes skills

Store reusable multi-step procedures, such as performance collection or renderer handoff workflows. Skills do not store product facts, content results, or one-off copy preferences.

### `slides-marketing`

Owns the visual production layer:

- `templates/`: slide count, order, text/image slots, geometry, typography, colors, crop, and editable properties;
- `assets/`: renderer image library and visual inputs;
- editable project JSON;
- renderer/editor code;
- final rendered images.

## Content workflow

1. Any user message expressing an intent to create content starts the workflow. No fixed command phrase or additional brief is required.
2. The agent reads product and audience context, message hypotheses, format-copy guides and reference images, live renderer templates, pending learning candidates, and relevant DB results.
3. The agent independently selects the problem, situation, message, format-copy approach, product exposure, experiment boundary, and renderer template.
4. The agent asks a question only if a missing fact blocks truthful, audience-appropriate, or valid copy.
5. The agent drafts to the selected format-copy grammar and the template's real text slots, evaluates both improvement axes internally, and shows one refined final-copy proposal with its caption.
6. The user reviews only the final copy and gives approval or revision feedback. Direction, experiment, and template selection are not separate approval gates.
7. On final-copy approval, the agent creates an editable project with the selected template in `slides-marketing`; no content DB row is created yet.
8. The user fine-tunes the visual project and provides its final path.
9. The agent records the publication-ready final content and exact visual artifact identity, renders it, and sends the images with the approved caption to Telegram when instructed.
10. The user publishes manually to TikTok and returns the URL.
11. Performance is collected at 24, 48, and 72 hours after publication.
12. The agent records observed results separately from interpretation, compares message and format-copy performance with previous content, and proposes evidence-backed improvements.
13. Repeated unresolved lessons may enter `learning.md`; approved lessons move to exactly one final owner.

## Improvement loop

Each new content item should use prior evidence to improve either the message or the template-coupled format-copy while keeping the experiment interpretable:

```text
final copy
→ final visual project
→ TikTok publication
→ 24h / 48h / 72h evidence
→ message and format-copy review
→ next content decision
```

The agent decides what to hold constant and what to change. The user approves the final copy, not the internal experiment plan.

## SQLite

Initialize or recreate the local database directly:

```bash
sqlite3 db/marketing.sqlite < db/schema.sql
```

Check structural integrity:

```bash
sqlite3 db/marketing.sqlite 'PRAGMA foreign_key_check; PRAGMA integrity_check;'
```

The database file and SQLite journals are ignored by Git. `schema.sql` remains reviewable and reproducible.
