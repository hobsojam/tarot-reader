# Card Image Optimisation Design

## Goal

Make the deck explorer and readings fast to browse without changing how the
1909 Rider-Waite-Smith artwork looks. Grid thumbnails use compact assets,
larger views use an optimised full-size variant, and no card image shifts
the layout while it loads.

This addresses _Optimise card imagery for browsing_ in
`2026-10-11-polish-and-remediation-backlog.md` and the image-weight note in
`2026-10-12-code-review-backlog.md`.

## Current state

All 78 card faces are 420 px wide RGB PNGs in `public/cards/`, between 704
and 740 px tall (most are 722 to 728). They total **52,835,865 bytes**, an
average of 677 kB each. PR #50 replaces `public/card-back.png` with a 420 ×
725 RGB PNG of 653,170 bytes. Vite copies `public/` into `dist/` unchanged,
so there is no image pipeline today.

The files are large because PNG is lossless and the scans carry the printed
halftone and paper grain, which PNG compresses poorly. Their pixel size is
already modest: no view displays a card wider than 288 CSS px.

Four components render card images, each building its own
`${BASE_URL}cards/${id}.png` path:

| Component                              | Class                          | Rendered width (CSS px)                                                                |
| -------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| `DeckExplorer` grid (78 lazy images)   | `.deck-explorer__card img`     | 121 phone, 113 tablet, 115 desktop                                                     |
| `DeckExplorer` detail                  | `.deck-explorer__detail > img` | 256 phone and tablet, 288 desktop                                                      |
| `TarotCard` (face and `card-back.png`) | `.tarot-card__image`           | 78 to 256, depending on spread and width; Celtic Cross is 107 to 111 above phone width |
| `ReflectionAnchorCard`                 | `.reflection-anchor__image`    | 192 phone and tablet, 216 desktop                                                      |

Widths were measured with Playwright in Chromium at the three viewports used
by `e2e/reading-layout.spec.ts` (320 × 900, 768 × 1024, 1440 × 1000). The root
font size is 18 px above 1024 px, which is why desktop sizes are larger.

The setup page renders the explorer grid immediately. Even with
`loading="lazy"`, Chromium fetched 24 card PNGs on first load at 320 px, 56
at 768 px, and 39 at 1440 px, which is about **16 MB, 38 MB, and 26 MB**
before the user does anything.

### Layout shift

Every card image already has a CSS `aspect-ratio: 21 / 37` and a width, so
the image boxes themselves are reserved. A Playwright run that delayed every
card request by 1.5 s still measured a cumulative layout shift of **0.273 at
1440 px** (0 at 320 px). The source was `.app-shell`: inside the flex-column
`#root`, its `margin: 0 auto` makes it shrink to fit its content, so it grew
from 668 px to 962 px wide when the grid images' natural 420 px width became
known.

Adding `width` and `height` attributes alone did not fix this (measured: still
0.273), because the CSS `width: 100%` overrides the attribute and the image's
natural size remains unknown until it loads. Giving `.app-shell`
`box-sizing: border-box; width: 100%` brought the shift to **0** at both
widths. It left every reading page unchanged (shell and card widths were
identical before and after at all three viewports) but widens the setup page
from 618 to 766 px at 768 px and from 962 to 1124 px at 1440 px, which is
what its existing `max-width: 70rem` already intends.

This matters more once `srcset` arrives: the natural width of a `srcset`
image depends on which candidate the browser picks and the screen's pixel
density, so a shrink-to-fit shell would lay out differently on different
devices.

## Measurements

All conversions were made outside the repository with `sharp` 0.35.5
(`libvips` 8.18.7, `libwebp` 1.6.0, `aom` 3.15.1) on Node 24, encoding
the 78 faces one at a time on a 16-thread machine. Resizing used `sharp`'s
default Lanczos 3 kernel. Fidelity is mean luma SSIM (8 × 8 windows, stride 4) against the master resized to the same width; 1.0 is identical. PSNR is
low for every lossy option because the halftone dots behave like
high-frequency noise, so SSIM and side-by-side inspection at 2x zoom were
used to judge fidelity.

### Totals for the 78 faces

| Width  | Format and setting |   Total bytes | Mean SSIM | Lowest SSIM | Encode time |
| ------ | ------------------ | ------------: | --------: | ----------: | ----------: |
| 420 px | PNG (current)      |    52,835,865 |     1.000 |       1.000 |           — |
| 420 px | WebP lossless      |    35,927,238 |     1.000 |       1.000 |        50 s |
| 420 px | **WebP q90**       | **9,472,060** | **0.989** |   **0.976** |    **17 s** |
| 420 px | WebP q82           |     6,784,504 |     0.975 |       0.947 |        17 s |
| 420 px | WebP q75           |     5,254,756 |     0.957 |       0.920 |        13 s |
| 420 px | AVIF q70           |     6,061,961 |     0.974 |       0.961 |       500 s |
| 280 px | PNG (resized)      |    25,509,021 |     1.000 |       1.000 |         3 s |
| 280 px | WebP q90           |     4,231,480 |    0.989¹ |      0.981¹ |         8 s |
| 280 px | **WebP q82**       | **2,949,770** | **0.970** |   **0.941** |     **9 s** |
| 280 px | WebP q75           |     2,277,664 |    0.961¹ |      0.930¹ |         8 s |
| 280 px | AVIF q50           |     1,411,345 |    0.943¹ |      0.915¹ |       184 s |
| 240 px | PNG (resized)      |    18,809,262 |     1.000 |       1.000 |         3 s |
| 240 px | WebP lossless      |    12,074,980 |     1.000 |       1.000 |        47 s |
| 240 px | WebP q82           |     2,254,900 |    0.977¹ |      0.959¹ |         7 s |
| 240 px | AVIF q70           |     2,084,653 |    0.978¹ |      0.965¹ |       169 s |
| 240 px | AVIF q60           |     1,528,412 |    0.964¹ |      0.945¹ |       142 s |
| 240 px | AVIF q50           |     1,095,853 |    0.949¹ |      0.923¹ |       121 s |
| 240 px | JPEG q85 (mozjpeg) |     2,448,103 |    0.965¹ |      0.948¹ |         4 s |

¹ Measured on a 13-card sample (every sixth card) rather than all 78.

The PR #50 card back measured 135,164 bytes as WebP q90 at 420 px (98,842
at q82; 550,498 lossless).

### Visual judgement

Crops of `king-of-wands` (dense pattern) and `the-star` (flat sky, skin
hatching, paper grain) were compared side by side at 2x zoom:

- **420 px WebP q90** was indistinguishable from the PNG, including the
  halftone dots and paper grain.
- **420 px WebP q82** was very close, with slightly softer hatching on skin.
- **420 px AVIF q70** visibly smoothed the paper grain and skin hatching,
  despite an SSIM similar to WebP q82.
- **280 px WebP q82** showed slight smoothing at 3x zoom that is not visible
  at the 113 to 121 px the grid displays it.
- **280 px AVIF q50** smeared the paper texture in the sky.

### Chosen set, before and after

| Asset                        | Before (PNG) |    After (WebP) |   Change |
| ---------------------------- | -----------: | --------------: | -------: |
| 78 faces, full (420 px)      |   52,835,865 | 9,472,060 (q90) |     −82% |
| 78 faces, thumbnail (280 px) |            — | 2,949,770 (q82) |        — |
| Card back (PR #50, 420 px)   |      653,170 |   135,164 (q90) |     −79% |
| **Everything deployed**      |  **53.5 MB** |     **12.6 MB** | **−77%** |

Projected transfer for typical journeys, using the measured averages (677 kB
PNG, 38 kB thumbnail, 121 kB full):

| Journey                                            |  Before |  After |
| -------------------------------------------------- | ------: | -----: |
| Setup page first load, 768 px (56 grid images)     | 37.9 MB | 2.1 MB |
| Setup page first load, 320 px (24 grid images)     | 16.3 MB | 0.9 MB |
| Browsing the whole grid (78 thumbnails)            | 52.8 MB | 2.9 MB |
| Celtic Cross, all revealed (10 faces and the back) |  7.4 MB | 1.4 MB |

The first-load counts will change slightly once the shell fix widens the
setup page, so the 768 px and 1440 px figures are indicative.

## Options considered

### Format

- **WebP only, `<img srcset sizes>`** (chosen). Every browser the app
  targets has decoded WebP since Safari 14 (2020), so no fallback is needed
  and a plain `<img>` can carry `srcset`. At matched visual quality it was
  within about 10% of AVIF in bytes.
- **AVIF with a WebP fallback in `<picture>`.** AVIF was at most about 10%
  smaller than WebP at equal SSIM, and smoothed the paper texture more at
  equal size. It was 20 to 30 times slower to encode (500 s for one 420 px
  set) and would double the committed derivatives and the markup. Not worth
  it for this artwork.
- **WebP lossless.** Only 32% smaller than PNG at 420 px; it does not meet
  the goal.
- **JPEG.** Larger than WebP q82 with lower fidelity and no benefit in
  support.

### Where derivatives are produced

- **Committed derivatives from a checked-in script** (chosen). The masters
  move from `public/` to `artwork/` and `npm run images` writes WebP files
  into `public/`. A `--check` mode in CI fails if any derivative is missing,
  stale, wrongly sized, or below a fidelity floor.
- **Build-time generation** (a `prebuild` script, or `vite-imagetools`
  12.0.1, published 2026-08-28, with `import.meta.glob` imports). This keeps
  generated files out of git and gives content-hashed URLs. It would put a
  native image encoder on the path of `npm run dev`, `npm run build`, and
  the Playwright web server, add about 26 s (WebP) or several minutes (AVIF)
  of encoding to every cold start and to both CI jobs that build, and make
  the deployed bytes depend on whichever `libvips` build CI installs. The
  artwork almost never changes, so this cost buys little.

`AGENTS.md` forbids committing generated build output. That rule targets
`dist/` and similar outputs of `npm run build`. The derivatives here are
source assets in the same sense the current PNGs are: they are themselves
normalized copies of Wikimedia scans, are reviewed in pull requests, are
regenerated only when a master or a setting changes, and are guarded by a
CI check. The design treats them as artwork, not build output, and
`AGENTS.md` should say so (see the plan).

### Sizes and markup

- **Two face widths.** 280 px covers the grid at up to 2x pixel density
  (the slot is at most 121 CSS px, and `sizes="8rem"` is 144 px at the
  desktop root size). A Chromium check with these exact attributes picked
  the 280 px file at 1x and 2x and the 420 px file at 2.4x and 3x, with
  both 16 px and 18 px root sizes. Firefox and Safari were not tested; at
  2x with the 18 px root they may pick the 420 px file, which costs bytes
  but not quality.
  420 px is the masters' own width and covers every larger view. A 1x-only
  thumbnail (about 140 px) would save little more and add a third file per
  card.
- **`srcset` only where it pays.** The grid uses
  `srcset="…-280.webp 280w, …-420.webp 420w" sizes="8rem"`, so a 3x phone
  still gets the sharper file. The detail view, reading cards, and
  reflection anchor display at up to 288 CSS px, which exceeds 420 px at 2x
  anyway, so they use a single `src` of the 420 px file. Reading cards in
  the Celtic Cross could use thumbnails, but a reading shows at most ten
  cards and per-spread `sizes` would add complexity for about 0.8 MB.
- **Card back.** One 420 px WebP q90 file, `card-back-420.webp`, produced by
  the same script from `artwork/card-back.png`.

## Decision

1. Move the masters with `git mv` to `artwork/cards/<id>.png` and
   `artwork/card-back.png`. Moving creates no new git objects, keeps the
   unmodified masters available for future re-encoding, and keeps them out
   of `dist/`.
2. Add `scripts/optimise-card-images.ts`, run directly by Node 24's built-in
   type stripping, with `sharp` 0.35.5 as an exact-pinned dev dependency
   (published 2026-09-27; it has no install script, so it loads under
   `npm ci --ignore-scripts`, which was verified). It writes:
   - `public/cards/<id>-280.webp` (WebP q82, effort 6);
   - `public/cards/<id>-420.webp` (WebP q90, effort 6);
   - `public/card-back-420.webp` (WebP q90, effort 6); and
   - `src/data/card-image-manifest.json`: for each asset, the master's
     SHA-256 and each variant's width and height.
3. `npm run images:check` re-hashes the masters, checks every derivative's
   presence and dimensions against the manifest, and checks fidelity against
   a fresh resize of the master: mean luma SSIM at least 0.93 at 280 px and
   0.97 at 420 px (the lowest measured values were 0.941 and 0.976). It does
   not compare encoded bytes, which can differ between `libvips` builds. It
   runs in the `verify` job of `ci.yml` and in `deploy-pages.yml`.
4. Add `src/domain/card-image.ts` as the single source of truth for widths,
   file names, `srcset`, and `sizes`. Components stop building paths.
5. Fix the layout shift in CSS and add intrinsic dimensions (below).

No other edits are made to the artwork: no cropping, colour change,
sharpening, or metadata beyond what WebP encoding implies.

### Confirmed decisions

These were confirmed with the maintainer on 2026-10-14:

- The 420 px face variants use WebP q90, not q82. Faithful artwork is worth
  the extra 2.7 MB.
- The WebP derivatives are committed. `AGENTS.md` is amended so that they
  count as reviewed source artwork, not generated build output.
- The setup page widens to its existing `max-width` as a result of the
  layout-shift fix.
- Implementation starts after PR #50, which has now merged.

## Markup changes

```tsx
// DeckExplorer grid
<img
  alt=""
  height={manifest.cards[id].thumbnail.height}
  loading="lazy"
  sizes={explorerThumbnailSizes}
  src={cardFaceSrc(id, base, 'thumbnail')}
  srcSet={cardFaceSrcSet(id, base)}
  width={manifest.cards[id].thumbnail.width}
/>

// DeckExplorer detail, TarotCard face, ReflectionAnchorCard
<img src={cardFaceSrc(id, base)} width={…full.width} height={…full.height} … />

// TarotCard back
<img alt="" src={cardBackSrc(base)} width={…} height={…} … />
```

Existing `alt` text, class names, and `loading="lazy"` are unchanged.

## Layout-shift fix

- `.app-shell` gains `box-sizing: border-box; width: 100%`. Its
  `max-width: 70rem` still caps it. This removed the measured 0.273 shift.
- Every card `<img>` gets `width` and `height` from the manifest, which
  meets the code-review item and gives browsers an intrinsic ratio if CSS is
  missing.
- `height: auto` is added to `.deck-explorer__card img`,
  `.deck-explorer__detail > img`, and `.reflection-anchor__image`, so the
  new `height` attribute cannot override the CSS `aspect-ratio`.
  `.tarot-card__image` keeps `height: 100%`.
- The CSS `aspect-ratio: 21 / 37` and `object-fit: contain` stay. The
  masters' ratios vary from 0.568 to 0.597, and letterboxing within a fixed
  box is preferable to cropping the artwork.

## Attribution

`ATTRIBUTION.md` will say that the normalized masters live in
`artwork/cards/` and `artwork/card-back.png`, and that the files in
`public/` are resized, WebP-encoded copies of those masters made by
`npm run images`, with no other changes. The Wikimedia Commons source and
public-domain reasoning do not change.

## Testing strategy

- **Unit (Vitest):** `src/domain/card-image.ts` builds the expected
  file names, `srcset`, and back path for a given base URL; the manifest
  covers exactly the 78 ids in `src/data/cards.ts` plus the back; the SSIM
  helper scores identical buffers 1 and a flattened pattern low; the script
  generates the expected files in a temporary directory and its check
  reports `missing`, `stale`, and `fidelity` problems.
- **Component (Testing Library):** `TarotCard`, `DeckExplorer`, and
  `ReflectionAnchorCard` render the expected `src`, `srcset`, `sizes`,
  `width`, and `height`.
- **Browser (Playwright, `e2e/card-images.spec.ts`):** with every card
  request delayed, the summed `layout-shift` value stays below 0.01 at 320,
  768, and 1440 px on the setup page and on a revealed Celtic Cross; at 2x
  density the grid's `currentSrc` is the 280 px file and the detail's is the
  420 px file; no `.png` card request is made.
- **Screenshot baselines:** the six images in
  `e2e/reading-layout.spec.ts-snapshots/` show face-down cards, so only the
  card back's encoding changes. Reading-page geometry was measured as
  unchanged by the shell fix. Run the existing screenshots first without
  updating; regenerate them only if the diff is confined to the card back's
  WebP encoding, and say so in the commit.
- **Manual:** compare several derivatives with their masters at 2x zoom, and
  attach before and after screenshots of the deck explorer to the PR.

## CI and deployment

- No change to Node 24 or `npm ci --ignore-scripts`. `sharp` installs its
  Linux prebuilt binary from an optional dependency, and `npm audit` covers
  it like any other dev dependency.
- `npm run images:check` is added to both workflows. It decodes 156 WebP
  files and resizes 78 masters; the equivalent prototype pass took about 10 s.
- `dist/` drops from about 54 MB to about 13 MB, and contains no PNG
  artwork.
- The repository grows by about 12.6 MB of new WebP objects; the masters'
  history is unchanged.

## Non-goals

- No change to the artwork itself, the card aspect-ratio box, or the card
  back source (PR #50 owns that).
- No AVIF, no `<picture>`, and no build-time image plugin.
- No per-spread `sizes` for reading cards.
- No service worker, preloading, or change to `loading="lazy"`.
- No content-hashed image URLs; GitHub Pages' default caching is unchanged.
