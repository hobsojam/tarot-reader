# Card Image Optimisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve compact WebP thumbnails in the deck explorer grid and an optimised full-size WebP everywhere else, keep the artwork faithful, and stop card images from shifting the layout as they load.

**Architecture:** The normalized PNG masters move out of `public/` into `artwork/`. A checked-in Node script, `scripts/optimise-card-images.ts`, encodes them with `sharp` into committed WebP derivatives in `public/` and writes a small committed manifest (`src/data/card-image-manifest.json`) of source hashes and output dimensions. `src/domain/card-image.ts` is the single source of truth for variant widths and URLs; components read it and never build image paths themselves. A `--check` mode of the script runs in CI to prove the committed derivatives match the masters and pass a fidelity floor.

**Tech Stack:** TypeScript, React/Vite, Node 24 (native type stripping), `sharp` 0.35.5 (dev only), Vitest, React Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-14-card-image-optimisation-design.md`

## Global Constraints

- **Precondition (met: PR #50 merged on 2026-10-14):** start only after PR #50 (`fix/card-back-from-scan`) has merged, so the pipeline encodes the new 420 × 725 card back and the screenshot baselines already reflect it. Do not edit the card back's pixels in this work; only move and encode it.
- Do not crop, recolour, sharpen, or retouch any artwork. Resizing uses `sharp`'s default Lanczos 3 kernel; no other operation is applied.
- Derivative widths and quality are fixed by the spec: card faces at 280 px (WebP q82) and 420 px (WebP q90); the card back at 420 px (WebP q90). Changing them is a spec change.
- `sharp` is a dev dependency pinned to an exact version that was published at least 7 days before it is added (0.35.5 was published on 2026-09-27). It is never imported by application code.
- CI keeps `npm ci --ignore-scripts`; `sharp` 0.35 ships prebuilt binaries and has no install script, so no workflow change is needed for it to load.
- Keep `ATTRIBUTION.md` accurate for every moved or derived file.
- Run lint, format, unit, image check, build, and Playwright verification before the PR. Include before/after screenshots of the deck explorer in the PR.

## Review Focus

- A missing, stale, or wrongly sized derivative must fail `npm run images:check`.
- A derivative whose fidelity drops below the floor must fail `npm run images:check`.
- Every card id in `src/data/cards.ts` must have a manifest entry, and vice versa.
- The grid must request a 280 px asset on a 1x or 2x screen; the detail view, reading cards, and reflection anchor must request the 420 px asset.
- No card image may cause a layout shift while loading at phone, tablet, or desktop width.
- No PNG card artwork may remain in `dist/`.

---

### Task 1: Add the image-variant domain module

**Files:**

- Create: `src/domain/card-image.ts`
- Create: `src/domain/card-image.test.ts`

**Interfaces:**

- Consumes: a card id and `import.meta.env.BASE_URL` (passed in as `baseUrl` so the module stays pure).
- Produces: `cardImageWidths` (`{ thumbnail: 280, full: 420 }`), `cardFaceSrc(id, baseUrl, variant?)`, `cardFaceSrcSet(id, baseUrl)`, `cardBackSrc(baseUrl)`, and `explorerThumbnailSizes`.

- [ ] **Step 1: Write failing behaviour tests**

Assert literal outcomes with `baseUrl = '/tarot-reader/'`: `cardFaceSrc('the-fool', base)` is `/tarot-reader/cards/the-fool-420.webp`; `cardFaceSrc('the-fool', base, 'thumbnail')` is `/tarot-reader/cards/the-fool-280.webp`; `cardFaceSrcSet('the-fool', base)` is `/tarot-reader/cards/the-fool-280.webp 280w, /tarot-reader/cards/the-fool-420.webp 420w`; `cardBackSrc(base)` is `/tarot-reader/card-back-420.webp`. Name tests after behaviour, for example `builds the explorer thumbnail srcset from both widths`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- card-image`

Expected: FAIL because `src/domain/card-image.ts` does not exist.

- [ ] **Step 3: Implement `src/domain/card-image.ts`**

Export the constants and pure functions above. `explorerThumbnailSizes` is `'8rem'` (the grid's measured slot is 113–121 CSS px). Keep the module free of React and of `import.meta`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- card-image`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/card-image.ts src/domain/card-image.test.ts
git commit -m "Add card image variant helpers"
```

### Task 2: Add the fidelity metric

**Files:**

- Create: `scripts/image-fidelity.ts`
- Create: `scripts/image-fidelity.test.ts`
- Modify: `tsconfig.node.json` (add `scripts` to `include`)

**Interfaces:**

- Consumes: two equal-sized raw RGB buffers with width and height.
- Produces: `meanLumaSsim(reference, candidate, width, height): number` (8 × 8 windows, stride 4, BT.601 luma; the method used for the spec's measurements).

- [ ] **Step 1: Write failing behaviour tests**

Use `// @vitest-environment node`. Build tiny synthetic buffers in the test: identical buffers score exactly `1`; a buffer with a checkerboard replaced by its mean grey scores below `0.5`; mismatched buffer lengths throw `RangeError`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- image-fidelity`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement `scripts/image-fidelity.ts`**

Use only erasable TypeScript syntax and explicit `.ts` import extensions so Node 24 can run it without a build step.

- [ ] **Step 4: Run the test and the type check**

Run: `npm test -- image-fidelity && npx tsc -b`

Expected: PASS, and no type errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/image-fidelity.ts scripts/image-fidelity.test.ts tsconfig.node.json
git commit -m "Add image fidelity metric"
```

### Task 3: Add the derivative generator and checker

**Files:**

- Create: `scripts/optimise-card-images.ts`
- Create: `scripts/optimise-card-images.test.ts`
- Modify: `package.json` (add exact `sharp@0.35.5` dev dependency and the `images` and `images:check` scripts)
- Modify: `package-lock.json`

**Interfaces:**

- Consumes: `artwork/cards/*.png`, `artwork/card-back.png`, `cardImageWidths` from `src/domain/card-image.ts`, and `meanLumaSsim`.
- Produces: `public/cards/<id>-280.webp`, `public/cards/<id>-420.webp`, `public/card-back-420.webp`, and `src/data/card-image-manifest.json`; `--check` exits non-zero with one line per problem.

- [ ] **Step 1: Confirm the dependency's age**

Run: `npm view sharp@0.35.5 time --json | grep '"0.35.5"'`

Expected: a publish date at least 7 days before the day it is added. Then run `npm install --save-dev --save-exact sharp@0.35.5`.

- [ ] **Step 2: Write failing behaviour tests**

Use `// @vitest-environment node` and a temporary directory (`fs.mkdtemp`) holding two small synthetic PNG masters made with `sharp`. Assert that generating writes exactly the expected WebP files with the expected widths and proportional heights; that `--check` passes immediately afterwards; that `--check` reports `stale` after one master's bytes change, `missing` after one derivative is deleted, and `fidelity` when a derivative is replaced with a flat grey image of the same size. Export the generator and checker as functions taking explicit directories so the test never touches the real `artwork/` or `public/`.

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- optimise-card-images`

Expected: FAIL because the script does not exist.

- [ ] **Step 4: Implement `scripts/optimise-card-images.ts`**

For each master: hash the bytes with SHA-256, resize to each width (420 px is the master's own width, so it is re-encoded without resampling), encode with `webp({ quality, effort: 6 })`, and record `{ sha256, width, height }` per variant. Write the manifest with keys sorted and two-space indentation plus a trailing newline so Prettier leaves it unchanged. In `--check` mode, re-hash masters, confirm each derivative exists with the recorded dimensions, decode it, compare it with a fresh Lanczos resize of the master, and fail below the floors in the spec (mean luma SSIM 0.93 at 280 px and 0.97 at 420 px; the lowest measured values across the deck were 0.941 and 0.976). Do not compare encoded bytes, which can change between `libvips` builds. Add `"images": "node scripts/optimise-card-images.ts"` and `"images:check": "node scripts/optimise-card-images.ts --check"`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- optimise-card-images`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/optimise-card-images.ts scripts/optimise-card-images.test.ts package.json package-lock.json
git commit -m "Add card image optimisation script"
```

### Task 4: Move masters and commit the derivatives

**Files:**

- Move: `public/cards/*.png` to `artwork/cards/*.png` (with `git mv`)
- Move: `public/card-back.png` to `artwork/card-back.png` (with `git mv`)
- Create: `public/cards/*-280.webp`, `public/cards/*-420.webp`, `public/card-back-420.webp`
- Create: `src/data/card-image-manifest.json`
- Create: `src/data/card-image-manifest.test.ts`
- Modify: `ATTRIBUTION.md`
- Modify: `AGENTS.md` (paths for card images and the regeneration command)

**Interfaces:**

- Consumes: the script from Task 3.
- Produces: the committed derivatives and manifest that every later task reads.

- [ ] **Step 1: Write the failing manifest coverage test**

In `src/data/card-image-manifest.test.ts`, assert that the manifest's card keys equal the sorted ids from `src/data/cards.ts` (78 entries), that `card-back` is present, and that every face has a 280 and a 420 variant whose width matches `cardImageWidths`. Name it `has optimised images for every card in the deck`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- card-image-manifest`

Expected: FAIL because the manifest does not exist.

- [ ] **Step 3: Move masters and generate**

Run: `mkdir artwork`, `git mv public/cards artwork/cards`, `mkdir public/cards`, `git mv public/card-back.png artwork/card-back.png`, then `npm run images`. Record the measured totals (`du -cb public/cards/*-280.webp`, `du -cb public/cards/*-420.webp`, `du -b public/card-back-420.webp`) for the PR description and compare them with the spec's projection.

- [ ] **Step 4: Inspect fidelity by eye**

Open at least four derivatives next to their masters at 2x zoom (for example `king-of-wands`, `the-star`, `ten-of-swords`, and the card back), and confirm no visible crop, colour shift, or loss of the printed halftone texture at 420 px.

- [ ] **Step 5: Update provenance**

In `ATTRIBUTION.md`, state that the normalized masters are in `artwork/cards/` and `artwork/card-back.png`, and that the files in `public/` are resized, WebP-encoded copies of those masters produced by `npm run images`, with no other edits. In `AGENTS.md`, change the card-image location and add `npm run images` and `npm run images:check` to the command list.

- [ ] **Step 6: Run the tests and the checker**

Run: `npm test -- card-image-manifest && npm run images:check`

Expected: PASS, and the checker prints no problems.

- [ ] **Step 7: Commit**

```bash
git add artwork public src/data/card-image-manifest.json src/data/card-image-manifest.test.ts ATTRIBUTION.md AGENTS.md
git commit -m "Serve card art as optimised WebP"
```

### Task 5: Use the variants in components

**Files:**

- Modify: `src/components/TarotCard.tsx`
- Modify: `src/components/TarotCard.test.tsx`
- Modify: `src/components/DeckExplorer.tsx`
- Modify: `src/components/DeckExplorer.test.tsx`
- Modify: `src/components/ReflectionAnchorCard.tsx`
- Create: `src/components/ReflectionAnchorCard.test.tsx`

**Interfaces:**

- Consumes: `cardFaceSrc`, `cardFaceSrcSet`, `cardBackSrc`, `explorerThumbnailSizes`, and the manifest's dimensions.
- Produces: `<img>` elements with `src`, `width`, `height`, and (grid only) `srcset` and `sizes`.

- [ ] **Step 1: Update the existing tests to fail**

In `TarotCard.test.tsx`, expect the revealed face `src` to be `/cards/the-fool-420.webp` and the back `src` to be `/card-back-420.webp`, each with numeric `width` and `height` attributes from the manifest. In `DeckExplorer.test.tsx`, expect each grid image to have `src` ending `-280.webp`, a `srcset` containing both `280w` and `420w`, `sizes="8rem"`, and `loading="lazy"`; expect the detail image `src` to end `-420.webp` and to have no `srcset`. In the new `ReflectionAnchorCard.test.tsx`, expect the anchor image `src` to end `-420.webp` with `width` and `height`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- TarotCard DeckExplorer ReflectionAnchorCard`

Expected: FAIL on the old `.png` paths and the missing attributes.

- [ ] **Step 3: Update the components**

Replace each template-literal image path with the helpers. Pass `import.meta.env.BASE_URL` as `baseUrl`. Add `width` and `height` from the manifest to every card `<img>`. Keep existing `alt` text, class names, and `loading="lazy"` on the grid.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- TarotCard DeckExplorer ReflectionAnchorCard`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "Request sized WebP card images"
```

### Task 6: Prevent image-driven layout shift

**Files:**

- Create: `e2e/card-images.spec.ts`
- Modify: `src/App.css`

**Interfaces:**

- Consumes: the running dev server from `playwright.config.ts`.
- Produces: browser coverage for layout stability and the selected image variant.

- [ ] **Step 1: Write the failing layout-shift test**

In `e2e/card-images.spec.ts`, for viewports 320 × 900, 768 × 1024, and 1440 × 1000: register a `layout-shift` `PerformanceObserver` with `page.addInitScript`, delay every `**/cards/**` and `**/card-back-*` request by 1.5 s with `page.route`, load the setup page, wait for the visible grid images to finish loading, and assert the summed shift value is below `0.01`. Repeat on a Celtic Cross reading after **Reveal all**. Name it `card images do not shift the layout while loading at <width>px`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- card-images`

Expected: FAIL at 1440 px (the spec measured a shift of 0.273 when the grid images arrive, because `.app-shell` shrink-wraps its content and grows once the images' natural width is known). Record the observed values at each width in the commit message.

- [ ] **Step 3: Give the shell a definite width and keep image heights proportional**

In `src/App.css`, add `box-sizing: border-box` and `width: 100%` to `.app-shell` (its existing `max-width` still caps it). Add `height: auto` to `.deck-explorer__card img`, `.deck-explorer__detail > img`, and `.reflection-anchor__image` so the new `height` attribute cannot override the CSS `aspect-ratio`. Leave `.tarot-card__image` (which uses `height: 100%`) unchanged.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:e2e -- card-images`

Expected: PASS at every width.

- [ ] **Step 5: Add a variant-selection test**

In the same file, at 1440 × 1000 with `deviceScaleFactor: 2`, assert that every grid image's `currentSrc` ends `-280.webp`, and that after selecting a card the detail image's `currentSrc` ends `-420.webp`. Assert no request in the session ends `.png` under `/cards/`.

Run: `npm run test:e2e -- card-images`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add e2e/card-images.spec.ts src/App.css
git commit -m "Keep card images from shifting layout"
```

### Task 7: Wire the check into CI and verify the whole branch

**Files:**

- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `e2e/reading-layout.spec.ts-snapshots/*.png` only if Step 3 shows a real, reviewed difference

**Interfaces:**

- Consumes: everything above.
- Produces: a verified branch ready for review.

- [ ] **Step 1: Add the image check to both workflows**

Add `- run: npm run images:check` after `npm run format:check` in the `verify` job of `ci.yml` and in the `deploy` job of `deploy-pages.yml`. Do not change `npm ci --ignore-scripts`.

- [ ] **Step 2: Confirm the deploy contains no PNG card art**

Run: `npm run build && find dist -name '*.png' && du -sh dist`

Expected: no card or card-back PNG is listed, and `dist` is about 13 MB instead of about 54 MB.

- [ ] **Step 3: Run the layout screenshots without updating them**

Run: `npm run test:e2e -- reading-layout`

Expected: PASS. The screenshots show face-down cards, so only the card back's encoding changes; reading-page geometry does not change (the spec measured identical shell and card widths with the shell fix). If a screenshot fails, open the diff in `playwright-report/`, confirm the only change is WebP encoding of the card back, then run `npm run test:e2e:update` and commit the new baselines with the reason in the commit message.

- [ ] **Step 4: Run the full quality gate**

Run: `npm run lint && npm run format:check && npm run images:check && npm test && npm run build && npm run test:e2e && git diff --check`

Expected: every command exits 0.

- [ ] **Step 5: Measure and record**

Run `du -cb artwork/cards/*.png | tail -1` and `du -cb public/cards/*.webp public/card-back-420.webp | tail -1`, and record the before and after totals in the PR description next to the spec's projection. Take before and after screenshots of the deck explorer at 1440 px for the PR (the setup page becomes wider at tablet and desktop width because of the shell fix).

- [ ] **Step 6: Commit and request whole-branch review**

```bash
git add .github/workflows e2e
git commit -m "Check card images in CI"
```

Review for artwork fidelity, accurate attribution, no PNG art in `dist/`, the dependency's age, and unintended layout changes on the setup page.
