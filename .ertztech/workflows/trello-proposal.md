# Product Owner Trello Proposal

Purpose:
Create a safe, reviewable proposal for Trello changes without executing them automatically.

Rule:
The Product Owner proposes Trello changes. A human approves. Only then may approved tooling or a human operator execute the change.

When to use:
- A new idea should become a Trello card.
- An existing card needs a meaningful content update.
- The backlog needs cleaner acceptance criteria, labels, or list placement.

Template:

## Proposed Card Title

## Description

## Checklist
- [ ]
- [ ]
- [ ]

## Labels

## Rationale

## Approval Status
- Proposed
- Approved by:
- Approval date:

## Execution Notes
- No execution without explicit human approval.
- If approved, use existing repo Trello tooling rather than duplicating automation.
- Record the source artifact that approved this change.

Approved handoff to existing tooling:
- Existing tooling lives in `tools/trello/`.
- `tools/trello/board_builder.py` creates or updates a board from a JSON template.
- `tools/trello/trello.py` contains the API client and `curl.exe` fallback.
- `docs/TRELLO_SETUP.md` documents credentials and current usage.
- This workflow does not call those tools directly.
- After explicit human approval, convert the approved proposal into the format required by the existing tooling or execute the change manually.

Not included:
- Direct Trello API execution from planning artifacts
- Auto-approval logic
- Autonomous board or card mutation
