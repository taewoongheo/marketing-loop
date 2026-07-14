# Copywriting: list

## Scope

This file is the sole owner of copywriting rules for the `list` format: how a selected message becomes visible slide copy and a caption. Product truth comes from `context/product.md`; message meaning comes from the selected immutable message version; language evidence comes from `context/user-language.md`. Do not duplicate those owners here.

## Renderer dependency

- Template ID: `list`
- Live implementation: `renderer/slideshow/templates/list.json`
- The live template owns slide count, order, text slots, layout, typography, geometry, image crop, and editable properties.
- Read the live template before drafting and fit the copy to its actual hook, body, and closing slots.
- Do not copy implementation values into this file.

## Reference status

The current template contains a captured example and placeholder copy. No source screenshots are currently stored in `references/` for this format. The example wording, subject, and distinctive expressions are not reusable copy.

## Message-to-copy boundary

- Preserve the selected message's target situation, belief shift, persuasion logic, product role, and evidence limits.
- Express one selected message rather than stacking unrelated advice.
- Product facts and claim limits remain authoritative in `context/product.md`; a dramatic hook never permits a stronger claim.
- Copywriting decides wording and delivery, not what the product does or which belief the message is designed to change.

## Empathy and reader relationship

- Make the situation feel quietly and privately recognizable rather than performative.
- Treat the reader as someone who already wants to do the work.
- Be minimal and emotionally specific, gentle but not motivational, and direct without being harsh.
- Prefer a personal realization or close-to-reader perspective over lecturing, blame, or generic instruction.
- Keep both sides of a real tension when relevant, such as needing the phone for study while also encountering distractions on it.

## Hook

- Create tension through a counterintuitive or disappointing outcome grounded in the selected message.
- Make the consequence or recognizable situation concrete enough to earn the next swipe.
- Do not force `env` into the hook; introduce the product only when it helps the progression.
- Avoid copying the reference's wording, subject matter, or distinctive expressions.

## Progression and slide roles

- Use the hook slot to open one tension.
- Use the body slots to develop that same tension through a recognizable list of concrete behaviors or moments.
- Progress from visible behavior toward a reframe or realization rather than beginning with an abstract explanation.
- Keep the intended study action visibly unresolved while preparation or phone behavior continues when the selected message depends on that contrast.
- Use the closing slot to resolve the reframe, introduce the prepared environment naturally when relevant, and return attention to the intended work.
- End on the transition into work rather than treating configuration or the product itself as the achievement.

## Sentence construction and density

- Prefer one clear idea per sentence.
- Prefer observable actions and concrete objects over strategy labels.
- Use ordinary terms that fit the selected scene, such as timer, Screen Time, blocked apps, allowed apps, sound, break, first page, first paragraph, or first problem.
- Use first-person or close-to-reader language when it makes the situation feel privately familiar.
- Remove explanation that does not change the reader's understanding.
- Fit information density and line rhythm to the live editable text slots rather than relying on duplicated layout notes.

## Product reveal and solution transition

- Present `env` as the prepared environment that supports the transition into work.
- Move from the recognizable problem or reframe into the product without a feature dump.
- Do not make `env` the hero of every slide or repeat it where the product connection adds nothing.
- Keep widgets as optional supporting entry points, not the core solution.
- Keep the selected message's semantic product role separate from the copywriting decision about reveal timing and exposure.

## Image–copy relationship

- Choose imagery that makes the study-start situation recognizable without using reference screenshots as production assets.
- Let copy add the behavior, tension, or realization that the image alone cannot communicate.
- Do not merely describe what the image already shows.
- Preserve a coherent progression between the visual scene and the text's information release.

## Caption

- Extend or close the slideshow's single message rather than restating every slide.
- Keep the same reader relationship and claim limits as the slide copy.
- Mention `env` and use a CTA only when they help complete the solution transition; do not append a generic productivity promise.

## Avoid in visible copy

- Hustle, grind, discipline lectures, guilt, scolding, or moral judgments about phone use.
- Cyber, hacker, gamer, “dopamine war,” clinical, or ADHD framing.
- Generic productivity promises, guaranteed outcomes, and transformation claims.
- Internal labels such as cognitive bottleneck, reach bottleneck, setup-choice fatigue, tool switching, mechanism, belief shift, entry route, task action, or setup loop.
- “All-in-one focus app” positioning or feature-list language that reduces `env` to a collection of tools.

## Reference-derived candidates

These are unvalidated copywriting candidates, not established performance rules:

- A concrete list may make a study-start problem more recognizable than an abstract productivity explanation.
- A counterintuitive hook may create enough tension to earn the next swipe without mentioning `env` immediately.
- A personal realization structure may make the reframe feel less instructional or judgmental.

When selected for testing, record the change as a `copywriting` hypothesis in SQLite while keeping `format_id = list` fixed. When direct evidence supports a reusable conclusion and the user confirms adoption, replace or narrow the relevant rule in this file. Keep raw results and lineage in SQLite.
