# Timepass

Eight small Indian-context games and browser toys. Inspired by the immediate, illustrated browsing experience of [Neal.fun](https://neal.fun/). Original graphics, code, and copy.

## Play

[Play Timepass](https://parthawe.github.io/timepass-india/)

City Tycoon · Spend a Crore · Gully Cricket · Chai Tapri · Bargain Bazaar · Dabba Memory · Perfect Roti · Train Window.

All prices and economic values are fictional. There are no purchases, accounts, backend, analytics or paid API calls. Best scores stay in local storage and can be cleared from About & data. GitHub Pages hosting is subject to GitHub's privacy practices.

## Run

Requires Node 22 or newer. No package installation or build step.

```sh
npm start
npm run check
npm test
```

Open http://127.0.0.1:8788. Every experience uses a hash route, so deep links work on GitHub Pages.

## Source

- `dist/`: complete deployable site, self-hosted fonts and original SVG/canvas graphics.
- `dist/engine.js`: economic and scoring logic.
- `dist/app.js`: navigation and game interfaces.
- `tests/`: engine tests and launch QA inventory.
- `PLAN.md`: scope, delivery sequence and later-release ideas.
- `RESEARCH.md`: current 42-project Neal.fun catalog and pattern review.
- `DESIGN.md`, `PRODUCT.md`: design and product decisions.

Pushes to `main` run syntax checks and tests, then deploy `dist/` with GitHub Actions. No secrets are required. To deploy a fork, enable GitHub Pages with GitHub Actions as the build source, and update the repository/site links.

Bricolage Grotesque is distributed under the SIL Open Font License; see `dist/assets/OFL-Bricolage.txt`. This project is independent of Neal.fun and Monopoly.
