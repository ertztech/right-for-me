# Implementation Retro: Shared Career Journey Voice Process Pilot

**Date:** 2026-07-16  
**Project:** NextMove  
**Cycle outcome:** Completed and merged  
**Implementation:** Shared User-Controlled Voice Experience for Career Journey Chapters 1 and 3  
**Retro status:** Complete when this record is saved and the forward-linked process backlog record is created

## Backward Traceability

- Implementation package: `docs/04-delivery/2026-07-16-shared-career-journey-voice-implementation-package.md`
- GitHub Issue: `#<ISSUE_NUMBER>`
- Pull request: `#132`
- Merge commit: `69772ad6c0c025687b7c4dabd6906f4e26717588`
- Automated verification:
  - `node tests/careerJourneyStateTransitions.test.js`
  - `node tests/storyCoach.test.js`
- Guided verification: Chapter 1 and Chapter 3 voice behavior, natural pause continuation, explicit stop, transcript append and duplicate prevention, teardown, permission fallback, and narrow-width layout all passed.
- Implementation Review note: A lightweight review occurred, but the formal `implementation-review.md` workflow was not clearly run before merge. This is recorded as a process miss.

## Forward Traceability

- Process improvement backlog: `ertztech-process/docs/04-delivery/process-improvement-backlog/2026-07-16-nextmove-voice-pilot.md`
- Next review point: ertztech-process Parking Lot Review
- Proposal IDs: `PROC-001` through `PROC-006`

## Cycle Outcome

The implementation successfully added one shared, user-controlled voice-session experience to Career Journey Chapters 1 and 3.

The completed change:

- added voice input to Chapter 1,
- moved Chapter 3 to the same shared start-and-stop experience,
- allowed normal pauses without requiring another microphone press,
- silently restarted browser recognition while the user session remained active,
- prevented duplicate transcript insertion,
- stopped voice capture when the active surface was replaced,
- preserved typing and existing chapter behavior,
- added deterministic speech-recognition lifecycle testing,
- passed automated and guided browser verification.

The implementation stayed within the approved scope and was completed in one primary Codex session.

## Implementations Completed

### Shared Career Journey voice session

**Outcome:** Complete

**Files changed:**

- `src/shared/voiceSession.js`
- `index.html`
- `src/jobsApplied/controller.js`
- `src/styles.css`
- `tests/careerJourneyStateTransitions.test.js`

**Evidence:**

- All required Career Journey voice scenarios printed explicit `PASS`.
- Existing Story Coach regression tests passed.
- Guided desktop and narrow-width browser testing passed.
- No unrelated product, architecture, or documentation cleanup was included.

## Decisions Made

### DEC-001: Treat the process pilot as successful

**Context and evidence:** The implementation stayed in scope, changed the expected files, passed automated and guided verification, and required no corrective implementation session.

**Reasoning:** The longer Codex run reflected legitimate lifecycle and test-infrastructure work rather than wandering or uncontrolled scope.

**Impact:** The implementation is considered healthy and appropriately sized.

**Affected workflow or principle:** Implementation Planning, Implementation Review, Implementation Retro

**Follow-up action:** Track expected versus actual implementation effort in future cycles.

**Backlog status:** `PROC-006` promoted to the next Parking Lot Review.

### DEC-002: Record the missed formal Implementation Review without reopening the completed implementation

**Context and evidence:** A lightweight team-style review occurred after testing, but the formal Implementation Review workflow was not explicitly loaded and completed before merge.

**Reasoning:** The implementation evidence was strong and the feature is complete, but the process gate was not handled clearly enough.

**Impact:** The cycle remains successful, with a documented process miss.

**Affected workflow or principle:** Implementation Cycle and Implementation Review

**Follow-up action:** Add mandatory workflow transition gates and explicit phase completion states.

**Backlog status:** Included in `PROC-001`.

### DEC-003: Use an artifact chain instead of duplicate records

**Context and evidence:** The implementation package, `PRODUCT_STATUS.md`, GitHub Issue, and pull request repeated much of the same information.

**Reasoning:** Each artifact should have one primary purpose and later artifacts should add evidence rather than copy earlier content.

**Impact:** Future cycles should use:
1. Implementation package: what should be built and proven
2. GitHub Issue: track approved execution
3. Pull request: what changed and what was proven
4. Retro: what was learned and where it goes next

**Affected workflow or principle:** Implementation Planning, Implementation Package, Implementation Review, Implementation Retro

**Follow-up action:** Remove routine implementation-status file updates and define explicit traceability rules.

**Backlog status:** `PROC-004` promoted to the next Parking Lot Review.

### DEC-004: Treat capture and commitment as separate actions

**Context and evidence:** Existing user feedback that voice stopped too quickly surfaced only because a related implementation was under discussion.

**Reasoning:** Feedback should be captured immediately without silently expanding current scope.

**Impact:** Material feedback should be routed either into current refinement through an explicit decision or into the next Parking Lot Review.

**Affected workflow or principle:** Facilitator-Orchestrator, Backlog Refinement, Parking Lot Review

**Follow-up action:** Create a structured feedback capture and routing workflow.

**Backlog status:** `PROC-005` promoted to the next Parking Lot Review.

## What Went Well

- Repository inspection identified the true Chapter 3 lifecycle, duplication, and teardown risks before implementation.
- The Captain's feedback about the microphone stopping too quickly materially improved the product outcome.
- The final implementation package gave Codex enough context to stay within scope.
- Codex created a small shared helper rather than a broad voice architecture.
- Automated tests covered the browser lifecycle through a deterministic fake `SpeechRecognition` implementation.
- Guided browser testing validated behavior that mocks alone could not prove.
- The implementation completed in one primary Codex session.
- Product direction remained intact.

## What Caused Friction

- The cycle did not begin with the Implementation Cycle workflow as the controlling document.
- The Captain had to upload individual workflow files to keep the session aligned.
- The Facilitator answered a material refinement question from one blended assistant perspective instead of facilitating a team decision loop.
- Implementation Planning produced good conclusions but an overly long and repetitive artifact.
- Routine `PRODUCT_STATUS.md` updates duplicated transient GitHub status and consumed Codex effort.
- User feedback lacked a reliable capture and routing path.
- The formal Implementation Review workflow was not clearly completed before merge.
- The process had no evidence-based way to interpret a 16-minute, 40-second Codex implementation run.

## Root Causes

### RC-001: No cycle-level controller

The process relied on conversational memory and individual workflow uploads instead of a visible controller that tracked the active phase, required workflow, entry criteria, gate, and next allowed step.

### RC-002: Facilitator optimized for answers instead of decisions

When new Captain input appeared, the Facilitator synthesized a recommendation rather than routing the question through the relevant team roles and returning for Captain feedback.

### RC-003: Planning conversation and durable artifact were not separated

The process preserved too much discussion and repeated conclusions across several sections instead of producing a concise Codex-ready package.

### RC-004: Artifact responsibilities were not distinct

Repository status, GitHub tracking, implementation decisions, and final proof overlapped because the process did not define one primary purpose for each artifact.

### RC-005: Feedback capture was informal

The process had no lightweight mechanism to capture a user problem, preserve context, assign a disposition, and route it forward.

### RC-006: Test infrastructure cost was not recognized separately

The implementation estimate did not distinguish feature code from the one-time creation of reusable deterministic speech-recognition test infrastructure.

## Product and Design-Principle Lessons

- Voice input should feel user-controlled and supportive, not expose browser lifecycle details.
- Normal thinking pauses are part of the expected reflection experience.
- Consistent functional behavior across chapters is more important than copying an existing implementation unchanged.
- Typing must remain a complete fallback.
- Product feedback may surface during unrelated work and must be captured without automatically expanding scope.

## Operating-Model Improvements

### PROC-001: Add cycle-level workflow control and mandatory transition gates

**Problem observed:** The pilot did not start with the Implementation Cycle workflow, and the Facilitator relied on the Captain to provide workflow files and correct drift.

**Evidence:** Backlog Refinement, Implementation Planning, and Implementation Retro workflows had to be uploaded explicitly. The formal Implementation Review gate was nearly skipped.

**Desired improvement:** Require the Facilitator to open the cycle, display the current phase, load the required workflow, track entry and exit criteria, and block advancement until required outputs and Captain approvals are complete.

**Recommended priority:** High

**Suggested destination:** Implementation Cycle workflow and Facilitator-Orchestrator role

**Status:** Promote to next Parking Lot Review

### PROC-002: Require interactive team decision loops during refinement

**Problem observed:** A material Captain question was initially answered by one generic assistant voice rather than the relevant team roles.

**Evidence:** The Captain had to interrupt and ask whether the team should be weighing in.

**Desired improvement:** When new material input appears, require:
1. decision framing,
2. relevant role perspectives,
3. Captain feedback,
4. team response,
5. recorded conclusion,
6. story update.

**Recommended priority:** High

**Suggested destination:** Backlog Refinement workflow and Facilitator-Orchestrator role

**Status:** Promote to next Parking Lot Review

### PROC-003: Separate interactive planning from the condensed implementation package

**Problem observed:** Planning conversations were valuable, but the saved output was too wordy and repetitive.

**Evidence:** Scope, conclusions, team perspectives, tradeoffs, and approval details were repeated across multiple sections.

**Desired improvement:** Keep the conversation interactive, then save a package that contains only implementation-relevant conclusions, meaningful disagreements, unresolved decisions, state transitions, acceptance criteria, technical boundaries, verification requirements, and Captain decisions.

**Recommended priority:** High

**Suggested destination:** Implementation Planning workflow and implementation-package template

**Status:** Promote to next Parking Lot Review

### PROC-004: Create a linked artifact chain and eliminate transient status duplication

**Problem observed:** The implementation package, status file, Issue, and pull request repeated the same information.

**Evidence:** Codex updated `PRODUCT_STATUS.md` even though GitHub already tracked the implementation's active and completed status.

**Desired improvement:** Define:
- package = what should be built and proven,
- Issue = track approved work,
- pull request = what changed and what was proven,
- retro = what was learned and where it goes next.

Durable repository documentation should change only when product direction, architecture, behavior, or future decisions require it.

**Recommended priority:** High

**Suggested destination:** Implementation Cycle, Implementation Planning, Implementation Package, Implementation Review, and Implementation Retro workflows

**Status:** Promote to next Parking Lot Review

### PROC-005: Add structured user-feedback capture and routing

**Problem observed:** Important existing feedback surfaced only because a related implementation was being discussed.

**Evidence:** The microphone pause problem materially changed the implementation but previously existed only in user experience and conversation context.

**Desired improvement:** Capture feedback at the moment it appears, record the problem and impact before prescribing a solution, then route it into current refinement or the next Parking Lot Review without automatically committing work.

**Recommended priority:** High

**Suggested destination:** New feedback-capture workflow, Facilitator-Orchestrator role, and GitHub operating model

**Status:** Promote to next Parking Lot Review

### PROC-006: Track implementation efficiency and reusable test assets

**Problem observed:** The 16-minute, 40-second Codex session raised a sizing question, but the process lacked evidence for interpreting it.

**Evidence:** The implementation completed successfully in one session and included the one-time creation of deterministic speech-recognition test infrastructure.

**Desired improvement:** Track:
- expected and actual Codex sessions,
- approximate elapsed time,
- files changed,
- scope deviations,
- correction sessions,
- test infrastructure created,
- reusable test assets,
- reviewability.

Add a Test Asset Reuse Check to planning and repository grounding.

**Recommended priority:** Medium-high

**Suggested destination:** Implementation Planning, Repository Grounding, Implementation Review, and Implementation Retro workflows

**Status:** Promote to next Parking Lot Review

## Backlog and Carryover Dispositions

### Process improvement backlog

- `PROC-001`: Promote to next Parking Lot Review
- `PROC-002`: Promote to next Parking Lot Review
- `PROC-003`: Promote to next Parking Lot Review
- `PROC-004`: Promote to next Parking Lot Review
- `PROC-005`: Promote to next Parking Lot Review
- `PROC-006`: Promote to next Parking Lot Review

### Technical debt

**Potential shared fake speech-recognition test helper**

- Observation: The deterministic fake currently lives in `tests/careerJourneyStateTransitions.test.js`.
- Disposition: Keep parked.
- Trigger for promotion: A second test suite needs the same fake recognition behavior.
- Reason: Do not extract a shared helper only for theoretical reuse.

### Feature backlog

No new uncommitted NextMove feature is created by this retro.

The voice-pause feedback was incorporated into the completed implementation through refinement and Captain approval.

### Cycle backlog carryover

None.

### Product-direction proposals

None.

The implementation aligns with the current product direction.

## Changes Made Immediately

- The formal Implementation Review miss is recorded in this retro.
- The six process-improvement proposals are assigned IDs and explicit dispositions.
- The retro defines backward and forward traceability.
- No workflow documents are changed automatically during the retro.

## Proposed-Only Changes

The following remain proposals until selected through the ertztech-process Parking Lot Review:

- cycle controller and gates,
- interactive refinement loop,
- condensed planning artifacts,
- linked artifact chain,
- feedback capture workflow,
- implementation-efficiency and test-reuse checkpoints.

## Next Recommended Action

1. Save this retro in the NextMove repository.
2. Create the linked ertztech-process improvement backlog record.
3. Run a focused ertztech-process Parking Lot Review using `PROC-001` through `PROC-006`.
4. Select the smallest coherent workflow/documentation improvement package.
5. Create a documentation-only implementation package.
6. Use Codex to update the selected ertztech-process workflows.
7. Link the resulting Issue and pull request back to this retro and the process backlog record.

## Cycle Closure

This cycle is closed only when:

- this retro record is saved in the NextMove repository, and
- the linked process improvement backlog record is saved in the ertztech-process repository.
