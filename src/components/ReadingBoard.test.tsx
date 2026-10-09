import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import App from '../App'
import { cards } from '../data/cards'

afterEach(cleanup)

it('deals three face-down positions and reveals a card with keyboard activation', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /three card/i }))
  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))

  const pastCard = screen.getByRole('button', { name: /past: face down/i })
  expect(screen.getAllByRole('button', { name: /face down/i })).toHaveLength(3)

  fireEvent.keyDown(pastCard, { key: 'Enter' })

  expect(
    screen.getByRole('button', { name: /past: .+ revealed/i }),
  ).toBeTruthy()
  expect(
    within(
      screen.getByRole('complementary', { name: /card interpretation/i }),
    ).getByRole('heading', { name: /past/i }),
  ).toBeTruthy()
})

it('explains the numbered reading order for the selected spread', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /celtic cross/i }))
  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))

  expect(
    screen.getByRole('region', { name: /celtic cross reading/i }).className,
  ).toMatch(/reading-board--celtic-cross/)
  const readingOrder = screen.getByRole('list', { name: /reading order/i })
  expect(readingOrder).toBeTruthy()
  expect(within(readingOrder).getByText(/foundation:/i).textContent).toBe(
    'Foundation: The underlying influence or root condition.',
  )
  expect(
    screen.getByText(/underlying influence or root condition/i),
  ).toBeTruthy()
})

it('guides the reader before selection and separates contextual meanings after reveal', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /three card/i }))
  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))

  const detail = screen.getByRole('complementary', {
    name: /card interpretation/i,
  })
  expect(
    within(detail).getByText(
      'Reveal a card to see its contextual interpretation.',
    ),
  ).toBeTruthy()

  const pastCard = screen.getByRole('button', { name: /past: face down/i })
  fireEvent.click(pastCard)

  const revealedName = within(detail).getByRole('heading', {
    level: 3,
  }).textContent!
  const revealedCard = cards.find((card) => card.name === revealedName)!

  expect(
    within(detail).getByRole('heading', { name: /card meaning/i }),
  ).toBeTruthy()
  expect(
    within(detail).getByRole('heading', { name: /position meaning/i }),
  ).toBeTruthy()
  expect(
    within(detail).getByRole('heading', { name: /in this reading/i }),
  ).toBeTruthy()
  expect(within(detail).getByText(revealedCard.uprightMeaning)).toBeTruthy()
  expect(within(detail).getByText('What has shaped this moment.')).toBeTruthy()
  expect(
    within(detail).getByText(
      /as a formative influence that still informs the present/i,
    ),
  ).toBeTruthy()
})
