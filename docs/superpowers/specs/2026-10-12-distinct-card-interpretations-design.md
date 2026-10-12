# Distinct Card Interpretations Design

## Goal

Make every Rider-Waite-Smith card contribute a distinct, calm, reflective
voice to a reading. In particular, Minor Arcana cards must no longer inherit
near-identical suit-level text, and a reversed card must influence both its
detail interpretation and the evolving narrative through its reversed
meaning.

All new interpretation copy is original project material licensed under MIT.
It must not reproduce modern guidebook wording.

## Scope

- Replace generated Minor Arcana copy with explicit records for all 56 cards.
- Normalize Major and Minor Arcana into one authored card-data shape.
- Give every card a unique upright meaning, reversed meaning, and two or
  three card-specific themes.
- Make contextual interpretation and reading narrative use the meaning for
  the dealt orientation, while retaining the spread position's role and
  reading order.
- Add integrity and behaviour tests for the data and synthesis.

## Non-goals

- No new card images, deck, spread, layout, storage, account, or backend
  features.
- No claim that the interpretations are authoritative or predictive.
- No copied text from published tarot guidebooks.

## Data model

`Card` keeps its existing public fields: `uprightMeaning`,
`reversedMeaning`, and `themes`. Card data is authored as explicit typed
records rather than assembled from rank/suit templates. The existing IDs,
names, arcana, and suits remain stable so image paths, deck logic, explorer
filters, and tests continue to work unchanged.

Each meaning is one or two original, reader-facing sentences. Themes are two
or three concise phrases, specific to that card rather than a suit-wide
label. The copy retains the app's non-fatalistic, contemplative tone:
possibility, reflection, and agency rather than prediction or certainty.

## Interpretation behaviour

`getCardMeaning` remains the single orientation selector. Both synthesis
functions call it for every dealt card:

- The card-detail contextual interpretation begins with the selected meaning,
  then frames it through the spread position's existing template and a
  card-specific theme.
- The evolving narrative includes the selected meaning with its position and
  lens. Reversed cards retain an explicit reversed cue.

This preserves the current position-aware reading structure while ensuring a
card's dealt orientation materially changes its contribution.

## Validation and tests

Deck-data tests assert:

- exactly 78 cards;
- non-empty upright and reversed meanings for every card;
- no duplicated upright meanings, reversed meanings, or complete theme lists;
- at least two non-empty themes per card; and
- no unresolved template tokens.

Interpretation tests assert that upright and reversed versions of the same
card produce different contextual and narrative text, and that two different
Minor Arcana cards from one suit produce distinct output at the same spread
position. Existing reading-order, focus-framing, and reversal tests remain.

## Delivery and verification

Implementation changes are limited to card data, interpretation synthesis,
and their tests. The PR runs the repository's standard lint, formatting,
unit, build, and Playwright checks. Manual copy review verifies tone,
originality, and that every entry is present before opening the PR.
