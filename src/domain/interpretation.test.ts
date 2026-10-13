import { cards } from '../data/cards'
import { spreads } from '../data/spreads'
import { expect, it } from 'vitest'
import type { DealtCard } from './card'
import type { SpreadPosition } from './spread'
import {
  getCardMeaning,
  synthesizeInterpretation,
  synthesizeReadingNarrative,
} from './interpretation'

const celticCross = spreads.find((spread) => spread.id === 'celtic-cross')!
const empress = cards.find((card) => card.id === 'the-empress')!
const dealtEmpress: DealtCard = { ...empress, orientation: 'upright' }
const self = celticCross.positions.find((position) => position.id === 'self')!
const foundation = celticCross.positions.find(
  (position) => position.id === 'foundation',
)!
const testCard: DealtCard = {
  id: 'test-card',
  name: 'Test Card',
  uprightMeaning: 'An open path.',
  reversedMeaning: 'A pause invites reflection.',
  themes: ['reflection'],
  arcana: 'major',
  orientation: 'upright',
}
const present: SpreadPosition = {
  id: 'present',
  label: 'Present',
  row: 1,
  column: 1,
  readingOrder: 1,
  prompt: 'What is active now?',
  lens: 'Present energy',
  synthesisTemplate: 'Notice how {theme} is active now.',
}

it('synthesizes distinct Self and Foundation readings from a card theme', () => {
  const selfReading = synthesizeInterpretation(dealtEmpress, self)
  const foundationReading = synthesizeInterpretation(dealtEmpress, foundation)

  expect(selfReading).toContain('nurturing')
  expect(foundationReading).toContain('nurturing')
  expect(selfReading).not.toBe(foundationReading)
})

it('selects original meaning from the dealt orientation', () => {
  const card: DealtCard = {
    id: 'test-card',
    name: 'Test Card',
    uprightMeaning: 'An open path.',
    reversedMeaning: 'A pause invites reflection.',
    themes: ['reflection'],
    arcana: 'major',
    orientation: 'upright',
  }

  expect(getCardMeaning(card)).toBe('An open path.')
  expect(getCardMeaning({ ...card, orientation: 'reversed' })).toBe(
    'A pause invites reflection.',
  )
})

it('gives every card original reversed copy', () => {
  expect(cards).toHaveLength(78)
  expect(
    cards.every(
      (card) =>
        card.reversedMeaning.length > 0 &&
        card.reversedMeaning !== card.uprightMeaning &&
        !card.reversedMeaning.includes('{theme}'),
    ),
  ).toBe(true)
  expect(cards.find((card) => card.id === 'the-fool')?.reversedMeaning).toBe(
    'A pause around beginnings can be an invitation to prepare, not a reason to abandon the path.',
  )
})

it('falls back to the card name when a card has no themes', () => {
  const card: DealtCard = {
    id: 'test-card',
    name: 'Test Card',
    uprightMeaning: 'A test meaning.',
    reversedMeaning: 'A reversed test meaning.',
    themes: [],
    arcana: 'major',
    orientation: 'upright',
  }

  expect(synthesizeInterpretation(card, self)).toContain('Test Card')
})

it('begins contextual interpretations with the dealt orientation meaning', () => {
  const upright = synthesizeInterpretation(testCard, present)
  const reversed = synthesizeInterpretation(
    { ...testCard, orientation: 'reversed' },
    present,
  )

  expect(upright).toMatch(/^An open path\./)
  expect(reversed).toMatch(/^A pause invites reflection\./)
  expect(upright).not.toContain('A pause invites reflection.')
  expect(reversed).not.toContain('An open path.')
  expect(upright).toContain('Notice how reflection is active now.')
  expect(reversed).toContain('Notice how reflection is active now.')
  expect(reversed).not.toBe(upright)
})

it('includes the dealt orientation meaning in the reading narrative', () => {
  const upright = synthesizeReadingNarrative([
    { card: testCard, position: present },
  ])
  const reversed = synthesizeReadingNarrative([
    { card: { ...testCard, orientation: 'reversed' }, position: present },
  ])

  expect(upright).toContain('An open path.')
  expect(reversed).toContain('A pause invites reflection.')
  expect(upright).not.toContain('A pause invites reflection.')
  expect(reversed).not.toContain('An open path.')
  expect(upright).toContain('At Present')
  expect(reversed).toContain('At Present')
  expect(upright).toContain('lens of present energy')
  expect(reversed).toContain('lens of present energy')
  expect(reversed).toContain('appears reversed')
  expect(reversed).not.toBe(upright)
})

it('gives two Wands cards distinct interpretations at the same position', () => {
  const ace: DealtCard = {
    ...cards.find((card) => card.id === 'ace-of-wands')!,
    orientation: 'upright',
  }
  const two: DealtCard = {
    ...cards.find((card) => card.id === 'two-of-wands')!,
    orientation: 'upright',
  }

  expect(synthesizeInterpretation(ace, present)).not.toBe(
    synthesizeInterpretation(two, present),
  )
  expect(
    synthesizeReadingNarrative([{ card: ace, position: present }]),
  ).toContain(ace.uprightMeaning)
  expect(
    synthesizeReadingNarrative([{ card: two, position: present }]),
  ).toContain(two.uprightMeaning)
})

it('frames a non-empty narrative with the reading focus', () => {
  const narrative = synthesizeReadingNarrative(
    [{ card: testCard, position: present }],
    'a creative project',
  )

  expect(narrative).toMatch(
    /^Consider this reading through the lens of a creative project\./,
  )
  expect(synthesizeReadingNarrative([], 'a creative project')).toBe('')
})

it('frames the Near Future as a possibility rather than a certainty', () => {
  const nearFuture = celticCross.positions.find(
    (position) => position.id === 'near-future',
  )!

  expect(synthesizeInterpretation(dealtEmpress, nearFuture)).toContain(
    'might become relevant',
  )
})

it('builds a progressive narrative in reading order and notes reversed cards', () => {
  const narrative = synthesizeReadingNarrative([
    { card: { ...dealtEmpress, orientation: 'reversed' }, position: self },
    { card: dealtEmpress, position: foundation },
  ])

  expect(narrative.indexOf('Foundation')).toBeLessThan(
    narrative.indexOf('Self'),
  )
  expect(narrative).toContain('appears reversed')
  expect(synthesizeReadingNarrative([])).toBe('')
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
