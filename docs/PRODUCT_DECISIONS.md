# Product Decisions

## Decision 001: NextMove is not a resume builder

Status: Active

The resume is one output of the system.

The primary value is understanding opportunities and generating everything needed to apply well.

## Decision 002: Profile is the source of truth

Status: Active

The user's Profile contains work history, skills, accomplishments, stories, metrics, projects, career preferences, and base resume information.

Everything else should build from the Profile.

## Decision 003: Opportunities become Workspaces

Status: Active

Each saved opportunity should become its own workspace.

Everything related to that opportunity should live together:

- Job details
- Fit analysis
- Resume draft
- Cover letter draft
- Application packet
- Notes
- Status

## Decision 004: Application Studio becomes Create Packet

Status: Proposed

Rather than sending users to a separate application builder, the preferred experience is:

Open Opportunity ? Create Packet

Possible outputs include:

- Tailored resume
- Cover letter
- Application answers
- Interview prep
- Follow-up messages
- Structured application data

## Decision 005: AI should eliminate duplicate work

Status: Active

Users should never paste the same information twice.

If a job has been saved, every workflow should use that saved data automatically.

## Decision 006: Dashboard is a launchpad

Status: Active

The dashboard should help the user decide what to do next.

It should prioritize active workspaces, next actions, and recent progress over static reporting.
