import type { Card } from '../domain/card'
import type { SpreadPosition } from '../domain/spread'

interface ReadingDetailProps {
  readonly card: Card
  readonly position: SpreadPosition
}

export function ReadingDetail({ card, position }: ReadingDetailProps) {
  return (
    <aside aria-label="Card interpretation" className="reading-detail">
      <h2>{position.label}</h2>
      <h3>{card.name}</h3>
      <p>{card.uprightMeaning}</p>
    </aside>
  )
}
