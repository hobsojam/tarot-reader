# Guided Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete card-specific interpretations and reading-session ownership, simplify Explorer focus behavior, and deliver a responsive quiet-occult guided journey.

**Architecture:** Adopt the authored 78-card data and React-independent `ReadingSession` model from the existing feature branches after reconciling them with current `main`. Keep `App` as the UI composition layer, move active-reading derivations into the domain, and express visual/state guidance through semantic components and CSS tokens rather than a configurable layout system.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, React Testing Library, Playwright, ESLint, Prettier.

**Spec:** `docs/superpowers/specs/2026-10-14-guided-journey-design.md`

## Global Constraints

- Keep the app static: no accounts, persistence, analytics, backend, AI-generated interpretations, or selectable presentation modes.
- All new card copy is original, MIT-licensed, card-specific, and must not reproduce modern guidebooks.
- Keep card-name queries out of Explorer search; browsing is through the visible, scrollable grid and category controls.
- Preserve native buttons, visible focus, semantic headings, responsive layouts, and reduced-motion behavior.
- Do not alter card artwork pixels or image-variant widths; retain `npm run images:check` as a required gate.
- Work from a dedicated branch/worktree and merge through a PR only after CI passes.

## Review Focus

- A same-suit pair must never produce identical orientation-specific meaning or theme-list output; cover in Task 1's uniqueness tests.
- A reading must keep its original positions when setup choices later change; cover in Task 2's captured-spread test and App integration test.
- Interrupted Space activation must not cause a later pointer click to move focus unexpectedly; cover in Task 3's pointer/keyboard focus tests.
- A filtered-out Explorer selection must not render stale detail or reappear when the filter clears; cover in Task 3's controlled-state tests.
- A complete reading's reflection must add a distinct prompt rather than duplicate its narrative; cover in Task 4's App test and browser flow.

### Task 1: Adopt distinct, original card interpretations

**Files:**

- Modify: `src/data/cards.ts`
- Create: `src/data/cards.test.ts`
- Modify: `src/domain/interpretation.test.ts`

**Interfaces:**

- Produces: `cards: readonly Card[]` with 78 stable identities, unique upright and reversed meanings, and 2–3 unique themes per card.
- Consumes: `getCardMeaning`, `synthesizeInterpretation`, and `synthesizeReadingNarrative` without changing their public signatures.

- [ ] **Step 1: Write failing authored-data tests**

  Copy/adapt the pending branch's identity and copy assertions. Assert all 78 stable id/name/arcana/suit identities, non-empty meanings, 2–3 non-empty themes, unique normalized upright meanings, unique normalized reversed meanings, unique complete theme lists, and no unresolved tokens.

- [ ] **Step 2: Verify the data tests fail**

  Run: `npm test -- cards`

  Expected: FAIL because the template-produced Minor Arcana data repeats suit-level meanings and themes.

- [ ] **Step 3: Replace template-generated content with the pending branch's explicit original data**

  Port `feature/distinct-card-data`'s authored `src/data/cards.ts`, preserving every existing artwork id, display name, arcana, suit, and canonical order. Do not change image paths or public-domain artwork attribution.

- [ ] **Step 4: Add meaning-consumption regression coverage**

  In `src/domain/interpretation.test.ts`, assert two same-suit cards in the same position produce different contextual/narrative text and that reversed output uses the card's reversed meaning.

- [ ] **Step 5: Verify the task**

  Run: `npm test -- cards interpretation`

  Expected: PASS.

- [ ] **Step 6: Commit**

  ```bash
  git add src/data/cards.ts src/data/cards.test.ts src/domain/interpretation.test.ts
  git commit -m "Add distinct card interpretations"
  ```

### Task 2: Make the active reading a captured domain session

**Files:**

- Modify: `src/domain/deck.ts`
- Modify: `src/domain/deck.test.ts`
- Create: `src/domain/reading-session.ts`
- Create: `src/domain/reading-session.test.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**

- Produces: `startReading(options)`, `revealPosition(session, id)`, `revealAll(session)`, `getSelectedReadingCard(session)`, `getRevealedReadingCards(session)`, `isReadingComplete(session)`, `getReflectionAnchor(session)`, and `getNarrativeFraming(session)`.
- Consumes: `Card[]`, `Spread`, `ReadingFocus`, and deck primitives; `createDeck(cardsToCopy)` no longer imports application data.

- [ ] **Step 1: Write failing deck and session tests**

  Port the pending branch's tests, adding deterministic coverage for: copying supplied deck cards; unique oriented deals; spread capture; invalid reveal identity; reveal-all selecting lowest reading order; preserved selection; revealed reading order; completion; reflection anchor; and custom-question normalization.

- [ ] **Step 2: Verify the new tests fail**

  Run: `npm test -- deck reading-session`

  Expected: FAIL because `createDeck` imports data and `reading-session.ts` does not exist.

- [ ] **Step 3: Implement the pure session module and data-independent deck constructor**

  Port the pending session design. `ReadingSession` stores its `spread`; all transition functions return a new session except an unknown position id, which returns the unchanged session. Derive card-position pairs in reading order and make reflection anchor undefined until revealed.

- [ ] **Step 4: Refactor `App` to compose session operations**

  Replace the inline session type/state transformations and non-null lookups. Use typed selected spread/focus lookup helpers, session-derived selected card/narrative/completion/anchor, and `reading-workspace--${session.spread.id}`. Keep Explorer study state intact across New reading.

- [ ] **Step 5: Add App regression coverage**

  Assert an active reading continues using its captured spread after setup selection changes, and preserve current reveal-all, custom-focus, reversal, and Explorer-state behaviors.

- [ ] **Step 6: Verify the task**

  Run: `npm test -- deck reading-session App`

  Expected: PASS.

- [ ] **Step 7: Commit**

  ```bash
  git add src/domain/deck.ts src/domain/deck.test.ts src/domain/reading-session.ts src/domain/reading-session.test.ts src/App.tsx src/App.test.tsx
  git commit -m "Refactor active reading state"
  ```

### Task 3: Make Explorer selection explicit and robust

**Files:**

- Modify: `src/components/DeckExplorer.tsx`
- Modify: `src/components/DeckExplorer.test.tsx`
- Modify: `e2e/reading-layout.spec.ts`
- Modify: `docs/superpowers/specs/2026-10-12-code-review-backlog.md`

**Interfaces:**

- Consumes: controlled `search`, `filter`, and `selectedCardId` props.
- Produces: no selection-repair effect or keydown-pending ref; keyboard selection focuses the detail and pointer selection preserves card focus.

- [ ] **Step 1: Write failing controlled-state and activation tests**

  Add tests where a search/filter handler clears a now-hidden selection directly, clearing the filter does not restore it, a pointer click retains card focus, Enter and Space activation focus details, and an interrupted Space keypress cannot affect a later pointer click. Keep reduced-motion scroll coverage.

- [ ] **Step 2: Verify the tests fail for the intended behavior**

  Run: `npm test -- DeckExplorer`

  Expected: FAIL because selection repair occurs in an effect and keyboard state is held in `keyboardSelectionPending`.

- [ ] **Step 3: Simplify `DeckExplorer` event handling**

  Clear selection in search/filter change handlers when the next visible set excludes it. Remove `keyboardSelectionPending`, `previousSelectedCardId`, and the selection-repair effect. In the click path use the native click event's keyboard/pointer information to decide whether focus moves; retain a ref only for Back to deck focus restoration. Include every reactive dependency required by lint.

- [ ] **Step 4: Update browser focus coverage**

  In `e2e/reading-layout.spec.ts`, verify keyboard activation reaches Card details, Back to deck returns to the originating card, and pointer activation does not steal focus.

- [ ] **Step 5: Record the search decision**

  Update the code-review backlog: card names intentionally are not meaning-search matches; browsing uses the visible deck and categories. Mark this item and the resolved Explorer implementation item complete.

- [ ] **Step 6: Verify the task**

  Run: `npm run lint && npm test -- DeckExplorer && npm run test:e2e -- reading-layout`

  Expected: lint has no `DeckExplorer` warnings and all named tests pass.

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/DeckExplorer.tsx src/components/DeckExplorer.test.tsx e2e/reading-layout.spec.ts docs/superpowers/specs/2026-10-12-code-review-backlog.md
  git commit -m "Simplify deck explorer selection"
  ```

### Task 4: Deliver the quiet-occult guided journey

**Files:**

- Modify: `src/index.css`
- Modify: `src/App.css`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/ReadingDetail.tsx`
- Modify: `src/components/ReadingDetail.test.tsx`
- Modify: `e2e/reading-layout.spec.ts`

**Interfaces:**

- Produces: semantic quiet-occult design tokens and accessible state cues for setup, partial reading, completion, and reflection.
- Consumes: `ReadingSession` derivations from Task 2 and existing responsive/card-image styling.

- [ ] **Step 1: Write failing guided-state tests**

  In `App.test.tsx`, assert setup presents Begin reading, a partial reading presents the reveal cue, a complete reading presents the reflection cue and control, and reflection contains its own closing prompt rather than duplicating Reading so far. In `ReadingDetail.test.tsx`, retain empty-state and selected-card context behavior.

- [ ] **Step 2: Verify the tests fail**

  Run: `npm test -- App ReadingDetail`

  Expected: FAIL because the current copy/action hierarchy and reflection narrative duplication do not meet the new state contract.

- [ ] **Step 3: Apply the token system and responsive component styling**

  Define light-mode semantic tokens in `src/index.css` for parchment, ink, indigo, moss, surfaces, borders, and focus; choose a broadly available serif display stack and readable system body stack. Apply them in `App.css` to setup, Explorer, reading workspace, details, narrative, reflection, cards, and controls. Preserve the existing image aspect-ratio rules and all narrow-screen breakpoints.

- [ ] **Step 4: Implement guided state copy and reflection content**

  Add a concise text cue adjacent to reading actions, driven by session completion/revealed count. Make Begin reading the setup primary action and reflection the completion primary action without imposing reveal order. Replace the repeated completed-thread narrative with a distinct synthesis/closing prompt based on the anchor card and focus/question.

- [ ] **Step 5: Add browser-level state and accessibility coverage**

  Extend the existing browser flow through setup, partial reveal, reveal-all, and reflection at 320 px and desktop width. Assert guidance text changes, no horizontal overflow, keyboard-visible focus remains usable, and reduced motion continues to avoid smooth Explorer scrolling. Update approved screenshots only after reviewing genuine visual differences.

- [ ] **Step 6: Verify the task**

  Run: `npm test -- App ReadingDetail && npm run test:e2e -- reading-layout`

  Expected: PASS.

- [ ] **Step 7: Commit**

  ```bash
  git add src/index.css src/App.css src/App.tsx src/App.test.tsx src/components/ReadingDetail.tsx src/components/ReadingDetail.test.tsx e2e/reading-layout.spec.ts
  git commit -m "Guide readers through each reading state"
  ```

### Task 5: Reconcile the backlog and validate the integrated branch

**Files:**

- Modify: `docs/superpowers/specs/2026-10-11-polish-and-remediation-backlog.md`
- Modify: `docs/superpowers/specs/2026-10-12-code-review-backlog.md`
- Modify: `README.md` only if reader-facing interaction copy changes require explanation.

**Interfaces:**

- Produces: backlog documents that accurately distinguish completed work from future opportunities.

- [ ] **Step 1: Update completion status**

  Mark the already landed card framing, responsive layouts, Explorer focus/reduced motion/reveal-all, image optimization, strict TypeScript, attribution, CI alignment, headings, and scaffold cleanup items complete. Mark this plan's distinct meanings, session ownership, Explorer state, and no-name-search decision complete. Leave the quiet-occult/guidance work marked complete only after Task 4 verification.

- [ ] **Step 2: Verify the documentation has no stale implementation claims**

  Run: `rg -n "current .* crops|currently inherit|still instructs|not currently|does not audit|pins .*@v6" docs/superpowers/specs`

  Expected: no matches describing completed behavior, or each remaining match is explicitly historical context.

- [ ] **Step 3: Run the full quality gate**

  Run: `npm run lint && npm run format:check && npm run images:check && npm test && npm run build && npm run test:e2e && git diff --check`

  Expected: every command exits 0.

- [ ] **Step 4: Commit and request whole-branch review**

  ```bash
  git add docs/superpowers/specs README.md
  git commit -m "Update reading experience backlog"
  ```

  Request review focused on original copy, captured session spread, Explorer focus behavior, reflection novelty, responsive contrast, and any unintended card-art changes.
