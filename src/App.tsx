import './App.css'
import { useState } from 'react'
import { ReadingBoard } from './components/ReadingBoard'
import { ReadingDetail } from './components/ReadingDetail'
import { SpreadPicker } from './components/SpreadPicker'
import { spreads } from './data/spreads'
import { createDeck, deal, shuffleDeck } from './domain/deck'
import type { Card } from './domain/card'
import type { Spread } from './domain/spread'

interface ReadingSession {
  cards: readonly Card[]
  revealedPositionIds: ReadonlySet<string>
  selectedPositionId: string | null
}

function App() {
  const [selectedSpreadId, setSelectedSpreadId] =
    useState<Spread['id']>('three-card')
  const [session, setSession] = useState<ReadingSession | null>(null)
  const selectedSpread = spreads.find(
    (spread) => spread.id === selectedSpreadId,
  )!

  const startReading = () => {
    const { dealt } = deal(
      shuffleDeck(createDeck()),
      selectedSpread.positions.length,
    )
    setSession({
      cards: dealt,
      revealedPositionIds: new Set(),
      selectedPositionId: null,
    })
  }

  const revealPosition = (positionId: string) => {
    setSession((current) => {
      if (!current) return current
      return {
        ...current,
        revealedPositionIds: new Set([
          ...current.revealedPositionIds,
          positionId,
        ]),
        selectedPositionId: positionId,
      }
    })
  }

  const revealAll = () => {
    setSession((current) =>
      current
        ? {
            ...current,
            revealedPositionIds: new Set(
              selectedSpread.positions.map((position) => position.id),
            ),
          }
        : current,
    )
  }

  const selectedIndex = session?.selectedPositionId
    ? selectedSpread.positions.findIndex(
        (position) => position.id === session.selectedPositionId,
      )
    : -1

  return (
    <main className="app-shell">
      <h1>Tarot Reader</h1>
      <p>Choose a spread to begin a reflective reading.</p>
      {!session ? (
        <>
          <SpreadPicker
            onSelect={setSelectedSpreadId}
            selectedId={selectedSpreadId}
            spreads={spreads}
          />
          <button onClick={startReading} type="button">
            Start reading
          </button>
        </>
      ) : (
        <>
          <div className="reading-actions">
            <button onClick={revealAll} type="button">
              Reveal all
            </button>
            <button onClick={() => setSession(null)} type="button">
              New reading
            </button>
          </div>
          <ReadingBoard
            cards={session.cards}
            onReveal={revealPosition}
            revealedPositionIds={session.revealedPositionIds}
            spread={selectedSpread}
          />
          {selectedIndex >= 0 && session.cards[selectedIndex] ? (
            <ReadingDetail
              card={session.cards[selectedIndex]}
              position={selectedSpread.positions[selectedIndex]}
            />
          ) : null}
        </>
      )}
    </main>
  )
}

export default App
