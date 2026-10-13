# Distinct Card Interpretations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every tarot card original, distinct interpretation data and make readings use the meaning matching the dealt orientation.

**Architecture:** `src/data/cards.ts` becomes a fully authored, typed deck while preserving card IDs and public `Card` fields. `src/domain/interpretation.ts` continues to own orientation selection, then composes the selected meaning with the spread position and a card-specific theme for contextual and narrative text.

**Tech Stack:** TypeScript, React/Vite, Vitest, React Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-12-distinct-card-interpretations-design.md`

## Global Constraints

- New interpretation text is original MIT-licensed copy; do not copy modern tarot guidebooks.
- Keep the existing card IDs, names, arcana, suits, image paths, spreads, and UI structure stable.
- Every card has unique non-empty upright and reversed meanings and two or three non-empty, card-specific themes.
- Copy is calm, reflective, non-fatalistic, and avoids predictive certainty.
- Run lint, format, unit, build, and Playwright verification before the PR.

## Review Focus

- A duplicated meaning or complete theme list must fail deck-data integrity tests.
- An incomplete card record must fail the 78-card and non-empty-field tests.
- A reversed dealt card must produce contextual and narrative text different from its upright form.
- Two Minor Arcana cards in the same suit must produce distinct text at the same position.
- Existing card IDs must remain available so card face paths and explorer filters continue to work.

---

### Task 1: Lock the deck-data contract with integrity tests

**Files:**

- Modify: `src/data/cards.test.ts` (create if absent)
- Modify: `src/data/cards.ts`

**Interfaces:**

- Consumes: `cards: readonly Card[]` from `src/data/cards.ts`.
- Produces: validated expectations for the complete authored deck.

- [ ] **Step 1: Write failing deck-integrity tests**

Assert literal outcomes: `cards` has length 78; every card has non-empty meanings and at least two non-empty themes; sets of upright meanings, reversed meanings, and joined theme lists all have length 78; known IDs include `the-fool`, `ace-of-wands`, and `king-of-pentacles`.

- [ ] **Step 2: Run the data test to verify it fails**

Run: `npm test -- cards`

Expected: FAIL because generated Minor Arcana records have repeated themes and/or only one theme.

- [ ] **Step 3: Define the typed authored-record shape in `src/data/cards.ts`**

Use `satisfies readonly Card[]` (or an equivalent compile-time check) for the final deck data. Preserve exported `cards` and every existing ID/name/suit.

- [ ] **Step 4: Run the data test to verify the structural contract passes**

Run: `npm test -- cards`

Expected: the test is green once all final records are authored in Task 3.

- [ ] **Step 5: Commit**

```bash
git add src/data/cards.ts src/data/cards.test.ts
git commit -m "Test distinct card data"
```

### Task 2: Make synthesis orientation-aware

**Files:**

- Modify: `src/domain/interpretation.ts`
- Modify: `src/domain/interpretation.test.ts`

**Interfaces:**

- Consumes: `getCardMeaning(card: DealtCard): string`, `Card.themes`, and `SpreadPosition`.
- Produces: `synthesizeInterpretation(card, position): string` and `synthesizeReadingNarrative(revealedCards, focus?): string` containing the selected orientation meaning.

- [ ] **Step 1: Write failing orientation behaviour tests**

For one literal test card, assert its upright and reversed versions create different contextual interpretation and narrative text, each containing the corresponding literal meaning. For two different Wands cards at the same literal position, assert output differs.

- [ ] **Step 2: Run the interpretation test to verify it fails**

Run: `npm test -- interpretation`

Expected: FAIL because current synthesis uses only the first theme and ignores orientation meaning.

- [ ] **Step 3: Update synthesis functions in `src/domain/interpretation.ts`**

Call `getCardMeaning` in both functions. Compose its reader-facing sentence with the existing position template/lens and a card-specific theme; preserve reading-order sorting, focus framing, and the explicit reversed cue.

- [ ] **Step 4: Run interpretation tests to verify they pass**

Run: `npm test -- interpretation`

Expected: PASS, including existing reading-order and focus-framing coverage.

- [ ] **Step 5: Commit**

```bash
git add src/domain/interpretation.ts src/domain/interpretation.test.ts
git commit -m "Use dealt meanings in interpretations"
```

### Task 3: Author the complete distinct deck

**Files:**

- Modify: `src/data/cards.ts`
- Modify: `src/data/cards.test.ts`

**Interfaces:**

- Consumes: the typed authored-deck contract from Task 1.
- Produces: the final `cards: readonly Card[]` data set consumed unchanged by deck, explorer, and reading UI.

- [ ] **Step 1: Complete authored Major Arcana records**

Give each Major Arcana card two or three themes and verify its meanings/themes meet the integrity contract without altering IDs, names, or existing imagery.

- [ ] **Step 2: Complete authored Minor Arcana records**

Replace rank/suit generation with all 56 explicit card records. Each record has unique upright/reversed copy and two or three specific themes; retain the current ID/name/suit values exactly.

- [ ] **Step 3: Run deck-data integrity tests**

Run: `npm test -- cards`

Expected: PASS with all 78 records, no duplicate meaning or theme lists, and no unresolved template tokens.

- [ ] **Step 4: Perform manual copy review**

Read the full deck data for original wording, calm non-predictive tone, and accidental near-duplicates; correct any failures before proceeding.

- [ ] **Step 5: Commit**

```bash
git add src/data/cards.ts src/data/cards.test.ts
git commit -m "Author distinct tarot interpretations"
```

### Task 4: Verify integration and regressions

**Files:**

- Modify only if a regression test exposes a necessary correction in the files above.

**Interfaces:**

- Consumes: final deck data and orientation-aware synthesis.
- Produces: verified application behavior without UI or asset changes.

- [ ] **Step 1: Run targeted data and interpretation suites**

Run: `npm test -- cards interpretation`

Expected: PASS.

- [ ] **Step 2: Run the full quality gate**

Run: `npm run lint && npm run format:check && npm test && npm run build && npm run test:e2e && git diff --check`

Expected: every command exits 0.

- [ ] **Step 3: Request whole-branch code review**

Review for copy integrity, preservation of IDs/suits, orientation-aware semantics, and unintended UI/data-shape changes.
