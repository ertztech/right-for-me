# AI Outputs Data Model

This document defines the first storage shape for future AI-generated outputs in the Jobs Applied workflow. It is structural only: the app does not call live AI APIs yet.

## Job Application AI Output Fields

Each job application record may include optional AI output fields:

```json
{
  "fitAnalysis": {
    "fitScore": 78,
    "recommendation": "Apply",
    "strengths": ["Transformation experience", "Metrics-driven operations work"],
    "gaps": ["Prepare examples for budget ownership"],
    "concerns": ["Role may require deeper domain experience"],
    "suggestedPositioning": "Lead with transformation, metrics, and stakeholder communication.",
    "generatedAt": "2026-07-03T17:00:00Z",
    "promptVersion": "fit-analysis-v1",
    "modelName": "",
    "userApproved": false
  },
  "resumeDraft": {
    "tailoredSummary": "Draft summary based on Career Vault evidence...",
    "tailoredSkills": ["Change Management", "Metrics", "Stakeholder Communication"],
    "tailoredExperienceBullets": ["Led transformation work across teams."],
    "markdownPreview": "## Professional Summary\n...",
    "generatedAt": "2026-07-03T17:00:00Z",
    "promptVersion": "tailored-resume-v1",
    "modelName": "",
    "userApproved": false
  },
  "coverLetterDraft": {
    "draftText": "Dear Hiring Team...",
    "toneNote": "Warm, friendly, confident, and human.",
    "generatedAt": "2026-07-03T17:00:00Z",
    "promptVersion": "cover-letter-v1",
    "modelName": "",
    "userApproved": false
  }
}
```

## Shared Metadata

- `generatedAt`: ISO timestamp for when the output was created.
- `promptVersion`: Version identifier for the prompt template used.
- `modelName`: Model name used for generation once live AI is wired. Leave blank for placeholders.
- `userApproved`: Boolean showing whether the user reviewed and approved the generated output.

## Implementation Notes

- AI outputs should remain optional so existing job records continue to load.
- AI outputs should be treated as drafts until `userApproved` is true.
- Generated content must be grounded in Career Vault data and the saved job posting.
- Prompt templates live in `prompts/` and should be versioned before live AI integration.
- Do not store API keys, secrets, or provider credentials in job records.
