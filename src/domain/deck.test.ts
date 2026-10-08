import { describe, expect, it } from 'vitest'
import { createDeck, deal, orientCards, shuffleDeck } from './deck'

describe('tarot deck', () => {
  it('creates 78 cards with unique identifiers', () => {
    const deck = createDeck()

    expect(deck).toHaveLength(78)
    expect(new Set(deck.map((card) => card.id)).size).toBe(78)
  })

  it('deals unique cards without mutating the source deck', () => {
    const deck = createDeck()
    const originalIds = deck.map((card) => card.id)

    const { dealt, remaining } = deal(deck, 3)

    expect(dealt).toHaveLength(3)
    expect(new Set(dealt.map((card) => card.id)).size).toBe(3)
    expect(remaining).toHaveLength(75)
    expect(deck.map((card) => card.id)).toEqual(originalIds)
  })

  it('preserves every card when shuffled with a seeded random source', () => {
    const deck = createDeck()
    const shuffled = shuffleDeck(deck, () => 0)

    expect(shuffled.map((card) => card.id).sort()).toEqual(
      deck.map((card) => card.id).sort(),
    )
  })

  it('marks cards reversed when a random draw falls within the configured chance', () => {
    const cards = createDeck().slice(0, 2)

    expect(orientCards(cards, () => 0.19)).toEqual(
      cards.map((card) => ({ ...card, orientation: 'reversed' })),
    )
    expect(orientCards(cards, () => 0.2)).toEqual(
      cards.map((card) => ({ ...card, orientation: 'upright' })),
    )
  })
})
