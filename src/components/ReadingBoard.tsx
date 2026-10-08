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
      className={`reading-board${spread.id === 'celtic-cross' ? ' reading-board--celtic-cross' : ''}`}
    >
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
              orientation={card.orientation}
              revealed={revealedPositionIds.has(position.id)}
            />
          </div>
        )
      })}
      <ol aria-label="Reading order" className="reading-order">
        {spread.positions.map((position) => (
          <li key={position.id}>
            {position.readingOrder}. {position.label}: {position.prompt}
          </li>
        ))}
      </ol>
    </section>
  )
}
