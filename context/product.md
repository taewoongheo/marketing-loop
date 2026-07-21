# Product

## One-line definition

`LIFT CODE` is a planned strength-training app that helps a lifter choose a credible program and recommends the next weight and reps from actual performance while keeping workout execution fast and simple.

## Product status and market

- Status: pre-development; no production app, beta, public UI, user results, or validated recommendation performance exists yet.
- Market: United States.
- Product and visible marketing language: English (U.S.).
- Official product name: `LIFT CODE`, always uppercase with a space.
- Planned App Store name: `LIFT CODE: Strength Training`.
- `liftcode` is used only where spaces are unavailable, such as domains, social handles, bundle identifiers, or technical IDs.
- Primary audience: men in their 20s and 30s who train alone for muscle or strength and want program and progression decisions handled for them.
- The product is not restricted by gender, but the initial brand and marketing entry point deliberately retain a masculine character.

Individual message versions own the specific target situation, problem framing, and belief shift they test. The audience above is the current product-market direction, not proof that every member experiences the same problem or will trust the product.

## Problem LIFT CODE addresses

The target user can perform strength training but does not want to repeatedly decide:

- which program to follow;
- what weight and reps to attempt next;
- when to increase, maintain, or decrease load;
- how to apply progression across exercises and sessions week after week.

Existing logging apps can make recording fast while leaving progression decisions to the user. Coaching-oriented apps can make those decisions but expose substantial setup, configuration, search, and program-management complexity. LIFT CODE is planned to preserve capable program and progression judgment while keeping the workout surface fast and simple.

## Product position

The intended position is:

`MacroFactor Workouts-level judgment + Hevy-level execution friction`

This is a product-direction shorthand, not a verified superiority claim. LIFT CODE must not claim to be more accurate, faster, simpler, or more effective than either product until direct evidence exists.

## Planned core capabilities

### Smart Program generation

- Generate a multi-week Program from goal, experience, weekly frequency, available time, priority and non-priority muscles, split, periodization, deload, and gym equipment.
- Preserve a stable Program structure instead of regenerating the entire Workout every day.
- Allow direct Program creation and XLSX Program import.

### Real gym constraints

- Store Gym profiles with available equipment, usable weights, plate quantities, machine increments, and micro weights.
- Exclude exercises that cannot be performed with the selected Gym's equipment.
- Round recommendations to weights that can actually be assembled or selected in that Gym.
- Support Gym-specific exercise allow/disallow exceptions.

### Actual-performance Smart Progression

- Use previous performance, current-set Weight, Reps and RIR, target Rep Range and RIR, exercise characteristics, equipment increments, and Program progression policy.
- Apply completed-set performance to remaining sets in the same Session and to the next Workout.
- Recommend next Weight and Reps together with an Increase, Maintain, or Decrease state.
- Default to conservative adjustment when the available data does not justify aggressive loading.

### Explainable and editable recommendations

- Show the history of recommendation changes and the before-and-after Weight, Reps, and RIR.
- Surface the key reason first when a result is unexpected, such as a decrease, deload, or unavailable recommendation.
- Make the used inputs, constraints, exception policy, method, and method version inspectable.
- Prefill the recommendation while allowing the user to record the actual performance instead.

### Fast execution and supporting tools

- Present previous performance, recommended Weight and Reps, and target RIR in one Set flow.
- Support Working, Failure, Drop, and Myo-rep Set recording.
- Calculate Warm-up Sets from Working Set targets.
- Provide exercise-specific Rep Tempo through audio and haptic cues.
- Distinguish a Session-only exercise or Set change from a change applied to future Workouts.

### Progression-centered analysis

- Calculate Estimated 1RM from eligible Working Sets and use it as a consistent comparison and PR basis.
- Show exercise-level Estimated 1RM change and historical Best Sets.
- Show actual weekly Set count, Volume, and contributing exercises by muscle group instead of an abstract level score.

## Intended behavior change

### Before

The lifter manages a Program or Workout, checks prior performance, decides the next Weight and Reps, adjusts for equipment increments, records the Set, and repeats that bookkeeping across future sessions.

### After

The lifter opens the planned Workout with recommendations already filled in, performs the Set, records what actually happened, and lets the system update the next decision.

## Recommendation-trust mechanism

LIFT CODE cannot ask users to trust a mysterious recommendation merely because it is automated. The planned trust mechanism is:

- ground each recommendation in identifiable performance and configuration inputs;
- respect actual Gym loading constraints;
- show a concise Increase, Maintain, or Decrease reason when the result is unexpected;
- expose deeper inputs and methodology on demand;
- let actual performance override the recommendation;
- prefer conservative adjustment when evidence is uncertain;
- accumulate consistency between recommendations, explanations, and recorded outcomes over time.

Marketing must build interest in and justified trust toward this mechanism without presenting an unbuilt or unvalidated system as proven.

## Product boundaries

LIFT CODE is planned to assist Program selection, Workout execution, recording, and progression decisions. It is not planned to:

- provide real-time form correction;
- diagnose injury, pain, illness, or rehabilitation needs;
- act as a medical professional or personal trainer observing the user in real time;
- create a social feed, follower competition, comments, or rankings;
- provide general cardio or sport tracking;
- operate as a general-purpose AI chat coach;
- recreate the entire Workout each day from a claimed recovery score;
- guarantee muscle gain, strength gain, injury prevention, or a particular training result.

## Brand

- Core concept: `restrained wildness` — instinctive strength operated through training principles and a precise system.
- Core impression: `Controlled aggression. Systematic progression. Zero hesitation.`
- Masculinity, physical ambition, confidence, presence, and the desire to become stronger may be addressed directly in external marketing.
- Product language should remain short, exact, and action-oriented rather than macho or motivational.
- Do not turn `CODE` into a hacker or software metaphor. Avoid `compile`, `execute`, `secret`, `hack`, and `crack the code` language.
- Wildness without control becomes generic gym-bro content. System without physical desire becomes a sterile analytics product. LIFT CODE must hold both.

## Claims available before implementation

Only planned-product language may be used:

- LIFT CODE is being built to recommend next Weight and Reps from actual performance and Program context.
- The planned product is designed to reflect equipment and minimum load increments in a selected Gym.
- The planned recommendation experience is designed to show unexpected Increase, Maintain, or Decrease reasoning and remain user-editable.
- The intended workflow is to prefill the next decision so the user can focus on performing and recording the Set.
- The product is being designed for lifters who want capable progression with less workout-management friction.

## Claims not allowed

Do not claim that LIFT CODE:

- is currently available, functional, in beta, or installed by users;
- has current customers, testimonials, transformations, retention, or recommendation-acceptance data;
- has a proven, scientific, validated, accurate, or superior recommendation algorithm;
- produces better results than Hevy, Alpha Progression, MacroFactor Workouts, Fitbod, Strong, or any other competitor;
- eliminates plateaus, guarantees progressive overload, or always chooses the correct Weight or Reps;
- replaces a qualified coach, clinician, or individualized medical judgment;
- knows fatigue, readiness, recovery, pain, or injury beyond the inputs it actually receives;
- guarantees strength, hypertrophy, confidence, attractiveness, discipline, or consistency;
- has private TikTok analytics or product-conversion evidence that has not been collected.