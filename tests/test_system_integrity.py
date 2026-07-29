import json
import sqlite3
import tempfile
import unittest
from pathlib import Path

from scripts.system_integrity import inspect_system


REPO_ROOT = Path(__file__).resolve().parents[1]


class SystemIntegrityTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        self.research_db = self.root / "research.sqlite"
        self.hypothesis_db = self.root / "hypothesis.sqlite"
        with sqlite3.connect(self.research_db) as connection:
            connection.executescript(
                (REPO_ROOT / "db/research-schema.sql").read_text(encoding="utf-8")
            )
        with sqlite3.connect(self.hypothesis_db) as connection:
            connection.executescript(
                (REPO_ROOT / "db/schema.sql").read_text(encoding="utf-8")
            )
        self.jobs_path = self.root / "jobs.json"
        self.jobs_path.write_text(
            json.dumps(
                {
                    "jobs": [
                        {
                            "id": "metrics",
                            "name": "Hourly due content results",
                            "enabled": True,
                            "state": "scheduled",
                            "script": "collect_due_content_results_watchdog.py",
                            "no_agent": True,
                            "deliver": "telegram",
                        },
                        {
                            "id": "production",
                            "name": "Daily publication-ready content",
                            "enabled": True,
                            "state": "scheduled",
                            "script": "run_scheduled_content_production.py",
                            "no_agent": True,
                            "deliver": "telegram",
                        },
                    ]
                }
            ),
            encoding="utf-8",
        )

    def tearDown(self):
        self.temp_dir.cleanup()

    def inspect(self):
        return inspect_system(
            research_db=self.research_db,
            hypothesis_db=self.hypothesis_db,
            jobs_path=self.jobs_path,
            required_files=[],
        )

    def test_accepts_event_driven_scheduler_topology_and_healthy_databases(self):
        report = self.inspect()

        self.assertTrue(report["ok"], report)
        self.assertEqual(report["issues"], [])

    def test_rejects_a_standalone_research_job(self):
        jobs = json.loads(self.jobs_path.read_text(encoding="utf-8"))
        jobs["jobs"].append(
            {
                "id": "research",
                "name": "Hourly open-ended research",
                "enabled": True,
                "state": "scheduled",
                "prompt": "research",
                "no_agent": False,
                "deliver": "telegram",
            }
        )
        self.jobs_path.write_text(json.dumps(jobs), encoding="utf-8")

        report = self.inspect()

        self.assertFalse(report["ok"])
        self.assertTrue(
            any("standalone research" in issue for issue in report["issues"]),
            report,
        )

    def test_reports_foreign_key_corruption(self):
        with sqlite3.connect(self.research_db) as connection:
            connection.execute("PRAGMA foreign_keys = OFF")
            connection.execute(
                """
                INSERT INTO research_questions (
                    id, run_id, position, question, why_now, expected_decision, status
                ) VALUES ('RQ-bad', 'RR-missing', 1, 'q', 'w', 'd', 'no_finding')
                """
            )

        report = self.inspect()

        self.assertFalse(report["ok"])
        self.assertTrue(any("foreign key" in issue for issue in report["issues"]), report)


if __name__ == "__main__":
    unittest.main()
