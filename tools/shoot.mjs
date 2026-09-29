import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] || '/tmp/walkie-shots'
mkdirSync(OUT, { recursive: true })

const ROUTES = [
  'Home — search',
  'About your dog',
  'Dog details saved',
  'Results — before filtering',
  'Filters',
  'Results — filtered',
  'Walker profile',
  'Book',
  'Request sent',
  'Waiting — notifications',
  'Push — accepted',
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 620, height: 1000 }, deviceScaleFactor: 2 })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' })

for (const label of ROUTES) {
  await page.getByRole('button', { name: label, exact: true }).first().click()
  await page.waitForTimeout(900)
  const device = page.locator('.device')
  const name = label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  await device.screenshot({ path: `${OUT}/${name}.png` })
}

// the wizard, a few steps in, to prove the data-driven screen works
await page.getByRole('button', { name: 'About your dog', exact: true }).first().click()
await page.waitForTimeout(400)
for (let i = 0; i < 6; i++) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForTimeout(220)
}
await page.locator('.device').screenshot({ path: `${OUT}/wizard-step-7.png` })

console.log(JSON.stringify({ shots: ROUTES.length + 1, errors }, null, 2))
await browser.close()
