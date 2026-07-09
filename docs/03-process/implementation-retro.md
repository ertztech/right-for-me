# Implementation Retro

## Purpose

Implementation Retro happens after a pull request is merged. Its job is to turn real delivery experience into better planning, better workflows, and cleaner backlog decisions for the next cycle.

## Review Vs Retro

- Implementation Review happens before merge and decides whether the pull request is ready, needs changes, or should create follow-up items.
- Implementation Retro happens after merge and focuses on what the team learned from the full implementation cycle.

## When To Run It

Run the retro after a merged pull request when the implementation is fresh enough to remember where friction happened and what actually worked.

## Who Participates

- Product Owner
- Architect
- Engineering Manager
- Software Engineer
- QA
- Delivery Coach / Facilitator
- Founder when decisions or prioritization tradeoffs need direct judgment

## Inputs

- Implementation Package
- GitHub Issue or PR description
- Codex results
- Implementation Review notes
- test results
- merge outcome

## Where Outputs Go

- Process improvements: `docs/04-backlog/process-improvements.md`
- Technical debt: `docs/04-backlog/technical-debt.md`
- Parking lot: `docs/04-backlog/parking-lot.md`
- Feature backlog updates: `docs/04-backlog/features.md`

## Example Retro Output

```md
## What Went Well

- The Implementation Package gave Codex enough context to stay in scope.

## Friction

- A stale test expectation created noise during validation.

## Process Improvements

- Add a stronger review handoff note for known unrelated failing tests.

## Technical Debt

- Fix stale Application Studio packet test expectation.

## Parking Lot

- Revisit workspace controller boundaries if more workspaces are added.

## Next Recommended Action

- Prepare a small issue for the stale test expectation before the next workspace slice.
```
