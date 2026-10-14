import { describe, expect, it } from 'vitest'
import {
  cardBackSrc,
  cardFaceSrc,
  cardFaceSrcSet,
  cardImageWidths,
  explorerThumbnailSizes,
} from './card-image'

const base = '/tarot-reader/'

describe('card image variants', () => {
  it('uses the full-size face by default', () => {
    expect(cardFaceSrc('the-fool', base)).toBe(
      '/tarot-reader/cards/the-fool-420.webp',
    )
  })

  it('uses the thumbnail face when asked', () => {
    expect(cardFaceSrc('the-fool', base, 'thumbnail')).toBe(
      '/tarot-reader/cards/the-fool-280.webp',
    )
  })

  it('builds the explorer thumbnail srcset from both widths', () => {
    expect(cardFaceSrcSet('the-fool', base)).toBe(
      '/tarot-reader/cards/the-fool-280.webp 280w, /tarot-reader/cards/the-fool-420.webp 420w',
    )
  })

  it('serves the optimised card back', () => {
    expect(cardBackSrc(base)).toBe('/tarot-reader/card-back-420.webp')
  })

  it('sizes explorer thumbnails for the grid slot', () => {
    expect(cardImageWidths).toEqual({ thumbnail: 280, full: 420 })
    expect(explorerThumbnailSizes).toBe('8rem')
  })
})
