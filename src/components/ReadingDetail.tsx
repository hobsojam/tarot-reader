import type { DealtCard } from '../domain/card'
import { synthesizeInterpretation } from '../domain/interpretation'
import type { SpreadPosition } from '../domain/spread'

interface ReadingDetailProps {
  readonly card?: DealtCard
  readonly position?: SpreadPosition
}

export function ReadingDetail({ card, position }: ReadingDetailProps) {
  if (!card || !position) {
    return (
      <aside aria-label="Card interpretation" className="reading-detail">
        <p>Reveal a card to see its contextual interpretation.</p>
      </aside>
    )
  }

  return (
    <aside aria-label="Card interpretation" className="reading-detail">
      <h2>{position.label}</h2>
      <h3>{card.name}</h3>
      <section aria-labelledby="card-meaning">
        <h4 id="card-meaning">Card meaning</h4>
        <p>{card.uprightMeaning}</p>
      </section>
      <section aria-labelledby="position-meaning">
        <h4 id="position-meaning">Position meaning</h4>
        <p>{position.prompt}</p>
      </section>
      <section aria-labelledby="contextual-meaning">
        <h4 id="contextual-meaning">In this reading</h4>
        <p>{synthesizeInterpretation(card, position, card.orientation)}</p>
      </section>
    </aside>
  )
}
