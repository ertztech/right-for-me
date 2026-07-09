# Technical Debt

Use this page to capture implementation friction that is real but not yet the next GitHub Issue.

| Debt Item | Affected Area | Impact | Status | Related Feature Or Epic | Notes |
| --- | --- | --- | --- | --- | --- |
| Fix stale Application Studio packet test expectation | Application Studio tests | Current test expectation is stale and creates noise during unrelated feature validation. | Ready for Issue | Technical Debt | Fails on `main` and `feature/career-journey-shell-v1`, unrelated to Career Journey shell. |
| Evaluate workspace controller boundaries | Workspace routing and controller structure | Current workspace growth may increase coupling if all areas continue to expand through the same controller. | Idea | Career Journey | Career Journey shell currently uses existing jobs controller pattern, acceptable for v1 but should be reviewed as workspaces grow. |
