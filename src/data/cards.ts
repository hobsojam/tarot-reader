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

const majorArcanaThemes: Readonly<Record<string, string>> = {
  'the-fool': 'beginnings',
  'the-magician': 'skill',
  'the-high-priestess': 'intuition',
  'the-empress': 'nurturing',
  'the-emperor': 'structure',
  'the-hierophant': 'tradition',
  'the-lovers': 'connection',
  'the-chariot': 'determination',
  strength: 'courage',
  'the-hermit': 'reflection',
  'wheel-of-fortune': 'change',
  justice: 'fairness',
  'the-hanged-man': 'perspective',
  death: 'transformation',
  temperance: 'balance',
  'the-devil': 'attachment',
  'the-tower': 'revelation',
  'the-star': 'hope',
  'the-moon': 'uncertainty',
  'the-sun': 'joy',
  judgement: 'awakening',
  'the-world': 'completion',
}

const majorArcanaReversedMeanings: Readonly<Record<string, string>> = {
  'the-fool':
    'A pause around beginnings can be an invitation to prepare, not a reason to abandon the path.',
  'the-magician':
    'Skill may need quieter focus before it can be used with confidence.',
  'the-high-priestess':
    'Inner knowing may be obscured; give intuition patient room to speak.',
  'the-empress':
    'Nurturing may need boundaries so care can remain sustainable.',
  'the-emperor':
    'Structure may be too rigid, or may need to be rebuilt with care.',
  'the-hierophant':
    'Tradition can be questioned thoughtfully while its useful wisdom is retained.',
  'the-lovers':
    'A choice may need clearer values before connection can feel wholehearted.',
  'the-chariot':
    'Forward movement may benefit from adjusting direction rather than forcing momentum.',
  strength:
    'Courage may be gathering inwardly before it becomes visible action.',
  'the-hermit':
    'Reflection may have become isolating; consider sharing the insight you have found.',
  'wheel-of-fortune':
    'A changing cycle may ask for flexibility while its pattern is still unclear.',
  justice:
    'Fairness may require a second look at assumptions or unspoken consequences.',
  'the-hanged-man':
    'A pause may be lingering; gently notice what perspective is ready to shift.',
  death:
    'A transition may be resisted, inviting a slower and more conscious release.',
  temperance: 'Balance may need recalibration rather than further compromise.',
  'the-devil':
    'An attachment can be recognized without shame, creating room for a freer choice.',
  'the-tower':
    'A disruption may be processed gradually while you decide what truly needs rebuilding.',
  'the-star':
    'Hope may be quiet or delayed, yet small acts of care can keep it present.',
  'the-moon':
    'Uncertainty may be internalized; let imagination inform rather than overwhelm your next step.',
  'the-sun':
    'Joy may be muted for now, inviting attention to its smaller, steadier sources.',
  judgement:
    'A calling may need more reflection before it becomes a decisive answer.',
  'the-world':
    'Completion may be close but still needs integration before the next cycle begins.',
}

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

const minorArcanaReversedTemplates: Readonly<
  Record<(typeof ranks)[number], string>
> = {
  Ace: 'A beginning in {theme} may need more preparation before it can take root.',
  Two: 'A choice around {theme} may benefit from a gentler balance of priorities.',
  Three:
    'Collaboration in {theme} may need clearer expectations or more patient listening.',
  Four: 'Stability in {theme} may be holding too tightly; consider where flexibility helps.',
  Five: 'Tension around {theme} may soften when the underlying need is named.',
  Six: 'Giving and receiving in {theme} may need a more reciprocal rhythm.',
  Seven:
    'A pause in {theme} can reveal whether effort is being placed where it matters most.',
  Eight:
    'Progress in {theme} may feel delayed, inviting a closer look at what is restricting it.',
  Nine: 'Independence in {theme} may need rest or support to remain nourishing.',
  Ten: 'A full load of {theme} may be ready to be shared, simplified, or released.',
  Page: 'Curiosity about {theme} may need grounding before a message becomes clear.',
  Knight:
    'Momentum in {theme} may benefit from slowing down long enough to choose direction.',
  Queen: 'Care for {theme} may need to turn inward as well as outward.',
  King: 'Leadership in {theme} may be strongest when certainty makes room for reflection.',
}

const suits: readonly [string, string][] = [
  ['Wands', 'energy, creativity, and purpose'],
  ['Cups', 'feeling, connection, and imagination'],
  ['Swords', 'thought, truth, and challenge'],
  ['Pentacles', 'resources, work, and the material world'],
]

const minorArcanaThemes: Readonly<Record<string, string>> = {
  Wands: 'creative energy',
  Cups: 'emotional connection',
  Swords: 'clear thinking',
  Pentacles: 'practical resources',
}

const slugify = (value: string) => value.toLowerCase().replaceAll(' ', '-')

const minorArcana = suits.flatMap(([suit, theme]) =>
  ranks.map((rank) => ({
    id: `${slugify(rank)}-of-${slugify(suit)}`,
    name: `${rank} of ${suit}`,
    uprightMeaning: `${rank} invites reflection on ${theme}.`,
    reversedMeaning: minorArcanaReversedTemplates[rank].replaceAll(
      '{theme}',
      minorArcanaThemes[suit],
    ),
    themes: [minorArcanaThemes[suit]],
  })),
)

export const cards: readonly Card[] = [
  ...majorArcana.map(([id, name, uprightMeaning]) => ({
    id,
    name,
    uprightMeaning,
    reversedMeaning: majorArcanaReversedMeanings[id],
    themes: [majorArcanaThemes[id]],
  })),
  ...minorArcana,
]
