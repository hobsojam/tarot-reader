import type { Card } from '../domain/card'
import type { Spread } from '../domain/spread'
import { TarotCard } from './TarotCard'

interface ReadingBoardProps {
  readonly cards: readonly Card[]
  readonly revealedPositionIds: ReadonlySet<string>
  readonly spread: Spread
  readonly onReveal: (positionId: string) => void
}

export function ReadingBoard({
  cards,
  revealedPositionIds,
  spread,
  onReveal,
}: ReadingBoardProps) {
  return (
    <section aria-label={`${spread.name} reading`} className="reading-board">
      {spread.positions.map((position, index) => {
        const card = cards[index]

        if (!card) return null

        return (
          <div
            className="reading-position"
            key={position.id}
            style={{ gridColumn: position.column, gridRow: position.row }}
          >
            <h2>{position.label}</h2>
            <TarotCard
              card={card}
              label={position.label}
              onReveal={() => onReveal(position.id)}
              revealed={revealedPositionIds.has(position.id)}
            />
          </div>
        )
      })}
    </section>
  )
}
