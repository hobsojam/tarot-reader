import type { Card, Orientation } from './card'
import type { SpreadPosition } from './spread'

export function synthesizeInterpretation(
  card: Card,
  position: SpreadPosition,
  orientation: Orientation,
): string {
  void orientation
  const theme = card.themes[0] ?? card.name

  return position.synthesisTemplate.replaceAll('{theme}', theme)
}
