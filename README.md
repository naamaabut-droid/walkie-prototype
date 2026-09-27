# Walkie — Flow 1, in code

A running prototype of **Flow 1 · a new owner books her first walk** — the ten screens a first-time
owner passes through from the home screen to the accepted push.

It is built from the Figma file, not traced from it. Every colour, size, radius and text style comes
from a token that exists in
[the Figma file](https://www.figma.com/design/7iPVK36aRKGHBb8hsURLwB/Walkie-%E2%80%94-Duda-Take-Home?node-id=258-7049)
as a variable or a text style. There is no loose hex in a component.

```bash
npm install
npm run dev
```

---

## What the translation actually did

The interesting part of design-to-code is not that the pixels match. It is what the structure of the
design turns into once it has to run.

| In Figma | In code | Why it matters |
|---|---|---|
| 9 frames, `About your dog — 1..9 of 9` | 1 screen + 9 objects in `data/dogWizard.ts` | Adding a tenth question is one object, not a tenth frame to keep in step |
| `Walker card (compact)` and `card` on Results | one `WalkerCard` with two variants | The two cannot drift apart; in Figma they already had |
| Maya L. written into 3 frames | one record in `data/walkers.ts` | Changing her price changes it everywhere at once |
| `About your dog — saved`, drawn | `state.summary`, computed from the answers | The summary cannot disagree with what you picked, because it *is* what you picked |
| `Colors` + `Walkie Tokens` variables | `styles/tokens.css` custom properties | One file to re-export when the palette moves |
| 28 text styles | 28 classes, named for the style | `Wireframes/Title/13` → `.t-title-13` |
| Prototype reactions | `state.ts` routes + the transition table in `App.tsx` | Same timings and directions as the Figma prototype |
| `ON_DRAG` hotspot on the sheet | a real drag, in `Sheet.tsx` | Figma could only fake the gesture; here it follows your finger and has velocity |

## The type scale

The wireframes originally carried 71 text styles with half-pixel sizes (9.5, 10.5, 11.5, 12.5, 13.5)
and odd sizes above 15 (15, 17, 21). They were consolidated in Figma first, to
**10 · 11 · 12 · 13 · 14 · 16 · 18 · 20 · 22 · 24** (+28, 62 display), and the CSS classes were
generated from that. The size is the name — `.t-body-10`, `.t-title-13` — so a class and a Figma
style can never mean different things.

## Structure

```
src/
  styles/tokens.css     generated from the Figma variables + text styles
  styles/app.css        the shell and the primitives, tokens only
  data/                 walkers, and the nine wizard questions
  components/           Chrome (status bar, app bar, tab bar, Screen), ui, WalkerCard, Sheet
  screens/              one file per screen of the flow
  state.ts              routes, transitions, the dog profile, filters
  App.tsx               the router and the transition table
tools/shoot.mjs         screenshots every route headlessly — how this was checked
```

## The controls are real

Nothing here is a picture of a control.

- **`Near` and `Pickup address` open one address form**, asked the way an online delivery form asks:
  city, postcode, neighbourhood, street, number, entrance, apartment, floor, entry code and
  directions — required fields marked, and every empty field carrying an example rather than sitting
  blank. One button above it fills the lot from the device's location. Both fields carry a location pin.
  One address, two readings: Home shows the area, the booking screen shows the door. Entering it
  twice would be exactly the friction this flow argues against.
- **The dog's photo uploads for real** — it opens the file picker (camera on a phone), previews
  what you chose, offers Replace and Remove, and the same image is what the saved profile shows.
- **Typing** — the dog's name, with `Louie` as a placeholder rather than a pre-filled value;
  `Pickup address` on Book; the free-text note in the wizard.
- **Pickers** — `When` opens a two-wheel day-and-time sheet that opens on the current value;
  `Walk length` and the sort control open a list sheet. Each writes back to the field, and the
  choice follows you: pick *Tomorrow · 18:00* on Home and the booking screen and the push both say so.
- **Selection** — every wizard option, every filter chip, the last-minute switch and the ♡ hold state.
- **The summary is computed.** Type *Rex*, choose *Giant*, and the saved screen says Rex and Giant,
  with only the rows you answered.
- **The dog profile is a real record, and there can be more than one.** The questionnaire is only
  reached the first time, or by *Add another dog*, or by *Edit* from the picker. Once a dog is
  saved, `For` opens a chooser holding **only the dogs actually saved** — no fixtures — with the
  saved one selected.
- **The questionnaire is the gate.** *Find a walker* with no profile opens it, at the first question
  still unanswered rather than back at step 1, because nobody can be matched without it.

**What deliberately does not work:** anything outside Flow 1 — the Saved, Scheduled, Community and
Profile tabs, Messages, the inbox, the full walker list. Those screens were never designed, so
tapping them says *"— not part of Flow 1"* rather than doing nothing. A dead control reads as a bug;
one that names its own boundary reads as a decision.

## How it was verified

Two scripts, both against the running app:

- `node tools/shoot.mjs <dir>` — walks all ten screens plus the wizard, captures each, reports
  console errors.
- `node tools/probe.mjs <dir>` — drives the actual controls and asserts the state changed: typing
  sticks, the picker writes back, the wizard reaches the summary, the sort changes, the heart
  toggles, the photo uploads and reaches the saved screen, and the booking screen carries both the
  chosen time and the entrance, apartment and floor, and that the dog picker holds exactly the dogs
  that were saved. 33 checks, 0 console errors.

Every screen was compared against its Figma frame in a render, not by reading the code.

## Deliberately not here

- **Payment.** It is set once in settings, not at booking time — the same decision the flow makes.
- **Real data.** The walkers are fixtures; the point is the flow, not a back end.
- **Flow 2 and Concept 2.** This is Flow 1 of Concept 1 only.
