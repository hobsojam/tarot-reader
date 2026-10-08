# Reading Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make readings compact, understandable, and responsive across the three supported spreads.

**Architecture:** Enrich spread positions with reading order and explanatory prompts. Render the board and detail panel within a responsive workspace; CSS uses spread-specific compact sizing for the Celtic Cross.

**Tech Stack:** React, TypeScript, CSS Grid, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-08-reading-workspace-design.md`

## Global Constraints

- Position order and explanation live in data, not components.
- Desktop provides a board plus persistent detail-panel workspace.
- Celtic Cross must fit a 1920×1200 viewport without vertical scrolling.
- Mobile stacks detail below the board without horizontal page overflow.
- All labels, order, and prompts remain keyboard and screen-reader accessible.

## Review Focus

- Every position exposes a unique ordinal and prompt.
- The Celtic Cross modifier applies only to the ten-card spread.
- Revealing cards does not change board geometry.
- Detail remains available when no card has been selected.
- Narrow layouts retain labels and controls.

### Task 1: Enrich spread position metadata

**Files:**

- Modify: `src/domain/spread.ts`, `src/data/spreads.ts`, `src/data/spreads.test.ts`

**Interfaces:**

- Produces: `SpreadPosition.readingOrder: number` and `SpreadPosition.prompt: string`.

- [ ] Write failing tests for contiguous reading order and non-empty prompts on all positions, including Foundation.
- [ ] Run `npm test -- --run src/data/spreads.test.ts`; expect failure for missing metadata.
- [ ] Add ordinal and prompt data to every spread definition.
- [ ] Run focused tests; expect pass.
- [ ] Commit: `feat: add spread position guidance`.

### Task 2: Render reading order and position guidance

**Files:**

- Modify: `src/components/ReadingBoard.tsx`, `src/components/ReadingDetail.tsx`, `src/components/ReadingBoard.test.tsx`, `src/App.tsx`

- [ ] Write failing tests for numbered position labels, an accessible reading-order guide, and the Foundation prompt.
- [ ] Run focused component tests; expect failure.
- [ ] Render ordinal badges and a semantic ordered guide sourced from position metadata.
- [ ] Keep the detail panel visible with generic guidance until a card is selected.
- [ ] Run focused tests; expect pass.
- [ ] Commit: `feat: explain reading positions`.

### Task 3: Implement responsive workspace sizing

**Files:**

- Modify: `src/App.css`, `src/components/ReadingBoard.tsx`, `src/components/ReadingBoard.test.tsx`

- [ ] Write a failing test that identifies the Celtic Cross workspace modifier.
- [ ] Add desktop two-column workspace styles, a compact Celtic Cross grid, and mobile stacking rules.
- [ ] Ensure card frames preserve their dimensions when revealed.
- [ ] Run `npm run lint && npm run format:check && npm test && npm run build`; expect all pass.
- [ ] Commit: `feat: refine reading workspace`.

## Self-Review

- Spec coverage: metadata, order, explanations, desktop sizing, and mobile stacking map to Tasks 1–3.
- Type consistency: Task 1 defines properties consumed by Tasks 2–3.
- Review focus: each listed failure mode has a task-owned test.
