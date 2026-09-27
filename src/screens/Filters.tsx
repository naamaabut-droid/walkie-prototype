import { Screen } from '../components/Chrome'
import { Button, ChipGroup } from '../components/ui'
import type { AppState } from '../state'

/**
 * F1-4 · Filters. Two of these remove walkers, the rest only reorder them —
 * the screen says which is which, because that is the promise the flow makes.
 */
export function Filters({ app }: { app: AppState }) {
  const f = app.filters
  return (
    <Screen
      footer={
        <div style={{ padding: '12px 20px 24px' }}>
          <Button onClick={() => app.go('results')}>Show {app.matchCount} walkers</Button>
        </div>
      }
    >
      <header className="appbar">
        <button className="appbar__side t-label-12" onClick={app.resetFilters}>
          Reset
        </button>
        <span className="appbar__title t-heading-18 grow center">Filters</span>
        <button
          className="appbar__side appbar__side--right t-title-13"
          onClick={() => app.go('results')}
        >
          X
        </button>
      </header>

      <p className="t-body-12 muted" style={{ margin: 0, padding: '0 20px 6px' }}>
        Size and pack remove walkers. Everything else reorders them.
      </p>

      <div className="stack" style={{ gap: 15, padding: '10px 20px 0' }}>
        <div
          className="row"
          style={{
            gap: 12,
            padding: 13,
            borderRadius: 12,
            background: 'var(--amber-50)',
          }}
        >
          <div className="stack grow" style={{ gap: 2 }}>
            <span className="t-title-12" style={{ color: 'var(--amber-600)' }}>
              Available last minute
            </span>
            <span className="t-body-10 dim">Someone who can take him within the hour.</span>
          </div>
          <button
            role="switch"
            aria-checked={f.lastMinute}
            onClick={() => app.setFilter('lastMinute', !f.lastMinute)}
            style={{
              width: 42,
              height: 24,
              borderRadius: 999,
              padding: 3,
              background: f.lastMinute ? 'var(--amber-600)' : 'var(--neutral-300)',
              display: 'flex',
              justifyContent: f.lastMinute ? 'flex-end' : 'flex-start',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: 'var(--neutral-0)',
                transition: 'all 160ms ease',
              }}
            />
          </button>
        </div>

        <Group title="How far will the walker travel?" note="Their radius, not yours.">
          <ChipGroup
            options={['1 km', '3 km', '5 km', '10 km', 'Any']}
            value={f.radius}
            onChange={(v) => app.setFilter('radius', v)}
          />
        </Group>

        <Group title="Takes dogs of this size" note="Large · 28 kg, from his profile.">
          <ChipGroup
            options={['Small · 0–7 kg', 'Medium · 8–18 kg', 'Large · 18–45 kg', 'Giant · 45 kg+']}
            value={f.size}
            onChange={(v) => app.setFilter('size', v)}
          />
        </Group>

        <Group title="In a pack, or on his own?">
          <ChipGroup
            options={['Solo only', 'Up to 2 dogs', 'Up to 3 dogs', 'Any']}
            value={f.pack}
            onChange={(v) => app.setFilter('pack', v)}
          />
        </Group>

        <Group title="Style of walk">
          <div className="chiprow">
            {['City streets', 'Parks & grass', 'Dog park', 'Running pace', 'Shaded in summer'].map(
              (s) => (
                <button
                  key={s}
                  className={'chip ' + (f.style.includes(s) ? 'chip--on t-title-11' : 't-label-11')}
                  onClick={() => app.toggleStyle(s)}
                >
                  {s}
                </button>
              ),
            )}
          </div>
        </Group>

        <Group title="Hours that work for you">
          <ChipGroup
            options={['Morning', 'Midday', 'Afternoon', 'Evening']}
            value={f.hours}
            onChange={(v) => app.setFilter('hours', v)}
          />
        </Group>

        <Group title="Walk length">
          <ChipGroup
            options={['30 min', '45 min', '60 min', 'Longer']}
            value={f.length}
            onChange={(v) => app.setFilter('length', v)}
          />
        </Group>

        <Group title="Commitment">
          <ChipGroup
            options={['One-off is fine', 'Weekly', 'Any']}
            value={f.commitment}
            onChange={(v) => app.setFilter('commitment', v)}
          />
        </Group>
      </div>
    </Screen>
  )
}

function Group({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="stack" style={{ gap: 7 }}>
      <span className="t-title-12">{title}</span>
      {note ? <span className="t-body-11 muted">{note}</span> : null}
      {children}
    </section>
  )
}
