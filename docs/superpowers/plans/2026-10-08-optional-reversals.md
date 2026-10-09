# Optional Reversals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an opt-in reversal mode that deals each card reversed with an independent 20% chance.

**Architecture:** Canonical deck cards remain immutable. Deal-time orientation is stored on `DealtCard`; React session state owns the opt-in setting and passes orientation to the existing card control.

**Tech Stack:** React, TypeScript, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-08-reversal-mechanics-design.md`

## Global Constraints

- Reversal mode defaults off.
- Enabled mode uses `random() < 0.2` per dealt card.
- A new reading discards all orientation state.
- Reversed cards retain the fixed card frame and expose orientation accessibly.
- Reversed interpretation copy is out of scope.

## Review Focus

- Boundary random values 0.19 and 0.2 produce reversed and upright cards respectively.
- Disabled mode never deals a reversed card.
- Starting a new reading cannot preserve prior orientations.
- Keyboard users hear both revealed card name and orientation.
- Rotation cannot change board geometry.

### Task 1: Complete deal-time orientation domain model

**Files:**

- Modify: `src/domain/card.ts`, `src/domain/deck.ts`, `src/domain/deck.test.ts`

**Interfaces:**

- Produces: `type Orientation = 'upright' | 'reversed'`, `interface DealtCard extends Card { orientation: Orientation }`, and `orientCards(cards, random?, reversedChance?): DealtCard[]`.

- [ ] Write focused failing boundary tests for 0.19, 0.2, and non-mutation.
- [ ] Run `npm test -- --run src/domain/deck.test.ts`; expect the new orientation contract to fail.
- [ ] Implement non-mutating `orientCards` with default chance `0.2`.
- [ ] Run the focused domain test; expect pass.
- [ ] Commit: `feat: add optional card orientations`.

### Task 2: Add opt-in reading control and accessible rendering

**Files:**

- Modify: `src/App.tsx`, `src/App.test.tsx`, `src/components/TarotCard.tsx`, `src/components/TarotCard.test.tsx`, `src/App.css`

**Interfaces:**

- Consumes: `orientCards` and `DealtCard` from Task 1.
- Produces: an off-by-default reversal control and rendered upright/reversed state.

- [ ] Write failing component tests for enabling reversals, accessible reversed card state, and a reset that removes dealt state.
- [ ] Run focused tests; expect failure because the setting and orientation UI do not exist.
- [ ] Add the labelled opt-in control; orient only a newly started reading when enabled.
- [ ] Render reversed cards with a 180-degree image transform and `reversed` in their accessible name; preserve the frame size.
- [ ] Run focused tests, then `npm run lint && npm run format:check && npm test && npm run build`; expect all pass.
- [ ] Commit: `feat: add optional reversed cards`.

## Self-Review

- Spec coverage: Tasks 1–2 cover all state, probability, reset, visual, and accessibility requirements.
- Type consistency: Task 1 defines the dealt-card contract consumed by Task 2.
- Review focus: boundary, toggle, reset, accessibility, and geometry each have an owning test.
