# Tarot Reader

A personal, static tarot-card simulator intended for local use and optional
GitHub Pages hosting. It will shuffle a standard 78-card Rider-Waite-Smith deck
in the browser, deal three supported spreads, and show original upright card
interpretations. It has no accounts, persistence, analytics, backend, or AI
integration.

## Planned features

- Three-card, five-card, and Celtic Cross layouts.
- Face-down dealing with individual reveal, plus reveal-all and reset actions.
- Responsive, keyboard-accessible controls and reduced-motion support.
- Original interpretation text and clearly labelled spread positions.
- Upright readings in the initial release; the data model reserves support for
  reversed cards later.

## Development

The project will use React, TypeScript, and Vite. After initialization:

```sh
npm install
npm run dev
npm test
npm run lint
npm run format:check
npm run build
```

Development is test-driven. Add a failing test first, implement the smallest
change that passes it, then refactor. CI must run formatting, linting, tests,
and the production build on every pull request.

## Git workflow

The initial repository commit may be made directly on `main`. After that,
create a short-lived branch for every change and merge via a pull request only
after CI passes. GitHub branch protection should block direct pushes to `main`.

## Licensing and artwork

Project-created code, UI, card backs, and interpretation text will be released
under the MIT License. Original 1909 Rider-Waite-Smith card faces are planned
as public-domain source material; `ATTRIBUTION.md` will identify the exact
files and source before those assets are added. This project is for reflection
and entertainment, not professional advice.

## Documentation

The approved product design is in
[`docs/superpowers/specs/2026-10-07-tarot-simulator-design.md`](docs/superpowers/specs/2026-10-07-tarot-simulator-design.md).
Contributor expectations are in [`AGENTS.md`](AGENTS.md).
