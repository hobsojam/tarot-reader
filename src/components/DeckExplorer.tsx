import {
  cardFaceSrc,
  cardFaceSrcSet,
  explorerThumbnailSizes,
} from '../domain/card-image'
import { cardFaceSize } from '../data/card-image-size'
import { useEffect, useRef } from 'react'
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
  const detailRef = useRef<HTMLElement>(null)
  const cardButtonRefs = useRef(new Map<string, HTMLButtonElement>())
  const selectionCameFromKeyboard = useRef(false)
  const previousSelectedCardId = useRef(selectedCardId)

  const showDetails = (moveFocus: boolean) => {
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
    detailRef.current?.scrollIntoView?.({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
    if (moveFocus) {
      detailRef.current?.focus({ preventScroll: true })
    }
  }

  useEffect(() => {
    if (selectedCard && selectedCardId !== previousSelectedCardId.current) {
      showDetails(selectionCameFromKeyboard.current)
    }
    previousSelectedCardId.current = selectedCardId
    selectionCameFromKeyboard.current = false
  }, [selectedCard, selectedCardId])

  const selectCard = (cardId: string, fromKeyboard: boolean) => {
    selectionCameFromKeyboard.current = fromKeyboard
    if (cardId === selectedCardId) {
      if (fromKeyboard) {
        showDetails(true)
      }
      return
    }
    onSelectCard(cardId)
  }

  return (
    <section aria-labelledby="deck-explorer-heading" className="deck-explorer">
      <h2 id="deck-explorer-heading">Explore the deck</h2>
      <label className="deck-explorer__search">
        Search meanings
        <input
          onChange={(event) => {
            const nextSearch = event.target.value
            if (
              selectedCardId &&
              !filterDeckCards(cards, nextSearch, filter).some(
                (card) => card.id === selectedCardId,
              )
            ) {
              onSelectCard(null)
            }
            onSearchChange(nextSearch)
          }}
          type="search"
          value={search}
        />
      </label>
      <div aria-label="Deck categories" className="deck-explorer__filters">
        {filters.map((category) => (
          <button
            aria-pressed={filter === category.value}
            key={category.value}
            onClick={() => {
              if (
                selectedCardId &&
                !filterDeckCards(cards, search, category.value).some(
                  (card) => card.id === selectedCardId,
                )
              ) {
                onSelectCard(null)
              }
              onFilterChange(category.value)
            }}
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
                onClick={(event) => selectCard(card.id, event.detail === 0)}
                ref={(element) => {
                  if (element) {
                    cardButtonRefs.current.set(card.id, element)
                  } else {
                    cardButtonRefs.current.delete(card.id)
                  }
                }}
                type="button"
              >
                <img
                  alt=""
                  loading="lazy"
                  sizes={explorerThumbnailSizes}
                  src={cardFaceSrc(
                    card.id,
                    import.meta.env.BASE_URL,
                    'thumbnail',
                  )}
                  srcSet={cardFaceSrcSet(card.id, import.meta.env.BASE_URL)}
                  {...cardFaceSize(card.id, 'thumbnail')}
                />
                <span>{card.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p>No cards match this meaning yet.</p>
        )}
        {selectedCard ? (
          <aside
            aria-label="Card details"
            className="deck-explorer__detail"
            ref={detailRef}
            tabIndex={-1}
          >
            <img
              alt={`${selectedCard.name} tarot card`}
              src={cardFaceSrc(selectedCard.id, import.meta.env.BASE_URL)}
              {...cardFaceSize(selectedCard.id)}
            />
            <h3>{selectedCard.name}</h3>
            <button
              onClick={() =>
                cardButtonRefs.current.get(selectedCard.id)?.focus()
              }
              type="button"
            >
              Back to deck
            </button>
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
