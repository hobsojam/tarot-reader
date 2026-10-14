// @vitest-environment node
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  checkCardImages,
  generateCardImages,
  type CardImagePaths,
} from './optimise-card-images.ts'

const masterWidth = 420
const masterHeight = 700

// A deterministic, detailed pattern so resizing keeps measurable structure.
async function writeMaster(path: string, seed: number) {
  const data = Buffer.alloc(masterWidth * masterHeight * 3)
  for (let y = 0; y < masterHeight; y++) {
    for (let x = 0; x < masterWidth; x++) {
      const offset = (y * masterWidth + x) * 3
      const band = Math.floor(x / 6) + Math.floor(y / 9) + seed
      data[offset] = band % 2 === 0 ? 40 : 220
      data[offset + 1] = (x * 3 + seed * 17) % 256
      data[offset + 2] = (y * 2 + seed * 29) % 256
    }
  }
  await sharp(data, {
    raw: { width: masterWidth, height: masterHeight, channels: 3 },
  })
    .png()
    .toFile(path)
}

let root: string
let paths: CardImagePaths

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'card-images-'))
  paths = {
    artworkDir: join(root, 'artwork'),
    publicDir: join(root, 'public'),
    manifestPath: join(root, 'manifest.json'),
  }
  await mkdir(join(paths.artworkDir, 'cards'), { recursive: true })
  await writeMaster(join(paths.artworkDir, 'cards', 'the-fool.png'), 1)
  await writeMaster(join(paths.artworkDir, 'cards', 'the-star.png'), 2)
  await writeMaster(join(paths.artworkDir, 'card-back.png'), 3)
})

afterEach(async () => {
  await rm(root, { recursive: true, force: true })
})

describe('card image optimisation', () => {
  it('writes a thumbnail and full-size WebP for each face and a full-size back', async () => {
    await generateCardImages(paths)

    expect((await readdir(join(paths.publicDir, 'cards'))).sort()).toEqual([
      'the-fool-280.webp',
      'the-fool-420.webp',
      'the-star-280.webp',
      'the-star-420.webp',
    ])
    const thumbnail = await sharp(
      join(paths.publicDir, 'cards', 'the-fool-280.webp'),
    ).metadata()
    expect([thumbnail.format, thumbnail.width, thumbnail.height]).toEqual([
      'webp',
      280,
      467,
    ])
    const back = await sharp(
      join(paths.publicDir, 'card-back-420.webp'),
    ).metadata()
    expect([back.format, back.width, back.height]).toEqual(['webp', 420, 700])
  })

  it('passes the check straight after generating', async () => {
    await generateCardImages(paths)

    expect(await checkCardImages(paths)).toEqual([])
  })

  it('reports a stale derivative when its master changes', async () => {
    await generateCardImages(paths)
    await writeMaster(join(paths.artworkDir, 'cards', 'the-star.png'), 9)

    expect(await checkCardImages(paths)).toEqual([
      'stale: cards/the-star.png has changed since its images were generated',
    ])
  })

  it('reports a missing derivative', async () => {
    await generateCardImages(paths)
    await rm(join(paths.publicDir, 'cards', 'the-fool-280.webp'))

    expect(await checkCardImages(paths)).toEqual([
      'missing: cards/the-fool-280.webp',
    ])
  })

  it('reports a derivative that has lost fidelity', async () => {
    await generateCardImages(paths)
    await sharp({
      create: {
        width: 420,
        height: 700,
        channels: 3,
        background: { r: 128, g: 128, b: 128 },
      },
    })
      .webp()
      .toFile(join(paths.publicDir, 'cards', 'the-fool-420.webp'))

    const problems = await checkCardImages(paths)

    expect(problems).toHaveLength(1)
    expect(problems[0]).toMatch(
      /^fidelity: cards\/the-fool-420\.webp SSIM 0\.\d{3} is below 0\.970$/,
    )
  })

  it('reports a master that has no generated images', async () => {
    await generateCardImages(paths)
    await writeFile(join(paths.artworkDir, 'cards', 'the-sun.png'), '')

    expect(await checkCardImages(paths)).toEqual([
      'stale: cards/the-sun.png has no generated images',
    ])
  })
})
