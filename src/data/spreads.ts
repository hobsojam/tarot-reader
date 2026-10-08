import type { Spread } from '../domain/spread'

export const spreads: readonly Spread[] = [
  {
    id: 'three-card',
    name: 'Three Card',
    positions: [
      {
        id: 'past',
        label: 'Past',
        row: 1,
        column: 1,
        readingOrder: 1,
        prompt: 'What has shaped this moment.',
        lens: 'Past influence',
        synthesisTemplate:
          'Look to {theme} as a formative influence that still informs the present.',
      },
      {
        id: 'present',
        label: 'Present',
        row: 1,
        column: 2,
        readingOrder: 2,
        prompt: 'What is most active now.',
        lens: 'Present energy',
        synthesisTemplate:
          'Notice how {theme} is active in the immediate situation.',
      },
      {
        id: 'future',
        label: 'Future',
        row: 1,
        column: 3,
        readingOrder: 3,
        prompt: 'What may develop next.',
        lens: 'Emerging direction',
        synthesisTemplate:
          'Consider how {theme} could shape the next stage if it is tended now.',
      },
    ],
  },
  {
    id: 'five-card',
    name: 'Five Card',
    positions: [
      {
        id: 'situation',
        label: 'Situation',
        row: 1,
        column: 2,
        readingOrder: 1,
        prompt: 'The heart of the question.',
        lens: 'Central concern',
        synthesisTemplate:
          'At the heart of this question, {theme} asks for clear attention.',
      },
      {
        id: 'challenge',
        label: 'Challenge',
        row: 2,
        column: 2,
        readingOrder: 2,
        prompt: 'What complicates or tests the situation.',
        lens: 'Testing force',
        synthesisTemplate:
          'The challenge is to work with {theme} even where it feels demanding.',
      },
      {
        id: 'past',
        label: 'Past',
        row: 2,
        column: 1,
        readingOrder: 3,
        prompt: 'What has led here.',
        lens: 'Five-card history',
        synthesisTemplate:
          'This history suggests that {theme} has helped bring the question to this point.',
      },
      {
        id: 'future',
        label: 'Future',
        row: 2,
        column: 3,
        readingOrder: 4,
        prompt: 'What is taking shape.',
        lens: 'Developing path',
        synthesisTemplate:
          'A developing path may invite {theme} to become more visible.',
      },
      {
        id: 'advice',
        label: 'Advice',
        row: 3,
        column: 2,
        readingOrder: 5,
        prompt: 'A constructive next step.',
        lens: 'Practical counsel',
        synthesisTemplate:
          'As a next step, make room for {theme} in a deliberate, workable way.',
      },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    positions: [
      {
        id: 'present',
        label: 'Present',
        row: 3,
        column: 2,
        readingOrder: 1,
        prompt: 'The central issue now.',
        lens: 'Celtic present',
        synthesisTemplate:
          'At the centre of the reading, {theme} names what is most alive now.',
      },
      {
        id: 'challenge',
        label: 'Challenge',
        row: 3,
        column: 3,
        readingOrder: 2,
        prompt: 'What crosses, challenges, or energizes it.',
        lens: 'Celtic crossing force',
        synthesisTemplate:
          'What crosses the situation asks you to meet {theme} with awareness.',
      },
      {
        id: 'foundation',
        label: 'Foundation',
        row: 4,
        column: 2,
        readingOrder: 3,
        prompt: 'The underlying influence or root condition.',
        lens: 'Root condition',
        synthesisTemplate:
          'Beneath the surface, {theme} may be the root condition to understand.',
      },
      {
        id: 'past',
        label: 'Past',
        row: 3,
        column: 1,
        readingOrder: 4,
        prompt: 'What is receding or has shaped the question.',
        lens: 'Receding influence',
        synthesisTemplate:
          'As the past recedes, {theme} shows what it has left behind for this question.',
      },
      {
        id: 'possible-outcome',
        label: 'Possible Outcome',
        row: 2,
        column: 2,
        readingOrder: 5,
        prompt: 'What may emerge if the current path continues.',
        lens: 'Conditional possibility',
        synthesisTemplate:
          'If the current course continues, {theme} may become an important possibility.',
      },
      {
        id: 'near-future',
        label: 'Near Future',
        row: 3,
        column: 4,
        readingOrder: 6,
        prompt: 'What is approaching soon.',
        lens: 'Near horizon',
        synthesisTemplate:
          'In the near horizon, consider how {theme} might become relevant.',
      },
      {
        id: 'self',
        label: 'Self',
        row: 4,
        column: 5,
        readingOrder: 7,
        prompt: 'Your stance, resources, or internal role.',
        lens: 'Personal resource',
        synthesisTemplate:
          'As your own resource, {theme} can inform the stance you bring to this reading.',
      },
      {
        id: 'environment',
        label: 'Environment',
        row: 3,
        column: 5,
        readingOrder: 8,
        prompt: 'External conditions and influences.',
        lens: 'Outer context',
        synthesisTemplate:
          'Around you, {theme} may describe an external condition worth noticing.',
      },
      {
        id: 'hopes-and-fears',
        label: 'Hopes and Fears',
        row: 2,
        column: 5,
        readingOrder: 9,
        prompt: 'What is desired and what feels uncertain.',
        lens: 'Inner tension',
        synthesisTemplate:
          'Among hopes and fears, {theme} highlights what is longed for or uncertain.',
      },
      {
        id: 'outcome',
        label: 'Outcome',
        row: 1,
        column: 5,
        readingOrder: 10,
        prompt: 'The likely direction if nothing changes.',
        lens: 'Likely direction',
        synthesisTemplate:
          'Without a change of course, {theme} points to a likely direction to reflect on.',
      },
    ],
  },
]
