# Implementation Planning Example

This is the gold-standard example for how to present a completed Implementation Planning session in condensed, decision-ready form.

## Session Control

- Session type: Implementation Planning
- Workflow source: `.ertztech/workflows/implementation-planning.md`
- Support docs: `docs/01-features/career-journey.md`, `docs/04-backlog/features.md`, `docs/03-process/implementation-package-template.md`
- Expected output: Approved Implementation Package for `Career Journey Chapter 2 Preview v1`
- Current step: Final planning consolidation before package approval
- Decisions needed: Whether Chapter 2 should be preview-only or include first data capture
- Parking lot: Chapter 2 active interaction design, timeline data structure, future Career Brain linkage
- Docs/backlog impacted: Career Journey feature spec, features backlog if scope changes

## Problem Statement

Career Journey now has a lightweight Chapter 1 reflection. After submission, the journey still needs a visible sense of continuation so users feel forward motion instead of a dead-end confirmation state.

## Product Decision

Add a small Chapter 2 preview after Chapter 1 submission. The preview should create momentum, name the next chapter as `Your Career Timeline`, and explain that the next step will help organize roles, projects, and career seasons. It should not activate Chapter 2 yet, collect timeline data, or imply persistence.

## Team Perspectives

- Product Owner: Supported a preview-only slice because the user problem is continuity, not timeline capture yet. Proposed calm copy that reduces pressure and avoids implying the user needs exact dates.
- Architect: Supported the slice because it stays inside the existing Career Journey render path and avoids introducing a chapter engine or Career Brain structure too early.
- Engineering Manager: Flagged that adding even a small active Chapter 2 form would widen scope into a separate issue. Recommended a preview card only so the work stays reviewable and Codex-sized.
- Software Engineer: Confirmed the preview fits existing code patterns if rendered alongside the current Chapter 1 confirmation state. Recommended a disabled placeholder action instead of a fake route or new interaction branch.
- Implementation Engineer: Confirmed Codex has enough clarity if the copy, placement, and non-goals stay explicit. Suggested preserving the existing Chapter 1 confirmation and appending the Chapter 2 preview below it.
- QA: Asked for explicit acceptance criteria that the Chapter 1 interaction still works, the confirmation remains visible, and Chapter 2 does not become an active form.
- Delivery Coach: Supported the smaller slice because it preserves momentum without turning one issue into a multi-chapter implementation.

Material disagreement:

- The initial proposal left open whether the preview might include a simple timeline prompt.
- Engineering Manager and Software Engineer pushed back that even minimal timeline input changes the issue from preview to interaction.
- Response: the proposal was revised to preview-only, with a disabled placeholder action and no new form fields.

## Tradeoffs

- Better continuity now, but no active Chapter 2 progress yet.
- Cleaner implementation boundary now, but a future issue is still needed for real Chapter 2 interaction.
- Stronger user momentum now, but no durable data capture yet.

## Team Recommendation

Approve a preview-only Chapter 2 slice. Keep the experience calm and encouraging, preserve the Chapter 1 confirmation state, and show the next chapter without activating it.

## Implementation Package

### Initiative

Career Journey Chapter 2 Preview v1

### Branch

`feature/career-journey-chapter-2-preview`

### Problem Statement

After the Chapter 1 reflection is submitted, Career Journey needs a visible next-step signal so the journey feels continuous.

### Product Decision

Show a Chapter 2 preview card after the Chapter 1 confirmation state.

### Founder Decision

Approved preview-only scope. No Chapter 2 interaction in this slice.

### Scope

- Add a Chapter 2 preview card after Chapter 1 submission
- Use the title `Your Career Timeline`
- Use calm, encouraging copy about roles, projects, and career seasons
- Include a disabled or clearly placeholder action such as `Chapter 2 coming next`
- Keep all state local and in-memory only

### Out Of Scope

- Full Chapter 2 interaction
- Timeline form fields
- Roles, projects, dates, or history capture
- AI
- Dynamic follow-up questions
- Persistence
- `localStorage`
- Career Brain schema
- Routing changes

### Role Perspectives

- Product Owner: continuity and confidence without pressure
- Architect: no new system layer or schema
- Engineering Manager: keep to one clean slice
- Software Engineer: reuse current Journey rendering pattern
- QA: protect Chapter 1 behavior and confirm Chapter 2 stays non-active
- Delivery Coach: maintain a small, reviewable issue
- Founder: approve preview-only boundary

### Documentation Updates Required

- None required before implementation

### Architecture Notes

- Keep preview render logic local to the current Career Journey area
- Avoid introducing a broader chapter engine

### Risks

- Preview could accidentally imply Chapter 2 is active if copy or action wording is too strong

### Acceptance Criteria

- Career Journey still opens from navigation and workspace links
- Chapter 1 interaction still works
- After Chapter 1 submission, the confirmation state still appears
- A Chapter 2 preview card appears after Chapter 1 submission
- The preview clearly says `Chapter 2` and `Your Career Timeline`
- The preview uses calm, encouraging language
- The preview does not present an active Chapter 2 form
- Any action is disabled, placeholder, or clearly indicates Chapter 2 is coming next
- State remains local and in-memory only
- No AI, persistence, or `localStorage` is added

### Test Checklist

- Open Career Journey from nav and workspace links
- Submit Chapter 1 with text
- Submit Chapter 1 with empty input
- Confirm confirmation state remains visible
- Confirm Chapter 2 preview appears only after submission
- Confirm other main workspaces still load

### GitHub Issue Draft

Build Career Journey Chapter 2 Preview v1

Add a small Chapter 2 preview after the existing Chapter 1 reflection submission so the Career Journey feels continuous without activating Chapter 2 yet.

### Codex Prompt

Implement a small UI slice for NextMove on `feature/career-journey-chapter-2-preview`.

Goal: add a Chapter 2 preview card after the existing Chapter 1 confirmation state.

Keep it preview-only. Do not add a timeline form, persistence, AI, `localStorage`, or routing changes.

Use the title `Your Career Timeline` and calm copy explaining that the next step will help organize roles, projects, and career seasons. Include a disabled or placeholder action such as `Chapter 2 coming next`.

Preserve existing Chapter 1 behavior, existing navigation, and existing subtle reveal styling if it fits.

### Review Checklist

- Scope is still preview-only
- Chapter 1 behavior is preserved
- Chapter 2 does not look fully active
- Acceptance criteria are testable
- Codex can implement without extra planning context

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

## Founder Approval

- Approved with preview-only scope
- No Chapter 2 interaction in this issue
- Any future timeline capture should return through a separate planning pass

## Next Step

Finalize the GitHub Issue and hand the approved package to Codex for implementation on `feature/career-journey-chapter-2-preview`.
