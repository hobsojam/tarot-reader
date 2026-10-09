import type { DealtCard } from './card'
import type { SpreadPosition } from './spread'

export interface RevealedReadingCard {
  readonly card: DealtCard
  readonly position: SpreadPosition
}

export function getCardMeaning(card: DealtCard): string {
  return card.orientation === 'reversed'
    ? card.reversedMeaning
    : card.uprightMeaning
}

export function synthesizeInterpretation(
  card: DealtCard,
  position: SpreadPosition,
): string {
  const theme = card.themes[0] ?? card.name

  return position.synthesisTemplate.replaceAll('{theme}', theme)
}

export function synthesizeReadingNarrative(
  revealedCards: readonly RevealedReadingCard[],
  focus?: string,
): string {
  const narrative = [...revealedCards]
    .sort(
      (left, right) => left.position.readingOrder - right.position.readingOrder,
    )
    .map(({ card, position }) => {
      const theme = card.themes[0] ?? card.name
      const lens = position.lens.toLowerCase()

      return card.orientation === 'reversed'
        ? `At ${position.label}, ${card.name} appears reversed, inviting reflection on ${theme} through the lens of ${lens}.`
        : `At ${position.label}, ${card.name} brings ${theme} into focus through the lens of ${lens}.`
    })
    .join(' ')

  return focus && narrative
    ? `Consider this reading through the lens of ${focus}. ${narrative}`
    : narrative
}
