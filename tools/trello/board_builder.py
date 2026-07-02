from __future__ import annotations

import argparse
import json
from pathlib import Path

from config import trello_credentials
from trello import TrelloClient


def load_template(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def preview(template: dict) -> None:
    print(f"Board: {template['name']}")
    for list_def in template.get("lists", []):
        cards = list_def.get("cards", [])
        print(f"- {list_def['name']} ({len(cards)} cards)")
        for card in cards:
            print(f"  - {card['name']}")


def build_board(template: dict) -> None:
    api_key, token, existing_board_id = trello_credentials()
    client = TrelloClient(api_key, token)

    if existing_board_id:
        board_id = existing_board_id
        print(f"Using existing board: {board_id}")
    else:
        board = client.create_board(
            template["name"],
            template.get("description", ""),
        )
        board_id = board["id"]
        print(f"Created board: {template['name']} ({board_id})")

    for list_def in template.get("lists", []):
        trello_list = client.create_list(board_id, list_def["name"])
        list_id = trello_list["id"]
        print(f"Created list: {list_def['name']}")

        for card_def in list_def.get("cards", []):
            card = client.create_card(
                list_id,
                card_def["name"],
                card_def.get("description", ""),
            )
            print(f"Created card: {card['name']}")

    print("Trello product board setup complete.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Trello board from a RightForMe JSON template.")
    parser.add_argument("template", type=Path, help="Path to a Trello board JSON template.")
    parser.add_argument("--dry-run", action="store_true", help="Preview the board without calling Trello.")
    args = parser.parse_args()

    template = load_template(args.template)
    if args.dry_run:
        preview(template)
        return

    build_board(template)


if __name__ == "__main__":
    main()
