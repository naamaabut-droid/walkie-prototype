// Drives the real controls and asserts that state actually changed.
// Run the dev server first, then: node tools/probe.mjs [outDir]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] || '/tmp/walkie-probe'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 620, height: 1000 }, deviceScaleFactor: 2 })
const consoleErrors = []
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
page.on('pageerror', (e) => consoleErrors.push(String(e)))
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle' })

const results = []
const check = (name, pass, detail = '') => results.push({ name, pass, detail })
const device = page.locator('.device')

// 1 — "Near" opens the address form; empty fields carry placeholders
await page.getByText('Near', { exact: true }).click()
await page.waitForTimeout(500)
check('Near opens the address form', await page.locator('.formgrid').isVisible())
check('The autocomplete is gone', (await page.locator('.combo').count()) === 0)
await device.screenshot({ path: `${OUT}/address-sheet.png` })

const fields = page.locator('.formgrid input')
const placeholders = await fields.evaluateAll((els) => els.map((e) => e.placeholder))
check('Every field has a placeholder', placeholders.every(Boolean), placeholders.join(', '))
const apt = fields.nth(6)
check('Empty fields are empty, so the placeholder shows', (await apt.inputValue()) === '')

// 1b — the structured fields take typing and reach the booking screen
await fields.nth(5).fill('B')
await apt.fill('7')
await fields.nth(7).fill('3')
await page.waitForTimeout(200)
await device.screenshot({ path: `${OUT}/address-filled.png` })
await page.getByRole('button', { name: 'Save address' }).click()
await page.waitForTimeout(500)

// 1c — current location fills the form
await page.getByText('Near', { exact: true }).click()
await page.waitForTimeout(450)
await page.locator('.formgrid input').first().fill('')
await page.getByRole('button', { name: /current location/ }).click()
await page.waitForTimeout(1100)
check(
  'Current location fills the form',
  (await page.locator('.formgrid input').first().inputValue()) === 'Tel Aviv',
)
await page.getByRole('button', { name: 'Save address' }).click()
await page.waitForTimeout(400)

// 2 — "When" opens the day/time picker and the choice sticks
await page.getByText('When', { exact: true }).click()
await page.waitForTimeout(500)
const pickerOpen = await page.locator('.sheet').isVisible()
check('When opens a picker', pickerOpen)
await device.screenshot({ path: `${OUT}/picker-when.png` })
await page.getByRole('button', { name: 'Tomorrow', exact: true }).click()
await page.getByRole('button', { name: '18:00', exact: true }).click()
await page.getByRole('button', { name: /^Set / }).click()
await page.waitForTimeout(450)
check(
  'When writes back to the field',
  (await page.locator('.field', { hasText: 'When' }).innerText()).includes('Tomorrow · 18:00'),
)

// 3 — walk length picker
await page.getByText('Walk length', { exact: true }).click()
await page.waitForTimeout(450)
await page.getByRole('button', { name: '60 min', exact: true }).click()
await page.waitForTimeout(450)
check(
  'Walk length writes back',
  (await page.locator('.field', { hasText: 'Walk length' }).innerText()).includes('60 min'),
)

// 4 — a tab outside the flow says so instead of doing nothing
await page.getByRole('button', { name: /Community/ }).click()
await page.waitForTimeout(350)
const notice = await page.locator('.notice').innerText().catch(() => '')
check('Out-of-scope tab reports itself', notice.includes('not part of Flow 1'), notice)
await device.screenshot({ path: `${OUT}/out-of-scope.png` })
await page.waitForTimeout(1800)

// 5 — the wizard: placeholder, a real photo upload, and answers reaching the summary
await page.getByRole('button', { name: 'About your dog', exact: true }).first().click()
await page.waitForTimeout(500)
const nameInput = page.locator('input[type="text"], input:not([type])').first()
check('Dog name shows a placeholder', (await nameInput.getAttribute('placeholder')) === 'Louie')

// a 2x2 png, enough to prove the preview renders what was chosen
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAF0lEQVR4AWP8z8Dwn4GBgYGJAQ0AAB6hAQEjfCeQAAAAAElFTkSuQmCC',
  'base64',
)
await page.setInputFiles('input[type="file"]', { name: 'louie.png', mimeType: 'image/png', buffer: PNG })
await page.waitForTimeout(400)
check('Photo preview appears', (await page.locator('img[alt="Your dog"]').count()) === 1)
await device.screenshot({ path: `${OUT}/photo-uploaded.png` })

await nameInput.fill('Rex')
await page.getByRole('button', { name: 'Continue', exact: true }).click()
await page.waitForTimeout(350)
await page.getByRole('button', { name: /^Giant/ }).click()
await page.waitForTimeout(250)
await page.getByRole('button', { name: 'Dog details saved', exact: true }).first().click()
await page.waitForTimeout(700)
const summary = await page.locator('.device').innerText()
check('Wizard answers reach the summary', summary.includes('Rex') && summary.includes('Giant'), '')
check('Photo reaches the saved screen', (await page.locator('img[alt="Rex"]').count()) === 1)
await device.screenshot({ path: `${OUT}/summary-rex.png` })

// 6 — sort picker on Results
await page.getByRole('button', { name: 'Results', exact: true }).first().click()
await page.waitForTimeout(700)
await page.getByRole('button', { name: /Best match/ }).click()
await page.waitForTimeout(450)
await page.getByRole('button', { name: 'Nearest', exact: true }).click()
await page.waitForTimeout(450)
check('Sort writes back', (await page.locator('.device').innerText()).includes('Nearest'))

// 7 — saving a walker toggles the heart
const heart = page.locator('button[aria-label="Save"]').first()
await heart.click()
await page.waitForTimeout(250)
check('Heart toggles', (await page.locator('button[aria-label="Saved"]').count()) > 0)

// 8 — the booking screen carries the choices through
await page.getByRole('button', { name: 'Book', exact: true }).first().click()
await page.waitForTimeout(700)
const book = await page.locator('.device').innerText()
check('Booking shows the chosen time', book.includes('Tomorrow · 18:00'), book.slice(0, 120))
check(
  'Booking shows the door, not just the area',
  book.includes('Entrance B') && book.includes('Apt 7') && book.includes('Floor 3'),
)
await device.screenshot({ path: `${OUT}/book.png` })

// 9 — the questionnaire is required, and finishing it does not hijack the flow
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(400)
check(
  'Home starts without a dog profile',
  (await page.locator('.field', { hasText: 'For' }).innerText()).includes('Add Dog Details'),
)
await page.getByRole('button', { name: /Find a walker/ }).click()
await page.waitForTimeout(600)
check(
  'Find a walker opens the questionnaire when the profile is missing',
  (await page.locator('.device').innerText()).includes('Step 1 of 9'),
)

// answer only the required questions, then finish
const nameField = page.locator('input[type="text"], input:not([type])').first()
await nameField.fill('Louie')
for (let i = 0; i < 8; i++) {
  const opts = page.locator('.option')
  if ((await opts.count()) > 0) await opts.first().click()
  await page.waitForTimeout(150)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForTimeout(220)
}
await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(600)
const savedScreen = await page.locator('.device').innerText()
check('The questionnaire ends on the saved screen', savedScreen.includes('Dog Details Saved'))
check('Save is the primary action, matches the quieter one', savedScreen.includes('Find matches for'))
await device.screenshot({ path: `${OUT}/dog-saved-actions.png` })

await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(700)
check(
  'Saving returns to Home, not to results',
  (await page.locator('.device').innerText()).includes('Need a walk today?'),
)
check(
  'Home now carries the dog',
  (await page.locator('.field', { hasText: 'For' }).innerText()).includes('Louie'),
)

// with a profile, the same button now searches
await page.getByRole('button', { name: /Find a walker/ }).click()
await page.waitForTimeout(700)
check(
  'With a profile, Find a walker goes to the results',
  (await page.locator('.device').innerText()).includes('Matched for Louie'),
)


const failed = results.filter((r) => !r.pass)
console.log(JSON.stringify({ results, failed: failed.length, consoleErrors }, null, 2))
await browser.close()
process.exit(failed.length === 0 && consoleErrors.length === 0 ? 0 : 1)
