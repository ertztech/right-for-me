# NextMove

NextMove is an AI-powered Career Operating System that helps professionals evaluate opportunities, position their experience, create application materials, track follow-up, and prepare for interviews.

Repository: `right-for-me`

The product is evolving from RightForMe toward the working name NextMove. It is built around one practical question:

> Is this opportunity right for me, and how do I show I am right for it?

Most job search tools focus on producing documents. NextMove starts earlier and continues later. It helps people decide whether a role is worth pursuing, understand where they already fit, identify where the role would stretch them, communicate their evidence with clarity, and keep track of what to do next.

## Mission

Help professionals confidently navigate career decisions from discovering opportunities through interviews and long-term career growth.

## Product Principles

- The right job is not always the comfortable one.
- A useful tool should distinguish between a bad fit and a healthy stretch.
- Every recommendation should be honest, specific, and actionable.
- The product should reduce self-rejection without encouraging fantasy.
- Every feature should answer: does this make someone more likely to choose the right opportunity and get an interview?

## Current Status

RightForMe is in early MVP development.

Version `0.1` focuses on one workflow:

1. Paste a job description.
2. Add optional background, resume text, or experience notes.
3. Receive a fit and stretch analysis.
4. Decide whether to apply and how to position yourself.

## MVP Scope

### v0.1 - Job Fit and Stretch Analyzer

- Role summary
- Key requirements
- Fit score
- Stretch score
- Existing evidence to emphasize
- Gaps or risks to understand
- Application strategy
- Recommendation: apply, maybe apply, save for later, or skip

### Not Yet Included

- User accounts
- Resume PDF generation
- Cover letter generation
- Saved job tracking
- AI interview coaching
- Browser extensions

Those may come later, but the first product must stay focused.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md). The roadmap now includes a Jobs Applied pipeline for tracking saved postings, fit decisions, tailored application materials, statuses, and follow-up actions.

See [docs/product-identity.md](docs/product-identity.md) for the NextMove identity direction and [docs/release-plan.md](docs/release-plan.md) for release milestones.

The app has a light NextMove UI brand pass: visible copy now frames the product as a guided career operating system, with calmer navigation labels and restrained styling. Code identifiers and storage keys still use the earlier RightForMe naming to avoid disruptive churn.

UX planning has also started. See [docs/ux-usability-plan.md](docs/ux-usability-plan.md) for the proposed guided workflow, screen list, information architecture, and usability principles for the job application pipeline. The current app is moving toward six primary experiences: Dashboard, Opportunity Review, Application Studio, Tracker, Profile / Story Bank, and Settings.

## Delivery Workflow

See [AGENTS.md](AGENTS.md) for the RightForMe delivery workflow: Trello for product intent, GitHub Issues for engineering work, feature branches for each change, and learning-in-public notes after each merge.

## Trello Product Board

See [docs/TRELLO_SETUP.md](docs/TRELLO_SETUP.md) to create the Trello product board from the included template.

## Architecture

The first prototype is intentionally simple:

- Static web interface
- Local scoring logic
- Structured analysis output
- No backend required for the first version

This keeps the MVP easy to run, easy to understand, and easy to replace later with a real AI-backed analysis service.

## Development

Open `index.html` in a browser to run the prototype.

Job application records for the Jobs Applied pipeline are stored in `data/job-applications.json`. The first storage helper lives in `tools/jobs_applied/storage.py` and supports reading, adding, updating, and validating records before a UI is added.

The first lightweight Jobs Applied app pages are available in `index.html`. The visible workflow now groups related work into Dashboard, Opportunity Review, Application Studio, Tracker, Profile / Story Bank, and Settings. The browser UI stores saved jobs in local storage for now, using the same fields documented in `docs/jobs-applied-data-model.md`.

Jobs Applied pages use hash routes, starting at `#/jobs/dashboard`. Opportunity Review includes job intake, manually editable Job Intelligence fields, and Fit Review context. Application Studio groups resume drafts, cover letter drafts, and packet notes. Job Intelligence has local rule-based extraction from pasted posting text, can generate a local first-pass Fit Review, and now includes an optional live AI-powered Review Opportunity pass.

Application Studio now includes a Resume Generation MVP. Generate Resume creates a deterministic local resume draft from the selected opportunity, Job Intelligence, Fit Review, Profile / Story Bank, background notes, and existing application information. The draft is saved on the selected job record in browser localStorage, so it remains available after refreshing the browser.

AI output structure and prompt templates have been added for fit analysis, tailored resume, cover letter drafts, and interview prep. Live AI opportunity review is available through a small local Node server, and it requires an OpenAI API key. Resume generation currently falls back to deterministic local generation; future AI improvements can add a backend-only resume endpoint without exposing API keys to frontend code.

The app also includes a small reusable action feedback helper. Important actions can show idle, working, success, and failure states; buttons disable while work is running and restore after completion. This keeps clicks visible without adding a notification library.

### Live AI setup

No backend dependencies need to be installed for the current local server; it uses built-in Node modules. Copy `.env.example` to `.env` and set:

```bash
OPENAI_API_KEY=your_api_key_here
```

Optional:

```bash
OPENAI_MODEL=gpt-5.5
PORT=4173
```

Run the local server with:

```bash
node server.js
```

Then open `http://localhost:4173` and use Opportunity Review -> Review Opportunity after pasting a job posting. Opening `index.html` directly still works for local-only features, but live AI requires the local server so the API key stays out of the browser.

AI calls use the OpenAI API and may cost money through your provider account. Never commit `.env` or any real API key. `.env` is ignored by Git.

Run the current Python tests with:

```bash
python -m unittest discover -s tests
```

Run the current JavaScript helper tests with:

```bash
node tests/jobIntelligenceExtractor.test.js
node tests/fitReviewPrefill.test.js
node tests/aiJobAnalysis.test.js
node tests/resumeGenerator.test.js
node tests/resumeGenerateButton.test.js
node tests/actionFeedback.test.js
node tests/demoDataSeeder.test.js
```

### Demo Data / Local Testing

Dashboard and Settings include `Load Sample Data` and `Clear Demo Data` buttons for local testing. Loading sample data adds three marked demo job records for an agile delivery / transformation role, an AI enablement / product operations role, and a manufacturing operations / continuous improvement role. The records include multiple statuses, posting text, job intelligence fields, fit review data, resume notes, generated resume drafts, cover letter drafts, interview prep, and follow-up fields where the app supports them.

If the Profile / Story Bank is empty or already demo-seeded, the seeder also adds sample profile evidence for Mike's target roles. Existing real jobs are preserved, and existing real Profile / Story Bank data is not overwritten. If local real data exists, the app asks before loading sample data alongside it.

Clear Demo Data removes only records marked by the demo seeder and clears the demo Profile / Story Bank only when it owns that sample profile.

### Manual testing

1. Start the local server with `node server.js`.
2. Open `http://localhost:4173`.
3. Go to Dashboard or Settings and click `Load Sample Data`; confirm success feedback.
4. Verify Dashboard, Tracker, Opportunity Review, and Application Studio show useful sample records and draft content.
5. Refresh the browser and confirm sample data persists.
6. Add or select a saved opportunity in Opportunity Review.
7. Paste a job posting and click `Review Opportunity`; confirm the button shows a working state and a success or useful error message.
8. Open Application Studio and click `Generate Resume`; confirm the resume draft appears and the status says it was saved.
9. Click `Clear Demo Data`; confirm demo records are removed and real records remain.
10. Try an error case, such as clicking `Review Opportunity` without running the local server or without `OPENAI_API_KEY`; confirm the error is readable and not silent.

Current limitations: resume generation is deterministic local logic, not a live AI resume call yet. It prioritizes existing Profile / Story Bank and job-record evidence and does not invent experience.

## Contributing

This project is being built in public as a learning journey and product experiment. Contributions, ideas, and thoughtful critique are welcome once the public repository is live.

## License

License to be decided before public release.
