# Design

Timepass keeps the immediate game-gallery navigation inspired by Neal.fun. The user asked for less gimmicky graphics and overall styling; the games and their mechanics remain in scope to preserve.

Use captured gameplay as the gallery imagery. The eleven WebP covers in `dist/assets/previews/` come from the working interfaces, captured through the browser. Their purpose is to show what opens after a click. Game-specific drawings remain where they carry the interaction, such as the cricket pitch, roti canvas, lunch matching tiles and train window.

The shared interface uses a light neutral surface, dark type, thin borders and restrained green for selection and success. Bricolage Grotesque is self-hosted at its correct weights: 400 for reading and large headings, 600 for labels and emphasis. Avoid the former mascot, oversized chunky wordmark, pastel title illustrations, tilted decorations and pretend-paper treatment.

Keep the three-column desktop, two-column tablet and single-column phone gallery. The daily cricket link is a quiet functional row. Game pages share concise navigation and two text links to other games. Keep keyboard focus, touch targets, reduced-motion behavior and readable contrasts. Use plain form surfaces and success feedback; no rubber-stamp decoration.

Previews are static screenshots of actual local play, not interactive controls or public score claims. Capture the relevant game region after styling changes; retain source PNGs in the ignored `qa/previews/` directory and publish compressed WebP assets. Version their filenames when refreshing the covers.
