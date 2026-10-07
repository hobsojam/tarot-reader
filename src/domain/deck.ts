import { cards } from '../data/cards'
import type { Card } from './card'

export const createDeck = (): Card[] => [...cards]

export const shuffleDeck = (
  cardsToShuffle: readonly Card[],
  random = Math.random,
): Card[] => {
  const shuffled = [...cardsToShuffle]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export const deal = (
  deck: readonly Card[],
  count: number,
): { dealt: Card[]; remaining: Card[] } => {
  if (!Number.isInteger(count) || count < 0 || count > deck.length) {
    throw new RangeError(
      'Deal count must be a whole number within the deck size.',
    )
  }

  return { dealt: deck.slice(0, count), remaining: deck.slice(count) }
}
