import type { DealtCard } from '../domain/card'
import type { SpreadPosition } from '../domain/spread'

interface ReflectionAnchorCardProps {
  readonly card: DealtCard
  readonly position: SpreadPosition
}

export function ReflectionAnchorCard({
  card,
  position,
}: ReflectionAnchorCardProps) {
  return (
    <section aria-label="Center of the reading" className="reflection-anchor">
      <h3>Center of the reading</h3>
      <img
        alt={`${position.label}: ${card.name} ${card.orientation} tarot card`}
        className={`reflection-anchor__image${card.orientation === 'reversed' ? ' reflection-anchor__image--reversed' : ''}`}
        src={`${import.meta.env.BASE_URL}cards/${card.id}.png`}
      />
      <p>
        {position.label} · {card.orientation}
      </p>
    </section>
  )
}
