# Tarot Reader

A personal, static tarot-card simulator for local use and optional GitHub Pages
hosting. It will shuffle a 78-card deck in the browser, deal three supported
spreads, and show original upright interpretations. It has no accounts,
persistence, analytics, backend, or AI integration.

## Development

The project uses React, TypeScript, and Vite.

```sh
npm run dev
npm test
npm run lint
npm run format:check
npm run build
```

Development is test-driven: write a failing behavior test, implement the
smallest change that passes it, then refactor. CI runs formatting, linting,
tests, and the production build on each pull request. Dependabot opens weekly
update pull requests for npm packages and GitHub Actions.

## Reversals

Readings include reversed cards by default, each with an independent 20% chance.
To start a cautious upright-only local session or build an upright-only bundle,
set `VITE_DISABLE_REVERSALS=true` before the Vite command:

```sh
VITE_DISABLE_REVERSALS=true npm run dev
VITE_DISABLE_REVERSALS=true npm run build
```

## Licensing and artwork

Project-created code, UI, card backs, and interpretation text use the MIT
License. Card-face provenance must be recorded in `ATTRIBUTION.md` before any
public-domain Rider-Waite-Smith artwork is added.

## Deployment

Pushes to `main` deploy the static production build to GitHub Pages. The site
uses the `/tarot-reader/` base path required by the project Pages URL.
