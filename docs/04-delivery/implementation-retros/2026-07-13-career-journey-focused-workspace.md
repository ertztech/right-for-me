# Career Journey Focused Workspace Implementation Retro

Date: 2026-07-13

## Cycle Summary

The cycle delivered a shared focused workspace for Career Journey Chapters 1, 2, and 3.

The implementation separates the lighter Career Journey overview from active chapter work. Journey orientation remains available in a left-side rail, while the current chapter receives the larger primary workspace.

## Cycle Goal

Create a coherent focused Career Journey workspace that allows users to work through Chapters 1, 2, and 3 without the Chapter Map and surrounding overview competing with the active reflection experience.

## Outcome

Status: Complete

The cycle goal was achieved.

The implementation:

- Added a shared focused workspace for Chapters 1, 2, and 3.
- Preserved the existing chapter renderers and state model.
- Made `Start Journey` and `Continue Journey` open the focused workspace.
- Added compact `View journey` navigation.
- Added `Back to Overview`.
- Preserved unsaved chapter drafts while journey navigation opens and closes.
- Preserved Chapter 3 voice, multi-moment, editing, context, and completion behavior.
- Improved the Chapter 3 contextual prompt wording.
- Improved Journey navigation contrast.
- Aligned the overview and focused workspace around the same left-rail and right-content layout.
- Updated feature, product-status, testing, and implementation-package documentation.

## Verification

Automated verification:

- Career Journey state transitions: PASS
- Story Coach regression tests: PASS

Guided browser verification:

- `Start Journey`: PASS
- `Continue Journey`: PASS
- `View journey`: PASS
- `Back to Overview`: PASS
- Chapter 1 draft preservation: PASS
- Chapter 2 draft preservation: PASS
- Chapter switching: PASS
- Chapter 3 voice behavior: PASS
- Chapter 3 editing and completion: PASS
- Journey navigation contrast: PASS
- Overview and workspace layout consistency: PASS
- Desktop layout: PASS
- Narrow-width layout: PASS
- Horizontal scrolling and overlapping controls: PASS

## What Went Well

### The implementation preserved existing architecture

The focused workspace reused the existing chapter renderers and kept chapter state authoritative.

Only transient workspace state was added for:

- Whether the focused workspace is open.
- Whether Journey navigation is open.
- Which chapter is currently focused.

The implementation avoided:

- Duplicate chapter renderers.
- A second progression model.
- New persistence fields.
- A new routing system.
- Story Coach state-management changes.

### The scope boundary held

Several valid ideas surfaced during testing, but they were not added to the implementation:

- Voice input for Chapter 1.
- New post-save navigation for Chapter 3.
- Chapter 4 behavior.
- Career Journey to Professional Experience integration.
- Narrow-width Open Profile polish.

The stopping rule prevented the implementation from expanding beyond the approved package.

### Guided browser testing found important issues

Automated tests confirmed state behavior, while browser testing found interaction and visual problems.

Browser testing identified:

- A visible Current Chapter `Start Journey` button without a bound click handler.
- Mechanical Chapter 3 context wording.
- Low-contrast Journey navigation text.
- Journey orientation changing sides between the overview and focused workspace.
- An oversized but functional narrow-width `Open Profile` button.

This confirmed that interactive UI work requires automated regression coverage and guided browser testing.

### Explicit PASS/FAIL test reporting worked

Direct PowerShell commands made test outcomes clear and should remain the standard for guided testing sessions.

## What Caused Friction

### Multiple Journey entry points were not initially tested independently

The overview rendered more than one Journey-start action, but the implementation initially bound only the first matching control.

The Current Chapter button appeared correct but did not receive the click handler.

The test harness originally validated a Journey-start action without distinguishing every visible entry point.

### Cross-state layout consistency was under-specified

The implementation package defined the overview and focused workspace but did not explicitly require Journey orientation to remain in the same spatial position across both surfaces.

Browser review revealed that Journey Navigation appeared on the left in the workspace, while Journey Progress moved to the right on the overview.

### Readability requirements were too general

The package required a clear active chapter, but it did not explicitly verify text contrast for:

- Active chapter titles.
- Current chapter labels.
- Upcoming chapter titles.
- Upcoming status labels.

The navigation was present and functional, but initially difficult to read.

### The delivery workflow briefly drifted after implementation

After the feature branch was pushed, guidance shifted toward a generic GitHub CLI process rather than continuing the established NextMove PR, merge, Cycle Status, retro, and close workflow.

The operating workflow should remain visible through the end of the cycle.

## Rework and Lessons

### Current Chapter Start Journey button

Root cause:

The overview rendered multiple Journey-start controls, but the controller only bound the first matching element.

Resolution:

The Current Chapter control received an explicit selector, and both Journey-start entry points now use the same workspace-opening logic.

Durable lesson:

When equivalent actions appear in multiple UI locations, enumerate and test every rendered entry point.

### Chapter 3 context wording

Original pattern:

> Think back to your time as Machine Operator...

Revised pattern:

> Think back to when you worked as a Machine Operator...

Durable lesson:

Generated sentence templates should be tested with realistic roles and organizations so grammar and tone do not feel mechanically assembled.

### Journey navigation contrast

The active and upcoming chapter text initially had insufficient contrast.

Durable lesson:

Browser verification should explicitly check active, inactive, secondary, and status text readability.

### Stable workspace layout

Journey orientation moved between the left and right sides depending on whether the user was in the overview or focused workspace.

Resolution:

Both surfaces now use the same mental model:

- Journey orientation on the left.
- Current or next chapter content on the right.
- Journey orientation stacks before chapter content at narrow widths.

Durable lesson:

Multi-state UI planning should define stable spatial relationships, not only component presence.

## Process Improvements

### Repeated-control checkpoint

When the same action appears in more than one place, implementation planning should identify:

- Every visible instance.
- Whether the controls share behavior.
- How each control is selected and bound.
- A test for each entry point.

### Cross-state layout checkpoint

For interfaces with overview and focused modes, implementation planning should define:

- Stable component positions.
- Desktop column order.
- Narrow-width stacking order.
- Which content changes and which spatial relationships remain constant.

### Readability checkpoint

Guided browser testing should explicitly verify:

- Active text contrast.
- Inactive text contrast.
- Status-label contrast.
- Long-title wrapping.
- Button readability.

### Cycle-close workflow

After an implementation passes:

1. Confirm commit and push.
2. Create and review the pull request.
3. Merge the pull request.
4. Return to and update `main`.
5. Update Cycle Status.
6. Save the implementation retro.
7. Close the cycle.

## Technical Debt

`src/jobsApplied/controller.js` continues to own substantial Career Journey rendering, event binding, transient state, and chapter coordination.

No immediate refactor is recommended.

Revisit possible extraction when:

- Chapter 4 adds another significant state machine.
- Voice input is added across multiple chapters.
- Similar event-binding defects recur.
- Career Journey and Professional Experience require cross-module coordination.
- The DOM test harness becomes significantly more complex.

## Parking Lot Additions

### Chapter 1 voice input

Explore adding voice input to Chapter 1 using the established Chapter 3 interaction pattern.

Questions for refinement:

- Should voice append to or replace existing text?
- Should the transcript appear live?
- Should pause and resume be supported?
- Should voice behavior be shared across multiple chapters?

### Chapter 3 post-save destination

Revisit the destination after `Save This Moment` when Chapter 4 is introduced.

The current behavior is functional, but there is not yet a meaningful next chapter destination.

### Narrow-width Open Profile prominence

Reduce the visual prominence of the full-width `Open Profile` button at narrow widths.

This is non-blocking visual polish.

## Deferred Item

Career Journey to Professional Experience refinement remains deferred for a future Parking Lot Review and Backlog Review.

## Final Cycle Status

- Cycle goal: Achieved
- Completed: Focused Career Journey Workspace
- Current implementation: None
- Blocked: None
- Deferred: Career Journey to Professional Experience refinement
- Parking lot additions:
  - Chapter 1 voice input
  - Chapter 3 post-save destination
  - Narrow-width Open Profile prominence
- Technical debt:
  - Monitor Career Journey responsibility concentration in `controller.js`
- Founder decisions needed: None
- Retro status: Complete
- Close recommendation: Close the cycle