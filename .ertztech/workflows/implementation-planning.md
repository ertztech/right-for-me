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

Process:
1. Facilitator confirms the work belongs in implementation planning.
2. Product Owner assembles the implementation package.
3. Architect checks technical approach, boundaries, and reuse risks.
4. Engineering Manager checks sequencing, package size, and reviewability.
5. Implementation Engineer pressure-tests the Codex handoff and file-level clarity.
6. QA validates acceptance criteria, failure paths, and definition of done.
7. Delivery Coach estimates implementation complexity, expected sessions, and likely review effort.
8. Facilitator summarizes agreements, disagreements, tradeoffs, assumptions, confidence, and decision-required items.
9. Human approves, adjusts, or rejects the package.

Rules:
- Prefer one clean implementation package over broad planning output.
- Keep implementation complexity honest. Split `XL` work before handoff.
- Produce Codex prompts only for approved work.
- Keep Trello content in proposal form until explicit human approval.
- Call out missing details instead of letting Codex guess.

Required Output:
1. Implementation package
2. Agreements
3. Disagreements
4. Tradeoffs
5. Assumptions
6. Confidence
7. Decision-required items
8. Approved next step
