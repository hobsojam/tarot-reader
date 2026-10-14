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
  arcana: 'major' as const,
}

it('renders a revealed card face with descriptive alt text', () => {
  render(<TarotCard card={card} label="Past" onReveal={() => {}} revealed />)

  const face = screen.getByRole('img', { name: /the fool tarot card/i })
  expect(face.getAttribute('src')).toBe('/cards/the-fool-420.webp')
  expect(face.getAttribute('width')).toBe('420')
  expect(face.getAttribute('height')).toBe('704')
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
  const back = container.querySelector('img')
  expect(back?.getAttribute('src')).toBe('/card-back-420.webp')
  expect(back?.getAttribute('width')).toBe('420')
  expect(back?.getAttribute('height')).toBe('725')
})
