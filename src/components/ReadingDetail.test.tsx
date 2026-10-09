import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import { cards } from '../data/cards'
import { spreads } from '../data/spreads'
import { ReadingDetail } from './ReadingDetail'

afterEach(cleanup)

const fool = cards.find((card) => card.id === 'the-fool')!
const past = spreads[0].positions[0]

it('shows upright card meaning with an upright orientation label', () => {
  render(
    <ReadingDetail
      card={{ ...fool, orientation: 'upright' }}
      position={past}
    />,
  )

  expect(
    screen.getByRole('heading', { name: 'The Fool — Upright' }),
  ).toBeTruthy()
  expect(screen.getByText(fool.uprightMeaning)).toBeTruthy()
  expect(screen.queryByText(fool.reversedMeaning)).toBeNull()
})

it('shows reversed card meaning with context and a reversed orientation label', () => {
  render(
    <ReadingDetail
      card={{ ...fool, orientation: 'reversed' }}
      position={past}
    />,
  )

  expect(
    screen.getByRole('heading', { name: 'The Fool — Reversed' }),
  ).toBeTruthy()
  expect(screen.getByText(fool.reversedMeaning)).toBeTruthy()
  expect(screen.queryByText(fool.uprightMeaning)).toBeNull()
  expect(screen.getByText(past.prompt)).toBeTruthy()
  expect(
    screen.getByText(/formative influence that still informs the present/i),
  ).toBeTruthy()
})
