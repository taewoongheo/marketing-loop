#!/usr/bin/env python3
"""Launch a bounded research cycle from a real content-system event."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


PROFILE = "marketing-liftcode"
SKILLS = ("organic-content-operations", "product-marketing")
REPOSITORY = Path(__file__).resolve().parents[1]
VALID_TRIGGERS = {"content_preflight", "result_review", "manual"}


def build_research_prompt(
    *, trigger_kind: str, objective: str, event_context: dict, attempt_token: str
) -> str:
    if trigger_kind not in VALID_TRIGGERS:
        raise ValueError(f"unsupported event research trigger: {trigger_kind}")
    context_json = json.dumps(
        event_context, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    )
    return f"""Run one event-driven LIFT CODE research cycle.

Trigger: {trigger_kind}
Objective: {objective}
Event context: {context_json}
Delivery attempt token: {attempt_token}

Operate only in {REPOSITORY}. Follow AGENTS.md and docs/research-loop.md. Use scripts/research_store.py as the sole Research DB lifecycle writer.

First run scripts/system_integrity.py and inspect its result. Treat deterministic failures as blockers. Also assess semantic system integrity: missing responsibility, duplicate owner, logical conflict, stale workflow instruction, unreliable transition, or missing capability that materially limits this content cycle. Implement only the smallest internally authorized correction and verify it. This is scheduler-internal automation; do not add a launchd service, daemon, or any other runtime watchdog outside Hermes Scheduler.

Reconcile prior dispatching research_notifications before starting. Parse each attempt token's scheduler job ID, inspect that job's previous last_status, last_delivery_error, and last_run_at in the marketing-liftcode Hermes jobs file, and resolve only attempts whose scheduler-owned result is unambiguous. Never resolve {attempt_token} during this run.

Start exactly one research run with trigger {trigger_kind}. Read the current funnel diagnosis, launch constraints, product truth, active hypothesis lineage, relevant content/checkpoints, accepted Research DB knowledge, recent duplicate/no-finding history, and prior research quality feedback. Frame the broad governing question as what would most improve the current qualified-audience or content decision, then select no more than three independent bounded questions. Search actively across any relevant domain rather than a fixed category list, but do not research for volume. If accepted evidence is already sufficient, select zero questions and finish the run cleanly.

For every selected question, persist selection before investigation and finish it as one bounded finding, duplicate, no_finding, outside_scope, or failed outcome. Preserve exact sources, contradictions, and limitations. A new 24h/48h/72h checkpoint is diagnostic evidence, not causal proof; distinguish distribution noise, measurement gaps, message, copywriting, and topic/execution conditions before proposing an explanation. Do not turn medium, format, imagery, or raw metrics into hypothesis axes.

Review every finding autonomously. Adopt a supported result into exactly one valid owner, applying the autonomous-system-improvement invariants and dirty-tree isolation. Research may inform a message or copywriting hypothesis candidate but must not mutate hypothesis lineage outside its separate contract. Finish the run with no selected question unresolved. Then call prepare-notifications with attempt token {attempt_token}; do not resolve the current attempt.

Always return a compact Korean research digest, even when no external search was needed. Include the run ID, trigger and governing objective; each question's finding ID or terminal outcome; bounded result, principal sources and limitations; adoption/action and exact owner; any system integrity issue and correction; and specifically how this changes—or does not change—the next content decision. Invite quality feedback using the run/finding IDs and the labels useful, weak_evidence, irrelevant, overstated, or correction. Do not ask for ordinary finding approval. Return only the digest or one essential blocker line. Never create or publish content in this research cycle."""


def run_research(
    *, trigger_kind: str, objective: str, event_context: dict, attempt_token: str
) -> str:
    hermes = shutil.which("hermes")
    if not hermes:
        raise RuntimeError("hermes executable not found")
    prompt = build_research_prompt(
        trigger_kind=trigger_kind,
        objective=objective,
        event_context=event_context,
        attempt_token=attempt_token,
    )
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
        detail = (completed.stderr or completed.stdout or "unknown failure").strip()
        raise RuntimeError(f"event research agent failed: {detail[-500:]}")
    output = completed.stdout.strip()
    if not output or "[SILENT]" in output:
        raise RuntimeError("event research agent did not return the required digest")
    return output


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--trigger", choices=sorted(VALID_TRIGGERS), required=True)
    parser.add_argument("--objective", required=True)
    parser.add_argument("--event-json", default="{}")
    parser.add_argument("--attempt-token", required=True)
    return parser.parse_args()


def main():
    args = parse_args()
    event_context = json.loads(args.event_json)
    if not isinstance(event_context, dict):
        raise ValueError("event context must be a JSON object")
    print(
        run_research(
            trigger_kind=args.trigger,
            objective=args.objective,
            event_context=event_context,
            attempt_token=args.attempt_token,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
