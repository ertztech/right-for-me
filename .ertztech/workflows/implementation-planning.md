# Implementation Planning Workflow

Purpose:
Turn approved, refined work into a small implementation package that Codex can execute with minimal rework.

Status:
Preferred workflow for the founder + ChatGPT + Codex delivery flow.

Referenced roles:
- ../agents/facilitator-orchestrator.md
- ../agents/product-owner.md
- ../agents/architect.md
- ../agents/engineering-manager.md
- ../agents/software-engineer.md
- ../agents/implementation-engineer.md
- ../agents/qa.md
- ../agents/delivery-coach.md
- ../workflows/implementation-package.md
- ../workflows/trello-proposal.md
- ../product-direction.md

When to use:
- The work is approved in principle.
- Backlog refinement reduced the main uncertainty.
- The founder wants a Codex-ready handoff, not another abstract planning pass.

Session Control:
- Session type
- Workflow source
- Support docs
- Expected output
- Current step
- Decisions needed
- Parking lot
- Docs/backlog impacted

Process:
1. Facilitator makes the current workflow step visible and confirms the session stays inside implementation planning.
2. Facilitator confirms the work belongs in implementation planning.
3. Product Owner drafts the implementation package and confirms the relevant repo docs.
4. Architect checks technical approach, boundaries, reuse risks, and whether an ADR is needed.
5. Engineering Manager checks sequencing, package size, reviewability, and whether the work is truly near-term.
6. Software Engineer checks implementation approach, file/module boundaries, maintainability, and testability.
7. Implementation Engineer pressure-tests the Codex handoff, file-level clarity, and whether Codex can work without chat history.
8. QA validates acceptance criteria, failure paths, definition of done, and the test checklist.
9. Delivery Coach estimates implementation complexity, expected sessions, and likely review effort.
10. Facilitator runs a Documentation and Traceability checkpoint.
11. Facilitator walks the team through the Pre-Implementation Review section inside the Implementation Package.
12. Facilitator summarizes agreements, disagreements, tradeoffs, assumptions, confidence, founder decisions, parking lot items, and decision-required items.
13. Human approves, adjusts, or rejects the package.
14. Only after package approval are the GitHub Issue and Codex prompt finalized.

Rules:
- Prefer one clean implementation package over broad planning output.
- Keep implementation complexity honest. Split `XL` work before handoff.
- Produce Codex prompts only for approved work.
- Keep Trello content in proposal form until explicit human approval.
- Call out missing details instead of letting Codex guess.
- GitHub Issues are for near-term, implementation-ready work only.
- Do not create a GitHub Issue until the implementation package is approved.
- Do not finalize the GitHub Issue or Codex prompt until the Pre-Implementation Review section is approved.
- Update repo docs and backlog references before implementation begins.

Documentation and Traceability Checkpoint:
- Confirm which product, feature, architecture, and backlog docs must be updated.
- Confirm the implementation package names those documentation updates explicitly.
- Confirm founder decisions are written down, not implied.
- Confirm `.ertztech/workflows` remains the operational layer and human-readable docs stay aligned.

Pre-Implementation Review:
- The review lives inside the Implementation Package, not as a separate artifact.
- The facilitator walks the team through the role-based review section after the package is drafted.
- Use the review to confirm product fit, architecture fit, implementation size, workflow readiness, and testability.
- Only approved packages should move on to GitHub Issue finalization and Codex handoff.

Required Output:
1. Implementation package
2. Completed Pre-Implementation Review section
3. Documentation updates required
4. Agreements
5. Disagreements
6. Tradeoffs
7. Assumptions
8. Confidence
9. Founder decisions
10. Decision-required items
11. Parking lot items
12. Approved next step
