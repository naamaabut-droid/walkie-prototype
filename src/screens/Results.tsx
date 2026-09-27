import { Screen } from '../components/Chrome'
import { WalkerCard } from '../components/WalkerCard'
import { REST, TOTAL_NEARBY, WALKERS } from '../data/walkers'
import type { AppState } from '../state'

/** F1-3 · Results. Four ranked, the rest listed — nobody who passes the rules is hidden. */
export function Results({ app }: { app: AppState }) {
  return (
    <Screen tab="Home" app={app}>
      <div className="stack" style={{ gap: 6, padding: '0 20px 10px' }}>
        <h1 className="t-heading-18" style={{ margin: 0 }}>
          Matched for {app.dogName}
        </h1>
        <div className="row" style={{ gap: 10 }}>
          <span className="t-body-12 muted grow">{TOTAL_NEARBY} walkers near you</span>
          <button className="chip t-title-11" onClick={() => app.openSheet('sort')}>
            {app.form.sort} <span className="t-body-11 muted">⌄</span>
          </button>
        </div>
      </div>

      <div className="stack" style={{ gap: 10, padding: '0 20px 20px' }}>
        {WALKERS.map((w) => (
          <WalkerCard
            key={w.id}
            walker={w}
            variant="matched"
            saved={app.saved.includes(w.id)}
            onSave={() => app.toggleSave(w.id)}
            onOpen={() => app.openWalker(w.id)}
          />
        ))}

        <section className="stack" style={{ gap: 10 }}>
          <div className="stack" style={{ gap: 3, paddingTop: 16 }}>
            <h2 className="t-title-16" style={{ margin: 0 }}>
              The other {TOTAL_NEARBY - WALKERS.length} nearby
            </h2>
            <p className="t-body-11 muted" style={{ margin: 0 }}>
              Sorted by fit. Every one of them already passes {app.dogName}’s rules — solo walks, no
              dog parks, his size. The model put four of them first.
            </p>
          </div>

          {REST.map((r) => (
            <div key={r.name} className="card card--lg row" style={{ gap: 11, padding: 12 }}>
              <span
                style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--neutral-200)' }}
              />
              <div className="stack grow" style={{ gap: 3 }}>
                <span className="t-title-13">{r.name}</span>
                <span className="t-body-10 muted">{r.line}</span>
              </div>
              <span className="chip chip--neutral t-label-10" style={{ padding: '3px 8px' }}>
                {r.distance}
              </span>
            </div>
          ))}

          <button
            className="btn btn--secondary t-title-13"
            style={{ borderRadius: 12, padding: '12px 0' }}
            onClick={() => app.outOfScope(`The full list of ${TOTAL_NEARBY}`)}
          >
            See all {TOTAL_NEARBY}
          </button>
        </section>
      </div>
    </Screen>
  )
}
