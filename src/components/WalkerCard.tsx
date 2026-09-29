import { Avatar, Chip, Vouchers } from './ui'
import type { Walker } from '../data/walkers'

/**
 * One card body, three uses. Home, the unfiltered results and the filtered results
 * all draw the same card; matching only adds two things on top — the badge and the
 * reason. The actions are identical everywhere, whatever the walker's state.
 */
export function WalkerCard({
  walker,
  variant,
  onOpen,
  onSave,
  saved = false,
}: {
  walker: Walker
  variant: 'compact' | 'listed' | 'matched'
  onOpen?: () => void
  onSave?: () => void
  saved?: boolean
}) {
  // only the filtered results may claim a match, and only for a walker who is one
  const matched = variant === 'matched' && walker.matched
  const chips =
    variant === 'compact'
      ? walker.homeChips
      : variant === 'matched'
        ? walker.facts ?? walker.listFacts
        : walker.listFacts
  const vouch = variant === 'matched' ? walker.vouch : walker.listVouch ?? walker.vouch

  return (
    <article
      className="card card--lg stack"
      style={{
        gap: 9,
        padding: '12px 13px',
        borderColor: matched ? 'var(--green-600)' : 'var(--neutral-300)',
      }}
    >
      {matched ? (
        <div className="row">
          <Chip tone="ai" size={10}>
            <span>✦</span>
            <span>MATCHED FOR LOUIE</span>
          </Chip>
        </div>
      ) : null}

      <header className="row" style={{ gap: 10 }}>
        <Avatar size={36}>
          <span className="t-title-14">{walker.initial}</span>
        </Avatar>
        <div className="stack grow" style={{ gap: 2 }}>
          <span className="t-title-14">{walker.name}</span>
          <span className="t-body-11 muted">{walker.homeMeta}</span>
        </div>
        <div className="stack right" style={{ gap: 0 }}>
          <span className="t-heading-14">₪{walker.price}</span>
          <span className="t-body-11 muted">per walk</span>
        </div>
      </header>

      <div className="chiprow">
        {chips.map((c) =>
          typeof c === 'string' ? (
            <Chip key={c} tone="fact" size={10}>
              {c}
            </Chip>
          ) : (
            <Chip key={c.label} tone={c.tone} size={10}>
              {c.label}
            </Chip>
          ),
        )}
      </div>

      {matched ? (
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
      ) : null}

      {vouch ? (
        <div className="row" style={{ gap: 8 }}>
          <Vouchers initials={vouch.initials} />
          <span className="t-body-11 dim">{vouch.line}</span>
        </div>
      ) : null}

      <div className="row" style={{ gap: 8, paddingTop: 2 }}>
        <button
          className="btn btn--primary btn--pill t-title-12 grow"
          style={{ width: 'auto' }}
          onClick={onOpen}
        >
          Contact
        </button>
        <button
          className="btn btn--secondary btn--pill t-body-14"
          style={{ width: 42, minWidth: 42, height: 38, padding: 0 }}
          aria-pressed={saved}
          aria-label={saved ? 'Saved' : 'Save'}
          onClick={onSave}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}
