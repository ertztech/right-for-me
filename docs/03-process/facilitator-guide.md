# Facilitator Guide

## Purpose

Help planning and review sessions stay structured, implementation-aware, and grounded in repo docs instead of drifting into undocumented chat decisions.

## Session Control

Use this block at the start of any formal session and update it as the session moves:

```md
Session type:
Workflow source:
Support docs:
Expected output:
Current step:
Decisions needed:
Parking lot:
Docs/backlog impacted:
```

The facilitator should keep the current workflow step visible, redirect drift, identify parking lot items before they sprawl into scope, and make sure decisions become repo artifacts instead of staying trapped in chat.

## Facilitator Responsibilities

- keep the session aligned to the current workflow stage
- keep the session inside the selected workflow
- route unclear ideas to backlog instead of premature implementation
- redirect the team when it jumps ahead of the current workflow step
- point people to the correct documentation, backlog, or workflow location
- surface decisions that need explicit founder judgment
- confirm documentation, architecture, and backlog impacts
- make sure outputs are discoverable and reusable without chat history
- walk the team through the Implementation Package and the Pre-Implementation Review section before Codex starts
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
5. Ask the standard roles to evaluate the work:
   Product Owner, Architect, Engineering Manager, Software Engineer, QA, Delivery Coach / Facilitator, Founder.
6. Run the Documentation and Traceability checkpoint.
7. Draft the Implementation Package.
8. Walk the team through the Pre-Implementation Review section inside the package.
9. Create a GitHub Issue only if the package is approved and near-term ready.

Definition of Ready for Codex handoff means the selected workflow has been followed, the Implementation Package is complete, the Pre-Implementation Review is approved, and Codex is not being asked to resolve unfinished product or architecture decisions.

## Implementation Review Navigation

1. Compare what shipped against the package, issue, and pull request.
2. Record what changed during implementation.
3. Decide whether the pull request is ready, needs changes, or should produce follow-up backlog items.
4. Identify rework causes and whether planning quality was the root issue.
5. Decide whether backlog, architecture docs, or process docs need updates.
6. Hand off to Implementation Retro after merge.

## Implementation Retro Navigation

1. Run the retro after the pull request is merged.
2. Review what went well, what caused friction, and whether Codex had enough context.
3. Separate outputs into process improvements, technical debt, parking lot, and feature backlog updates.
4. Capture the next recommended action so the retro changes future work instead of becoming a dead note.

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
- "What workflow step are we in right now?"
- "Is this a decision we need now, or should it go to the parking lot?"
- "Which repo artifact should capture this decision before we leave the session?"

## Session Outcome Standard

If the session ends without a clear doc update, backlog update, Implementation Package, completed Pre-Implementation Review section, review note, or issue decision, the output is probably not durable enough yet.
