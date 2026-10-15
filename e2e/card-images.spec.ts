import { expect, test, type Page } from '@playwright/test'

type ShiftWindow = Window & {
  __layoutShift: number
  __cardImagesArriving: boolean
}

// Sums layout shift once delayed card images start arriving, so the dev
// server's injected CSS and font loading on first paint are excluded.
async function observeLayoutShift(page: Page) {
  await page.addInitScript(() => {
    const shiftWindow = window as unknown as ShiftWindow
    shiftWindow.__layoutShift = 0
    shiftWindow.__cardImagesArriving = false
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        hadRecentInput: boolean
        value: number
      })[]) {
        if (!entry.hadRecentInput && shiftWindow.__cardImagesArriving) {
          shiftWindow.__layoutShift += entry.value
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
}

async function delayCardImages(page: Page) {
  for (const pattern of ['**/cards/**', '**/card-back-*']) {
    await page.route(pattern, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1_500))
      await page.evaluate(() => {
        ;(window as unknown as ShiftWindow).__cardImagesArriving = true
      })
      await route.continue()
    })
  }
}

async function waitForVisibleImages(page: Page, selector: string) {
  await page.waitForFunction((imageSelector) => {
    const visible = [
      ...document.querySelectorAll<HTMLImageElement>(imageSelector),
    ].filter((image) => {
      const { top, bottom } = image.getBoundingClientRect()
      return bottom > 0 && top < window.innerHeight
    })
    return (
      visible.length > 0 &&
      visible.every((image) => image.complete && image.naturalWidth > 0)
    )
  }, selector)
  // Let any shift caused by the final decode be reported.
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => resolve(null))),
  )
}

const layoutShift = (page: Page) =>
  page.evaluate(() => (window as unknown as ShiftWindow).__layoutShift)

for (const viewport of [
  { width: 320, height: 900 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`card images do not shift the layout while loading at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await observeLayoutShift(page)
    await delayCardImages(page)

    await page.goto('./')
    await waitForVisibleImages(page, '.deck-explorer__card img')
    expect(await layoutShift(page)).toBeLessThan(0.01)

    await page.getByRole('radio', { name: 'Celtic Cross', exact: true }).check()
    await page.evaluate(() => {
      const shiftWindow = window as unknown as ShiftWindow
      shiftWindow.__layoutShift = 0
      shiftWindow.__cardImagesArriving = false
    })
    await page
      .getByRole('button', { name: 'Begin reading', exact: true })
      .click()
    await page.getByRole('button', { name: 'Reveal all', exact: true }).click()
    await waitForVisibleImages(page, '.reading-board img')
    expect(await layoutShift(page)).toBeLessThan(0.01)
  })
}

test.describe('on a 2x screen', () => {
  test.use({ deviceScaleFactor: 2 })

  test('requests thumbnails in the grid and full-size art in details', async ({
    page,
  }) => {
    const requests: string[] = []
    page.on('request', (request) => requests.push(request.url()))
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('./')
    await waitForVisibleImages(page, '.deck-explorer__card img')

    const grid = await page
      .locator('.deck-explorer__card img')
      .evaluateAll((images) =>
        (images as HTMLImageElement[])
          .filter((image) => image.complete && image.currentSrc)
          .map((image) => image.currentSrc),
      )
    expect(grid.length).toBeGreaterThan(0)
    for (const src of grid) expect(src).toMatch(/-280\.webp$/)

    await page.getByRole('button', { name: 'The Fool', exact: true }).click()
    const detail = page
      .getByRole('complementary', { name: 'Card details', exact: true })
      .getByRole('img')
    await expect
      .poll(() =>
        detail.evaluate((image) => (image as HTMLImageElement).currentSrc),
      )
      .toMatch(/the-fool-420\.webp$/)
    expect(requests.filter((url) => /\/cards\/.+\.png$/.test(url))).toEqual([])
  })
})

test('keeps grid thumbnails in card proportion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('./')
  await waitForVisibleImages(page, '.deck-explorer__card img')

  const { width, height } = await page
    .locator('.deck-explorer__card img')
    .first()
    .evaluate((image) => image.getBoundingClientRect())
  expect(height / width).toBeCloseTo(37 / 21, 1)
})

test('sizes the setup page to its column, not to its card images', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('./')
  await waitForVisibleImages(page, '.deck-explorer__card img')

  const { shell, available } = await page
    .locator('.app-shell')
    .evaluate((element) => {
      const parent = element.parentElement!
      const parentStyle = getComputedStyle(parent)
      const parentContent =
        parent.clientWidth -
        parseFloat(parentStyle.paddingLeft) -
        parseFloat(parentStyle.paddingRight)
      return {
        shell: element.getBoundingClientRect().width,
        available: Math.min(
          parentContent,
          parseFloat(getComputedStyle(element).maxWidth),
        ),
      }
    })
  expect(shell).toBeCloseTo(available, 0)
})
