import { useEffect } from 'react'
import type { Card } from '../domain/card'
import {
  filterDeckCards,
  type DeckExplorerFilter,
} from '../domain/deck-explorer'

interface DeckExplorerProps {
  readonly cards: readonly Card[]
  readonly filter: DeckExplorerFilter
  readonly onFilterChange: (filter: DeckExplorerFilter) => void
  readonly onSearchChange: (search: string) => void
  readonly onSelectCard: (cardId: string | null) => void
  readonly search: string
  readonly selectedCardId: string | null
}

const filters: readonly { label: string; value: DeckExplorerFilter }[] = [
  { label: 'All cards', value: 'all' },
  { label: 'Major Arcana', value: 'major' },
  { label: 'Wands', value: 'wands' },
  { label: 'Cups', value: 'cups' },
  { label: 'Swords', value: 'swords' },
  { label: 'Pentacles', value: 'pentacles' },
]

export function DeckExplorer({
  cards,
  filter,
  onFilterChange,
  onSearchChange,
  onSelectCard,
  search,
  selectedCardId,
}: DeckExplorerProps) {
  const visibleCards = filterDeckCards(cards, search, filter)
  const selectedCard = visibleCards.find((card) => card.id === selectedCardId)

  useEffect(() => {
    if (selectedCardId && !selectedCard) {
      onSelectCard(null)
    }
  }, [onSelectCard, selectedCard, selectedCardId])

  return (
    <section aria-labelledby="deck-explorer-heading" className="deck-explorer">
      <h2 id="deck-explorer-heading">Explore the deck</h2>
      <label className="deck-explorer__search">
        Search meanings
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          type="search"
          value={search}
        />
      </label>
      <div aria-label="Deck categories" className="deck-explorer__filters">
        {filters.map((category) => (
          <button
            aria-pressed={filter === category.value}
            key={category.value}
            onClick={() => onFilterChange(category.value)}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </div>
      <p className="deck-explorer__count">
        {visibleCards.length} {visibleCards.length === 1 ? 'card' : 'cards'}
      </p>
      <div className="deck-explorer__workspace">
        {visibleCards.length > 0 ? (
          <div aria-label="Deck cards" className="deck-explorer__grid">
            {visibleCards.map((card) => (
              <button
                aria-pressed={card.id === selectedCardId}
                className="deck-explorer__card"
                key={card.id}
                onClick={() => onSelectCard(card.id)}
                type="button"
              >
                <img
                  alt=""
                  src={`${import.meta.env.BASE_URL}cards/${card.id}.png`}
                />
                <span>{card.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p>No cards match this meaning yet.</p>
        )}
        {selectedCard ? (
          <aside aria-label="Card details" className="deck-explorer__detail">
            <img
              alt={`${selectedCard.name} tarot card`}
              src={`${import.meta.env.BASE_URL}cards/${selectedCard.id}.png`}
            />
            <h3>{selectedCard.name}</h3>
            <p>{selectedCard.themes.join(', ')}</p>
            <h4>Upright meaning</h4>
            <p>{selectedCard.uprightMeaning}</p>
            <h4>Reversed meaning</h4>
            <p>{selectedCard.reversedMeaning}</p>
          </aside>
        ) : null}
      </div>
    </section>
  )
}
