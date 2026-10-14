import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import type { DealtCard } from '../domain/card'
import type { SpreadPosition } from '../domain/spread'
import { ReflectionAnchorCard } from './ReflectionAnchorCard'

afterEach(cleanup)

const card: DealtCard = {
  id: 'the-star',
  name: 'The Star',
  uprightMeaning: 'Renewed hope.',
  reversedMeaning: 'Hope that needs tending.',
  themes: ['hope'],
  arcana: 'major',
  orientation: 'upright',
}

const position: SpreadPosition = {
  id: 'present',
  label: 'Present',
  row: 1,
  column: 1,
  readingOrder: 1,
  prompt: 'What is most active now.',
  lens: 'current energy',
  synthesisTemplate: '{card}',
}

it('shows the full-size face of the reading centre', () => {
  render(<ReflectionAnchorCard card={card} position={position} />)

  const face = screen.getByRole('img', { name: /the star upright/i })
  expect(face.getAttribute('src')).toBe('/cards/the-star-420.webp')
  expect(face.getAttribute('width')).toBe('420')
  expect(Number(face.getAttribute('height'))).toBeGreaterThan(0)
})
