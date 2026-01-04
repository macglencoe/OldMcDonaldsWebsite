#!/usr/bin/env python3
"""
extract_coords.py

Read a Google Earth KML measurement feature from the clipboard (or stdin),
extract the <coordinates>…</coordinates> text, parse out the lon,lat,0 triples,
swap to [lat, lon], output in your exact formatting, and copy back to clipboard.
"""

import sys
import re

def get_input_text():
    if not sys.stdin.isatty():
        return sys.stdin.read()
    try:
        import pyperclip
    except ImportError:
        sys.exit("Error: pyperclip not installed. → pip install pyperclip")
    return pyperclip.paste()

def copy_to_clipboard(text: str):
    try:
        import pyperclip
    except ImportError:
        return
    pyperclip.copy(text)

def main():
    kml = get_input_text()
    m = re.search(r"<coordinates>(.*?)</coordinates>", kml, re.DOTALL)
    if not m:
        sys.exit("Error: no <coordinates>…</coordinates> block found.")
    coords_block = m.group(1).strip()

    triples = [t for t in coords_block.split() if t.strip()]
    pairs = []
    for triple in triples:
        lon, lat, _ = triple.split(",")
        pairs.append((lat, lon))

    # Build the output lines exactly as requested
    out_lines = ["["]
    for i, (lat, lon) in enumerate(pairs):
        comma = "," if i < len(pairs) - 1 else ""
        out_lines.append(f"    [{lat}, {lon}]{comma}")
    out_lines.append("  ]")

    output = "\n".join(out_lines)
    print(output)
    copy_to_clipboard(output)

if __name__ == "__main__":
    main()
