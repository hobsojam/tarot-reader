import { describe, expect, it } from 'vitest'
import { cardImageWidths } from '../domain/card-image'
import { cards } from './cards'
import manifest from './card-image-manifest.json'

describe('card image manifest', () => {
  it('has optimised images for every card in the deck', () => {
    const ids = cards.map((card) => card.id).sort()

    expect(Object.keys(manifest.cards)).toEqual(ids)
    expect(ids).toHaveLength(78)
    for (const id of ids) {
      const variants =
        manifest.cards[id as keyof typeof manifest.cards].variants
      expect(variants).toMatchObject({
        [cardImageWidths.thumbnail]: { width: cardImageWidths.thumbnail },
        [cardImageWidths.full]: { width: cardImageWidths.full },
      })
    }
    expect(manifest.back.variants).toMatchObject({
      [cardImageWidths.full]: { width: cardImageWidths.full },
    })
  })
})
