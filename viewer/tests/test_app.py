import sqlite3
import tempfile
import unittest
from pathlib import Path

from viewer.hypothesis_tree.app import load_tree


SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "schema.sql"


class LoadTreeTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "tree.sqlite"
        with sqlite3.connect(self.db_path) as connection:
            connection.executescript(SCHEMA_PATH.read_text())

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_derives_tree_state_contents_and_result_checkpoints(self):
        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                "INSERT INTO hypotheses (id, statement) VALUES (?, ?)",
                ("H-001", "Root statement"),
            )
            connection.execute(
                """
                INSERT INTO contents (
                    id, hypothesis_id, format_id, message_id, message_version,
                    copywriting_version, caption, slide_copy_json, final_project_path,
                    final_project_sha256, tiktok_url, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    "C-001", "H-001", "denzel", "msg-trust-the-next-set", 1,
                    1, "caption", '[["hook", "support"], ["body"]]',
                    "contents/C-001.json", "b" * 64,
                    "https://example.com/post", "2026-07-14T00:00:00Z",
                ),
            )
            connection.execute(
                """
                INSERT INTO content_results (
                    content_id, target_hours, collected_at, views,
                    observed_summary, interpretation, limitations,
                    collection_source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    "C-001", 24, "2026-07-15T00:00:00Z", 1200,
                    "Early reach", "Recognition may be present", "One post",
                    "TikWM public API",
                ),
            )
            connection.execute(
                """
                INSERT INTO hypotheses (
                    id, parent_hypothesis_id, change_axis, statement
                ) VALUES (?, ?, ?, ?)
                """,
                ("H-002", "H-001", "copywriting", "Child statement"),
            )
            result_id = connection.execute(
                "SELECT id FROM content_results WHERE content_id = 'C-001'"
            ).fetchone()[0]
            connection.execute(
                "INSERT INTO hypothesis_evidence VALUES (?, ?)",
                ("H-002", result_id),
            )

        tree = load_tree(self.db_path)

        self.assertEqual(tree["summary"], {
            "hypotheses": 2,
            "active_leaves": 1,
            "contents": 1,
            "published": 1,
        })
        root = tree["roots"][0]
        self.assertEqual(root["id"], "H-001")
        self.assertEqual(root["state"], "branched")
        self.assertEqual(root["contents"][0]["format_id"], "denzel")
        self.assertEqual(
            root["contents"][0]["slide_copy"],
            [["hook", "support"], ["body"]],
        )
        self.assertNotIn("slide_copy_json", root["contents"][0])
        self.assertNotIn("imagery_version", root["contents"][0])
        self.assertEqual(root["contents"][0]["checkpoints"]["24"]["views"], 1200)
        self.assertNotIn("raw_json", root["contents"][0]["checkpoints"]["24"])
        self.assertIsNone(root["contents"][0]["checkpoints"]["48"])
        child = root["children"][0]
        self.assertEqual(child["state"], "active")
        self.assertEqual(child["axis"], "copywriting")
        self.assertEqual(child["evidence"][0]["content_id"], "C-001")
        self.assertEqual(child["evidence"][0]["target_hours"], 24)


class ViewerDocumentTests(unittest.TestCase):
    def test_document_exposes_tree_surface_and_live_api(self):
        document_path = (
            Path(__file__).resolve().parents[1]
            / "hypothesis_tree"
            / "index.html"
        )

        document = document_path.read_text()

        self.assertIn('data-role="tree"', document)
        self.assertIn('fetch("/api/tree")', document)
        self.assertIn('data-role="inspector"', document)
        self.assertIn('class="checkpoint-detail"', document)
        self.assertIn("content.format_id", document)
        self.assertIn("content.slide_copy", document)
        self.assertIn("content.caption", document)
        self.assertNotIn("imagery_version", document)


if __name__ == "__main__":
    unittest.main()
