import { useRef } from 'react'
import { Screen } from '../components/Chrome'
import { Button, OptionRow, Progress } from '../components/ui'
import { STEPS } from '../data/dogWizard'
import type { AppState } from '../state'

/**
 * F1-2 · About your dog — nine frames in Figma, one screen here.
 * The step index drives the copy, the controls and the progress bar.
 */
export function DogWizard({ app }: { app: AppState }) {
  const index = app.step
  const step = STEPS[index]
  const answer = app.answers[step.id]
  const last = index === STEPS.length - 1

  const pick = (value: string) => {
    if (step.kind === 'multi') {
      const current = Array.isArray(answer) ? answer : []
      app.answer(
        step.id,
        current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      )
    } else {
      app.answer(step.id, value)
    }
  }

  const isOn = (value: string) =>
    Array.isArray(answer) ? answer.includes(value) : answer === value

  return (
    <Screen
      footer={
        <div className="stack" style={{ gap: 10, padding: '10px 18px 24px' }}>
          <Button onClick={() => (last ? app.go('dogSaved') : app.nextStep())}>
            {last ? 'Save' : 'Continue'}
          </Button>
          {step.skippable ? (
            <Button variant="ghost" onClick={() => (last ? app.go('dogSaved') : app.nextStep())}>
              Skip
            </Button>
          ) : null}
        </div>
      }
    >
      <header className="appbar">
        <button className="appbar__side t-title-13" onClick={app.prevStep} aria-label="Back">
          ‹
        </button>
        <span className="t-label-11 muted grow center">
          Step {index + 1} of {STEPS.length}
        </span>
        <button
          className="appbar__side appbar__side--right t-title-13"
          onClick={() => app.go('home')}
          aria-label="Close"
        >
          X
        </button>
      </header>

      <div style={{ padding: '0 18px 18px' }}>
        <Progress value={(index + 1) / STEPS.length} />
      </div>

      <div className="stack" style={{ gap: 6, padding: '0 18px 18px' }}>
        {step.required ? (
          <span
            className="chip chip--notice t-title-10"
            style={{ alignSelf: 'flex-start', padding: '4px 9px' }}
          >
            REQUIRED
          </span>
        ) : null}
        <h1 className="t-heading-20" style={{ margin: 0 }}>
          {step.title}
        </h1>
        {step.subtitle ? (
          <p className="t-body-13 dim" style={{ margin: 0 }}>
            {step.subtitle}
          </p>
        ) : null}
      </div>

      {step.kind === 'photo' ? (
        <div className="stack" style={{ gap: 12, padding: '0 18px' }}>
          <span className="t-eyebrow-11 muted">NAME</span>
          <input
            className="t-title-14"
            value={String(app.answers.name ?? '')}
            placeholder={step.placeholder}
            onChange={(e) => app.answer('name', e.target.value)}
            style={{
              padding: '15px 16px',
              borderRadius: 12,
              border: '1px solid var(--neutral-300)',
              background: 'var(--neutral-0)',
            }}
          />
          <span className="t-eyebrow-11 muted">PHOTO · OPTIONAL</span>
          <PhotoField photo={app.photo} onPick={app.setPhoto} />
        </div>
      ) : null}

      {step.kind === 'notes' ? (
        <div className="stack" style={{ gap: 8, padding: '6px 18px' }}>
          <span className="t-title-13">Your note</span>
          <textarea
            className="t-body-12"
            rows={3}
            value={String(app.answers.notes ?? '')}
            placeholder={step.placeholder}
            onChange={(e) => app.answer('notes', e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid var(--neutral-300)',
              background: 'var(--neutral-0)',
              color: 'var(--neutral-500)',
              resize: 'none',
            }}
          />
        </div>
      ) : null}

      {step.options ? (
        <div className="rowlist" style={{ padding: '0 18px' }}>
          {step.options.map((o) => (
            <OptionRow
              key={o.value}
              label={o.label}
              sub={o.sub}
              multi={step.kind === 'multi'}
              selected={isOn(o.value)}
              onClick={() => pick(o.value)}
            />
          ))}
        </div>
      ) : null}

      {step.aside ? (
        <div className="row between" style={{ padding: '16px 18px 0' }}>
          <span className="t-label-12 dim">{step.aside.label}</span>
          <span className="t-title-12 muted">{step.aside.action}</span>
        </div>
      ) : null}
    </Screen>
  )
}

/** The upload is real: it opens the picker, previews what you chose, and can be replaced. */
function PhotoField({
  photo,
  onPick,
}: {
  photo: string | null
  onPick: (file: File | null) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div
      className="stack"
      style={{
        gap: 6,
        alignItems: 'center',
        padding: photo ? '16px 0' : '26px 0',
        borderRadius: 14,
        border: '1px solid var(--neutral-300)',
        background: 'var(--neutral-0)',
      }}
    >
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      {photo ? (
        <>
          <img
            src={photo}
            alt="Your dog"
            style={{ width: 104, height: 104, borderRadius: 999, objectFit: 'cover' }}
          />
          <div className="row" style={{ gap: 8, paddingTop: 6 }}>
            <button className="chip t-label-11" onClick={() => input.current?.click()}>
              Replace
            </button>
            <button
              className="chip t-label-11"
              onClick={() => {
                onPick(null)
                if (input.current) input.current.value = ''
              }}
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <button
          className="stack"
          style={{ gap: 6, alignItems: 'center', width: '100%' }}
          onClick={() => input.current?.click()}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              background: 'var(--neutral-100)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--neutral-700)',
            }}
          >
            +
          </span>
          <span className="t-title-13">Add a photo</span>
          <span className="t-body-11 muted">Camera or photo library</span>
        </button>
      )}
    </div>
  )
}

/** F1-2 · saved. Every row is read back from state, not drawn. */
export function DogSaved({ app }: { app: AppState }) {
  return (
    <Screen
      footer={
        <div className="stack" style={{ gap: 9, padding: '10px 18px 24px' }}>
          {/* Finishing the questionnaire is not the same as asking to search. The
              profile is saved and the user goes back to where they were; looking
              for matches straight away is offered, one step quieter. */}
          <Button onClick={() => app.go('home')}>Save</Button>
          <Button variant="secondary" onClick={() => app.go('results')}>
            Find matches for {app.dogName}
          </Button>
          <button className="t-title-13 muted center" onClick={() => app.go('wizard')}>
            Back to editing
          </button>
        </div>
      }
    >
      <header className="appbar">
        <button
          className="appbar__side appbar__side--right t-title-13 grow right"
          onClick={() => app.go('home')}
        >
          X
        </button>
      </header>

      <div style={{ padding: '14px 18px 16px' }}>
        <h1 className="t-heading-20" style={{ margin: 0 }}>
          Dog Details Saved
        </h1>
      </div>

      <div style={{ padding: '0 18px' }}>
        <div
          className="stack card card--lg"
          style={{ gap: 16, alignItems: 'center', padding: '32px 14px 16px' }}
        >
          {app.photo ? (
            <img
              src={app.photo}
              alt={app.dogName}
              style={{ width: 108, height: 108, borderRadius: 999, objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{ width: 108, height: 108, borderRadius: 999, background: 'var(--neutral-100)' }}
            />
          )}
          <div className="stack" style={{ width: '100%' }}>
            {app.summary.map((row, i) => (
              <div
                key={row.label}
                className="row between"
                style={{
                  gap: 12,
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--neutral-300)',
                }}
              >
                <span className="row" style={{ gap: 8 }}>
                  <span className="t-heading-11">✓</span>
                  <span className="t-label-12 dim">{row.label}</span>
                </span>
                <span className="t-title-12 right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  )
}
