# Expertise

## Purpose

This file defines the project-wide rules and index for strength-training domain knowledge used to create accurate and useful LIFT CODE content. Actual admitted knowledge entries live in topic files under `context/expertise/` without being tied to one format, message, or post.

Read this file first, then read the relevant topic files under `context/expertise/` before creating content that uses strength-training facts or advice.

## Ownership boundary

This file owns:

- the ownership, evidence, and content-use rules for strength-training domain knowledge;
- the map of knowledge areas and links to topic files once they exist;
- the required entry structure.

Topic files under `context/expertise/` own:

- admitted strength-training facts and mechanisms that can inform content across formats and platforms;
- their provenance and evidence status;
- practical meaning, scope conditions, exceptions, and safe content-use limits;
- corrections when stronger evidence becomes available.

This file does not own:

- LIFT CODE capabilities, implementation status, positioning, or claim boundaries: `context/product.md`;
- raw audience expressions and their provenance: `context/user-language.md`;
- the target situation, belief shift, and persuasion logic being tested: `messages/`;
- wording, hook, progression, CTA, title, or caption rules: format copywriting versions;
- image direction: `context/imagery.md`;
- final post copy or visual composition: the content record and project;
- performance observations or hypothesis interpretations: SQLite.

A domain fact belongs in one relevant topic file under `context/expertise/` even when it is first discovered while producing one format. A format may decide how to express relevant expertise, but it must not become a second owner of the underlying knowledge.

## Evidence rules

- Record a source or explicit provenance for every externally checkable factual claim.
- Distinguish direct research, systematic review or position stand, professional guidance, practitioner consensus, product-design assumption, and user-approved practical material.
- User approval can admit practical working knowledge, but it does not turn that knowledge into verified scientific evidence.
- Describe what the source supports, not what a headline or secondary summary implies.
- Preserve material limitations, population, training status, exercise context, measurement uncertainty, and meaningful exceptions.
- Do not use `science-backed`, `proven`, `optimal`, `safe`, or equivalent authority language unless the cited evidence supports that exact scope.
- Do not convert an engagement result, audience comment, competitor feature, product requirement, or message hypothesis into domain expertise.
- Do not provide diagnosis, injury treatment, rehabilitation, or individualized medical advice.
- When evidence conflicts, state the disagreement and usable boundary instead of manufacturing one universal rule.
- Correct active knowledge in place when it is wrong or materially incomplete. Preserve superseded provenance only when needed to explain a live disagreement or content limitation.

## Content-use rules

- Use only entries relevant to the selected message and audience situation.
- Keep the content claim narrower than or equal to the supporting expertise entry.
- Translate technical knowledge into an observable training decision or consequence without overstating certainty.
- Domain advice introduced in copy must be traceable to an admitted topic entry under `context/expertise/`. Product facts and audience language remain traceable to their separate owners.
- Absence from the admitted topic files is not evidence that a claim is false; it means the project has not yet admitted that claim as reusable expertise.
- If valid content requires missing domain knowledge, research and add the bounded entry to the relevant topic file before drafting rather than importing an ad-hoc tip directly into copy.

## Current knowledge state

No LIFT CODE strength-training expertise entry has been admitted under `context/expertise/` yet.

Until entries are added, content may use verified product truth, sourced audience language, and explicitly framed message hypotheses from their existing owners, but it must not present unsourced training guidance as expert fact.

## Knowledge map

These are collection areas, not approved claims:

- progression models and load-or-rep adjustment;
- RIR meaning, use, and reporting uncertainty;
- exercise-specific progression constraints;
- free-weight, machine-stack, plate, and micro-load increments;
- autoregulation and same-session adjustment;
- fatigue, maintenance, reduction, deload, and missed-target handling;
- rep ranges and strength or hypertrophy programming context;
- warm-up Set selection and load calculation;
- Rep Tempo, cadence, and practical cueing;
- Estimated 1RM equations, comparison use, and limitations;
- training Volume and Set-count interpretation;
- Program adherence, logging friction, and progression decision burden.

## Entry format

When the first knowledge entry for a topic is admitted, create the relevant topic file under `context/expertise/`. Use one section per reusable knowledge unit and organize files by reusable training topic rather than by source, content format, or individual post.

```markdown
## <Topic>: <bounded claim>

- **Claim:** The exact reusable domain statement.
- **Practical meaning:** What this changes in a real training decision or content explanation.
- **Scope and conditions:** Population, training status, exercise type, timeframe, and assumptions.
- **Limitations and exceptions:** What the claim does not establish.
- **Evidence status:** Direct research | review/position stand | professional guidance | practitioner consensus | user-approved working knowledge | product-design assumption.
- **Source:** Full citation and stable URL, DOI, or explicit internal provenance.
- **Content use:** Allowed framing and prohibited overstatement.
```

Keep entries self-contained enough to use without reopening an entire research session, but do not copy full papers, long raw excerpts, or audience-language collections into topic files.
