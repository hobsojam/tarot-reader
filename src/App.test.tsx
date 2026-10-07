import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
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
