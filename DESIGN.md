# Design

Timepass keeps the immediate game-gallery navigation inspired by Neal.fun. The user asked for less gimmicky graphics and overall styling; the games and their mechanics remain in scope to preserve.

Use captured gameplay as the gallery imagery. The eleven WebP covers in `dist/assets/previews/` come from the working interfaces, captured through the browser. Their purpose is to show what opens after a click. Game-specific drawings remain where they carry the interaction, such as the cricket pitch, roti canvas, lunch matching tiles and train window.

The shared interface uses a light neutral surface, dark type, thin borders and restrained green for actions, selection and success. Self-hosted Bricolage Grotesque uses 400 for reading and 600 for labels and the home headline. Game art supplies the color.

The home opening pairs the title with a daily cricket feature. Its image shows the actual pitch, and its link shows the target and the player's best score when available. The catalog uses wide previews on desktop and tablet, then switches to compact rows with a thumbnail, title, duration and description on phones. The framing and phone layout draw on the Work and mobile Index references in [Parth Design Taste](https://github.com/Parthawe/parth-design-taste/blob/main/START-HERE.md).

Game pages share concise navigation and two text links to other games. Keep keyboard focus, touch targets, reduced-motion behavior and readable contrasts. Use plain form surfaces and success feedback.

Previews are static screenshots of actual local play, not interactive controls or public score claims. Capture the relevant game region after styling changes; retain source PNGs in the ignored `qa/previews/` directory and publish compressed WebP assets. Version their filenames when refreshing the covers.
