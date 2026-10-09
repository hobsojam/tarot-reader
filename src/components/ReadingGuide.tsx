import type { Spread } from '../domain/spread'

interface ReadingGuideProps {
  readonly spread: Spread
}

export function ReadingGuide({ spread }: ReadingGuideProps) {
  return (
    <section aria-label="Reading guide" className="reading-guide">
      <h2>Reading order</h2>
      <ol aria-label="Reading order" className="reading-order">
        {spread.positions.map((position) => (
          <li key={position.id}>
            {position.label}: {position.prompt}
          </li>
        ))}
      </ol>
    </section>
  )
}
