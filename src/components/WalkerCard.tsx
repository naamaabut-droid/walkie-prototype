import { Avatar, Chip, Vouchers } from './ui'
import type { Walker } from '../data/walkers'

/**
 * One card, two variants. In Figma these were two separate frames that had to be
 * kept in step by hand; here "compact" is the state before the dog profile exists
 * and "matched" is the state after, and they cannot drift apart.
 */
export function WalkerCard({
  walker,
  variant,
  onOpen,
  onSave,
  saved = false,
}: {
  walker: Walker
  variant: 'compact' | 'matched'
  onOpen?: () => void
  onSave?: () => void
  saved?: boolean
}) {
  if (variant === 'compact') {
    return (
      <article className="card card--lg stack" style={{ gap: 9, padding: '12px 13px' }}>
        <header className="row" style={{ gap: 10 }}>
          <Avatar size={36}>
            <span className="t-title-13">{walker.initial}</span>
          </Avatar>
          <div className="stack grow" style={{ gap: 2 }}>
            <span className="t-title-14">{walker.name}</span>
            <span className="t-body-10 muted">{walker.homeMeta}</span>
          </div>
          <div className="stack right" style={{ gap: 0 }}>
            <span className="t-heading-14">₪{walker.price}</span>
            <span className="t-body-10 muted">per walk</span>
          </div>
        </header>

        <div className="chiprow">
          {walker.homeChips.map((c) => (
            <Chip key={c.label} tone={c.tone} size={10}>
              {c.label}
            </Chip>
          ))}
        </div>

        {walker.vouch ? (
          <div className="row" style={{ gap: 8 }}>
            <Vouchers initials={walker.vouch.initials} />
            <span className="t-body-10 dim">{walker.vouch.line.split(' · ')[0]}</span>
          </div>
        ) : null}

        <Actions onOpen={onOpen} onSave={onSave} saved={saved} label="Contact" />
      </article>
    )
  }

  return (
    <article
      className="card stack"
      style={{ gap: 10, borderColor: walker.matched ? 'var(--green-600)' : 'var(--neutral-300)' }}
    >
      {walker.matched ? (
        <div className="row">
          <Chip tone="ai" size={10}>
            <span>✦</span>
            <span>MATCHED FOR LOUIE</span>
          </Chip>
        </div>
      ) : null}

      <header className="row" style={{ gap: 11 }}>
        <Avatar size={44} square background="var(--neutral-100)">
          <span className="t-label-11 muted">ph</span>
        </Avatar>
        <div className="stack grow" style={{ gap: 2 }}>
          <span className="t-title-14">{walker.name}</span>
          <span className="row" style={{ gap: 4 }}>
            <span className="t-label-11 dim">★</span>
            <span className="t-title-11">{walker.rating}</span>
            <span className="t-body-11 muted">({walker.reviews})</span>
          </span>
          <span className="t-body-12 muted">{walker.when}</span>
        </div>
        <span className="t-title-14">₪{walker.price}</span>
      </header>

      <div className="chiprow">
        {walker.facts.map((f) => (
          <Chip key={f} tone="fact">
            {f}
          </Chip>
        ))}
      </div>

      <div
        className="stack"
        style={{ gap: 6, background: 'var(--neutral-100)', borderRadius: 10, padding: '9px 10px' }}
      >
        <span className="t-body-11 dim">{walker.reason}</span>
        <div className="chiprow">
          {walker.matchTags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      {walker.vouch ? (
        <div className="row" style={{ gap: 8, paddingTop: 8 }}>
          <Vouchers initials={walker.vouch.initials} />
          <span className="t-body-10 dim grow">{walker.vouch.line}</span>
        </div>
      ) : null}

      <Actions onOpen={onOpen} onSave={onSave} saved={saved} label="Contact" pad />
    </article>
  )
}

function Actions({
  onOpen,
  onSave,
  saved,
  label,
  pad = false,
}: {
  onOpen?: () => void
  onSave?: () => void
  saved?: boolean
  label: string
  pad?: boolean
}) {
  return (
    <div className="row" style={{ gap: 8, paddingTop: pad ? 9 : 0 }}>
      <button
        className="btn btn--primary btn--pill t-title-12 grow"
        style={{ width: 'auto' }}
        onClick={onOpen}
      >
        {label}
      </button>
      <button
        className="btn btn--secondary btn--pill t-body-13"
        style={{ width: 42, minWidth: 42, height: 38, padding: 0 }}
        aria-pressed={saved}
        aria-label={saved ? 'Saved' : 'Save'}
        onClick={onSave}
      >
        {saved ? '♥' : '♡'}
      </button>
    </div>
  )
}
