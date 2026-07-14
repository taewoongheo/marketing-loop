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
│   └── msg-<message-name>/           immutable versions of one message
│       ├── v1.md
│       └── ...
│
├── db/                               final evidence
│   ├── schema.sql                    database structure
│   └── hypothesis-loop.sqlite         local runtime database
│
├── renderer/                         visual production implementations
│   └── slideshow/                    local slideshow editor and renderer
│       ├── src/                      editor and browser rendering code
│       ├── contents/                 saved editable content JSON
│       ├── templates/                colocated format packages
│       │   └── <format-id>/          current example: list/
│       │       ├── template.json     fixed visual structure
│       │       ├── copywriting.md    format-coupled copywriting owner
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
  - **`user-language.md`** stores collected expressions, situations, sources, and confidence without interpreting them.
- **`messages/`** holds immutable, explicitly versioned target situations, problem patterns, belief shifts, persuasion logic, resistance and response, product roles, and evidence limits.
- **`db/`** holds the exact schema and local runtime record of hypotheses, generated content, observed results, and evidence links.
- **`.hermes/plans/`** holds implementation plans, not runtime marketing knowledge.
- **`renderer/slideshow/`** owns slideshow production. Each `templates/<format-id>/` package colocates its visual `template.json`, format-coupled `copywriting.md`, and ordered `references/`; generated editable content belongs in `contents/`.
- **Profile `SOUL.md`** owns the dedicated agent identity.
- **Profile `MEMORY.md`** owns approved compact lessons that must persist across sessions.
- **Hermes skills** own reusable procedures.

## Slideshow editor

Install and run the isolated renderer package from the repository root:

```bash
npm --prefix renderer/slideshow ci
npm run renderer:slideshow
```

The editor starts with a blank slide. It saves editable content JSON to `renderer/slideshow/contents/`, saves reusable template JSON to `renderer/slideshow/templates/`, and loads both libraries through a small Vite middleware. The editor also imports compatible content JSON from the browser and exports either the current PNG or a ZIP of all slides. The renderer does not run a separate application server.
