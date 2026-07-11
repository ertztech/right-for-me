# Reference Example: Backlog Refinement

## Story title

Career Journey Chapter 3 Evidence Prompt v1

## User problem

After the first two Career Journey steps, users still need help surfacing proof and examples they can reuse later. Without a focused evidence prompt, the experience risks feeling reflective but not actionable.

## Target user

Job seekers who have meaningful experience but need help turning it into reusable evidence.

## Proposed outcome

Add one lightweight Chapter 3 prompt that helps users name one proof point or outcome from their work without building the full evidence workflow.

## Acceptance criteria

- Chapter 3 is presented as a lightweight prompt, not a full evidence system
- The interaction keeps state local and in-memory only
- The prompt helps the user capture one proof point or outcome
- The response can be submitted without breaking the page
- No persistence, AI, or Career Brain structure is introduced

## Out of scope

- Evidence library
- Persistence
- AI follow-up questions
- Multi-entry experience capture
- Career Brain schema work

## Risks

- The prompt may overlap too much with later Career Brain modeling if the wording gets too data-shaped.
- The slice may feel thin if it does not clearly connect to the broader journey.

## Dependencies

- Chapter 2 preview direction should stay stable enough that Chapter 3 does not leapfrog the story sequence.

## Implementation complexity estimate

S

## Expected Codex sessions

1

## Confidence

Medium. The slice is small, but chapter sequencing needs to stay intentional.

## Files likely affected

- `src/jobsApplied/controller.js`
- `src/styles.css`

## Agreements

- The slice should stay prompt-only.
- No persistence or schema work belongs here.
- The copy needs to keep the tone calm and non-judgmental.

## Disagreements

- Architect questioned whether Chapter 3 should wait until Chapter 2 becomes active.
- Product Owner argued that a small evidence prompt could still be refined now if it stays clearly future-facing.
- Result: not ready yet, because the team wants Chapter 2 interaction shape clarified first.

## Assumptions

- Chapter sequencing matters more than shipping every small prompt as soon as possible.

## Decision-required items

- Founder confirm whether to keep strict chapter order or allow selective chapter refinement ahead of active implementation.

## Ready / not ready call

Not ready

## Recommended next step

Refine the first active Chapter 2 interaction before reopening Chapter 3.

## Implementation package gaps

- Final Chapter 3 prompt wording
- How the prompt should connect back to prior chapter responses
- Confirmation that chapter ordering will not be loosened
