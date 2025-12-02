import json
from pathlib import Path

TARGET_PATH = Path("emedes/marketing-entrenador-user-stories.json")

REPLACEMENTS = {
    "\u201c": '"',  # opening double quote
    "\u201d": '"',  # closing double quote
    "\u2192": "->",  # arrow
    "\u2019": "'",  # right single quote
}


def normalize():
    data = json.loads(TARGET_PATH.read_text(encoding="utf-8"))
    for story in data.get("user_stories", []):
        desc = story.get("description", "")
        for old, new in REPLACEMENTS.items():
            desc = desc.replace(old, new)
        story["description"] = desc
    TARGET_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    normalize()

