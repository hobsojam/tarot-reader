// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { meanLumaSsim } from './image-fidelity.ts'

const size = 16

function rgbImage(pixel: (x: number, y: number) => number): Uint8Array {
  const data = new Uint8Array(size * size * 3)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      data.fill(pixel(x, y), (y * size + x) * 3, (y * size + x) * 3 + 3)
    }
  }
  return data
}

const checkerboard = rgbImage((x, y) => ((x + y) % 2 === 0 ? 0 : 255))

describe('mean luma SSIM', () => {
  it('scores identical images as exactly 1', () => {
    expect(meanLumaSsim(checkerboard, checkerboard.slice(), size, size)).toBe(1)
  })

  it('scores a flattened pattern low', () => {
    const flattened = rgbImage(() => 128)

    expect(meanLumaSsim(checkerboard, flattened, size, size)).toBeLessThan(0.5)
  })

  it('rejects buffers that do not match the dimensions', () => {
    expect(() =>
      meanLumaSsim(checkerboard, checkerboard.subarray(3), size, size),
    ).toThrow(RangeError)
  })
})
