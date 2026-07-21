# Implementation Retro: Story Coach Multi-Experience Context Selection

**Date:** 2026-07-21  
**Project:** NextMove  
**Cycle outcome:** Completed and merged  
**Implementation:** Add multi-experience context selection to Story Coach  
**Retro status:** Complete when this record is saved in the repository and the resulting closeout updates are ready for review

## Backward Traceability

- Approved implementation package: `docs/04-delivery/2026-07-20-multiple-career-journey-experiences-story-coach-context-implementation-package.md`
- GitHub Issue: `#139`
- Implementation branch: `codex/issue-139-story-coach-context-selection`
- Implementation commit: `5919cba` `Closes #139 - Add Story Coach multi-experience selector`
- Pull request: `#140`
- Merge commit: `30ebf6c`
- Automated verification:
  - `node -c src/jobsApplied/controller.js`
  - `node tests/careerJourneyStateTransitions.test.js`
  - `node tests/storyCoach.test.js`
- Manual verification:
  - formal Implementation Review passed
  - Captain manual verification passed
  - no blocking regression was found

## Forward Traceability

- Product follow-up destination 1: `docs/04-backlog/technical-debt.md`
- Product follow-up destination 2: `docs/04-backlog/parking-lot.md`
- Process proposal destination: `C:\dev\ertztech-process\docs\04-delivery\process-improvement-backlog\2026-07-21-resilient-pr-delivery-handoff.md`

## Cycle Outcome

The implementation successfully replaced the temporary Chapter 3 linked-versus-different toggle with an active selector that lets the user choose any saved Chapter 2 experience or `Different experience` while creating a Story Coach moment.

The merged change:

- populated the active Story Coach selector with every saved Chapter 2 experience plus `Different experience`,
- reused the existing stable `timelineEntryId` model rather than introducing a new relationship shape,
- updated the visible context label and role-aware prompt immediately when selection changed,
- preserved typed content, voice-entered content, follow-up responses, and other active draft state while switching context,
- kept saved Story Coach moments and existing linkage behavior unchanged,
- remained limited to the approved implementation surface,
- passed automated verification and Captain manual verification.

## Delivered Outcome

Story Coach now allows users to select any saved Chapter 2 experience or `Different experience` while creating an active Chapter 3 moment.

The selected context updates the visible label and role-aware prompt while preserving typed content, voice-entered content, follow-up responses, and other active draft state.

## Planned Versus Delivered Scope

### Planned active scope

- replace the temporary linked-versus-different control with a selector
- populate the selector from saved Chapter 2 experiences
- preserve draft content while switching context
- keep saved moments unchanged
- add focused automated regression coverage

### Delivered scope

The delivered implementation matched the approved active scope.

### Explicitly deferred and not implemented

- saved-story relinking
- editing experience context on saved moments
- Chapter 3 completion corrections
- Chapter 4 Story Map
- broad controller refactor
- persistence redesign
- Career Brain integration

## Verification Evidence

### Automated verification

- `node -c src/jobsApplied/controller.js`
- `node tests/careerJourneyStateTransitions.test.js`
- `node tests/storyCoach.test.js`

### Verified in the running browser

- selector displays saved Chapter 2 experiences and `Different experience`
- context label and role-aware prompt update immediately
- typed and voice-entered draft content remain intact while switching context
- saved moments save, reopen, and retain linkage
- no blocking regression was found during Captain testing

### Reasoned from implementation only

- none relied on as a substitute for acceptance verification

### Not verified

- no additional unverified items for the approved scope

## What Went Well

- The completed Chapter 2 multi-experience foundation supported the new selector cleanly.
- The implementation reused the existing stable `timelineEntryId` model.
- The change remained limited to three files.
- Automated tests passed.
- Captain manual verification confirmed the intended functionality.
- The implementation stayed out of the deferred relinking, completion, Chapter 4, and controller-refactor work.

## What Caused Friction

- PR creation depended on an authenticated GitHub browser or CLI session, which interrupted the delivery handoff even though the implementation itself was complete and the branch push had already succeeded.
- Manual verification surfaced two real follow-ups that were outside the approved Issue `#139` scope and needed explicit routing rather than opportunistic inclusion.

## Root Causes

### RC-001: Delivery handoff assumed PR tooling access would be available at action time

The implementation branch pushed successfully, but Codex could not create the PR because GitHub redirected the in-app browser to sign-in and no authenticated GitHub CLI path was available in the session.

### RC-002: Shared Chapter 3 voice-session UI still presents target ambiguity

The current shared voice-session behavior can make both Chapter 3 microphone controls appear active and lets either control stop the shared session, which is workable but less clear than the intended field-specific UI state.

### RC-003: Career Journey navigation and Chapter 3 layout are functionally sufficient but not yet polished for discoverability

The focused workspace and `View journey` path remain usable, but returning to Chapters 1 and 2 is not obvious enough and the Chapter 3 surface would benefit from a future usability/design pass.

## Feedback And Routing Record

### AFR-001: Chapter 3 shared voice-session UI shows both mic buttons as active

**User observation:** Starting voice input in one Chapter 3 field currently makes both mic buttons appear active, and either mic can stop the shared voice session.

**Context or scenario:** Observed during Issue `#139` Captain testing while switching between the initial-response and follow-up-response voice controls.

**Classification:** Defect

**Team interpretation:** The behavior predates or sits outside the approved Issue `#139` scope, but it is a valid product follow-up because only the control associated with the field receiving input should visually appear active.

**Disposition:** Create or update future Parking Lot item

**Forward destination:** `docs/04-backlog/technical-debt.md`

**Owner or next decision:** Future Backlog Review / implementation selection

### AFR-002: Career Journey navigation and Chapter 3 layout need future usability review

**User observation:** Returning from the focused workspace to Chapters 1 and 2 is possible through `View journey`, but the navigation is not obvious, and the Chapter 3 layout needs future organization/usability review.

**Context or scenario:** Observed during Captain review of the merged Story Coach selector flow.

**Classification:** Usability feedback

**Team interpretation:** This is a future design slice rather than a blocking defect in Issue `#139`.

**Disposition:** Create or update future Parking Lot item

**Forward destination:** `docs/04-backlog/parking-lot.md`

**Owner or next decision:** Future Parking Lot Review / backlog shaping

### AFR-003: PR delivery handoff was fragile when authentication was unavailable

**User observation:** PR creation failed in-session after GitHub redirected the browser to sign-in, even though the branch was already pushed successfully.

**Context or scenario:** Delivery handoff after Issue `#139` implementation and review approval.

**Classification:** Process feedback

**Team interpretation:** This was a delivery-tool limitation, not an implementation failure, and it should be routed to the authoritative process repository rather than worked around inside the product cycle.

**Disposition:** Carry into Implementation Retro

**Forward destination:** `C:\dev\ertztech-process\docs\04-delivery\process-improvement-backlog\2026-07-21-resilient-pr-delivery-handoff.md`

**Owner or next decision:** Future ertztech-process Parking Lot Review

## Product And Design-Principle Lessons

- Reusing existing stable relationship models keeps Story Coach changes reviewable when the user-facing improvement is about selection rather than persistence.
- Focused automated coverage remains especially valuable when one controller owns both selection state and draft preservation behavior.
- Shared interaction infrastructure can still need later UI-specific refinement even when the underlying session behavior is functionally correct.

## Operating-Model Improvements

### DEC-001: Route resilient PR delivery as a formal process proposal

**Context and evidence:** The implementation succeeded, but PR creation was blocked by missing authenticated GitHub tooling at action time.

**Reasoning:** PR handoff reliability should be improved in the process layer, not patched ad hoc during a product implementation cycle.

**Impact:** Future cycles should identify PR ownership, available creation method, and fallback manual artifact requirements before delivery handoff.

**Affected workflow or product principle:** Delivery handoff, Implementation Review follow-through, process/tooling resilience

**Follow-up action:** Review the `Resilient PR Delivery Handoff` proposal in `ertztech-process`.

**Backlog status:** Promote to next Parking Lot Review

## Product Follow-Ups

### Technical debt

- Chapter 3 shared voice control active-state UI

### Parking lot

- Career Journey navigation and Chapter 3 usability review

## Changes Made Immediately

- This retro records the merged Issue `#139` outcome, verification evidence, and routed follow-up items.
- Product follow-up destinations were updated in `technical-debt.md` and `parking-lot.md`.
- A process proposal location was created in `ertztech-process` for later review.

## Proposed-Only Changes

- Resilient PR Delivery Handoff process update remains proposed only until the process repo reviews and selects it.

## Next Recommended Action

1. Review and merge this documentation closeout.
2. Let future Backlog Review decide when to address the Chapter 3 voice-control state follow-up.
3. Let future Parking Lot Review shape the Career Journey navigation and Chapter 3 usability slice.
4. Route the resilient PR handoff proposal through the next `ertztech-process` Parking Lot Review.

## Cycle Closure

This closeout is complete when:

- this retro record is saved in the NextMove repository,
- the product follow-up items remain visible in durable backlog artifacts, and
- the process proposal remains visible in the authoritative process repository for later review.
