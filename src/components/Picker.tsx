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
