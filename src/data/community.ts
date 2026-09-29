// The people around her. Not walkers — dog owners she already knows, and dog owners
// she could add. No ratings here on purpose: you do not score the people you know.

export type Person = { id: string; name: string; meta: string }

/** Already in her community — these are the names that vouch for walkers elsewhere. */
export const KNOWN: Person[] = [
  { id: 'adi', name: 'Adi Yosef', meta: 'Florentin · 1 dog' },
  { id: 'rachel', name: 'Rachel Cohen', meta: 'Florentin · 2 dogs' },
  { id: 'yaelc', name: 'Yael Cohen', meta: 'Your building' },
]

/** Suggested, with a way to ask — the recommendations she sees later come from here. */
export const SUGGESTED: Person[] = [
  { id: 'noa', name: 'Noa R.', meta: '2 streets away' },
  { id: 'yaelk', name: 'Yael K.', meta: 'Neve Tzedek' },
  { id: 'dani', name: 'Dani L.', meta: 'Shapira · 2 dogs' },
]
