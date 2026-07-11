# Career Journey Chapter 2 Timeline MVP Retro

## Cycle Outcome

- Cycle outcome: Career Journey Chapter 2 Timeline MVP completed and merged.
- Implementations completed: 1
- Carryover theme: Career Journey -> Professional Experience connection carried forward.

## Implementations Completed

- Career Journey Chapter 2 Timeline MVP

## Decisions Made

### Decision Log

| Decision | Context and evidence | Reasoning | Impact | Affected workflow or product principle | Follow-up action | Backlog status |
| --- | --- | --- | --- | --- | --- | --- |
| Reasoned verification cannot satisfy manual acceptance criteria. | Several implementation reports relied on reasoned verification while browser behavior remained incorrect. Automated checks passed while live behavior was still wrong. | Manual acceptance criteria require direct evidence from the running experience, not code-path confidence. | Review language and implementation reports must separate observed behavior from inferred behavior. | Implementation Review, QA role, Facilitator role | Update workflow and role guidance. | Completed as a documentation improvement |
| Multi-state UI work requires state-transition definitions. | Status indicators, confirmation states, and chapter availability drifted because acceptance criteria did not fully define transitions. | State-heavy interfaces need explicit trigger and exit behavior to reduce hidden gaps. | Planning packages must describe state changes before implementation. | Implementation Planning, Implementation Package | Add a reusable state-transition section requirement. | Completed as a documentation improvement |
| Copy requirements must include trigger and placement. | Approved supportive wording was attached to the wrong state and moved below the textarea instead of remaining inside the textarea experience. | Copy behavior was underspecified, so implementation drifted even when wording was known. | Future planning must define when copy appears, where it appears, and when it disappears. | Product direction principles, Implementation Planning, Implementation Review | Add copy-trigger and placement checks. | Completed as a documentation improvement |
| Editable saved content must consider clear-and-resave behavior. | Clearing a saved reflection restored stale text and left Chapter 2 available. | Save-edit-clear-resave is a real state path, not an optional edge case. | Editable content requirements must cover clearing behavior explicitly. | Implementation Package, QA role, Implementation Review | Add editable clear behavior checks. | Completed as a documentation improvement |
| Relevant product principles must be reviewed in planning and review. | Product principles existed as context, but were not consistently turned into implementation or review checks. | Background principles are easy to miss unless they become explicit acceptance and review inputs. | Planning and review now need principle-specific checks when relevant. | Product direction, Implementation Planning, Implementation Review | Add principle review sections. | Completed as a documentation improvement |
| Retro decisions must be saved outside chat. | Important lessons emerged through implementation and review, but would be easy to lose without a repo artifact. | Durable process learning must survive chat boundaries. | Cycle closure now requires a saved retro record. | Implementation Retro, Facilitator role | Save retro records in the repository. | Completed as a documentation improvement |
| Retro improvements must become traceable backlog proposals with dispositions. | Several valid improvements emerged, but not all should become commitments immediately. | The team needs traceability without converting every lesson into committed work. | Retro outputs now distinguish proposals, dispositions, and later prioritization. | Implementation Retro, Parking Lot Review, Backlog Review | Route proposals through backlog workflows. | Completed as a documentation improvement |

## Problems Observed

- Status indicators remained on Chapter 1 after Chapter 2 began.
- Blank Chapter 1 submission incorrectly advanced to Chapter 2.
- Approved supportive wording was attached to the wrong state.
- The wording was moved below the textarea instead of remaining inside the textarea experience.
- Chapter 1 content was duplicated after submission.
- Chapter 1 and Chapter 2 state appeared coupled or leaked during rendering.
- Clearing a saved reflection restored stale text.
- Several implementation reports relied on reasoned verification.
- Automated checks passed while browser behavior remained incorrect.

## Evidence

- Running-browser review showed Chapter 1 and Chapter 2 state mismatches that were not visible from automated checks alone.
- Manual review found wording placement drift and duplicated Chapter 1 content after submission.
- Clearing an edited reflection in the browser restored stale text until the state-reset behavior was fixed.
- Acceptance criteria appeared satisfied in code summaries before the relevant browser paths were actually performed.

## Root Causes

- Copy requirements lacked precise state and placement.
- State-transition acceptance criteria were incomplete.
- Editable content did not initially include clear-and-resave behavior.
- Duplicate or unclear render paths increased state risk.
- Product principles were treated as background context instead of explicit checks.
- Implementation summaries were accepted too readily.
- Actual browser testing was the decisive evidence.

## Product And Design-Principle Lessons

- Product principles need to become explicit planning and review checks when they materially affect behavior or presentation.
- Copy that depends on user state needs exact wording, trigger, placement, and disappearance rules.
- Product feel, placement, and state transitions are not fully covered by passing automated checks.
- Calm, supportive language can still fail the product intent when it is attached to the wrong state.

## Operating-Model Improvements

- Require verification evidence to distinguish automated checks, running-browser checks, reasoned checks, and unverified behavior.
- Require manual acceptance criteria to be observed directly when they concern interaction or visible behavior.
- Require state-transition definitions for interaction-heavy or multi-state UI work.
- Require editable saved-content flows to include save -> edit -> change -> resave and save -> edit -> clear -> resave.
- Require retro decisions and proposals to be saved in a durable repository record.

## Backlog Proposals

| Title | Problem observed | Evidence | Desired improvement | Recommended priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Add focused automated tests for Career Journey state transitions | UI regressions escaped because state behavior was only partially covered. | Browser review caught mismatched chapter status and stale clear behavior after automated checks passed. | Add targeted automated coverage for key Career Journey state transitions. | High | Technical debt backlog | Promote to next Parking Lot Review |
| Add a reusable copy trigger and placement section to implementation packages | Approved wording drifted across state and placement. | Supportive wording was attached to the wrong state and moved below the textarea. | Add a standard package section for exact wording, trigger, placement, and disappearance rules. | Medium | Process improvements backlog | Completed as a documentation improvement |
| Add product-principle compliance checks to planning and review | Principles were present but not enforced in planning and review artifacts. | Product-principle lessons emerged only after live review. | Make principle compliance visible in planning and review when relevant. | Medium | Process improvements backlog | Completed as a documentation improvement |
| Require explicit browser-verification evidence in Codex reports | Reports blended direct verification with reasoning. | Several summaries described behavior as verified before it was observed in the running browser. | Require implementation reports to classify evidence explicitly. | High | Process improvements backlog | Completed as a documentation improvement |
| Consider a contained Career Journey state/render helper before Chapter 3 | State and render behavior drifted across Chapter 1 and Chapter 2 interactions. | Duplicate or unclear render paths increased state risk during the cycle. | Evaluate a contained helper before deeper chapter complexity is added. | Medium | Technical debt backlog | Keep parked |
| Refine the Career Journey -> Professional Experience connection | The next product handoff between guided journey work and durable experience data remains open. | The connection was identified as important but not resolved in this cycle. | Clarify the handoff before further Career Journey depth work. | Medium | Parking lot / feature planning | Promote to next Parking Lot Review |

## Carryover Items And Dispositions

| Carryover item | Disposition |
| --- | --- |
| Career Journey -> Professional Experience connection | Promote to next Parking Lot Review for explicit follow-up planning. |

## Next Recommended Action

- Run the next Parking Lot Review with the promoted proposals visible, especially the Professional Experience connection and Career Journey state-transition test coverage.
