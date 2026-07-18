import sqlite3
import tempfile
import unittest
from pathlib import Path


SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "schema.sql"


class AccountResultsSchemaTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "account-results.sqlite"
        self.connection = sqlite3.connect(self.db_path)
        self.connection.executescript(SCHEMA_PATH.read_text())

    def tearDown(self):
        self.connection.close()
        self.temp_dir.cleanup()

    def test_records_account_follower_snapshot(self):
        self.connection.execute(
            """
            INSERT INTO account_results (
                collected_at, followers, collection_source, raw_json
            ) VALUES (?, ?, ?, ?)
            """,
            (
                "2026-07-18T10:00:00Z",
                13,
                "TikWM public user-info API",
                '{"followerCount":13}',
            ),
        )

        row = self.connection.execute(
            """
            SELECT collected_at, followers, collection_source
            FROM account_results
            """
        ).fetchone()
        self.assertEqual(
            row,
            ("2026-07-18T10:00:00Z", 13, "TikWM public user-info API"),
        )

    def test_rejects_non_integer_follower_values(self):
        for followers in (-1, 1.5, "13"):
            with self.subTest(followers=followers):
                with self.assertRaises(sqlite3.IntegrityError):
                    self.connection.execute(
                        """
                        INSERT INTO account_results (
                            collected_at, followers, collection_source
                        ) VALUES (?, ?, ?)
                        """,
                        ("2026-07-18T10:00:00Z", followers, "manual"),
                    )


if __name__ == "__main__":
    unittest.main()
