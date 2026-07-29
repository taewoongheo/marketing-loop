import json
import os
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

from scripts.run_scheduled_content_production import (
    build_production_prompt,
    is_exact_scheduled_minute,
    scheduler_script_path,
)


SCRIPT_PATH = Path("/workspace/scripts/run_scheduled_content_production.py")


class ScheduledContentProductionTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.jobs_path = Path(self.temp_dir.name) / "jobs.json"
        self.jobs_path.write_text(
            json.dumps(
                {
                    "jobs": [
                        {
                            "id": "production-job",
                            "enabled": True,
                            "state": "running",
                            "script": str(SCRIPT_PATH),
                            "schedule": {"kind": "cron", "expr": "0 7 * * *"},
                        }
                    ]
                }
            )
        )

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_accepts_the_exact_configured_cron_minute(self):
        now = datetime(2026, 7, 30, 7, 0, tzinfo=timezone.utc)

        self.assertTrue(
            is_exact_scheduled_minute(
                jobs_path=self.jobs_path,
                script_path=SCRIPT_PATH,
                now=now,
            )
        )

    def test_rejects_a_delayed_catch_up_minute(self):
        now = datetime(2026, 7, 30, 7, 1, tzinfo=timezone.utc)

        self.assertFalse(
            is_exact_scheduled_minute(
                jobs_path=self.jobs_path,
                script_path=SCRIPT_PATH,
                now=now,
            )
        )

    def test_resolves_a_relative_cron_script_from_the_profile_scripts_directory(self):
        profile = Path(self.temp_dir.name) / "profile"
        jobs_path = profile / "cron" / "jobs.json"
        script_path = profile / "scripts" / "run_production.py"
        jobs_path.parent.mkdir(parents=True)
        jobs_path.write_text(
            json.dumps(
                {
                    "jobs": [
                        {
                            "id": "production-job",
                            "enabled": True,
                            "state": "scheduled",
                            "script": script_path.name,
                            "schedule": {"kind": "cron", "expr": "0 7 * * *"},
                        }
                    ]
                }
            )
        )

        self.assertTrue(
            is_exact_scheduled_minute(
                jobs_path=jobs_path,
                script_path=script_path,
                now=datetime(2026, 7, 30, 7, 0, tzinfo=timezone.utc),
            )
        )

    def test_uses_the_profile_wrapper_as_the_scheduler_script_identity(self):
        wrapper = Path("/profile/scripts/content_production.py")

        with patch.dict(
            os.environ,
            {"LIFTCODE_SCHEDULER_SCRIPT": str(wrapper)},
        ):
            self.assertEqual(scheduler_script_path(), wrapper)

    def test_production_prompt_embeds_preflight_research_and_integrity_review(self):
        prompt = build_production_prompt("production:run-1")

        self.assertIn("content_preflight", prompt)
        self.assertIn("system integrity", prompt)
        self.assertIn("production:run-1", prompt)
        self.assertIn("research digest", prompt)
        self.assertNotIn("return exactly [SILENT]", prompt)


if __name__ == "__main__":
    unittest.main()
