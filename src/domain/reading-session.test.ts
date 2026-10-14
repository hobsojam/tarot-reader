import { cards } from '../data/cards'
import { readingFocuses } from '../data/reading-focuses'
import { spreads } from '../data/spreads'
import { describe, expect, it } from 'vitest'
import type { ReadingFocus } from './reading-focus'
import type { Spread } from './spread'
import {
  getNarrativeFraming,
  getReflectionAnchor,
  getRevealedReadingCards,
  getSelectedReadingCard,
  isReadingComplete,
  revealAll,
  revealPosition,
  startReading,
} from './reading-session'

const threeCardSpread = spreads.find((spread) => spread.id === 'three-card')!
const generalGuidance = readingFocuses.find(
  (focus) => focus.id === 'general-guidance',
)!
const somethingElse = readingFocuses.find(
  (focus) => focus.id === 'something-else',
)!
const fixedRandom = () => 0.99

const startTestReading = (
  overrides: Partial<{
    customQuestion: string
    focus: ReadingFocus
    spread: Spread
  }> = {},
) =>
  startReading({
    cards,
    spread: overrides.spread ?? threeCardSpread,
    focus: overrides.focus ?? generalGuidance,
    customQuestion: overrides.customQuestion ?? '',
    random: fixedRandom,
  })

describe('reading sessions', () => {
  it('captures the supplied spread and deals uniquely oriented cards', () => {
    const session = startTestReading()

    expect(session.spread).toBe(threeCardSpread)
    expect(session.cards).toHaveLength(3)
    expect(new Set(session.cards.map((card) => card.id)).size).toBe(3)
    expect(session.cards.every((card) => card.orientation === 'upright')).toBe(
      true,
    )
    expect(session.revealedPositionIds.size).toBe(0)
    expect(session.selectedPositionId).toBeNull()
  })

  it('reveals a known position and returns its selected card-position pair', () => {
    const session = revealPosition(startTestReading(), 'present')

    expect(session.revealedPositionIds).toEqual(new Set(['present']))
    expect(session.selectedPositionId).toBe('present')
    expect(getSelectedReadingCard(session)).toMatchObject({
      position: { id: 'present', label: 'Present' },
    })
  })

  it('leaves a session unchanged for an unknown position ID', () => {
    const session = startTestReading()

    expect(revealPosition(session, 'not-a-position')).toBe(session)
  })

  it('reveals all positions and selects the lowest reading-order position', () => {
    const scrambledSpread: Spread = {
      ...threeCardSpread,
      positions: [
        threeCardSpread.positions[2]!,
        threeCardSpread.positions[1]!,
        threeCardSpread.positions[0]!,
      ],
    }

    const session = revealAll(startTestReading({ spread: scrambledSpread }))

    expect(session.revealedPositionIds).toEqual(
      new Set(['future', 'present', 'past']),
    )
    expect(session.selectedPositionId).toBe('past')
  })

  it('preserves the selected position when revealing all cards', () => {
    const session = revealAll(revealPosition(startTestReading(), 'present'))

    expect(session.selectedPositionId).toBe('present')
  })

  it('returns revealed card-position pairs in reading order and detects completion', () => {
    const revealed = revealPosition(
      revealPosition(startTestReading(), 'future'),
      'past',
    )

    expect(
      getRevealedReadingCards(revealed).map(({ position }) => position.id),
    ).toEqual(['past', 'future'])
    expect(isReadingComplete(revealed)).toBe(false)
    expect(isReadingComplete(revealAll(revealed))).toBe(true)
  })

  it('returns the configured revealed reflection anchor and safely handles missing anchors', () => {
    const completeSession = revealAll(startTestReading())
    const missingAnchorSession = revealAll(
      startTestReading({
        spread: {
          ...threeCardSpread,
          reflectionAnchorPositionId: 'missing-anchor',
        },
      }),
    )

    expect(getReflectionAnchor(completeSession)).toMatchObject({
      position: { id: 'present' },
    })
    expect(getReflectionAnchor(missingAnchorSession)).toBeUndefined()
    expect(getReflectionAnchor(startTestReading())).toBeUndefined()
  })

  it('uses a trimmed custom question only for the Something else focus', () => {
    const questionSession = startTestReading({
      focus: somethingElse,
      customQuestion: '  A clear question  ',
    })
    const normalFocusSession = startTestReading({
      customQuestion: '  A leftover question  ',
    })

    expect(questionSession.customQuestion).toBe('A clear question')
    expect(getNarrativeFraming(questionSession)).toBe(
      'your question, “A clear question”',
    )
    expect(normalFocusSession.customQuestion).toBe('')
    expect(getNarrativeFraming(normalFocusSession)).toBe(
      generalGuidance.narrativeFraming,
    )
  })
})
