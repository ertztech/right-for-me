# RightForMe

RightForMe helps job seekers evaluate stretch opportunities and build applications that make their potential visible.

Repository: `right-for-me`

The product is built around one practical question:

> Is this opportunity right for me, and how do I show I am right for it?

Most job search tools focus on producing documents. RightForMe starts earlier. It helps people decide whether a role is worth pursuing, understand where they already fit, identify where the role would stretch them, and communicate their evidence with clarity.

## Mission

Help people discover, communicate, and demonstrate the value they can bring to the right organizations.

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

UX planning has also started. See [docs/ux-usability-plan.md](docs/ux-usability-plan.md) for the proposed guided workflow, screen list, information architecture, and usability principles for the job application pipeline.

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

The first lightweight Jobs Applied app pages are available in `index.html`: Dashboard, Add Job, Job Detail, Fit Analysis, Resume Builder, Cover Letter Builder, Application Packet, Application Tracker, and Settings. The browser UI stores saved jobs in local storage for now, using the same fields documented in `docs/jobs-applied-data-model.md`.

Jobs Applied pages use hash routes, starting at `#/jobs/dashboard`. Use the Jobs Applied navigation to move between Dashboard, Add Job, Job Detail, Fit Analysis, Resume Builder, Cover Letter Builder, Application Packet, Tracker, and Settings without leaving `index.html`.

AI output structure and prompt templates have been added for future fit analysis, tailored resume, and cover letter drafts. Live AI generation is not wired yet; there are no API calls, API keys, or provider credentials in this version.

Run the current Python tests with:

```bash
python -m unittest discover -s tests
```

## Contributing

This project is being built in public as a learning journey and product experiment. Contributions, ideas, and thoughtful critique are welcome once the public repository is live.

## License

License to be decided before public release.
