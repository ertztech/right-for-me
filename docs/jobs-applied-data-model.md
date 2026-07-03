# Jobs Applied Data Model

This document proposes a small job application record for the future Jobs Applied pipeline. The model should be simple enough to store as JSON first, then move to SQLite or a database later if the app grows.

## Job Application Record

```json
{
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
  "fitAnalysis": null,
  "resumeDraft": null,
  "coverLetterDraft": null
}
```

## Fields

- `id`: Unique application identifier.
- `company`: Company or organization name.
- `roleTitle`: Job title from the posting.
- `jobUrl`: Link to the original posting.
- `location`: Location listed in the posting.
- `salaryRange`: Salary or compensation range, if known.
- `workArrangement`: Remote, hybrid, onsite, travel-heavy, or another short description.
- `status`: Current application status.
- `fitScore`: Numeric fit score from the analyzer.
- `fitRecommendation`: Apply, Maybe, Skip, or another recommendation label.
- `dateFound`: Date the user saved or pasted the posting.
- `dateApplied`: Date the user marked the job as applied.
- `followUpDate`: Date for the next follow-up or check-in.
- `resumeVersionPath`: Path to the tailored resume Markdown output.
- `coverLetterPath`: Path to the tailored cover letter Markdown output.
- `notes`: User notes, decision notes, interview prep, or follow-up context.
- `sourcePostingText`: Original pasted job posting text.
- `fitAnalysis`: Optional future AI-generated fit analysis draft.
- `resumeDraft`: Optional future AI-generated tailored resume draft.
- `coverLetterDraft`: Optional future AI-generated cover letter draft.

See [AI Outputs Data Model](ai-outputs-data-model.md) for the structure of draft AI outputs.

## Recommended Statuses

- Found
- Reviewing
- Apply
- Maybe
- Skip
- Applied
- Interviewing
- Rejected
- Offer
- Closed

## Implementation Notes

- Start with a plain JSON record so the shape stays easy to inspect and migrate.
- Keep generated resume and cover letter content separate from the application record; store paths or references in the record.
- Preserve the original job posting text so future analysis can be rerun if the matching rules improve.
- Keep status names human-readable because users will see them directly.
- Do not store invented claims or generated facts outside the Career Vault evidence model.
