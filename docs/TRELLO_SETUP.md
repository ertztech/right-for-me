# Trello Setup

Trello is the product side of RightForMe. GitHub is the engineering side.

Use Trello to capture product intent before a feature becomes code.

## Where To Put The Token

Create this file at the repo root:

```txt
C:\Users\Ertz Family\Documents\Codex\2026-07-02\yes-in-fact-i-think-we\right-for-me\.env
```

Copy the structure from `.env.example`:

```txt
TRELLO_API_KEY=
TRELLO_TOKEN=
TRELLO_BOARD_ID=
```

The `.env` file is already ignored by Git.

## Getting Trello Credentials

1. Go to the Trello developer API key page.
2. Copy your API key into `TRELLO_API_KEY`.
3. Generate a token from that page.
4. Copy the token into `TRELLO_TOKEN`.

Keep both values private.

## Create The Product Board

From the repo root, run:

```powershell
python tools\trello\board_builder.py templates\rightforme_board.json
```

On some Windows machines, Python may fail certificate verification even when Trello is reachable. The builder will retry through `curl.exe --ssl-no-revoke` when that local certificate issue occurs.

To preview what would be created without calling Trello:

```powershell
python tools\trello\board_builder.py templates\rightforme_board.json --dry-run
```

## Product Flow

The default board uses these lists:

- Ideas
- Backlog
- Ready
- Doing
- Review
- Shipped
- Lessons Learned

The goal is to make every feature start as product intent before it becomes a GitHub issue.

## Relationship To Board Builder

This repo currently includes a small Trello board builder so RightForMe can move quickly without another dependency.

Longer term, the dedicated board-builder repo can become the reusable home for:

- Trello API client code
- JSON template interpretation
- Board/list/card creation
- Tests and reusable project templates

When that happens, RightForMe should keep the product-specific template and docs, while the shared implementation lives in board-builder.

## Card Rule

Every buildable Trello card should include:

- User problem
- Target user
- Proposed outcome
- Acceptance criteria
- MVP relevance
- Learning-in-public note
- GitHub issue link once created
