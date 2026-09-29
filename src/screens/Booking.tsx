import { Screen } from '../components/Chrome'
import { Button, Field, Segmented } from '../components/ui'
import { PinIcon } from '../components/Picker'
import type { AppState } from '../state'

/** F1-6 · Book. Payment is not here on purpose — it is set once, in settings. */
export function BookWalker({ app }: { app: AppState }) {
  const w = app.walker
  return (
    <Screen
      footer={
        <div style={{ padding: '12px 20px 24px' }}>
          {/* Day and time is required; the frame draws no enabled button without it. */}
          <Button disabled={!app.whenLabel} onClick={() => app.go('sent')}>
            Send Request
          </Button>
        </div>
      }
    >
      <header className="appbar">
        <button
          className="appbar__title t-heading-20 grow"
          style={{ textAlign: 'left' }}
          onClick={() => app.back()}
        >
          ‹
        </button>
      </header>

      <div className="stack" style={{ gap: 16, padding: '4px 20px 0' }}>
        <div className="card card--flat row" style={{ gap: 11, padding: '12px 14px' }}>
          <span style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--neutral-200)' }} />
          <div className="stack grow" style={{ gap: 2 }}>
            <span className="t-title-14">
              {w.name}
              {app.whenLabel ? ` · ₪${w.price}` : ''}
            </span>
            <span className="t-body-11 muted">
              Walks solo · quiet routes · takes dogs {app.dogName}’s size
            </span>
          </div>
          <button className="t-title-11 muted" onClick={() => app.go('results')}>
            Change&nbsp;&nbsp;›
          </button>
        </div>

        <Labelled label="Pickup address">
          <Field
            label=""
            value={app.addressShort}
            placeholder="Add Address"
            icon={<PinIcon />}
            onClick={() => app.openSheet('address')}
          />
        </Labelled>
        <Labelled label="Day and time">
          <Field
            label=""
            value={app.whenLabel}
            placeholder="Select date and time"
            onClick={() => app.openSheet('when')}
          />
        </Labelled>
        <Labelled label="Walk length">
          <Field label="" value={app.form.length} onClick={() => app.openSheet('length')} />
        </Labelled>

        <div className="stack" style={{ gap: 6 }}>
          <span className="t-title-12 dim">How often</span>
          <Segmented
            options={['Just this once', 'Weekly']}
            value={app.frequency}
            onChange={app.setFrequency}
          />
        </div>
      </div>
    </Screen>
  )
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      <span className="t-title-12 dim">{label}</span>
      {children}
    </div>
  )
}

/** F1-7 / F1-8 · Request sent. One screen; the sheet on top is the only difference. */
export function RequestSent({ app }: { app: AppState }) {
  const w = app.walker
  const first = w.name.split(' ')[0]
  return (
    <Screen tab={app.route === 'waiting' ? 'Scheduled' : null} app={app}>
      <header className="appbar">
        <span className="grow" />
        <button className="t-heading-20" onClick={() => app.go('home')}>
          X
        </button>
      </header>

      <div className="stack" style={{ gap: 12, padding: '8px 20px 0' }}>
        <div
          className="stack"
          style={{
            gap: 8,
            padding: 14,
            borderRadius: 12,
            background: 'var(--green-50)',
            alignItems: 'stretch',
          }}
        >
          <span className="t-heading-24 center" style={{ color: 'var(--green-600)' }}>
            ✓
          </span>
          <span className="t-heading-20 center">Request sent to {first}</span>
          <span className="t-body-14 center" style={{ color: 'var(--green-600)' }}>
            Usually replies in about 20 minutes.
          </span>
        </div>

        <div className="card stack" style={{ gap: 7 }}>
          <span className="t-title-12">What you asked for</span>
          <Row label="Dog" value={`${app.dogName} · ${app.dogSize}`} />
          <Row
            label="When"
            value={`${app.whenLabel} · ${app.form.length} · ${
              app.frequency === 'Weekly' ? 'weekly' : 'one-off'
            }`}
          />
          <Row label="Price" value={`₪${w.price} · only if she accepts`} />
        </div>

        <button
          className="card row between"
          style={{ padding: 14, width: '100%' }}
          onClick={() => app.outOfScope('Messages')}
        >
          <span className="t-body-12 muted">Message {first}</span>
          <span className="t-label-13">›</span>
        </button>
      </div>

      {app.route === 'sent' ? (
        <div style={{ padding: '12px 20px 24px', marginTop: 'auto' }}>
          <button
            className="btn btn--primary t-title-14"
            style={{ padding: '14px 0' }}
            onClick={() => app.go('waiting')}
          >
            Done
          </button>
        </div>
      ) : null}
    </Screen>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row between" style={{ gap: 10 }}>
      <span className="t-body-12 muted">{label}</span>
      <span className="t-label-13">{value}</span>
    </div>
  )
}

/** F1-9 · Push — the accepted notification on the lock screen. */
export function PushAccepted({ app }: { app: AppState }) {
  const first = app.walker.name.split(' ')[0]
  return (
    <div className="screen lockscreen" onClick={() => app.go('home')}>
      <div className="statusbar statusbar--dark">
        <span className="t-title-12">9:41</span>
        <span className="t-body-11">▮▮&nbsp;&nbsp;ᯤ&nbsp;&nbsp;▰</span>
      </div>
      <div className="stack" style={{ alignItems: 'center', padding: '16px 0 24px' }}>
        <span className="t-label-13" style={{ color: 'var(--neutral-0)' }}>
          Thursday 26 September
        </span>
        <span className="t-display-62" style={{ color: 'var(--neutral-0)' }}>
          16:12
        </span>
      </div>
      <div className="push stack" style={{ gap: 5 }}>
        <div className="row" style={{ gap: 7 }}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: 'var(--neutral-200)' }} />
          <span className="t-title-11 muted grow">WALKIE</span>
          <span className="t-body-11 muted">now</span>
        </div>
        <span className="t-title-14">{first} accepted your walk</span>
        <span className="t-body-12 dim">
          {app.whenLabel} · {app.form.length} · {app.frequency === 'Weekly' ? 'weekly' : 'one-off'}
        </span>
      </div>
      <div className="spring" />
    </div>
  )
}
