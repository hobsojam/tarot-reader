import type { Spread } from '../domain/spread'

export const spreads: readonly Spread[] = [
  {
    id: 'three-card',
    name: 'Three Card',
    positions: [
      { id: 'past', label: 'Past', row: 1, column: 1 },
      { id: 'present', label: 'Present', row: 1, column: 2 },
      { id: 'future', label: 'Future', row: 1, column: 3 },
    ],
  },
  {
    id: 'five-card',
    name: 'Five Card',
    positions: [
      { id: 'situation', label: 'Situation', row: 1, column: 2 },
      { id: 'challenge', label: 'Challenge', row: 2, column: 2 },
      { id: 'past', label: 'Past', row: 2, column: 1 },
      { id: 'future', label: 'Future', row: 2, column: 3 },
      { id: 'advice', label: 'Advice', row: 3, column: 2 },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    positions: [
      { id: 'present', label: 'Present', row: 3, column: 2 },
      { id: 'challenge', label: 'Challenge', row: 3, column: 3 },
      { id: 'foundation', label: 'Foundation', row: 4, column: 2 },
      { id: 'past', label: 'Past', row: 3, column: 1 },
      { id: 'possible-outcome', label: 'Possible Outcome', row: 2, column: 2 },
      { id: 'near-future', label: 'Near Future', row: 3, column: 4 },
      { id: 'self', label: 'Self', row: 4, column: 5 },
      { id: 'environment', label: 'Environment', row: 3, column: 5 },
      { id: 'hopes-and-fears', label: 'Hopes and Fears', row: 2, column: 5 },
      { id: 'outcome', label: 'Outcome', row: 1, column: 5 },
    ],
  },
]
