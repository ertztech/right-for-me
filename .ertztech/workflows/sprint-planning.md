# Sprint Planning Workflow

Purpose:
Turn a messy list of ideas, bugs, and goals into a realistic, sized development plan.

Status:
Useful when a sprint-style pass helps, but `implementation-planning.md` is the preferred workflow for the founder + ChatGPT + Codex operating flow.

Referenced roles:
- ../agents/facilitator-orchestrator.md
- ../agents/product-owner.md
- ../agents/architect.md
- ../agents/engineering-manager.md
- ../agents/implementation-engineer.md
- ../agents/qa.md
- ../agents/delivery-coach.md
- ../product-direction.md

Process:
1. Facilitator confirms this is the right workflow and states the planning decision.
2. Product Owner checks candidate work against product direction, user value, and readiness.
3. Architect reviews technical approach, dependencies, and risks.
4. Engineering Manager checks sequencing, PR size, and handoff quality.
5. Implementation Engineer checks whether Codex can execute the task cleanly.
6. QA identifies test cases, edge cases, and acceptance gaps.
7. Delivery Coach estimates implementation complexity and checks predictability.
8. Facilitator summarizes agreements, disagreements, tradeoffs, assumptions, and recommendations.

Rules:
- Keep scope small.
- Prefer 1 to 3 issues per cycle.
- Split anything estimated as `XL`.
- Flag unclear work instead of pretending it is ready.
- Do not send Codex vague work.
- Produce a Codex-ready prompt only for approved, ready work.
- Keep unresolved disagreements visible.
- Use the Parking Lot for worthwhile topics that do not belong in the current sprint decision.
- Add a Not My Job section when someone tries to pull unrelated work into planning.
- Prefer implementation complexity over story points.

## Scope Control

When selected work could be implemented as one combined issue or multiple smaller issues, the workflow must surface the tradeoff instead of hiding it.

### Combined Issue Risk Check

Before approving a combined issue, answer:

- Are the changes limited to the same user journey?
- Are the files likely to overlap?
- Can the work be tested with one clear QA checklist?
- Can the PR be reviewed in under 15 minutes?
- Can the work be reverted safely?
- Is there a clear "no behavior changes" constraint?

If the answer to two or more is "no," recommend splitting the work.

### Safe Combined Issue Rules

A combined issue is acceptable only when:

- The work supports one clear sprint goal.
- The scope is copy, layout, hierarchy, or documentation only.
- No new persistence, routing, authentication, external API, or data model changes are included.
- The Codex prompt explicitly lists what must not change.
- The test checklist covers each affected area.

### Required Output for Scope Decisions

When there is disagreement about splitting work, include:

- Option A: combined issue
- Option B: split issues
- Risks of each option
- Recommendation
- Confidence
- Human decision required

Required Output:
1. Sprint goal
2. Candidate work
3. Product direction check
4. Agreements
5. Disagreements
6. Selected work
7. Implementation complexity and confidence
8. Assumptions
9. Risks and dependencies
10. Decision-required items
11. Parking Lot
12. Not My Job
13. GitHub issue drafts
14. Codex-ready prompts for approved work only
15. Test checklist
16. Exit Criteria
17. Retro questions
18. Recommended improvement for next cycle
