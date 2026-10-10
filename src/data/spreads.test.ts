import { describe, expect, it } from 'vitest'

import { spreads } from './spreads'

const getSpread = (id: (typeof spreads)[number]['id']) =>
  spreads.find((spread) => spread.id === id)

describe('spreads', () => {
  it('defines the expected labels and unique positions for each supported spread', () => {
    const expectedSpreads = [
      {
        id: 'three-card',
        count: 3,
        labels: ['Past', 'Present', 'Future'],
      },
      {
        id: 'five-card',
        count: 5,
        labels: ['Situation', 'Challenge', 'Past', 'Future', 'Advice'],
      },
      {
        id: 'celtic-cross',
        count: 10,
        labels: [
          'Present',
          'Challenge',
          'Foundation',
          'Past',
          'Possible Outcome',
          'Near Future',
          'Self',
          'Environment',
          'Hopes and Fears',
          'Outcome',
        ],
      },
    ] as const

    for (const expected of expectedSpreads) {
      const spread = getSpread(expected.id)

      expect(spread?.positions).toHaveLength(expected.count)
      expect(spread?.positions.map((position) => position.label)).toEqual(
        expected.labels,
      )
      expect(
        new Set(spread?.positions.map((position) => position.id)).size,
      ).toBe(expected.count)
    }
  })

  it('gives every position a contiguous reading order and explanatory prompt', () => {
    for (const spread of spreads) {
      expect(spread.positions.map((position) => position.readingOrder)).toEqual(
        Array.from(
          { length: spread.positions.length },
          (_, index) => index + 1,
        ),
      )
      expect(
        spread.positions.every((position) => position.prompt.length > 0),
      ).toBe(true)
    }

    expect(getSpread('celtic-cross')?.positions[2].prompt).toMatch(
      /underlying influence|root condition/i,
    )
  })

  it('designates a reflection anchor for every spread', () => {
    expect(
      spreads.map((spread) => ({
        anchor: spread.reflectionAnchorPositionId,
        positionIds: spread.positions.map((position) => position.id),
      })),
    ).toEqual([
      { anchor: 'present', positionIds: ['past', 'present', 'future'] },
      {
        anchor: 'situation',
        positionIds: ['situation', 'challenge', 'past', 'future', 'advice'],
      },
      {
        anchor: 'present',
        positionIds: [
          'present',
          'challenge',
          'foundation',
          'past',
          'possible-outcome',
          'near-future',
          'self',
          'environment',
          'hopes-and-fears',
          'outcome',
        ],
      },
    ])
  })
})
