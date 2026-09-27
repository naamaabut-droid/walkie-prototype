import { useCallback, useMemo, useState } from 'react'
import { PREFILLED, STEPS } from './data/dogWizard'
import { WALKERS } from './data/walkers'

export type Route =
  | 'home'
  | 'wizard'
  | 'dogSaved'
  | 'results'
  | 'filters'
  | 'profile'
  | 'book'
  | 'sent'
  | 'waiting'
  | 'push'

/** Reading order of the flow, used to decide whether a move is forward or back. */
export const ORDER: Route[] = [
  'home',
  'wizard',
  'dogSaved',
  'results',
  'filters',
  'profile',
  'book',
  'sent',
  'waiting',
  'push',
]

export const SCREEN_TITLES: Record<Route, string> = {
  home: 'Home — search',
  wizard: 'About your dog',
  dogSaved: 'Dog details saved',
  results: 'Results',
  filters: 'Filters',
  profile: 'Walker profile',
  book: 'Book',
  sent: 'Request sent',
  waiting: 'Waiting — notifications',
  push: 'Push — accepted',
}

export type Filters = {
  lastMinute: boolean
  radius: string
  size: string
  pack: string
  style: string[]
  hours: string
  length: string
  commitment: string
}

const DEFAULT_FILTERS: Filters = {
  lastMinute: true,
  radius: '3 km',
  size: 'Large · 18–45 kg',
  pack: 'Solo only',
  style: ['City streets', 'Parks & grass', 'Shaded in summer'],
  hours: 'Afternoon',
  length: '45 min',
  commitment: 'One-off is fine',
}

const SIZE_LABELS: Record<string, string> = {
  small: 'Small · 0–7 kg',
  medium: 'Medium · 8–18 kg',
  large: 'Large · 18–45 kg',
  giant: 'Giant · 45 kg and over',
}

export type Transition = 'forward' | 'back' | 'overlay' | 'fade'

/** Which transition a move deserves — decided when the move happens, not after it. */
function transitionFor(from: Route, to: Route): Transition {
  if (to === 'push') return 'fade'
  if (to === 'filters') return 'overlay'
  if (from === 'filters') return 'back'
  return ORDER.indexOf(to) >= ORDER.indexOf(from) ? 'forward' : 'back'
}

/** Which chooser is open over the current screen, if any. */
export type SheetKind = 'when' | 'length' | 'sort' | 'near' | 'address' | 'dog' | null

export type Form = {
  day: string
  time: string
  length: string
  sort: string
}

/** What a walker needs to find a door, not just a neighbourhood. */
export type Address = {
  city: string
  postcode: string
  area: string
  street: string
  number: string
  entrance: string
  apt: string
  floor: string
  entry: string
  directions: string
}

const DEFAULT_FORM: Form = {
  day: 'Thursday',
  time: '17:00',
  length: '45 min',
  sort: 'Best match',
}

const DEFAULT_ADDRESS: Address = {
  city: 'Tel Aviv',
  postcode: '',
  area: 'Florentin',
  street: 'Vital',
  number: '12',
  entrance: '',
  apt: '',
  floor: '',
  entry: '',
  directions: '',
}

export const DAYS = ['Today', 'Tomorrow', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const TIMES = ['07:00', '08:00', '12:00', '16:00', '16:30', '17:00', '17:30', '18:00', '19:00']
export const LENGTHS = ['30 min', '45 min', '60 min', 'Longer']
export const SORTS = ['Best match', 'Nearest', 'Soonest', 'Price, low to high', 'Rating']

/** A saved dog profile. The questionnaire produces one of these; Home chooses between them. */
export type Dog = {
  id: string
  name: string
  photo: string | null
  answers: Record<string, string | string[]>
}

export function useApp() {
  const [route, setRoute] = useState<Route>('home')
  const [transition, setTransition] = useState<Transition>('forward')
  const [form, setForm] = useState<Form>(DEFAULT_FORM)
  const [address, setAddress] = useState<Address>(DEFAULT_ADDRESS)
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [saved, setSaved] = useState<string[]>([])
  const [photo, setPhotoUrl] = useState<string | null>(null)
  const [dogs, setDogs] = useState<Dog[]>([])
  const [activeDogId, setActiveDogId] = useState<string | null>(null)
  /** the profile being filled in right now; null id means it is a new dog */
  const [editingId, setEditingId] = useState<string | null>(null)
  const [walkerId, setWalkerId] = useState('maya')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [frequency, setFrequency] = useState('Weekly')
  const [, setHistory] = useState<Route[]>([])

  const go = useCallback(
    (next: Route) => {
      if (next === route) return
      setTransition(transitionFor(route, next))
      setHistory((h) => [...h, route])
      setRoute(next)
    },
    [route],
  )

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const to = h[h.length - 1]
      setTransition('back')
      setRoute(to)
      return h.slice(0, -1)
    })
  }, [route])

  const answer = useCallback((id: string, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: value }))
  }, [])

  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), [])

  const prevStep = useCallback(() => {
    setStep((s) => {
      if (s === 0) {
        setRoute('home')
        return 0
      }
      return s - 1
    })
  }, [])

  const walker = useMemo(() => WALKERS.find((w) => w.id === walkerId) ?? WALKERS[0], [walkerId])

  /** The saved screen is not a drawing — it reads the answers back. */
  const summary = useMemo(
    () =>
      STEPS.map((s) => {
        const value = answers[s.id]
        const label = (v: string) =>
          s.options?.find((o) => o.value === v)?.label ?? SIZE_LABELS[v] ?? v
        if (Array.isArray(value))
          return { label: s.summaryLabel, value: value.map(label).join(' · ') }
        if (s.id === 'size' && typeof value === 'string')
          return { label: s.summaryLabel, value: SIZE_LABELS[value] ?? value }
        if (s.id === 'notes' && typeof value === 'string' && value)
          return { label: s.summaryLabel, value: 'Water halfway · the gate sticks' }
        return { label: s.summaryLabel, value: typeof value === 'string' ? label(value) : '' }
      }).filter((r) => r.value),
    [answers],
  )

  const activeDog = dogs.find((d) => d.id === activeDogId) ?? null
  const draftName = typeof answers.name === 'string' && answers.name ? answers.name : ''
  const dogName = activeDog?.name || draftName || 'Louie'
  const sizeOf = (a: Record<string, string | string[]>) =>
    typeof a.size === 'string' ? SIZE_LABELS[a.size] ?? '' : ''
  const dogSize = sizeOf(activeDog?.answers ?? answers)
  const draftComplete = STEPS.filter((s) => s.required).every((s) => answers[s.id])
  /** Home can search once a dog is saved, not merely once the draft looks finished. */
  const dogComplete = activeDog !== null

  /**
   * The screen list above the phone is a reviewer's shortcut, not part of the product.
   * Jumping past the wizard fills the profile so the later screens have something to read —
   * but only when nothing has been answered yet. A half-finished profile is the user's, and
   * overwriting it would throw away what they just typed.
   */
  const jumpTo = (next: Route) => {
    const untouched = Object.keys(answers).length === 0
    if (ORDER.indexOf(next) > ORDER.indexOf('wizard') && untouched) setAnswers(PREFILLED)
    go(next)
  }

  /**
   * The questionnaire is required to search, so "Find a walker" opens it — but at
   * the first question still unanswered, not back at the beginning.
   */
  const openWizard = () => {
    const first = STEPS.findIndex((s) => s.required && !answers[s.id])
    setStep(first === -1 ? 0 : first)
    go('wizard')
  }

  /** Start a fresh profile — a second dog, not an edit of the first. */
  const addDog = () => {
    setEditingId(null)
    setAnswers({})
    setPhotoUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return null
    })
    setStep(0)
    setSheet(null)
    go('wizard')
  }

  /** Reopen a saved profile in the questionnaire. */
  const editDog = (id: string) => {
    const dog = dogs.find((d) => d.id === id)
    if (!dog) return
    setEditingId(id)
    setAnswers(dog.answers)
    setPhotoUrl(dog.photo)
    setStep(0)
    setSheet(null)
    go('wizard')
  }

  /** Commit the draft. This is what the Save button on the saved screen does. */
  const saveDog = () => {
    const name = draftName || 'Your dog'
    if (editingId) {
      setDogs((list) =>
        list.map((d) => (d.id === editingId ? { ...d, name, photo, answers } : d)),
      )
      setActiveDogId(editingId)
    } else {
      const id = 'dog-' + Date.now()
      setDogs((list) => [...list, { id, name, photo, answers }])
      setActiveDogId(id)
      setEditingId(id)
    }
    go('home')
  }

  return {
    route,
    transition,
    go,
    jumpTo,
    back,
    openWizard,
    addDog,
    editDog,
    saveDog,
    dogs,
    activeDogId,
    chooseDog: (id: string) => {
      setActiveDogId(id)
      setSheet(null)
    },
    dogSummaryLine: (d: Dog) =>
      [
        sizeOf(d.answers),
        typeof d.answers.lead === 'string'
          ? STEPS.find((s) => s.id === 'lead')?.options?.find((o) => o.value === d.answers.lead)
              ?.label
          : '',
      ]
        .filter(Boolean)
        .join(' · '),
    draftComplete,
    dogComplete,
    step,
    nextStep,
    prevStep,
    answers,
    answer,
    summary,
    dogName,
    photo,
    /** Object URLs have to be released, or every replacement leaks the last one. */
    setPhoto: (file: File | null) => {
      setPhotoUrl((old) => {
        if (old) URL.revokeObjectURL(old)
        return file ? URL.createObjectURL(file) : null
      })
    },
    dogSize: dogSize.replace('Large · 18–45 kg', 'Large, 28 kg'),
    saved,
    toggleSave: (id: string) =>
      setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    walker,
    openWalker: (id: string) => {
      setWalkerId(id)
      setTransition('forward')
      setHistory((h) => [...h, route])
      setRoute('profile')
    },
    filters,
    setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) =>
      setFilters((f) => ({ ...f, [key]: value })),
    toggleStyle: (s: string) =>
      setFilters((f) => ({
        ...f,
        style: f.style.includes(s) ? f.style.filter((x) => x !== s) : [...f.style, s],
      })),
    resetFilters: () => setFilters(DEFAULT_FILTERS),
    matchCount: WALKERS.length,
    frequency,
    setFrequency,

    form,
    setField: <K extends keyof Form>(key: K, value: Form[K]) =>
      setForm((f) => ({ ...f, [key]: value })),

    /**
     * One address, two readings of it. Home only needs the area; the booking screen
     * needs the door. Entering it twice would be the kind of friction this flow argues against.
     */
    address,
    setAddress,
    nearLabel: [address.area, address.city].filter(Boolean).join(', ') || 'Add an address',
    addressLabel:
      [
        [address.number, address.street].filter(Boolean).join(' '),
        address.entrance ? `Entrance ${address.entrance}` : '',
        address.apt ? `Apt ${address.apt}` : '',
        address.floor ? `Floor ${address.floor}` : '',
        address.area,
      ]
        .filter(Boolean)
        .join(' · ') || 'Add an address',
    setWhen: (day: string, time: string) => setForm((f) => ({ ...f, day, time })),
    whenLabel: `${form.day} · ${form.time}`,

    sheet,
    openSheet: (kind: Exclude<SheetKind, null>) => setSheet(kind),
    closeSheet: () => setSheet(null),

    /**
     * Anything outside Flow 1 says so out loud. A dead control reads as a bug;
     * a control that tells you it is out of scope reads as a decision.
     */
    notice,
    outOfScope: (what: string) => {
      setNotice(`${what} — not part of Flow 1`)
      window.setTimeout(() => setNotice(null), 1900)
    },
  }
}

export type AppState = ReturnType<typeof useApp>
