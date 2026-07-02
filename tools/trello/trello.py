from __future__ import annotations

import json
from urllib import parse, request


class TrelloClient:
    def __init__(self, api_key: str, token: str) -> None:
        self.api_key = api_key
        self.token = token
        self.base_url = "https://api.trello.com/1"

    def create_board(self, name: str, description: str = "") -> dict:
        return self._request(
            "POST",
            "/boards/",
            {
                "name": name,
                "desc": description,
                "defaultLists": "false",
            },
        )

    def create_list(self, board_id: str, name: str, position: str | int = "bottom") -> dict:
        return self._request(
            "POST",
            "/lists",
            {
                "idBoard": board_id,
                "name": name,
                "pos": str(position),
            },
        )

    def create_card(self, list_id: str, name: str, description: str = "") -> dict:
        return self._request(
            "POST",
            "/cards",
            {
                "idList": list_id,
                "name": name,
                "desc": description,
            },
        )

    def _request(self, method: str, path: str, params: dict[str, str]) -> dict:
        query = {
            **params,
            "key": self.api_key,
            "token": self.token,
        }
        encoded = parse.urlencode(query).encode("utf-8")
        url = f"{self.base_url}{path}"
        req = request.Request(url, data=encoded, method=method)

        with request.urlopen(req, timeout=30) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
