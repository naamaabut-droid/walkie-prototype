import type { ReactNode } from 'react'
import type { Person } from '../data/community'
import type { Walker } from '../data/walkers'

/** A row that scrolls sideways. The cut-off card at the edge is the affordance. */
export function Scroller({ children }: { children: ReactNode }) {
  return <div className="hscroll">{children}</div>
}

/**
 * The browse card on Home. Nothing is known about the dog yet, so it carries no
 * verdict — a picture, a price, a distance and a rating, and that is all.
 */
export function BrowseCard({
  walker,
  saved,
  onSave,
  onOpen,
}: {
  walker: Walker
  saved: boolean
  onSave: () => void
  onOpen: () => void
}) {
  return (
    <article className="browsecard">
      <button className="browsecard__photo" onClick={onOpen} aria-label={walker.name}>
        <span
          className="browsecard__save"
          role="button"
          aria-pressed={saved}
          aria-label={saved ? 'Saved' : 'Save'}
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
        >
          {saved ? '♥' : '♡'}
        </span>
      </button>
      <button className="browsecard__body stack" onClick={onOpen}>
        <span className="t-title-14">{walker.name}</span>
        <span className="t-body-11 muted">
          ₪{walker.price} · {walker.distance}
        </span>
        <span className="t-title-11 dim">
          ★ {walker.rating} ({walker.reviews})
        </span>
      </button>
    </article>
  )
}

/** A community profile. No rating — and a way to ask, when she is not connected yet. */
export function PersonCard({
  person,
  connected,
  onConnect,
}: {
  person: Person
  connected: boolean
  onConnect?: () => void
}) {
  return (
    <article className="personcard stack" data-connected={connected || undefined}>
      <span className="personcard__photo" />
      <span className="t-title-12">{person.name}</span>
      <span className="t-body-11 muted">{person.meta}</span>
      {connected ? null : (
        <button className="personcard__connect t-title-11" onClick={onConnect}>
          + Connect
        </button>
      )}
    </article>
  )
}
