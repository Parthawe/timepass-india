# Design

Timepass follows [Neal.fun's gallery](https://neal.fun/) as the visual reference. A centered wordmark and one line of introduction lead directly into the games. The daily cricket link sits beside the browsing controls.

Each game has a wide illustrated cover with its title and duration in live text. The covers use objects from the games, including a railway bench, a masala dabba and a cricket bat. Keep the gallery background quiet and give each cover its own palette. The grid uses three columns on desktop, two on tablet and one on phones.

Cover art comes from an original ImageGen sheet and is served as individual compressed WebPs in `dist/assets/covers/`. Keep titles outside the image so they remain selectable, readable on small screens and available to assistive technology. The cover title and link must remain legible while art loads or if it fails to load.

Game pages reuse the gallery covers and title type. Bring each cover's palette into the parts people use: blue for railway seats, cream and red for the visitor form, green for the property board. Keep state labels, rules and controls separate from the artwork. The navigation and recommendations connect the games back to the gallery.

New ImageGen scenes in `dist/assets/scenes/` supply the gully cricket court, the moving Train Window panorama and the Chai Tapri counter. Cricket draws the ball, bat and stumps over the court. Train Window scrolls the panorama, with the canvas drawing as a fallback. The chai image sits beside the live order ticket.

Preserve keyboard focus, touch targets, reduced-motion behavior and readable contrast. The About & data and source links are in the footer.
