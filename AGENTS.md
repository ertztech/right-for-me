# RightForMe Delivery Agent

This file defines how we build RightForMe in public. Treat it as the operating guide for every Codex session and every product change.

## Core Principle

One idea. One product card. One GitHub issue. One branch. One feature. One test. One commit. One pull request. Repeat.

Every feature must answer:

> Does this make someone more likely to choose the right opportunity and get an interview?

## Roles

### Product Owner

Use Trello as the product side of the work.

The Product Owner owns:

- Capturing ideas before they become engineering work
- Clarifying the user problem
- Defining acceptance criteria
- Prioritizing backlog items
- Deciding whether a feature belongs in the MVP
- Preserving the learning-in-public story

### Developer

Use GitHub as the engineering side of the work.

The Developer owns:

- Creating the GitHub issue from the approved product card
- Creating the feature branch
- Building one feature at a time
- Testing locally
- Opening a pull request
- Merging only when the work is complete

## Trello Flow

Trello is the source of product intent.

Use [docs/TRELLO_SETUP.md](docs/TRELLO_SETUP.md) to create or update the RightForMe product board.

Recommended lists:

- Ideas
- Backlog
- Ready
- Doing
- Review
- Shipped
- Lessons Learned

Each product card should include:

- User problem
- Target user
- Proposed outcome
- Acceptance criteria
- MVP relevance
- Public learning note
- Linked GitHub issue once created

Use this card template:

```md
## User Problem


## Target User


## Proposed Outcome


## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## MVP Relevance


## Learning in Public Note


## GitHub Issue


```

## GitHub Issue Flow

Create a GitHub issue only after the Trello card is clear enough to build.

Each issue should include:

- Problem statement
- Proposed solution
- Acceptance criteria
- Test plan
- Trello card link
- Public learning angle

Use this issue title pattern:

```txt
Build <feature name>
```

Use this issue body template:

```md
## Problem


## Proposed Solution


## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Test Plan

- [ ]

## Trello Card


## Learning in Public


```

## Branching Flow

Always create a branch before editing files.

Branch format:

```txt
feature/<issue-number>-<short-name>
```

If the GitHub issue does not exist yet, use:

```txt
feature/<short-name>
```

Then rename or recreate the branch once the issue number exists.

## Daily Workflow

Follow this sequence for every feature:

1. Confirm the Trello card is in `Ready`.
2. Create or confirm the GitHub issue.
3. Start from a clean `main`.
4. Pull the latest `main`.
5. Create a feature branch.
6. Build one feature.
7. Test locally.
8. Commit with a GitHub issue reference.
9. Push the feature branch.
10. Open a pull request.
11. Confirm the pull request checklist.
12. Merge.
13. Delete the feature branch.
14. Pull latest `main`.
15. Move the Trello card to `Shipped`.
16. Add a learning note.

## Commit Messages

Use issue-closing commits when there is an issue:

```txt
Closes #<issue-number> - <short feature summary>
```

If there is not yet an issue:

```txt
Add <short feature summary>
```

## Pull Request Checklist

Every pull request should confirm:

- [ ] Feature works
- [ ] Acceptance criteria met
- [ ] Tested locally
- [ ] One logical feature only
- [ ] Includes `Closes #<issue-number>` when applicable
- [ ] Trello card is linked
- [ ] Learning-in-public note captured

## Testing Rule

Test the smallest meaningful behavior before committing.

For the current static prototype, that can mean:

- Open the app locally
- Paste a realistic job description
- Paste a realistic background
- Run the analyzer
- Confirm fit score, stretch score, evidence, stretch areas, and strategy render

As the app grows, add automated tests before behavior becomes hard to verify manually.

## Debugging Checklist

- Read the error from the bottom up.
- Read the full traceback or console message.
- Print or inspect values when unsure.
- Test the smallest change.
- Commit only after a passing test.

## Learning In Public

Every shipped feature should produce one public artifact:

- GitHub issue
- Pull request
- Release note
- Screenshot
- Short LinkedIn post
- Short demo video
- Lesson learned

Use this prompt after each merge:

```md
Today I shipped <feature>.

It helps job seekers <user outcome>.

The most interesting product decision was <decision>.

The thing I learned was <lesson>.

Next I am working on <next step>.
```

## Guardrails

- Keep the MVP focused on job fit, stretch, and application positioning.
- Do not build generic resume-builder features unless they serve the product mission.
- Do not invent user experience or credentials.
- Prefer honest confidence over inflated confidence.
- Keep each feature small enough to explain in one pull request.
- Document product decisions as we go.

