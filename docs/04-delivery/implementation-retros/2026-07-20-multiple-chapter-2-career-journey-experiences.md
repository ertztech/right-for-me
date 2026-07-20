# Implementation Retro: Multiple Chapter 2 Career Journey Experiences

**Date:** 2026-07-20  
**Project:** NextMove  
**Cycle objective:** Deliver the narrowed, Captain-approved Chapter 2 multi-experience slice that creates the stable experience foundation required before returning to Story Coach multi-experience context selection and Chapter 4 Story Map  
**Cycle outcome:** Completed and merged  
**Implementation:** Multiple Chapter 2 Career Journey experiences  
**Retro status:** Complete when this record is saved in the repository and the resulting documentation branch is ready for Mike to open a retro pull request

## Backward Traceability

- Narrowed implementation package: `docs/04-delivery/2026-07-20-multiple-career-journey-experiences-story-coach-context-implementation-package.md`
- GitHub Issue: `#135`
- Documentation PR: `#136`
- Implementation PR: `#137`
- Implementation commits:
  - `ec60589` `Closes #135 - Implement Chapter 2 multi-experience compatibility`
  - `f11133a` `Refs #135 - Expand Career Journey compatibility regression coverage`
  - `b7fcfb5` `Refs #135 - Cover Chapter 2 draft baseline and cancel guards`
  - `35b67e0` `Refs #135 - Polish Chapter 2 experience card spacing`
- Merge commit: `a6dd14a1bbbbb49f9c4ff40ddae68d423921935c`
- Post-merge verification:
  - `git status --short --branch`
  - `node -c src/jobsApplied/controller.js`
  - `node tests/careerJourneyStateTransitions.test.js`
  - `node tests/storyCoach.test.js`
  - `node tests/careerVaultRoleEditing.test.js`
- Manual browser evidence:
  - guided browser testing passed
  - focused UI-polish retest passed
  - voice regression passed
  - desktop and narrow-width testing passed

## Forward Traceability

- Deferred follow-up slice: Story Coach multi-experience context selection
- Next planned implementation direction: return to the deferred Story Coach multi-experience context-selection slice before Chapter 4 Story Map, unless a future Backlog Review changes priority
- Proposed process improvements destination: next ertztech-process Parking Lot Review

## Cycle Outcome

The cycle successfully delivered the narrowed Chapter 2 implementation after the original combined Chapter 2 plus Chapter 3 package was split into a smaller, reviewable slice.

The merged implementation:

- replaced the single Chapter 2 saved experience with an ordered stable-ID collection,
- preserved existing saved experience migration,
- added separate collection, draft, baseline, active-entry, and last-saved controller state,
- preserved first-entry guided behavior and Chapter 3 unlock behavior,
- added multiple saved experience cards with chronological ordering,
- added add, edit, save, and cancel flows without mutating saved records while typing,
- added dirty-exit protection for chapter switching and focused-workspace close,
- preserved the current temporary two-choice Chapter 3 compatibility model,
- kept the full Story Coach multi-experience selector deferred,
- corrected the saved-card date-label spacing and card-density polish found during guided manual testing,
- passed formal Implementation Review before pull request creation,
- passed formal Pull Request Review before merge,
- passed post-merge automated verification on `main`.

## Planned Versus Delivered Scope

### Planned active scope

- Multiple Chapter 2 Career Journey experiences
- Stable-ID collection migration
- Chronological saved-card presentation
- Dirty-state protection
- Temporary Chapter 3 compatibility only

### Delivered scope

The delivered implementation matched the narrowed active scope.

### Explicitly deferred and not implemented

- full Story Coach multi-experience selector
- selector-specific prompt switching
- saved-story relinking
- saved-story edit baselines
- relationship-only dirty-state handling
- Chapter 3 completion-preservation changes
- Chapter 4 Story Map

## Major Decision Sequence

1. Repository grounding confirmed that Chapter 2 still supported only one saved experience and that Chapter 4 work would be premature without first addressing the Chapter 2 data model.
2. The team reordered the work so multiple Chapter 2 experiences came before Chapter 4 Story Map.
3. An original combined Chapter 2 plus Story Coach implementation package was approved.
4. Two implementation attempts stopped safely after revealing that the combined package was too tightly coupled inside the controller to complete safely as one reviewable change.
5. The package was narrowed and documented through documentation PR `#136`.
6. Issue `#135` was updated to reference the narrowed package.
7. The narrowed Chapter 2 slice was implemented on `codex/issue-135-story-coach-context-selection`.
8. Guided browser testing approved the functional behavior but surfaced a visible saved-card spacing and density issue.
9. A small scoped UI correction was applied and reverified before PR creation.
10. Formal Implementation Review passed.
11. PR `#137` was created, formally reviewed, and merged.
12. Post-merge verification on `main` confirmed the merged implementation and test health.

## Verification Evidence

### Automated verification

- `node -c src/jobsApplied/controller.js`
- `node tests/careerJourneyStateTransitions.test.js`
- `node tests/storyCoach.test.js`
- `node tests/careerVaultRoleEditing.test.js`

### Verified in the running browser

- guided first-entry behavior
- first-save transition
- multiple experience add/edit flows
- chronological ordering
- missing optional fields
- long reflections
- duplicate visible labels
- dirty-exit Save, Discard, and Cancel
- chapter switching
- workspace closing
- temporary Chapter 3 linked context
- `Different experience`
- active Chapter 3 draft preservation
- linked saved-story label updates
- voice behavior
- desktop layout
- narrow-width layout
- saved-card spacing and density polish

### Reasoned from implementation only

- none relied on as a substitute for manual acceptance criteria

### Not verified

- none for the approved active scope

## Feedback And Correction Record

### AFR-001: Saved Chapter 2 experience cards needed visible date-label separation and tighter spacing

**User observation:** The saved Chapter 2 experience cards showed the approximate-years label and value run together, and the cards felt taller than needed with Edit visually too far from the related content.

**Context or scenario:** Desktop review of several saved Chapter 2 experience cards during guided browser testing.

**Classification:** Usability feedback

**Team interpretation:** Functional behavior was correct, but the visual presentation needed a small scoped polish correction before pull request creation because the new card UI was part of the approved slice.

**Disposition:** Resolve in active implementation

**Forward destination:** Closed in implementation commit `35b67e0`

**Owner or next decision:** None

## What Worked

- Repository grounding exposed that Chapter 2 supported only one experience before Chapter 4 work began.
- The team correctly reordered the work so multiple Chapter 2 experiences came before Chapter 4 Story Map.
- Codex restored unsafe partial changes during two failed implementation attempts rather than leaving the branch damaged.
- Narrowing the package made implementation tractable.
- Stable-ID relationships allowed saved-story labels to update after experience edits.
- Explicit PASS/FAIL automated evidence improved confidence.
- Guided browser testing caught a visible spacing and card-density issue that automated checks could not.
- The small UI correction was isolated and verified before PR creation.
- Formal Implementation Review and Pull Request Review both passed before merge.
- Grouping related decisions and using the team recommendation reduced unnecessary Captain interruptions.

## What Did Not Work

- The original combined Chapter 2 and Chapter 3 package was too large and too coupled to the controller.
- Two implementation attempts failed before the package was narrowed.
- Repeating implementation prompts did not solve the underlying package-sizing problem.
- ChatGPT advanced to Captain-owned actions multiple times without first printing the exact required handoff artifact.
- The initial manual-testing explanation did not make the saved experience card visually obvious enough to Mike.
- Automated tests passed while a visible date-label spacing defect remained.

## Root Causes

### RC-001: Package size was judged too much by acceptance-count shape and not enough by controller coupling

The combined Chapter 2 plus Story Coach change touched one tightly coupled controller path that controlled Chapter 2 state, Chapter 3 compatibility behavior, saved-story labels, and reviewable UI transitions. That technical coupling made the package materially larger than it first appeared.

### RC-002: Clean failed implementation attempts were not elevated soon enough as packaging evidence

The first two failures were handled safely, but the process still allowed another implementation retry tendency before formally requiring package reassessment.

### RC-003: Captain-owned action handoffs lacked a hard artifact gate

Several transitions relied on conversation flow rather than a mandatory exact artifact handoff, which created avoidable interruptions when a branch, issue, or PR step needed Mike to act manually.

### RC-004: Manual test guidance did not initially point to the exact new visual surface

The first testing explanation covered behavior well but did not call out the exact saved-card visual surface strongly enough, so a visible presentation defect survived until guided manual review.

### RC-005: Visual polish remained under-observed by automation

Automated tests accurately covered controller behavior and state transitions, but they could not prove the visible spacing and density quality of the new cards.

## Product And Design-Principle Lessons

- Stable identity and relationship rules should be implemented before higher-level story browsing features that depend on them.
- Controller-coupled interaction work should be sliced by dependency and reviewability, not only by whether requirements seem adjacent in the product.
- Visual polish on newly introduced summary cards still needs direct human eyes even when regressions are fully automated.
- Small user-facing UI corrections can and should remain tightly scoped rather than reopening feature behavior.

## Operating-Model Improvements

### DEC-001: Add a hard Captain Handoff Gate before Captain-owned actions

**Context and evidence:** ChatGPT advanced to Captain-owned actions multiple times without first printing the exact required handoff artifact.

**Reasoning:** A durable gate would reduce ambiguity, prevent premature transitions, and make Captain-owned steps easier to execute cleanly.

**Impact:** Future manual transitions should require an explicit ready-to-use artifact before the session can advance.

**Affected workflow or product principle:** Implementation Cycle, Implementation Review, Pull Request handoff practice

**Follow-up action:** Propose a process update requiring an exact artifact package before Captain-owned actions.

**Backlog status:** Promote to next Parking Lot Review

### DEC-002: Require package-splitting review after a second clean failed implementation attempt

**Context and evidence:** Two clean failed implementation attempts occurred before the package was narrowed.

**Reasoning:** A second clean failure is evidence that package size or coupling is wrong, not merely a sign that the next prompt should be more detailed.

**Impact:** Future cycles should stop and reassess package size earlier.

**Affected workflow or product principle:** Implementation Planning, Implementation Package, Implementation Review

**Follow-up action:** Add a documented split-review trigger after a second clean failed attempt.

**Backlog status:** Promote to next Parking Lot Review

### DEC-003: Make controller coupling an explicit package-sizing input

**Context and evidence:** The original package combined multiple acceptance areas that all converged on one tightly coupled controller.

**Reasoning:** Acceptance-count size alone did not reflect real implementation risk.

**Impact:** Future sizing should explicitly ask whether one controller or state surface concentrates most of the risk.

**Affected workflow or product principle:** Repository Grounding, Implementation Planning

**Follow-up action:** Add a controller-coupling checkpoint to planning and repository grounding prompts.

**Backlog status:** Promote to next Parking Lot Review

### DEC-004: Strengthen manual test instructions for newly introduced UI

**Context and evidence:** The saved-card visual defect was not obvious enough from the first manual-testing explanation.

**Reasoning:** Human verification works better when the guidance points at the exact surface and the exact expected appearance.

**Impact:** Manual testing prompts should identify the precise visual location and expected look of new UI.

**Affected workflow or product principle:** Implementation Package, Implementation Review, manual verification guidance

**Follow-up action:** Add an explicit visual-target note to manual testing expectations when new UI is introduced.

**Backlog status:** Promote to next Parking Lot Review

### DEC-005: Preserve the approved team-default decision rule

**Context and evidence:** Grouping related decisions and using the team recommendation reduced unnecessary Captain interruptions during this cycle.

**Reasoning:** The current rule worked well and should remain in place.

**Impact:** Routine decisions may continue without interrupting Mike unless value, scope, sequencing, risk, acceptance, or approved direction materially changes.

**Affected workflow or product principle:** Facilitation and team decision routing

**Follow-up action:** Keep the rule unchanged and restate it in future process refinements.

**Backlog status:** Completed as a documentation improvement

## Proposed Hard Captain Handoff Gate

Before advancing to a Captain-owned action such as Issue creation, PR creation, PR update, merge, or another manual transition, ChatGPT must print the exact artifact or exact instructions required for that action.

The gate should require:

- exact title
- exact body or content
- exact source and target branches where relevant
- exact approval state
- exact next confirmation expected from the Captain

## Process Improvement Proposals

### PROC-001: Add the Captain Handoff Gate

- **Title:** Require exact handoff artifacts before Captain-owned actions
- **Problem observed:** Captain-owned transitions advanced without a complete ready-to-use artifact.
- **Evidence:** This cycle required repeated redirection before issue, PR, and merge-adjacent steps had the exact artifact prepared.
- **Desired improvement:** Block advancement until the exact title, exact body, exact branches, exact approval state, and exact next confirmation request are printed.
- **Recommended priority:** High
- **Suggested destination:** ertztech-process Implementation Cycle and related handoff workflows
- **Status:** Promote to next Parking Lot Review
- **Disposition owner:** Captain / process backlog review
- **Next review point or backlog destination:** next ertztech-process Parking Lot Review

### PROC-002: Add explicit controller-coupling package sizing

- **Title:** Size implementation packages using controller coupling as well as acceptance count
- **Problem observed:** The original combined package was too tightly coupled to the controller.
- **Evidence:** Two clean failed implementation attempts preceded the package split.
- **Desired improvement:** Require planning and repository grounding to flag when one controller concentrates most of the state-transition risk.
- **Recommended priority:** High
- **Suggested destination:** ertztech-process Repository Grounding and Implementation Planning
- **Status:** Promote to next Parking Lot Review
- **Disposition owner:** Captain / process backlog review
- **Next review point or backlog destination:** next ertztech-process Parking Lot Review

### PROC-003: Trigger package-splitting review after a second clean failed attempt

- **Title:** Treat repeated clean failed implementation attempts as package-sizing evidence
- **Problem observed:** Repeating implementation prompts did not solve the underlying package-sizing problem.
- **Evidence:** Two clean failed attempts occurred before formal narrowing.
- **Desired improvement:** After a second clean failed attempt, require explicit package-splitting review before another implementation attempt.
- **Recommended priority:** High
- **Suggested destination:** ertztech-process Implementation Planning and Implementation Review
- **Status:** Promote to next Parking Lot Review
- **Disposition owner:** Captain / process backlog review
- **Next review point or backlog destination:** next ertztech-process Parking Lot Review

### PROC-004: Improve manual UI verification prompts

- **Title:** Require visual-target guidance for new UI in manual testing instructions
- **Problem observed:** The initial manual-testing explanation did not make the saved experience card visually obvious enough.
- **Evidence:** Automated tests passed while a visible spacing defect remained.
- **Desired improvement:** Manual test guidance should identify the exact visual location and expected appearance of newly introduced UI.
- **Recommended priority:** Medium-high
- **Suggested destination:** ertztech-process Implementation Package and Implementation Review
- **Status:** Promote to next Parking Lot Review
- **Disposition owner:** Captain / process backlog review
- **Next review point or backlog destination:** next ertztech-process Parking Lot Review

## Deferred Follow-Up

The following remain clearly deferred and were not implemented in this cycle:

- full Story Coach multi-experience selector
- selector-specific prompt switching
- saved-story relinking
- saved-story edit baselines
- relationship-only dirty-state handling
- Chapter 3 completion-preservation changes
- Chapter 4 Story Map

Unless a future Backlog Review changes priority, the next planned implementation should return to the deferred Story Coach multi-experience context-selection slice before Chapter 4 Story Map.

## Changes Made Immediately

- This retro records the full implementation cycle, including the two clean failed attempts, the package split, the successful narrowed implementation, the UI-polish correction, and post-merge verification.
- The merge commit, implementation commits, implementation package, Issue, PR, and manual/automated evidence are captured in one durable record.
- Process improvement proposals are recorded with explicit destinations and statuses.

## Proposed-Only Changes

The following remain proposals until selected through future process review:

- Captain Handoff Gate
- controller-coupling package sizing checkpoint
- mandatory package-splitting review after a second clean failed implementation attempt
- stronger manual UI verification guidance

## Next Recommended Action

1. Open a documentation-only pull request for this retro branch.
2. Review and merge the retro record.
3. Carry `PROC-001` through `PROC-004` into the next ertztech-process Parking Lot Review.
4. Use the deferred Story Coach multi-experience context-selection slice as the next planned implementation candidate before Chapter 4 Story Map unless backlog priority changes.

## Cycle Closure

This cycle is closed only when:

- this retro record is saved in the NextMove repository,
- the retro pull request is created and merged, and
- the resulting process proposals are routed into the next ertztech-process backlog review.
