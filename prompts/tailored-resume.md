# Tailored Resume Prompt Template

Prompt version: `tailored-resume-v1`

## Task

Create a tailored resume draft for the job posting using only the user's Career Vault profile. Prioritize relevant evidence, skills, tools, and accomplishments. Do not invent experience.

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

- Tailored professional summary
- Tailored skills
- Tailored tools
- Tailored experience bullets
- Markdown resume preview

## Guardrails

- Use only facts from the user's resume/profile.
- Reorder and emphasize existing evidence.
- Do not create new roles, accomplishments, tools, or credentials.
