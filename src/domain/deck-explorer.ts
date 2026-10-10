import type { Arcana, Card, Suit } from './card'

export type DeckExplorerFilter = 'all' | Arcana | Suit

export function filterDeckCards(
  cards: readonly Card[],
  search: string,
  filter: DeckExplorerFilter,
): readonly Card[] {
  const query = search.trim().toLocaleLowerCase()

  return cards.filter((card) => {
    const matchesFilter =
      filter === 'all' || card.arcana === filter || card.suit === filter
    const searchableMeaning = [
      ...card.themes,
      card.uprightMeaning,
      card.reversedMeaning,
    ]
      .join(' ')
      .toLocaleLowerCase()

    return matchesFilter && searchableMeaning.includes(query)
  })
}
