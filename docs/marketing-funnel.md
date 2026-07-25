# Marketing Funnel Operating Model

This document owns the marketing-funnel stages, measurement contract, responsibility boundary, and bottleneck-selection model. `AGENTS.md` owns the agent operating contract, `docs/hypothesis-loop.md` owns hypothesis lineage and delayed evidence, and `db/schema.sql` owns exact storage.

## Objective hierarchy

```text
Ultimate business purpose
└── Increase LIFT CODE app revenue
    └── Direct responsibility of this marketing workspace
        └── Increase qualified App Store inflow
            └── Operating objective
                └── Repeatedly identify and improve the funnel bottleneck
                    that most limits qualified App Store inflow
```

Revenue is the reason this workspace exists, but it is not the result that marketing alone controls. Download conversion, activation, retention, pricing, and payment also depend on the product and App Store presence. This workspace directly owns marketing through qualified arrival at the App Store product page. Downstream outcomes may be read as feedback about traffic quality and message-market fit, but they do not make this workspace solely responsible for revenue.

Message strategy, copywriting, content production, medium, format, execution quality, reach, engagement, profile visits, followers, clicks, and App Store visits are not independent final goals. They are controllable levers, observations, proxies, constraints, or intermediate outcomes used to improve the current bottleneck.

## Funnel

The working funnel is:

```text
Channel access
→ Qualified exposure
→ Content consumption
→ Relevant interest and justified trust
→ Profile intent
→ Outbound intent
→ App Store inflow
→ Download → activation → retention → payment → revenue
```

The last five product outcomes remain visible as downstream feedback. The direct marketing handoff is qualified App Store product-page arrival unless later evidence shows that a neighboring measurable event is a more reliable operational boundary.

### 0. Channel access

Channel capabilities required for a later funnel step to exist. These are enabling constraints, not audience conversion stages.

The current user-provided TikTok constraint is that the account needs 1,000 followers before it can expose the App Store link. Until the link path becomes available, follower count may be the active constraint on outbound intent and App Store inflow. Reaching 1,000 followers does not complete a separate project goal; it removes this constraint and causes the assistant to reassess the next bottleneck. Because platform rules can change, verify the constraint again when link activation becomes actionable.

### 1. Qualified exposure

A target-relevant person is served the content. Public view count measures plays, not audience qualification, so views are currently only a volume proxy. Do not call increased views qualified reach without audience evidence.

### 2. Content consumption

The audience consumes enough of the content to receive its intended message. Useful measures may include retention, completion, or slide/video consumption when a real source becomes available. Public views alone do not establish message reception.

### 3. Relevant interest and justified trust

The content produces a response consistent with relevance, utility, or justified trust. Likes, comments, shares, saves, and user language may provide different partial signals, but no one engagement count proves trust or future App Store intent. Select a metric because it matches the hypothesis's expected response, not because it is available.

### 4. Profile intent

A viewer visits the LIFT CODE profile. This is a stronger expression of account-level interest than content engagement when it can be measured, but it does not by itself prove App Store intent.

### 5. Outbound intent

A profile visitor follows the exposed App Store path. This stage does not exist operationally until an outbound path is available. Measure the actual path action rather than inferring clicks from follower or profile growth.

### 6. App Store inflow

A person arrives at the LIFT CODE App Store product page from marketing. This is the default direct outcome for the workspace. Attribution, visitor quality, and source coverage must be stated with every measurement design; unattributed product-page traffic must not be claimed as TikTok-caused.

### Downstream product outcomes

Downloads, activation, retention, payment, and revenue indicate whether acquired attention becomes product value and business value. Use them to detect poor-quality inflow or a mismatch between marketing promises and the product. Do not optimize a marketing proxy that grows while downstream quality consistently deteriorates.

## What a hypothesis is

A hypothesis is a testable proposed improvement to something the assistant can directly materialize in the marketing output. It is a change to a controllable output lever, paired with the audience response expected to relieve the selected funnel bottleneck.

The current durable hypothesis axes are:

- `message`: what perception or belief the output should change and how it persuades;
- `copywriting`: how the output expresses that message.

Funnel stages and metrics are target outcomes, not hypothesis axes. Followers, views, saves, profile visits, clicks, and App Store visits cannot themselves be the changed element of a hypothesis. A valid hypothesis instead states which controllable message or copywriting output will change, which funnel response it is expected to improve, and why that response should relieve the current bottleneck.

Medium, format, imagery, layout, crop, motion, timing, and audio remain content-specific execution variables under the current project scope. They may be selected and improved directly, but they are not durable hypothesis axes and their differences do not validate or invalidate a message/copywriting hypothesis.

```text
Funnel diagnosis
→ select the current bottleneck
→ propose a controllable message or copywriting change
→ materialize that change in content
→ observe the expected funnel response
→ update the hypothesis lineage and funnel diagnosis
```

## Bottleneck selection

The bottleneck is the observable or enabling constraint whose improvement is currently expected to produce the largest meaningful increase in qualified App Store inflow. It is not mechanically the stage with the lowest reported conversion rate.

For every production cycle that has new relevant evidence, the assistant evaluates:

1. **Causal position:** whether the stage actually limits progress to App Store inflow.
2. **Volume:** whether enough people reach the stage for a downstream conversion rate to be meaningful.
3. **Evidence quality:** whether the metric directly observes the stage or is only a proxy.
4. **Actionability:** whether the assistant can change a marketing output that plausibly affects it now.
5. **Expected leverage:** the likely effect on qualified App Store inflow, not only on the local metric.
6. **Launch and channel constraints:** whether later stages currently exist and can be acted on.
7. **Confounders:** topic, publication conditions, attribution gaps, product readiness, and other plausible causes.
8. **Downstream quality:** whether improving the stage appears compatible with later product and revenue outcomes when those observations exist.

A missing metric is a measurement gap, not automatic proof that the corresponding stage is the bottleneck. Add instrumentation only when the missing observation prevents a meaningful decision about the nearest actionable constraint.

## Phase-aware operation

### Current prelaunch phase

The product is pre-development, and current TikTok content does not mention or promote the app or planned capabilities. App Store inflow, outbound intent, and their conversion rates are therefore not yet applicable.

During this phase:

- optimize the observable upstream constraint that best builds future access to relevant users;
- use useful strength-training content to earn target-relevant attention and justified trust;
- treat the 1,000-follower link requirement as a channel-access constraint, not an independent success condition;
- do not fabricate downstream conversions or pretend that engagement proves future App Store traffic;
- preserve audience relevance rather than growing the account with followers unlikely to value LIFT CODE.

### Link-access and launch phases

When an App Store path becomes available:

1. verify the actual platform link requirement and activate the authorized path;
2. add the nearest reliable profile/outbound measurement needed to diagnose the path;
3. reassess whether channel access, profile intent, outbound intent, or App Store inflow is now the limiting stage;
4. introduce product-page and downstream observations only from identified sources with explicit attribution limits;
5. move the active optimization target whenever evidence shows that the bottleneck has moved.

## Measurement contract

Every admitted funnel observation must identify:

- the exact event or count observed;
- its funnel stage;
- numerator and denominator when a rate is calculated;
- collection source and timestamp/window;
- attribution scope;
- whether it is a direct measure or proxy;
- missing dimensions and known limitations;
- whether the stage is currently applicable and actionable.

Never infer an unavailable event by silently substituting another metric. Keep observations separate from interpretations and from the current bottleneck judgment.

### Current capability matrix

| Funnel area | Current normalized observation | Source/status | Operational limit |
| --- | --- | --- | --- |
| Channel access | Followers | `account_results`; timestamped public or manual observation | Indicates progress toward the user-provided link-access condition, not audience quality or hypothesis validation |
| Qualified exposure | Views | `content_results` at 24h, 48h, and 72h | Volume proxy only; target relevance is unavailable |
| Content consumption | None beyond views | Not currently measured | Views do not reveal retention or completion |
| Interest/trust | Likes, comments, shares, saves | `content_results` at 24h, 48h, and 72h | Partial response signals; interpretation must match the tested claim |
| Profile intent | None | Source not yet admitted | Do not infer from engagement or follower movement |
| Outbound intent | None | Not yet applicable; source not admitted | No operational App Store path in the current phase |
| App Store inflow | None | Not yet applicable; source not admitted | No App Store destination or attribution design yet |
| Downstream product outcomes | None | Outside current runtime model | Product is pre-development; use later only as quality feedback |

The assistant must not build one collector per row in advance. First identify the active decision that cannot be made with current evidence, then inspect and add only the narrowest reliable source needed for that decision. New credentials, external cost, privacy impact, or structural changes remain subject to the project authorization rules.

## Relationship to hypothesis evidence

Content metrics may directly support or contradict a message/copywriting hypothesis only when they observe the response named in that hypothesis with adequate comparison quality. Account and funnel observations can determine which bottleneck deserves attention without becoming direct evidence that one content caused the account-level change.

Examples:

- Follower growth can show movement toward link access but cannot identify which content or axis caused it by itself.
- Saves may support a utility-oriented expected response but do not directly measure profile or App Store intent.
- Profile visits may diagnose movement from content to account interest but do not prove App Store visits.
- App Store visits may measure inflow but require explicit attribution before being credited to TikTok or a hypothesis.

When the available metric is only a proxy, the hypothesis statement, interpretation, and limitations must say so.