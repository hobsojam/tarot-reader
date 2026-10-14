# Guided Journey Design

## Purpose

Finish the remaining reading-quality and interaction work while giving the
static tarot reader a calm, quiet-occult visual language. The experience
should make the next meaningful action clear without becoming a tutorial or
asking readers to choose a presentation style.

Readers retain the meaningful choices already in the application: spread,
focus, optional question, and which card to reveal. The presentation adapts
to screen size automatically; it does not offer selectable layout modes or
persist visual preferences.

## Scope

This delivery incorporates two existing, unmerged branches after reconciling
them with current `main`:

- `feature/distinct-card-data`: original, distinct upright and reversed
  interpretations and themes for all 78 cards.
- `refactor/reading-session`: a React-independent reading-session domain
  module that captures the active spread and owns derived reading state.

It also completes the open Explorer-state remediation, records the deliberate
no-name-search decision, and adds the guided-journey visual and copy pass.

It does not add accounts, persistence, analytics, a backend, generated
interpretations, configurable layouts, or a card-name search mode.

## Architecture

### Card data

`src/data/cards.ts` becomes an explicit source of original card-specific
content. Every card has a unique upright meaning, unique reversed meaning,
and at least two themes that distinguish it from cards in the same suit.
Interpretation and narrative functions use the dealt orientation's meaning or
the card-specific themes rather than a suit template.

### Reading session

`src/domain/reading-session.ts` owns an active reading and the pure operations
that transition it: start, reveal one position, reveal all positions, and
derive selected-card, revealed-position, narrative, completion, and
reflection-anchor values. A session stores its `Spread`, rather than relying
on mutable setup selection. `createDeck` accepts cards as an argument so the
domain layer remains independent from `src/data/`.

`App.tsx` remains the composition layer. It owns only setup controls,
Explorer query/filter/selection state, and whether the optional reflection is
expanded; it delegates active-reading state changes and derivations to the
session module. Typed lookup helpers replace non-null assertions.

### Explorer interaction

The Explorer continues to support meaning search and category filters. It
does not search card names: the visible deck, categories, and scrollable grid
are the intentional card-browsing path. The search label remains explicit
about meaning search.

Selection is derived from the currently visible cards. Search/filter handlers
clear an invalid selection directly, rather than an effect repairing state.
The selected card's click event distinguishes keyboard activation from a
pointer activation without a keydown flag that can be stranded. Keyboard
activation scrolls the detail panel into view and moves focus to it; pointer
activation scrolls without stealing focus. The existing Back to deck button
returns focus to the selected card. Reduced-motion preference still makes the
scroll instant.

### Guided journey and visual system

Define semantic CSS custom properties for warm parchment surfaces, ink text,
muted indigo and moss accents, borders, and focus treatment. Use a restrained
serif display face where the existing font stack supports it and a readable
body face elsewhere. The design must meet existing contrast and focus
expectations; color is never the sole carrier of state.

The app has four states with one clear contextual cue:

| State            | Primary cue/action                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Setup            | "Begin reading" starts the selected spread. Explorer browsing remains optional below setup.                   |
| Partial reading  | State text invites the reader to reveal a card; each unrevealed card remains independently selectable.        |
| Complete reading | State text invites reflection; the reflection control becomes available while New reading remains secondary.  |
| Reflection       | The reflection section presents a distinct closing prompt and anchor card, not a duplicate of Reading so far. |

Do not add a wizard, a required card order, a persistent dashboard/side rail,
or decorative motion. Existing responsive layouts, semantic headings, native
buttons, visible focus, and reduced-motion protections remain intact.

## Acceptance Criteria

- All 78 cards have distinct original upright/reversed meanings and theme
  lists; interpretation and narrative output uses dealt card content.
- An active session captures its spread; changing future setup controls cannot
  change an active reading's positions or derived values.
- `src/domain/` does not import card data; all session transitions and derived
  values have deterministic domain tests.
- Explorer filtering/searching cannot leave a hidden selection; keyboard and
  pointer activation have the distinct focus behavior above; lint emits no
  `DeckExplorer` warnings.
- The search experience documents and preserves the no-name-search decision.
- Setup, partial-reading, complete-reading, and reflection states present the
  stated contextual guidance, with reflection contributing new content.
- The quiet-occult token system is consistently applied without compromising
  contrast, mobile layout, visible focus, or reduced-motion behavior.
- Unit, browser, lint, format, image-integrity, build, and CI checks pass.

## Verification

- Add deterministic data and session unit tests, including uniqueness,
  reversed orientation, captured-spread behavior, reveal-all selection, and
  reflection derivation.
- Preserve and extend React Testing Library coverage for Explorer selection,
  filtering, guided-state copy, and non-duplicated reflection content.
- Extend Playwright coverage for keyboard versus pointer Explorer activation,
  reduced motion, and a guided reading through completion on phone and desktop
  viewports.
- Run `npm run lint`, `npm run format:check`, `npm run images:check`, `npm
test`, `npm run build`, `npm run test:e2e`, and `git diff --check` before
  requesting review.
