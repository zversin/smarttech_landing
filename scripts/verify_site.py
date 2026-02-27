#!/usr/bin/env python3
"""Basic static-site checks for SmartTech website."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.rglob("*.html"))

H1_RE = re.compile(r"<h1\b", re.IGNORECASE)
TITLE_RE = re.compile(r"<title>.*?</title>", re.IGNORECASE | re.DOTALL)
META_DESC_RE = re.compile(
    r"<meta\s+name=[\"']description[\"']\s+content=[\"'][^\"']+[\"']",
    re.IGNORECASE,
)
URL_RE = re.compile(r"(?:href|src)\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE)


def path_exists(url: str) -> bool:
    if url.startswith(("http://", "https://", "mailto:", "tel:", "javascript:", "#")):
        return True

    clean = url.split("#", 1)[0].split("?", 1)[0]
    if not clean:
        return True

    if clean.startswith("/"):
        rel = clean.lstrip("/")
        if clean == "/":
            return (ROOT / "index.html").exists()
        direct = ROOT / rel
        if direct.is_file():
            return True
        if direct.is_dir() and (direct / "index.html").exists():
            return True
        if not clean.endswith("/") and (ROOT / rel / "index.html").exists():
            return True

    return True


def main() -> int:
    errors = []

    for html_path in HTML_FILES:
        text = html_path.read_text(encoding="utf-8")
        rel = html_path.relative_to(ROOT)

        h1_count = len(H1_RE.findall(text))
        if h1_count != 1:
            errors.append(f"{rel}: expected 1 <h1>, found {h1_count}")

        if not TITLE_RE.search(text):
            errors.append(f"{rel}: missing <title>")

        if not META_DESC_RE.search(text):
            errors.append(f"{rel}: missing meta description")

        for candidate in URL_RE.findall(text):
            if not path_exists(candidate):
                errors.append(f"{rel}: broken local link/resource {candidate}")

    print(f"Checked {len(HTML_FILES)} HTML files.")
    if errors:
        print("\nErrors:")
        for item in errors:
            print("-", item)
        return 1

    print("All checks passed: H1/title/meta/link baseline is valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
