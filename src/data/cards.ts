import type { Card } from '../domain/card'

const majorArcana: readonly [string, string, string, readonly string[]][] = [
  [
    'the-fool',
    'The Fool',
    'Beginnings, openness, and trust in the journey.',
    ['beginnings'],
  ],
  [
    'the-magician',
    'The Magician',
    'Skill, focus, and the power to act.',
    ['skill'],
  ],
  [
    'the-high-priestess',
    'The High Priestess',
    'Intuition, mystery, and inner knowing.',
    ['intuition'],
  ],
  [
    'the-empress',
    'The Empress',
    'Nurturing, abundance, and creative growth.',
    ['nurturing'],
  ],
  [
    'the-emperor',
    'The Emperor',
    'Structure, authority, and steady leadership.',
    ['structure'],
  ],
  [
    'the-hierophant',
    'The Hierophant',
    'Tradition, learning, and shared values.',
    ['tradition'],
  ],
  [
    'the-lovers',
    'The Lovers',
    'Connection, choices, and aligned values.',
    ['connection'],
  ],
  [
    'the-chariot',
    'The Chariot',
    'Determination, direction, and forward movement.',
    ['determination'],
  ],
  [
    'strength',
    'Strength',
    'Courage, patience, and compassionate resolve.',
    ['courage'],
  ],
  [
    'the-hermit',
    'The Hermit',
    'Reflection, guidance, and a search for truth.',
    ['reflection'],
  ],
  [
    'wheel-of-fortune',
    'Wheel of Fortune',
    'Change, cycles, and a turning point.',
    ['change'],
  ],
  [
    'justice',
    'Justice',
    'Fairness, accountability, and clear decisions.',
    ['fairness'],
  ],
  [
    'the-hanged-man',
    'The Hanged Man',
    'Pause, perspective, and willing surrender.',
    ['perspective'],
  ],
  [
    'death',
    'Death',
    'Transformation, endings, and renewal.',
    ['transformation'],
  ],
  [
    'temperance',
    'Temperance',
    'Balance, patience, and thoughtful integration.',
    ['balance'],
  ],
  [
    'the-devil',
    'The Devil',
    'Attachment, temptation, and seeing what binds you.',
    ['attachment'],
  ],
  [
    'the-tower',
    'The Tower',
    'Disruption, revelation, and necessary change.',
    ['revelation'],
  ],
  ['the-star', 'The Star', 'Hope, healing, and renewed inspiration.', ['hope']],
  [
    'the-moon',
    'The Moon',
    'Uncertainty, imagination, and hidden influences.',
    ['uncertainty'],
  ],
  ['the-sun', 'The Sun', 'Joy, clarity, and confident vitality.', ['joy']],
  [
    'judgement',
    'Judgement',
    'Awakening, reflection, and a decisive calling.',
    ['awakening'],
  ],
  [
    'the-world',
    'The World',
    'Completion, integration, and wholeness.',
    ['completion'],
  ],
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

const suits: readonly [string, string, readonly string[]][] = [
  ['Wands', 'energy, creativity, and purpose', ['creative energy']],
  ['Cups', 'feeling, connection, and imagination', ['emotional connection']],
  ['Swords', 'thought, truth, and challenge', ['clear thinking']],
  [
    'Pentacles',
    'resources, work, and the material world',
    ['practical resources'],
  ],
]

const slugify = (value: string) => value.toLowerCase().replaceAll(' ', '-')

const minorArcana = suits.flatMap(([suit, meaning, themes]) =>
  ranks.map((rank) => ({
    id: `${slugify(rank)}-of-${slugify(suit)}`,
    name: `${rank} of ${suit}`,
    uprightMeaning: `${rank} invites reflection on ${meaning}.`,
    themes,
  })),
)

export const cards: readonly Card[] = [
  ...majorArcana.map(([id, name, uprightMeaning, themes]) => ({
    id,
    name,
    uprightMeaning,
    themes,
  })),
  ...minorArcana,
]
