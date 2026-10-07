# Tarot Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a static, accessible React tarot simulator that deals upright cards into three standard spreads.

**Architecture:** React components render spread definitions and client-side reading state. Framework-independent deck and spread modules own validation, shuffling, and dealing. Static card metadata and original interpretations are bundled with the app; no data leaves the browser.

**Tech Stack:** React, TypeScript, Vite, Vitest, React Testing Library, ESLint, Prettier, GitHub Actions, Dependabot, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-07-tarot-simulator-design.md`

## Global Constraints

- Use TypeScript, two-space indentation, ESLint, and Prettier.
- Follow TDD: write and run a failing test before implementation, then refactor with tests green.
- Version one has no backend, accounts, persistence, analytics, AI, custom spreads, or reversed-card interpretations.
- Deal only upright cards, while retaining an `orientation` field for future reversed readings.
- Use public-domain original Rider-Waite-Smith faces only after recording their precise provenance in `ATTRIBUTION.md`; never use modern deck scans, logos, card backs, or copied guidebook text.
- All post-initial changes use a branch and pull request; CI must pass before merge.

## Review Focus

- A shuffle always contains exactly 78 distinct canonical card identifiers.
- A spread cannot deal the same card into two positions.
- Starting or resetting a reading discards all prior revealed state.
- Keyboard users can select a spread and reveal every dealt card with an accessible name and state.
- Narrow mobile screens retain every position label and card control without horizontal page overflow.

---

## File Structure

- `src/domain/card.ts` — card, orientation, and dealt-card types.
- `src/domain/deck.ts` — canonical deck construction and Fisher-Yates shuffle/deal operations.
- `src/domain/spread.ts` — spread and position interfaces.
- `src/data/cards.ts` — static, original card names and upright interpretation copy.
- `src/data/spreads.ts` — three-card, five-card, and Celtic Cross definitions.
- `src/components/SpreadPicker.tsx` — selectable spread controls.
- `src/components/TarotCard.tsx` — face-down/revealed, accessible card control.
- `src/components/ReadingBoard.tsx` — layout and reveal orchestration.
- `src/components/ReadingDetail.tsx` — selected-card interpretation panel.
- `src/App.tsx` — reading-session state and reset/reveal-all actions.
- `src/**/*.test.ts(x)` — unit and component behavior tests beside source.
- `.github/workflows/ci.yml` — pull-request quality gates.
- `.github/dependabot.yml` — weekly npm and GitHub Actions updates.
- `ATTRIBUTION.md` — card-face provenance and public-domain basis.
- `LICENSE` — MIT license for project-created material.

### Task 1: Establish the static application and quality baseline

**Files:**

- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/index.css`, `.gitignore`, `eslint.config.js`, `.prettierrc.json`
- Create: `README.md` development-command updates as needed

**Interfaces:**

- Produces: `npm run dev`, `npm test`, `npm run lint`, `npm run format:check`, and `npm run build`.

- [ ] **Step 1: Scaffold a React + TypeScript Vite app in the repository without replacing existing documentation.**

- [ ] **Step 2: Add the failing smoke test in `src/App.test.tsx`.**

```tsx
it('renders the tarot simulator heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /tarot reader/i })).toBeVisible()
})
```

- [ ] **Step 3: Run `npm test -- --run src/App.test.tsx` and verify the test fails because `App` has not rendered the heading.**

- [ ] **Step 4: Implement the minimal `App` heading and configure Vitest with React Testing Library.**

- [ ] **Step 5: Configure ESLint and Prettier, including `format`, `format:check`, `test`, and `test:watch` scripts.**

- [ ] **Step 6: Run `npm run lint && npm run format:check && npm test && npm run build`; verify all commands exit successfully.**

- [ ] **Step 7: Commit the baseline.**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json index.html src .gitignore eslint.config.js .prettierrc.json README.md
git commit -m "chore: scaffold React application"
```

### Task 2: Add licensing, automated quality checks, and dependency updates

**Files:**

- Create: `LICENSE`, `ATTRIBUTION.md`, `.github/workflows/ci.yml`, `.github/dependabot.yml`
- Modify: `README.md`

**Interfaces:**

- Consumes: Task 1 npm scripts.
- Produces: CI verification for every pull request and weekly Dependabot PRs.

- [ ] **Step 1: Add the MIT `LICENSE` for project-created code, UI, card back, and interpretation copy.**

- [ ] **Step 2: Add `ATTRIBUTION.md` with a pre-asset checklist requiring the exact file source URL, Pamela Colman Smith credit, 1909 publication reference, and public-domain basis before card faces are committed.**

- [ ] **Step 3: Add `.github/workflows/ci.yml` to run `npm ci`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build` on pull requests.**

- [ ] **Step 4: Add `.github/dependabot.yml` with weekly `npm` and `github-actions` updates, a `dependencies` label, and `open-pull-requests-limit: 5`.**

- [ ] **Step 5: Verify the YAML structure locally and run all Task 1 quality commands.**

- [ ] **Step 6: Commit the tooling configuration.**

```bash
git add LICENSE ATTRIBUTION.md README.md .github
git commit -m "chore: add project automation"
```

### Task 3: Model and test the tarot deck

**Files:**

- Create: `src/domain/card.ts`, `src/domain/deck.ts`, `src/domain/deck.test.ts`, `src/data/cards.ts`

**Interfaces:**

- Produces: `type Orientation = 'upright'`, `interface Card { id: string; name: string; uprightMeaning: string }`, `createDeck(): Card[]`, `shuffleDeck(cards: readonly Card[], random: () => number): Card[]`, and `deal(deck: readonly Card[], count: number): { dealt: Card[]; remaining: Card[] }`.

- [ ] **Step 1: Write failing tests asserting `createDeck()` has 78 unique IDs and `deal()` returns unique cards without mutating its input.**

- [ ] **Step 2: Run `npm test -- --run src/domain/deck.test.ts` and verify failure because the deck module does not exist.**

- [ ] **Step 3: Implement the card types, complete static card metadata, a non-mutating Fisher-Yates shuffle, and validated dealing. Reject counts outside the remaining deck size.**

- [ ] **Step 4: Add a seeded random test proving a shuffled deck preserves every source ID exactly once.**

- [ ] **Step 5: Run `npm test -- --run src/domain/deck.test.ts` and verify all deck tests pass.**

- [ ] **Step 6: Commit the domain model.**

```bash
git add src/domain/card.ts src/domain/deck.ts src/domain/deck.test.ts src/data/cards.ts
git commit -m "feat: add tarot deck domain"
```

### Task 4: Define and validate the supported spreads

**Files:**

- Create: `src/domain/spread.ts`, `src/data/spreads.ts`, `src/data/spreads.test.ts`

**Interfaces:**

- Produces: `interface SpreadPosition { id: string; label: string; row: number; column: number }`, `interface Spread { id: 'three-card' | 'five-card' | 'celtic-cross'; name: string; positions: readonly SpreadPosition[] }`, and `spreads: readonly Spread[]`.

- [ ] **Step 1: Write failing tests asserting the three spreads have 3, 5, and 10 uniquely identified positions and the specified position labels.**

- [ ] **Step 2: Run `npm test -- --run src/data/spreads.test.ts` and verify failure because no spread definitions exist.**

- [ ] **Step 3: Implement immutable definitions for Past/Present/Future; Situation/Challenge/Past/Future/Advice; and the ten named Celtic Cross positions. Use row/column coordinates only for layout, not reading semantics.**

- [ ] **Step 4: Run `npm test -- --run src/data/spreads.test.ts` and verify the definitions pass.**

- [ ] **Step 5: Commit the spread definitions.**

```bash
git add src/domain/spread.ts src/data/spreads.ts src/data/spreads.test.ts
git commit -m "feat: add tarot spreads"
```

### Task 5: Build the accessible reading interaction

**Files:**

- Create: `src/components/SpreadPicker.tsx`, `src/components/TarotCard.tsx`, `src/components/ReadingBoard.tsx`, `src/components/ReadingDetail.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`, `src/index.css`
- Test: `src/components/ReadingBoard.test.tsx`, `src/App.test.tsx`

**Interfaces:**

- Consumes: `spreads`, `createDeck`, `shuffleDeck`, `deal`, `Card`, and `Spread`.
- Produces: a local reading session containing spread ID, dealt cards, revealed-position IDs, and selected-position ID.

- [ ] **Step 1: Write failing component tests for selecting the three-card spread, dealing three face-down positions, and revealing one card by keyboard activation.**

- [ ] **Step 2: Run the focused component tests and verify failure because reading components do not exist.**

- [ ] **Step 3: Implement `SpreadPicker` as labelled controls and `ReadingBoard` as a CSS-grid rendering of the selected spread. Deal from a fresh shuffled deck only when a reading starts.**

- [ ] **Step 4: Implement `TarotCard` as a button with an accessible label that distinguishes face-down from revealed state; implement `ReadingDetail` using the selected card's name, position label, and upright meaning.**

- [ ] **Step 5: Add failing tests for `Reveal all` and `New reading`, then implement both actions so reset discards prior card and reveal state.**

- [ ] **Step 6: Add responsive styling and a reduced-motion media query; verify narrow viewport layout avoids page-level horizontal overflow.**

- [ ] **Step 7: Run `npm run lint && npm run format:check && npm test && npm run build`; verify all commands exit successfully.**

- [ ] **Step 8: Commit the reading experience.**

```bash
git add src/components src/App.tsx src/App.test.tsx src/index.css
git commit -m "feat: add interactive readings"
```

### Task 6: Add approved card faces and GitHub Pages deployment

**Files:**

- Create: `public/cards/` image files, `.github/workflows/deploy-pages.yml`
- Modify: `ATTRIBUTION.md`, `src/components/TarotCard.tsx`, `vite.config.ts`, `README.md`
- Test: `src/components/TarotCard.test.tsx`

**Interfaces:**

- Consumes: Task 5's `Card.id` file naming convention.
- Produces: `public/cards/<card-id>.png` and a static GitHub Pages deployment.

- [ ] **Step 1: Select an explicitly public-domain original 1909 RWS scan set and record its exact URL and provenance in `ATTRIBUTION.md` before downloading or committing any card face.**

- [ ] **Step 2: Write a failing `TarotCard` test asserting revealed cards render the matching local image with descriptive alt text while face-down cards do not expose the card identity.**

- [ ] **Step 3: Add normalized public-domain card files named from canonical `Card.id` values and implement image rendering in `TarotCard`.**

- [ ] **Step 4: Run the focused card test and verify it passes.**

- [ ] **Step 5: Configure Vite's GitHub Pages base path and add a deployment workflow triggered by pushes to `main` after CI succeeds.**

- [ ] **Step 6: Build locally and verify assets resolve under the production base path.**

- [ ] **Step 7: Commit deployment and artwork provenance.**

```bash
git add public/cards ATTRIBUTION.md src/components/TarotCard.tsx src/components/TarotCard.test.tsx vite.config.ts .github/workflows/deploy-pages.yml README.md
git commit -m "feat: deploy tarot reader"
```

## Self-Review

- Spec coverage: Tasks 1–2 cover React/Vite, quality, CI, Dependabot, licensing, and no-server delivery. Tasks 3–5 cover the 78-card deck, three spreads, upright orientation, reveal/reset flow, responsive layout, and accessibility. Task 6 covers approved artwork provenance and GitHub Pages.
- Step scan: Each task has explicit files, interfaces, failing-test evidence where executable behavior is added, a verification command, and an isolated commit.
- Type consistency: Task 3 produces `Card`; Task 4 produces `Spread`; Task 5 consumes both; Task 6 uses Task 3's canonical `Card.id` for asset naming.
- Review focus: Deck uniqueness is tested in Task 3; unique positions in Task 4; reset/reveal-all and keyboard reveal in Task 5; narrow-screen behavior in Task 5.
- Proportion: The plan describes interfaces and verification without embedding implementation bodies.
