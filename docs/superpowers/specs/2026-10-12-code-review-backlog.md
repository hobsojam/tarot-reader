# Code Review Backlog

## Purpose

This records the issues raised by the 2026-10-12 code review of `main` at
`d91191a`. It adds to the
[2026-10-11 polish and remediation backlog](2026-10-11-polish-and-remediation-backlog.md)
and does not repeat items already listed there. Each issue states what it is
for and when it is done. As with that backlog, an item is not approved for
implementation until it has its own design and plan.

Items the review confirmed are already in the earlier backlog:

- **Image weight:** about 51 MB of PNGs, with no `width`/`height` on card
  images. See _Optimise card imagery for browsing_. Add intrinsic dimensions
  or an `aspect-ratio` as part of that work to prevent layout shift.
- **Reduced motion:** smooth scrolling ignores `prefers-reduced-motion`. See
  _Honour reduced-motion preferences_.
- **Spread not stored in the session:** see _Keep a reading's spread inside
  its session_. Item 4 below now makes this part of a wider refactor.
- **Card-back attribution conflict:** see _Correct card-back attribution_.

## Priority 0 — Reading quality

### 1. Give every card a distinct interpretation

**Status: Complete (2026-10-14).**

`src/data/cards.ts` builds all 56 Minor Arcana cards from templates. All
fourteen cards in a suit share one theme (for example, every Wands card is
"creative energy"). Upright meanings are just
`` `${rank} invites reflection on ${theme}` ``. `synthesizeReadingNarrative`
and `synthesizeInterpretation` use only `themes[0]` and never the card's
meaning. As a result, two different cards from the same suit produce the same
narrative sentence in the same position, for example Five of Swords and
Knight of Swords.

**Done when:**

- Every one of the 78 cards has original upright and reversed meanings and
  at least two themes that set it apart from the other cards in its suit.
- The narrative and the contextual interpretation use the meaning for the
  dealt orientation, or a card-specific theme, not only a suit-level theme.
- Tests assert that no two cards share an upright meaning, a reversed
  meaning, or an identical theme list.
- The new text is original and MIT-licensed. Nothing is copied from modern
  guidebooks (see `AGENTS.md`).

## Priority 1 — Supply chain and CI

### 2. Add a Dependabot cooldown and a dependency audit

**Status: Complete (2026-10-14).**

At review, `.github/dependabot.yml` had no cooldown, and CI did not audit installed
dependencies. Project policy requires both.

**Done when:**

- Every ecosystem block in `dependabot.yml` has `cooldown: default-days: 7`.
- CI runs `npm audit --audit-level=high` (or an agreed threshold) and fails
  on findings.

### 3. Keep the deploy workflow in line with CI

**Status: Complete (2026-10-14).**

At review, `deploy-pages.yml` deployed whatever was on `main` without running
lint, format, or tests. It pinned `actions/checkout@v6` and
`actions/setup-node@v6` while CI used `@v7`. It also installed with
`npm ci --ignore-scripts`, which CI did not.

**Done when:**

- Both workflows use the same action versions and install flags.
- The deploy job either runs the same verification steps or depends on a
  shared reusable workflow, so a failing tree cannot be deployed.

## Priority 2 — Maintainability

### 4. Move reading-session logic out of `App.tsx`

**Status: Complete (2026-10-14).**

`App.tsx` holds eight pieces of `useState` and builds the reading inline: the
selected position index, the revealed card/position pairs for the narrative,
the reflection anchor lookup, and reading completion. It uses non-null
assertions on `spreads.find(...)!` and `readingFocuses.find(...)!`. Related
problems:

- The workspace class still checks `selectedSpread.id === 'celtic-cross'`,
  while `ReadingBoard` already uses `reading-board--${spread.id}`.
- The Reflection section repeats the "Reading so far" narrative word for word
  under "Completed thread".
- `src/domain/deck.ts` imports `src/data/cards`, so the domain layer depends
  on the data layer.

**Done when:**

- A React-independent domain module (for example `src/domain/reading-session.ts`)
  owns starting, revealing, revealing all, and the derived values listed
  above. A reducer or small hook in the UI wraps it.
- The session captures its spread, which also closes the earlier backlog
  item.
- Lookups return typed results without non-null assertions.
- Spread-specific class names come from `spread.id` everywhere.
- `createDeck` takes its cards as an argument, or the deck is built in
  `src/data/`, so `src/domain/` has no imports from `src/data/` outside
  tests.
- Reflection adds something new rather than repeating the narrative.
- Behaviour tests in `App.test.tsx` keep passing unchanged, and the new
  module has its own unit tests.

### 5. Derive explorer selection instead of syncing it with effects

**Status: Complete (2026-10-14).** Selection is cleared by the search and
category handlers, while click-event detail distinguishes keyboard activation
from pointer activation. Browser coverage verifies both focus paths.

`DeckExplorer.tsx` uses an effect to call `onSelectCard(null)` when a filter
hides the selected card. That is setting state from an effect to repair
derived state, and it costs an extra render. The keyboard-focus work adds
three refs (`keyboardSelectionPending`, `previousSelectedCardId`,
`cardButtonRefs`) to tell keyboard selection apart from mouse selection.
`keyboardSelectionPending` is set on `keydown`, but Space activates a button
on `keyup`, so the flag can be left set if focus leaves before the key is
released. The scroll effect calls `showDetails` without listing it as a
dependency, which is an `exhaustive-deps` warning.

**Done when:**

- The selection is cleared in the search and filter change handlers, or is
  simply treated as hidden while filtered out, not cleared from an effect.
- Keyboard and pointer selection are told apart without a flag that can be
  left set by an interrupted key press. For example, use `event.detail === 0`
  on the click event, or move focus inside the click handler.
- `npm run lint` reports no warnings in `DeckExplorer.tsx`.
- The existing explorer focus tests and browser tests still pass.

### 6. Remove `TarotCard`'s duplicate keyboard handler

**Status: Complete (2026-10-14).**

`TarotCard` renders a native `<button>` and also handles Enter and Space in
`onKeyDown`. A native button already does this, so the handler is redundant
and changes how keyboard activation works.

**Done when:** The `onKeyDown` handler is removed and the existing keyboard
reveal test still passes using native button activation.

## Priority 3 — Accessibility and tidy-up

### 7. Fix the heading structure in readings

**Status: Complete (2026-10-14).**

Every board position renders its label as an `<h2>`, so a Celtic Cross
reading has ten board headings at the same level as "Reading order", "Reading
so far", and the detail panel. Navigating by heading becomes noisy.

**Done when:** Position labels are no longer peers of the page's section
headings. They become a lower heading level or a non-heading label, and the
card button keeps the position in its accessible name. The page outline is
checked with a test or browser assertion.

### 8. Remove unused Vite scaffold assets

**Status: Complete (2026-10-14).**

`src/assets/hero.png`, `react.svg`, and `vite.svg` are left over from the
starter template and are not referenced anywhere.

**Done when:** The files are deleted and lint, tests, and build still pass.

### 9. Decide whether card names are searchable

**Status: Complete (2026-10-14).** Card-name search remains intentionally
excluded. The visible, scrollable deck and category controls are the browsing
path; the search label makes clear that it searches meanings only.

The deck explorer deliberately excludes card names from meaning search, and
a test protects that choice. Readers who type "Tower" or "Queen" get no
results, which can look like a bug.

**Done when:** A design decision is recorded. Either card names become a
secondary match, ranked after meaning matches, or the empty state explains
that search covers meanings only and suggests using categories.

## Suggested delivery order

1. Distinct card interpretations (item 1).
2. Supply-chain and CI alignment (items 2–3). These are small and
   independent, so they can be done at any time.
3. The reading-session refactor (item 4), together with the earlier
   session-spread item.
4. Explorer state and keyboard simplification (items 5–6), coordinated with
   the reduced-motion work.
5. Headings, scaffold cleanup, and the search decision (items 7–9).

## Non-goals

- No accounts, persistence, analytics, backend, or AI-generated
  interpretation.
- No change to the static React/Vite architecture.
