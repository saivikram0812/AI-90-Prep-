#!/usr/bin/env bash
# Deploy the tracker.
#
# Browsers cache css/js hard on GitHub Pages, so a plain push means you keep
# seeing the OLD site until you manually hard-refresh. This stamps a fresh
# ?v=<timestamp> onto every asset URL in index.html, which makes the browser
# treat them as new files and fetch them. Always deploy with this script.
set -euo pipefail
cd "$(dirname "$0")"

V=$(date +%Y%m%d%H%M%S)

# rewrite ?v=... on every local css/js reference (add it if absent)
python3 - "$V" <<'PY'
import re, sys, pathlib
v = sys.argv[1]
p = pathlib.Path("index.html")
s = p.read_text()
s = re.sub(r'(href="css/[^"?]+)(\?v=\d+)?"', lambda m: f'{m.group(1)}?v={v}"', s)
s = re.sub(r'(src="js/[^"?]+)(\?v=\d+)?"',  lambda m: f'{m.group(1)}?v={v}"', s)
s = re.sub(r'<meta name="build" content="[^"]*">', f'<meta name="build" content="{v}">', s)
p.write_text(s)
print(f"stamped build {v}")
PY

MSG="${1:-Update site}"
git add -A
git commit -q -m "$MSG" || echo "(nothing new to commit)"
git push -q origin main
echo "pushed to $(git remote get-url origin)"
echo "live in ~1 min: https://saivikram0812.github.io/AI-90-Prep-/"
