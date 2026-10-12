import type { Card } from '../domain/card'

// Original project interpretation copy, licensed under MIT.
export const cards: readonly Card[] = [
  {
    id: 'the-fool',
    name: 'The Fool',
    arcana: 'major',
    uprightMeaning:
      'An unfamiliar path can make room for curiosity. Consider a first step that leaves space to learn along the way.',
    reversedMeaning:
      'A pause around beginnings can be an invitation to prepare, not a reason to abandon the path.',
    themes: ['beginnings', 'open exploration', 'trust in learning'],
  },
  {
    id: 'the-magician',
    name: 'The Magician',
    arcana: 'major',
    uprightMeaning:
      'Your attention can bring separate skills and resources into a useful whole. Choose a clear intention and notice what is already within reach.',
    reversedMeaning:
      'Having many tools can still leave you unsure where to start. Bring your claims, intentions, and actual capacity into closer agreement.',
    themes: ['skill', 'focused intention', 'resourcefulness'],
  },
  {
    id: 'the-high-priestess',
    name: 'The High Priestess',
    arcana: 'major',
    uprightMeaning:
      'Quiet attention can reveal impressions that have not yet become words. Allow an unanswered question to remain open while you listen inwardly.',
    reversedMeaning:
      'Inner impressions may be difficult to hear amid outside opinions. Give yourself space to distinguish a private feeling from an assumption that needs checking.',
    themes: ['intuition', 'quiet observation', 'unspoken knowledge'],
  },
  {
    id: 'the-empress',
    name: 'The Empress',
    arcana: 'major',
    uprightMeaning:
      'Growth asks for nourishment as well as effort. Notice how comfort, creativity, and attentive care can give a living project space to develop.',
    reversedMeaning:
      'Giving care without replenishment can leave little room for your own growth. Consider which needs deserve tending before you offer more.',
    themes: ['nurturing', 'creative growth', 'sensory nourishment'],
  },
  {
    id: 'the-emperor',
    name: 'The Emperor',
    arcana: 'major',
    uprightMeaning:
      'Clear agreements and dependable boundaries can make action easier. Reflect on the kind of structure that supports both responsibility and room to move.',
    reversedMeaning:
      'Rules may have become rigid, or responsibilities may lack a clear owner. Revisit how authority is used and what a fairer structure would require.',
    themes: ['structure', 'responsible authority', 'dependable boundaries'],
  },
  {
    id: 'the-hierophant',
    name: 'The Hierophant',
    arcana: 'major',
    uprightMeaning:
      'Shared practices can offer a place to learn and belong. Explore which teachings support your values and how you might put them into everyday practice.',
    reversedMeaning:
      'An inherited teaching may no longer fit your experience. Question it with care, keeping what is useful while allowing your own understanding to develop.',
    themes: ['tradition', 'shared learning', 'chosen beliefs'],
  },
  {
    id: 'the-lovers',
    name: 'The Lovers',
    arcana: 'major',
    uprightMeaning:
      'A meaningful connection or choice invites honesty about what matters to you. Look for agreement that respects each person rather than relying on attraction alone.',
    reversedMeaning:
      'Desire, commitments, and values may be pulling in different directions. Name the mismatch before asking yourself or someone else for a wholehearted yes.',
    themes: ['connection', 'aligned values', 'mutual choice'],
  },
  {
    id: 'the-chariot',
    name: 'The Chariot',
    arcana: 'major',
    uprightMeaning:
      'Forward movement can come from guiding competing impulses toward a chosen aim. Hold your direction with care while remaining attentive to the route.',
    reversedMeaning:
      'Pushing harder may not resolve a conflict about where you are headed. Pause to coordinate your effort before trying to regain momentum.',
    themes: ['determination', 'coordinated effort', 'chosen direction'],
  },
  {
    id: 'strength',
    name: 'Strength',
    arcana: 'major',
    uprightMeaning:
      'Steady courage can meet a strong feeling without overpowering it. Consider how patience and a gentle boundary could help you stay present.',
    reversedMeaning:
      'Self-doubt or exhaustion may make gentleness harder to offer. Let courage include acknowledging your limits and accepting support.',
    themes: ['courage', 'patient restraint', 'compassionate resolve'],
  },
  {
    id: 'the-hermit',
    name: 'The Hermit',
    arcana: 'major',
    uprightMeaning:
      'Time apart can help you hear your own questions more clearly. Seek a perspective grounded in reflection rather than the pressure to answer quickly.',
    reversedMeaning:
      'Solitude may be turning into distance from useful companionship. Consider whether an insight is ready to be shared, or whether you need a guide beside you.',
    themes: ['reflection', 'solitude', 'inner guidance'],
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    arcana: 'major',
    uprightMeaning:
      'Changing circumstances can bring familiar patterns into view. Notice what you can influence within a cycle and where a flexible response would serve you.',
    reversedMeaning:
      'An unwelcome change may make a repeating pattern feel especially frustrating. Separate what is beyond your control from the response you can still choose.',
    themes: ['change', 'recurring cycles', 'adaptability'],
  },
  {
    id: 'justice',
    name: 'Justice',
    arcana: 'major',
    uprightMeaning:
      'A careful decision gives evidence and consequences room to be considered. Reflect on what fairness asks of you as well as what you ask of others.',
    reversedMeaning:
      'An account of events may be incomplete or shaped by an unexamined bias. Revisit the evidence and make space for a perspective that has been overlooked.',
    themes: ['fairness', 'accountability', 'considered decisions'],
  },
  {
    id: 'the-hanged-man',
    name: 'The Hanged Man',
    arcana: 'major',
    uprightMeaning:
      'A deliberate pause can loosen a familiar way of seeing. Consider what becomes visible when you stop trying to force an immediate answer.',
    reversedMeaning:
      'Waiting may no longer be opening a useful perspective. Ask whether the pause is chosen and what small change could turn it into active reflection.',
    themes: ['perspective', 'chosen pause', 'letting go of control'],
  },
  {
    id: 'death',
    name: 'Death',
    arcana: 'major',
    uprightMeaning:
      'The end of a role or habit can ask for both grief and release. Reflect on what has run its course and what space you want to make afterward.',
    reversedMeaning:
      'Holding to something familiar may be making a transition harder to acknowledge. Allow release to happen at a considered pace without requiring yourself to feel ready all at once.',
    themes: ['transformation', 'endings', 'conscious release'],
  },
  {
    id: 'temperance',
    name: 'Temperance',
    arcana: 'major',
    uprightMeaning:
      'Different needs can be brought together through patient adjustment. Look for a workable rhythm that lets each part contribute without overwhelming the whole.',
    reversedMeaning:
      'A compromise may be taking more from one part of your life than it gives back. Adjust the proportions and pace instead of treating balance as a fixed destination.',
    themes: ['balance', 'gradual integration', 'workable rhythm'],
  },
  {
    id: 'the-devil',
    name: 'The Devil',
    arcana: 'major',
    uprightMeaning:
      'A familiar attachment can offer comfort while narrowing your choices. Examine its costs without shame and notice where you still have room to act.',
    reversedMeaning:
      'Recognizing a binding pattern can be the beginning of loosening it. Consider what support or boundary would make a freer choice easier to sustain.',
    themes: ['attachment', 'habitual constraints', 'reclaiming choice'],
  },
  {
    id: 'the-tower',
    name: 'The Tower',
    arcana: 'major',
    uprightMeaning:
      'When an assumption is shaken, it can be difficult to find your footing. Attend to what is dependable while you reconsider the structure that rested on it.',
    reversedMeaning:
      'A crack in a familiar arrangement may be easier to minimize than to examine. Consider a manageable adjustment and the support needed to face what is changing.',
    themes: ['revelation', 'shaken assumptions', 'rebuilding foundations'],
  },
  {
    id: 'the-star',
    name: 'The Star',
    arcana: 'major',
    uprightMeaning:
      'Quiet hope can return through simple acts of replenishment. Give attention to what helps you feel connected to possibility without demanding an immediate result.',
    reversedMeaning:
      'Encouragement may be difficult to take in when your reserves are low. Look for one modest source of renewal rather than asking yourself to feel inspired on command.',
    themes: ['hope', 'replenishment', 'gentle inspiration'],
  },
  {
    id: 'the-moon',
    name: 'The Moon',
    arcana: 'major',
    uprightMeaning:
      'An unclear situation can stir imagination and unease at the same time. Distinguish what you have observed from what you fear or hope it means.',
    reversedMeaning:
      'A confusing impression may be beginning to take shape, though clarity need not be complete. Check emerging details gently before turning a feeling into a conclusion.',
    themes: ['uncertainty', 'imagination', 'ambiguous impressions'],
  },
  {
    id: 'the-sun',
    name: 'The Sun',
    arcana: 'major',
    uprightMeaning:
      'A moment of openness can make enjoyment and understanding easier to share. Notice what feels enlivening when you allow yourself to be seen plainly.',
    reversedMeaning:
      'The pressure to appear cheerful may be obscuring a quieter kind of pleasure. Let enjoyment be ordinary and honest rather than a performance of confidence.',
    themes: ['joy', 'open expression', 'shared clarity'],
  },
  {
    id: 'judgement',
    name: 'Judgement',
    arcana: 'major',
    uprightMeaning:
      'Looking back can clarify the response you want to make now. Acknowledge what you have learned and consider a choice that reflects that understanding.',
    reversedMeaning:
      'Harsh self-assessment may be drowning out a useful invitation to change. Distinguish taking responsibility from condemning yourself before choosing your response.',
    themes: ['awakening', 'honest self-review', 'answering a call'],
  },
  {
    id: 'the-world',
    name: 'The World',
    arcana: 'major',
    uprightMeaning:
      'A completed stage can reveal how separate experiences fit together. Take time to recognize what you have integrated before deciding what comes next.',
    reversedMeaning:
      'Something may feel almost complete while a loose end still asks for attention. Identify what closure means to you instead of endlessly extending the finish line.',
    themes: ['completion', 'integration', 'recognizing the whole'],
  },
  {
    id: 'ace-of-wands',
    name: 'Ace of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'A spark of interest can be worth exploring before it becomes a full plan. Give a new idea one small outlet and notice what energizes you.',
    reversedMeaning:
      'An idea may be stirring without enough space or energy to develop. Consider whether it needs a gentler start, a different outlet, or time to rest.',
    themes: ['creative spark', 'fresh initiative', 'exploring enthusiasm'],
  },
  {
    id: 'two-of-wands',
    name: 'Two of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Looking beyond familiar ground can help you choose where to invest your energy. Compare the possibilities with what you are willing to commit to in practice.',
    reversedMeaning:
      'The safety of a familiar option may be competing with a wish to explore. Identify one unknown you can investigate before making the choice larger than it needs to be.',
    themes: ['planning a direction', 'widening horizons', 'measured ambition'],
  },
  {
    id: 'three-of-wands',
    name: 'Three of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Once an effort is underway, attention can turn toward its wider reach. Notice the connections and preparations that would help you work beyond your usual boundaries.',
    reversedMeaning:
      'An expanding plan may have reached a limit you did not account for. Review the distance between your expectations and the support actually available.',
    themes: ['expanding reach', 'longer perspective', 'preparing for growth'],
  },
  {
    id: 'four-of-wands',
    name: 'Four of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'A shared milestone offers a chance to enjoy the ground you have built together. Let celebration include the people and small practices that make a place feel welcoming.',
    reversedMeaning:
      'An occasion or shared space may feel less welcoming than expected. Consider what would help belonging feel lived rather than merely announced.',
    themes: ['shared celebration', 'welcoming space', 'marked milestones'],
  },
  {
    id: 'five-of-wands',
    name: 'Five of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Different approaches can create friction when everyone wants room to contribute. Clarify whether the exchange is useful practice, competing priorities, or a disagreement needing ground rules.',
    reversedMeaning:
      'Avoiding every disagreement can leave important differences unspoken. Look for a way to surface tension without turning participation into a contest.',
    themes: [
      'competing approaches',
      'constructive friction',
      'finding ground rules',
    ],
  },
  {
    id: 'six-of-wands',
    name: 'Six of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Recognition can help you see the value of an effort you have made. Receive encouragement while remembering the contributions that supported your own.',
    reversedMeaning:
      'A lack of recognition may be making progress harder to appreciate. Ask whose approval matters and how you might acknowledge the work on your own terms.',
    themes: [
      'earned recognition',
      'receiving encouragement',
      'visible progress',
    ],
  },
  {
    id: 'seven-of-wands',
    name: 'Seven of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Protecting a position can require a clear sense of what is worth defending. Choose your boundary deliberately rather than responding to every challenge with equal force.',
    reversedMeaning:
      'Constantly defending yourself may be using more energy than the issue warrants. Consider where support, a changed boundary, or stepping away would be more useful.',
    themes: [
      'holding a boundary',
      'selective persistence',
      'defending priorities',
    ],
  },
  {
    id: 'eight-of-wands',
    name: 'Eight of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Several moving pieces can call for a timely and simple response. Keep communication clear so that momentum has a direction rather than becoming a rush.',
    reversedMeaning:
      'Mixed messages or hurried timing may be scattering an effort. Slow the exchange enough to confirm what is moving, what is delayed, and what actually needs a reply.',
    themes: ['swift movement', 'clear communication', 'coordinating momentum'],
  },
  {
    id: 'nine-of-wands',
    name: 'Nine of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Past difficulty can teach you how to protect an effort that still matters. Recognize your endurance while leaving room for rest and help.',
    reversedMeaning:
      'Expecting another setback can keep you guarded even when circumstances differ. Review which precautions still serve you and which are making recovery harder.',
    themes: [
      'tested endurance',
      'protective vigilance',
      'rest within persistence',
    ],
  },
  {
    id: 'ten-of-wands',
    name: 'Ten of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'An accumulation of duties can hide the purpose that first motivated them. Take stock of your load and identify what can be shared, simplified, or set down.',
    reversedMeaning:
      'Putting down a burden may be overdue, yet deciding what to release can be difficult. Separate chosen responsibilities from obligations you have absorbed by habit.',
    themes: [
      'carrying responsibility',
      'overextended effort',
      'sharing the load',
    ],
  },
  {
    id: 'page-of-wands',
    name: 'Page of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Curiosity can turn an ordinary possibility into a lively experiment. Approach a new interest as a learner who does not need to prove its value immediately.',
    reversedMeaning:
      'Excitement may be jumping from idea to idea without finding an outlet. Choose an experiment small enough to finish and let experience refine your interest.',
    themes: ['playful discovery', 'beginner enthusiasm', 'trying an idea'],
  },
  {
    id: 'knight-of-wands',
    name: 'Knight of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Bold engagement can help you act on something that excites you. Pair the willingness to move with enough attention to keep your commitments in view.',
    reversedMeaning:
      'Restless action may be outrunning the purpose behind it. Check whether urgency is helping you follow through or simply leading toward the next distraction.',
    themes: ['bold engagement', 'adventurous action', 'directing passion'],
  },
  {
    id: 'queen-of-wands',
    name: 'Queen of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'Warm self-assurance can give both your own work and other people room to flourish. Notice where you can participate openly without shrinking yourself to fit.',
    reversedMeaning:
      "Comparing your presence with someone else's may be dimming your confidence. Reconnect with what you enjoy expressing and choose how much visibility feels right.",
    themes: ['warm confidence', 'creative presence', 'encouraging others'],
  },
  {
    id: 'king-of-wands',
    name: 'King of Wands',
    arcana: 'minor',
    suit: 'wands',
    uprightMeaning:
      'A clear vision can bring people and effort together around a purpose. Lead by making the direction understandable and giving others room to contribute.',
    reversedMeaning:
      'Strong conviction may be leaving too little space for other perspectives. Examine whether your way of leading invites participation or depends on being followed without question.',
    themes: ['purposeful leadership', 'shared vision', 'directing enterprise'],
  },
  {
    id: 'ace-of-cups',
    name: 'Ace of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'A new feeling can invite openness before you know what it will become. Make room to receive kindness or express something tender without requiring a particular response.',
    reversedMeaning:
      'Feelings may need a private place to gather before they can be offered outwardly. Notice what would help you receive care as well as give it.',
    themes: ['emotional openness', 'receiving kindness', 'new tenderness'],
  },
  {
    id: 'two-of-cups',
    name: 'Two of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'A direct exchange can make mutual regard easier to recognize. Attend to how both people listen, offer, and respond within a connection.',
    reversedMeaning:
      'An exchange may be uneven, or each person may be hearing something different. Clarify expectations and consent without assuming that closeness means agreement.',
    themes: ['mutual regard', 'reciprocal exchange', 'meeting as equals'],
  },
  {
    id: 'three-of-cups',
    name: 'Three of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Companionship can offer room for shared pleasure and encouragement. Notice the friendships that let you contribute while also feeling welcomed.',
    reversedMeaning:
      'A group dynamic may be leaving someone outside the circle or asking more sociability than you can offer. Consider which connections feel inclusive and what space you need.',
    themes: ['friendship', 'shared enjoyment', 'supportive company'],
  },
  {
    id: 'four-of-cups',
    name: 'Four of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'A sense of disengagement can be an invitation to notice what you are able to receive. Allow a pause while checking whether an overlooked offer deserves a fresh look.',
    reversedMeaning:
      'Interest may be returning after a period of withdrawal. Approach a small invitation at your own pace rather than expecting yourself to engage with everything.',
    themes: ['emotional pause', 'overlooked offers', 'renewing interest'],
  },
  {
    id: 'five-of-cups',
    name: 'Five of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Disappointment deserves acknowledgment without being hurried into a lesson. When you have room, notice what support remains beside what has been lost.',
    reversedMeaning:
      'You may be finding a way to carry a disappointment with less of your attention bound to it. Let renewed connection coexist with grief rather than requiring it to disappear.',
    themes: [
      'acknowledging loss',
      'remaining support',
      'making room for grief',
    ],
  },
  {
    id: 'six-of-cups',
    name: 'Six of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'A memory or familiar kindness can reconnect you with a simpler source of warmth. Consider what from the past can be welcomed into the present with care.',
    reversedMeaning:
      'An idealized memory may be making the present difficult to appreciate. Keep the tenderness of what you remember while allowing people and needs to change.',
    themes: ['remembered warmth', 'simple kindness', 'revisiting the past'],
  },
  {
    id: 'seven-of-cups',
    name: 'Seven of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Many appealing possibilities can make choosing difficult. Give imagination room, then ask what each option would involve beyond its first impression.',
    reversedMeaning:
      'The field of possibilities may be narrowing, though a choice still needs attention. Test a promising option against your actual needs before mistaking certainty for clarity.',
    themes: [
      'imagined possibilities',
      'sorting desires',
      'examining appearances',
    ],
  },
  {
    id: 'eight-of-cups',
    name: 'Eight of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Something familiar can remain valuable while no longer meeting an important need. Reflect on what a thoughtful departure would honor and what you would be seeking.',
    reversedMeaning:
      'A wish to leave may be tangled with uncertainty about what you need instead. Explore whether renewal within the situation is possible before assuming that staying or leaving has only one meaning.',
    themes: [
      'seeking deeper meaning',
      'thoughtful departure',
      'recognizing unmet needs',
    ],
  },
  {
    id: 'nine-of-cups',
    name: 'Nine of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Personal satisfaction can be enjoyed without immediately turning it into another goal. Notice which pleasures leave you feeling nourished and what enough means today.',
    reversedMeaning:
      'Getting what you wanted may not have met the need underneath it. Explore the difference between an attractive reward and a satisfaction you can actually feel.',
    themes: ['personal contentment', 'enjoying enough', 'honest satisfaction'],
  },
  {
    id: 'ten-of-cups',
    name: 'Ten of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'A sense of belonging grows through care that people can experience together. Reflect on the everyday gestures that make an emotional home welcoming for everyone involved.',
    reversedMeaning:
      'An image of harmony may be obscuring needs within a family or chosen circle. Let belonging include honest differences rather than asking everyone to fit the same picture.',
    themes: ['emotional belonging', 'shared well-being', 'everyday harmony'],
  },
  {
    id: 'page-of-cups',
    name: 'Page of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'An unexpected feeling or imaginative idea can be approached with gentle curiosity. Try expressing it in a small way before deciding whether it makes sense to anyone else.',
    reversedMeaning:
      'Embarrassment or uncertainty may be keeping a tender idea unspoken. Give it a safe form of expression while remembering that a feeling does not have to become an instruction.',
    themes: [
      'sensitive curiosity',
      'imaginative expression',
      'unexpected feelings',
    ],
  },
  {
    id: 'knight-of-cups',
    name: 'Knight of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'A heartfelt invitation can give an ideal a form someone else can receive. Match the beauty of your intention with attentiveness to the person or situation before you.',
    reversedMeaning:
      'An appealing ideal may be carrying you past details that need consideration. Check whether your promises are supported by action and whether the invitation leaves room for an honest answer.',
    themes: [
      'heartfelt invitation',
      'pursuing an ideal',
      'expressing affection',
    ],
  },
  {
    id: 'queen-of-cups',
    name: 'Queen of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Attentive listening can hold a feeling without needing to solve it. Stay close to your own emotional limits while offering understanding to another person.',
    reversedMeaning:
      "Absorbing other people's feelings may be making your own needs difficult to distinguish. Create some emotional space before deciding what care you can freely offer.",
    themes: ['empathetic listening', 'emotional discernment', 'holding space'],
  },
  {
    id: 'king-of-cups',
    name: 'King of Cups',
    arcana: 'minor',
    suit: 'cups',
    uprightMeaning:
      'Strong feelings and a considered response can exist together. Let emotional steadiness make room for what you feel without giving it sole control of your actions.',
    reversedMeaning:
      "Keeping composure may be turning into suppressing feelings or managing others through them. Acknowledge what is present and choose a response that respects everyone's agency.",
    themes: [
      'emotional steadiness',
      'considered response',
      'mature compassion',
    ],
  },
  {
    id: 'ace-of-swords',
    name: 'Ace of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A precise question or fresh insight can cut through a tangled issue. Put the central point into words and check it against what you actually know.',
    reversedMeaning:
      'An apparent insight may still contain gaps or unclear language. Refine the question and verify the details before treating an idea as settled.',
    themes: ['fresh insight', 'precise questions', 'naming the truth'],
  },
  {
    id: 'two-of-swords',
    name: 'Two of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'Holding two positions in suspension can offer a moment to think. Notice which information, feeling, or consequence needs to enter the decision before you choose.',
    reversedMeaning:
      'Trying to keep a difficult choice at a distance may be adding to the strain. Name the tradeoffs and seek the information that would make a decision possible.',
    themes: [
      'a suspended decision',
      'competing perspectives',
      'acknowledging tradeoffs',
    ],
  },
  {
    id: 'three-of-swords',
    name: 'Three of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A painful truth or disappointment can deserve clear words and compassionate attention. Allow yourself to acknowledge the hurt without making it the whole story of a connection.',
    reversedMeaning:
      'Hurt may be softening, or it may still need a way to be expressed. Make room for honest repair where possible without requiring forgiveness before you are ready.',
    themes: ['painful clarity', 'expressing sorrow', 'honest acknowledgment'],
  },
  {
    id: 'four-of-swords',
    name: 'Four of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A break from responding can give your attention time to settle. Treat rest as part of thoughtful participation rather than a task to justify.',
    reversedMeaning:
      'Returning to activity may feel tempting before you have had enough quiet. Consider whether your next step needs renewed engagement or a more protected period of rest.',
    themes: ['mental rest', 'protected quiet', 'recovering attention'],
  },
  {
    id: 'five-of-swords',
    name: 'Five of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'Winning an argument can come at a cost to trust or self-respect. Reflect on whether the way a disagreement is being handled serves the outcome you actually want.',
    reversedMeaning:
      'The aftermath of a conflict may offer room to stop repeating the contest. Consider what accountability, repair, or a clear separation would require from those involved.',
    themes: ['the cost of conflict', 'questioning victory', 'protecting trust'],
  },
  {
    id: 'six-of-swords',
    name: 'Six of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'Moving toward a less strained situation can involve carrying unresolved feelings with you. Accept practical help and allow a transition to be gradual.',
    reversedMeaning:
      'A transition may be stalled by an unfinished concern or a lack of support. Identify what needs to travel with you and what would make movement more manageable.',
    themes: ['a gradual transition', 'accepting passage', 'moving toward calm'],
  },
  {
    id: 'seven-of-swords',
    name: 'Seven of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A careful strategy can include choosing what to disclose and when. Examine whether discretion protects a legitimate need or avoids a conversation that matters.',
    reversedMeaning:
      'An indirect approach may be becoming harder to maintain. Consider where greater candor or a revised strategy would reduce the effort spent concealing your intentions.',
    themes: ['careful strategy', 'selective disclosure', 'examining motives'],
  },
  {
    id: 'eight-of-swords',
    name: 'Eight of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A situation can feel restrictive when possible actions are hard to see. Distinguish real constraints from assumptions, and look for a small choice or useful source of help.',
    reversedMeaning:
      'A previously unseen option may be becoming easier to recognize. Test it gently while acknowledging the constraints that still need practical support.',
    themes: [
      'perceived restrictions',
      'examining assumptions',
      'finding room to act',
    ],
  },
  {
    id: 'nine-of-swords',
    name: 'Nine of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A worry can grow heavier when it is carried alone or rehearsed without new information. Bring attention to what is known now and consider sharing the concern with someone you trust.',
    reversedMeaning:
      'A recurring worry may be ready to be spoken, even if naming it feels difficult. Seek a kind hearing and separate an imagined outcome from what is actually happening.',
    themes: ['repeating worries', 'naming a concern', 'seeking reassurance'],
  },
  {
    id: 'ten-of-swords',
    name: 'Ten of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'Reaching the limit of a painful situation can make further effort feel impossible. Acknowledge what has ended and attend to immediate care before asking what comes next.',
    reversedMeaning:
      'After a difficult ending, recovery may arrive unevenly. Notice small signs of regained capacity without pressuring yourself to turn the experience into a quick renewal.',
    themes: [
      'acknowledging an ending',
      'reaching a limit',
      'care after difficulty',
    ],
  },
  {
    id: 'page-of-swords',
    name: 'Page of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'An alert question can begin a useful investigation. Follow your curiosity while checking sources and leaving space for an answer that surprises you.',
    reversedMeaning:
      'Gathering fragments of information may be encouraging a conclusion too soon. Ask a direct question and verify what you have heard before passing it along.',
    themes: [
      'alert inquiry',
      'checking evidence',
      'learning through questions',
    ],
  },
  {
    id: 'knight-of-swords',
    name: 'Knight of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'A firmly held idea can give you the courage to speak and act promptly. Keep listening as you advance so that conviction remains responsive to new information.',
    reversedMeaning:
      'The urge to make your point may be outpacing your understanding of the situation. Slow down enough to hear objections and consider the effects of your words.',
    themes: [
      'decisive advocacy',
      'swift reasoning',
      'speaking with conviction',
    ],
  },
  {
    id: 'queen-of-swords',
    name: 'Queen of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'Experience can help you speak plainly while remaining fair. Draw a clear boundary and ask the questions needed to distinguish sincerity from appearance.',
    reversedMeaning:
      'A protective judgment may have become sharper than the present situation requires. Keep the boundary you need while checking whether your assessment allows for nuance.',
    themes: ['clear discernment', 'honest boundaries', 'experienced candor'],
  },
  {
    id: 'king-of-swords',
    name: 'King of Swords',
    arcana: 'minor',
    suit: 'swords',
    uprightMeaning:
      'Sound judgment asks for a method that others can understand and examine. Use clear reasoning while accounting for the human effects of a decision.',
    reversedMeaning:
      'Expertise or formal authority may be closing a discussion prematurely. Make your reasoning open to scrutiny and consider whose experience is absent from it.',
    themes: [
      'reasoned judgment',
      'intellectual responsibility',
      'transparent standards',
    ],
  },
  {
    id: 'ace-of-pentacles',
    name: 'Ace of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'A practical opening can be explored through a modest investment of time or resources. Identify the first tangible step that would help an idea take root.',
    reversedMeaning:
      'A promising offer or plan may need a closer look at its practical foundations. Check the costs, available resources, and readiness before committing more.',
    themes: [
      'a tangible beginning',
      'practical opportunity',
      'planting a foundation',
    ],
  },
  {
    id: 'two-of-pentacles',
    name: 'Two of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Several everyday demands can be managed through flexible adjustment. Notice which priorities need a steady rhythm and which can move as circumstances change.',
    reversedMeaning:
      'Keeping everything in motion may be concealing an unsustainable load. Reduce or reorder a demand rather than measuring your ability by how much you can juggle.',
    themes: ['balancing demands', 'flexible priorities', 'everyday adjustment'],
  },
  {
    id: 'three-of-pentacles',
    name: 'Three of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Work can improve when different skills are brought into a shared process. Agree on the task, respect each contribution, and make room for useful feedback.',
    reversedMeaning:
      'A shared task may be suffering from unclear roles or undervalued expertise. Revisit the working agreement and how each person can contribute effectively.',
    themes: ['collaborative craft', 'valuing expertise', 'shared standards'],
  },
  {
    id: 'four-of-pentacles',
    name: 'Four of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Protecting what you have can create a needed sense of stability. Consider how to preserve enough security without closing off useful exchange or enjoyment.',
    reversedMeaning:
      'The wish to hold everything tightly may be easing or becoming costly. Review what is safe to share or release while keeping a realistic foundation beneath you.',
    themes: ['preserving security', 'holding resources', 'loosening control'],
  },
  {
    id: 'five-of-pentacles',
    name: 'Five of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Material strain or feeling excluded can make it hard to see available support. Name the practical need and consider who or what could help you meet it.',
    reversedMeaning:
      'Accepting support may be becoming possible after a period of strain. Let a small improvement count while addressing the needs that remain unresolved.',
    themes: ['material strain', 'finding support', 'being included'],
  },
  {
    id: 'six-of-pentacles',
    name: 'Six of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'A useful exchange depends on attention to both need and capacity. Consider how giving or receiving resources can preserve dignity and leave expectations clear.',
    reversedMeaning:
      'Help may come with unequal power or expectations that have not been named. Clarify the terms of an exchange and whether each person can freely accept or decline.',
    themes: ['sharing resources', 'dignity in receiving', 'fair exchange'],
  },
  {
    id: 'seven-of-pentacles',
    name: 'Seven of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'An effort that develops slowly can benefit from a deliberate review. Look at what your investment is producing and decide what deserves continued tending.',
    reversedMeaning:
      'Continuing only because you have already invested may be making a project harder to assess. Compare the value of further effort with the option to change course.',
    themes: [
      'reviewing an investment',
      'patient tending',
      'assessing progress',
    ],
  },
  {
    id: 'eight-of-pentacles',
    name: 'Eight of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Repeated practice can deepen a skill when you attend to the details. Choose one aspect of the work to refine and let careful effort matter more than immediate recognition.',
    reversedMeaning:
      'Repetition may have become automatic, or exacting standards may be draining the work of purpose. Reconnect practice with a specific learning aim and a sustainable pace.',
    themes: ['focused practice', 'refining a skill', 'attention to craft'],
  },
  {
    id: 'nine-of-pentacles',
    name: 'Nine of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'The results of sustained effort can offer space for comfort and self-direction. Enjoy what you have cultivated while recognizing the support that made it possible.',
    reversedMeaning:
      'An appearance of independence may be costing more effort than it returns in comfort. Examine what enough looks like when you allow both enjoyment and interdependence.',
    themes: [
      'cultivated independence',
      'enjoying earned comfort',
      'self-direction',
    ],
  },
  {
    id: 'ten-of-pentacles',
    name: 'Ten of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Shared resources and established practices can support more than one generation or stage of life. Reflect on what you want to preserve and who should have a voice in its future.',
    reversedMeaning:
      'An inherited arrangement may distribute security unevenly or carry expectations that no longer fit. Examine how shared resources and responsibilities could be made more inclusive.',
    themes: ['shared legacy', 'lasting foundations', 'continuity of resources'],
  },
  {
    id: 'page-of-pentacles',
    name: 'Page of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'A practical interest can become a learning project through patient attention. Set a manageable task and let direct experience teach you how the details work.',
    reversedMeaning:
      'Planning to learn may be taking the place of actually beginning. Make the task smaller and more concrete so that curiosity has something to work with.',
    themes: [
      'practical study',
      'a concrete learning goal',
      'beginner diligence',
    ],
  },
  {
    id: 'knight-of-pentacles',
    name: 'Knight of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Reliable progress often rests on work that is ordinary and repeatable. Choose a pace and routine you can maintain while keeping the purpose of the task in sight.',
    reversedMeaning:
      'A dependable routine may have become inflexible or difficult to sustain. Adjust the method so that consistency supports the work instead of keeping it stuck.',
    themes: [
      'steady follow-through',
      'dependable routines',
      'sustainable effort',
    ],
  },
  {
    id: 'queen-of-pentacles',
    name: 'Queen of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Care can take a tangible form in a meal, a useful arrangement, or a welcoming environment. Attend to practical comfort in ways that include your own needs.',
    reversedMeaning:
      "Maintaining everyone else's comfort may be leaving your own daily needs unattended. Rework the practical arrangements so that care does not depend on your depletion.",
    themes: ['practical care', 'everyday comfort', 'a sustaining environment'],
  },
  {
    id: 'king-of-pentacles',
    name: 'King of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    uprightMeaning:
      'Responsible stewardship can turn resources into dependable support. Use experience to make practical decisions that consider durability as well as immediate benefit.',
    reversedMeaning:
      'Control, status, or accumulated resources may be overshadowing the purpose they were meant to serve. Review whether your decisions support a livable foundation for yourself and others.',
    themes: [
      'responsible stewardship',
      'durable provision',
      'grounded leadership',
    ],
  },
] satisfies readonly Card[]
