# Deck Explorer Design

## Goal

Add a meaning-led deck explorer to the setup screen so a reader can browse all
78 cards, search for ideas expressed by card meanings, compare results, and
inspect upright and reversed interpretations before starting a reading.

## Scope

- Keep the explorer inline on the setup screen, below the existing spread and
  focus controls.
- Show the whole deck by default, with a visible result count.
- Search card themes, upright meanings, and reversed meanings together.
- Filter results by All cards, Major Arcana, Wands, Cups, Swords, or
  Pentacles.
- Open selected-card detail in a desktop side panel that stacks below the grid
  on narrow screens.
- Keep explorer state local to setup and independent from reading setup and
  active reading state.

## Non-goals

- Do not add accounts, persistence, analytics, a backend, or AI-generated
  interpretation.
- Do not make card-name search the primary lookup mechanism.
- Do not alter dealt-card meanings, spread logic, or the reading/reflection
  flow.
- Do not add a separate route or replace the setup screen.

## User experience

The setup screen includes an `Explore the deck` section after its reading
controls. It contains a labelled `Search meanings` input, the six category
filters, and a count such as `78 cards` or `12 cards`.

With no search or filter, the explorer displays all cards in canonical deck
order. Each result is a labelled button showing the local card face and card
name. Selecting a result updates an adjacent `Card details` complementary
region on desktop; on narrow screens that region follows the grid.

The detail region shows the selected card image, its themes, and distinct
`Upright meaning` and `Reversed meaning` sections. Search-result cards stay
compact: matching excerpts belong only in the detail region, not below every
grid item.

If a new query or filter excludes the selected card, selection clears. If no
card matches, the grid is replaced by `No cards match this meaning yet.`

Starting a reading does not consume or mutate explorer state. Returning to
setup with `New reading` preserves the explorer search, filter, and selection
for continued study.

## Data model and search

Extend `Card` with explicit taxonomy:

```ts
type Arcana = 'major' | 'minor'
type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'

interface Card {
  // existing fields
  arcana: Arcana
  suit?: Suit
}
```

Major Arcana cards have `arcana: 'major'` and no suit. Minor Arcana cards have
`arcana: 'minor'` plus their suit. Taxonomy is authored with the existing card
data rather than inferred from an ID at render time.

Provide a pure explorer helper that accepts cards, a search string, and a
filter. It normalizes search input case-insensitively, then matches across the
joined themes, upright meaning, and reversed meaning. It applies the category
filter and returns matches in their supplied canonical order. An empty query
matches every card. Card names are displayed but are not part of meaning-led
search matching.

## Accessibility and responsive layout

- The search input, category controls, result count, card-grid buttons, and
  detail complementary region use explicit accessible names.
- Every card can be selected with keyboard activation.
- Card images have descriptive alt text in both grid and detail contexts.
- The grid/detail wrapper uses two columns at desktop widths and one column on
  narrow screens, without horizontal page overflow.
- Empty search results are communicated as visible text in the explorer
  region.

## Verification

Automated tests cover:

- Every card has valid arcana/suit taxonomy.
- Meaning search finds a card through themes, upright meaning, and reversed
  meaning; empty search preserves canonical order.
- Category filters return only their intended arcana or suit.
- The setup explorer shows all cards and a count initially.
- A search/filter clears a now-invalid selection and shows the no-results
  message when appropriate.
- Selecting a grid card populates upright/reversed detail accessibly.
- Desktop explorer and mobile stacking CSS hooks remain present.

Run `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`
before opening the implementation pull request.
