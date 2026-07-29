#!/usr/bin/env python3
"""Deterministic in-scheduler integrity checks for the LIFT CODE marketing loop."""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_RESEARCH_DB = REPO_ROOT / "db/research.sqlite"
DEFAULT_HYPOTHESIS_DB = REPO_ROOT / "db/hypothesis-loop.sqlite"
DEFAULT_JOBS_PATH = (
    Path.home() / ".hermes/profiles/marketing-liftcode/cron/jobs.json"
)
EXPECTED_SCHEMA_VERSIONS = {"research": 6, "hypothesis": 13}
DEFAULT_REQUIRED_FILES = (
    "AGENTS.md",
    "README.md",
    "docs/research-loop.md",
    "db/research-schema.sql",
    "db/schema.sql",
    "scripts/research_store.py",
    "scripts/collect_due_content_results.py",
    "scripts/run_event_research.py",
    "scripts/run_scheduled_content_production.py",
)


def _inspect_database(path: Path, label: str, expected_version: int, issues: list[str]):
    if not path.is_file():
        issues.append(f"{label} database is missing: {path}")
        return
    try:
        with sqlite3.connect(path) as connection:
            integrity = connection.execute("PRAGMA integrity_check").fetchone()[0]
            if integrity != "ok":
                issues.append(f"{label} database integrity check failed: {integrity}")
            foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
            if foreign_keys:
                issues.append(
                    f"{label} database foreign key check failed: {len(foreign_keys)} row(s)"
                )
            version = connection.execute("PRAGMA user_version").fetchone()[0]
            if version != expected_version:
                issues.append(
                    f"{label} database schema version is {version}, expected {expected_version}"
                )
            if label == "research":
                unresolved = connection.execute(
                    """
                    SELECT COUNT(*)
                    FROM research_questions AS question
                    JOIN research_runs AS run ON run.id = question.run_id
                    WHERE run.status IN ('completed', 'failed', 'skipped')
                      AND question.status = 'selected'
                    """
                ).fetchone()[0]
                if unresolved:
                    issues.append(
                        f"research lifecycle has {unresolved} selected question(s) in terminal runs"
                    )
                stale = connection.execute(
                    """
                    SELECT COUNT(*)
                    FROM research_runs
                    WHERE status = 'running'
                      AND datetime(lease_expires_at) <= datetime(?)
                    """,
                    (datetime.now(timezone.utc).isoformat(),),
                ).fetchone()[0]
                if stale:
                    issues.append(f"research lifecycle has {stale} expired running lease(s)")
    except Exception as error:
        issues.append(f"{label} database inspection failed: {error}")


def _active_jobs(jobs_path: Path, issues: list[str]):
    if not jobs_path.is_file():
        issues.append(f"Hermes jobs file is missing: {jobs_path}")
        return []
    try:
        payload = json.loads(jobs_path.read_text(encoding="utf-8"))
    except Exception as error:
        issues.append(f"Hermes jobs file is invalid: {error}")
        return []
    return [
        job
        for job in payload.get("jobs", [])
        if job.get("enabled", True) and job.get("state") != "removed"
    ]


def _inspect_jobs(jobs_path: Path, issues: list[str]):
    jobs = _active_jobs(jobs_path, issues)
    standalone_research = [
        job
        for job in jobs
        if "open-ended research" in str(job.get("name", "")).lower()
        or (
            not job.get("no_agent", False)
            and "research" in str(job.get("name", "")).lower()
        )
    ]
    if standalone_research:
        issues.append("standalone research scheduler job is enabled")

    expected = {
        "collect_due_content_results_watchdog.py": "due-content collector",
        "run_scheduled_content_production.py": "content production",
    }
    for script, label in expected.items():
        matches = [job for job in jobs if Path(str(job.get("script", ""))).name == script]
        if len(matches) != 1:
            issues.append(f"expected exactly one enabled {label} job; found {len(matches)}")
            continue
        job = matches[0]
        if not job.get("no_agent", False):
            issues.append(f"{label} job must remain script-only at the scheduler boundary")
        if job.get("deliver") != "telegram":
            issues.append(f"{label} job must deliver alerts and research digests to Telegram")
        if job.get("last_status") not in {None, "ok"}:
            issues.append(f"{label} job reports last_status={job.get('last_status')}")
        if job.get("last_delivery_error"):
            issues.append(f"{label} job reports a delivery error")


def inspect_system(
    *,
    research_db: Path = DEFAULT_RESEARCH_DB,
    hypothesis_db: Path = DEFAULT_HYPOTHESIS_DB,
    jobs_path: Path = DEFAULT_JOBS_PATH,
    required_files=None,
):
    issues: list[str] = []
    _inspect_database(
        Path(research_db), "research", EXPECTED_SCHEMA_VERSIONS["research"], issues
    )
    _inspect_database(
        Path(hypothesis_db),
        "hypothesis",
        EXPECTED_SCHEMA_VERSIONS["hypothesis"],
        issues,
    )
    _inspect_jobs(Path(jobs_path), issues)
    files = DEFAULT_REQUIRED_FILES if required_files is None else required_files
    for relative in files:
        path = REPO_ROOT / relative
        if not path.is_file():
            issues.append(f"required owner is missing: {relative}")
    return {
        "ok": not issues,
        "checked_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "issues": issues,
        "boundary": "scheduler-internal checks only; no external runtime watchdog",
    }


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--research-db", type=Path, default=DEFAULT_RESEARCH_DB)
    parser.add_argument("--hypothesis-db", type=Path, default=DEFAULT_HYPOTHESIS_DB)
    parser.add_argument("--jobs", type=Path, default=DEFAULT_JOBS_PATH)
    return parser.parse_args()


def main():
    args = parse_args()
    report = inspect_system(
        research_db=args.research_db,
        hypothesis_db=args.hypothesis_db,
        jobs_path=args.jobs,
    )
    print(json.dumps(report, ensure_ascii=False, separators=(",", ":")))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
