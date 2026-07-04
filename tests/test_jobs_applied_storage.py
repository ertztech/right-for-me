from __future__ import annotations

import json
import unittest
from pathlib import Path

from tools.jobs_applied.storage import (
    JobApplicationValidationError,
    add_job_application,
    read_job_applications,
    update_job_application,
)


class JobsAppliedStorageTests(unittest.TestCase):
    def setUp(self) -> None:
        self.storage_path = Path(__file__).with_name("_job-applications-test.json")
        self.storage_path.write_text("[]", encoding="utf-8")

    def tearDown(self) -> None:
        if self.storage_path.exists():
            self.storage_path.unlink()

    def test_reading_records(self) -> None:
        self.storage_path.write_text(
            json.dumps([sample_record()]),
            encoding="utf-8",
        )

        records = read_job_applications(self.storage_path)

        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["company"], "Example Company")

    def test_adding_record(self) -> None:
        records = add_job_application(sample_record(), self.storage_path)

        self.assertEqual(len(records), 1)
        self.assertEqual(read_job_applications(self.storage_path)[0]["id"], "job_2026_0001")

    def test_updating_record(self) -> None:
        add_job_application(sample_record(), self.storage_path)

        updated = update_job_application(
            "job_2026_0001",
            {
                "status": "Applied",
                "dateApplied": "2026-07-03",
                "followUpDate": "2026-07-10",
                "notes": "Applied with tailored resume and cover letter.",
            },
            self.storage_path,
        )

        self.assertEqual(updated["status"], "Applied")
        saved = read_job_applications(self.storage_path)[0]
        self.assertEqual(saved["dateApplied"], "2026-07-03")
        self.assertEqual(saved["followUpDate"], "2026-07-10")
        self.assertEqual(saved["notes"], "Applied with tailored resume and cover letter.")
        self.assertEqual(saved["company"], "Example Company")

    def test_updating_fit_review_persists(self) -> None:
        add_job_application(sample_record(), self.storage_path)

        updated = update_job_application(
            "job_2026_0001",
            {
                "fitScore": 82,
                "fitRecommendation": "Maybe",
                "fitAnalysis": {
                    "fitScore": 82,
                    "recommendation": "Maybe",
                    "strengths": ["Strong transformation background"],
                    "gaps": ["Prepare budget ownership example"],
                    "concerns": ["Domain depth may be tested"],
                    "suggestedPositioning": "Lead with operational transformation outcomes.",
                    "generatedAt": "",
                    "promptVersion": "fit-analysis-v1",
                    "modelName": "",
                    "userApproved": True,
                },
            },
            self.storage_path,
        )

        saved = read_job_applications(self.storage_path)[0]
        self.assertEqual(updated["fitRecommendation"], "Maybe")
        self.assertEqual(saved["fitAnalysis"]["recommendation"], "Maybe")
        self.assertEqual(saved["fitAnalysis"]["strengths"][0], "Strong transformation background")
        self.assertEqual(saved["company"], "Example Company")

    def test_updating_resume_draft_persists(self) -> None:
        add_job_application(sample_record(), self.storage_path)

        update_job_application(
            "job_2026_0001",
            {
                "resumeDraft": {
                    "tailoredSummary": "Transformation leader focused on measurable operations results.",
                    "tailoredSkills": ["Transformation", "Metrics"],
                    "tailoredExperienceBullets": ["Improved cross-functional operating rhythm."],
                    "markdownContent": "## Resume\nTransformation leader...",
                    "markdownPreview": "## Resume\nTransformation leader...",
                    "generatedAt": "",
                    "promptVersion": "tailored-resume-v1",
                    "modelName": "manual",
                    "userApproved": True,
                },
            },
            self.storage_path,
        )

        saved = read_job_applications(self.storage_path)[0]
        self.assertEqual(saved["resumeDraft"]["modelName"], "manual")
        self.assertTrue(saved["resumeDraft"]["userApproved"])
        self.assertEqual(saved["resumeDraft"]["tailoredSkills"], ["Transformation", "Metrics"])
        self.assertEqual(saved["company"], "Example Company")

    def test_updating_cover_letter_draft_persists(self) -> None:
        add_job_application(sample_record(), self.storage_path)

        update_job_application(
            "job_2026_0001",
            {
                "coverLetterDraft": {
                    "coverLetterContent": "Dear Hiring Team...",
                    "draftText": "Dear Hiring Team...",
                    "toneNote": "Warm, friendly, confident, and human.",
                    "generatedAt": "",
                    "promptVersion": "cover-letter-v1",
                    "modelName": "manual",
                    "userApproved": False,
                },
            },
            self.storage_path,
        )

        saved = read_job_applications(self.storage_path)[0]
        self.assertEqual(saved["coverLetterDraft"]["coverLetterContent"], "Dear Hiring Team...")
        self.assertEqual(saved["coverLetterDraft"]["modelName"], "manual")
        self.assertEqual(saved["roleTitle"], "Operations Transformation Lead")

    def test_updating_packet_notes_persists(self) -> None:
        add_job_application(sample_record(), self.storage_path)

        update_job_application(
            "job_2026_0001",
            {"notes": "Packet ready. Follow up next Friday."},
            self.storage_path,
        )

        saved = read_job_applications(self.storage_path)[0]
        self.assertEqual(saved["notes"], "Packet ready. Follow up next Friday.")
        self.assertEqual(saved["fitRecommendation"], "Apply")

    def test_rejecting_record_missing_required_fields(self) -> None:
        record = sample_record()
        record["company"] = ""

        with self.assertRaises(JobApplicationValidationError):
            add_job_application(record, self.storage_path)

    def test_rejecting_invalid_status(self) -> None:
        record = sample_record()
        record["status"] = "Thinking About It"

        with self.assertRaises(JobApplicationValidationError):
            add_job_application(record, self.storage_path)

    def test_rejecting_invalid_fit_review(self) -> None:
        add_job_application(sample_record(), self.storage_path)

        with self.assertRaises(JobApplicationValidationError):
            update_job_application(
                "job_2026_0001",
                {"fitScore": 125, "fitRecommendation": "Apply"},
                self.storage_path,
            )

        with self.assertRaises(JobApplicationValidationError):
            update_job_application(
                "job_2026_0001",
                {"fitScore": 85, "fitRecommendation": "Definitely"},
                self.storage_path,
            )


def sample_record() -> dict:
    return {
        "id": "job_2026_0001",
        "company": "Example Company",
        "roleTitle": "Operations Transformation Lead",
        "jobUrl": "https://example.com/jobs/123",
        "location": "Remote",
        "salaryRange": "$100,000 - $125,000",
        "workArrangement": "Remote",
        "status": "Reviewing",
        "fitScore": 78,
        "fitRecommendation": "Apply",
        "dateFound": "2026-07-03",
        "dateApplied": "",
        "followUpDate": "",
        "resumeVersionPath": "outputs/example-company-resume.md",
        "coverLetterPath": "outputs/example-company-cover-letter.md",
        "notes": "Strong match on transformation, metrics, and stakeholder communication.",
        "sourcePostingText": "Full pasted job description text...",
    }


if __name__ == "__main__":
    unittest.main()
