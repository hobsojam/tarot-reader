const windowSize = 8
const stride = 4
const c1 = (0.01 * 255) ** 2
const c2 = (0.03 * 255) ** 2

function toLuma(rgb: Uint8Array, width: number, height: number): Float64Array {
  if (rgb.length !== width * height * 3) {
    throw new RangeError(
      `Expected ${width * height * 3} RGB bytes, received ${rgb.length}`,
    )
  }
  const luma = new Float64Array(width * height)
  for (let index = 0; index < luma.length; index++) {
    const offset = index * 3
    luma[index] =
      0.299 * rgb[offset] + 0.587 * rgb[offset + 1] + 0.114 * rgb[offset + 2]
  }
  return luma
}

/**
 * Mean structural similarity of BT.601 luma over 8 × 8 windows at a stride
 * of 4. Identical images score 1; lower scores mean lost detail.
 */
export function meanLumaSsim(
  reference: Uint8Array,
  candidate: Uint8Array,
  width: number,
  height: number,
): number {
  const a = toLuma(reference, width, height)
  const b = toLuma(candidate, width, height)
  const count = windowSize * windowSize
  let total = 0
  let windows = 0

  for (let top = 0; top + windowSize <= height; top += stride) {
    for (let left = 0; left + windowSize <= width; left += stride) {
      let sumA = 0
      let sumB = 0
      for (let y = top; y < top + windowSize; y++) {
        for (let x = left; x < left + windowSize; x++) {
          sumA += a[y * width + x]
          sumB += b[y * width + x]
        }
      }
      const meanA = sumA / count
      const meanB = sumB / count
      let varianceA = 0
      let varianceB = 0
      let covariance = 0
      for (let y = top; y < top + windowSize; y++) {
        for (let x = left; x < left + windowSize; x++) {
          const da = a[y * width + x] - meanA
          const db = b[y * width + x] - meanB
          varianceA += da * da
          varianceB += db * db
          covariance += da * db
        }
      }
      varianceA /= count
      varianceB /= count
      covariance /= count
      total +=
        ((2 * meanA * meanB + c1) * (2 * covariance + c2)) /
        ((meanA ** 2 + meanB ** 2 + c1) * (varianceA + varianceB + c2))
      windows++
    }
  }

  return total / windows
}
