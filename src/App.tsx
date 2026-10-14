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
import type { DeckExplorerFilter } from './domain/deck-explorer'
import { synthesizeReadingNarrative } from './domain/interpretation'
import {
  getNarrativeFraming,
  getReflectionAnchor,
  getRevealedReadingCards,
  getSelectedReadingCard,
  isReadingComplete,
  revealAll,
  revealPosition,
  startReading,
} from './domain/reading-session'
import type { ReadingSession } from './domain/reading-session'
import { reversedChanceFromStartupOption } from './domain/reversals'
import type { ReadingFocusId } from './domain/reading-focus'
import type { Spread } from './domain/spread'

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
  const selectedSpread =
    spreads.find((spread) => spread.id === selectedSpreadId) ?? spreads[0]
  const reversedChance = reversedChanceFromStartupOption(
    import.meta.env.VITE_DISABLE_REVERSALS,
  )
  const selectedFocus =
    readingFocuses.find((focus) => focus.id === selectedFocusId) ??
    readingFocuses[0]

  if (!selectedSpread || !selectedFocus) return null

  const handleStartReading = () => {
    setShowReflection(false)
    setSession(
      startReading({
        cards,
        spread: selectedSpread,
        focus: selectedFocus,
        customQuestion,
        random: Math.random,
        reversedChance,
      }),
    )
  }

  const handleRevealPosition = (positionId: string) => {
    setSession((current) =>
      current ? revealPosition(current, positionId) : current,
    )
  }

  const handleRevealAll = () => {
    setSession((current) => (current ? revealAll(current) : current))
  }

  const startNewReading = () => {
    setShowReflection(false)
    setSession(null)
  }

  const selectedReadingCard = session
    ? getSelectedReadingCard(session)
    : undefined
  const readingNarrative = session
    ? synthesizeReadingNarrative(
        getRevealedReadingCards(session),
        getNarrativeFraming(session),
      )
    : ''
  const readingComplete = session ? isReadingComplete(session) : false
  const reflectionAnchor = session ? getReflectionAnchor(session) : undefined

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
            <button onClick={handleStartReading} type="button">
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
            <button onClick={handleRevealAll} type="button">
              Reveal all
            </button>
            {readingComplete ? (
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
            aria-label={`${session.spread.name} workspace`}
            className={`reading-workspace reading-workspace--${session.spread.id}`}
          >
            <ReadingBoard
              cards={session.cards}
              onReveal={handleRevealPosition}
              revealedPositionIds={session.revealedPositionIds}
              spread={session.spread}
            />
            <div className="reading-sidebar">
              <ReadingGuide spread={session.spread} />
              <ReadingDetail
                card={selectedReadingCard?.card}
                position={selectedReadingCard?.position}
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
