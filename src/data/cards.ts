import type { Card } from '../domain/card'

const majorArcana: readonly [string, string, string][] = [
  ['the-fool', 'The Fool', 'Beginnings, openness, and trust in the journey.'],
  ['the-magician', 'The Magician', 'Skill, focus, and the power to act.'],
  [
    'the-high-priestess',
    'The High Priestess',
    'Intuition, mystery, and inner knowing.',
  ],
  ['the-empress', 'The Empress', 'Nurturing, abundance, and creative growth.'],
  [
    'the-emperor',
    'The Emperor',
    'Structure, authority, and steady leadership.',
  ],
  [
    'the-hierophant',
    'The Hierophant',
    'Tradition, learning, and shared values.',
  ],
  ['the-lovers', 'The Lovers', 'Connection, choices, and aligned values.'],
  [
    'the-chariot',
    'The Chariot',
    'Determination, direction, and forward movement.',
  ],
  ['strength', 'Strength', 'Courage, patience, and compassionate resolve.'],
  ['the-hermit', 'The Hermit', 'Reflection, guidance, and a search for truth.'],
  [
    'wheel-of-fortune',
    'Wheel of Fortune',
    'Change, cycles, and a turning point.',
  ],
  ['justice', 'Justice', 'Fairness, accountability, and clear decisions.'],
  [
    'the-hanged-man',
    'The Hanged Man',
    'Pause, perspective, and willing surrender.',
  ],
  ['death', 'Death', 'Transformation, endings, and renewal.'],
  [
    'temperance',
    'Temperance',
    'Balance, patience, and thoughtful integration.',
  ],
  [
    'the-devil',
    'The Devil',
    'Attachment, temptation, and seeing what binds you.',
  ],
  ['the-tower', 'The Tower', 'Disruption, revelation, and necessary change.'],
  ['the-star', 'The Star', 'Hope, healing, and renewed inspiration.'],
  ['the-moon', 'The Moon', 'Uncertainty, imagination, and hidden influences.'],
  ['the-sun', 'The Sun', 'Joy, clarity, and confident vitality.'],
  ['judgement', 'Judgement', 'Awakening, reflection, and a decisive calling.'],
  ['the-world', 'The World', 'Completion, integration, and wholeness.'],
]

const ranks = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
] as const

const suits: readonly [string, string][] = [
  ['Wands', 'energy, creativity, and purpose'],
  ['Cups', 'feeling, connection, and imagination'],
  ['Swords', 'thought, truth, and challenge'],
  ['Pentacles', 'resources, work, and the material world'],
]

const slugify = (value: string) => value.toLowerCase().replaceAll(' ', '-')

const minorArcana = suits.flatMap(([suit, theme]) =>
  ranks.map((rank) => ({
    id: `${slugify(rank)}-of-${slugify(suit)}`,
    name: `${rank} of ${suit}`,
    uprightMeaning: `${rank} invites reflection on ${theme}.`,
  })),
)

export const cards: readonly Card[] = [
  ...majorArcana.map(([id, name, uprightMeaning]) => ({
    id,
    name,
    uprightMeaning,
  })),
  ...minorArcana,
]
