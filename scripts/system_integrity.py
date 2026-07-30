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
EXPECTED_SCHEMA_VERSIONS = {"research": 7, "hypothesis": 17}
DEFAULT_REQUIRED_FILES = (
    "AGENTS.md",
    "README.md",
    "docs/research-loop.md",
    "db/research-schema.sql",
    "db/schema.sql",
    "scripts/research_store.py",
    "scripts/collect_due_content_results.py",
    "scripts/manual_analytics_store.py",
    "scripts/run_event_research.py",
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
            elif label == "hypothesis":
                lifecycle_errors = connection.execute(
                    """
                    SELECT COUNT(*)
                    FROM measurement_requests AS request
                    LEFT JOIN manual_analytics_observations AS observation
                      ON observation.request_id = request.id
                    WHERE (
                        request.status = 'fulfilled'
                        AND (
                            observation.id IS NULL
                            OR request.fulfilled_at <> observation.recorded_at
                        )
                    ) OR (
                        request.status <> 'fulfilled'
                        AND observation.id IS NOT NULL
                    ) OR datetime(request.window_end) > datetime(request.requested_at)
                      OR request.metric_key IN (
                          'retention_curve', 'viewer_composition', 'follower_composition'
                      )
                      OR (observation.id IS NOT NULL AND (
                          datetime(observation.observed_at) < datetime(request.requested_at)
                          OR datetime(observation.observed_at) < datetime(request.window_end)
                          OR datetime(observation.observed_at) > datetime(observation.recorded_at)
                      ))
                    """
                ).fetchone()[0]
                if lifecycle_errors:
                    issues.append(
                        f"manual analytics lifecycle has {lifecycle_errors} inconsistent request(s)"
                    )
                required_triggers = {
                    "require_pending_measurement_request_insert",
                    "validate_measurement_request_timing",
                    "reject_untyped_breakdown_measurement_request",
                    "prevent_equivalent_pending_measurement_request",
                    "preserve_measurement_request_identity",
                    "validate_manual_analytics_observation",
                    "fulfill_measurement_request_after_observation",
                    "require_observation_for_measurement_fulfillment",
                    "preserve_manual_analytics_observation",
                    "preserve_manual_analytics_observation_delete",
                    "preserve_fulfilled_measurement_request",
                    "preserve_measurement_request_delete",
                }
                present_triggers = {
                    row[0]
                    for row in connection.execute(
                        "SELECT name FROM sqlite_master WHERE type = 'trigger'"
                    ).fetchall()
                }
                missing_triggers = sorted(required_triggers - present_triggers)
                if missing_triggers:
                    issues.append(
                        "manual analytics lifecycle is missing trigger(s): "
                        + ", ".join(missing_triggers)
                    )
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


def _inspect_jobs(jobs_path: Path, issues: list[str], warnings: list[str]):
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

    production_jobs = [
        job
        for job in jobs
        if Path(str(job.get("script", ""))).name
        == "run_scheduled_content_production.py"
    ]
    if production_jobs:
        issues.append("scheduled content production job is enabled")

    expected = {
        "collect_due_content_results_watchdog.py": "due-content collector",
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
            warnings.append(f"{label} job reports last_status={job.get('last_status')}")
        if job.get("last_delivery_error"):
            warnings.append(f"{label} job reports a delivery error")


def _inspect_operational_health(research_db, hypothesis_db, now, warnings):
    now_text = now.astimezone(timezone.utc).isoformat(timespec="seconds")
    with sqlite3.connect(hypothesis_db) as hypothesis:
        hypothesis.row_factory = sqlite3.Row
        active_leaf_count, last_progress = hypothesis.execute(
            """
            SELECT COUNT(*), MAX(coalesce(leaf.last_evaluated_at, leaf.created_at))
            FROM hypotheses AS leaf
            WHERE leaf.closed_at IS NULL
              AND NOT EXISTS (
                  SELECT 1
                  FROM hypotheses AS child
                  WHERE child.parent_hypothesis_id = leaf.id
              )
            """
        ).fetchone()
        hypothesis_count = hypothesis.execute(
            "SELECT COUNT(*) FROM hypotheses"
        ).fetchone()[0]
        if active_leaf_count == 1 and hypothesis.execute(
            "SELECT datetime(?) <= datetime(?, '-7 days')",
            (last_progress, now_text),
        ).fetchone()[0]:
            warnings.append(
                "hypothesis loop has one unchanged hypothesis for at least seven days"
            )

        checkpoints = {
            row["id"]: row
            for row in hypothesis.execute(
                "SELECT id, content_id, target_hours, collected_at FROM content_results"
            ).fetchall()
        }
        stale_requests = hypothesis.execute(
            """
            SELECT COUNT(*)
            FROM measurement_requests
            WHERE status = 'pending'
              AND datetime(requested_at) <= datetime(?, '-3 days')
            """,
            (now_text,),
        ).fetchone()[0]
        if stale_requests:
            warnings.append(
                f"{stale_requests} TikTok Studio measurement request(s) remain pending for at least three days"
            )

    with sqlite3.connect(research_db) as research:
        research.row_factory = sqlite3.Row
        event_run_count = research.execute(
            """
            SELECT COUNT(*)
            FROM research_runs
            WHERE trigger_kind IN ('content_preflight', 'result_review', 'manual')
            """
        ).fetchone()[0]
        if hypothesis_count and event_run_count == 0:
            warnings.append(
                "hypothesis state exists but Research DB has no event research runs"
            )
        reviewed_checkpoint_ids = set()
        for row in research.execute(
            """
            SELECT event_context_json, started_at
            FROM research_runs
            WHERE trigger_kind = 'result_review' AND status = 'completed'
            """
        ).fetchall():
            context = json.loads(row["event_context_json"])
            for checkpoint in context.get("checkpoints", []):
                result_id = checkpoint.get("result_id")
                result = checkpoints.get(result_id)
                if (
                    result is not None
                    and checkpoint.get("content_id") == result["content_id"]
                    and checkpoint.get("target_hours") == result["target_hours"]
                    and research.execute(
                        "SELECT datetime(?) >= datetime(?)",
                        (row["started_at"], result["collected_at"]),
                    ).fetchone()[0]
                ):
                    reviewed_checkpoint_ids.add(result_id)
        unreviewed_count = len(set(checkpoints) - reviewed_checkpoint_ids)
        if unreviewed_count:
            noun = "checkpoint has" if unreviewed_count == 1 else "checkpoints have"
            warnings.append(
                f"{unreviewed_count} content {noun} no subsequent result-review research run linked to that checkpoint"
            )

        outcome_rows = research.execute(
            """
            SELECT question.status
            FROM research_questions AS question
            JOIN research_runs AS run ON run.id = question.run_id
            WHERE run.trigger_kind IN ('content_preflight', 'result_review', 'manual')
              AND question.status <> 'selected'
            ORDER BY run.started_at DESC, question.position DESC
            LIMIT 10
            """
        ).fetchall()
        if len(outcome_rows) >= 5:
            weak_count = sum(
                row["status"] in {"duplicate", "no_finding", "outside_scope", "failed"}
                for row in outcome_rows
            )
            if weak_count / len(outcome_rows) >= 0.8:
                warnings.append(
                    "recent research outcomes are concentrated in duplicate, no-finding, outside-scope, or failed states"
                )

        owner_rows = research.execute(
            """
            SELECT finding.proposed_owner, COUNT(*) AS count
            FROM (
                SELECT id, proposed_owner
                FROM research_findings
                ORDER BY created_at DESC
                LIMIT 10
            ) AS finding
            GROUP BY finding.proposed_owner
            ORDER BY count DESC
            """
        ).fetchall()
        if owner_rows and sum(row["count"] for row in owner_rows) >= 10:
            total = sum(row["count"] for row in owner_rows)
            if owner_rows[0]["count"] / total >= 0.9:
                warnings.append(
                    f"recent research findings are concentrated in one proposed owner: {owner_rows[0]['proposed_owner']}"
                )

        source_rows = research.execute(
            """
            SELECT source.source_kind, COUNT(*) AS count
            FROM (
                SELECT id
                FROM research_findings
                ORDER BY created_at DESC
                LIMIT 10
            ) AS finding
            JOIN research_finding_sources AS link ON link.finding_id = finding.id
            JOIN research_sources AS source ON source.id = link.source_id
            GROUP BY source.source_kind
            ORDER BY count DESC
            """
        ).fetchall()
        if source_rows and sum(row["count"] for row in source_rows) >= 10:
            total = sum(row["count"] for row in source_rows)
            if source_rows[0]["count"] / total >= 0.9:
                warnings.append(
                    f"recent research evidence is concentrated in one source class: {source_rows[0]['source_kind']}"
                )


def inspect_system(
    *,
    research_db: Path = DEFAULT_RESEARCH_DB,
    hypothesis_db: Path = DEFAULT_HYPOTHESIS_DB,
    jobs_path: Path = DEFAULT_JOBS_PATH,
    required_files=None,
    now=None,
):
    if now is None:
        now = datetime.now(timezone.utc)
    issues: list[str] = []
    warnings: list[str] = []
    _inspect_database(
        Path(research_db), "research", EXPECTED_SCHEMA_VERSIONS["research"], issues
    )
    _inspect_database(
        Path(hypothesis_db),
        "hypothesis",
        EXPECTED_SCHEMA_VERSIONS["hypothesis"],
        issues,
    )
    _inspect_jobs(Path(jobs_path), issues, warnings)
    if not issues:
        try:
            _inspect_operational_health(
                Path(research_db), Path(hypothesis_db), now, warnings
            )
        except Exception as error:
            issues.append(f"operational health inspection failed: {error}")
    files = DEFAULT_REQUIRED_FILES if required_files is None else required_files
    for relative in files:
        path = REPO_ROOT / relative
        if not path.is_file():
            issues.append(f"required owner is missing: {relative}")
    return {
        "ok": not issues,
        "checked_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "issues": issues,
        "warnings": warnings,
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
