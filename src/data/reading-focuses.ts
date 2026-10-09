import type { ReadingFocus } from '../domain/reading-focus'

export const readingFocuses: readonly ReadingFocus[] = [
  {
    id: 'general-guidance',
    label: 'General guidance',
    narrativeFraming: 'general guidance',
  },
  {
    id: 'relationships',
    label: 'Relationships',
    narrativeFraming: 'relationship patterns',
  },
  {
    id: 'work-and-purpose',
    label: 'Work and purpose',
    narrativeFraming: 'work and purpose',
  },
  {
    id: 'a-decision',
    label: 'A decision',
    narrativeFraming: 'a decision',
  },
  {
    id: 'personal-growth',
    label: 'Personal growth',
    narrativeFraming: 'personal growth',
  },
  {
    id: 'something-else',
    label: 'Something else',
    narrativeFraming: 'your question',
  },
]
