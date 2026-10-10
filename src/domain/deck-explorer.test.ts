import { describe, expect, it } from 'vitest'
import { cards } from '../data/cards'
import { filterDeckCards } from './deck-explorer'

describe('deck explorer search', () => {
  it('authors Major Arcana taxonomy without a suit', () => {
    const majorArcana = cards.slice(0, 22)

    expect(majorArcana).toHaveLength(22)
    expect(
      majorArcana.every(
        (card) => card.arcana === 'major' && card.suit === undefined,
      ),
    ).toBe(true)
  })

  it('authors Minor Arcana taxonomy with each suit', () => {
    const minorArcana = cards.slice(22)

    expect(minorArcana).toHaveLength(56)
    expect(
      minorArcana.every(
        (card) =>
          card.arcana === 'minor' &&
          ['wands', 'cups', 'swords', 'pentacles'].includes(card.suit),
      ),
    ).toBe(true)
  })

  it('keeps canonical card order for an empty meaning search', () => {
    expect(filterDeckCards(cards, '   ', 'all').map((card) => card.id)).toEqual(
      cards.map((card) => card.id),
    )
  })

  it('finds cards through themes, upright meanings, and reversed meanings', () => {
    expect(filterDeckCards(cards, 'INTUITION', 'all').map((card) => card.id)).toEqual([
      'the-high-priestess',
    ])
    expect(
      filterDeckCards(cards, 'forward movement', 'all').map((card) => card.id),
    ).toEqual(['the-chariot'])
    expect(filterDeckCards(cards, 'freer choice', 'all').map((card) => card.id)).toEqual([
      'the-devil',
    ])
  })

  it('does not use card names as meaning-search matches', () => {
    expect(filterDeckCards(cards, 'magician', 'all')).toEqual([])
  })

  it('filters cards by arcana and suit', () => {
    expect(
      filterDeckCards(cards, '', 'major').every(
        (card) => card.arcana === 'major',
      ),
    ).toBe(true)
    expect(
      filterDeckCards(cards, '', 'wands').every(
        (card) => card.arcana === 'minor' && card.suit === 'wands',
      ),
    ).toBe(true)
  })
})
