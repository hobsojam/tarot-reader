import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { Card } from '../domain/card'
import type { DeckExplorerFilter } from '../domain/deck-explorer'
import { DeckExplorer } from './DeckExplorer'

const scrollIntoView = vi.fn()

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoView,
  })
})

afterEach(() => {
  cleanup()
  scrollIntoView.mockClear()
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView
})

const cards: readonly Card[] = [
  {
    id: 'the-fool',
    name: 'The Fool',
    uprightMeaning: 'Beginnings and trust.',
    reversedMeaning: 'Preparation before a beginning.',
    themes: ['openness'],
    arcana: 'major',
  },
  {
    id: 'ace-of-wands',
    name: 'Ace of Wands',
    uprightMeaning: 'Creative purpose takes shape.',
    reversedMeaning: 'Creative energy needs rest.',
    themes: ['creative energy'],
    arcana: 'minor',
    suit: 'wands',
  },
]

function DeckExplorerHarness({
  initialSelectedCardId = null,
}: {
  readonly initialSelectedCardId?: string | null
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<DeckExplorerFilter>('all')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    initialSelectedCardId,
  )

  return (
    <DeckExplorer
      cards={cards}
      filter={filter}
      onFilterChange={setFilter}
      onSearchChange={setSearch}
      onSelectCard={setSelectedCardId}
      search={search}
      selectedCardId={selectedCardId}
    />
  )
}

function RemountingDeckExplorerHarness() {
  const [isExplorerVisible, setIsExplorerVisible] = useState(true)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<DeckExplorerFilter>('all')

  return (
    <>
      <button
        onClick={() => setIsExplorerVisible((isVisible) => !isVisible)}
        type="button"
      >
        Toggle explorer
      </button>
      {isExplorerVisible ? (
        <DeckExplorer
          cards={cards}
          filter={filter}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onSelectCard={setSelectedCardId}
          search={search}
          selectedCardId={selectedCardId}
        />
      ) : null}
    </>
  )
}

it('shows meaning search, category controls, a result count, and cards', () => {
  render(<DeckExplorerHarness />)

  expect(
    screen.getByRole('heading', { name: /explore the deck/i }),
  ).toBeTruthy()
  expect(screen.getByLabelText(/search meanings/i)).toBeTruthy()
  expect(screen.getByText('2 cards')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'All cards' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Major Arcana' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Wands' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Cups' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Swords' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Pentacles' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'The Fool' })).toBeTruthy()
})

it('lazy loads card faces in the result grid', () => {
  render(<DeckExplorerHarness />)

  expect(
    screen
      .getByRole('button', { name: 'The Fool' })
      .querySelector('img')
      ?.getAttribute('loading'),
  ).toBe('lazy')
})

it('shows both orientations and themes in selected card details', () => {
  render(<DeckExplorerHarness />)

  fireEvent.click(screen.getByRole('button', { name: 'The Fool' }))

  const details = screen.getByRole('complementary', { name: /card details/i })
  expect(details).toBeTruthy()
  expect(screen.getByRole('img', { name: /the fool tarot card/i })).toBeTruthy()
  expect(screen.getByText('openness')).toBeTruthy()
  expect(screen.getByRole('heading', { name: /upright meaning/i })).toBeTruthy()
  expect(screen.getByText('Beginnings and trust.')).toBeTruthy()
  expect(
    screen.getByRole('heading', { name: /reversed meaning/i }),
  ).toBeTruthy()
  expect(screen.getByText('Preparation before a beginning.')).toBeTruthy()
})

it('brings selected card details into view', () => {
  render(<DeckExplorerHarness />)

  fireEvent.click(screen.getByRole('button', { name: 'The Fool' }))

  expect(scrollIntoView).toHaveBeenCalledWith({
    behavior: 'smooth',
    block: 'start',
  })
})

it('keeps pointer selection focus on the selected card', () => {
  render(<DeckExplorerHarness />)

  const card = screen.getByRole('button', { name: 'The Fool' })
  card.focus()
  fireEvent.click(card)

  expect(document.activeElement).toBe(card)
})

it('moves keyboard selection focus to card details', () => {
  render(<DeckExplorerHarness />)

  const card = screen.getByRole('button', { name: 'The Fool' })
  fireEvent.keyDown(card, { key: 'Enter' })
  fireEvent.click(card)

  expect(document.activeElement).toBe(
    screen.getByRole('complementary', { name: /card details/i }),
  )
})

it('returns keyboard focus to the selected card from details', () => {
  render(<DeckExplorerHarness />)

  const card = screen.getByRole('button', { name: 'The Fool' })
  fireEvent.keyDown(card, { key: 'Enter' })
  fireEvent.click(card)
  fireEvent.click(screen.getByRole('button', { name: /back to deck/i }))

  expect(document.activeElement).toBe(card)
})

it('does not scroll a preserved selection on initial render', () => {
  render(<DeckExplorerHarness initialSelectedCardId="the-fool" />)

  expect(
    screen.getByRole('complementary', { name: /card details/i }),
  ).toBeTruthy()
  expect(scrollIntoView).not.toHaveBeenCalled()
})

it('does not scroll a preserved selection when the explorer remounts', () => {
  render(<RemountingDeckExplorerHarness />)

  fireEvent.click(screen.getByRole('button', { name: 'The Fool' }))
  scrollIntoView.mockClear()
  fireEvent.click(screen.getByRole('button', { name: 'Toggle explorer' }))
  fireEvent.click(screen.getByRole('button', { name: 'Toggle explorer' }))

  expect(
    screen.getByRole('complementary', { name: /card details/i }),
  ).toBeTruthy()
  expect(scrollIntoView).not.toHaveBeenCalled()
})

it('shows selected details when scrollIntoView is unavailable', () => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView
  render(<DeckExplorerHarness />)

  fireEvent.click(screen.getByRole('button', { name: 'The Fool' }))

  expect(
    screen.getByRole('complementary', { name: /card details/i }),
  ).toBeTruthy()
})

it('clears a selected card when a search excludes it', () => {
  render(<DeckExplorerHarness />)

  fireEvent.click(screen.getByRole('button', { name: 'The Fool' }))
  fireEvent.change(screen.getByLabelText(/search meanings/i), {
    target: { value: 'creative' },
  })

  expect(
    screen.queryByRole('complementary', { name: /card details/i }),
  ).toBeNull()
  expect(screen.getByRole('button', { name: 'Ace of Wands' })).toBeTruthy()
})

it('does not restore a selection after a category excludes it', () => {
  render(<DeckExplorerHarness />)

  fireEvent.click(screen.getByRole('button', { name: 'The Fool' }))
  fireEvent.click(screen.getByRole('button', { name: 'Wands' }))

  expect(
    screen.queryByRole('complementary', { name: /card details/i }),
  ).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: 'All cards' }))

  expect(
    screen.queryByRole('complementary', { name: /card details/i }),
  ).toBeNull()
})

it('explains when no card meaning matches the search', () => {
  render(<DeckExplorerHarness />)

  fireEvent.change(screen.getByLabelText(/search meanings/i), {
    target: { value: 'unfindable meaning' },
  })

  expect(screen.getByText('No cards match this meaning yet.')).toBeTruthy()
})
