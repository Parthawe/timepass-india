# Release 1.1 verification

29 automated tests pass: the original game engines, five seat puzzles, kitchen combinations and save recovery, cumulative visitor rules, and asset versioning. The build tests verify that changing a dependency changes its parent's filename, that unchanged builds are deterministic, and that original asset URLs remain available for cached first-release HTML.

40 browser assertions pass against the built site. They cover all five seat puzzle completions and restart, invalid seating and hints, every kitchen discovery, saved discovery reload and reset, all ten visitor rules and approval, keyboard focus, clearing discoveries from About & data, and the expanded filters.

Rendered the shelf and new games on desktop and at 320px phone width. No horizontal overflow appeared in the four changed screens. On phones, passenger requests appear above the seats. Kitchen mixing retains keyboard focus, and form approval moves focus to the result. No app warnings or errors appeared during these checks.

The collection now contains eleven experiences. Existing scores remain under their original storage keys. The additional kitchen save uses `timepass-masala`, which the About & data clearing action also removes.

Production is built into `_site/` with content-hashed JavaScript and CSS. The published `release.json` identifies the version and asset filenames for deployment verification. Browser screenshots and detailed receipts remain in the ignored local `qa/` directory.
