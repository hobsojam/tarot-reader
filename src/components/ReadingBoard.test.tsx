import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import App from '../App'

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
