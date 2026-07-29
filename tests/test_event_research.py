import unittest

from scripts.run_event_research import build_research_prompt


class EventResearchPromptTests(unittest.TestCase):
    def test_preflight_prompt_requires_active_research_and_a_user_digest(self):
        prompt = build_research_prompt(
            trigger_kind="content_preflight",
            objective="Improve the next content decision.",
            event_context={"content_count": 1},
            attempt_token="production:run-1",
        )

        self.assertIn("content_preflight", prompt)
        self.assertIn("no more than three", prompt)
        self.assertIn("quality feedback", prompt)
        self.assertIn("system integrity", prompt)
        self.assertIn("always return a compact korean research digest", prompt.lower())

    def test_result_review_prompt_does_not_treat_one_checkpoint_as_causal_proof(self):
        prompt = build_research_prompt(
            trigger_kind="result_review",
            objective="Interpret newly collected checkpoints.",
            event_context={"checkpoints": [{"content_id": "C-1", "target_hours": 24}]},
            attempt_token="metrics:run-2",
        )

        self.assertIn("result_review", prompt)
        self.assertIn("not causal proof", prompt)
        self.assertIn("24h", prompt)


if __name__ == "__main__":
    unittest.main()
