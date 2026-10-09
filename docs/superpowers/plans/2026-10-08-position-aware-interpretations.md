# Position-Aware Interpretations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Explain every revealed card through the selected spread position without creating a card-by-position meaning matrix.

**Architecture:** Cards retain their short upright meaning and gain a small theme list. Positions own a lens and a string template, while a pure domain helper interpolates a card name and primary theme into that template. `ReadingDetail` presents the unaltered core meaning, the existing position prompt, and the synthesized position-aware reading as separate labelled blocks.

**Tech Stack:** TypeScript, React, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-08-position-aware-interpretations-design.md`

## Global Constraints

- Do not create a 78-card-by-position lookup table.
- Keep card core meaning, position prompt, and synthesis visually distinct.
- Give every supported position its own lens and synthesis template using card metadata or keywords.
- Keep reversed wording out of scope, but accept orientation in the synthesis API now so reversed content can be added without an API change.
- Keep card-to-card influence out of this feature.

## Review Focus

- Every position has its own lens/template; test this against every position in `spreads` in Task 1.
- The synthesis must add context without replacing `uprightMeaning`; render and assert both in Task 2.
- A card with an empty `themes` list must use its name as a grammatical fallback; test it in Task 1.
- The interpretation area must tell the reader what to do before any card is revealed; test it in Task 2.
- Passing `'reversed'` must be supported without changing the helper signature or adding reversed copy; test it in Task 1.

### Task 1: Add card themes and position synthesis templates

**Files:**

- Modify: `src/domain/card.ts`
- Modify: `src/domain/spread.ts`
- Modify: `src/data/cards.ts`
- Modify: `src/data/spreads.ts`
- Create: `src/domain/interpretation.ts`
- Create: `src/domain/interpretation.test.ts`

**Interfaces:**

- Produces `Card.themes: readonly string[]`.
- Produces `SpreadPosition.lens: string` and `SpreadPosition.synthesisTemplate: string`.
- Produces `synthesizeInterpretation(card: Card, position: SpreadPosition, orientation: Orientation): string`.
- A template contains `{theme}` exactly where its primary-card-theme phrase belongs. The helper substitutes `card.themes[0]`, falling back to `card.name` when that list is empty. `orientation` is intentionally accepted but does not alter the upright-only output yet.

- [ ] **Step 1: Write failing domain tests in `src/domain/interpretation.test.ts`**

  Import `cards`, `spreads`, and `synthesizeInterpretation`. Assert that the Celtic Cross `Self` reading for `The Empress` includes its first theme and differs from the `Foundation` reading; assert that a synthetic card with `themes: []` produces a reading containing its name; call the helper with `'reversed'` and assert it returns the same upright-only synthesis. Add an all-position assertion that every position has non-empty, unique `lens` and `synthesisTemplate` values.

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `npm test -- --run src/domain/interpretation.test.ts`

  Expected: FAIL because the interpretation module and new metadata do not exist.

- [ ] **Step 3: Define the new metadata contracts**

  Add `themes` to `Card`. Add these fields to `SpreadPosition`:

  ```ts
  lens: string
  synthesisTemplate: string
  ```

  Keep `prompt` unchanged: it is the reader-facing explanation of the position, whereas `lens` is the short interpretive framing used by synthesis.

- [ ] **Step 4: Populate card and spread data**

  Extend each major-arcana source tuple and minor-arcana suit generator so all 78 resulting cards have one or more concise themes. Add a distinct `lens` and `{theme}`-bearing `synthesisTemplate` to every entry in `spreads`. Templates should be reflective, position-specific sentences (for example, Self frames a resource or stance; Foundation frames a root condition), and must not predict outcomes as facts.

- [ ] **Step 5: Implement `synthesizeInterpretation` in `src/domain/interpretation.ts`**

  Implement the declared signature. Select the first theme or the card name fallback and replace every `{theme}` token in `position.synthesisTemplate`. Retain the orientation parameter for the future reversed-content extension; do not branch on it until reversed interpretation text exists.

- [ ] **Step 6: Run focused domain tests to verify they pass**

  Run: `npm test -- --run src/domain/interpretation.test.ts`

  Expected: PASS.

- [ ] **Step 7: Commit the data and domain helper**

  ```bash
  git add src/domain/card.ts src/domain/spread.ts src/domain/interpretation.ts src/domain/interpretation.test.ts src/data/cards.ts src/data/spreads.ts
  git commit -m "feat: add position-aware interpretation data"
  ```

### Task 2: Render structured contextual interpretations

**Files:**

- Modify: `src/components/ReadingDetail.tsx`
- Modify: `src/components/ReadingBoard.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**

- Consumes `synthesizeInterpretation(card, position, orientation)` from Task 1.
- Changes `ReadingDetail` to accept `card?: DealtCard` and `position?: SpreadPosition` so it can display a no-selection state while a reading is in progress.
- Produces one complementary region that shows a pre-selection instruction, or the three labelled blocks `Card meaning`, `Position meaning`, and `In this reading` for the selected revealed card.

- [ ] **Step 1: Write failing interaction tests in `src/components/ReadingBoard.test.tsx`**

  Start a Three Card reading and assert the `Card interpretation` complementary region contains `Reveal a card to see its contextual interpretation.` before a reveal. Reveal Past and assert that region contains headings `Card meaning`, `Position meaning`, and `In this reading`; assert the revealed card's `uprightMeaning`, the Past `prompt`, and a position synthesis are all visible. Assert the card meaning and synthesis are separate text assertions rather than one combined string.

- [ ] **Step 2: Run the focused component test to verify it fails**

  Run: `npm test -- --run src/components/ReadingBoard.test.tsx`

  Expected: FAIL because no detail panel exists before selection and it has no structured contextual content.

- [ ] **Step 3: Implement the optional-state detail panel**

  Update `ReadingDetail` to always render its existing labelled complementary region. With no card or position, render the exact instruction from Step 1. With both supplied, render position label and card name plus semantic sections headed `Card meaning`, `Position meaning`, and `In this reading`; use `card.uprightMeaning`, `position.prompt`, and `synthesizeInterpretation(card, position, card.orientation)` respectively.

- [ ] **Step 4: Render the detail panel for the whole active session**

  In `App.tsx`, render `ReadingDetail` whenever `session` exists. Pass the selected card and position when `selectedIndex >= 0`, otherwise pass neither. Preserve reveal, reveal-all, and new-reading state transitions.

- [ ] **Step 5: Run focused component tests to verify they pass**

  Run: `npm test -- --run src/components/ReadingBoard.test.tsx`

  Expected: PASS.

- [ ] **Step 6: Run the full required verification**

  Run: `npm run lint && npm run format:check && npm test && npm run build`

  Expected: all four commands exit 0.

- [ ] **Step 7: Commit the rendered interpretation experience**

  ```bash
  git add src/App.tsx src/components/ReadingDetail.tsx src/components/ReadingBoard.test.tsx
  git commit -m "feat: add contextual card interpretations"
  ```

## Self-Review

- **Spec coverage:** Task 1 supplies the scalable composition data and helper; Task 2 makes the core meaning, position meaning, and composition clear in the reading UI. Card-to-card synthesis is deliberately excluded.
- **Step scan:** Each test, implementation, verification, and commit step identifies its target and expected result; templates, fallback behaviour, and the future-orientation contract are fixed above.
- **Type consistency:** Task 1 defines the `Card`, `SpreadPosition`, and helper contract that Task 2 consumes, with `DealtCard` providing the existing orientation.
- **Review focus:** Task 1 tests uniqueness, fallback, and reversed API acceptance; Task 2 tests content separation and the pre-selection state.
- **Proportion:** The two independently reviewable tasks map directly to the two design layers without specifying a redundant card-by-position text corpus.
