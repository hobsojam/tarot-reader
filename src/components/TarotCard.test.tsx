import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import { TarotCard } from './TarotCard'

afterEach(cleanup)

const card = {
  id: 'the-fool',
  name: 'The Fool',
  uprightMeaning: 'Beginnings and trust.',
}

it('renders a revealed card face with descriptive alt text', () => {
  render(<TarotCard card={card} label="Past" onReveal={() => {}} revealed />)

  expect(
    screen
      .getByRole('img', { name: /the fool tarot card/i })
      .getAttribute('src'),
  ).toBe('/cards/the-fool.png')
  expect(
    screen.getByRole('img', { name: /the fool tarot card/i }).className,
  ).toBe('tarot-card__image')
})

it('does not expose a face-down card identity', () => {
  render(
    <TarotCard card={card} label="Past" onReveal={() => {}} revealed={false} />,
  )

  expect(screen.queryByRole('img')).toBeNull()
  expect(screen.getByRole('button', { name: /past: face down/i })).toBeTruthy()
})
