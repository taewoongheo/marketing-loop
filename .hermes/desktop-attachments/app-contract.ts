import { json } from "#lib/json";

export const appsEnvAppContract = json({
  id: "env",
  name: "env",
  market: {
    region: "United States",
    language: "English (U.S.)",
    audience: {
      primary:
        "18-34 college students, job seekers, and working professionals who use their iPhone to prepare for focused study or work",
      secondary:
        "Adult learners and independent workers who already intend to focus but lose attention while configuring and switching between focus tools",
    },
  },
  product: {
    category: "iOS focus app",
    definition:
      "env is a one-tap focus environment that saves and runs a prepared focus setup.",
    capabilities: [
      {
        id: "reusable_focus_setup",
        description:
          "Saves timer, break, cycle, app blocking, allowed apps, sound, volume, name, and color as one reusable focus setup.",
      },
      {
        id: "one_tap_start",
        description:
          "Applies an already-prepared env without rebuilding its settings at the moment of starting.",
      },
      {
        id: "app_blocking_allowed_apps",
        description:
          "Uses Screen Time and Family Controls to reduce distracting app access while keeping necessary focus tools available.",
      },
      {
        id: "timer_break_cycle_sound",
        description:
          "Supports fixed timers, count-up timers, breaks, cycles, focus sounds, and volume settings.",
      },
      {
        id: "home_screen_widget",
        description: "Can open a prepared env from a Home Screen widget.",
      },
      {
        id: "lock_screen_widget",
        description: "Can open a pinned env from a Lock Screen widget.",
      },
    ],
  },
  intervention: {
    problem:
      "Focus intention already exists, but choosing timer, Screen Time, sound, and other setup values consumes attention before focus begins, while switching between those separate tools creates opportunities to drift into unrelated apps.",
    point:
      "After the decision to focus, during the choices and tool switching required to prepare the focus session.",
    mechanism:
      "Save timer, Screen Time, sound, and related settings as one reusable focus environment, then run them together without rebuilding the setup or moving through separate tools. Widgets only shorten the entry into that prepared environment.",
  },
  copy: {
    product_mention: '"env"',
    voice: {
      prefer: [
        "quiet",
        "private",
        "minimal",
        "emotionally specific",
        "systemized",
        "gentle but not motivational",
        "direct but not harsh",
        "U.S. college/adult learner-friendly",
      ],
      avoid: [
        "hustle language",
        "cyber/hacker/gamer framing",
        "clinical language",
        "guilt or scolding",
        "generic productivity claims",
        "over-promising transformation",
      ],
    },
    must_not_claim: [
      "creates task intention",
      "improves memory",
      "improves comprehension",
      "chooses the best work or study method automatically",
      "guarantees better grades",
      "understands concepts",
      "solves motivation",
      "solves all focus problems",
      "treats ADHD or clinical conditions",
      "eliminates all phone distraction",
      "replaces the work",
      "replaces Screen Time",
      "acts as parental control",
      "guarantees complete concentration",
      "tracks private TikTok performance",
    ],
  },
} as const);
