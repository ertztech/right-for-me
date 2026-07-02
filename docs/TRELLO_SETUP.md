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

## Card Rule

Every buildable Trello card should include:

- User problem
- Target user
- Proposed outcome
- Acceptance criteria
- MVP relevance
- Learning-in-public note
- GitHub issue link once created

