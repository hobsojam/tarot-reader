# Optional Reversal Mechanics Design

## Goal

Offer an opt-in reversal mode without changing upright-only readings.

## Behavior

The control defaults off. When enabled, each dealt card independently receives
a 20% reversal chance after shuffle/deal; shuffling determines order and a
separate random draw determines orientation. Orientation is stored on the
dealt-card instance, never the canonical deck entry.

Reversed cards rotate 180 degrees, retain their fixed card frame, and expose
their state in the accessible name. Random sources are injectable for tests.

## Acceptance criteria

- Disabled mode deals only upright cards.
- Enabled mode uses `random() < 0.2` per dealt card.
- New readings discard orientation state.
- Image rotation never shifts the spread layout.
