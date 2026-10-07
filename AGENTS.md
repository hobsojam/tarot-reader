# Repository Guidelines

## Project Structure & Module Organization

The app is a static React/Vite tarot simulator. Keep UI and domain code in
`src/`, tests beside their modules as `*.test.ts(x)`, and public card images in
`public/cards/`. Store deck, spread, and interpretation data in `src/data/`.
Keep public-domain artwork provenance in `ATTRIBUTION.md`; do not add modern
deck scans, publisher branding, or generated build output to source control.

## Build, Test, and Development Commands

Use the following npm commands once the Vite project is initialized:

```sh
npm run dev          # Start the local development server
npm test             # Run the Vitest suite once
npm run test:watch   # Run tests while developing
npm run lint         # Run ESLint
npm run format:check # Check Prettier formatting
npm run build        # Type-check and produce the production build
```

Run `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`
before opening a pull request. GitHub Actions must run the same checks.

## Coding Style & Naming Conventions

Use TypeScript, two-space indentation, ESLint, and Prettier. Use `PascalCase`
for React components, `camelCase` for functions and variables, and
`kebab-case` for file names. Keep deck logic independent of React components.
Use test-driven development: add a failing behavior-focused test before its
implementation, then refactor only while the suite remains green.

## Testing Guidelines

Use Vitest and React Testing Library. Name tests after behavior, such as
`deals each card only once`. Keep tests deterministic; inject or seed random
sources when testing shuffles. Cover deck uniqueness, spread positions,
reveal/reset behavior, and accessible card controls.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects, such as `Add Celtic Cross layout` or
`Fix reading reset`. Keep commits narrowly scoped. Pull requests should
explain the change, list verification commands, link any relevant issue, and
include screenshots for visible UI changes.

After the initial repository commit, never push directly to `main`. Create a
short-lived branch such as `feature/deck-shuffle` or `fix/reveal-reset`, push
it, and merge through a pull request only after required CI checks pass. Enable
GitHub branch protection on `main` to enforce this policy.

## Licensing & Deployment

License original code, UI, card backs, and interpretation text under MIT.
Record the exact public-domain Rider-Waite-Smith card-face source in
`ATTRIBUTION.md`. Deploy only the static build to GitHub Pages; do not add
accounts, persistence, analytics, or a backend without an explicit decision.
