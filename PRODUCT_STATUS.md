# NextMove Product Status

## Product Name

NextMove is the current product name. The app was formerly called Right For Me, and some repository names, code identifiers, localStorage keys, and older docs still use RightForMe naming to avoid disruptive churn.

## Product Vision

NextMove is an AI-assisted career operating system that helps a user evaluate opportunities, manage applications, generate tailored application materials, and organize career stories and profile data.

The product is meant to help a user answer two practical questions:

1. Is this opportunity right for me?
2. How do I show that I am right for it using real evidence?

NextMove should keep recommendations honest, grounded in the Profile / Story Bank, and useful for deciding the next action.

## Current Product Phase

Foundation / MVP.

The current product is a local-first prototype with browser localStorage persistence, a lightweight Node server for optional live AI opportunity review, and deterministic local generation for several application-material workflows.

## Major Product Areas

- Dashboard
- Opportunity Review
- Application Studio
- Tracker
- Profile / Story Bank
- Settings
- Demo / Local Testing Support

## Completed Capabilities

- Local application tracking with saved job records, statuses, dates, follow-up fields, notes, and selected-job routing.
- Dashboard summaries for saved opportunities, status counts, recent jobs, and next best action prompts.
- Opportunity Review for job intake, editable job details, source posting text, and structured Job Intelligence fields.
- Local rule-based Job Intelligence extraction from pasted posting text.
- Fit Review support with fit score, Apply / Maybe / Skip recommendation, strengths, gaps, concerns, suggested positioning, and approval state.
- Optional live AI Opportunity Review through the local Node server when `OPENAI_API_KEY` is configured.
- Application Studio as a selected-opportunity packet workspace for reviewing job details, status, follow-up fields, job intelligence, fit review, resume drafts, cover letter drafts, and packet notes.
- Deterministic local resume generation from the selected opportunity, Job Intelligence, Fit Review, Profile / Story Bank, background notes, and existing application information.
- Cover letter generation and editable cover letter draft support grounded in Career Vault / Profile / Story Bank data and the job posting.
- Application packet notes and markdown preview helpers for resume, cover letter, and application notes.
- Tracker view with application status updates and follow-up visibility.
- Profile / Story Bank support through the Career Vault, including person fields, roles, skills, tools, accomplishments, saving, loading, and export.
- Demo / Local Testing Support with `Load Sample Data` and `Clear Demo Data` buttons on Dashboard and Settings.
- Demo data seeding for three realistic Mike-target-role opportunities, sample Profile / Story Bank evidence, posting text, job intelligence, fit review, resume drafts, cover letter drafts, interview prep, and follow-up fields.
- Demo data clearing that removes only demo-created records where possible and preserves non-demo user data.
- localStorage-based persistence for browser job records and Career Vault data.
- Reusable action feedback for important buttons with working, success, and failure states.
- Automated helper tests for job intelligence extraction, fit review prefilling, AI output validation, resume generation, action feedback, and demo data seeding.

## Current Outcome

Make NextMove easier to test, demo, and extend locally.

The demo data seeder is part of this outcome. It gives developers and product owners a fast way to load realistic records, verify Dashboard and Tracker behavior, open seeded records in Opportunity Review and Application Studio, and clear demo records without destroying real local data.

## Recommended Next Outcomes

1. Improve application workflow completeness.
   Make the saved-job path feel more complete from Opportunity Review through applied status, follow-up, and next action.

2. Strengthen Application Studio.
   Continue improving packet readiness, draft review ergonomics, and handoff from generated content into submitted applications.

3. Improve AI coaching and recommendations.
   Expand recommendation quality for fit, positioning, interview prep, and next actions while keeping outputs grounded in Profile / Story Bank evidence.

4. Add import/export or backup support.
   Give local-first users a safe way to move or back up job records and Profile / Story Bank data before cloud persistence exists.

5. Prepare for hosted/public beta.
   Stabilize the local workflow, clarify setup, review UX gaps, and identify what must change before public hosting.

6. Add authentication and cloud persistence later.
   Treat accounts and cloud sync as a later platform step, after the local workflow proves useful.

## Workflow Rules

- Start new work from `main`.
- Pull latest `main` before creating a branch.
- Use one feature branch per outcome or issue.
- Keep branch names outcome-based and versioned when needed.
- Open a PR before switching to another major task.
- Merge completed PRs before stepping away when possible.
- After merge, return to `main` and pull latest.
- Keep the working tree clean before starting the next task.

## Branch / PR Naming Guidance

Use short, outcome-based names that make the branch understandable in the sidebar and PR list.

Examples:

- `feature/demo-data-seeder-v1`
- `feature/product-status-roadmap-v1`
- `feature/application-studio-polish-v1`

PR titles should describe the outcome in plain language, such as:

- `Add demo data seeder for local testing`
- `Add product status and roadmap source of truth`
- `Polish Application Studio seeded-record experience`

## Next Suggested Issue

Improve Application Studio seeded-record experience.

Suggested scope:

- Make seeded records easy to open directly from Dashboard, Tracker, and Application Studio.
- Ensure seeded resume and cover letter drafts are immediately visible and clearly editable.
- Clarify packet readiness for seeded records with saved drafts, fit review, and follow-up notes.
- Verify action buttons behave consistently when a seeded record is selected.

