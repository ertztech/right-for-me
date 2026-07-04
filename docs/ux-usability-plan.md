# UX and Usability Plan

This plan describes the intended user experience for the NextMove job application pipeline. The product should feel like a small set of guided experiences rather than a long list of disconnected tools.

## Product UX Goal

NextMove should feel like a guided assistant for a job seeker who is trying to make good decisions quickly. The app should connect job postings, fit analysis, tailored outputs, application tracking, and follow-up actions into one calm workflow instead of asking the user to manage a spreadsheet beside the product.

The experience should help the user answer three questions:

1. Is this job worth pursuing?
2. What evidence from my Profile / Story Bank should I use?
3. What is the next action?

## Primary User Journey

### 1. Dashboard

- User sees jobs grouped by status.
- User sees next actions.
- User can quickly add a new job.

### 2. Opportunity Review

- User pastes a job description or job URL.
- User captures company, role title, location, salary, work arrangement, and notes.
- User manually structures Job Intelligence: responsibilities, required skills, preferred skills, tools, leadership expectations, certifications, and years of experience.
- User can run local rule-based extraction to fill blank Job Intelligence fields, then review and edit the result.
- User reviews fit score and Apply, Maybe, or Skip recommendation when available.

### 3. Fit Review

- User sees a fit score.
- User sees Apply, Maybe, or Skip recommendation.
- User sees strengths, concerns, gaps, and suggested positioning.

### 4. Application Studio

- User sees tailored resume content.
- User sees tailored cover letter content.
- User edits resume draft, cover letter draft, and packet notes in one focused area.

### 5. Tracking

- User marks status.
- User adds date applied.
- User adds follow-up date.
- User adds notes and interview prep.

## Core Screens and Pages

## Primary Experience Areas

### Dashboard

- Purpose: Career command center and next best action.
- Main user actions: Review status summary, open the recommended next action, add a new opportunity.
- Key data shown: Status counts, recent jobs, follow-ups, recommendation-driven next action.

### Opportunity Review

- Purpose: Add or paste a job posting, review Job Intelligence, and decide Apply, Maybe, or Skip.
- Main user actions: Save core job details, edit structured posting fields, review fit results, open Application Studio.
- Key data shown: Core job details, responsibilities, required skills, preferred skills, technologies/tools, leadership expectations, certifications, years of experience, notes, source posting text, fit recommendation.

### Application Studio

- Purpose: Bring resume draft, cover letter draft, and packet notes together.
- Main user actions: Edit and approve resume draft, edit and approve cover letter draft, save packet notes.
- Key data shown: Packet completeness, fit summary, resume status, cover letter status, packet notes.

### Tracker

- Purpose: Manage application statuses, dates, follow-ups, and notes.
- Main user actions: Update status, review applied/follow-up dates, open a job record.
- Key data shown: Jobs grouped by status, date found, date applied, follow-up date.

### Profile / Story Bank

- Purpose: Store the user's professional profile, accomplishments, skills, stories, tools, and reusable career evidence.
- Main user actions: Save profile data, add work history, add skills/tools/accomplishments, export JSON.
- Key data shown: Contact profile, work history, skills, tools, accomplishments.

### Settings

- Purpose: Preferences and future configuration.
- Main user actions: Review storage/export/reminder settings when those features exist.
- Key data shown: Future workflow defaults and preference placeholders.

### Dashboard

- Purpose: Give the user a quick view of their job search and what needs attention.
- Main user actions: Add job, open job detail, filter by status, review next actions.
- Key data shown: Jobs grouped by status, follow-up dates, recommendations, recently updated jobs.

### Add Job / Opportunity Review

- Purpose: Capture a new opportunity with as little duplicate typing as possible.
- Main user actions: Paste job description, add job URL, enter company, role title, location, salary, work arrangement, and notes.
- Key data shown: Basic job fields, source posting text, save status.

### Job Detail

- Purpose: Show the full record for one opportunity and connect every related output.
- Main user actions: Edit job details, run fit analysis, generate packet, update status, add notes.
- Key data shown: Company, role title, job URL, status, dates, notes, saved outputs, source posting text.

### Fit Review

- Purpose: Help the user decide whether to Apply, Maybe, or Skip.
- Main user actions: Review recommendation, inspect strengths and gaps, save analysis, move job into Apply or Skip.
- Key data shown: Fit score, recommendation, strengths, concerns, gaps, suggested positioning.

### Resume Builder

- Purpose: Create or review resume content based on Profile / Story Bank data.
- Main user actions: Generate resume, generate tailored resume, copy resume, download Markdown.
- Key data shown: Resume preview, generation status, related job if tailoring is active.

### Cover Letter Builder

- Purpose: Create or review cover letter content based on Profile / Story Bank data and the job posting.
- Main user actions: Generate cover letter, copy cover letter, download Markdown.
- Key data shown: Cover letter preview, generation status, related job if available.

### Application Packet / Application Studio

- Purpose: Bring the tailored resume, cover letter, and application notes together inside Application Studio.
- Main user actions: Generate packet, save packet, copy outputs, download outputs.
- Key data shown: Tailored resume, cover letter, strongest matching skills/tools, resume emphasis, possible gaps.

### Application Tracker

- Purpose: Track what happened after the user decided to apply.
- Main user actions: Mark Applied, update status, add date applied, add follow-up date, add interview prep.
- Key data shown: Current status, status history, follow-up date, notes, interview prep.

### Settings

- Purpose: Keep future preferences and defaults out of the main workflow.
- Main user actions: Set export preferences, manage storage location, review data options.
- Key data shown: App preferences, storage notes, future privacy/export controls.

## Information Architecture

- Dashboard
- Jobs
  - Opportunity Review
  - Fit Review
  - Application Tracker
- Outputs
  - Application Studio
- Profile / Story Bank
- Settings

The job record should become the connecting object. Job Intelligence, fit analysis, tailored resume output, cover letter output, application notes, follow-up dates, and status should all be reachable from the primary experience areas.

## Key User Actions

- Add a job posting.
- Save job details.
- Run fit analysis.
- Save fit recommendation.
- Generate tailored resume content.
- Generate tailored cover letter content.
- Generate an application packet.
- Copy or download outputs.
- Mark a job as Applied.
- Add follow-up date.
- Add notes and interview prep.
- Update job status.

## UX Principles

- Make the next action obvious.
- Keep the user out of spreadsheet mode.
- Show recommendation before details.
- Keep job fit honest, not overly encouraging.
- Reduce duplicate typing.
- Save every useful output.
- Make the product feel like a guided assistant, not a blank form.
- Support a job seeker who is tired, stressed, and trying to move quickly.
- Keep Profile / Story Bank as the source of truth for claims and evidence.
- Make status and follow-up visible without forcing the user to hunt.

## MVP Usability Improvements

- Add a dashboard summary for job statuses and next actions.
- Create a simple Add Job flow that stores posting text and basic job details.
- Connect a saved job to fit analysis results.
- Let users generate a tailored resume and cover letter from a saved job.
- Save generated application notes with the job record.
- Add clear status controls for Found, Reviewing, Apply, Maybe, Skip, Applied, Interviewing, Rejected, Offer, and Closed.
- Show follow-up date and next action near the top of the job detail page.
- Keep copy and download actions close to each generated output.
- Group top-level navigation into Dashboard, Opportunity Review, Application Studio, Tracker, Profile / Story Bank, and Settings.
- Add Job Intelligence v1 as manually editable structured posting data.

## Future UX Improvements

- Guided onboarding for Profile / Story Bank setup.
- AI-assisted extraction from source posting text into Job Intelligence fields.
- A checklist-style application packet review before applying.
- Calendar-style follow-up view.
- Status history and activity timeline.
- Search and filtering across jobs.
- Saved views for Apply, Maybe, Follow Up, and Interview Prep.
- Better empty states that suggest a next action.
- Import from job URL when the app has a safe parsing strategy.
- Optional reminders for follow-ups and stale applications.
- Accessibility review for keyboard navigation, labels, contrast, and focus states.
