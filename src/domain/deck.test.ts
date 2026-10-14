import { describe, expect, it } from 'vitest'
import { cards } from '../data/cards'
import { createDeck, deal, orientCards, shuffleDeck } from './deck'

describe('tarot deck', () => {
  it('creates an independent copy of the supplied card catalogue', () => {
    const sourceCards = cards.slice(0, 2)
    const deck = createDeck(sourceCards)

    expect(deck).toHaveLength(2)
    expect(new Set(deck.map((card) => card.id)).size).toBe(2)
    expect(deck).toEqual(sourceCards)
    expect(deck).not.toBe(sourceCards)
  })

  it('deals unique cards without mutating the source deck', () => {
    const deck = createDeck(cards)
    const originalIds = deck.map((card) => card.id)

    const { dealt, remaining } = deal(deck, 3)

    expect(dealt).toHaveLength(3)
    expect(new Set(dealt.map((card) => card.id)).size).toBe(3)
    expect(remaining).toHaveLength(75)
    expect(deck.map((card) => card.id)).toEqual(originalIds)
  })

  it('preserves every card when shuffled with a seeded random source', () => {
    const deck = createDeck(cards)
    const shuffled = shuffleDeck(deck, () => 0)

    expect(shuffled.map((card) => card.id).sort()).toEqual(
      deck.map((card) => card.id).sort(),
    )
  })

  it('marks cards reversed when a random draw falls within the configured chance', () => {
    const cardsToOrient = createDeck(cards).slice(0, 2)

    expect(orientCards(cardsToOrient, () => 0.19)).toEqual(
      cardsToOrient.map((card) => ({ ...card, orientation: 'reversed' })),
    )
    expect(orientCards(cardsToOrient, () => 0.2)).toEqual(
      cardsToOrient.map((card) => ({ ...card, orientation: 'upright' })),
    )
  })
})
