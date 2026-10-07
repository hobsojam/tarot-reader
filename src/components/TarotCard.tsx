import type { Card } from '../domain/card'

interface TarotCardProps {
  card: Card
  label: string
  revealed: boolean
  onReveal: () => void
}

export function TarotCard({ card, label, revealed, onReveal }: TarotCardProps) {
  const accessibleLabel = revealed
    ? `${label}: ${card.name} revealed`
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
      {revealed ? card.name : 'Face down'}
    </button>
  )
}
