# Tarot Simulator Design

## Purpose and scope

Build a personal, static web simulator for drawing a shuffled 78-card tarot
deck. It may be published through GitHub Pages for easy testing, but is not a
commercial service. The first release has no accounts, saved readings,
analytics, backend, AI, custom spreads, or reversed-card interpretations.

## Technical design

Use React, TypeScript, and Vite. Bundle all card, spread, and interpretation
data with the application; all randomization and state remain in the browser.
Keep deck operations in a framework-independent module. Spread definitions
describe ordered positions, labels, and layout coordinates; components render
the selected spread from those definitions.

Use three initial spreads: three-card (Past, Present, Future), five-card
(Situation, Challenge, Past, Future, Advice), and the ten-card Celtic Cross.
The card model includes an orientation field, but version one always deals
upright cards so reversed meanings can be added later without a data migration.

## User flow

The visitor selects a spread and starts a reading. The app shuffles a fresh
deck, deals the chosen positions face down, and reveals a card when its
position is activated. The detail panel shows the card name, position meaning,
and an original upright interpretation. Users can reveal all cards or begin a
new reading, which discards all current state.

The UI must work on mobile and desktop, support keyboard operation, expose
card names and states to assistive technology, and honor reduced-motion
preferences. Any shuffle/deal animation must be brief and skippable.

## Assets and licensing

Use only an explicitly identified public-domain scan of the original 1909
Rider-Waite-Smith card faces. Keep the exact URL, artist credit for Pamela
Colman Smith, publication year, and public-domain basis in `ATTRIBUTION.md`.
Do not use publisher logos, modern restorations, card backs, or guidebook text.
Create original card-back art and interpretation copy. License project-created
code and assets under MIT.

## Quality and delivery

Use TDD with Vitest and React Testing Library. Tests must cover unique dealing,
all 78 deck entries, spread positions, reveal/reset behavior, and accessible
controls. ESLint and Prettier enforce code quality. GitHub Actions must run
format checking, linting, tests, and the production build on pull requests.
Deploy the static Vite build to GitHub Pages.

Initialize version control before application scaffolding. The initial commit
may land directly on `main`; every later change must use a short-lived branch
and a pull request. Configure GitHub branch protection so passing CI is required
and direct pushes to `main` are blocked.
