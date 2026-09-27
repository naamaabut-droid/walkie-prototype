import { AnimatePresence, motion } from 'framer-motion'
import { ORDER, SCREEN_TITLES, useApp, type Transition } from './state'
import { Home } from './screens/Home'
import { DogSaved, DogWizard } from './screens/DogWizard'
import { Results } from './screens/Results'
import { Filters } from './screens/Filters'
import { WalkerProfile } from './screens/WalkerProfile'
import { BookWalker, PushAccepted, RequestSent } from './screens/Booking'
import { Sheet } from './components/Sheet'
import { Button } from './components/ui'
import './styles/app.css'

/**
 * The transition table, ported from the Figma prototype:
 *   forward  → PUSH LEFT      0.35s ease-out
 *   back     → PUSH RIGHT     0.30s
 *   overlay  → MOVE IN BOTTOM 0.35s
 *   lock     → DISSOLVE       0.40s
 */
const EASE = [0.22, 0.61, 0.36, 1] as const

function variantsFor(kind: Transition) {
  if (kind === 'fade') {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.4, ease: EASE },
    }
  }
  if (kind === 'overlay') {
    return {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { duration: 0.35, ease: EASE },
    }
  }
  const dir = kind === 'forward' ? 1 : -1
  return {
    initial: { x: dir * 390 },
    animate: { x: 0 },
    exit: { x: -dir * 390 },
    transition: { duration: kind === 'forward' ? 0.35 : 0.3, ease: EASE },
  }
}

export default function App() {
  const app = useApp()
  const v = variantsFor(app.transition)

  return (
    <div className="stage">
      <header className="stage__bar">
        <span className="stage__title">Walkie · Flow 1 — a new owner books her first walk</span>
        <span className="stage__step">
          {SCREEN_TITLES[app.route]}
          {app.route === 'wizard' ? ` · step ${app.step + 1} of 9` : ''}
        </span>
        <nav className="stage__jump">
          {ORDER.map((r) => (
            <button key={r} aria-current={r === app.route} onClick={() => app.jumpTo(r)}>
              {SCREEN_TITLES[r]}
            </button>
          ))}
        </nav>
      </header>

      <div className="device">
        <AnimatePresence initial={false} mode="sync">
          <motion.div key={app.route} className="screen" {...v} style={{ position: 'absolute' }}>
            <Router app={app} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {app.route === 'waiting' ? (
            <Sheet onDismiss={() => app.go('push')}>
              <div className="stack" style={{ gap: 8, paddingBottom: 14 }}>
                <span className="t-heading-18">Want notifications?</span>
                <span className="t-body-13 dim">
                  Want to know the moment {app.walker.name.split(' ')[0]} answers? You can keep up
                  to date on your booking, live.
                </span>
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <Button onClick={() => app.go('push')}>Allow notifications</Button>
                <Button variant="secondary" onClick={() => app.go('push')}>
                  Not Now
                </Button>
              </div>
            </Sheet>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Router({ app }: { app: ReturnType<typeof useApp> }) {
  switch (app.route) {
    case 'home':
      return <Home app={app} />
    case 'wizard':
      return <DogWizard app={app} />
    case 'dogSaved':
      return <DogSaved app={app} />
    case 'results':
      return <Results app={app} />
    case 'filters':
      return <Filters app={app} />
    case 'profile':
      return <WalkerProfile app={app} />
    case 'book':
      return <BookWalker app={app} />
    case 'sent':
    case 'waiting':
      return <RequestSent app={app} />
    case 'push':
      return <PushAccepted app={app} />
  }
}
