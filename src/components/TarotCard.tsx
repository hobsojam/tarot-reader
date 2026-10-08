import type { Card } from '../domain/card'

interface TarotCardProps {
  readonly card: Card
  readonly label: string
  readonly revealed: boolean
  readonly onReveal: () => void
  readonly orientation?: 'upright' | 'reversed'
}

export function TarotCard({
  card,
  label,
  revealed,
  onReveal,
  orientation = 'upright',
}: TarotCardProps) {
  const accessibleLabel = revealed
    ? `${label}: ${card.name} ${orientation} revealed`
    : `${label}: face down`

  return (
    <button
      aria-label={accessibleLabel}
      className={`tarot-card${revealed ? ' tarot-card--revealed' : ''}`}
      onClick={onReveal}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onReveal()
        }
      }}
      type="button"
    >
      {revealed ? (
        <img
          alt={`${card.name} tarot card`}
          className={`tarot-card__image${orientation === 'reversed' ? ' tarot-card__image--reversed' : ''}`}
          src={`${import.meta.env.BASE_URL}cards/${card.id}.png`}
        />
      ) : (
        <img
          alt=""
          className="tarot-card__image"
          src={`${import.meta.env.BASE_URL}card-back.png`}
        />
      )}
    </button>
  )
}
