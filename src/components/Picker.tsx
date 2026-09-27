import { useState } from 'react'
import { Sheet } from './Sheet'
import { Button } from './ui'

/** A single-column chooser in a bottom sheet — walk length, sort order. */
export function ListPicker({
  title,
  note,
  options,
  value,
  onPick,
  onDismiss,
}: {
  title: string
  note?: string
  options: string[]
  value: string
  onPick: (v: string) => void
  onDismiss: () => void
}) {
  return (
    <Sheet onDismiss={onDismiss}>
      <div className="stack" style={{ gap: 4, paddingBottom: 12 }}>
        <span className="t-heading-18">{title}</span>
        {note ? <span className="t-body-12 muted">{note}</span> : null}
      </div>
      <div className="stack" style={{ gap: 6, maxHeight: 300, overflowY: 'auto' }}>
        {options.map((o) => (
          <button
            key={o}
            className="option"
            aria-pressed={o === value}
            onClick={() => {
              onPick(o)
              onDismiss()
            }}
          >
            <span className="option__label t-title-14 grow">{o}</span>
            <span className="option__mark">{o === value ? <span className="t-title-12">✓</span> : null}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}

/** Two wheels, day and time — the shape a native date-and-time picker takes. */
export function WhenPicker({
  dogName,
  days,
  times,
  day,
  time,
  onChange,
  onDismiss,
}: {
  dogName: string
  days: string[]
  times: string[]
  day: string
  time: string
  onChange: (day: string, time: string) => void
  onDismiss: () => void
}) {
  return (
    <Sheet onDismiss={onDismiss}>
      <div className="stack" style={{ gap: 4, paddingBottom: 12 }}>
        <span className="t-heading-18">When does {dogName} need a walk?</span>
        <span className="t-body-12 muted">Pick a day and a time.</span>
      </div>

      <div className="row" style={{ gap: 10, alignItems: 'stretch' }}>
        <Wheel items={days} value={day} onPick={(d) => onChange(d, time)} label="DAY" />
        <Wheel items={times} value={time} onPick={(t) => onChange(day, t)} label="TIME" />
      </div>

      <div style={{ paddingTop: 14 }}>
        <Button onClick={onDismiss}>
          Set {day} · {time}
        </Button>
      </div>
    </Sheet>
  )
}

/**
 * Where the walk starts. A map, the device's own location as the first option,
 * and typing as the fallback — in that order, because the common case is "here".
 */
export function LocationPicker({
  value,
  areas,
  onPick,
  onDismiss,
}: {
  value: string
  areas: string[]
  onPick: (v: string) => void
  onDismiss: () => void
}) {
  const [query, setQuery] = useState('')
  const [locating, setLocating] = useState(false)
  const matches = areas.filter((a) => a.toLowerCase().includes(query.trim().toLowerCase()))

  const useCurrent = () => {
    setLocating(true)
    window.setTimeout(() => {
      setLocating(false)
      onPick('Current location · Florentin')
      onDismiss()
    }, 700)
  }

  return (
    <Sheet onDismiss={onDismiss}>
      <div className="stack" style={{ gap: 4, paddingBottom: 12 }}>
        <span className="t-heading-18">Where does the walk start?</span>
        <span className="t-body-12 muted">The walker comes to you.</span>
      </div>

      <div className="map" aria-label="map">
        <span className="map__pin" />
      </div>

      <button className="locate" onClick={useCurrent} disabled={locating}>
        <span className="locate__dot" data-busy={locating || undefined} />
        <span className="stack grow" style={{ gap: 1, textAlign: 'left' }}>
          <span className="t-title-13">
            {locating ? 'Finding you…' : 'Use my current location'}
          </span>
          <span className="t-body-11 muted">{locating ? 'One moment' : 'Florentin, Tel Aviv'}</span>
        </span>
      </button>

      <input
        className="t-body-13 search"
        value={query}
        placeholder="Or search a street or neighbourhood"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="stack" style={{ gap: 6, maxHeight: 148, overflowY: 'auto' }}>
        {matches.length === 0 ? (
          <span className="t-body-12 muted" style={{ padding: '10px 2px' }}>
            Nothing here matches “{query.trim()}”.
          </span>
        ) : null}
        {matches.map((a) => (
          <button
            key={a}
            className="option"
            aria-pressed={a === value}
            onClick={() => {
              onPick(a)
              onDismiss()
            }}
          >
            <span className="option__label t-title-14 grow">{a}</span>
            <span className="option__mark">
              {a === value ? <span className="t-title-12">✓</span> : null}
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}

function Wheel({
  items,
  value,
  onPick,
  label,
}: {
  items: string[]
  value: string
  onPick: (v: string) => void
  label: string
}) {
  // open on the current value rather than at the top, the way a native wheel does
  const scrollToSelected = (node: HTMLDivElement | null) => {
    if (!node) return
    const selected = node.querySelector('[aria-pressed="true"]') as HTMLElement | null
    if (selected) node.scrollTop = selected.offsetTop - node.clientHeight / 2 + selected.clientHeight / 2
  }
  return (
    <div className="stack grow" style={{ gap: 6 }}>
      <span className="t-eyebrow-11 muted">{label}</span>
      <div
        className="stack"
        ref={scrollToSelected}
        style={{
          gap: 4,
          height: 196,
          overflowY: 'auto',
          padding: 6,
          borderRadius: 12,
          border: '1px solid var(--neutral-300)',
          background: 'var(--neutral-0)',
        }}
      >
        {items.map((i) => (
          <button
            key={i}
            aria-pressed={i === value}
            onClick={() => onPick(i)}
            className={i === value ? 'chip chip--on t-title-13' : 'chip t-label-13'}
            style={{ justifyContent: 'center', borderRadius: 8, padding: '9px 0' }}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  )
}
