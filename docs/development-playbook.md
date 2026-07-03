# Development Playbook

RightForMe is built like a real project: one issue, one branch, one focused change at a time.

## Workflow

1. Issue: define the problem, acceptance criteria, and test plan.
2. Trello card: capture the product angle, priority, and learning-in-public notes.
3. Branch: create a focused branch for the work.
4. Build: make the smallest useful change that completes the issue.
5. Test: verify the new behavior and the existing behavior it could affect.
6. Commit: use a clear message that describes the change.
7. Push: publish the branch.
8. PR: summarize the change, include testing, and link the issue.
9. Merge: merge when the work is complete.
10. Pull main: update the local repo before starting the next branch.

## Branch Naming

- `feature/name` for product features.
- `docs/name` for documentation.
- `fix/name` for bug fixes.

## Definition Of Done

- Acceptance criteria are met.
- Manual testing is complete.
- Existing behavior is verified.
- The commit message is meaningful.
- The pull request links the issue with `Closes #XX`.

## Common Commands

```bash
git status
git checkout main
git pull
git checkout -b branch-name
git diff --stat
git add .
git commit -m "message"
git push -u origin branch-name
```

Use the process as a guardrail, not theater. The point is to build the product and build the builder at the same time.
