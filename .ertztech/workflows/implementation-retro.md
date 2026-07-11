# Implementation Retro Workflow

Purpose:
Turn a completed implementation cycle into durable improvements for process, backlog, and technical follow-up.

Status:
Run after a pull request is merged.

Cycle boundary:
- Implementation Retro runs once at the end of an Implementation Cycle, not after every individual implementation.
- A cycle is not fully closed until the retro artifact is saved in the repository.

Referenced roles:
- ../agents/facilitator-orchestrator.md
- ../agents/product-owner.md
- ../agents/architect.md
- ../agents/engineering-manager.md
- ../agents/software-engineer.md
- ../agents/qa.md
- ../agents/delivery-coach.md

Session Control:
- Session type
- Workflow source
- Support docs
- Expected output
- Current step
- Decisions needed
- Parking lot
- Docs/backlog impacted

Inputs:
- Implementation Package
- GitHub Issue/PR description
- Codex results
- Implementation Review notes
- test results
- merge outcome
- product and design principles that materially affected the implementation

Role perspectives:
- Product Owner
- Architect
- Engineering Manager
- Software Engineer
- QA
- Delivery Coach / Facilitator

Retro questions:
- What went well?
- What caused friction?
- Did Codex have enough context?
- Did the issue or prompt cause rework?
- Were acceptance criteria clear?
- Did tests catch the right things?
- Did we discover technical debt?
- Did we discover process improvements?
- What should change before the next implementation?

Durable Retro Record:
- Every closed cycle must create one durable repository record.
- Use an implementation retro record in the repo, not chat history alone.
- The record must be saved before cycle closure is considered complete.
- The record must include:
  - cycle outcome
  - implementations completed
  - decisions made
  - problems observed
  - evidence
  - root causes
  - product and design-principle lessons
  - operating-model improvements
  - backlog proposals
  - carryover items and dispositions

Decision Log Structure:
- Decision
- Context and evidence
- Reasoning
- Impact
- Affected workflow or product principle
- Follow-up action
- Backlog status

Retro-To-Backlog Proposal Structure:
- Title
- Problem observed
- Evidence
- Desired improvement
- Recommended priority
- Suggested destination
- Status

Approved Proposal Statuses:
- Promote to next Parking Lot Review
- Keep parked
- Completed as a documentation improvement
- Discard

Rules:
- Retro proposals do not automatically become commitments.
- Parking Lot Review and Backlog Review still decide promotion and priority.
- Unfinished Cycle Backlog items must receive an explicit carryover disposition.
- The retro must state which proposals changed docs immediately and which remain proposed only.

Outputs:
1. durable retro record saved in the repository
2. process improvement backlog items
3. technical debt items
4. parking lot items
5. feature backlog updates
6. carryover dispositions
7. next recommended action
