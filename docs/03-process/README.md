# Process Docs

This section is the human-readable operating layer for how planning turns into implementation. Operational workflows stay in [.ertztech/workflows](../../.ertztech/workflows), and these docs explain how to use them consistently.

## How To Use This Section

- `.ertztech/workflows` contains the operational workflow instructions ChatGPT should follow during sessions.
- `docs/03-process` contains the human-readable process docs, templates, and facilitation guidance that explain how to use those workflows well.
- Do not move `.ertztech/workflows` into `docs` for now.
- The docs explain the process, while `.ertztech/workflows` runs the process.

- [Product Operating System](product-operating-system.md)
- [Facilitator Guide](facilitator-guide.md)
- [Implementation Package Template](implementation-package-template.md)
- [Workflow Improvements](workflow-improvements.md)

## ChatGPT Session Kickoffs

### Implementation Planning Kickoff

```md
We are working on NextMove.

Use the workflow in .ertztech/workflows/implementation-planning.md.

Also use docs/03-process/facilitator-guide.md to keep the session on track.

Goal:
Run an implementation planning session for [FEATURE OR ISSUE NAME].

Use the team roles:
- Product Owner
- Architect
- Engineering Manager
- QA
- Delivery Coach

Do not jump straight to a Codex prompt.

Produce an Implementation Package using docs/03-process/implementation-package-template.md.

Before finalizing the GitHub Issue or Codex prompt, walk the team through the Pre-Implementation Review section inside the Implementation Package.
```

### Implementation Review Kickoff

```md
We are reviewing a Codex implementation for NextMove.

Use the workflow in .ertztech/workflows/implementation-review.md.

Also use docs/03-process/facilitator-guide.md to keep the review on track.

Compare the implementation against the Implementation Package, GitHub Issue, acceptance criteria, and test checklist.

Use the team roles:
- Product Owner
- Architect
- Engineering Manager
- QA
- Delivery Coach

Decide whether this is ready to merge, needs changes, or should create follow-up backlog items.
```
