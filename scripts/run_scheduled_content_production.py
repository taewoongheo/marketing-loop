#!/usr/bin/env python3
"""Gate and launch the autonomous LIFT CODE content-production agent."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROFILE = "marketing-liftcode"
SKILLS = ("organic-content-operations", "product-marketing")
REPOSITORY = Path(__file__).resolve().parents[1]


def build_production_prompt(attempt_token: str) -> str:
    return f"""Execute exactly one scheduled LIFT CODE content-production cycle.

The wrapper has already verified that this is the exact configured cron minute. Work only in the current repository and follow AGENTS.md, especially Scheduled autonomous production and the required content workflow. Before starting, reconcile prior dispatching research_notifications by parsing each attempt token's scheduler job ID and inspecting that job's previous scheduler-owned last_status, last_delivery_error, and last_run_at. Resolve only unambiguous prior attempts and never resolve `{attempt_token}` during this run.

Before choosing the hypothesis action or content, run one `content_preflight` research lifecycle through scripts/research_store.py. Use the governing question of what would most improve this cycle's qualified-audience/content decision. Read prior research quality feedback and actively investigate no more than three bounded questions across any relevant domain when current accepted evidence is insufficient; select zero when it is sufficient. Review and route every finding autonomously, preserve limitations, and finish every selected question. Use attempt token `{attempt_token}` when preparing current research notifications and never resolve that current attempt. Assess semantic system integrity during the same cycle and autonomously fix only concrete internally authorized ownership, consistency, lifecycle, or capability defects; do not add an external runtime watchdog.

The business purpose is qualified App Store inflow. During prelaunch, gather the relevant audience by delivering standalone value in the product decision space from context/product.md: help people choose or evaluate Programs, reduce progression decisions, or solve a directly related audience need. Select and synthesize only the knowledge needed for the chosen content, preserve evidence limits, and express it in an immediately understandable or usable form. Do not mention or promote LIFT CODE before launch.

Inspect live funnel evidence, newly accepted preflight research, hypotheses/results, messages, imagery, both medium namespaces, and the selected format evidence. Autonomously apply the scheduled-run exception to hypothesis and copy approval gates; produce, validate, render, record, and deliver exactly one publication-ready TikTok content to the configured Telegram destination. Never publish to TikTok. Obey dirty-tree isolation, tracked-owner commit/push rules, exact media delivery rules, AI-media disclosure, pending-publication URL handling, and post-delivery local project pruning.

After successful media delivery, return one compact Korean research digest containing the research run ID, questions and finding IDs/outcomes, principal sources and limitations, actions/owners, system-integrity finding, and the resulting content-decision change. Invite quality feedback using `useful`, `weak_evidence`, `irrelevant`, `overstated`, or `correction`. Do not include routine render/hash/commit detail. If user action is required or completion fails, return one concise Korean line containing only the essential action or blocker."""


def _field_matches(field: str, value: int) -> bool:
    if field == "*":
        return True
    return any(part.isdigit() and int(part) == value for part in field.split(","))


def _cron_matches(expr: str, now: datetime) -> bool:
    fields = expr.split()
    if len(fields) != 5:
        return False
    minute, hour, day, month, weekday = fields
    cron_weekday = (now.weekday() + 1) % 7
    return all(
        (
            _field_matches(minute, now.minute),
            _field_matches(hour, now.hour),
            _field_matches(day, now.day),
            _field_matches(month, now.month),
            _field_matches(weekday, cron_weekday),
        )
    )


def is_exact_scheduled_minute(
    *, jobs_path: Path, script_path: Path, now: datetime
) -> bool:
    data = json.loads(jobs_path.read_text(encoding="utf-8"))
    expected_script = script_path.expanduser().resolve()
    matches = []
    for job in data.get("jobs", []):
        configured_script = job.get("script")
        if not configured_script:
            continue
        configured_path = Path(configured_script).expanduser()
        if not configured_path.is_absolute():
            configured_path = jobs_path.parent.parent / "scripts" / configured_path
        if configured_path.resolve() != expected_script:
            continue
        if not job.get("enabled", True):
            continue
        if job.get("state") not in {"scheduled", "running"}:
            continue
        schedule = job.get("schedule") or {}
        if schedule.get("kind") == "cron":
            matches.append(str(schedule.get("expr", "")))
    return len(matches) == 1 and _cron_matches(matches[0], now)


def _profile_home() -> Path:
    configured = os.environ.get("HERMES_HOME")
    if configured:
        return Path(configured).expanduser()
    return Path.home() / ".hermes" / "profiles" / PROFILE


def scheduler_script_path() -> Path:
    configured = os.environ.get("LIFTCODE_SCHEDULER_SCRIPT")
    return Path(configured) if configured else Path(__file__)


def run_integrity_check(jobs_path: Path):
    completed = subprocess.run(
        [
            sys.executable,
            str(REPOSITORY / "scripts/system_integrity.py"),
            "--jobs",
            str(jobs_path),
        ],
        cwd=REPOSITORY,
        capture_output=True,
        text=True,
        timeout=120,
        check=False,
    )
    if completed.returncode != 0:
        detail = (completed.stdout or completed.stderr or "unknown integrity failure").strip()
        raise RuntimeError(detail[-1000:])


def run_agent(prompt: str) -> str:
    hermes = shutil.which("hermes")
    if not hermes:
        raise RuntimeError("hermes executable not found")

    command = [hermes, "--profile", PROFILE, "--yolo"]
    for skill in SKILLS:
        command.extend(("--skills", skill))
    command.extend(("chat", "--quiet", "--query", prompt))

    completed = subprocess.run(
        command,
        cwd=REPOSITORY,
        capture_output=True,
        text=True,
        timeout=3300,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError("scheduled production agent failed")

    output = completed.stdout.strip()
    if not output or "[SILENT]" in output:
        raise RuntimeError("scheduled production did not return its required research digest")
    return output


def main() -> int:
    jobs_path = _profile_home() / "cron" / "jobs.json"
    now = datetime.now().astimezone()
    if not is_exact_scheduled_minute(
        jobs_path=jobs_path,
        script_path=scheduler_script_path(),
        now=now,
    ):
        return 0

    try:
        run_integrity_check(jobs_path)
        job_id = os.environ.get("LIFTCODE_SCHEDULER_JOB_ID", "production")
        attempt_token = f"{job_id}:{now.isoformat(timespec='seconds')}"
        output = run_agent(build_production_prompt(attempt_token))
    except Exception:
        print("콘텐츠 생성 Cron 실패: 로컬 Cron 실행 기록을 확인해주세요.")
        return 1

    if output:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
