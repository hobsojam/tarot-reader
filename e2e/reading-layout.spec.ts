import { expect, test, type Locator, type Page } from '@playwright/test'

const spreads = [
  {
    id: 'three-card',
    name: 'Three Card',
    labels: ['Past', 'Present', 'Future'],
  },
  {
    id: 'five-card',
    name: 'Five Card',
    labels: ['Situation', 'Challenge', 'Past', 'Future', 'Advice'],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    labels: [
      'Present',
      'Challenge',
      'Foundation',
      'Past',
      'Possible Outcome',
      'Near Future',
      'Self',
      'Environment',
      'Hopes and Fears',
      'Outcome',
    ],
  },
] as const

type SpreadCase = (typeof spreads)[number]

async function startReading(page: Page, spread: SpreadCase) {
  await page.goto('./')
  await page.getByRole('radio', { name: spread.name, exact: true }).check()
  await page.getByRole('button', { name: 'Start reading', exact: true }).click()
  const board = page.getByRole('region', {
    name: `${spread.name} reading`,
    exact: true,
  })
  await expect(board).toBeVisible()
  return board
}

async function expectVisiblePositions(board: Locator, spread: SpreadCase) {
  await expect(board.locator('.reading-position')).toHaveCount(
    spread.labels.length,
  )
  await expect(board.getByRole('heading', { level: 2 })).toHaveText([
    ...spread.labels,
  ])
  await expect(board.getByRole('button')).toHaveCount(spread.labels.length)
  for (const label of spread.labels) {
    await expect(
      board.getByRole('button', { name: `${label}: face down`, exact: true }),
    ).toBeVisible()
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const { documentWidth, viewportWidth } = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }))
  expect(documentWidth).toBeLessThanOrEqual(viewportWidth)
}

async function positionBoxes(board: Locator) {
  return board.locator('.reading-position').evaluateAll((positions) =>
    positions.map((position) => {
      const { top, right, bottom, left } = position.getBoundingClientRect()
      return { top, right, bottom, left }
    }),
  )
}

async function expectStackedReadingOrder(board: Locator) {
  const boxes = await positionBoxes(board)
  for (let index = 1; index < boxes.length; index++) {
    expect(boxes[index].top).toBeGreaterThan(boxes[index - 1].top)
    expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom)
    expect(boxes[index].left).toBeCloseTo(boxes[0].left, 1)
  }
}

async function expectThreeCardRow(board: Locator) {
  const [past, present, future] = await positionBoxes(board)
  expect(present.left).toBeGreaterThan(past.left)
  expect(future.left).toBeGreaterThan(present.left)
  expect(present.left).toBeGreaterThanOrEqual(past.right)
  expect(future.left).toBeGreaterThanOrEqual(present.right)
  expect(present.top).toBeCloseTo(past.top, 1)
  expect(future.top).toBeCloseTo(past.top, 1)
}

async function expectSpatialLayout(board: Locator, spread: SpreadCase) {
  if (spread.id === 'three-card') {
    await expectThreeCardRow(board)
    return
  }

  const boxes = await positionBoxes(board)
  if (spread.id === 'five-card') {
    const [situation, challenge, past, future, advice] = boxes
    expect(situation.top).toBeLessThan(challenge.top)
    expect(challenge.top).toBeLessThan(advice.top)
    expect(past.top).toBeCloseTo(challenge.top, 1)
    expect(future.top).toBeCloseTo(challenge.top, 1)
    expect(past.left).toBeLessThan(challenge.left)
    expect(challenge.left).toBeLessThan(future.left)
    expect(situation.left).toBeCloseTo(challenge.left, 1)
    expect(advice.left).toBeCloseTo(challenge.left, 1)
    return
  }

  const [
    present,
    challenge,
    foundation,
    past,
    possibleOutcome,
    nearFuture,
    self,
    environment,
    hopesAndFears,
    outcome,
  ] = boxes
  for (const position of [past, challenge, nearFuture, environment]) {
    expect(position.top).toBeCloseTo(present.top, 1)
  }
  expect(past.left).toBeLessThan(present.left)
  expect(present.left).toBeLessThan(challenge.left)
  expect(challenge.left).toBeLessThan(nearFuture.left)
  expect(nearFuture.left).toBeLessThan(environment.left)
  expect(possibleOutcome.top).toBeLessThan(present.top)
  expect(present.top).toBeLessThan(foundation.top)
  expect(possibleOutcome.left).toBeCloseTo(present.left, 1)
  expect(foundation.left).toBeCloseTo(present.left, 1)
  expect(outcome.top).toBeLessThan(hopesAndFears.top)
  expect(hopesAndFears.top).toBeLessThan(environment.top)
  expect(environment.top).toBeLessThan(self.top)
  for (const position of [outcome, hopesAndFears, self]) {
    expect(position.left).toBeCloseTo(environment.left, 1)
  }
}

for (const spread of spreads) {
  for (const viewport of [
    { name: 'phone', width: 320, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 1000 },
  ]) {
    test(`${spread.name} fits and preserves its layout at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      const board = await startReading(page, spread)
      await expectVisiblePositions(board, spread)
      await expectNoHorizontalOverflow(page)
      if (viewport.width === 320 && spread.id !== 'three-card') {
        await expectStackedReadingOrder(board)
      } else {
        await expectSpatialLayout(board, spread)
      }

      if (viewport.name !== 'tablet') {
        // Face-down cards keep random dealing out of these layout baselines.
        await expect(page).toHaveScreenshot(
          `${spread.id}-${viewport.name}.png`,
          {
            fullPage: true,
          },
        )
      }
    })
  }

  if (spread.id !== 'three-card') {
    for (const width of [639, 640, 641]) {
      test(`${spread.name} ${width <= 640 ? 'stacks' : 'uses its spatial layout'} at the ${width}px breakpoint boundary`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 })
        const board = await startReading(page, spread)
        await expectVisiblePositions(board, spread)
        await expectNoHorizontalOverflow(page)
        if (width <= 640) {
          await expectStackedReadingOrder(board)
        } else {
          await expectSpatialLayout(board, spread)
        }
      })
    }
  }
}
