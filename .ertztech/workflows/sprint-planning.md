# Sprint Planning Workflow

Purpose:
Turn a messy list of ideas, bugs, and goals into a realistic, sized development plan.

Referenced roles:
- ../agents/product-owner.md
- ../agents/architect.md
- ../agents/engineering-manager.md
- ../agents/implementation-engineer.md
- ../agents/qa.md
- ../agents/delivery-coach.md

Process:
1. Product Owner clarifies user value, priority, and MVP scope.
2. Architect reviews technical approach, dependencies, and risks.
3. Engineering Manager checks sequencing, PR size, and handoff quality.
4. Implementation Engineer checks whether Codex can execute the task cleanly.
5. QA identifies test cases, edge cases, and acceptance gaps.
6. Delivery Coach sizes the work and checks predictability.
7. Orchestrator produces the final sprint plan.

Rules:
- Keep scope small.
- Prefer 1 to 3 issues per cycle.
- Split anything larger than 5 points.
- Flag unclear work instead of pretending it is ready.
- Do not send Codex vague work.
- Produce a Codex-ready prompt only for ready work.

Required Output:
1. Sprint goal
2. Candidate work
3. Role review
4. Selected work
5. Sizing and confidence
6. Risks and dependencies
7. GitHub issue drafts
8. Codex prompt
9. Test checklist
10. Retro questions
11. Recommended improvement for next cycle