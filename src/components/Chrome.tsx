import type { ReactNode } from 'react'

export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={'statusbar' + (dark ? ' statusbar--dark' : '')}>
      <span className="statusbar__time t-title-12">9:41</span>
      <span className="statusbar__icons t-body-11">▮▮&nbsp;&nbsp;ᯤ&nbsp;&nbsp;▰</span>
    </div>
  )
}

export function AppBar({
  title,
  left,
  right,
  onLeft,
  center = false,
}: {
  title: ReactNode
  left?: ReactNode
  right?: ReactNode
  onLeft?: () => void
  center?: boolean
}) {
  return (
    <div className="appbar">
      {left !== undefined ? (
        <button className="appbar__side t-label-13" onClick={onLeft}>
          {left}
        </button>
      ) : null}
      <div className={'appbar__title t-heading-20 grow' + (center ? ' center' : '')}>{title}</div>
      <div className="appbar__side appbar__side--right t-label-13">{right}</div>
    </div>
  )
}

const TABS = ['Saved', 'Scheduled', 'Home', 'Requests', 'Community'] as const
export type Tab = (typeof TABS)[number]

export function TabBar({
  active = 'Home',
  onSelect,
}: {
  active?: Tab
  onSelect?: (tab: Tab) => void
}) {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const current = tab === active
        return (
          <button
            key={tab}
            className="tabbar__item"
            aria-current={current ? 'page' : undefined}
            onClick={() => onSelect?.(tab)}
          >
            {tab === 'Home' ? (
              <div className={'tabbar__home' + (current ? '' : ' tabbar__home--idle')}>
                <div className="tabbar__box" />
              </div>
            ) : (
              <div className="tabbar__box" />
            )}
            <span className={current ? 't-title-11' : 't-body-11'}>{tab}</span>
          </button>
        )
      })}
    </nav>
  )
}

/** A screen: fixed chrome top and bottom, one scrolling area between them. */
export function Screen({
  children,
  tab,
  app,
  dark = false,
  scroll = true,
  footer,
  className = '',
}: {
  children: ReactNode
  tab?: Tab | null
  /** only needed when the screen shows the tab bar, so taps can report out of scope */
  app?: { go: (r: 'home') => void; outOfScope: (what: string) => void }
  dark?: boolean
  scroll?: boolean
  footer?: ReactNode
  className?: string
}) {
  return (
    <div className={'screen ' + className}>
      <StatusBar dark={dark} />
      {scroll ? <div className="screen__scroll">{children}</div> : children}
      {footer}
      {tab ? (
        <TabBar
          active={tab}
          onSelect={(t) => (t === 'Home' ? app?.go('home') : app?.outOfScope(t))}
        />
      ) : null}
    </div>
  )
}
