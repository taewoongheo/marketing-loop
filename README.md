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
├── learning.md                       unresolved cross-content lessons
├── .gitignore                        local/generated file exclusions
│
├── docs/
│   └── hypothesis-loop.md            hypothesis branching and delayed evidence
│
├── context/                          stable decision inputs
│   ├── product.md                    product truth
│   ├── audience.md                   target understanding
│   ├── user-language.md              audience language evidence
│   └── voice.md                      shared English voice
│
├── messages/                         persuasion strategy
│   └── <message-id>/                 immutable versions of one message
│       ├── v1.md
│       └── ...
│
├── formats/                          template-coupled copywriting systems
│   └── <format-id>/                  one analyzed format; current example: list/
│       ├── guide.md                  format-copy knowledge
│       └── references/               user-selected screenshots in slide order
│           ├── 1.png
│           ├── 2.png
│           └── ...
│
├── db/                               final evidence
│   ├── schema.sql                    database structure
│   └── hypothesis-loop.sqlite         local runtime database
│
├── renderer/                         visual production implementations
│   └── slideshow/                    local slideshow editor and renderer
│       ├── src/                      editor and browser rendering code
│       ├── contents/                 saved editable content JSON
│       ├── templates/                fixed visual JSON structures
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
- **`learning.md`** holds unresolved lessons that may later move to a permanent owner.
- **`docs/hypothesis-loop.md`** owns the detailed hypothesis-branch and delayed-evidence operating model.
- **`context/`** holds stable inputs used to make content decisions.
  - **`product.md`** is the source of product truth.
  - **`audience.md`** is the source of target-audience understanding.
  - **`user-language.md`** is the source of audience-language evidence.
  - **`voice.md`** is the source of shared English voice rules.
- **`messages/`** holds immutable, explicitly versioned persuasion-message definitions.
- **`formats/`** holds the copywriting systems tied to visual templates.
  - **`guide.md`** describes how a format communicates.
  - **`references/`** preserves the ordered images used to analyze that format.
- **`db/`** holds the exact schema and local runtime record of hypotheses, generated content, observed results, and evidence links.
- **`.hermes/plans/`** holds implementation plans, not runtime marketing knowledge.
- **`renderer/slideshow/`** owns slideshow visual implementation and rendering. Templates live in `templates/`; generated editable content belongs in `contents/`.
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
