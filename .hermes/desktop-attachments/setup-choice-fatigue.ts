import { json } from "#lib/json";

export const appsEnvMessagesCandidatesSetupChoiceFatigue = json({
  id: "env.setup-choice-fatigue.001",
  // Internal experiment label. Do not treat it as visible copy.
  name: "Focus gets spent on setup choices before work begins",
  core_message: {
    // One concrete person-and-moment where this message becomes relevant; never repeat the app-wide audience.
    reader_moment:
      "A college student, job seeker, or working professional has already decided to focus, but is still choosing a timer, Screen Time rules, sound, and break settings before beginning the actual work.",
    belief_shift: {
      from: "Choosing a focus setup is harmless preparation, so low focus at the start must mean I lack discipline.",
      to: "Each setup choice uses some of the attention I meant to bring into the focus session.",
    },
    mechanism: {
      old_way:
        "Choose the timer, Screen Time rules, sound, breaks, and other focus settings again at the moment of starting.",
      failure_reason:
        "Even when none of those choices leads to distraction, repeated decisions spend attention before the first focused action.",
      new_way:
        "Reuse a focus environment whose setup values were decided in advance instead of choosing them again at every start.",
      product_role:
        "env saves and runs the prepared timer, Screen Time, sound, break, and related settings as one reusable focus environment.",
    },
    // Reader outcome, not a product feature or unsupported performance claim.
    promise:
      "Begin the real work without spending the opening part of your focus on setup decisions.",
  },
  reader_psychology: {
    emotional_state:
      "Ready to focus but subtly drained by having to make the same preparation choices again.",
    desires: [
      {
        thought: "I want my focus to go into the work, not into configuring how I will focus.",
        fulfillment_job:
          "End on the first meaningful work action rather than presenting the setup itself as the achievement.",
      },
    ],
    fears: [
      {
        thought: "A focus app might become one more thing to configure.",
        reassurance_job:
          "Show that one prepared environment is reused instead of rebuilt at every start.",
      },
      {
        thought: "A saved setup might be too rigid for different kinds of focus work.",
        reassurance_job:
          "Show that different reusable environments can hold different prepared settings without choosing them again at each start.",
      },
    ],
    doubts: [
      {
        thought: "Can preparing the environment really leave more attention for the task?",
        proof_job:
          "Name the concrete timer, Screen Time, sound, and break choices that no longer happen at the starting moment.",
      },
      {
        thought: "Maybe I just need more discipline.",
        proof_job:
          "Explain the repeated environmental friction without claiming discipline or motivation no longer matters.",
      },
    ],
    rationalizations: [
      {
        thought: "I am just setting up.",
        reframe_job:
          "Show that preparation can use the same attention needed for the first focused action, even when the setup goes as planned.",
      },
      {
        thought: "These are tiny choices, so they cannot affect my focus.",
        reframe_job:
          "Make the cumulative cost of repeated small choices visible without exaggerating it.",
      },
    ],
    // Real conditions our proposed solution must accommodate; never use general life facts here.
    solution_constraints: [
      {
        condition:
          "Different study, job-search, and work sessions may need different timer, sound, or blocking settings.",
        requirement:
          "The solution must allow multiple reusable environments without asking the reader to rebuild one at every start.",
      },
      {
        condition: "The product reduces setup decisions but cannot guarantee how focused the reader will feel.",
        requirement:
          "The message must describe preserved attention without promising complete concentration or performance improvement.",
      },
    ],
  },
  language: {
    // Observable behavior only; do not put diagnoses or strategy labels in these scenes.
    observable_scenes: [
      "choosing a timer while the report or reading waits",
      "deciding which sound to use before opening interview prep",
      "adjusting Screen Time rules before beginning a focused work block",
      "rebuilding the same timer, break, and sound setup before starting",
      "making several small focus choices before touching the actual work",
    ],
    // Immediate cost of the current pattern; do not turn these into broad life or grade claims.
    concrete_losses: [
      "the focus session begins after several unnecessary decisions",
      "attention goes into setup instead of the first work action",
      "the report or reading still waits while the focus setup is rebuilt",
      "interview prep begins with configuration instead of practice",
    ],
    // The work the reader originally meant to do; never include opening env, choosing settings, or starting a timer.
    intended_task_actions: [
      "draft the first report section",
      "practice the first interview question",
      "read the first research page",
      "begin the first project task",
    ],
    // Concrete nouns that preserve message specificity; not sentences, claims, or abstract strategy terms.
    concrete_terms: [
      "timer",
      "sound",
      "blocked apps",
      "allowed apps",
      "focus screen",
      "focus session",
      "report",
      "interview prep",
      "research reading",
      "project task",
      "first work block",
    ],
    // Message-specific abstract-to-reader-language conversion; global readability belongs to SEDA.
    normalization: {
      "focus setup": "timer, Screen Time, sound, breaks, and focus settings",
      "start the work":
        "draft the first section, practice the first interview question, or read the first page",
      focus: "attention available for the first real work action",
      productivity: "study session, interview prep, report, research reading, or project work",
    },
    // Phrases that distort this message; brand-wide or format-only restrictions belong elsewhere.
    avoid_phrases: [
      "phone path",
      "open path",
      "leak",
      "focus tax",
      "low focus diagnosis",
      "setup-choice fatigue",
      "choices still alive",
      "start eating itself",
      "whole start goes soft",
    ],
  },
} as const);
