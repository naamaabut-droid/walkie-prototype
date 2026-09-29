import { useState } from 'react'
import { Screen } from '../components/Chrome'
import { Field, Segmented } from '../components/ui'
import { PinIcon } from '../components/Picker'
import { BrowseCard, PersonCard, Scroller } from '../components/Browse'
import { KNOWN, SUGGESTED } from '../data/community'
import { WALKERS } from '../data/walkers'
import type { AppState } from '../state'

/** F1-1 · Home — search. Nothing is known about the dog yet, so nothing is matched. */
export function Home({ app }: { app: AppState }) {
  const [mode, setMode] = useState('Schedule')

  return (
    <Screen tab="Home" app={app}>
      <div className="appbar">
        <span className="appbar__title t-heading-20 grow">Walkie</span>
        <div className="row" style={{ gap: 8 }}>
          <button className="t-label-13 muted" onClick={() => app.outOfScope('Inbox')}>
            ✉
          </button>
          {/* the profile lives in the header now, not in the tab bar */}
          <button
            className="appbar__avatar t-title-11"
            aria-label="Profile"
            onClick={() => app.outOfScope('Profile')}
          >
            D
          </button>
        </div>
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
            label={app.dogComplete ? 'For' : 'For*'}
            value={app.dogComplete ? app.dogName : ''}
            placeholder="Add Dog Details"
            onClick={() => (app.dogs.length > 0 ? app.openSheet('dog') : app.openWizard())}
          />
          <Field
            label="Pickup Address"
            value={app.addressShort}
            placeholder="Add Address"
            icon={app.addressShort ? <PinIcon /> : undefined}
            tag={app.addressShort && app.addressIsDefault ? 'DEFAULT' : undefined}
            onClick={() => app.openSheet('near')}
          />
          <Field
            label="When"
            value={mode === 'Now' ? 'As soon as possible' : app.whenLabel}
            placeholder="Select date and time"
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
          <span className="t-title-14" style={{ paddingTop: 5 }}>
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
        <p className="t-body-11 muted" style={{ margin: 0 }}>
          {app.dogComplete
            ? `Sorted by best match for ${app.dogName}.`
            : 'Sorted by distance. Tell us about your dog to see matches.'}
        </p>
      </section>

      {/* Nothing is matched here, so the card stays small and the row scrolls sideways. */}
      <Scroller>
        {WALKERS.map((w) => (
          <BrowseCard
            key={w.id}
            walker={w}
            saved={app.saved.includes(w.id)}
            onSave={() => app.toggleSave(w.id)}
            onOpen={() => app.openWalker(w.id)}
          />
        ))}
      </Scroller>

      <section className="stack" style={{ gap: 9, padding: '18px 0 4px' }}>
        <div className="row between" style={{ padding: '0 20px' }}>
          <h2 className="t-heading-16" style={{ margin: 0 }}>
            Community
          </h2>
          <button className="t-title-12 muted" onClick={() => app.outOfScope('Community')}>
            See all ›
          </button>
        </div>

        <span className="t-title-12 dim" style={{ padding: '6px 20px 0' }}>
          People you know
        </span>
        <Scroller>
          {KNOWN.map((p) => (
            <PersonCard key={p.id} person={p} connected />
          ))}
        </Scroller>

        <span className="t-title-12 dim" style={{ padding: '6px 20px 0' }}>
          Add to your community
        </span>
        <Scroller>
          {SUGGESTED.map((p) => (
            <PersonCard
              key={p.id}
              person={p}
              connected={app.connections.includes(p.id)}
              onConnect={() => app.connect(p.id)}
            />
          ))}
        </Scroller>
      </section>

      <div style={{ height: 20 }} />
    </Screen>
  )
}
