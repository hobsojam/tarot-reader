# Reading Workspace Design

## Goal

Make every spread legible at typical desktop resolutions and explain how to
read it without sacrificing mobile usability.

## Layout

Desktop uses a two-column workspace: a centered spread board and a persistent
detail panel. Narrow screens stack the detail panel below the board. The Celtic
Cross uses a compact, viewport-aware card size so its ten positions fit within
a 1920×1200 viewport without vertical scrolling.

## Position guidance

Each `SpreadPosition` gains a reading order and a concise explanatory prompt.
The board displays its ordinal number; a reading-order guide exposes every
position's number, name, and prompt. For example, `Foundation` means the
underlying influence or root condition beneath the present situation.

## Acceptance criteria

- Every supported spread fits its intended desktop workspace without page-level
  horizontal overflow.
- The Celtic Cross fits a 1920×1200 viewport with readable labels.
- Keyboard and screen-reader users can discover position order and meaning.
- Mobile retains all positions, labels, and detail content.
