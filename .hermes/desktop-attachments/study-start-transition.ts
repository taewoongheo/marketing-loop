import { json } from "#lib/json";

export const appsEnvMessagesCandidatesStudyStartTransition = json({
  id: "env.study-start-transition.001",
  name: "Intending to study is not yet working",
  core_message: {
    reader_moment:
      "A student has chosen what to study but has not yet read, written, answered, or solved any part of it.",
    belief_shift: {
      from: "I need to feel fully focused and finish preparing before the study session can really begin.",
      to: "The reader can begin before feeling fully ready; the feeling of being engaged may follow contact with the chosen work.",
    },
    mechanism: {
      old_way:
        "Treat readiness as a prerequisite, allowing nearby preparation or avoidance to stand in for beginning.",
      failure_reason:
        "Activity around the work can consume the beginning without completing any part of the assignment, reading, or problem.",
      new_way:
        "Make a small piece of the chosen work easier to do and make competing behavior less immediate during the transition.",
      product_role:
        "env supports the repeatable study-environment portion of this change. It does not choose the work, perform it, or control where the reader places a phone.",
    },
    promise:
      "Help the reader move from intending to study to working on the chosen task with less delay.",
  },
  reader_psychology: {
    emotional_state:
      "Frustrated that knowing what to study still does not make beginning feel automatic.",
    desires: [
      {
        thought: "I want to begin before I talk myself into doing something else.",
        fulfillment_job:
          "Show an opening that reaches real work through distinct actions with low commitment.",
      },
    ],
    fears: [
      {
        thought: "Another routine could become another way to postpone studying.",
        reassurance_job:
          "Keep every supporting method subordinate to a visible change in the chosen work.",
      },
    ],
    doubts: [
      {
        thought: "Can beginning differently matter if I still do not feel focused?",
        proof_job:
          "Show only the immediate difference between remaining near the work and completing a small part of it.",
      },
    ],
    rationalizations: [
      {
        thought: "I am close enough to the work that the session has basically started.",
        reframe_job:
          "Distinguish activity around the task from doing a small part of the task.",
      },
    ],
    solution_constraints: [
      {
        condition: "The reader must already have a chosen task or a visible return point.",
        requirement:
          "Do not claim that env chooses priorities, creates intention, or understands the work.",
      },
      {
        condition: "A delayed start can have causes outside small behavioral changes.",
        requirement:
          "Keep the promise limited to making the immediate transition more workable, not fixing motivation, health, or performance.",
      },
    ],
  },
  language: {
    observable_scenes: [
      "remaining busy around a chosen assignment without doing any part of it",
      "spending the beginning near the work without producing, answering, or marking anything",
      "waiting for a focused feeling before interacting with the chosen work",
    ],
    concrete_losses: [
      "no part of the chosen work is completed",
      "the intention to study does not become actual work",
      "the beginning passes without progress on the chosen task",
    ],
    intended_task_actions: [
      "complete one small part of the chosen work",
      "resume from a visible point left unfinished",
      "interact with the work before judging the whole session",
    ],
    concrete_terms: [
      "assignment",
      "reading",
      "problem",
      "study session",
      "chosen work",
    ],
    normalization: {
      "start friction": "the delay between deciding to study and interacting with the chosen work",
      "begin the work": "produce, answer, mark, or resume something inside the chosen task",
      "reader progress": "a completed part of the chosen work",
    },
    avoid_phrases: [
      "entry route",
      "setup loop",
      "tool-switching problem",
      "task action",
      "easy exit",
      "smaller minutes",
      "instant focus",
      "perfect focus",
      "one tap fixes distraction",
    ],
  },
} as const);
