import type { ReactNode } from 'react'

export function Button({
  children,
  variant = 'primary',
  onClick,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  onClick?: () => void
}) {
  const type = variant === 'primary' ? 't-title-14' : variant === 'secondary' ? 't-title-14' : 't-title-13'
  return (
    <button className={`btn btn--${variant} ${type}`} onClick={onClick}>
      {children}
    </button>
  )
}

export type ChipTone = 'default' | 'on' | 'fact' | 'notice' | 'fit' | 'neutral' | 'ai'

export function Chip({
  children,
  tone = 'default',
  size = 11,
  onClick,
}: {
  children: ReactNode
  tone?: ChipTone
  size?: 10 | 11
  onClick?: () => void
}) {
  const cls = tone === 'default' ? 'chip' : `chip chip--${tone}`
  const type = tone === 'on' ? `t-title-${size}` : size === 10 ? 't-title-10' : 't-label-11'
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag className={`${cls} ${type}`} onClick={onClick}>
      {children}
    </Tag>
  )
}

/** A chip group where one value is selected — the filter pattern. */
export function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="chiprow">
      {options.map((o) => (
        <Chip key={o} tone={o === value ? 'on' : 'default'} onClick={() => onChange(o)}>
          {o}
        </Chip>
      ))}
    </div>
  )
}

export function Field({
  label,
  value,
  icon,
  onClick,
}: {
  label: string
  value: string
  /** sits with the value, so the field says what kind of value it holds */
  icon?: ReactNode
  onClick?: () => void
}) {
  const inner = (
    <>
      <span className="field__label t-title-13">{label}</span>
      <span className="field__value t-body-13 row" style={{ gap: 7 }}>
        {icon ? <span className="field__icon">{icon}</span> : null}
        {value}
      </span>
    </>
  )
  if (!onClick) return <div className="field">{inner}</div>
  return (
    <button className="field" style={{ width: '100%' }} onClick={onClick}>
      {inner}
    </button>
  )
}

/** A field you can type into. The label stays, the value is the input. */
export function EditableField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="field">
      <span className="field__label t-title-13">{label}</span>
      <input
        className="field__value t-body-13"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 0,
          outline: 'none',
          background: 'transparent',
          textAlign: 'right',
          flex: 1,
          minWidth: 0,
          padding: 0,
        }}
      />
    </label>
  )
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button key={o} aria-pressed={o === value} className="t-title-13" onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function OptionRow({
  label,
  sub,
  selected,
  multi = false,
  onClick,
}: {
  label: string
  sub?: string
  selected: boolean
  multi?: boolean
  onClick: () => void
}) {
  return (
    <button className="option" aria-pressed={selected} onClick={onClick}>
      <span className="stack grow" style={{ gap: 1 }}>
        <span className="option__label t-title-14">{label}</span>
        {sub ? <span className="option__sub t-body-12">{sub}</span> : null}
      </span>
      <span className={'option__mark' + (multi ? ' option__mark--box' : '')}>
        {selected ? <span className="t-title-12">✓</span> : null}
      </span>
    </button>
  )
}

export function Avatar({
  children,
  size = 36,
  square = false,
  background,
}: {
  children?: ReactNode
  size?: number
  square?: boolean
  background?: string
}) {
  return (
    <span
      className={'avatar' + (square ? ' avatar--square' : '')}
      style={{ width: size, height: size, background }}
    >
      {children}
    </span>
  )
}

const VOUCH_COLORS = ['#8b867e', '#6e7e6a', '#a09485']

export function Vouchers({ initials }: { initials: string[] }) {
  return (
    <span className="vouchers">
      {initials.map((i, n) => (
        <span key={i + n} className="voucher t-title-10" style={{ background: VOUCH_COLORS[n % 3] }}>
          {i}
        </span>
      ))}
    </span>
  )
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <div className="progress__fill" style={{ width: `${Math.round(value * 100)}%`, transition: 'width 260ms ease' }} />
    </div>
  )
}
