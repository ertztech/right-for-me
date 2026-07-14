# Implementation Package

## Initiative

Focused Career Journey Workspace for Chapters 1 through 3

## Branch

`feature/career-journey-focused-workspace`

## Problem Statement

Career Journey currently mixes overview, progress framing, chapter navigation, and active chapter work into one surface. That creates visual competition and makes the guided experience feel busier than intended, especially after Chapter 3 added saved moments, AI reflection, and voice controls.

## Product Decision

Separate the Career Journey overview from a shared focused workspace for Chapters 1, 2, and 3.

- The overview remains a light progress and orientation surface.
- `Continue Journey` opens a near-full-screen focused workspace.
- The focused workspace keeps one active chapter visually dominant.
- Journey progress remains available through a compact `View journey` control.
- Existing chapter renderers, handlers, and state remain the source of truth.

## Founder Decision

- Build the shared focused workspace only for Chapters 1, 2, and 3.
- Do not rewrite chapter copy or redesign the rest of NextMove.
- Keep Career Journey and Professional Experience separate.
- Career Journey -> Professional Experience refinement remains deferred.

## Scope

- Add transient focused-workspace state
- Open the focused workspace from `Start Journey` and `Continue Journey`
- Use derived journey state to choose the recommended chapter on open
- Add compact journey navigation inside the workspace
- Allow the user to choose an available chapter without resetting active content
- Preserve unsaved and saved chapter state while navigation opens and closes
- Support desktop and narrow-width layouts
- Extend automated regression coverage for the workspace behavior

## Out Of Scope

- Chapter copy rewrites
- New AI prompts or AI behaviors
- Voice-recognition changes
- Persistence migrations
- Professional Experience integration
- Work History changes
- Chapter 4 or 5 implementation
- Application-wide routing changes

## Role Perspectives

- Product Owner: reduce visual competition and keep the user focused on one chapter at a time
- Architect: reuse the existing chapter renderers and avoid a second progression model
- Engineering Manager: keep the slice bounded to one controller, CSS, tests, and documentation update
- Software Engineer: preserve current chapter handlers and state while adding workspace-level controls around them
- QA: verify open, close, chapter switching, unsaved-draft preservation, and narrow-width control reachability
- Delivery Coach / Facilitator: keep implementation and product-boundary decisions distinct
- Founder: move the experience closer to a premium focused workspace without broad redesign

## Documentation Updates Required

- Update `docs/01-features/career-journey.md` with workspace definitions
- Update `PRODUCT_STATUS.md` to mark this workspace slice as the active implementation
- Record that Career Journey -> Professional Experience refinement remains deferred

## Architecture Notes

- Overview and focused workspace are separate render states inside `renderCareerJourney()`
- Workspace state is transient and controller-local
- Chapter renderers remain unchanged entry points for Chapter 1, 2, and 3 content
- No new persistence fields or URL routes are introduced
- Unsaved Chapter 1 and Chapter 2 values must be synced into existing controller state before workspace rerenders

## Risks

- Re-rendering workspace chrome could drop unsaved values if Chapter 1 and Chapter 2 drafts remain DOM-only
- Manual chapter switching could accidentally create a second progression model if availability rules diverge
- Narrow-width layout could hide voice or save controls if workspace chrome becomes too heavy

## Acceptance Criteria
- [x] Career Journey overview and focused workspace are distinct surfaces
- [x] `Continue Journey` opens a focused workspace using the recommended active chapter
- [x] Journey navigation is secondary, compact, and does not reset unsaved work

## Test Checklist
- [x] Start and continue flow opens the focused workspace
- [x] Workspace close returns to the overview
- [x] Chapter 1, 2, and 3 unsaved values survive journey-navigation toggles
- [x] Existing state-transition and Story Coach regressions pass

## Pre-Implementation Review

### Product Owner Review
- [x] Product decision is clear
- [x] User value is clear
- [x] MVP scope is small enough
- [x] Nice-to-haves are out of scope or parked

### Architect Review
- [x] Technical direction is clear
- [x] Codex is not being asked to make architecture decisions
- [x] No unnecessary coupling is introduced
- [x] ADR need has been considered

### Engineering Manager Review
- [x] Work is small enough for one Codex session
- [x] Handoff context is complete
- [x] Acceptance criteria are clear
- [x] Out-of-scope items are explicit

### Software Engineer Review
- [x] Implementation approach fits existing code patterns
- [x] File/module boundaries are reasonable
- [x] Testability has been considered
- [x] No unnecessary code complexity is being introduced

### QA Review
- [x] Acceptance criteria are testable
- [x] Test checklist is clear
- [x] Regression risks are named
- [x] Done can be objectively verified

### Delivery Coach Review
- [x] Workflow has been followed
- [x] Documentation updates are identified
- [x] Backlog updates are identified
- [x] This is truly implementation-ready

### Founder Approval
- [x] Final scope approved

## GitHub Issue Draft

`Build focused Career Journey workspace for Chapters 1 through 3`

## Codex Prompt

Implement the approved focused Career Journey workspace using existing chapter state and renderers, preserving unsaved work and current Story Coach behavior.

## Review Checklist
- [x] Scope is implementation-ready
- [x] Founder decisions are explicit
- [x] Documentation and backlog updates are named
- [x] Architecture impact is captured
- [x] Acceptance criteria are testable
- [x] Pre-Implementation Review is complete
- [x] Codex can work without relying on chat history
