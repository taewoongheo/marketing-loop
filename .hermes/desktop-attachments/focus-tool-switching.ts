import { json } from "#lib/json";

export const appsEnvMessagesCandidatesFocusToolSwitching = json({
  id: "env.focus-tool-switching.001",
  // Internal experiment label. Do not treat it as visible copy.
  name: "Focus setup breaks across too many tools",
  core_message: {
    // One concrete person-and-moment where this message becomes relevant; never repeat the app-wide audience.
    reader_moment:
      "A college student, job seeker, or working professional has decided to focus, then moves between a timer, Screen Time, and a sound app before the real work begins.",
    belief_shift: {
      from: "Moving through several focus tools is just the normal route into a productive session.",
      to: "Every transition between setup tools creates another opening to leave the work I already intended to begin.",
    },
    mechanism: {
      old_way:
        "Open and configure the timer, Screen Time, sound, and other focus tools separately before each session.",
      failure_reason:
        "Moving between separate tools repeatedly returns the reader to app lists, the Home Screen, and unrelated apps before focus has started.",
      new_way:
        "Run the prepared timer, Screen Time, sound, and related settings together from one reusable focus environment.",
      product_role:
        "env combines those separate setup tools into one prepared focus environment. The app runs it directly, while widgets provide a shorter optional entry.",
    },
    // Reader outcome, not a product feature or unsupported performance claim.
    promise:
      "Move from the decision to focus into the focus session without taking the long route through separate setup tools.",
  },
  reader_psychology: {
    emotional_state:
      "Frustrated because preparing to focus keeps turning into app switching before the real work begins.",
    desires: [
      {
        thought: "I want one clear route from deciding to focus to actually starting.",
        fulfillment_job:
          "Show the prepared focus session becoming active without visiting each setup tool again.",
      },
    ],
    fears: [
      {
        thought: "env might become one more app I have to configure before working.",
        reassurance_job:
          "Show that the environment is prepared once and reused instead of rebuilt at each start.",
      },
      {
        thought: "Combining everything might remove the settings I need for different kinds of work.",
        reassurance_job:
          "Show that each reusable environment keeps its own timer, blocking, sound, and break settings.",
      },
    ],
    doubts: [
      {
        thought: "Is this meaningfully different from opening the same focus apps myself?",
        proof_job:
          "Contrast one prepared boot with the repeated timer, Screen Time, and sound transitions it replaces.",
      },
    ],
    rationalizations: [
      {
        thought: "It only takes a minute to open each tool.",
        reframe_job:
          "Focus on the number of transitions and off-task openings, not only the minutes spent configuring them.",
      },
      {
        thought: "I am still being productive because I am setting up my focus session.",
        reframe_job:
          "Separate preparing the tools from beginning the study, interview prep, report, or project work itself.",
      },
    ],
    // Real conditions our proposed solution must accommodate; never use general life facts here.
    solution_constraints: [
      {
        condition:
          "The reader genuinely uses timer, Screen Time, sound, and other phone tools to prepare for focus.",
        requirement:
          "The solution must combine those useful tools rather than require the phone or focus setup to disappear.",
      },
      {
        condition: "Focus intention already exists before env is used.",
        requirement:
          "The solution must not claim to create motivation, choose the work, or guarantee that distraction never happens.",
      },
    ],
  },
  language: {
    // Observable behavior only; do not put diagnoses or strategy labels in these scenes.
    observable_scenes: [
      "setting a timer and then leaving to configure Screen Time",
      "returning to the Home Screen between the timer and sound app",
      "opening a feed while moving from app blocking to focus sound",
      "configuring three focus tools before beginning interview prep",
      "finishing the setup while the report, reading, or project still waits",
    ],
    // Immediate cost of the current pattern; do not turn these into broad life or performance claims.
    concrete_losses: [
      "the first focus block has not started",
      "the report or reading waits through another app transition",
      "interview prep turns into phone navigation",
      "an unrelated app takes over before the prepared work begins",
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
      "focus timer",
      "Screen Time",
      "sound app",
      "app switcher",
      "Home Screen",
      "feed",
      "focus environment",
      "focus session",
      "report",
      "interview prep",
      "research reading",
      "project task",
    ],
    // Message-specific abstract-to-reader-language conversion; global readability belongs to SEDA.
    normalization: {
      "focus tools": "timer, Screen Time, sound, and break settings",
      "tool switching": "moving between the timer, Screen Time, sound app, and Home Screen",
      "start the work":
        "draft the first section, practice the first interview question, or read the first page",
      "prepared environment": "one saved focus setup that runs together",
    },
    // Phrases that distort this message; brand-wide or format-only restrictions belong elsewhere.
    avoid_phrases: [
      "phone contact",
      "the phone is the problem",
      "open the task before the feed",
      "one tap fixes distraction",
      "guaranteed focus",
    ],
  },
} as const);
