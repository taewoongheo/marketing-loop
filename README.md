# env marketing loop

A local workspace for autonomously producing and improving env's organic TikTok slideshow content.

## Goal

The final goal is to create increasingly viral content by learning from editorial feedback and published performance.

The two primary optimization axes are:

- **Message strategy:** what should persuade the audience.
- **Copywriting:** how that message should be expressed within the user-controlled fixed visual format.

The fixed slideshow structure and its local editor live in `renderer/slideshow/`. The rest of this repository owns the marketing knowledge, evidence, and learning loop. Project-wide operating rules live in `AGENTS.md`; the detailed hypothesis lineage model lives in `docs/hypothesis-loop.md`.

## Structure

```text
marketing-loop/
├── AGENTS.md                         agent operating contract
├── README.md                         human-facing project map
├── .gitignore                        local/generated file exclusions
│
├── docs/
│   └── hypothesis-loop.md            hypothesis branching and delayed evidence
│
├── context/                          stable decision inputs
│   ├── product.md                    product truth and claim boundaries
│   └── user-language.md              collected expressions and provenance
│
├── messages/                         persuasion strategy
│   └── msg-<message-name>/           versions; immutable after first content use
│       ├── v1.md
│       └── ...
│
├── db/                               final evidence
│   ├── schema.sql                    database structure
│   └── hypothesis-loop.sqlite         local runtime database
│
├── viewer/
│   └── hypothesis_tree/               read-only local lineage monitor
│       ├── app.py                     SQLite API and local server
│       └── index.html                 tree and checkpoint interface
│
├── renderer/                         visual production implementations
│   └── slideshow/                    local slideshow editor and renderer
│       ├── src/                      editor and browser rendering code
│       ├── contents/                 saved editable content JSON
│       ├── templates/                colocated format packages
│       │   └── <format-id>/          current example: denzel/
│       │       ├── template.json     fixed visual structure
│       │       ├── copywriting/      versioned format-copy owner
│       │       │   ├── v1.md
│       │       │   └── ...
│       │       ├── imagery/          versioned visual-expression owner
│       │       │   ├── v1.md
│       │       │   └── ...
│       │       ├── materials.md      optional approved content inputs
│       │       └── references/       ordered reference screenshots
│       └── public/assets/             assets required by those templates
│
└── .hermes/                          non-runtime Hermes planning artifacts
    └── plans/

External owners — not inside this repository
└── ~/.hermes/profiles/marketing-env/
    ├── SOUL.md                        dedicated agent identity
    └── memories/MEMORY.md             approved compact lessons; created on first save
```

- **`AGENTS.md`** owns the rules for operating this project.
- **`README.md`** maps the system and points to each source of truth.
- **`docs/hypothesis-loop.md`** owns the detailed hypothesis-branch and delayed-evidence operating model.
- **`context/`** holds stable inputs used to make content decisions.
  - **`product.md`** owns product truth, market scope, positioning, and claim boundaries.
  - **`user-language.md`** stores project-wide collected expressions, situations, sources, and confidence without interpreting them.
- **`messages/`** holds explicitly versioned target situations, problem patterns, belief shifts, persuasion logic, resistance and response, product roles, and evidence limits. A version's generation-affecting meaning becomes immutable after content first references it.
- **`db/`** holds the exact schema and local runtime record of hypotheses, generated content, observed results, and evidence links.
- **`viewer/hypothesis_tree/`** derives a read-only tree from the runtime database. It owns no hypothesis state and cannot replace SQLite as the evidence source.
- **`.hermes/plans/`** holds implementation plans, not runtime marketing knowledge.
- **`renderer/slideshow/`** owns slideshow production. Each `templates/<format-id>/` package colocates its visual `template.json`, versioned language rules under `copywriting/`, versioned image-expression and generation rules under `imagery/`, optional format-specific `materials.md`, and ordered `references/`; generated editable content belongs in `contents/`. Copywriting owns no visual tone, and imagery consumes approved copy and live template slots without duplicating either. Each format defines its own materials structure when it needs one.
- **Profile `SOUL.md`** owns the dedicated agent identity.
- **Profile `MEMORY.md`** owns approved compact lessons that must persist across sessions.
- **Hermes skills** own reusable procedures.

## Slideshow editor

Install and run the isolated renderer package from the repository root:

```bash
npm --prefix renderer/slideshow ci
npm run renderer:slideshow
```

The editor starts with a blank slide. It saves editable content JSON to `renderer/slideshow/contents/` through a small Vite middleware, loads format-package templates from `renderer/slideshow/templates/`, and saves or imports template JSON through the browser file picker so colocated format context is never overwritten. It also imports compatible content JSON from the browser and exports either the current PNG or a ZIP of all slides. The renderer does not run a separate application server.

## Hypothesis tree viewer

Run the read-only local monitor from the repository root:

```bash
npm run viewer:hypothesis-tree
```

Open `http://127.0.0.1:4174`. The viewer derives active, branched, and closed node states together with direct content, publication state, result checkpoints, and child-creation evidence from `db/hypothesis-loop.sqlite`. It exposes no write endpoint.
