# Product Operating System

## Source Of Truth

Repo docs are the source of truth for product planning, backlog, architecture, process, and decisions. Chat can help produce decisions, but durable decisions belong in the repo.

## Process Layers

- `.ertztech/workflows` remains the operational workflow source.
- `docs/03-process` is the human-readable process layer.
- ChatGPT should be instructed to use the relevant `.ertztech` workflow and the facilitator guide together.

## Operating Flow

Idea -> Repo Backlog -> Backlog Review -> Implementation Planning -> Implementation Package Drafted -> Pre-Implementation Review inside the package -> Implementation Package Approved -> GitHub Issue Finalized -> Codex Implementation -> Implementation Review -> PR -> Merge -> Implementation Retro -> Backlog / Docs / Process Updates

## Working Rules

- GitHub Issues are tactical and near-term only.
- Keep only one or two implementation-ready tasks in GitHub Issues at a time.
- GitHub Projects are not used for now.
- Planning should produce an Implementation Package before a GitHub Issue is created.
- The Implementation Package is the readiness artifact for work entering implementation.
- Work is not ready for Codex until the Pre-Implementation Review section is completed and founder approval is captured.
- Implementation planning must include a Documentation and Traceability checkpoint.
- Process improvements belong in the repo backlog, not in ad hoc chat memory.
- [.ertztech/workflows](../../.ertztech/workflows) remains the operational workflow location and should stay aligned with these docs.
- Codex should not receive implementation work until the Implementation Package has passed Pre-Implementation Review.
- All changes go through a pull request before merging to `main`.
- Small changes get small pull requests.
- Large changes should be split before pull request review.
- No direct merges to `main` unless it is an emergency recovery situation.

## Standard Roles

- Product Owner
- Architect
- Engineering Manager
- Software Engineer
- QA
- Delivery Coach / Facilitator
- Founder

Role distinction:

- Engineering Manager handles scope, sequencing, delivery risk, and Codex-sized work.
- Software Engineer handles implementation approach, file and module boundaries, code maintainability, and testability.
- Architect handles system direction, coupling, long-term structure, and ADR needs.

## What Each Step Means

### Idea

Capture the concept without forcing implementation detail too early.

### Repo Backlog

Record the work in `docs/04-backlog` so it is discoverable, status-based, and easy to revisit.

### Backlog Review

Confirm the work is mature enough to move from repo backlog into implementation planning.

### Implementation Planning

Use the workflow in `.ertztech/workflows/implementation-planning.md` to pressure-test scope, decisions, architecture, testing, and documentation impact.

### Implementation Package

Draft the package that captures the problem, decisions, scope, required docs, acceptance criteria, test checklist, issue draft, prompt draft, and review checklist.

### Pre-Implementation Review

Review the package in place. The team walks the role-based review section inside the Implementation Package to confirm product fit, architecture fit, implementation size, workflow readiness, and testability before issue finalization.

### Implementation Package Approved

Once the review section is complete and founder approval is captured, the package becomes the approved handoff artifact for GitHub Issue finalization and Codex work.

### GitHub Issue

Finalize the GitHub Issue only once the package has passed Pre-Implementation Review and the work is still small, approved, and implementation-ready.

### Codex Implementation

Execute the issue on a focused branch using the package as the handoff source.

### Implementation Review

Measure what worked, what changed, and whether the pull request is ready or needs changes before merge.

### PR

Review the implementation through a pull request before it reaches `main`.

### Implementation Retro

After merge, run a retro to convert lessons into process improvements, technical debt, parking lot items, and backlog updates.

### Merge And Update

Close the loop by updating docs and backlog status so the repo remains trustworthy.
