from __future__ import annotations

from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT_DIR / ".env"


def load_env(path: Path = ENV_PATH) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    return values


def trello_credentials() -> tuple[str, str, str | None]:
    values = load_env()
    api_key = values.get("TRELLO_API_KEY", "")
    token = values.get("TRELLO_TOKEN", "")
    board_id = values.get("TRELLO_BOARD_ID") or None

    missing = [
        name
        for name, value in {
            "TRELLO_API_KEY": api_key,
            "TRELLO_TOKEN": token,
        }.items()
        if not value
    ]
    if missing:
        names = ", ".join(missing)
        raise RuntimeError(f"Missing {names}. Add them to {ENV_PATH}.")

    return api_key, token, board_id
