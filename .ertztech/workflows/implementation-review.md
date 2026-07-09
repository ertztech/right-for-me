# Implementation Review Workflow

Purpose:
Measure handoff quality, implementation effort, and rework so the framework improves from real work.

Referenced roles:
- ../agents/facilitator-orchestrator.md
- ../agents/product-owner.md
- ../agents/architect.md
- ../agents/engineering-manager.md
- ../agents/software-engineer.md
- ../agents/implementation-engineer.md
- ../agents/qa.md
- ../agents/delivery-coach.md

When to use:
- After Codex implementation finishes.
- After meaningful review or rework reveals planning quality.
- When the founder wants to decide whether the framework needs adjustment.

Session Control:
- Session type
- Workflow source
- Support docs
- Expected output
- Current step
- Decisions needed
- Parking lot
- Docs/backlog impacted

Rules:
- Keep this lightweight and factual.
- Measure implementation effort and rework quality, not story points.
- Focus on what would improve the next handoff.
- Do not rewrite history to protect the framework.
- All changes go through a pull request before merging to `main`.
- Review decides whether the pull request is ready, needs changes, or needs follow-up items.
- Implementation Retro happens after merge, not instead of review.

Metrics:
- Estimated implementation complexity
- Actual implementation time
- Number of Codex sessions
- Manual edits
- Files changed
- Rework required
- Rework category
- Handoff completeness
- Overall implementation quality

Rework Categories:
- Planning gap
- Scope change
- Architecture issue
- Bug
- Prompt ambiguity
- Codex misunderstanding
- Human implementation decision
- External dependency
- Other

Required Output:
1. What shipped
2. What changed during implementation
3. Metric summary
4. Rework summary
5. Rework category
6. Handoff quality assessment
7. Pull request decision: ready, needs changes, or follow-up items
8. Agreements
9. Disagreements
10. Recommended framework adjustment
11. Backlog update recommendation
12. Retro handoff note
