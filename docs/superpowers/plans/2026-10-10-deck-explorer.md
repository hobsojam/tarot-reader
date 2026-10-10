# Deck Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inline, meaning-led deck explorer to the reading setup, allowing readers to browse all 78 cards, search upright and reversed interpretations together, filter by arcana or suit, and inspect a selected card without affecting a reading.

**Architecture:** Extend the card domain with authored taxonomy, then put canonical-order matching in a pure domain helper. Keep the explorer presentational and controlled by setup-level state in `App`, so a search, filter, and selection survive a completed reading and return to setup. Render the grid and responsive complementary detail panel from the helper's results.

**Tech Stack:** React, TypeScript, Vite, Vitest, React Testing Library, CSS Grid.

**Spec:** `docs/superpowers/specs/2026-10-10-deck-explorer-design.md`

## File structure

- Modify: `src/domain/card.ts` — add explicit arcana and suit types to `Card`.
- Modify: `src/data/cards.ts` — author taxonomy for Major Arcana and generated Minor Arcana cards.
- Create: `src/domain/deck-explorer.ts` — pure filter and meaning-search functions/types.
- Create: `src/domain/deck-explorer.test.ts` — taxonomy and search/filter behavior tests.
- Create: `src/components/DeckExplorer.tsx` — accessible controlled explorer UI, card grid, and detail panel.
- Create: `src/components/DeckExplorer.test.tsx` — interaction and accessible-detail tests.
- Modify: `src/App.tsx` — own explorer state and render it during setup while preserving it across readings.
- Modify: `src/App.test.tsx` — integration test for setup visibility and retained explorer state.
- Modify: `src/App.css` — explorer grid/detail layout and narrow-screen stacking.

## Task 1: Add authored taxonomy and pure meaning search

**Files:**

- Modify: `src/domain/card.ts`
- Modify: `src/data/cards.ts`
- Create: `src/domain/deck-explorer.ts`
- Create: `src/domain/deck-explorer.test.ts`

- [ ] **Step 1: Write the failing domain tests.**

  Cover these externally visible rules:

  - every Major Arcana card is `major` and has no suit;
  - every Minor Arcana card is `minor` and has the expected one of four suits;
  - an empty or whitespace-only query returns input cards in canonical supplied order;
  - case-insensitive matching finds a card through a theme, upright meaning, and reversed meaning;
  - a card name alone is not a meaning-search match;
  - each category filter returns only the requested arcana or suit.

- [ ] **Step 2: Run the focused test and confirm it fails.**

  Run: `npm test -- deck-explorer`

  Expected: failure because the deck-explorer module and card taxonomy do not yet exist.

- [ ] **Step 3: Extend the card domain.**

  In `src/domain/card.ts`, add exported `Arcana` (`'major' | 'minor'`) and `Suit` (`'wands' | 'cups' | 'swords' | 'pentacles'`) types. Add required `arcana` and optional `suit` fields to `Card`; `DealtCard` continues to inherit them.

- [ ] **Step 4: Author taxonomy in the source data.**

  Mark mapped Major Arcana objects with `arcana: 'major'`. Change the local Minor Arcana suit source to carry the canonical lowercase `Suit` value alongside its display name and meaning phrase, and emit `arcana: 'minor'` plus that `suit` value for each generated card. Do not derive taxonomy from rendered IDs or card names.

- [ ] **Step 5: Implement the pure explorer helper.**

  Create `src/domain/deck-explorer.ts` with:

  ```ts
  export type DeckExplorerFilter = 'all' | Arcana | Suit

  export function filterDeckCards(
    cards: readonly Card[],
    search: string,
    filter: DeckExplorerFilter,
  ): readonly Card[]
  ```

  Trim and lowercase the query. Match only a joined card's `themes`, `uprightMeaning`, and `reversedMeaning`; do not include `name`. Apply the requested filter and use `Array.prototype.filter` so supplied order stays intact.

- [ ] **Step 6: Run focused tests, then commit the completed task.**

  Run: `npm test -- deck-explorer`

  Expected: all deck-explorer tests pass.

  Commit: `Add deck explorer search data`

## Task 2: Build the accessible, controlled explorer component

**Files:**

- Create: `src/components/DeckExplorer.tsx`
- Create: `src/components/DeckExplorer.test.tsx`

- [ ] **Step 1: Write the failing component tests.**

  Render a small deterministic card fixture or the real deck and verify:

  - the explorer has an `Explore the deck` heading, labelled `Search meanings` field, six category controls, and initial result count;
  - result cards are labelled buttons whose card names are visible;
  - activating a card exposes a complementary `Card details` region with its image alt text, themes, upright meaning, and reversed meaning;
  - changing search or category so it excludes the selected card clears the detail region;
  - no matches displays exactly `No cards match this meaning yet.`

- [ ] **Step 2: Run the focused test and confirm it fails.**

  Run: `npm test -- DeckExplorer`

  Expected: failure because the component does not exist.

- [ ] **Step 3: Implement a controlled component.**

  Add `DeckExplorer` props for `cards`, `search`, `filter`, `selectedCardId`, and callbacks for each. Use `filterDeckCards` to derive results. Derive the selected card from the current results rather than retaining a stale object. When a newly derived result list no longer contains `selectedCardId`, notify the parent to clear selection.

  Render a semantic explorer section with a `Search meanings` label, named filters, visible count, and a compact result grid. Use the existing public card-face naming convention to show local face images with descriptive alt text. Do not show interpretation excerpts in grid items.

  The selected card's detail lives in an `aside` or equivalent complementary region labelled `Card details`, with themes and separate `Upright meaning` and `Reversed meaning` headings. Maintain button keyboard activation through native buttons.

- [ ] **Step 4: Run focused tests, then commit the completed task.**

  Run: `npm test -- DeckExplorer`

  Expected: all component tests pass.

  Commit: `Add deck explorer component`

## Task 3: Integrate setup state and responsive layout

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write failing setup integration tests.**

  Verify that setup initially exposes the explorer and all-card count. Search for and select a card, start a reading, use `New reading`, then assert the same query and selected detail return. This specifically guards against putting state only inside a conditionally unmounted explorer.

- [ ] **Step 2: Run the focused test and confirm it fails.**

  Run: `npm test -- App`

  Expected: failure because setup does not render the deck explorer or retain its state.

- [ ] **Step 3: Add setup-level explorer state and integrate it.**

  In `App`, own search text, selected `DeckExplorerFilter`, and selected card ID independently from `ReadingSession`. Render `DeckExplorer` after the spread/focus/start controls only while setup is displayed. Starting or resetting a reading must not reset those explorer fields. Pass the canonical `cards` dataset and controlled values/callbacks to the component.

- [ ] **Step 4: Add responsive styles.**

  Add namespaced explorer CSS:

  - a two-column `grid-template-columns: minmax(0, 1fr) minmax(16rem, 24rem)` wrapper for result grid and detail on desktop;
  - a compact responsive card grid whose columns cannot force horizontal overflow;
  - a one-column media-query layout that places the detail after the grid on narrow widths;
  - sensible image sizing, selected-card indication, and setup-aligned spacing.

  Preserve existing Celtic Cross and reading workspace breakpoints and styles.

- [ ] **Step 5: Run focused tests, then commit the completed task.**

  Run: `npm test -- App`

  Expected: App tests pass, including explorer state retention through a new reading.

  Commit: `Integrate deck explorer into setup`

## Task 4: Verify the full feature

**Files:**

- Verify modified and created files above only.

- [ ] **Step 1: Run formatting and quality checks.**

  Run:

  ```sh
  npm run lint
  npm run format:check
  npm test
  npm run build
  git diff --check
  ```

  Expected: every command exits successfully with no formatting, type, test, build, or whitespace errors.

- [ ] **Step 2: Review the completed diff against the design.**

  Confirm that all 78 cards appear initially, card names are not searched, both orientations are searched, filters retain canonical order, selection clears when excluded, no-result text is exact, and CSS contains a narrow-screen single-column rule.

- [ ] **Step 3: Request code review before preparing a PR.**

  Address only substantiated findings, re-run the affected checks, then make any necessary review-fix commit.

- [ ] **Step 4: Prepare the branch for a pull request.**

  Report the commits and verification evidence. Push and open a PR only when the user asks for a PR; do not merge locally or push directly to `main`.

## Review focus

- A reversed-only term must find a card; checking upright text alone is insufficient.
- Trimming and case-folding must not reorder cards or make card names searchable.
- A selected card must disappear from the complementary detail panel immediately when a query/filter excludes it.
- Explorer state must live above the conditional setup/reading branch so `New reading` restores it.
- The desktop two-column CSS must have a narrow-screen one-column counterpart without affecting the existing reading workspace.
