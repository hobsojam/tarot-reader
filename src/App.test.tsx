import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from './App'

it('renders the tarot simulator heading', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: /tarot reader/i })).toBeTruthy()
})
