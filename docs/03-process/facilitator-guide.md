# Facilitator Guide

## Purpose

Help planning and review sessions stay structured, implementation-aware, and grounded in repo docs instead of drifting into undocumented chat decisions.

## Facilitator Responsibilities

- keep the session aligned to the current workflow stage
- keep the session inside the selected workflow
- route unclear ideas to backlog instead of premature implementation
- redirect the team when it jumps ahead of the current workflow step
- point people to the correct documentation, backlog, or workflow location
- surface decisions that need explicit founder judgment
- confirm documentation, architecture, and backlog impacts
- make sure outputs are discoverable and reusable without chat history
- walk the team through the Pre-Implementation Review section inside the Implementation Package before Codex starts
- protect the Definition of Ready before Codex handoff

## What The Facilitator Does Not Do

- invent product decisions on behalf of the founder
- let implementation start before scope and decision quality are clear
- use GitHub Issues as a general backlog
- treat GitHub Projects as part of the current system
- allow useful side ideas to derail the current issue
- run a separate loose artifact for Pre-Implementation Review

## Implementation Planning Navigation

1. Confirm the work belongs in implementation planning, not discovery.
2. Open the relevant product, feature, architecture, and backlog docs.
3. Identify the problem, scope, out-of-scope edges, and founder decisions.
4. Check whether architecture notes or an ADR are needed.
5. Run the Documentation and Traceability checkpoint.
6. Draft the Implementation Package.
7. Walk the team through the Pre-Implementation Review section inside the package.
8. Create a GitHub Issue only if the package is approved and near-term ready.

Definition of Ready for Codex handoff means the selected workflow has been followed, the Implementation Package is complete, the Pre-Implementation Review is approved, and Codex is not being asked to resolve unfinished product or architecture decisions.

## Implementation Review Navigation

1. Compare what shipped against the package and issue.
2. Record what changed during implementation.
3. Identify rework causes and whether planning quality was the root issue.
4. Decide whether backlog, architecture docs, or process docs need updates.
5. Capture workflow improvements in the repo backlog.

## Where Things Live

- Product direction: `docs/00-product`
- Feature specs: `docs/01-features`
- Architecture and ADRs: `docs/02-architecture`
- Human-readable process layer: `docs/03-process`
- Repo backlog: `docs/04-backlog`
- Operational workflows: `.ertztech/workflows`
- Tactical implementation work: GitHub Issues

## Redirect Prompts

- "This sounds important, but it is not implementation-ready yet. Should it go to the backlog?"
- "We are jumping into code before the product decision is clear."
- "This changes architecture. Should we capture an ADR?"
- "This is useful, but outside the current issue. Should it go to parking lot?"
- "Before we create a GitHub issue, which docs need to be updated?"
- "Can Codex implement this without reading chat history?"
- "Let's complete the Pre-Implementation Review section of the Implementation Package before Codex starts."
- "Can every role approve their section, or does the package need revision?"
- "Are we ready to finalize the GitHub Issue, or is this still planning?"
- "Can Codex complete this without making product or architecture decisions?"

## Session Outcome Standard

If the session ends without a clear doc update, backlog update, Implementation Package, completed Pre-Implementation Review section, review note, or issue decision, the output is probably not durable enough yet.
