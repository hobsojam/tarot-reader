# Reversed Interpretations Design

## Dependency

Requires `2026-10-08-reversal-mechanics-design.md`.

## Goal

Give reversed cards original, useful interpretation copy rather than merely
labelling upright copy as reversed.

## Content model

Each card gains original `reversedMeaning` text. It describes an altered form
of the upright theme—such as blocked, internalized, delayed, excessive, or
released—rather than mechanically asserting the opposite. The detail panel
selects copy from the dealt orientation and identifies the orientation.

## Acceptance criteria

- Every one of the 78 cards has original reversed copy.
- Reversed detail content never silently falls back to upright copy.
- Reversals are not presented as inherently negative.
