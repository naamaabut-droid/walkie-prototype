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

// 1 — "Pickup Address" starts empty and opens the address form
check(
  'Pickup Address starts empty',
  (await page.locator('.field', { hasText: 'Pickup Address' }).innerText()).includes('Add Address'),
)
await page.getByText('Pickup Address', { exact: true }).click()
await page.waitForTimeout(500)
check('It opens the address form', await page.locator('.formgrid').isVisible())
check('The autocomplete is gone', (await page.locator('.combo').count()) === 0)
await device.screenshot({ path: `${OUT}/address-sheet.png` })

const fields = page.locator('.formgrid input')
const placeholders = await fields.evaluateAll((els) => els.map((e) => e.placeholder))
check('Every field has a placeholder', placeholders.every(Boolean), placeholders.join(', '))
const apt = fields.nth(6)
const values = await fields.evaluateAll((els) => els.map((e) => e.value))
check('Every field starts empty', values.every((v) => v === ''), values.join('|'))

// 1b — the structured fields take typing, and the default toggle works
await fields.nth(0).fill('Tel Aviv')
await fields.nth(2).fill('Florentin')
await fields.nth(3).fill('Vital')
await fields.nth(4).fill('12')
await fields.nth(5).fill('B')
await apt.fill('7')
await fields.nth(7).fill('3')
await page.getByRole('switch', { name: /default address/ }).click()
await page.waitForTimeout(200)
check('The default toggle turns on', (await page.locator('.switch[data-on]').count()) === 1)
await device.screenshot({ path: `${OUT}/address-filled.png` })
await page.getByRole('button', { name: 'Save Address' }).click()
await page.waitForTimeout(500)

const homeAddress = await page.locator('.field', { hasText: 'Pickup Address' }).innerText()
check('The address reaches the Home field', homeAddress.includes('Florentin, 12 Vital St.'), homeAddress)
check('…and it is marked as the default', homeAddress.includes('DEFAULT'))
await device.screenshot({ path: `${OUT}/home-address-filled.png` })

// 1c — the sheet is a typed form and nothing else, the way the frame draws it
await page.getByText('Pickup Address', { exact: true }).click()
await page.waitForTimeout(450)
check('No locate shortcut the frame does not draw', (await page.locator('.locate').count()) === 0)
await page.getByRole('button', { name: 'Save Address' }).click()
await page.waitForTimeout(400)

// 2 — "When" opens the day/time picker and the choice sticks
await page.getByText('When', { exact: true }).click()
await page.waitForTimeout(500)
const pickerOpen = await page.locator('.sheet').isVisible()
check('When opens a picker', pickerOpen)
await device.screenshot({ path: `${OUT}/picker-when.png` })
await page.getByRole('button', { name: 'Tomorrow', exact: true }).click()
await page.getByRole('button', { name: '18:00', exact: true }).click()
await page.getByRole('button', { name: 'Confirm', exact: true }).click()
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
check(
  'Dog name shows a placeholder',
  (await nameInput.getAttribute('placeholder')) === 'What is your dogs name?',
)

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

// 6 — before filtering, the list is everyone nearby, including a walker Louie fails
await page.getByRole('button', { name: 'Results — before filtering', exact: true }).first().click()
await page.waitForTimeout(700)
const unfiltered = await page.locator('.device').innerText()
check('Before filtering the count is the unfiltered one', unfiltered.includes('18 walkers near you'))
check('…and no card claims a match', !unfiltered.includes('MATCHED FOR'))
check('…and the list is the unfiltered set', unfiltered.includes('Jordan K.'))
check(
  'Every card keeps the same actions whatever its state',
  (await page.locator('.card button.btn--primary').count()) ===
    (await page.locator('button[aria-label="Save"], button[aria-label="Saved"]').count()),
)
await device.screenshot({ path: `${OUT}/results-before-filtering.png` })

// 6b — filtering is what produces the match list, and it has a destination
await page.getByRole('button', { name: '⚙ Filters' }).first().click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: 'Show Results', exact: true }).click()
await page.waitForTimeout(700)
const matched = await page.locator('.device').innerText()
check('Show Results lands on the filtered count', matched.includes('12 walkers near you'))
check('…which is the state that carries the badges', matched.includes('MATCHED FOR'))
check('…and drops the walker the filter excludes', !matched.includes('Jordan K.'))
check(
  '…and only the matched walkers carry a reason',
  (matched.match(/MATCHED FOR/g) || []).length === 2,
)
await device.screenshot({ path: `${OUT}/results-filtered.png` })

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
  'Booking shows the address the way the frame writes it',
  book.includes('Florentin, 12 Vital St.'),
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
const lastStep = await page.locator('.device').innerText()
check('The notes step ends in Save alone', lastStep.includes('Save') && !lastStep.includes('Skip'))
check('The note label says it is optional', lastStep.includes('Your note (optional)'))
await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(600)
const savedScreen = await page.locator('.device').innerText()
check('The questionnaire ends on the saved screen', savedScreen.includes('Dog Details Saved'))
check(
  'The saved screen carries the two actions the frame draws',
  savedScreen.includes('Find matches') && savedScreen.includes('Done'),
)
await device.screenshot({ path: `${OUT}/dog-saved-actions.png` })

// the X saves and returns home, so closing the screen does not discard the profile
await page.getByRole('button', { name: 'Close' }).first().click()
await page.waitForTimeout(700)
check(
  'Closing the saved screen returns to Home',
  (await page.locator('.device').innerText()).includes('Need a walk today?'),
)
check(
  'Home now carries the dog',
  (await page.locator('.field', { hasText: 'For' }).innerText()).includes('Louie'),
)

// 10 — "For" is now a dog picker holding only the dog that was actually saved
await page.locator('.field', { hasText: 'For' }).click()
await page.waitForTimeout(500)
const dogRows = await page.locator('.dogrow').count()
check('The picker holds exactly the one saved dog', dogRows === 1, `${dogRows} rows`)
check(
  'No invented dogs in the list',
  (await page.locator('.dogrow').first().innerText()).includes('Louie'),
)
check('It offers adding another dog', (await page.locator('.dogadd').count()) === 1)
check('The saved dog is the selected one', (await page.locator('.dogrow[data-active]').count()) === 1)
await device.screenshot({ path: `${OUT}/dog-picker.png` })

// adding a dog starts an empty questionnaire, it does not reopen the saved one
await page.locator('.dogadd').click()
await page.waitForTimeout(600)
const fresh = page.locator('input[type="text"], input:not([type])').first()
check('Add another dog starts empty at step 1', (await fresh.inputValue()) === '')
check('…and at the first question', (await page.locator('.device').innerText()).includes('Step 1 of 9'))

// back out, and the saved dog is still the default in the field
await page.getByRole('button', { name: 'Close' }).first().click()
await page.waitForTimeout(600)
check(
  'The saved dog is still the default in the field',
  (await page.locator('.field', { hasText: 'For' }).innerText()).includes('Louie'),
)

// with a profile, the same button now searches
await page.getByRole('button', { name: /Find a walker/ }).click()
await page.waitForTimeout(700)
check(
  'With a profile, Find a walker goes to the unfiltered results',
  (await page.locator('.device').innerText()).includes('18 walkers near you'),
)

// 11 — Results is not one-way: it goes back, and it reaches the filters
await page.getByRole('button', { name: /^‹\s*Results$/ }).click()
await page.waitForTimeout(600)
check('Results goes back to Home', (await page.locator('.device').innerText()).includes('Need a walk today?'))
await page.getByRole('button', { name: /Find a walker/ }).click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: '⚙ Filters' }).first().click()
await page.waitForTimeout(600)
check('Results reaches the filters', (await page.locator('.device').innerText()).includes('Reset'))
await device.screenshot({ path: `${OUT}/results-filters.png` })

// 12 — Send request cannot fire while Day and time is empty
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(400)
check(
  'When starts unset, as the frame draws it',
  (await page.locator('.field', { hasText: 'When' }).innerText()).includes('Select date and time'),
)
await page.getByRole('button', { name: /Find a walker/ }).click()
await page.waitForTimeout(500)
const nameF = page.locator('input[type="text"], input:not([type])').first()
await nameF.fill('Louie')
for (let i = 0; i < 8; i++) {
  const opts = page.locator('.option')
  if ((await opts.count()) > 0) await opts.first().click()
  await page.waitForTimeout(140)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForTimeout(200)
}
await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: /Find matches/ }).click()
await page.waitForTimeout(700)
await page.getByRole('button', { name: 'Book', exact: true }).first().click()
await page.waitForTimeout(700)
const sendBtn = page.getByRole('button', { name: 'Send request' })
check('Send request is disabled with no day and time', await sendBtn.isDisabled())
await device.screenshot({ path: `${OUT}/send-disabled.png` })
await page.getByText('Select date and time', { exact: true }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: 'Thursday', exact: true }).click()
await page.getByRole('button', { name: '17:00', exact: true }).click()
await page.getByRole('button', { name: 'Confirm', exact: true }).click()
await page.waitForTimeout(500)
check('…and enabled once it is set', await sendBtn.isEnabled())
check(
  'The size never quotes a weight the questionnaire did not ask',
  !(await page.locator('.device').innerText()).includes('28 kg'),
)

// 13 — Home browses sideways, and carries the community below it
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(400)
const scroll = page.locator('.screen__scroll').last()
const geom = await scroll.evaluate((el) => ({ h: el.clientHeight, sh: el.scrollHeight }))
check('Home scrolls', geom.sh > geom.h, `${geom.sh} vs ${geom.h}`)
check('The walkers browse sideways', (await page.locator('.hscroll .browsecard').count()) === 4)
const row = page.locator('.hscroll').first()
const rowGeom = await row.evaluate((el) => ({ w: el.clientWidth, sw: el.scrollWidth }))
check('…and the row overflows, so there is something to scroll to', rowGeom.sw > rowGeom.w)
const browse = await page.locator('.browsecard').first().innerText()
check('A browse card claims no match', !browse.includes('Fits') && !browse.includes('MATCHED'))

await scroll.evaluate((el) => el.scrollTo(0, el.scrollHeight))
await page.waitForTimeout(400)
const bottom = await page.locator('.device').innerText()
check('Community sits under the walkers', bottom.includes('Community'))
check('It has both groups', bottom.includes('People you know') && bottom.includes('Add to your community'))
check('People you know are connected already', (await page.locator('.personcard[data-connected]').count()) === 3)
check('The rest can be added', (await page.locator('.personcard__connect').count()) === 3)
const person = await page.locator('.personcard').first().innerText()
check('A community card carries no rating', !person.includes('★'))
await device.screenshot({ path: `${OUT}/home-community.png` })

await page.locator('.personcard__connect').first().click()
await page.waitForTimeout(300)
check(
  'Connecting moves someone into the community',
  (await page.locator('.personcard[data-connected]').count()) === 4 &&
    (await page.locator('.personcard__connect').count()) === 2,
)

// 14 — the chrome: profile moved up to the header, Requests took its tab
const tabs = await page.locator('.tabbar').innerText()
check(
  'The tab bar order matches the frames',
  tabs.replace(/\s+/g, ' ').trim() === 'Saved Scheduled Home Requests Community',
  tabs.replace(/\n/g, ' · '),
)
check('…and no longer carries Profile', !tabs.includes('Profile'))
check(
  'The profile sits in the header instead',
  (await page.locator('.appbar .appbar__avatar').count()) === 1,
)

const failed = results.filter((r) => !r.pass)
console.log(JSON.stringify({ results, failed: failed.length, consoleErrors }, null, 2))
await browser.close()
process.exit(failed.length === 0 && consoleErrors.length === 0 ? 0 : 1)
