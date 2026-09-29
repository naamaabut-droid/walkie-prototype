import { Screen } from '../components/Chrome'
import { WalkerCard } from '../components/WalkerCard'
import { MATCHED, MATCHED_COUNT, NEARBY, NEARBY_COUNT, REST } from '../data/walkers'
import type { AppState } from '../state'

/**
 * F1-3a / F1-3b · Results, in two states.
 *
 * Before filtering it lists everyone nearby, including walkers whose own rules
 * exclude this dog — matching is something the user asks for, not something that
 * has already happened to her. After filtering it is the matched list, with the
 * reason written beside each walker. The card and its actions are the same in
 * both; only what the card is allowed to claim changes.
 */
export function Results({ app, filtered }: { app: AppState; filtered: boolean }) {
  const walkers = filtered ? MATCHED : NEARBY
  const count = filtered ? MATCHED_COUNT : NEARBY_COUNT
  const rest = count - walkers.length

  return (
    <Screen tab="Home" app={app}>
      <div className="stack" style={{ gap: 6, padding: '0 20px 10px' }}>
        {/* Without this the search is one-way: nothing else on the screen returns home. */}
        <button
          className="t-heading-20"
          style={{ margin: 0, textAlign: 'left' }}
          onClick={() => (filtered ? app.go('results') : app.go('home'))}
        >
          ‹&nbsp;&nbsp;Results
        </button>
        <div className="row" style={{ gap: 10 }}>
          <span className="t-body-12 muted grow">{count} walkers near you</span>
          <button className="chip t-title-11" onClick={() => app.openSheet('sort')}>
            {filtered ? app.form.sort : 'Nearest'} <span className="t-body-11 muted">⌄</span>
          </button>
          <button className="chip t-title-11" onClick={() => app.go('filters')}>
            ⚙ Filters
          </button>
        </div>
      </div>

      <div className="stack" style={{ gap: 10, padding: '0 20px 20px' }}>
        {walkers.map((w) => (
          <WalkerCard
            key={w.id}
            walker={w}
            variant={filtered ? 'matched' : 'listed'}
            saved={app.saved.includes(w.id)}
            onSave={() => app.toggleSave(w.id)}
            onOpen={() => app.openWalker(w.id)}
          />
        ))}

        <section className="stack" style={{ gap: 10 }}>
          <div className="stack" style={{ gap: 3, paddingTop: 16 }}>
            <h2 className="t-title-16" style={{ margin: 0 }}>
              The other {rest} nearby
            </h2>
            <p className="t-body-11 muted" style={{ margin: 0 }}>
              {filtered
                ? `Sorted by fit. Every one of them already passes ${app.dogName}’s rules — small, calm groups only, no dog parks, his size. The model put four of them first.`
                : `Everyone within 3 km, nearest first. Filters narrow this to the walkers who fit ${app.dogName}.`}
            </p>
          </div>

          {REST.map((r) => (
            <div key={r.name} className="card card--lg row" style={{ gap: 11, padding: 12 }}>
              <span
                style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--neutral-200)' }}
              />
              <div className="stack grow" style={{ gap: 3 }}>
                <span className="t-title-14">{r.name}</span>
                <span className="t-body-11 muted">{r.line}</span>
              </div>
              <span className="chip chip--neutral t-label-11" style={{ padding: '3px 8px' }}>
                {r.distance}
              </span>
            </div>
          ))}

          <button
            className="btn btn--secondary t-title-14"
            style={{ borderRadius: 12, padding: '12px 0' }}
            onClick={() => app.outOfScope(`The full list of ${count}`)}
          >
            See all {count}
          </button>
        </section>
      </div>
    </Screen>
  )
}
