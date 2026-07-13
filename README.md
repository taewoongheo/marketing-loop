# env marketing loop

A local workspace for autonomously producing and improving env's organic TikTok slideshow content.

## Goal

The final goal is to create increasingly viral content by learning from editorial feedback and published performance.

The two primary optimization axes are:

- **Message strategy:** what should persuade the audience.
- **Copywriting format:** how that message should be expressed within a reference-derived visual template.

The user implements the fixed visual structure in `slides-marketing`. This repository owns the marketing knowledge, evidence, and learning loop. Detailed operating rules and decision rights live only in `AGENTS.md`.

## Structure

```text
marketing-loop/
├── AGENTS.md                         agent operating contract
├── README.md                         human-facing project map
├── learning.md                       unresolved cross-content lessons
├── .gitignore                        local/generated file exclusions
│
├── context/                          stable decision inputs
│   ├── product.md                    product truth
│   ├── audience.md                   target understanding
│   ├── user-language.md              audience language evidence
│   └── voice.md                      shared English voice
│
├── messages/                         persuasion strategy
│   └── msg-*.md                      one message hypothesis per file
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
│   └── marketing.sqlite              local runtime database
│
└── .hermes/                          non-runtime Hermes planning artifacts
    └── plans/

External owners — not inside this repository
├── /Users/taewoongheo/Projects/slides-marketing/
│   ├── templates/                    visual JSON structure
│   ├── assets/                       production image assets
│   ├── editable project JSON
│   ├── renderer/editor code
│   └── rendered images
│
└── ~/.hermes/profiles/marketing-env/
    ├── SOUL.md                        dedicated agent identity
    └── memories/MEMORY.md             approved compact lessons; created on first save
```

- **`AGENTS.md`** owns the rules for operating this project.
- **`README.md`** maps the system and points to each source of truth.
- **`learning.md`** holds unresolved lessons that may later move to a permanent owner.
- **`context/`** holds stable inputs used to make content decisions.
  - **`product.md`** is the source of product truth.
  - **`audience.md`** is the source of target-audience understanding.
  - **`user-language.md`** is the source of audience-language evidence.
  - **`voice.md`** is the source of shared English voice rules.
- **`messages/`** holds the persuasion hypotheses being tested and improved.
- **`formats/`** holds the copywriting systems tied to visual templates.
  - **`guide.md`** describes how a format communicates.
  - **`references/`** preserves the ordered images used to analyze that format.
- **`db/`** holds the structure and runtime record of final content and observed results.
- **`.hermes/plans/`** holds implementation plans, not runtime marketing knowledge.
- **`slides-marketing`** owns visual implementation, editable projects, and rendering.
- **Profile `SOUL.md`** owns the dedicated agent identity.
- **Profile `MEMORY.md`** owns approved compact lessons that must persist across sessions.
- **Hermes skills** own reusable procedures.
