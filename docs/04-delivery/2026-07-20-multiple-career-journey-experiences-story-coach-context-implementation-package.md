# Implementation Package

## Summary

Expand Career Journey Chapter 2 from one saved experience into multiple stable experiences and replace the Chapter 3 two-choice context toggle with an ID-based Story Coach selector.

## User / Business Value

- Chapter 2 currently supports one experience.
- This implementation expands Chapter 2 into multiple stable career experiences.
- Story Coach can select any saved experience as context.
- This is the enabling foundation for the later Chapter 4 Story Map.

## Acceptance Criteria

* [ ] Chapter 2 replaces the single saved experience object with an ordered saved collection plus separate draft, baseline, active-entry, and most-recently-saved state.
* [ ] An existing saved Chapter 2 record is preserved as the first collection item with its existing stable ID.
* [ ] Before the first save, Chapter 2 keeps the current guided first-entry form.
* [ ] The first successful save unlocks Chapter 3.
* [ ] After the first save, Chapter 2 shows a small factual experience count, compact saved cards, `Edit` on each card, and `Add another experience`.
* [ ] Only one Chapter 2 add or edit draft is active at a time.
* [ ] Saved Chapter 2 records are not mutated until Save.
* [ ] Chapter 2 cancel discards only the active draft and preserves saved records.
* [ ] Role or season remains required; company, start year, end year, and reflection remain optional.
* [ ] Duplicate-looking experiences are allowed.
* [ ] Editing preserves stable experience IDs.
* [ ] Each experience keeps its own reflection.
* [ ] Chapter 2 experience cards use one chronological display helper:
  * prefer start year
  * use end year when start year is absent
  * most recent dated entries first
  * ties preserve original entry order
  * undated entries follow dated entries and preserve original entry order
* [ ] The same chronological helper is reused for Chapter 2 cards, the Story Coach selector, and later Story Map reuse.
* [ ] Display order never determines active Story Coach context identity.
* [ ] Chapter 2 labels show `Role · Company` when both exist, role only when company is missing, and omit missing dates without invented placeholders.
* [ ] Leaving Chapter 2 with actual unsaved changes requires Save, Discard, or canceling navigation.
* [ ] Merely opening add or edit mode is not dirty.
* [ ] Returning all Chapter 2 fields to baseline clears dirty state.
* [ ] The Story Coach default context for the next new story is the most recently successfully saved experience.
* [ ] That default updates only after successful save, not after opening or canceling an edit.
* [ ] An active Story Coach draft keeps its current context when another Chapter 2 experience is edited.
* [ ] Invalid stored Story Coach defaults fall back safely.
* [ ] The Chapter 3 two-choice toggle is replaced with a compact selector containing all saved Chapter 2 experiences plus `Different experience`.
* [ ] Selector option values use stable experience IDs.
* [ ] Selector labels show role and company when both exist and role only when company is missing.
* [ ] Selecting a different experience updates the opening prompt immediately.
* [ ] `Different experience` uses the generic prompt and saves a blank relationship.
* [ ] The selector is available before new-story discovery begins.
* [ ] The selector locks after initial response entry or coaching begins for a new story.
* [ ] Changing new-story context after lock requires the confirmed existing Start Over flow.
* [ ] Starting over clears the active draft and unlocks the selector.
* [ ] Saving a genuinely new story clears Chapter 3 completion until `I'm Done for Now` is selected again.
* [ ] Saved stories open in read-only view mode with the selector locked.
* [ ] Explicit Edit is required to relink an existing saved story.
* [ ] In Edit mode, the selector remains available throughout the session.
* [ ] Story content and `timelineEntryId` share one edit baseline.
* [ ] Any content or relationship change makes an existing-story edit dirty.
* [ ] Returning both content and relationship to baseline clears dirty state.
* [ ] Save commits content and relationship changes together.
* [ ] Cancel restores both content and relationship.
* [ ] Existing-story edits and relinking preserve Chapter 3 completion.
* [ ] Story IDs remain stable.
* [ ] Linked labels continue to derive from current Chapter 2 experience data without copying role or company into story records.

## Out Of Scope

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

* M

## Expected Codex Sessions

2-3

## Expected Review Effort

Medium

## Known Risks

- `src/jobsApplied/controller.js` gains more responsibility.
- Dirty-state protection touches multiple exit paths.
- Completion behavior must distinguish new discovery from correction of an existing story.
- Free-text years require conservative parsing.
- Duplicate visible labels require ID-based correctness instead of label-based assumptions.

## Dependencies

- Existing focused workspace and chapter navigation behavior in `src/jobsApplied/controller.js`
- Existing Chapter 3 saved-story view and edit flow
- Existing VM-based regression harness in `tests/careerJourneyStateTransitions.test.js`

## Assumptions

- The approved repository grounding remains valid for the current codebase.
- Controller-local, session-only state remains the correct implementation boundary for this slice.
- No ADR is required if the implementation stays within the existing Career Journey controller boundary.

## Relevant Product Or Design Principles

- Principle: Career Journey is the guided experience layer and Career Brain is the durable source of truth.
  - How it applies: this slice stays controller-local and session-only.
  - Required behavior or presentation: do not add persistence or Career Vault coupling.
  - Failure mode to avoid: silently turning the slice into a persistence or data-model migration project.
  - Verification method: file changes stay inside the approved Career Journey boundary and durable docs.
- Principle: The product should feel interview-first rather than form-first.
  - How it applies: preserve the guided first-entry form and keep Story Coach context selection compact.
  - Required behavior or presentation: first entry still feels guided, and later multi-experience controls stay secondary to discovery.
  - Failure mode to avoid: replacing the Journey with a generic CRUD manager.
  - Verification method: guided browser checks for first-entry flow, card readability, selector usability, and prompt continuity.
- Principle: Completion should reflect user intent, not just the first successful transaction.
  - How it applies: new-story completion resets, but existing-story corrections do not revoke Chapter 3 completion.
  - Required behavior or presentation: distinguish new discovery from editing or relinking existing saved stories.
  - Failure mode to avoid: clearing completion for corrective edits that should preserve progress.
  - Verification method: automated tests for new-story completion reset and existing-story completion preservation.

## State Transitions

- State: Chapter 2 first-entry draft
  - Trigger: user opens Chapter 2 before any saved experience exists
  - Visible result: current guided first-entry form remains visible
  - Copy and placement: preserve existing Chapter 2 framing and required-field messaging
  - Allowed next action: type, save, leave if not dirty
  - Exit condition: successful first save creates the first saved experience and unlocks Chapter 3
- State: Chapter 2 saved-card view
  - Trigger: at least one Chapter 2 experience has been saved and no add/edit draft is active
  - Visible result: compact saved cards, small factual count, `Edit`, and `Add another experience`
  - Copy and placement: factual count near saved-card surface, no invented placeholders in cards
  - Allowed next action: add another experience, edit an existing experience, leave chapter
  - Exit condition: user opens add or edit mode
- State: Chapter 2 add draft
  - Trigger: user selects `Add another experience`
  - Visible result: one active draft form for a new experience
  - Copy and placement: existing Chapter 2 form shell reused
  - Allowed next action: save, cancel, navigate away through guarded flow
  - Exit condition: save returns to card view; cancel discards active draft only
- State: Chapter 2 edit draft
  - Trigger: user selects `Edit` on a saved experience
  - Visible result: one active draft form seeded from saved baseline
  - Copy and placement: existing Chapter 2 form shell reused
  - Allowed next action: save, cancel, navigate away through guarded flow
  - Exit condition: save commits changes and returns to card view; cancel restores baseline and returns to card view
- State: Chapter 2 dirty draft
  - Trigger: any draft field changes away from baseline
  - Visible result: no special product copy required unless the user attempts to leave
  - Copy and placement: exit-path warning flow only
  - Allowed next action: keep editing, return fields to baseline, save, discard, or cancel navigation
  - Exit condition: save, discard, or full return to baseline
- State: Chapter 3 new-story context selection unlocked
  - Trigger: new story begins before initial response or coaching starts
  - Visible result: compact selector with all saved experiences plus `Different experience`
  - Copy and placement: selector near the story prompt
  - Allowed next action: choose context, begin initial response, start discovery
  - Exit condition: initial response entry or coaching interaction begins
- State: Chapter 3 new-story context locked
  - Trigger: initial response entry or coaching interaction begins
  - Visible result: selector remains locked for the active new-story draft
  - Copy and placement: existing Start Over flow remains the way to change context
  - Allowed next action: continue coaching, start over, save story
  - Exit condition: confirmed Start Over clears the draft and unlocks selector
- State: Chapter 3 saved-story view mode
  - Trigger: user opens an existing saved story
  - Visible result: read-only saved-story view with selector locked
  - Copy and placement: existing saved-story view reused
  - Allowed next action: return to saved list or enter explicit Edit mode
  - Exit condition: explicit Edit mode
- State: Chapter 3 saved-story edit mode
  - Trigger: user explicitly edits an existing saved story
  - Visible result: editable story content plus available selector for relinking
  - Copy and placement: existing Chapter 3 editing flow reused
  - Allowed next action: change content, change relationship, save, cancel
  - Exit condition: save commits both together or cancel restores both

## Copy Requirements

- Preserve the existing Chapter 1 supportive incomplete-state message unchanged.
- Preserve existing Chapter 2 required-field messaging for missing role or career season unless implementation evidence requires a repository-grounded wording adjustment.
- `Different experience` must appear as an explicit selector option label.
- `I'm Done for Now` remains the Chapter 3 completion action label.
- New exit warnings for Chapter 2 dirty-state protection must distinguish:
  - Save
  - Discard
  - Cancel navigation

## Editable Saved Content Behavior

- Chapter 2 saved experiences:
  - save -> edit -> change -> resave keeps the same stable ID and updates only the targeted experience on Save
  - save -> edit -> clear back to baseline -> resave clears dirty state before save requirements apply
  - save -> edit -> cancel restores the original saved record and discards only the active draft
- Chapter 3 saved stories:
  - save -> view -> edit -> change content -> save commits content and preserves story ID
  - save -> view -> edit -> change relationship only -> save commits relationship and preserves completion
  - save -> view -> edit -> change content and relationship -> cancel restores both to baseline
  - save -> view -> edit -> return all fields and relationship to baseline clears dirty state

## Files Likely Affected

- `src/jobsApplied/controller.js`
- `src/styles.css`
- `tests/careerJourneyStateTransitions.test.js`
- `docs/01-features/career-journey.md`
- `docs/04-delivery/2026-07-20-multiple-career-journey-experiences-story-coach-context-implementation-package.md`

## Repository Grounding Findings

- Repository review status: Complete
- Confirmed files and modules affected:
  - `src/jobsApplied/controller.js` currently owns Chapter 2 state, Chapter 3 state, focused-workspace behavior, saved-story rendering, and action binding.
  - `tests/careerJourneyStateTransitions.test.js` is the main regression harness for current Journey behavior.
  - `src/styles.css` is the likely styling touch point for new Chapter 2 card and selector states.
- Existing patterns to reuse:
  - controller-local mutable Journey state
  - current saved-moment view/edit flow
  - current `Start Over` confirmation path
  - current VM-based regression harness
- Architecture or dependency findings:
  - Chapter 2 currently stores one saved experience object, so a collection migration is required.
  - Chapter 3 currently uses a two-choice context toggle, so selector behavior is new UI within the same controller boundary.
  - App-wide routing and persistence are not required for this slice.
- Existing automated tests:
  - `node tests/careerJourneyStateTransitions.test.js`
  - `node tests/storyCoach.test.js`
  - `node tests/careerVaultRoleEditing.test.js`
- Missing regression coverage:
  - Chapter 2 collection migration and sorting
  - Chapter 2 dirty-state blocking and cancel flows
  - Story Coach multi-experience selector and default-context behavior
  - completion distinction between new stories and existing-story edits
- Incorrect or unsupported assumptions:
  - current Chapter 2 does not already support multiple experiences
  - current completion behavior for saved-story edit does not preserve completion and must change
- Remaining unknowns:
  - exact final warning copy for Chapter 2 dirty exits
  - whether narrow-width layout needs selector-specific style adjustments
- Scope or approach changes caused by the review:
  - the package now requires explicit Chapter 2 draft baseline state
  - the package now requires explicit existing-story completion preservation because current behavior differs

## Product Direction Impact

* Aligned
* Relevant principle or objective: Career Journey should remain calm, interview-first, and story-building before output-building.
* Proposed change, if any: none
* Reason and supporting evidence: multi-experience context strengthens story discovery without widening into persistence, routing, or broad redesign
* Captain approval required before updating product direction: no

## Documentation Updates Required

- Create this implementation package in `docs/04-delivery/`
- Update `docs/01-features/career-journey.md` to reflect:
  - multiple Chapter 2 experiences
  - chronological card presentation
  - Story Coach selector behavior
  - stable relationship model
  - completion behavior for new stories versus existing-story edits

## Execution and Traceability

* GitHub Issue: do not create yet
* Implementation branch: do not create yet
* Pull Request: do not create yet
* Merge: not started
* Blocking downstream dependencies, if any: this package is the durable foundation for the later Chapter 4 Story Map implementation

## Codex Repository Review Prompt

Inspect the repository without modifying files.

Confirm:
- likely files and modules affected
- existing implementation patterns to reuse
- architecture or dependency concerns
- relevant automated tests
- missing regression coverage
- whether the proposed scope is realistically implementable
- assumptions in this package that are incorrect, unsupported, or unverified

Report confirmed repository evidence separately from inference.

Do not edit files, create commits, or begin implementation.

## Codex Implementation Handoff Notes

* Approved package reference: `docs/04-delivery/2026-07-20-multiple-career-journey-experiences-story-coach-context-implementation-package.md`
* Constraints that must remain visible during implementation:
  - documentation-only step is complete before coding begins
  - no persistence, routing, Career Vault, or AI contract expansion
  - preserve stable IDs and session-local Journey boundary
  - preserve completion for existing-story correction while resetting completion for genuinely new stories
* Verification categories that must be reported separately:
  - automated tests
  - manual browser testing
  - regressions preserved

## QA Checklist

* [ ] Automated coverage proves migration from one experience to a collection.
* [ ] Automated coverage proves first-save Chapter 3 unlock, stable IDs, independent reflections, chronological ordering, and duplicate-allowed behavior.
* [ ] Automated coverage proves Chapter 2 dirty-state, restored-to-baseline clearing, and navigation blocking behavior.
* [ ] Automated coverage proves last-touched updates only after successful save and preservation of an active Story Coach draft.
* [ ] Automated coverage proves selector population, chronological ordering, ID-based selection, labels, `Different experience`, prompt updates, selector locking, and Start Over behavior.
* [ ] Automated coverage proves saved-story view locking, Edit-mode relinking, relationship-only dirty state, combined edits, cancel restoration, existing-story completion preservation, new-story completion reset, and linked-label updates.
* [ ] Career Journey, Story Coach, and Career Vault regression suites pass.
* [ ] Manual browser testing covers first-entry form, saved-card transition, multi-card readability, long reflections, missing fields, duplicate labels, add/edit flows, navigation warnings, selector usability, prompt continuity, selector locking, Start Over, saved-story view/edit behavior, relationship-only editing, completion presentation, voice behavior, and desktop plus narrow-width layout.

## Definition Of Done

* [ ] The approved Chapter 2 collection state model is implemented inside the existing controller-local, session-only Journey boundary.
* [ ] Existing single-record Chapter 2 data migrates safely into the new collection model with stable ID preservation.
* [ ] Story Coach context selection works across all saved experiences plus `Different experience` using stable IDs.
* [ ] New-story and existing-story completion behavior matches the approved distinction.
* [ ] Relevant automated tests pass.
* [ ] Guided manual browser verification passes.
* [ ] Durable docs remain aligned with shipped product behavior.

## Pre-Implementation Review
* Repository grounding complete: Yes

### Product Owner

* Pass
* Notes: user value, Story Map foundation, and product boundaries are explicit.

### Architect

* Pass
* Notes: collection migration and selector behavior stay inside the current controller boundary without requiring routing, persistence, or Career Vault coupling.

### Engineering Manager

* Pass
* Notes: scope remains one coherent implementation with medium complexity and 2-3 expected Codex sessions.

### Software Engineer

* Pass
* Notes: the package names the concrete state-model additions, helper needs, dirty-state behavior, and completion distinctions required for an implementation-ready handoff.

### Implementation Engineer

* Pass
* Notes: file-level targets, constraints, and verification categories are specific enough for Codex to execute without relying on chat history.

### QA

* Pass
* Notes: automated and manual coverage expectations are explicit across migration, sorting, dirty-state, selector behavior, completion behavior, and regressions.

### Delivery Coach

* Pass
* Notes: the package is durable, repository-grounded, and stops before GitHub Issue creation or implementation work.

### Review Summary

* Agreements: one coherent implementation package, controller-local scope, stable-ID relationship model, explicit dirty-state protection, and completion distinction between new discovery and existing-story correction
* Disagreements: none preserved as material
* Tradeoffs: slightly more controller complexity in exchange for a bounded implementation that unlocks later Story Map work without widening scope
* Unresolved assumptions: exact exit-warning copy and any narrow-width selector polish remain implementation-time details unless repository evidence forces a product decision
* Confidence: high
* Captain decisions needed: none
* Ready / not ready: ready
* Next artifact: GitHub Issue finalization

## Parking Lot Items

- Chapter 4 UI
- experience deletion
- manual reordering
- duplicate warnings or merge behavior
- persistence beyond the existing controller-local model
- Career Vault integration
- AI contract changes
- story deletion
- tags, search, and filters
- new routing
- broad controller refactor
- broad Career Journey redesign

## Captain Approval

* Approved
