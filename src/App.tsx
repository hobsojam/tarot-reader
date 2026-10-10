import './App.css'
import { useState } from 'react'
import { ReadingBoard } from './components/ReadingBoard'
import { ReadingDetail } from './components/ReadingDetail'
import { ReadingGuide } from './components/ReadingGuide'
import { ReflectionAnchorCard } from './components/ReflectionAnchorCard'
import { SpreadPicker } from './components/SpreadPicker'
import { DeckExplorer } from './components/DeckExplorer'
import { cards } from './data/cards'
import { readingFocuses } from './data/reading-focuses'
import { spreads } from './data/spreads'
import { createDeck, deal, orientCards, shuffleDeck } from './domain/deck'
import type { DeckExplorerFilter } from './domain/deck-explorer'
import { synthesizeReadingNarrative } from './domain/interpretation'
import { reversedChanceFromStartupOption } from './domain/reversals'
import type { DealtCard } from './domain/card'
import type { ReadingFocus, ReadingFocusId } from './domain/reading-focus'
import type { Spread } from './domain/spread'

interface ReadingSession {
  cards: readonly DealtCard[]
  customQuestion: string
  focus: ReadingFocus
  revealedPositionIds: ReadonlySet<string>
  selectedPositionId: string | null
}

function App() {
  const [selectedSpreadId, setSelectedSpreadId] =
    useState<Spread['id']>('three-card')
  const [session, setSession] = useState<ReadingSession | null>(null)
  const [selectedFocusId, setSelectedFocusId] =
    useState<ReadingFocusId>('general-guidance')
  const [customQuestion, setCustomQuestion] = useState('')
  const [showReflection, setShowReflection] = useState(false)
  const [explorerSearch, setExplorerSearch] = useState('')
  const [explorerFilter, setExplorerFilter] =
    useState<DeckExplorerFilter>('all')
  const [selectedExplorerCardId, setSelectedExplorerCardId] = useState<
    string | null
  >(null)
  const selectedSpread = spreads.find(
    (spread) => spread.id === selectedSpreadId,
  )!
  const reversedChance = reversedChanceFromStartupOption(
    import.meta.env.VITE_DISABLE_REVERSALS,
  )
  const selectedFocus = readingFocuses.find(
    (focus) => focus.id === selectedFocusId,
  )!

  const startReading = () => {
    const { dealt } = deal(
      shuffleDeck(createDeck()),
      selectedSpread.positions.length,
    )
    setShowReflection(false)
    setSession({
      cards: orientCards(dealt, Math.random, reversedChance),
      customQuestion:
        selectedFocus.id === 'something-else' ? customQuestion.trim() : '',
      focus: selectedFocus,
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

  const startNewReading = () => {
    setShowReflection(false)
    setSession(null)
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
        session.customQuestion
          ? `your question, “${session.customQuestion}”`
          : session.focus.narrativeFraming,
      )
    : ''
  const isReadingComplete =
    session?.revealedPositionIds.size === selectedSpread.positions.length
  const reflectionAnchorIndex = selectedSpread.positions.findIndex(
    (position) => position.id === selectedSpread.reflectionAnchorPositionId,
  )
  const reflectionAnchor =
    session && reflectionAnchorIndex >= 0
      ? {
          card: session.cards[reflectionAnchorIndex],
          position: selectedSpread.positions[reflectionAnchorIndex],
        }
      : undefined

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
          <div className="reading-setup">
            <label>
              Reading focus
              <select
                onChange={(event) =>
                  setSelectedFocusId(event.target.value as ReadingFocusId)
                }
                value={selectedFocusId}
              >
                {readingFocuses.map((focus) => (
                  <option key={focus.id} value={focus.id}>
                    {focus.label}
                  </option>
                ))}
              </select>
            </label>
            {selectedFocusId === 'something-else' ? (
              <label>
                Your question
                <input
                  onChange={(event) => setCustomQuestion(event.target.value)}
                  type="text"
                  value={customQuestion}
                />
              </label>
            ) : null}
            <button onClick={startReading} type="button">
              Start reading
            </button>
          </div>
          <DeckExplorer
            cards={cards}
            filter={explorerFilter}
            onFilterChange={setExplorerFilter}
            onSearchChange={setExplorerSearch}
            onSelectCard={setSelectedExplorerCardId}
            search={explorerSearch}
            selectedCardId={selectedExplorerCardId}
          />
        </>
      ) : (
        <>
          <div className="reading-actions">
            <button onClick={revealAll} type="button">
              Reveal all
            </button>
            {isReadingComplete ? (
              <button onClick={() => setShowReflection(true)} type="button">
                Reflect on this reading
              </button>
            ) : null}
            <button onClick={startNewReading} type="button">
              New reading
            </button>
          </div>
          <p className="reading-focus">
            Focus: {session.customQuestion || session.focus.label}
          </p>
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
          {showReflection ? (
            <section aria-label="Reflection" className="reading-reflection">
              <h2>Reflection</h2>
              {reflectionAnchor ? (
                <ReflectionAnchorCard
                  card={reflectionAnchor.card}
                  position={reflectionAnchor.position}
                />
              ) : null}
              <h3>Completed thread</h3>
              <p>{readingNarrative}</p>
              <h3>Reflection prompts</h3>
              <ol>
                <li>
                  What part of this completed thread feels most alive for you
                  now?
                </li>
                <li>
                  {session.customQuestion
                    ? 'What small action could honor your question?'
                    : `What small action could honor your focus on ${session.focus.label.toLowerCase()}?`}
                </li>
              </ol>
            </section>
          ) : null}
        </>
      )}
    </main>
  )
}

export default App
