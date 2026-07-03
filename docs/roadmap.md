# RightForMe Roadmap

## Vision

RightForMe helps people capture their professional story once and use it everywhere.

The product is not just a resume generator. The deeper goal is to help someone understand, organize, and communicate the value they can bring to the right opportunity, especially when that opportunity feels slightly outside their comfort zone.

## Product Pillars

- Career Vault: a structured place to store work history, skills, tools, accomplishments, and professional evidence.
- Professional Profile Engine: turns raw career information into a clear professional profile.
- Resume Generator: creates a practical first-draft resume from the Career Vault.
- Job Analyzer: helps compare a role against the person's experience and direction.
- Tailoring Engine: adapts outputs for a specific job without inventing facts.
- Professional Outputs: resumes, cover letters, LinkedIn copy, interview notes, and portfolio material.
- Jobs Applied Pipeline: tracks job postings, fit decisions, application materials, statuses, and follow-up actions.

## Near-Term Phases

### MVP

- Career Vault
- Resume Generator
- Job Analyzer

### Phase 2

- Professional Summary
- Templates
- PDF Export
- Cover Letter

### Phase 3

- Job Tailoring
- Interview Prep
- LinkedIn Generator

### Phase 4

- AI-assisted recommendations
- Portfolio and website outputs

## Jobs Applied Pipeline

The Jobs Applied Pipeline is the planned workflow for turning a job posting into a tracked application. This branch only documents the direction and backlog structure; it does not build the UI or storage layer yet.

Intended workflow:

1. User adds or pastes a job posting.
2. App analyzes fit against the Career Vault.
3. App recommends Apply, Maybe, or Skip.
4. App generates tailored resume content from existing Career Vault data.
5. App generates tailored cover letter content from existing Career Vault data.
6. User marks the job as Applied.
7. App tracks follow-up dates, status, notes, and interview prep.

The pipeline should keep Career Vault as the source of truth. It may select, prioritize, and organize existing evidence, but it should not invent experience.

Future automation ideas:

- Suggest follow-up dates after an application is marked Applied.
- Surface stale applications that need a next action.
- Generate interview prep notes from saved job requirements and Career Vault evidence.
- Remind the user to update status after interviews, rejections, offers, or closed postings.
- Export an application packet when a job moves from Reviewing to Apply.

Near-term implementation should stay local, simple, and rule-based until the workflow proves useful.

## UX and Usability Revamp

RightForMe will move toward a guided workflow for job seekers. Job records, fit analysis, tailored resume output, cover letter output, application packet notes, and tracking should connect into one experience instead of living as separate tools.

Future UI work should follow [UX and Usability Plan](ux-usability-plan.md). The revamp should make the next action obvious, reduce duplicate typing, preserve honest fit decisions, and help users move quickly from saved posting to application follow-up.

## Not Yet

These ideas may matter later, but they are intentionally out of scope for now:

- User accounts
- Cloud sync
- Browser extension
- Mobile app
- Collaboration features

The near-term goal is a simple, useful local app that proves the workflow before the platform grows.
