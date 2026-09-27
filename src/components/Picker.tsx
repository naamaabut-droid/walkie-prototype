import { useState } from 'react'
import { Sheet } from './Sheet'
import type { Address, Suggestion } from '../state'
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
            {o === value ? <span className="t-title-14">✓</span> : null}
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
 * The address. Typing drives an autocomplete whose first row is always the
 * device's own location, and the structured fields underneath are what a walker
 * actually needs to find a door: city, street, number, apartment, floor.
 */
export function AddressSheet({
  title,
  address,
  suggestions,
  onChange,
  onDismiss,
}: {
  title: string
  address: Address
  suggestions: Suggestion[]
  onChange: (next: Address) => void
  onDismiss: () => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [locating, setLocating] = useState(false)

  const q = query.trim().toLowerCase()
  const matches = q
    ? suggestions.filter((s) => (s.street + ' ' + s.area).toLowerCase().includes(q))
    : suggestions.slice(0, 4)

  const set = (patch: Partial<Address>) => onChange({ ...address, ...patch })

  const useCurrent = () => {
    setLocating(true)
    window.setTimeout(() => {
      setLocating(false)
      set({ city: 'Tel Aviv', area: 'Florentin', street: 'Vital', number: '12' })
      setQuery('')
      setOpen(false)
    }, 700)
  }

  return (
    <Sheet onDismiss={onDismiss}>
      <div className="stack" style={{ gap: 4, paddingBottom: 12 }}>
        <span className="t-heading-18">{title}</span>
        <span className="t-body-12 muted">The walker comes to your door.</span>
      </div>

      <div className="combo">
        <span className="combo__icon">
          <PinIcon />
        </span>
        <input
          className="t-body-13 combo__input"
          value={query}
          placeholder="Start typing a street"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
        />
        {open ? (
          <button className="combo__close t-label-11 muted" onClick={() => setOpen(false)}>
            Close
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="suggest">
          <button className="suggest__row suggest__row--first" onClick={useCurrent} disabled={locating}>
            <span className="suggest__icon" data-busy={locating || undefined}>
              <CrosshairIcon />
            </span>
            <span className="stack" style={{ gap: 1, textAlign: 'left' }}>
              <span className="t-title-13">
                {locating ? 'Finding you…' : 'Use my current location'}
              </span>
              <span className="t-body-11 muted">
                {locating ? 'One moment' : 'Florentin, Tel Aviv'}
              </span>
            </span>
          </button>

          {matches.map((m) => (
            <button
              key={m.street + m.area}
              className="suggest__row"
              onClick={() => {
                set({ city: m.city, area: m.area, street: m.street })
                setQuery('')
                setOpen(false)
              }}
            >
              <span className="suggest__icon">
                <PinIcon />
              </span>
              <span className="stack" style={{ gap: 1, textAlign: 'left' }}>
                <span className="t-title-13">{m.street}</span>
                <span className="t-body-11 muted">
                  {m.area}, {m.city}
                </span>
              </span>
            </button>
          ))}

          {matches.length === 0 ? (
            <span className="t-body-12 muted" style={{ padding: '12px 14px', display: 'block' }}>
              No street here matches “{query.trim()}”. Fill it in below.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="formgrid">
        <Input label="City" value={address.city} onChange={(v) => set({ city: v })} span={3} />
        <Input
          label="Neighbourhood"
          value={address.area}
          onChange={(v) => set({ area: v })}
          span={3}
        />
        <Input label="Street" value={address.street} onChange={(v) => set({ street: v })} span={2} />
        <Input label="No." value={address.number} onChange={(v) => set({ number: v })} span={1} />
        <Input label="Apartment" value={address.apt} onChange={(v) => set({ apt: v })} span={1} />
        <Input label="Floor" value={address.floor} onChange={(v) => set({ floor: v })} span={1} />
        <Input
          label="Code"
          value={address.entry}
          onChange={(v) => set({ entry: v })}
          span={1}
          optional
        />
      </div>

      <div style={{ paddingTop: 14 }}>
        <Button onClick={onDismiss}>Save address</Button>
      </div>
    </Sheet>
  )
}

function Input({
  label,
  value,
  onChange,
  span,
  optional = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  span: 1 | 2 | 3
  optional?: boolean
}) {
  return (
    <label className="stack field-block" style={{ gap: 5, gridColumn: `span ${span}` }}>
      <span className="t-eyebrow-11 muted">
        {label.toUpperCase()}
        {optional ? ' · OPTIONAL' : ''}
      </span>
      <input className="t-body-13 search" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

export function PinIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <path
        d="M7 15s5.5-5.05 5.5-8.5A5.5 5.5 0 0 0 1.5 6.5C1.5 9.95 7 15 7 15Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="6.4" r="1.9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function CrosshairIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M8 0v2.2M8 13.8V16M0 8h2.2M13.8 8H16" stroke="currentColor" strokeWidth="1.4" />
    </svg>
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
