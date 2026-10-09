import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import { TarotCard } from './TarotCard'

afterEach(cleanup)

const card = {
  id: 'the-fool',
  name: 'The Fool',
  uprightMeaning: 'Beginnings and trust.',
  reversedMeaning: 'A beginning may need more preparation.',
  themes: ['beginnings'],
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

it('shows a decorative back without exposing a face-down card identity', () => {
  const { container } = render(
    <TarotCard card={card} label="Past" onReveal={() => {}} revealed={false} />,
  )

  expect(screen.queryByRole('img')).toBeNull()
  expect(screen.getByRole('button', { name: /past: face down/i })).toBeTruthy()
  expect(container.querySelector('img')?.getAttribute('src')).toBe(
    '/card-back.png',
  )
})
