import { cards } from '../data/cards'
import { spreads } from '../data/spreads'
import { expect, it } from 'vitest'
import type { Card } from './card'
import { synthesizeInterpretation } from './interpretation'

const celticCross = spreads.find((spread) => spread.id === 'celtic-cross')!
const empress = cards.find((card) => card.id === 'the-empress')!
const self = celticCross.positions.find((position) => position.id === 'self')!
const foundation = celticCross.positions.find(
  (position) => position.id === 'foundation',
)!

it('synthesizes distinct Self and Foundation readings from a card theme', () => {
  const selfReading = synthesizeInterpretation(empress, self, 'upright')
  const foundationReading = synthesizeInterpretation(
    empress,
    foundation,
    'upright',
  )

  expect(selfReading).toContain('nurturing')
  expect(foundationReading).toContain('nurturing')
  expect(selfReading).not.toBe(foundationReading)
})

it('falls back to the card name when a card has no themes', () => {
  const card: Card = {
    id: 'test-card',
    name: 'Test Card',
    uprightMeaning: 'A test meaning.',
    themes: [],
  }

  expect(synthesizeInterpretation(card, self, 'upright')).toContain('Test Card')
})

it('accepts reversed orientation while upright-only synthesis is in effect', () => {
  expect(synthesizeInterpretation(empress, self, 'reversed')).toBe(
    synthesizeInterpretation(empress, self, 'upright'),
  )
})

it('gives every spread position a unique lens and template', () => {
  const positions = spreads.flatMap((spread) => spread.positions)
  const lenses = positions.map((position) => position.lens)
  const templates = positions.map((position) => position.synthesisTemplate)

  expect(lenses.every(Boolean)).toBe(true)
  expect(templates.every(Boolean)).toBe(true)
  expect(new Set(lenses)).toHaveLength(positions.length)
  expect(new Set(templates)).toHaveLength(positions.length)
})
