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

it.each([
  ['Three Card', 'reading-board reading-board--three-card'],
  ['Five Card', 'reading-board reading-board--five-card'],
  ['Celtic Cross', 'reading-board reading-board--celtic-cross'],
])('applies the %s board layout hook', (spreadName, expectedClass) => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: spreadName }))
  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))

  expect(
    screen.getByRole('region', { name: `${spreadName} reading` }).className,
  ).toBe(expectedClass)
})

it('deals three face-down positions and reveals the activated card', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /three card/i }))
  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))

  const pastCard = screen.getByRole('button', { name: /past: face down/i })
  expect(screen.getAllByRole('button', { name: /face down/i })).toHaveLength(3)

  fireEvent.click(pastCard)

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
  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))

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

it('groups the Celtic Cross board and reading guide in a workspace', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /celtic cross/i }))
  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))

  const workspace = screen.getByRole('region', {
    name: /celtic cross workspace/i,
  })
  expect(
    within(workspace).getByRole('region', { name: /celtic cross reading/i }),
  ).toBeTruthy()
  expect(
    within(workspace).getByRole('region', { name: /reading guide/i }),
  ).toBeTruthy()
})

it('guides the reader before selection and separates contextual meanings after reveal', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /three card/i }))
  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))

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

  const revealedHeading = within(detail).getByRole('heading', {
    level: 3,
  }).textContent!
  const [, revealedName, orientation] = revealedHeading.match(
    /^(.+) — (Upright|Reversed)$/,
  )!
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
  expect(
    within(detail).getByText(
      orientation === 'Reversed'
        ? revealedCard.reversedMeaning
        : revealedCard.uprightMeaning,
    ),
  ).toBeTruthy()
  expect(within(detail).getByText('What has shaped this moment.')).toBeTruthy()
  expect(
    within(detail).getByText(
      /as a formative influence that still informs the present/i,
    ),
  ).toBeTruthy()
})

it('adds a progressive narrative after a card is revealed', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))
  expect(screen.queryByRole('region', { name: /reading so far/i })).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /past: face down/i }))

  expect(
    within(screen.getByRole('region', { name: /reading so far/i })).getByText(
      /at past,/i,
    ),
  ).toBeTruthy()
})

it('labels board positions without adding page headings', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('radio', { name: /celtic cross/i }))
  fireEvent.click(screen.getByRole('button', { name: /begin reading/i }))

  const board = screen.getByRole('region', { name: 'Celtic Cross reading' })
  expect(within(board).queryAllByRole('heading')).toHaveLength(0)
  expect(within(board).getAllByRole('button')).toHaveLength(10)
  expect(
    within(board).getByRole('button', { name: 'Hopes and Fears: face down' }),
  ).toBeTruthy()
  expect(within(board).getByText('Hopes and Fears')).toBeTruthy()
})
