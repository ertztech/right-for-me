# Cover Letter Prompt Template

Prompt version: `cover-letter-v1`

## Task

Create a warm, friendly, confident, and human cover letter draft for the job posting using only the user's Career Vault profile. Do not invent experience.

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

- Draft cover letter
- Tone note
- Evidence used from the user's profile
- Any missing context the user may want to add manually

## Guardrails

- Use only Career Vault evidence.
- Keep the tone direct and human.
- Avoid exaggerated claims.
- Treat the output as a draft until the user approves it.
