# Fit Analysis Prompt Template

Prompt version: `fit-analysis-v1`

## Task

Analyze the job posting against the user's Career Vault profile. Return an honest fit analysis that helps the user decide whether to Apply, Maybe, or Skip. Do not invent experience.

## Inputs

### Job Posting Text

{{jobPostingText}}

### Company

{{company}}

### Role Title

{{roleTitle}}

### User Resume/Profile

{{userResumeProfile}}

### Tone Preferences

{{tonePreferences}}

### Output Format

{{outputFormat}}

## Required Output

- Fit score
- Recommendation: Apply, Maybe, or Skip
- Strengths
- Gaps
- Concerns
- Suggested positioning
- Evidence used from the user's profile

## Guardrails

- Use only the user's resume/profile and the saved job posting.
- Keep the assessment honest, not overly encouraging.
- If evidence is missing, say so plainly.
