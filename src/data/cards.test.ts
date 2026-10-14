import { describe, expect, it } from 'vitest'
import { cards } from './cards'

describe('authored deck data', () => {
  it('contains 78 cards with content for both orientations', () => {
    expect(cards).toHaveLength(78)

    for (const card of cards) {
      expect(card.uprightMeaning.trim(), `${card.id} upright`).not.toBe('')
      expect(card.reversedMeaning.trim(), `${card.id} reversed`).not.toBe('')
    }
  })

  it('gives every card two or three non-empty themes', () => {
    for (const card of cards) {
      expect(card.themes.length, card.id).toBeGreaterThanOrEqual(2)
      expect(card.themes.length, card.id).toBeLessThanOrEqual(3)
      expect(card.themes.every((theme) => theme.trim() !== ''), card.id).toBe(
        true,
      )
    }
  })

  it('keeps meanings and complete theme lists unique', () => {
    const uprightMeanings = cards.map((card) =>
      card.uprightMeaning.trim().toLocaleLowerCase(),
    )
    const reversedMeanings = cards.map((card) =>
      card.reversedMeaning.trim().toLocaleLowerCase(),
    )
    const themeLists = cards.map((card) =>
      card.themes.map((theme) => theme.trim().toLocaleLowerCase()).join('|'),
    )

    expect(new Set(uprightMeanings)).toHaveLength(78)
    expect(new Set(reversedMeanings)).toHaveLength(78)
    expect(new Set(themeLists)).toHaveLength(78)
  })

  it('contains no unresolved template tokens in reader-facing copy', () => {
    for (const card of cards) {
      for (const content of [
        card.uprightMeaning,
        card.reversedMeaning,
        ...card.themes,
      ]) {
        expect(content, card.id).not.toMatch(/\{[^}]*\}|<%[^%]*%>/)
      }
    }
  })
})
