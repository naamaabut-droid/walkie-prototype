import { Screen } from '../components/Chrome'
import { Button, Chip } from '../components/ui'
import type { AppState } from '../state'

/** F1-5 · Walker profile. Fit first, reviews deliberately below the fold. */
export function WalkerProfile({ app }: { app: AppState }) {
  const w = app.walker
  return (
    <Screen
      footer={
        <div
          className="stack"
          style={{
            gap: 8,
            padding: '12px 20px 22px',
            background: 'var(--neutral-0)',
            borderTop: '1px solid var(--neutral-300)',
          }}
        >
          <Button onClick={() => app.go('book')}>Request a walk · ₪{w.price}</Button>
          <Button variant="secondary" onClick={() => app.outOfScope('Messages')}>
            Message {w.name.split(' ')[0]}
          </Button>
        </div>
      }
    >
      <header className="appbar">
        <button
          className="appbar__title t-heading-18 grow"
          style={{ textAlign: 'left' }}
          onClick={() => app.go('results')}
        >
          ‹&nbsp;&nbsp;Results
        </button>
        <button
          className="appbar__side appbar__side--right t-label-12"
          onClick={() => app.toggleSave(w.id)}
        >
          {app.saved.includes(w.id) ? '♥' : '♡'}&nbsp;&nbsp;⋯
        </button>
      </header>

      <div className="stack" style={{ gap: 12, padding: '0 20px 12px' }}>
        <div className="row" style={{ gap: 13 }}>
          <span
            className="avatar avatar--square"
            style={{ width: 60, height: 60, background: 'var(--neutral-100)' }}
          >
            <span className="t-label-11 muted">photo</span>
          </span>
          <div className="stack grow" style={{ gap: 3 }}>
            <span className="t-heading-20">{w.name}</span>
            <span className="t-body-12 muted">
              {w.area} · {w.distance} · ★{w.rating} ({w.reviews})
            </span>
          </div>
        </div>

        <div
          className="stack"
          style={{ gap: 8, padding: 14, borderRadius: 12, background: 'var(--neutral-200)' }}
        >
          <span className="t-title-10 dim">✦ WHY {w.name.split(' ')[0].toUpperCase()} FITS {app.dogName}</span>
          <p className="t-body-12" style={{ margin: 0 }}>
            {app.dogName} startles at bikes and needs to burn energy. {w.name.split(' ')[0]} walks
            quiet routes, one dog at a time.
          </p>
          <div className="chiprow">
            <Chip>quiet routes</Chip>
            <Chip>walks solo</Chip>
            <Chip>2 pullers this month</Chip>
          </div>
          <button className="t-body-11 dim" style={{ textAlign: 'left' }} onClick={() => app.go('wizard')}>
            Not right? Edit {app.dogName}’s profile →
          </button>
        </div>
      </div>

      <Section title="How she works">
        <div className="card stack" style={{ gap: 10 }}>
          <Line label="Last-minute" value="⚡ Accepts" />
          <Line label="Notice needed" value="2 hours" />
          <Line label="Weekly minimum" value="None" />
          <Line label="Cancellation" value="Free up to 1h before" />
        </div>
      </Section>

      <Section
        title={`From ${w.name.split(' ')[0]}’s walks`}
        aside={`See all ${w.walkPhotos}  ›`}
        onAside={() => app.outOfScope('Her walk gallery')}
      >
        <div className="row" style={{ gap: 10, alignItems: 'stretch' }}>
          {[
            { dog: 'Bamba', by: 'Noa R.', when: '2 days ago' },
            { dog: 'Shoko', by: 'Yael K.', when: 'last week' },
            { dog: 'Nala', by: 'Dani L.', when: 'last week' },
          ].map((p) => (
            <div key={p.dog} className="stack grow" style={{ gap: 6 }}>
              <div
                style={{
                  height: 96,
                  borderRadius: 10,
                  background: 'var(--neutral-100)',
                  border: '1px solid var(--neutral-300)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 7,
                }}
              >
                <span className="chip t-title-10" style={{ gap: 5, padding: '3px 8px 3px 4px' }}>
                  <span
                    style={{ width: 13, height: 13, borderRadius: 999, background: 'var(--neutral-200)' }}
                  />
                  {p.by}
                </span>
              </div>
              <div className="stack" style={{ gap: 1 }}>
                <span className="t-eyebrow-11">{p.dog}</span>
                <span className="t-body-11 muted">{p.when}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`Who vouches for ${w.name.split(' ')[0]}`}>
        <div className="card stack" style={{ gap: 10 }}>
          {[
            { who: 'Noa — 2 streets away', what: '“Walks my German Shepherd twice a week.”' },
            { who: 'Dr. Levi — Florentin Vet', what: 'Verified professional reference' },
          ].map((v) => (
            <div key={v.who} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <span
                style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--neutral-100)' }}
              />
              <div className="stack" style={{ gap: 2 }}>
                <span className="t-title-12">{v.who}</span>
                <span className="t-body-12 dim">{v.what}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Where she walks">
        <Placeholder height={120}>map — service radius</Placeholder>
      </Section>

      <div style={{ padding: '0 20px 14px' }}>
        <Placeholder height={64}>Reviews ({w.reviews})</Placeholder>
      </div>
    </Screen>
  )
}

function Section({
  title,
  aside,
  onAside,
  children,
}: {
  title: string
  aside?: string
  onAside?: () => void
  children: React.ReactNode
}) {
  return (
    <section className="stack" style={{ gap: 9, padding: '0 20px 12px' }}>
      <div className="row between">
        <h2 className="t-title-14" style={{ margin: 0 }}>
          {title}
        </h2>
        {aside ? (
          <button className="t-body-12 muted" onClick={onAside}>
            {aside}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="row between" style={{ gap: 8 }}>
      <span className="t-body-12 muted">{label}</span>
      <span className="t-label-12">{value}</span>
    </div>
  )
}

function Placeholder({ height, children }: { height: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        height,
        borderRadius: 8,
        background: 'var(--neutral-100)',
        border: '1px solid var(--neutral-300)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <span className="t-label-11 muted">{children}</span>
    </div>
  )
}
