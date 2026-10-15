# Tarot Reader

A personal, static tarot-card simulator for reflective readings in the browser,
available locally or through GitHub Pages. It shuffles a 78-card deck, deals
Three Card, Five Card, and Celtic Cross spreads, and presents original,
card-specific upright and reversed interpretations. It has no accounts,
persistence, analytics, backend, or AI integration.

## Using the reader

Choose a spread and reading focus, or select **Something else** to enter your
own question. Select **Begin reading**, then reveal cards in any order or use
**Reveal all**. The reader shows each card's meaning in its spread position
and a developing narrative. Once all cards are revealed, select **Reflect on
this reading** for an anchor card and closing prompts.

Use **Explore the deck** to browse card images and meanings. Browse by scrolling
or selecting a category; **Search meanings** searches interpretation text and
themes, rather than card names. On desktop, selected card details scroll within
their panel; on narrow screens, they appear below the cards in the page.

## Development

The project uses React, TypeScript, and Vite, with Vitest and Playwright for
testing. Use Node.js 24, matching CI.

```sh
npm ci --ignore-scripts
npx playwright install chromium
npm run dev
```

Run the project checks before opening a pull request:

```sh
npm run lint
npm run format:check
npm run images:check
npm test
npm run build
npm run test:e2e
```

Development is test-driven: write a failing behavior test, implement the
smallest change that passes it, then refactor. CI runs the checks above and a
dependency audit on each pull request. Dependabot opens weekly
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

Project-created code, UI, and interpretation text use the MIT License. The
card faces and card back are public-domain 1909 Rider-Waite-Smith artwork;
their sources are recorded in `ATTRIBUTION.md`.

## Deployment

Changes reach `main` through pull requests after required checks pass. Pushes
to `main` rerun verification and deploy the static production build to GitHub
Pages. The site uses the `/tarot-reader/` base path required by the project
Pages URL.
