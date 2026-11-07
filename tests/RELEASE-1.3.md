# Release 1.3 verification

The revision addresses graphics and overall styling. All eleven games, their rules and local saved-data keys remain. No engine files changed.

The gallery uses eleven WebP screenshots of actual gameplay in `dist/assets/previews/`. The source captures are retained locally in the ignored `qa/previews/` directory. Covers total approximately 142 KB. Titles remain adjacent to each cover; the preview images have empty alt text to avoid repeating the link names.

Shared styling uses lighter headings, correct 400/600/800 font-face mappings, thinner borders and neutral surfaces. The masthead mascot, cartoon title covers, decorative tilts, pretend stationery header and approval stamp were removed. Form approval uses plain status feedback. The daily link and recommendation links retain their functions.

All 40 existing automated tests pass. Browser verification covered the eleven gallery links, both filters, form approval and reset, absence of the removed decorations, and all twelve main screens at 320px width without horizontal overflow. Desktop and phone renders were inspected. Game interfaces used to capture the covers also opened successfully.

Before publishing, the build includes the versioned preview files and content-hashed JavaScript/CSS. The deployment receipt verifies the live assets against this build. Screenshots and browser receipts are local QA artifacts.
