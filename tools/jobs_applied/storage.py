from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_STORAGE_PATH = ROOT_DIR / "data" / "job-applications.json"
REQUIRED_FIELDS = ["id", "company", "roleTitle", "status"]
VALID_STATUSES = {
    "Found",
    "Reviewing",
    "Apply",
    "Maybe",
    "Skip",
    "Applied",
    "Interviewing",
    "Rejected",
    "Offer",
    "Closed",
}
FIT_RECOMMENDATIONS = {"Apply", "Maybe", "Skip"}


class JobApplicationValidationError(ValueError):
    """Raised when a job application record is missing required data."""


class JobApplicationNotFoundError(LookupError):
    """Raised when a job application record cannot be found by id."""


def read_job_applications(path: Path = DEFAULT_STORAGE_PATH) -> list[dict[str, Any]]:
    if not path.exists():
        return []

    records = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError(f"Expected a list of job applications in {path}.")

    return records


def add_job_application(
    record: dict[str, Any],
    path: Path = DEFAULT_STORAGE_PATH,
) -> list[dict[str, Any]]:
    validate_job_application(record)
    records = read_job_applications(path)

    if any(existing.get("id") == record["id"] for existing in records):
        raise JobApplicationValidationError(f"Job application already exists: {record['id']}")

    records.append(record)
    write_job_applications(records, path)
    return records


def update_job_application(
    job_id: str,
    updates: dict[str, Any],
    path: Path = DEFAULT_STORAGE_PATH,
) -> dict[str, Any]:
    records = read_job_applications(path)

    for index, existing in enumerate(records):
        if existing.get("id") == job_id:
            updated = {**existing, **updates, "id": job_id}
            validate_job_application(updated)
            records[index] = updated
            write_job_applications(records, path)
            return updated

    raise JobApplicationNotFoundError(f"Job application not found: {job_id}")


def validate_job_application(record: dict[str, Any]) -> None:
    missing = [
        field
        for field in REQUIRED_FIELDS
        if not str(record.get(field, "")).strip()
    ]

    if missing:
        names = ", ".join(missing)
        raise JobApplicationValidationError(f"Missing required field(s): {names}")

    if record.get("status") not in VALID_STATUSES:
        raise JobApplicationValidationError(f"Invalid job status: {record.get('status')}")

    validate_fit_review(record)


def validate_fit_review(record: dict[str, Any]) -> None:
    fit_analysis = record.get("fitAnalysis") or {}
    score = fit_analysis.get("fitScore", record.get("fitScore"))
    recommendation = fit_analysis.get("recommendation", record.get("fitRecommendation"))

    if str(score or "").strip():
        try:
            numeric_score = float(score)
        except (TypeError, ValueError) as exc:
            raise JobApplicationValidationError("Fit score must be a number from 0 to 100.") from exc

        if numeric_score < 0 or numeric_score > 100:
            raise JobApplicationValidationError("Fit score must be a number from 0 to 100.")

    if str(recommendation or "").strip() and recommendation not in FIT_RECOMMENDATIONS:
        raise JobApplicationValidationError(f"Invalid fit recommendation: {recommendation}")


def write_job_applications(
    records: list[dict[str, Any]],
    path: Path = DEFAULT_STORAGE_PATH,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(records, indent=2) + "\n", encoding="utf-8")
