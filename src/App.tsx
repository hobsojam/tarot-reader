import './App.css'
import { useState } from 'react'
import { ReadingBoard } from './components/ReadingBoard'
import { ReadingDetail } from './components/ReadingDetail'
import { ReadingGuide } from './components/ReadingGuide'
import { SpreadPicker } from './components/SpreadPicker'
import { spreads } from './data/spreads'
import { createDeck, deal, orientCards, shuffleDeck } from './domain/deck'
import { synthesizeReadingNarrative } from './domain/interpretation'
import { reversedChanceFromStartupOption } from './domain/reversals'
import type { DealtCard } from './domain/card'
import type { Spread } from './domain/spread'

interface ReadingSession {
  cards: readonly DealtCard[]
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
  const reversedChance = reversedChanceFromStartupOption(
    import.meta.env.VITE_DISABLE_REVERSALS,
  )

  const startReading = () => {
    const { dealt } = deal(
      shuffleDeck(createDeck()),
      selectedSpread.positions.length,
    )
    setSession({
      cards: orientCards(dealt, Math.random, reversedChance),
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
  const readingNarrative = session
    ? synthesizeReadingNarrative(
        session.cards.flatMap((card, index) => {
          const position = selectedSpread.positions[index]

          return session.revealedPositionIds.has(position.id)
            ? [{ card, position }]
            : []
        }),
      )
    : ''

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
          <section
            aria-label={`${selectedSpread.name} workspace`}
            className={`reading-workspace${selectedSpread.id === 'celtic-cross' ? ' reading-workspace--celtic-cross' : ''}`}
          >
            <ReadingBoard
              cards={session.cards}
              onReveal={revealPosition}
              revealedPositionIds={session.revealedPositionIds}
              spread={selectedSpread}
            />
            <div className="reading-sidebar">
              <ReadingGuide spread={selectedSpread} />
              <ReadingDetail
                card={
                  selectedIndex >= 0 ? session.cards[selectedIndex] : undefined
                }
                position={
                  selectedIndex >= 0
                    ? selectedSpread.positions[selectedIndex]
                    : undefined
                }
              />
            </div>
          </section>
          {readingNarrative ? (
            <section aria-label="Reading so far" className="reading-narrative">
              <h2>Reading so far</h2>
              <p>{readingNarrative}</p>
            </section>
          ) : null}
        </>
      )}
    </main>
  )
}

export default App
