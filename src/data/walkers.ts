// Walker records. The same people appear on Home, on both results screens and on the
// profile — in Figma that meant editing the same name in several frames. Here there is
// one source, and each screen chooses which of their facts it is allowed to show.

export type Vouch = { initials: string[]; line: string }

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
  /** the one line under the name: distance, area and rating */
  homeMeta: string
  /** chips on Home, before the dog profile exists */
  homeChips: { label: string; tone: 'notice' | 'fit' | 'neutral' }[]
  /** chips on the unfiltered results: facts about the walker, no verdict about the dog */
  listFacts: string[]
  /** the filtered screen's chips, where that screen shows a different set */
  facts?: string[]
  /** true only for the walkers the filtered results put first */
  matched: boolean
  /** why the model put them first, in one line — only read when matched */
  reason: string
  /** what the dog profile matched on — only read when matched */
  matchTags: string[]
  /** people the owner already knows who vouch for this walker */
  vouch?: Vouch
  /** the shorter wording the unfiltered list uses, where it differs */
  listVouch?: Vouch
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
    homeMeta: '400 m · Florentin  ·  ★ 4.9 (23)',
    homeChips: [
      { label: '⚡ Available now', tone: 'notice' },
      { label: '✓ One-off is fine', tone: 'fit' },
    ],
    listFacts: ['✓ One-off', 'Solo walks', 'Up to 35 kg'],
    matched: true,
    reason: '✦ Quiet routes only — Louie startles at bikes',
    matchTags: ['Quiet routes', 'Walks solo'],
    vouch: { initials: ['N', 'A', 'T'], line: 'Adi Yosef, Rachel Cohen +1 recommend her' },
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
    homeMeta: '1.2 km · Florentin  ·  ★ 4.7 (11)',
    homeChips: [
      { label: '⚡ Takes last-minute', tone: 'notice' },
      { label: '↻ Min 3× a week', tone: 'neutral' },
    ],
    listFacts: ['⚡ Takes last-minute', '↻ Min 3× a week'],
    facts: ['⚡ Available now', '↻ Min 3× a week', 'Up to 2 dogs'],
    matched: true,
    reason: '✦ One dog at a time, long river route',
    matchTags: ['Parks & grass', 'Large · 18–45 kg'],
    vouch: { initials: ['L', 'T'], line: 'Dr. Levi and Tamar recommend her' },
    listVouch: { initials: ['DL'], line: 'Dr. Levi recommends her' },
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
    homeMeta: '900 m · Neve Tzedek  ·  ★ 4.8 (41)',
    homeChips: [{ label: '✓ One-off is fine', tone: 'fit' }],
    listFacts: ['↻ Min 3× a week'],
    matched: false,
    reason: '',
    matchTags: [],
    vouch: { initials: ['Y'], line: 'Yael Cohen recommends her' },
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
    homeMeta: '1.4 km · Shapira  ·  ★ 4.6 (12)',
    homeChips: [
      { label: '⚡ Available now', tone: 'notice' },
      { label: '✓ One-off is fine', tone: 'fit' },
    ],
    listFacts: ['⚡ Available now', '✓ One-off'],
    matched: false,
    reason: '',
    matchTags: [],
  },
]

/** Only in the unfiltered list: the filtered one does not put him forward. */
export const JORDAN: Walker = {
  id: 'jordan',
  name: 'Jordan K.',
  initial: 'J',
  price: 50,
  rating: 4.5,
  reviews: 37,
  walkPhotos: 14,
  area: 'Florentin',
  distance: '1.1 km',
  homeMeta: '1.1 km · Florentin  ·  ★ 4.5 (37)',
  homeChips: [],
  listFacts: ['⚡ Takes last-minute', 'Solo walks', 'Up to 35 kg'],
  matched: false,
  reason: '',
  matchTags: [],
  // no connection to anyone she knows, so the card shows a rating and nothing more
}

/** Everyone the prototype can open a profile for, including the unfiltered-only card. */
export const ALL_WALKERS: Walker[] = [...WALKERS, JORDAN]

const byId = (id: string) => WALKERS.find((w) => w.id === id)!

/** Everyone nearby, before she has filtered anything. */
export const NEARBY: Walker[] = [JORDAN, byId('tamar'), byId('yossi'), byId('dana')]

/** After filtering: the two the model put first, then the rest of the set. */
export const MATCHED: Walker[] = [byId('maya'), byId('dana'), byId('tamar'), byId('yossi')]

/** The tail of the list: they pass the rules, the model just did not rank them first. */
export const REST = [
  { name: 'Ella M.', line: 'Solo walks · quiet streets', distance: '900 m' },
  { name: 'Roni A.', line: 'Solo walks · long routes', distance: '1.1 km' },
  { name: 'Gil S.', line: 'Solo walks · running pace', distance: '1.3 km' },
  { name: 'Shira P.', line: 'Solo walks · early mornings', distance: '1.8 km' },
  { name: 'Omer T.', line: 'Solo walks · city streets', distance: '2.4 km' },
]

/**
 * The counts differ before and after filtering, and each screen's tail is the
 * difference between its header and the cards it drew.
 */
export const NEARBY_COUNT = 18
export const MATCHED_COUNT = 12
export const TOTAL_NEARBY = NEARBY_COUNT
