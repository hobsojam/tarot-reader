import type { DealtCard } from './card'
import type { SpreadPosition } from './spread'

export function synthesizeInterpretation(
  card: DealtCard,
  position: SpreadPosition,
): string {
  const theme = card.themes[0] ?? card.name

  return position.synthesisTemplate.replaceAll('{theme}', theme)
}
