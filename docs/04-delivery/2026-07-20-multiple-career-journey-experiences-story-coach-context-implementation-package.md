# Implementation Package

## Summary

This package originally covered one combined implementation:

- Multiple Chapter 2 Career Journey experiences
- Story Coach multi-experience context selection

It is now revised to record the Captain-approved split after two clean implementation attempts produced no product changes.

The active implementation is now:

- Multiple Chapter 2 Career Journey experiences

The deferred follow-up implementation is now:

- Story Coach multi-experience context selection

## User / Business Value

- Users can capture, review, and safely edit multiple roles or meaningful career seasons.
- This creates the data foundation for the later Story Coach selector and Chapter 4 Story Map.

## Active Implementation

### Title

Multiple Chapter 2 Career Journey experiences

### Active Scope

- Replace the single Chapter 2 record with an ordered collection.
- Preserve an existing saved record and its stable ID.
- Maintain separate controller-local state for:
  - saved experience collection
  - active working draft
  - draft baseline
  - active experience ID
  - most recently successfully saved experience ID
- Keep state session-only.
- Add a dedicated stable-ID lookup helper.
- Preserve the current guided first-entry form before the first save.
- Role or season remains required.
- Company, start year, end year, and reflection remain optional.
- First successful save unlocks Chapter 3.
- Show a secondary experience count after the first save.
- Show all saved experiences as compact cards.
- Show available role, company, dates, and reflection.
- Omit missing optional values cleanly.
- Provide `Edit` on every card.
- Provide `Add another experience`.
- Allow only one active add or edit draft.
- Do not mutate saved records while typing.
- Save commits and returns to card view.
- Cancel discards a new draft or restores the saved experience.
- Editing preserves stable IDs.
- Successful save updates the most recently successfully saved experience ID.
- Opening or canceling an edit does not update it.
- Allow duplicate-looking experiences.
- Preserve one reflection per experience.

### Chronological Ordering

1. Prefer start year.
2. Use end year when start year is absent.
3. Dated entries before undated entries.
4. Most recent year first.
5. Preserve original stable order for ties.
6. Preserve original stable order for undated entries.

- Display order is presentation only and must not determine Chapter 3 context.

### Chapter 2 Dirty-State Protection

- Entering add or edit mode alone is not dirty.
- Actual changes create dirty state.
- Returning all fields to baseline clears dirty state.
- Dirty exits require:
  - Save
  - Discard
  - Cancel navigation
- Protect chapter switching, workspace close, and other relevant Journey exits.
- Do not add automatic draft persistence.

## Temporary Chapter 3 Compatibility

- Keep the current two-choice context control.
- The linked choice resolves to the most recently successfully saved Chapter 2 experience.
- `Different experience` continues to use a blank relationship.
- Resolve linked context using stable ID lookup.
- Successful Chapter 2 save updates the next compatibility context.
- Opening or canceling a Chapter 2 edit does not update it.
- An active Chapter 3 draft keeps its current context.
- Existing saved stories retain their current `timelineEntryId`.
- Saved-story labels resolve from the current experience collection.
- Editing an experience updates linked-story display labels.
- Do not add a multi-experience Story Coach selector in this implementation.
- Leave current Chapter 3 completion and saved-story editing behavior unchanged.

## Deferred Implementation 2

Blocking follow-up implementation:

- Story Coach multi-experience context selection

Deferred scope:

- multi-experience Story Coach selector
- chronological selector options
- context switching among saved experiences
- prompt updates for selected experiences
- new-story selector locking
- Start Over unlocking for the full selector
- saved-story relinking
- saved-story edit baselines
- relationship-only dirty-state handling
- preserving Chapter 3 completion during saved-story edits
- broader Chapter 3 completion corrections

## Acceptance Criteria

* [ ] The single Chapter 2 record migrates to a saved collection without widening beyond the existing controller-local, session-only Journey boundary.
* [ ] An existing saved Chapter 2 record is preserved with its current stable ID.
* [ ] The current guided first-entry form remains in place before the first save.
* [ ] The first successful save unlocks Chapter 3.
* [ ] Users can add second and third experiences.
* [ ] Users can edit any saved experience.
* [ ] Only one active Chapter 2 draft exists at a time.
* [ ] Saved records are not mutated live while typing.
* [ ] Save commits the active draft and returns to the card view.
* [ ] Cancel discards a new draft or restores the targeted saved experience.
* [ ] Editing preserves stable IDs.
* [ ] Each experience keeps its own reflection.
* [ ] The saved-experience count stays accurate.
* [ ] Chapter 2 cards use chronological ordering with:
  - start-year sorting when usable
  - end-year-only sorting when start year is absent
  - stable order for tied dated entries
  - dated entries before undated entries
  - stable order for undated entries
* [ ] Duplicate-looking experiences are allowed.
* [ ] Merely entering add or edit mode is clean.
* [ ] Actual field changes create dirty state.
* [ ] Returning all fields to baseline restores the clean state.
* [ ] Dirty chapter switching is protected.
* [ ] Dirty workspace close is protected.
* [ ] Dirty exits offer Save, Discard, and Cancel navigation outcomes.
* [ ] The most recently successfully saved experience ID updates only after successful save.
* [ ] Opening or canceling a Chapter 2 edit does not change the compatibility context.
* [ ] An active Chapter 3 draft keeps its current context while Chapter 2 changes elsewhere.
* [ ] Existing linked and `Different experience` Chapter 3 behavior remains intact.
* [ ] Linked saved-story labels update after experience edits.
* [ ] Career Journey regressions pass.
* [ ] Story Coach regressions pass.
* [ ] Career Vault regressions pass.

## Out Of Scope

- Story Coach multi-experience selector
- full Story Coach relinking flow
- saved-story edit-baseline redesign
- Chapter 3 completion corrections
- Chapter 4 UI
- experience deletion
- manual reordering
- duplicate warnings or merge behavior
- persistence changes
- Career Vault integration
- AI contract changes
- story deletion
- tags, search, or filters
- new routing
- broad controller refactor
- broad Career Journey redesign

## Implementation Complexity Estimate

* Medium

## Expected Codex Sessions

* 1-2

## Expected Review Effort

* Medium

## Manual Testing Required

* Yes

## Formal Implementation Review Required

* Yes

## Known Risks

- `src/jobsApplied/controller.js` remains the core coupling point for Chapter 2 state, Chapter 3 compatibility behavior, focused-workspace behavior, rendering, and action binding.
- Dirty-state protection still touches multiple exit paths.
- Free-text year sorting still requires conservative parsing.
- Duplicate visible labels still require ID-based correctness rather than label-based assumptions.
- The temporary Chapter 3 compatibility seam must not be mistaken for the deferred multi-experience selector.

## Dependencies

- Existing focused workspace and chapter navigation behavior in `src/jobsApplied/controller.js`
- Existing two-choice Chapter 3 context behavior
- Existing VM-based regression harness in `tests/careerJourneyStateTransitions.test.js`

## Assumptions

- The approved repository grounding remains valid for the current codebase.
- Controller-local, session-only state remains the correct implementation boundary for this slice.
- The current two-choice Chapter 3 control is sufficient as a temporary compatibility seam until the follow-up package is implemented.

## Material Decision Records

- Question: continue the combined migration or split it
  - Evidence: two clean implementation attempts produced no product changes because the Chapter 2 and Chapter 3 migration was unsafe as one controller replacement; unsafe partial controller changes were restored; the implementation branch remained clean; baseline Career Journey tests passed after restoration.
  - Relevant perspectives: Product Owner, Architect, Engineering Manager, Software Engineer, QA, Delivery Coach.
  - Captain input: split the implementation.
  - Resulting decision: Chapter 2 collection and compatibility seam first; Story Coach selector second.
  - Impact on scope, acceptance criteria, technical boundaries, or verification: active scope narrows to Chapter 2 multiple experiences plus temporary Chapter 3 compatibility behavior; acceptance criteria, risks, estimates, and verification now exclude the deferred Story Coach selector and saved-story edit-baseline work.
  - Unresolved disagreement, if any: none.

- Question: what decision rule applies to routine related implementation decisions inside the approved package?
  - Relevant perspectives: Delivery needed momentum without unnecessary Captain gates; Product and QA still needed protection for material scope or value changes.
  - Captain input: routine related implementation decisions may follow the team recommendation without individual Captain questions.
  - Resulting decision: only decisions that materially change value, scope, sequencing, risk, acceptance criteria, or approved product direction require a separate Captain gate.
  - Impact on scope, acceptance criteria, technical boundaries, or verification: day-to-day execution may proceed without new Captain questions unless one of the listed material boundaries changes.
  - Unresolved disagreement, if any: none.

## Relevant Product Or Design Principles

- Principle: Career Journey is the guided experience layer and Career Brain is the durable source of truth.
  - How it applies: this slice stays controller-local and session-only.
  - Required behavior or presentation: do not add persistence or Career Vault coupling.
  - Failure mode to avoid: silently turning the slice into a persistence or data-model migration project.
  - Verification method: file changes stay inside the approved Career Journey boundary and durable docs.

- Principle: The product should feel interview-first rather than form-first.
  - How it applies: preserve the guided first-entry form while letting saved experiences stay compact and factual.
  - Required behavior or presentation: first entry still feels guided, and later Chapter 2 controls do not become a generic CRUD manager.
  - Failure mode to avoid: overwhelming the user with management UI before story work is possible.
  - Verification method: guided browser checks for first-entry flow, card readability, and add/edit calmness.

## State Transitions

- State: Chapter 2 first-entry draft
  - Trigger: user opens Chapter 2 before any saved experience exists
  - Visible result: current guided first-entry form remains visible
  - Allowed next action: type, save, leave if not dirty
  - Exit condition: successful first save creates the first saved experience and unlocks Chapter 3

- State: Chapter 2 saved-card view
  - Trigger: at least one Chapter 2 experience has been saved and no add/edit draft is active
  - Visible result: compact saved cards, small factual count, `Edit`, and `Add another experience`
  - Allowed next action: add another experience, edit an existing experience, leave chapter
  - Exit condition: user opens add or edit mode

- State: Chapter 2 add draft
  - Trigger: user selects `Add another experience`
  - Visible result: one active draft form for a new experience
  - Allowed next action: save, cancel, navigate away through guarded flow
  - Exit condition: save returns to card view; cancel discards active draft only

- State: Chapter 2 edit draft
  - Trigger: user selects `Edit` on a saved experience
  - Visible result: one active draft form seeded from saved baseline
  - Allowed next action: save, cancel, navigate away through guarded flow
  - Exit condition: save commits changes and returns to card view; cancel restores baseline and returns to card view

- State: Chapter 2 dirty draft
  - Trigger: any draft field changes away from baseline
  - Visible result: no special product copy required unless the user attempts to leave
  - Allowed next action: keep editing, return fields to baseline, save, discard, or cancel navigation
  - Exit condition: save, discard, or full return to baseline

- State: Chapter 3 compatibility linked context
  - Trigger: current two-choice control is set to the linked option
  - Visible result: Chapter 3 continues to use one linked Chapter 2 experience plus `Different experience`
  - Allowed next action: continue current Story Coach behavior without multi-experience selection
  - Exit condition: deferred follow-up implementation replaces the compatibility seam

## Copy Requirements

- Preserve the existing Chapter 1 supportive incomplete-state message unchanged.
- Preserve the existing Chapter 2 required-field message for missing role or career season unless implementation evidence requires a repository-grounded wording adjustment.
- Chapter 2 labels show `Role · Company` when both exist and role only when company is missing.
- Omit missing date text cleanly.
- `Different experience` remains the current explicit Chapter 3 option label.

## Editable Saved Content Behavior

- Chapter 2 saved experiences:
  - save -> add another -> save creates independent saved records
  - save -> edit -> change -> resave keeps the same stable ID and updates only the targeted experience on Save
  - save -> edit -> clear back to baseline -> clean state returns before dirty exit handling applies
  - save -> edit -> cancel restores the original saved record and discards only the active draft

- Chapter 3 saved stories in this implementation:
  - remain on the current two-choice compatibility behavior
  - keep current completion behavior unchanged
  - keep current saved-story editing behavior unchanged
  - continue to resolve linked labels from current Chapter 2 experience data

## Files Likely Affected

- `src/jobsApplied/controller.js`
- `src/styles.css`
- `tests/careerJourneyStateTransitions.test.js`
- `docs/01-features/career-journey.md`
- `docs/04-delivery/2026-07-20-multiple-career-journey-experiences-story-coach-context-implementation-package.md`

## Files Expected To Remain Unchanged

- `src/app.js`
- `src/jobsApplied/storyCoach.js`
- `src/careerVault/*`
- app-wide routing
- AI request and response contracts

Changes to these boundaries require an explicit scope review rather than incidental implementation edits.

## Repository Grounding Findings

- Repository review status: revised after package split.
- Confirmed files and modules affected:
  - `src/jobsApplied/controller.js` currently owns Chapter 2 state, Chapter 3 compatibility behavior, focused-workspace behavior, saved-story label rendering, and action binding.
  - `tests/careerJourneyStateTransitions.test.js` remains the main regression harness for current Journey behavior.
  - `src/styles.css` remains the likely styling touch point for Chapter 2 cards and related controls.
- Existing patterns to reuse:
  - controller-local mutable Journey state
  - current two-choice Chapter 3 context behavior
  - current `Start Over` confirmation path
  - current VM-based regression harness
- Repository-confirmed coupling:
  - Chapter 2 single-record assumptions and Chapter 3 context behavior are both embedded in the same controller interaction slice.
  - That controller coupling made the combined Chapter 2 plus multi-experience Story Coach migration unsafe as one replacement.
- Package-sizing outcome:
  - this exposed a package-sizing problem rather than an implementation defect
  - the narrowed Chapter 2-first package reduces replacement risk while preserving the later Story Coach follow-up

## Process Evidence

- Two implementation attempts stopped safely.
- Unsafe partial controller changes were restored.
- The implementation branch remained clean after restoration.
- Baseline Career Journey tests passed after restoration.
- No product code, tests, commits, or pushes resulted from those attempts.
- The clean failures exposed a package-sizing problem rather than a product defect.

## Product Direction Impact

* Aligned
* Relevant principle or objective: Career Journey should remain calm, interview-first, and story-building before output-building.
* Proposed change, if any: none
* Reason and supporting evidence: the narrowed Chapter 2-first slice preserves user value and lowers implementation risk without widening product scope
* Captain approval required before updating product direction: no

## Documentation Updates Required

- Revise this durable package to reflect the Captain-approved split.
- Update `docs/01-features/career-journey.md` to distinguish:
  - active multiple-experience Chapter 2 capability
  - temporary Chapter 3 compatibility behavior
  - deferred full Story Coach experience selector

## Execution And Traceability

* Existing durable package path: `docs/04-delivery/2026-07-20-multiple-career-journey-experiences-story-coach-context-implementation-package.md`
* Path decision: preserved
* GitHub Issue #135: unchanged in this documentation-only step
* Pull Request: do not create yet
* Merge: not started
* Blocking downstream dependency: deferred follow-up package for Story Coach multi-experience context selection

## QA Checklist

* [ ] Automated coverage proves migration from one experience to a collection.
* [ ] Automated coverage proves existing stable ID preservation and first-save Chapter 3 unlock.
* [ ] Automated coverage proves second and third experience creation, editing, one active draft, and no live saved-record mutation.
* [ ] Automated coverage proves save and cancel behavior, stable IDs across edits, independent reflections, and accurate count behavior.
* [ ] Automated coverage proves chronological ordering, start-year sorting, end-year-only sorting, tied-date stable order, undated ordering, and duplicate-looking experiences.
* [ ] Automated coverage proves clean versus dirty Chapter 2 forms, restored-to-baseline behavior, protected chapter switching, protected workspace close, and Save/Discard/Cancel navigation behavior.
* [ ] Automated coverage proves compatibility-context updates only after successful save and no compatibility-context change after cancel.
* [ ] Automated coverage proves active Chapter 3 draft preservation plus existing linked and `Different experience` behavior.
* [ ] Automated coverage proves linked saved-story labels update after experience edits.
* [ ] Career Journey, Story Coach, and Career Vault regression suites pass.
* [ ] Manual browser testing covers first-entry form, first-save card transition, adding multiple experiences, editing different experiences, chronological ordering, missing optional values, duplicate visible labels, long reflection layout, Save/Discard/cancel-navigation behavior, chapter switching, workspace close, desktop layout, and narrow-width layout.

## Definition Of Done

* [ ] The approved Chapter 2 collection state model is implemented inside the existing controller-local, session-only Journey boundary.
* [ ] Existing single-record Chapter 2 data migrates safely into the new collection model with stable ID preservation.
* [ ] Temporary Chapter 3 compatibility behavior continues to work through stable ID lookup and most-recently-saved context resolution.
* [ ] Relevant automated tests pass.
* [ ] Guided manual browser verification passes.
* [ ] Durable docs remain aligned with shipped product behavior.

## Pre-Implementation Review

* Repository grounding complete: Yes

### Product Owner

* Pass
* Notes: user value is clear, and the split preserves the Chapter 2 foundation without overloading one implementation slice.

### Architect

* Pass
* Notes: the narrowed package keeps the active work inside the current controller boundary and defers the riskier Story Coach selector replacement.

### Engineering Manager

* Pass
* Notes: scope is reduced to a medium implementation with lower review risk and fewer expected sessions.

### Software Engineer

* Pass
* Notes: the active package now matches the smallest cohesive state-model migration that can be attempted safely.

### Implementation Engineer

* Pass
* Notes: file targets, constraints, and verification categories now align with the narrowed scope.

### QA

* Pass
* Notes: verification is explicit for the active Chapter 2 slice and does not incorrectly require deferred Story Coach selector behavior.

### Delivery Coach

* Pass
* Notes: the package is durable, records the approved split, and preserves process evidence without transient branch or PR narration.

### Review Summary

* Agreements: split the combined package; implement Chapter 2 collection and compatibility seam first; defer the Story Coach selector
* Disagreements: none preserved as material
* Tradeoffs: smaller active scope reduces controller-replacement risk while requiring a separate follow-up package for full Story Coach behavior
* Unresolved assumptions: exact dirty-exit warning copy and any narrow-width Chapter 2 polish remain implementation-time details unless repository evidence forces a product decision
* Confidence: high
* Captain decisions needed: none
* Ready / not ready: ready
* Next artifact: documentation PR for the package split

## Parking Lot Items

- Story Coach multi-experience selector
- saved-story relinking and edit baselines
- Chapter 3 completion corrections
- Chapter 4 UI
- experience deletion
