import { describe, expect, it } from 'vitest'
import { cards } from './cards'

// IDs and display names are also the contract for artwork paths and filters.
const expectedIdentities = [
  ['the-fool', 'The Fool', 'major', undefined],
  ['the-magician', 'The Magician', 'major', undefined],
  ['the-high-priestess', 'The High Priestess', 'major', undefined],
  ['the-empress', 'The Empress', 'major', undefined],
  ['the-emperor', 'The Emperor', 'major', undefined],
  ['the-hierophant', 'The Hierophant', 'major', undefined],
  ['the-lovers', 'The Lovers', 'major', undefined],
  ['the-chariot', 'The Chariot', 'major', undefined],
  ['strength', 'Strength', 'major', undefined],
  ['the-hermit', 'The Hermit', 'major', undefined],
  ['wheel-of-fortune', 'Wheel of Fortune', 'major', undefined],
  ['justice', 'Justice', 'major', undefined],
  ['the-hanged-man', 'The Hanged Man', 'major', undefined],
  ['death', 'Death', 'major', undefined],
  ['temperance', 'Temperance', 'major', undefined],
  ['the-devil', 'The Devil', 'major', undefined],
  ['the-tower', 'The Tower', 'major', undefined],
  ['the-star', 'The Star', 'major', undefined],
  ['the-moon', 'The Moon', 'major', undefined],
  ['the-sun', 'The Sun', 'major', undefined],
  ['judgement', 'Judgement', 'major', undefined],
  ['the-world', 'The World', 'major', undefined],
  ['ace-of-wands', 'Ace of Wands', 'minor', 'wands'],
  ['two-of-wands', 'Two of Wands', 'minor', 'wands'],
  ['three-of-wands', 'Three of Wands', 'minor', 'wands'],
  ['four-of-wands', 'Four of Wands', 'minor', 'wands'],
  ['five-of-wands', 'Five of Wands', 'minor', 'wands'],
  ['six-of-wands', 'Six of Wands', 'minor', 'wands'],
  ['seven-of-wands', 'Seven of Wands', 'minor', 'wands'],
  ['eight-of-wands', 'Eight of Wands', 'minor', 'wands'],
  ['nine-of-wands', 'Nine of Wands', 'minor', 'wands'],
  ['ten-of-wands', 'Ten of Wands', 'minor', 'wands'],
  ['page-of-wands', 'Page of Wands', 'minor', 'wands'],
  ['knight-of-wands', 'Knight of Wands', 'minor', 'wands'],
  ['queen-of-wands', 'Queen of Wands', 'minor', 'wands'],
  ['king-of-wands', 'King of Wands', 'minor', 'wands'],
  ['ace-of-cups', 'Ace of Cups', 'minor', 'cups'],
  ['two-of-cups', 'Two of Cups', 'minor', 'cups'],
  ['three-of-cups', 'Three of Cups', 'minor', 'cups'],
  ['four-of-cups', 'Four of Cups', 'minor', 'cups'],
  ['five-of-cups', 'Five of Cups', 'minor', 'cups'],
  ['six-of-cups', 'Six of Cups', 'minor', 'cups'],
  ['seven-of-cups', 'Seven of Cups', 'minor', 'cups'],
  ['eight-of-cups', 'Eight of Cups', 'minor', 'cups'],
  ['nine-of-cups', 'Nine of Cups', 'minor', 'cups'],
  ['ten-of-cups', 'Ten of Cups', 'minor', 'cups'],
  ['page-of-cups', 'Page of Cups', 'minor', 'cups'],
  ['knight-of-cups', 'Knight of Cups', 'minor', 'cups'],
  ['queen-of-cups', 'Queen of Cups', 'minor', 'cups'],
  ['king-of-cups', 'King of Cups', 'minor', 'cups'],
  ['ace-of-swords', 'Ace of Swords', 'minor', 'swords'],
  ['two-of-swords', 'Two of Swords', 'minor', 'swords'],
  ['three-of-swords', 'Three of Swords', 'minor', 'swords'],
  ['four-of-swords', 'Four of Swords', 'minor', 'swords'],
  ['five-of-swords', 'Five of Swords', 'minor', 'swords'],
  ['six-of-swords', 'Six of Swords', 'minor', 'swords'],
  ['seven-of-swords', 'Seven of Swords', 'minor', 'swords'],
  ['eight-of-swords', 'Eight of Swords', 'minor', 'swords'],
  ['nine-of-swords', 'Nine of Swords', 'minor', 'swords'],
  ['ten-of-swords', 'Ten of Swords', 'minor', 'swords'],
  ['page-of-swords', 'Page of Swords', 'minor', 'swords'],
  ['knight-of-swords', 'Knight of Swords', 'minor', 'swords'],
  ['queen-of-swords', 'Queen of Swords', 'minor', 'swords'],
  ['king-of-swords', 'King of Swords', 'minor', 'swords'],
  ['ace-of-pentacles', 'Ace of Pentacles', 'minor', 'pentacles'],
  ['two-of-pentacles', 'Two of Pentacles', 'minor', 'pentacles'],
  ['three-of-pentacles', 'Three of Pentacles', 'minor', 'pentacles'],
  ['four-of-pentacles', 'Four of Pentacles', 'minor', 'pentacles'],
  ['five-of-pentacles', 'Five of Pentacles', 'minor', 'pentacles'],
  ['six-of-pentacles', 'Six of Pentacles', 'minor', 'pentacles'],
  ['seven-of-pentacles', 'Seven of Pentacles', 'minor', 'pentacles'],
  ['eight-of-pentacles', 'Eight of Pentacles', 'minor', 'pentacles'],
  ['nine-of-pentacles', 'Nine of Pentacles', 'minor', 'pentacles'],
  ['ten-of-pentacles', 'Ten of Pentacles', 'minor', 'pentacles'],
  ['page-of-pentacles', 'Page of Pentacles', 'minor', 'pentacles'],
  ['knight-of-pentacles', 'Knight of Pentacles', 'minor', 'pentacles'],
  ['queen-of-pentacles', 'Queen of Pentacles', 'minor', 'pentacles'],
  ['king-of-pentacles', 'King of Pentacles', 'minor', 'pentacles'],
] as const

describe('authored deck data', () => {
  it('contains all 78 cards', () => {
    expect(cards).toHaveLength(78)
  })

  it('preserves every artwork ID, display name, arcana, and suit', () => {
    expect(
      cards.map(({ id, name, arcana, suit }) => [id, name, arcana, suit]),
    ).toEqual(expectedIdentities)
  })

  it('provides non-empty meanings for both orientations of every card', () => {
    for (const card of cards) {
      expect(card.uprightMeaning.trim(), `${card.id} upright`).not.toBe('')
      expect(card.reversedMeaning.trim(), `${card.id} reversed`).not.toBe('')
    }
  })

  it('provides two or three non-empty themes for every card', () => {
    for (const card of cards) {
      expect(card.themes.length, card.id).toBeGreaterThanOrEqual(2)
      expect(card.themes.length, card.id).toBeLessThanOrEqual(3)
      for (const theme of card.themes) {
        expect(theme.trim(), card.id).not.toBe('')
      }
      expect(
        new Set(card.themes.map((theme) => theme.trim().toLowerCase())).size,
        card.id,
      ).toBeGreaterThanOrEqual(2)
    }
  })

  it('gives each card a distinct upright meaning', () => {
    expect(
      new Set(cards.map((card) => card.uprightMeaning.trim().toLowerCase()))
        .size,
    ).toBe(78)
  })

  it('gives each card a distinct reversed meaning', () => {
    expect(
      new Set(cards.map((card) => card.reversedMeaning.trim().toLowerCase()))
        .size,
    ).toBe(78)
  })

  it('gives each card a distinct complete theme list', () => {
    expect(
      new Set(
        cards.map((card) =>
          card.themes.map((theme) => theme.trim().toLowerCase()).join('|'),
        ),
      ).size,
    ).toBe(78)
  })

  it('leaves no unresolved template tokens in reader-facing copy', () => {
    for (const card of cards) {
      for (const text of [
        card.uprightMeaning,
        card.reversedMeaning,
        ...card.themes,
      ]) {
        expect(text, card.id).not.toMatch(/\{[^}]*\}|<%[^%]*%>/)
      }
    }
  })
})
