import type { CSSProperties } from 'react'
import type { DealtCard } from '../domain/card'
import type { Spread } from '../domain/spread'
import { TarotCard } from './TarotCard'

interface ReadingBoardProps {
  readonly cards: readonly DealtCard[]
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
    <section
      aria-label={`${spread.name} reading`}
      className={`reading-board reading-board--${spread.id}`}
    >
      {spread.positions.map((position, index) => {
        const card = cards[index]

        if (!card) return null

        return (
          <div
            className="reading-position"
            key={position.id}
            style={
              {
                '--position-column': position.column,
                '--position-row': position.row,
              } as CSSProperties
            }
          >
            <p aria-hidden="true" className="reading-position__label">
              {position.label}
            </p>
            <TarotCard
              card={card}
              label={position.label}
              onReveal={() => onReveal(position.id)}
              orientation={card.orientation}
              revealed={revealedPositionIds.has(position.id)}
            />
          </div>
        )
      })}
    </section>
  )
}
