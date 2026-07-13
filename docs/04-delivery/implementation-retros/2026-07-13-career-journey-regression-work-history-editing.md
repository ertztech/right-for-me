# July 13 2026 Implementation Cycle Retro

## Cycle Summary

- Cycle date: July 13, 2026
- Cycle theme: stabilize current Career Journey behavior and strengthen durable Work History records
- Cycle result: two implementations completed, one planned item removed after refinement, no blocked or deferred items

## Cycle Goal and Outcome

- Goal: protect approved Career Journey behavior with regression coverage, then strengthen Work History durability and editing so future features do not depend on array position.
- Outcome: the cycle completed both shipped implementations and removed the Career Journey -> Professional Experience transfer after refinement clarified that the two areas serve separate product purposes.

## Completed Implementations

1. Career Journey regression coverage
2. Stable IDs and saved-role editing for Work History

Removed item:

- Career Journey -> Professional Experience transfer

Reason removed:

- Refinement confirmed that Career Journey and Professional Experience serve separate product purposes.

## What Went Well

- The cycle stayed focused on concrete product value instead of filling time for its own sake.
- Career Journey regression coverage landed as a small, bounded implementation with no production-code change.
- Stable IDs were added before more features depend on Work History identity.
- Manual smoke testing caught meaningful product and UX gaps that automated checks alone did not surface.
- The team made an explicit product-boundary decision instead of drifting into a cross-workspace integration.
- The overall pace was healthy even though the cycle completed quickly.

## What Caused Friction

- Existing behavior initially risked being treated as approved product behavior without enough product review.
- Manual smoke testing exposed a missing visible validation message after the initial Work History editing implementation.
- The original Work History validation rule inherited an add-at-least-one-field assumption that no longer fit the durable resume-focused product intent.
- A named workflow was not run before downstream artifact work began.
- The Career Journey -> Professional Experience discussion briefly mixed product-boundary refinement with implementation planning.

## Rework Summary

| Implementation | Rework count | Rework summary | Rework category |
| --- | --- | --- | --- |
| Career Journey regression coverage | 0 | No implementation rework was needed after the primary test addition. | None |
| Stable IDs and saved-role editing for Work History | 2 | One correction restored visible validation feedback during invalid edit submission. One correction updated the product rule so both Company and Title are required for add and edit. | UX validation feedback, product-rule clarification |

## Implementation Size Evidence

### Career Journey regression coverage

- Estimated size: S
- One focused test file
- No production-code change
- One Codex session
- No rework
- Light review and manual smoke testing
- Use as the provisional Small reference implementation

### Stable IDs and Work History editing

- Estimated size: M
- Production, UI, storage, test, demo-data, and documentation changes
- Approximately ten files touched
- One primary Codex implementation session
- Two focused correction passes from manual smoke testing
- Moderate review
- Use as the provisional Medium reference implementation

## Provisional XS / S / M / L / XL Baseline

All size definitions below are provisional.

### XS

A very narrow correction or documentation-only change with one localized outcome, minimal testing, and very light review.

### S

One bounded behavior with low uncertainty, existing patterns, limited state changes, one Codex session, and light review.

### M

One complete feature slice with several connected behaviors, multiple layers or modules, moderate review, and possibly one or two focused correction passes.

### L

A broader feature with several outcomes, meaningful architectural uncertainty, cross-workspace impact, or a strong need to split.

### XL

Too large or uncertain for one Implementation Package and must be refined and divided before handoff.

The team should collect evidence for the next five to eight implementations, including:

- Estimated size
- Codex sessions
- Files changed
- Production versus test and documentation surface
- Review effort
- Rework count
- Rework category
- Whether the original estimate felt correct

## Directional Decisions Carried Forward

1. Career Journey and Professional Experience remain separate product concepts.
2. Professional Experience is durable resume and application data.
3. Career Journey is guided reflection and discovery.
4. Durable records should receive stable identity before additional features depend on them.
5. Small architectural improvements are worthwhile when they clearly reduce total future implementation load.
6. Array position is not durable identity.
7. Existing behavior must be evaluated as intentional product behavior rather than automatically preserved.
8. Manual smoke testing is both verification and product discovery.
9. The facilitator must keep team discussion centered on the current decision.
10. Named workflows must be run before producing their downstream artifacts.
11. A successful one-day cycle is measured by completed value and sound review, not by filling the entire available day.

## Process Improvement Backlog

| Proposal | Problem observed | Desired improvement | Status |
| --- | --- | --- | --- |
| Run named workflows before downstream artifact creation | A named workflow was skipped before downstream work began. | Treat workflow invocation as required evidence, not optional context. | Backlog |
| Keep product-boundary refinement separate from implementation planning | Cross-workspace integration planning began before the product boundary was settled. | Confirm product boundary first, then decide whether implementation planning should proceed. | Backlog |
| Preserve visible manual smoke-check findings in implementation reports | Manual smoke testing found issues that were easy to treat as follow-up detail instead of acceptance evidence. | Keep manual findings explicit in final reports and retro artifacts. | Backlog |

## Technical Parking Lot

| Item | Reason parked | Recommended next step |
| --- | --- | --- |
| Career Journey -> Professional Experience transfer | Refinement showed the product boundary was not yet settled for a transfer feature. | Revisit only after a future product decision explicitly defines the relationship and handoff behavior. |
| Additional durable-record improvements beyond stable IDs | Stable IDs solved the immediate identity need, but other future improvements may emerge once more features depend on Work History. | Reassess after several more durable-data features provide better evidence about the next highest-leverage improvement. |

## Final Cycle Status

- Completed: Career Journey regression coverage
- Completed: Stable IDs and saved-role editing for Work History
- Removed: Career Journey -> Professional Experience transfer
- Blocked: None
- Deferred: None
- Retro completed: Yes
- Cycle recommendation: Close

## Close Recommendation

- Close the cycle.
- Use the Career Journey regression work as the provisional Small reference implementation.
- Use the stable-ID and Work History editing work as the provisional Medium reference implementation.
- Carry the explicit product-boundary decision forward before any future Career Journey -> Professional Experience implementation planning begins.
