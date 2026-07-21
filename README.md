# LIFT CODE marketing loop

A local workspace for autonomously producing and improving LIFT CODE's U.S.-English organic TikTok slideshow content.

## Goals

The workspace pursues three simultaneous goals:

1. Continuously improve **message strategy**: what should persuade the audience.
2. Continuously improve **copywriting**: how that message should be expressed in the slideshow.
3. Grow the LIFT CODE TikTok account to **1,000 followers** while building justified trust in its planned weight-and-rep recommendations.

Message strategy and copywriting are open-ended improvement goals with no terminal threshold. They remain the only two hypothesis axes. The follower target is the finite account-level outcome those improvements should support; follower movement is observed separately and does not by itself prove that a message or copywriting change caused it. Reaching 1,000 followers completes that finite goal but does not stop the two open-ended improvement goals. `AGENTS.md` is the authoritative operating contract for these goals.

The slideshow evidence, self-contained content projects, and local editor live in `renderer/slideshow/`. The rest of this repository owns the marketing knowledge, evidence, and learning loop. Project-wide operating rules live in `AGENTS.md`; the detailed hypothesis lineage model lives in `docs/hypothesis-loop.md`.

## Structure

```text
liftcode-marketing-loop/
├── AGENTS.md                         agent operating contract
├── README.md                         human-facing project map
├── .gitignore                        local/generated file exclusions
│
├── docs/
│   └── hypothesis-loop.md            hypothesis branching and delayed evidence
│
├── context/                          stable decision inputs
│   ├── expertise.md                  accumulating strength-training knowledge
│   ├── imagery.md                    current app/account-wide image guidance
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
├── scripts/
│   └── collect_due_content_results.py shared delayed-metric collector
│
├── viewer/
│   └── hypothesis_tree/               read-only local lineage monitor
│       ├── app.py                     SQLite API and local server
│       └── index.html                 tree and checkpoint interface
│
├── renderer/                         visual production implementations
│   └── slideshow/                    local slideshow editor and renderer
│       ├── formats/
│       │   └── denzel/               one format evidence/content namespace
│       │       ├── copywriting/      versioned format-specific copy owner
│       │       ├── references/       ordered raw layout evidence; local
│       │       └── contents/         local rolling visual examples/current projects
│       ├── src/                      editor and browser rendering code
│       ├── scripts/                  project-based rendering CLI
│       └── public/assets/            reusable production assets
│
└── .hermes/                          non-runtime Hermes planning artifacts
    └── plans/

External owners — not inside this repository
└── ~/.hermes/profiles/marketing-liftcode/
    ├── SOUL.md                        dedicated agent identity
    └── memories/MEMORY.md             approved compact lessons; created on first save
```

- **`AGENTS.md`** owns the rules for operating this project.
- **`README.md`** maps the system and points to each source of truth.
- **`docs/hypothesis-loop.md`** owns the detailed hypothesis-branch and delayed-evidence operating model.
- **`context/`** holds stable inputs used to make content decisions.
  - **`expertise.md`** owns project-wide accumulating strength-training facts, mechanisms, practical applications, provenance, evidence status, and content-use limits. It is shared by every content format and platform.
  - **`imagery.md`** owns current app/account-wide image tone, content rules, runtime request constraints, and generation/selection policy. Hermes tool/profile configuration separately owns the active backend and model. User direction updates imagery guidance in place; it is not versioned.
  - **`product.md`** owns product truth, market scope, positioning, and claim boundaries.
  - **`user-language.md`** stores project-wide collected expressions, situations, sources, and confidence without interpreting them.
- **`messages/`** holds explicitly versioned target situations, problem patterns, belief shifts, persuasion logic, resistance and response, product roles, and evidence limits. A version's generation-affecting meaning becomes immutable after content first references it.
- **`db/`** holds the exact schema and local runtime record of hypotheses, generated content and its final slide copy, content results, account-level follower snapshots, and evidence links.
- **`viewer/hypothesis_tree/`** derives a read-only tree from the runtime database. It owns no hypothesis state and cannot replace SQLite as the evidence source.
- **`.hermes/plans/`** holds implementation plans, not runtime marketing knowledge.
- **`renderer/slideshow/`** owns slideshow production. Each `formats/<format-id>/` bundle groups that format's copywriting, ordered references, and self-contained content projects. Project-wide subject expertise remains in `context/expertise.md`; formats own expression and visual evidence, not domain knowledge. `formatId` identifies the evidence/content namespace; it does not provide reusable coordinates. There is no template or format JSON. The assistant uses references as primary visual-grammar evidence and up to three retained same-format projects as secondary renderer-feasibility and composition evidence, then constructs each layout directly in its content project.
- **Profile `SOUL.md`** owns the dedicated agent identity.
- **Profile `MEMORY.md`** owns approved compact lessons that must persist across sessions.
- **Hermes skills** own reusable procedures.

## Slideshow editor

Install and run the isolated renderer package from the repository root:

```bash
npm --prefix renderer/slideshow ci
npm run renderer:slideshow
```

The editor starts with a blank `denzel` project and can change or preserve a project's `formatId`. It saves editable JSON to `renderer/slideshow/formats/<format-id>/contents/` through a small Vite middleware, loads projects across format bundles, imports compatible project JSON from the browser, and exports either the current PNG or a ZIP of all slides. Every text and image property is directly editable; there is no template library or property-lock layer. The renderer does not run a separate application server.

## Hypothesis tree viewer

Run the read-only local monitor from the repository root:

```bash
npm run viewer:hypothesis-tree
```

Open `http://127.0.0.1:4174`. The viewer derives active, branched, and closed node states together with direct content, final slide copy, publication state, result checkpoints, and child-creation evidence from `db/hypothesis-loop.sqlite`. It exposes no write endpoint.
