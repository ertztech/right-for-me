# Implementation Package

## Initiative

Shared User-Controlled Voice Experience for Career Journey Chapters 1 and 3

## Session Control

- Date: 2026-07-16
- Branch: `feature/shared-career-journey-voice`
- Delivery mode: documentation-only planning package
- Scope guardrail: no application code, test, style, or product-behavior changes in this package step

## Problem Statement

Career Journey Chapter 3 already includes browser speech-recognition controls, but the behavior is attempt-based, Chapter-3-specific, and not aligned with the intended user-controlled voice experience for both Chapter 1 and Chapter 3.

Current repository evidence shows:

- Chapter 1 has no microphone control today.
- Chapter 3 creates a fresh speech-recognition instance for each interaction.
- Chapter 3 does not automatically restart after a normal browser-generated recognition end.
- Chapter 3 appends transcript text from a cumulative attempt string, which leaves room for duplicate insertion across restarts.
- Chapter switches and focused-workspace closure do not currently guarantee voice teardown.

The product need is one shared, explicit, user-controlled voice interaction for Chapters 1 and 3 that stays active through normal pauses, stops safely when the editing surface changes, and appends finalized transcript text without replacing typed content or duplicating speech across browser restarts.

## Product Decision

Approved decisions for this implementation package:

- Chapters 1 and 3 are one implementation.
- Both chapters use the same microphone and visible Stop Listening experience.
- Normal browser-generated recognition endings restart silently while the user session remains active.
- `no-speech` is recoverable with a bounded retry safeguard.
- The implementation may introduce one small shared voice-session helper.
- Chapter switches, workspace closure, and target replacement must stop voice capture.
- Finalized transcript segments append without replacing or duplicating existing text.
- No broad voice architecture rewrite is authorized.
- No full documentation-tree cleanup is authorized.

## Team Perspectives

- Product Owner: the experience should feel calm and user-controlled, not fragile or attempt-based.
- Architect: keep the change inside the Career Journey boundary and introduce only one small shared helper if needed.
- Engineering Manager: preserve one coherent branch and one pull request by keeping scope bounded to the smallest reusable voice-session layer for Chapters 1 and 3.
- Software Engineer: separate shared recognition-session behavior from chapter-specific transcript destinations and UI rendering.
- QA: verify explicit start, explicit stop, silent restart on normal browser end, bounded `no-speech` recovery, teardown-stop behavior, and duplicate-prevention behavior.
- Delivery Coach / Facilitator: preserve the public planning trail and record repository evidence that changed the package shape.
- Captain: approve the smallest repeatable implementation that creates one consistent interaction contract across both chapters.

## Tradeoffs

- Reusing Chapter 3 behavior as-is would be faster, but it would carry forward attempt-based logic, duplication risk, and lifecycle gaps.
- A broader voice subsystem could be more future-proof, but it would violate the approved scope and increase delivery risk.
- Controlled restart adds complexity beyond simply setting `continuous = true`, but repository evidence shows controlled restart is needed to satisfy the requested behavior reliably.
- A shared helper improves consistency, but it must stay small and avoid becoming a general voice platform.

## Team Recommendation

Implement one small shared voice-session helper plus chapter-specific adapters inside the existing Career Journey controller.

Shared layer responsibilities:

- browser API detection
- user-session intent tracking
- active recognition-attempt tracking
- restart control after normal browser ends
- bounded `no-speech` retry behavior
- finalized-segment delivery without duplicate insertion
- explicit teardown handling

Chapter-specific responsibilities:

- Chapter 1 transcript destination and UI rendering
- Chapter 3 transcript destinations and UI rendering
- chapter-specific status copy and controller-state updates

## Implementation Package

### Goal

Create a shared, user-controlled voice experience for Career Journey Chapters 1 and 3 without changing unrelated product behavior.

### In Scope

- Add one shared voice-session helper small enough to support only the approved Career Journey need
- Add Chapter 1 microphone, visible listening state, and visible Stop Listening control
- Update Chapter 3 voice behavior to use the same session model and visible stop experience
- Keep existing typed text intact while appending new finalized speech with reasonable spacing
- Silently restart normal browser-ended recognition attempts while the user session remains active
- Recover from `no-speech` with a bounded retry safeguard
- Stop voice capture on chapter switch, focused-workspace closure, and active-target replacement
- Extend automated coverage for session lifecycle and regression-sensitive chapter behavior
- Update active implementation status documentation

### Out Of Scope

- broad voice architecture rewrite
- non-Career-Journey voice controls
- AI prompt changes
- persistence changes
- Career Brain schema changes
- documentation-tree cleanup or reorganization
- Chapter 4 or later voice support

### Implementation Shape

- Keep Career Journey as the feature boundary.
- Use one shared helper for voice-session lifecycle.
- Keep transcript storage and UI ownership in the existing Career Journey controller.
- Stop active voice capture before any workspace or chapter action that replaces the active editing surface.
- Append only newly finalized transcript segments, not whole cumulative result strings.

## State-Transition Definition

Two distinct states must be modeled:

1. User-requested voice session state
2. Current browser recognition-attempt state

Required state concepts:

- `idle`
  - no user-requested session is active
  - no recognition attempt is running
- `requesting`
  - user explicitly started voice capture
  - browser permission / startup is in progress
- `listening`
  - recognition attempt is active
  - user session remains active
- `processing`
  - finalized transcript work is being resolved between result and end
- `restarting`
  - optional internal state for silent browser-end recovery while session intent remains active
- `complete`
  - transcript was appended and session has ended because the user stopped or a bounded recovery flow ended
- `unsupported`
  - browser speech recognition is unavailable
- `denied`
  - permission denied or service not allowed
- `error`
  - unrecoverable recognition error

Required transition rules:

- `idle -> requesting`
  - triggered only by explicit user microphone press
- `requesting -> listening`
  - on successful browser recognition start
- `requesting -> denied`
  - on permission denial
- `requesting -> unsupported`
  - when browser API is unavailable
- `listening -> processing`
  - when finalized speech arrives and is being prepared for append
- `listening -> restarting`
  - when browser generates a normal `end` while user session intent remains active and retry safeguards allow restart
- `listening -> complete`
  - when user explicitly stops and any remaining finalized transcript is appended
- `listening -> denied`
  - if browser reports denied state after start
- `listening -> error`
  - on unrecoverable error
- `listening -> idle`
  - on chapter switch, workspace closure, or target replacement teardown
- `processing -> listening`
  - if same user session continues with another browser attempt
- `processing -> complete`
  - if session ends after transcript append
- `restarting -> listening`
  - when new browser attempt starts
- `restarting -> no further restart`
  - if bounded `no-speech` safeguard is reached, return to safe idle or complete state with fallback messaging

Implementation distinction requirements:

- explicit user stop must suppress restart
- browser-generated end must not be treated as explicit stop
- teardown stop must suppress restart
- permission denial must return UI to a safe idle state
- recoverable `no-speech` must be bounded
- unrecoverable errors must return UI to a safe idle state

## Acceptance Criteria

- [ ] Chapter 1 and Chapter 3 use the same explicit microphone start and visible Stop Listening interaction.
- [ ] The user explicitly starts voice capture in both Chapter 1 and Chapter 3.
- [ ] The UI clearly indicates when listening is active.
- [ ] Normal thinking pauses do not require the user to manually restart voice input.
- [ ] Normal browser-generated recognition end events silently restart while the user session remains active.
- [ ] `no-speech` is recoverable with a bounded retry safeguard and does not leave the UI in a broken active state.
- [ ] Explicit user stop ends the session and prevents automatic restart.
- [ ] Finalized transcript segments append to existing typed text with reasonable spacing.
- [ ] Existing typed text is preserved.
- [ ] Transcript text does not duplicate across recognition restarts.
- [ ] Chapter switches stop voice capture.
- [ ] Focused-workspace closure stops voice capture.
- [ ] Replacing the active transcript target stops the prior voice capture session.
- [ ] Unsupported browsers return the UI to a safe idle or unavailable state.
- [ ] Permission denial returns the UI to a safe idle state.
- [ ] Existing Chapter 1 save, edit, and supportive incomplete-state behavior remain intact.
- [ ] Existing Chapter 3 explore, follow-up, save, saved-moment, and completion behavior remain intact.

## Definition Of Done

- [ ] Shared voice-session behavior is implemented for Career Journey Chapters 1 and 3 only.
- [ ] One small shared helper is the only new abstraction added for voice-session reuse.
- [ ] No broad voice architecture rewrite is introduced.
- [ ] Chapter 1 and Chapter 3 voice interactions match the approved common contract.
- [ ] Transcript append behavior preserves existing typed content and prevents duplicate insertion.
- [ ] Voice capture stops on chapter switch, workspace closure, and active-target replacement.
- [ ] Automated tests covering the approved lifecycle cases pass.
- [ ] Existing relevant Career Journey regression tests pass.
- [ ] Guided browser verification passes on desktop and narrow-width layouts.
- [ ] `PRODUCT_STATUS.md` reflects the active implementation accurately.

## Expected Files And Modules

Required:

- `src/jobsApplied/controller.js`
  - add Chapter 1 voice UI hookup
  - adapt Chapter 3 voice behavior to shared session control
  - stop active sessions on chapter and workspace lifecycle changes
- `src/styles.css`
  - reuse or minimally extend voice-control styling for Chapter 1 and shared states
- `tests/careerJourneyStateTransitions.test.js`
  - extend the regression harness to exercise browser-recognition lifecycle deterministically
- `PRODUCT_STATUS.md`
  - mark the active implementation
- `docs/04-delivery/2026-07-16-shared-career-journey-voice-implementation-package.md`
  - this package

Likely:

- `src/shared/voiceSession.js`
  - one small shared helper for session lifecycle
- `index.html`
  - only if the new shared helper must be loaded before the Career Journey controller in the current script-loading model

Possible:

- `tests/voiceSession.test.js`
  - direct helper-level tests if extraction makes that cleaner
- `docs/01-features/career-journey.md`
  - update feature-level planning notes after implementation if needed

## Automated Test Requirements

The implementation must include deterministic automated coverage for:

- starting voice capture in an empty Chapter 1 field
- starting voice capture in an empty Chapter 3 field
- appending finalized transcript to populated text
- surviving a normal browser `end` while the user session remains active
- explicitly stopping and preventing restart afterward
- preventing duplicate transcript insertion across restart attempts
- stopping voice capture on chapter switch
- stopping voice capture on focused-workspace closure
- stopping voice capture on active-target replacement
- handling permission denial
- handling unsupported browsers
- bounded `no-speech` recovery
- preserving Chapter 1 save / edit / supportive incomplete-state behavior
- preserving Chapter 3 explore / follow-up / save / saved-moment behavior

Repository-grounded test guidance:

- current relevant regression coverage lives in `tests/careerJourneyStateTransitions.test.js`
- current harness does not yet mock `window.SpeechRecognition` or `window.webkitSpeechRecognition`
- current harness bypasses browser voice lifecycle through a direct `appendVoice()` helper
- browser speech-recognition APIs can be deterministically mocked in the existing VM-based test setup

## Guided Browser Checklist

- [ ] Open Career Journey and confirm Chapter 1 shows microphone and Stop Listening controls consistent with Chapter 3.
- [ ] Start Chapter 1 voice capture in an empty field and confirm listening state is visible.
- [ ] Pause naturally and confirm voice capture continues through normal browser-ended recognition restarts without extra user action.
- [ ] Stop listening explicitly in Chapter 1 and confirm restart does not occur.
- [ ] Type text manually, restart voice capture, and confirm finalized speech appends without replacing typed text.
- [ ] Confirm no duplicated transcript text appears after a normal browser end and restart.
- [ ] Move from Chapter 1 to another chapter and confirm voice capture stops immediately.
- [ ] Open Chapter 3 initial-response voice capture and confirm the same interaction contract.
- [ ] Explore a story, then use voice for the follow-up field and confirm the same interaction contract.
- [ ] Switch between Chapter 3 targets and confirm target replacement stops the previous capture session.
- [ ] Close the focused workspace and confirm any active voice session stops.
- [ ] Test unsupported-browser handling if possible.
- [ ] Test permission-denial handling if possible.
- [ ] Recheck narrow-width layout for overlapping microphone, stop, and status elements.

## Documentation Updates

Required in this planning step:

- create `docs/04-delivery/2026-07-16-shared-career-journey-voice-implementation-package.md`
- update `PRODUCT_STATUS.md` Active Implementation section

Possible after implementation:

- update `docs/01-features/career-journey.md` if the chapter interaction contract needs to be reflected at the feature-planning layer
- record implementation review notes in the delivery docs flow after code lands

## Repository Grounding Findings

Repository inspection from 2026-07-16 found:

- `README.md` points to `PRODUCT_STATUS.md` as the single source of truth for active implementation status.
- Chapter 1 render and form behavior live in `src/jobsApplied/controller.js` in `renderCareerJourneyChapterOneInteraction()`, `renderCareerJourneyChapterOneForm()`, and the submit/edit handlers.
- Career Journey focused-workspace render and chapter switching also live in `src/jobsApplied/controller.js`.
- Chapter 3 voice rendering, event binding, browser recognition creation, append logic, and status sync all live in `src/jobsApplied/controller.js`.
- No shared speech-recognition helper currently exists.
- `SpeechRecognition` or `webkitSpeechRecognition` is currently created directly in Chapter 3 logic.
- `interimResults` is currently `true`; `continuous` is not explicitly configured.
- Current Chapter 3 behavior does not auto-restart on normal browser end.
- Current Chapter 3 append logic can permit duplication risk across restarted attempts because it appends from a cumulative transcript string.
- Current chapter-switch and workspace-close handlers rerender surfaces without clearly stopping active voice capture first.
- Existing automated coverage includes Career Journey state transitions, but not deterministic browser speech-recognition lifecycle tests.

## Package Revisions Caused By Repository Evidence

This package is narrower and more explicit because of repository findings:

- Shared helper authorization is limited to one small voice-session helper because no reusable helper exists today.
- Controlled restart is required because repository evidence shows `continuous` alone is not currently being used and would not cover the requested lifecycle guarantees.
- Teardown-stop behavior is explicitly required because chapter switching and workspace closure do not currently guarantee it.
- Duplicate-prevention behavior is explicit because current append logic is based on a cumulative transcript string.
- Test work is mandatory because current regression coverage does not exercise actual speech-recognition lifecycle behavior.

## Completed Pre-Implementation Review

### Product Owner Review

- [x] Product decision is clear.
- [x] User value is clear.
- [x] Approved behavior differences from current Chapter 3 behavior are explicit.
- [x] Out-of-scope items are named.

### Architect Review

- [x] The implementation is bounded to one coherent Career Journey slice.
- [x] The shared abstraction is intentionally small.
- [x] No broad voice architecture rewrite is authorized.
- [x] Shared and chapter-specific responsibilities are clearly separated.

### Engineering Manager Review

- [x] The work can remain one implementation, one branch, and one pull request.
- [x] Expected file touch points are identified.
- [x] Test requirements are explicit.
- [x] Lifecycle risks are documented before coding begins.

### Software Engineer Review

- [x] The implementation shape matches existing repository boundaries.
- [x] Controller-local state ownership is preserved where practical.
- [x] Duplicate-prevention requirements are explicit.
- [x] Teardown points are explicitly called out.

### QA Review

- [x] Acceptance criteria are testable.
- [x] Browser checks are concrete.
- [x] Speech-recognition mocking is feasible in the current test harness.
- [x] Regression-sensitive behaviors are named.

### Delivery Coach Review

- [x] This package preserves the existing documentation flow.
- [x] No documentation-tree cleanup is proposed.
- [x] The planning package is grounded in repository evidence, not assumption.
- [x] The package is implementation-ready.

### Captain Approval

- [x] Final scope approved for Implementation Planning.

## Captain Approval And Decisions

Captain-approved decisions recorded for implementation:

- Chapters 1 and 3 are one implementation.
- Both chapters use the same microphone and visible Stop Listening experience.
- Normal browser-generated recognition endings restart silently while the user session remains active.
- `no-speech` is recoverable with a bounded retry safeguard.
- The implementation may introduce one small shared voice-session helper.
- Chapter switches, workspace closure, and target replacement must stop voice capture.
- Finalized transcript segments append without replacing or duplicating existing text.
- No broad voice architecture rewrite is authorized.
- No full documentation-tree cleanup is authorized.

## Product-Direction Impact

This implementation reinforces the Career Journey direction as a calm, interview-first experience rather than a brittle form workflow. It improves Chapter 1 parity with Chapter 3, reduces restart friction during reflection pauses, and keeps the voice feature aligned with the focused-workspace experience instead of expanding into a broader product-wide voice initiative.

## Next Step

Start implementation on `feature/shared-career-journey-voice` using this package as the build contract, then complete code changes, automated tests, guided browser verification, and post-implementation documentation updates without widening scope beyond the approved small shared helper.
