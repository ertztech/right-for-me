from __future__ import annotations

import json
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
PROFILE_PATH = ROOT_DIR / "data" / "master_profile.json"


REQUIRED_TOP_LEVEL_KEYS = [
    "person",
    "roles",
    "skills",
    "tools",
    "accomplishments",
    "certifications",
    "education",
]


def load_profile() -> dict:
    if not PROFILE_PATH.exists():
        raise FileNotFoundError(f"Profile not found: {PROFILE_PATH}")

    return json.loads(PROFILE_PATH.read_text(encoding="utf-8"))


def validate_profile(profile: dict) -> list[str]:
    errors: list[str] = []

    for key in REQUIRED_TOP_LEVEL_KEYS:
        if key not in profile:
            errors.append(f"Missing required key: {key}")

    return errors


def main() -> None:
    profile = load_profile()
    errors = validate_profile(profile)

    if errors:
        print("Career Vault validation failed.")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("Career Vault loaded successfully.")
    print(f"Roles: {len(profile['roles'])}")
    print(f"Skills: {len(profile['skills'])}")
    print(f"Tools: {len(profile['tools'])}")
    print(f"Accomplishments: {len(profile['accomplishments'])}")
    print(f"Certifications: {len(profile['certifications'])}")
    print(f"Education: {len(profile['education'])}")


if __name__ == "__main__":
    main()