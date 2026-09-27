// Walker records. The same five people appear on Home, Results and the profile —
// in Figma that meant editing the same name in three frames. Here there is one source.

export type Walker = {
  id: string
  name: string
  initial: string
  price: number
  rating: number
  reviews: number
  /** photos from her own walks, shown on the profile — not the same as reviews */
  walkPhotos: number
  area: string
  distance: string
  /** availability line as it reads on the results card */
  when: string
  matched: boolean
  /** the three hard facts shown as chips on the results card */
  facts: string[]
  /** why the model put them here, in one line */
  reason: string
  /** what the dog profile matched on */
  matchTags: string[]
  /** people the owner already knows who vouch for this walker */
  vouch?: { initials: string[]; line: string }
  /** chips on the compact home card, before the dog profile exists */
  homeChips: { label: string; tone: 'notice' | 'fit' | 'neutral' }[]
  homeMeta: string
}

export const WALKERS: Walker[] = [
  {
    id: 'maya',
    name: 'Maya L.',
    initial: 'M',
    price: 50,
    rating: 4.9,
    reviews: 23,
    walkPhotos: 24,
    area: 'Florentin',
    distance: '400 m',
    when: '400 m · can start now',
    matched: true,
    facts: ['✓ Fits Louie', '⚡ Now', '⚡ Last-minute'],
    reason: '✦ Quiet routes only — Louie startles at bikes',
    matchTags: ['quiet routes', 'walks solo'],
    vouch: {
      initials: ['N', 'A', 'T'],
      line: 'Adi Yosef, Rachel Cohen +1 recommend her · all dog owners',
    },
    homeChips: [
      { label: '⚡ Available now', tone: 'notice' },
      { label: '✓ One-off is fine', tone: 'fit' },
    ],
    homeMeta: '400 m · Florentin  ·  ★ 4.9 (23)',
  },
  {
    id: 'dana',
    name: 'Dana K.',
    initial: 'D',
    price: 60,
    rating: 4.7,
    reviews: 11,
    walkPhotos: 12,
    area: 'Florentin',
    distance: '1.2 km',
    when: '1.2 km · 17:30',
    matched: true,
    facts: ['✓ Fits Louie', '⚡ Now', '↻ Min 3×/week'],
    reason: '✦ One dog at a time, long river route',
    matchTags: ['quiet routes', 'walks solo'],
    vouch: { initials: ['L', 'T'], line: 'Dr. Levi, your vet · Tamar from the park' },
    homeChips: [
      { label: '⚡ Takes last-minute', tone: 'notice' },
      { label: '↻ Min 3× a week', tone: 'neutral' },
    ],
    homeMeta: '1.2 km · Florentin  ·  ★ 4.7 (11)',
  },
  {
    id: 'tamar',
    name: 'Tamar R.',
    initial: 'T',
    price: 55,
    rating: 4.8,
    reviews: 41,
    walkPhotos: 31,
    area: 'Neve Tzedek',
    distance: '900 m',
    when: '900 m · can start 17:15',
    matched: true,
    facts: ['✓ Fits Louie', '⚡ Now', '✓ One-off is fine'],
    reason: '✦ Walks two dogs max, long routes — Louie needs to burn energy',
    matchTags: ['quiet routes', 'walks solo'],
    vouch: { initials: ['Y'], line: 'Yael, from your building — dog owner' },
    homeChips: [{ label: '✓ One-off is fine', tone: 'fit' }],
    homeMeta: '900 m · Neve Tzedek  ·  ★ 4.8 (41)',
  },
  {
    id: 'yossi',
    name: 'Yossi B.',
    initial: 'Y',
    price: 45,
    rating: 4.6,
    reviews: 12,
    walkPhotos: 9,
    area: 'Shapira',
    distance: '1.4 km',
    when: '1.4 km · can start 17:30',
    matched: true,
    facts: ['✓ Fits Louie', '⚡ Now', '✓ One-off is fine'],
    reason: '✦ One dog at a time, quiet streets — matches Louie’s profile',
    matchTags: ['quiet routes', 'walks solo'],
    homeChips: [
      { label: '⚡ Available now', tone: 'notice' },
      { label: '✓ One-off is fine', tone: 'fit' },
    ],
    homeMeta: '1.4 km · Shapira  ·  ★ 4.6 (12)',
  },
]

/** The tail of the list: they pass the rules, the model just did not rank them first. */
export const REST = [
  { name: 'Ella M.', line: 'Solo walks · quiet streets', distance: '900 m' },
  { name: 'Roni A.', line: 'Solo walks · long routes', distance: '1.1 km' },
  { name: 'Gil S.', line: 'Solo walks · running pace', distance: '1.3 km' },
  { name: 'Shira P.', line: 'Solo walks · early mornings', distance: '1.8 km' },
  { name: 'Omer T.', line: 'Solo walks · city streets', distance: '2.4 km' },
]

export const TOTAL_NEARBY = 14
