import { useState } from 'react'
import { Screen } from '../components/Chrome'
import { Field, Segmented } from '../components/ui'
import { PinIcon } from '../components/Picker'
import { WalkerCard } from '../components/WalkerCard'
import { WALKERS } from '../data/walkers'
import type { AppState } from '../state'

/** F1-1 · Home — search. Nothing is known about the dog yet, so nothing is matched. */
export function Home({ app }: { app: AppState }) {
  const [mode, setMode] = useState('Schedule')

  return (
    <Screen tab="Home" app={app}>
      <div className="appbar">
        <span className="appbar__title t-heading-18 grow">Walkie</span>
        <button
          className="appbar__side appbar__side--right t-label-12"
          onClick={() => app.outOfScope('Inbox')}
        >
          ✉ ◍
        </button>
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <h1 className="t-heading-24" style={{ margin: 0 }}>
          Need a walk today?
        </h1>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div className="card card--lg stack" style={{ gap: 9 }}>
          <Segmented options={['Now', 'Schedule']} value={mode} onChange={setMode} />
          <Field
            label="For"
            value={app.dogComplete ? app.dogName : 'Add Dog Details'}
            onClick={() => (app.dogs.length > 0 ? app.openSheet('dog') : app.openWizard())}
          />
          <Field
            label="Pickup Address"
            value={app.addressShort || 'Add Address'}
            icon={app.addressShort ? <PinIcon /> : undefined}
            tag={app.addressShort && app.addressIsDefault ? 'DEFAULT' : undefined}
            onClick={() => app.openSheet('near')}
          />
          <Field
            label="When"
            value={mode === 'Now' ? 'As soon as possible' : app.whenLabel}
            onClick={() => (mode === 'Now' ? app.outOfScope('Now mode') : app.openSheet('when'))}
          />
          <Field label="Walk length" value={app.form.length} onClick={() => app.openSheet('length')} />
          <button
            className="btn btn--primary t-title-14"
            style={{ borderRadius: 10, padding: '14px 0' }}
            onClick={() => (app.dogComplete ? app.go('results') : app.openWizard())}
          >
            🔍&nbsp;&nbsp;Find a walker
          </button>
        </div>
      </div>

      <section className="stack" style={{ gap: 9, padding: '0 18px 20px' }}>
        <div className="row between">
          <h2 className="t-heading-16" style={{ margin: 0 }}>
            Scheduled
          </h2>
          <button className="t-title-12 muted" onClick={() => app.outOfScope('Scheduled')}>
            See all ›
          </button>
        </div>
        <div
          className="stack"
          style={{
            gap: 5,
            alignItems: 'center',
            padding: '20px 18px',
            border: '1px solid var(--neutral-300)',
            borderRadius: 14,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--neutral-100)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--neutral-500)',
            }}
          >
            ▤
          </div>
          <span className="t-title-13" style={{ paddingTop: 5 }}>
            Nothing scheduled yet
          </span>
          <span className="t-body-11 muted">Walks you book appear here.</span>
        </div>
      </section>

      <section className="stack" style={{ gap: 8, padding: '0 20px 10px' }}>
        <div className="row between">
          <h2 className="t-heading-16" style={{ margin: 0 }}>
            Explore walkers near you
          </h2>
          <button className="chip t-label-11" onClick={() => app.go('filters')}>
            ⚙ Filters
          </button>
        </div>
        <p className="t-body-10 muted" style={{ margin: 0 }}>
          Sorted by distance. Tell us about your dog to see matches.
        </p>
      </section>

      <div className="stack" style={{ gap: 9, padding: '0 20px 20px' }}>
        {WALKERS.map((w) => (
          <WalkerCard
            key={w.id}
            walker={w}
            variant="compact"
            saved={app.saved.includes(w.id)}
            onSave={() => app.toggleSave(w.id)}
            onOpen={() => app.openWalker(w.id)}
          />
        ))}
      </div>
    </Screen>
  )
}
