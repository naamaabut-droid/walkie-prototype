import { Sheet } from './Sheet'
import type { Address } from '../state'
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
        <span className="t-heading-20">{title}</span>
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
        <span className="t-heading-20">When does {dogName} need a walk?</span>
        <span className="t-body-12 muted">Pick a day and a time.</span>
      </div>

      <div className="row" style={{ gap: 10, alignItems: 'stretch' }}>
        <Wheel items={days} value={day} onPick={(d) => onChange(d, time)} label="DAY" />
        <Wheel items={times} value={time} onPick={(t) => onChange(day, t)} label="TIME" />
      </div>

      <div style={{ paddingTop: 14 }}>
        <Button onClick={onDismiss}>
          Confirm
        </Button>
      </div>
    </Sheet>
  )
}

/**
 * The address, the way an online delivery form asks for it: every field a walker
 * needs to reach a door, each with an example in it while it is empty. No
 * autocomplete — a suggestion list over a handful of invented streets would be
 * a decoration, not a service.
 */
export function AddressSheet({
  title,
  address,
  isDefault,
  onChange,
  onDefaultChange,
  onDismiss,
}: {
  title: string
  address: Address
  isDefault: boolean
  onChange: (next: Address) => void
  onDefaultChange: (v: boolean) => void
  onDismiss: () => void
}) {
  const set = (patch: Partial<Address>) => onChange({ ...address, ...patch })

  return (
    <Sheet onDismiss={onDismiss}>
      <div className="stack" style={{ gap: 4, paddingBottom: 12 }}>
        <span className="t-heading-20">{title}</span>
        <span className="t-body-12 muted">The walker comes to your door.</span>
      </div>

      <div className="formgrid">
        <Input label="City" value={address.city} onChange={(v) => set({ city: v })} span={2} required placeholder="Tel Aviv" />
        <Input label="Postcode" value={address.postcode} onChange={(v) => set({ postcode: v })} span={1} placeholder="6608315" />
        <Input label="Neighbourhood" value={address.area} onChange={(v) => set({ area: v })} span={3} required placeholder="Florentin" />
        <Input label="Street" value={address.street} onChange={(v) => set({ street: v })} span={2} required placeholder="Vital" />
        <Input label="No." value={address.number} onChange={(v) => set({ number: v })} span={1} required placeholder="12" />
        <Input label="Entrance" value={address.entrance} onChange={(v) => set({ entrance: v })} span={1} placeholder="B" />
        <Input label="Apartment" value={address.apt} onChange={(v) => set({ apt: v })} span={1} placeholder="4" />
        <Input label="Floor" value={address.floor} onChange={(v) => set({ floor: v })} span={1} placeholder="2" />
        <Input label="Entry code" value={address.entry} onChange={(v) => set({ entry: v })} span={1} placeholder="1234" />
        <Input
          label="Directions"
          value={address.directions}
          onChange={(v) => set({ directions: v })}
          span={2}
          placeholder="The gate sticks — lift it"
        />
      </div>

      <button
        className="switchrow"
        role="switch"
        aria-checked={isDefault}
        onClick={() => onDefaultChange(!isDefault)}
      >
        <span className="stack grow" style={{ gap: 2, textAlign: 'left' }}>
          <span className="t-title-14">Save as my default address</span>
          <span className="t-body-11 muted">Filled in for you on every walk from now on.</span>
        </span>
        <span className="switch" data-on={isDefault || undefined}>
          <span className="switch__knob" />
        </span>
      </button>

      <div style={{ paddingTop: 14 }}>
        <Button onClick={onDismiss}>Save Address</Button>
      </div>
    </Sheet>
  )
}

function Input({
  label,
  value,
  onChange,
  span,
  required = false,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  span: 1 | 2 | 3
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="stack field-block" style={{ gap: 5, gridColumn: `span ${span}` }}>
      <span className="t-eyebrow-11 muted">
        {label.toUpperCase()}
        {required ? <span className="req"> *</span> : null}
      </span>
      <input
        className="t-body-14 search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
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
            className={i === value ? 'chip chip--on t-title-14' : 'chip t-label-13'}
            style={{ justifyContent: 'center', borderRadius: 8, padding: '9px 0' }}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  )
}
