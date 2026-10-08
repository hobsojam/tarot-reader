# Position-Aware Interpretations Design

## Goal

Make a card's reading responsive to its position without maintaining an
unscalable 78-card-by-position matrix.

## Composition

Card data supplies its upright or reversed core meaning. Spread-position data
supplies a distinct interpretive lens and curated sentence templates. The
detail panel shows the card meaning, position prompt, and a short synthesized
reading. For example, the `Self` lens can frame belonging or stability as a
resource the querent brings to the situation.

Templates must be position-specific and use card metadata such as themes or
keywords. They must not imply bespoke prediction text for every combination.

## Future scope

Card-to-card influence belongs in a later reading-level synthesis feature,
triggered only by meaningful spread patterns—not a 78×78 lookup table.

## Acceptance criteria

- Every supported position has a distinct lens and synthesis template.
- The detail panel makes card meaning, position meaning, and synthesis clear.
- Reversal orientation can feed into synthesis after reversed content exists.
