import type { Card, DealtCard } from './card'
import { createDeck, deal, orientCards, shuffleDeck } from './deck'
import type { RevealedReadingCard } from './interpretation'
import type { ReadingFocus } from './reading-focus'
import type { Spread } from './spread'

export interface ReadingSession {
  readonly spread: Spread
  readonly cards: readonly DealtCard[]
  readonly focus: ReadingFocus
  readonly customQuestion: string
  readonly revealedPositionIds: ReadonlySet<string>
  readonly selectedPositionId: string | null
}

export interface StartReadingOptions {
  readonly cards: readonly Card[]
  readonly spread: Spread
  readonly focus: ReadingFocus
  readonly customQuestion: string
  readonly random?: () => number
  readonly reversedChance?: number
}

const getReadingCards = (
  session: ReadingSession,
): readonly RevealedReadingCard[] =>
  session.spread.positions.flatMap((position, index) => {
    const card = session.cards[index]

    return card ? [{ card, position }] : []
  })

export function startReading(options: StartReadingOptions): ReadingSession {
  const random = options.random ?? Math.random
  const { dealt } = deal(
    shuffleDeck(createDeck(options.cards), random),
    options.spread.positions.length,
  )

  return {
    spread: options.spread,
    cards: orientCards(dealt, random, options.reversedChance),
    focus: options.focus,
    customQuestion:
      options.focus.id === 'something-else'
        ? options.customQuestion.trim()
        : '',
    revealedPositionIds: new Set(),
    selectedPositionId: null,
  }
}

export function revealPosition(
  session: ReadingSession,
  positionId: string,
): ReadingSession {
  const positionExists = session.spread.positions.some(
    (position) => position.id === positionId,
  )

  if (!positionExists) return session

  return {
    ...session,
    revealedPositionIds: new Set([...session.revealedPositionIds, positionId]),
    selectedPositionId: positionId,
  }
}

export function revealAll(session: ReadingSession): ReadingSession {
  const firstPosition = [...session.spread.positions].sort(
    (left, right) => left.readingOrder - right.readingOrder,
  )[0]

  return {
    ...session,
    revealedPositionIds: new Set(
      session.spread.positions.map((position) => position.id),
    ),
    selectedPositionId:
      session.selectedPositionId ?? firstPosition?.id ?? null,
  }
}

export function getSelectedReadingCard(
  session: ReadingSession,
): RevealedReadingCard | undefined {
  if (!session.selectedPositionId) return undefined

  return getRevealedReadingCards(session).find(
    ({ position }) => position.id === session.selectedPositionId,
  )
}

export function getRevealedReadingCards(
  session: ReadingSession,
): readonly RevealedReadingCard[] {
  return getReadingCards(session)
    .filter(({ position }) => session.revealedPositionIds.has(position.id))
    .sort(
      (left, right) => left.position.readingOrder - right.position.readingOrder,
    )
}

export function isReadingComplete(session: ReadingSession): boolean {
  return session.spread.positions.every((position) =>
    session.revealedPositionIds.has(position.id),
  )
}

export function getReflectionAnchor(
  session: ReadingSession,
): RevealedReadingCard | undefined {
  return getRevealedReadingCards(session).find(
    ({ position }) => position.id === session.spread.reflectionAnchorPositionId,
  )
}

export function getNarrativeFraming(session: ReadingSession): string {
  return session.customQuestion
    ? `your question, “${session.customQuestion}”`
    : session.focus.narrativeFraming
}
