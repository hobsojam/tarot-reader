/**
 * Encodes the normalized PNG masters in `artwork/` into the WebP files served
 * from `public/`, and records what it produced in a manifest.
 *
 *   npm run images        regenerate every derivative and the manifest
 *   npm run images:check  verify the committed derivatives (used in CI)
 */
import { createHash } from 'node:crypto'
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'
import {
  cardImageWidths,
  type CardImageVariant,
} from '../src/domain/card-image.ts'
import { meanLumaSsim } from './image-fidelity.ts'

export interface CardImagePaths {
  /** Holds `cards/<id>.png` and `card-back.png`. */
  readonly artworkDir: string
  /** Receives `cards/<id>-<width>.webp` and `card-back-<width>.webp`. */
  readonly publicDir: string
  readonly manifestPath: string
}

interface VariantSize {
  readonly width: number
  readonly height: number
}

interface ManifestEntry {
  readonly sha256: string
  readonly variants: Record<string, VariantSize>
}

export interface CardImageManifest {
  readonly back: ManifestEntry
  readonly cards: Record<string, ManifestEntry>
}

interface Asset {
  readonly master: string
  readonly variants: readonly CardImageVariant[]
  readonly output: (width: number) => string
}

const quality: Record<CardImageVariant, number> = { thumbnail: 82, full: 90 }
const fidelityFloor: Record<CardImageVariant, number> = {
  thumbnail: 0.93,
  full: 0.97,
}

const faceAsset = (id: string): Asset => ({
  master: `cards/${id}.png`,
  variants: ['thumbnail', 'full'],
  output: (width) => `cards/${id}-${width}.webp`,
})

const backAsset: Asset = {
  master: 'card-back.png',
  variants: ['full'],
  output: (width) => `card-back-${width}.webp`,
}

async function cardIds(artworkDir: string): Promise<string[]> {
  const files = await readdir(join(artworkDir, 'cards'))
  return files
    .filter((file) => file.endsWith('.png'))
    .map((file) => file.slice(0, -'.png'.length))
    .sort()
}

async function sha256(path: string): Promise<string> {
  return createHash('sha256')
    .update(await readFile(path))
    .digest('hex')
}

function resized(masterPath: string, width: number) {
  return sharp(masterPath).removeAlpha().resize({ width })
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function generateAsset(
  asset: Asset,
  paths: CardImagePaths,
): Promise<ManifestEntry> {
  const masterPath = join(paths.artworkDir, asset.master)
  const variants: Record<string, VariantSize> = {}
  for (const variant of asset.variants) {
    const width = cardImageWidths[variant]
    const info = await resized(masterPath, width)
      .webp({ quality: quality[variant], effort: 6 })
      .toFile(join(paths.publicDir, asset.output(width)))
    variants[width] = { width: info.width, height: info.height }
  }
  return { sha256: await sha256(masterPath), variants }
}

export async function generateCardImages(paths: CardImagePaths) {
  await mkdir(join(paths.publicDir, 'cards'), { recursive: true })
  const cards: Record<string, ManifestEntry> = {}
  for (const id of await cardIds(paths.artworkDir)) {
    cards[id] = await generateAsset(faceAsset(id), paths)
  }
  const manifest: CardImageManifest = {
    back: await generateAsset(backAsset, paths),
    cards,
  }
  await writeFile(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

async function checkAsset(
  asset: Asset,
  entry: ManifestEntry | undefined,
  paths: CardImagePaths,
): Promise<string[]> {
  const masterPath = join(paths.artworkDir, asset.master)
  if (!entry) return [`stale: ${asset.master} has no generated images`]
  if (!(await exists(masterPath))) {
    return [`stale: ${asset.master} was removed but its images remain`]
  }
  if ((await sha256(masterPath)) !== entry.sha256) {
    return [
      `stale: ${asset.master} has changed since its images were generated`,
    ]
  }

  const problems: string[] = []
  for (const variant of asset.variants) {
    const width = cardImageWidths[variant]
    const output = asset.output(width)
    const outputPath = join(paths.publicDir, output)
    const recorded = entry.variants[width]
    if (!(await exists(outputPath))) {
      problems.push(`missing: ${output}`)
      continue
    }
    const candidate = await sharp(outputPath)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const reference = await resized(masterPath, width)
      .raw()
      .toBuffer({ resolveWithObject: true })
    const size = `${candidate.info.width} × ${candidate.info.height}`
    if (
      !recorded ||
      candidate.info.width !== recorded.width ||
      candidate.info.height !== recorded.height ||
      candidate.info.width !== reference.info.width ||
      candidate.info.height !== reference.info.height
    ) {
      problems.push(`size: ${output} is ${size}, not the expected size`)
      continue
    }
    const score = meanLumaSsim(
      reference.data,
      candidate.data,
      candidate.info.width,
      candidate.info.height,
    )
    if (score < fidelityFloor[variant]) {
      problems.push(
        `fidelity: ${output} SSIM ${score.toFixed(3)} is below ${fidelityFloor[variant].toFixed(3)}`,
      )
    }
  }
  return problems
}

/** Returns one line per problem; an empty list means everything is current. */
export async function checkCardImages(
  paths: CardImagePaths,
): Promise<string[]> {
  if (!(await exists(paths.manifestPath))) {
    return [`missing: ${paths.manifestPath}`]
  }
  const manifest = JSON.parse(
    await readFile(paths.manifestPath, 'utf8'),
  ) as CardImageManifest
  const ids = new Set([
    ...(await cardIds(paths.artworkDir)),
    ...Object.keys(manifest.cards),
  ])
  const problems = await checkAsset(backAsset, manifest.back, paths)
  for (const id of [...ids].sort()) {
    problems.push(
      ...(await checkAsset(faceAsset(id), manifest.cards[id], paths)),
    )
  }
  return problems
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const paths: CardImagePaths = {
    artworkDir: join(root, 'artwork'),
    publicDir: join(root, 'public'),
    manifestPath: join(root, 'src/data/card-image-manifest.json'),
  }
  if (process.argv.includes('--check')) {
    const problems = await checkCardImages(paths)
    for (const problem of problems) console.error(problem)
    if (problems.length > 0) process.exitCode = 1
    else console.log('Card images are up to date.')
  } else {
    await generateCardImages(paths)
    console.log('Card images regenerated.')
  }
}
