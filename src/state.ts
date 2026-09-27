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
export type SheetKind = 'when' | 'length' | 'sort' | null

export type Form = {
  near: string
  day: string
  time: string
  length: string
  address: string
  sort: string
}

const DEFAULT_FORM: Form = {
  near: 'Florentin, Tel Aviv',
  day: 'Thursday',
  time: '17:00',
  length: '45 min',
  address: 'Florentin, 12 Vital St.',
  sort: 'Best match',
}

export const DAYS = ['Today', 'Tomorrow', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const TIMES = ['07:00', '08:00', '12:00', '16:00', '16:30', '17:00', '17:30', '18:00', '19:00']
export const LENGTHS = ['30 min', '45 min', '60 min', 'Longer']
export const SORTS = ['Best match', 'Nearest', 'Soonest', 'Price, low to high', 'Rating']

export function useApp() {
  const [route, setRoute] = useState<Route>('home')
  const [transition, setTransition] = useState<Transition>('forward')
  const [form, setForm] = useState<Form>(DEFAULT_FORM)
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [saved, setSaved] = useState<string[]>([])
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

  const dogName = typeof answers.name === 'string' && answers.name ? answers.name : 'Louie'
  const dogSize = typeof answers.size === 'string' ? SIZE_LABELS[answers.size] ?? '' : ''
  const dogComplete = STEPS.filter((s) => s.required).every((s) => answers[s.id])

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

  return {
    route,
    transition,
    go,
    jumpTo,
    back,
    dogComplete,
    step,
    nextStep,
    prevStep,
    answers,
    answer,
    summary,
    dogName,
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
