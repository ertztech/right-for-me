from __future__ import annotations

import json
import ssl
import subprocess
from urllib import parse, request
from urllib.error import URLError


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

        try:
            with request.urlopen(req, timeout=30) as response:
                body = response.read().decode("utf-8")
                return json.loads(body)
        except URLError as error:
            if not _is_certificate_error(error):
                raise
            return self._request_with_curl(url, query)

    def _request_with_curl(self, url: str, params: dict[str, str]) -> dict:
        args = ["curl.exe", "--ssl-no-revoke", "--silent", "--show-error", "--fail", "--request", "POST", url]
        for key, value in params.items():
            args.extend(["--data-urlencode", f"{key}={value}"])

        result = subprocess.run(args, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or "Trello request failed through curl.")

        return json.loads(result.stdout)


def _is_certificate_error(error: URLError) -> bool:
    reason = getattr(error, "reason", error)
    if isinstance(reason, ssl.SSLCertVerificationError):
        return True
    return "CERTIFICATE_VERIFY_FAILED" in str(error)
