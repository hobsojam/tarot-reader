# Polish and Remediation Backlog

## Purpose

This is the prioritised queue for improvements identified during the
2026-10-11 architecture and code review, together with the next visual and
interaction polish opportunities. It records intent and acceptance criteria;
an item is not approved for implementation until it receives its own design
and plan.

## Priority 0 — Correctness, readability, and accessible interaction

### Show complete card faces

The current Rider-Waite-Smith source images are taller than the forced 2:3
display frame. `object-fit: cover` crops borders, titles, and numbers in the
explorer, reading board, detail panel, and reflection anchor.

**Done when:** Each card image shows its complete top and bottom edges at all
display sizes. Any fixed frame uses `contain` or the artwork is normalised to
a shared ratio. Browser screenshot coverage protects the result.

### Make every spread readable on narrow screens

Three- and five-card spreads currently inherit the five-column Celtic Cross
grid, leaving their cards and labels too narrow on phones.

**Done when:** Each spread has an appropriate desktop layout and a narrow
screen layout that presents its positions in a clear reading order without
horizontal overflow, squeezed artwork, or overflowing labels. The Celtic
Cross remains recognisable without compromising legibility.

### Make selected explorer details keyboard-reachable

Selecting an explorer card scrolls to its details while keyboard focus remains
on the original card. A preserved selection can also scroll the reader away
from setup when they choose `New reading`.

**Done when:** Explicitly selecting a card has a clear keyboard path to its
details, with a convenient way back to results. Restoring setup state does not
unexpectedly move the viewport. Details are announced or focused in an
appropriate, non-disruptive way.

### Honour reduced-motion preferences

Explorer details request JavaScript smooth scrolling even for readers who
prefer reduced motion.

**Done when:** Scrolling and any new ceremony animations use no motion, or
minimal non-essential motion, under `prefers-reduced-motion: reduce`.

### Make Reveal all choose a useful detail

After `Reveal all`, every card is visible but the detail panel still instructs
the reader to reveal a card.

**Done when:** Revealing all selects the first reading-order position when
nothing is selected, or the empty state accurately asks the reader to select
a card. The behaviour has an integration test.

## Priority 1 — Performance and visual polish

### Optimise card imagery for browsing

The 78 current card PNGs total about 52.8 MB. Lazy loading avoids an upfront
download, but the deck explorer still fetches large originals as thumbnails.

**Done when:** Grid thumbnails use compact, appropriately sized assets and
detail views use an optimised larger variant. Artwork remains faithful and the
asset sizes are measured before and after conversion.

### Establish a calm, ceremonial visual system

The application has functional styling but lacks a deliberately unified visual
language across setup, card reveal, reading detail, narrative, and reflection.

**Done when:** A small set of spacing, typography, surface, and accent tokens
creates a consistent reading atmosphere without reducing contrast, readability,
or the clarity of controls. Any motion is subtle and reduced-motion safe.

### Improve reading-state guidance

The interaction should make the next meaningful action obvious at each stage:
setup, partial reveal, complete reading, and reflection.

**Done when:** Action labels, contextual prompts, and visual hierarchy make it
clear how to continue without turning the experience into a tutorial or adding
unnecessary controls.

### Add browser-level visual and keyboard regression coverage

JSDOM tests protect application logic but cannot verify crops, responsive
layouts, focus movement, or real scrolling.

**Done when:** A lightweight browser test or screenshot workflow covers at
least one phone-sized spread, full-card image visibility, explorer keyboard
selection, and reduced-motion behaviour.

## Priority 2 — Maintainability and documentation

### Enable strict TypeScript checking

An explicit strict compilation succeeds, but strict mode is not currently part
of the project configuration.

**Done when:** `strict: true` is enabled in the appropriate TypeScript
configuration and CI continues to pass without suppressions.

### Keep a reading's spread inside its session

`ReadingSession` owns the dealt cards but derives its spread from separate
setup state. The current UI prevents this becoming incorrect, but future
session controls could break that implicit invariant.

**Done when:** Before a feature permits changing or comparing setup during an
active reading, the session captures the selected spread or stores explicit
card-position pairs.

### Correct card-back attribution

The attribution file describes the card back as both sourced Pamela Colman
Smith artwork and original project material.

**Done when:** Sourced artwork and original project assets have unambiguous,
non-conflicting licensing and provenance statements.

## Suggested delivery order

1. Complete card faces and responsive spread layouts.
2. Explorer keyboard/focus behaviour, reduced motion, and `Reveal all` state.
3. Image optimisation and browser-level visual coverage.
4. The ceremonial visual-system and reading-guidance pass.
5. Strict TypeScript, future session encapsulation, and attribution cleanup.

## Non-goals

- No accounts, persistence, analytics, backend, or AI-generated
  interpretation.
- Do not replace the existing static React/Vite architecture merely to pursue
  polish.
