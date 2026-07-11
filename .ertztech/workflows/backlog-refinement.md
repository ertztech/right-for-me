# Backlog Refinement Workflow

Purpose:
Turn rough ideas into decision-ready implementation candidates and identify what is still too unclear to build.

Reference example:
- ../examples/backlog-refinement-example.md

Cycle boundary:
- Within an Implementation Cycle, Backlog Refinement is optional and should run only when selected work is not ready enough for Implementation Planning.

Referenced roles:
- ../agents/facilitator-orchestrator.md
- ../agents/product-owner.md
- ../agents/architect.md
- ../agents/engineering-manager.md
- ../agents/implementation-engineer.md
- ../agents/qa.md
- ../agents/delivery-coach.md
- ../product-direction.md

When to use:
- The idea is still rough.
- The user problem is only partly understood.
- Acceptance criteria are missing or weak.
- Scope, architecture, or sequencing is still debatable.
- The work is not ready to become a Codex implementation prompt.
- The work is not yet ready to become a full implementation package.

Core rule:
Only involve the disciplines needed to reduce real uncertainty.

Process:
1. Facilitator selects the workflow and states the decision to be made.
2. Product Owner clarifies the user problem, intended outcome, and MVP value.
3. Architect reviews technical shape only if the idea affects design, boundaries, or reuse.
4. Engineering Manager checks story split, sequencing, and delivery readiness.
5. Implementation Engineer checks whether Codex would have enough clarity to implement safely.
6. QA identifies acceptance gaps, edge cases, and definition-of-done risks.
7. Delivery Coach estimates implementation complexity only when the work is coherent enough.
8. Product Owner assembles the draft implementation package if the work is ready enough.
9. Facilitator summarizes agreements, disagreements, tradeoffs, assumptions, and decision points.

Rules:
- Do not force every discipline into every refinement pass.
- Do not convert unresolved conflict into fake agreement.
- Flag missing decisions before they become implementation churn.
- Keep the story as small as the user outcome allows.
- Escalate low-confidence areas instead of smoothing them over.
- Stop at proposal stage for Trello changes unless the human explicitly approves execution.
- Prefer implementation-package readiness over generic story readiness.

Required Output:
1. Story title
2. User problem
3. Target user
4. Proposed outcome
5. Acceptance criteria
6. Out of scope
7. Risks
8. Dependencies
9. Implementation complexity estimate
10. Expected Codex sessions
11. Confidence
12. Files likely affected
13. Agreements
14. Disagreements
15. Assumptions
16. Decision-required items
17. Ready / not ready call
18. Recommended next step
19. Implementation package gaps
