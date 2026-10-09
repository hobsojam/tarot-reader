import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import App from './App'

afterEach(cleanup)

it('renders the tarot simulator heading', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: /tarot reader/i })).toBeTruthy()
})

it('reveals all cards and starts a fresh reading', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))
  fireEvent.click(screen.getByRole('button', { name: /reveal all/i }))

  expect(screen.getAllByRole('button', { name: /revealed/i })).toHaveLength(3)

  fireEvent.click(screen.getByRole('button', { name: /new reading/i }))

  expect(screen.queryByRole('button', { name: /revealed/i })).toBeNull()
  expect(screen.getByRole('button', { name: /start reading/i })).toBeTruthy()
})

it('deals reversed cards by default', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))
  fireEvent.click(screen.getByRole('button', { name: /past: face down/i }))

  expect(
    screen.getByRole('button', { name: /past: .+ reversed/i }),
  ).toBeTruthy()
  expect(
    screen.queryByRole('checkbox', { name: /include reversals/i }),
  ).toBeNull()
  vi.restoreAllMocks()
})

it('shows a custom question field only for the Something else focus', () => {
  render(<App />)

  expect(screen.queryByLabelText(/your question/i)).toBeNull()

  fireEvent.change(screen.getByLabelText(/reading focus/i), {
    target: { value: 'something-else' },
  })

  expect(screen.getByLabelText(/your question/i)).toBeTruthy()
})

it('uses the selected focus in the active reading narrative', () => {
  render(<App />)

  fireEvent.change(screen.getByLabelText(/reading focus/i), {
    target: { value: 'relationships' },
  })
  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))

  expect(screen.getByText('Focus: Relationships')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: /past: face down/i }))

  expect(
    screen.getByRole('region', { name: /reading so far/i }).textContent,
  ).toMatch(/lens of relationship patterns/i)
})

it('opens reflection prompts only after every card is revealed', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: /start reading/i }))
  expect(
    screen.queryByRole('button', { name: /reflect on this reading/i }),
  ).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /reveal all/i }))
  expect(
    screen.getByRole('button', { name: /reflect on this reading/i }),
  ).toBeTruthy()
  expect(screen.queryByRole('region', { name: /reflection/i })).toBeNull()

  fireEvent.click(
    screen.getByRole('button', { name: /reflect on this reading/i }),
  )

  const reflection = screen.getByRole('region', { name: /reflection/i })
  expect(
    within(reflection).getByRole('heading', { name: /completed thread/i }),
  ).toBeTruthy()
  const centerCard = within(reflection).getByRole('region', {
    name: /center of the reading/i,
  })
  expect(
    within(centerCard).getByRole('img', { name: /present.*tarot card/i }),
  ).toBeTruthy()
  expect(
    within(reflection).getByText(/what part of this completed thread/i),
  ).toBeTruthy()
  expect(within(reflection).getByText(/what small action/i)).toBeTruthy()
})
