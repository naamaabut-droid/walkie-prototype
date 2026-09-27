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
        <button className="appbar__side t-label-12" onClick={onLeft}>
          {left}
        </button>
      ) : null}
      <div className={'appbar__title t-heading-18 grow' + (center ? ' center' : '')}>{title}</div>
      <div className="appbar__side appbar__side--right t-label-12">{right}</div>
    </div>
  )
}

const TABS = ['Saved', 'Scheduled', 'Home', 'Community', 'Profile'] as const
export type Tab = (typeof TABS)[number]

export function TabBar({ active = 'Home' }: { active?: Tab }) {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const current = tab === active
        if (tab === 'Home') {
          return (
            <div key={tab} className="tabbar__item" aria-current={current ? 'page' : undefined}>
              <div className={'tabbar__home' + (current ? '' : ' tabbar__home--idle')}>
                <div className="tabbar__box" />
              </div>
              <span className={current ? 't-title-10' : 't-body-10'}>{tab}</span>
            </div>
          )
        }
        return (
          <div key={tab} className="tabbar__item" aria-current={current ? 'page' : undefined}>
            <div className="tabbar__box" />
            <span className={current ? 't-title-10' : 't-body-10'}>{tab}</span>
          </div>
        )
      })}
    </nav>
  )
}

/** A screen: fixed chrome top and bottom, one scrolling area between them. */
export function Screen({
  children,
  tab,
  dark = false,
  scroll = true,
  footer,
  className = '',
}: {
  children: ReactNode
  tab?: Tab | null
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
      {tab ? <TabBar active={tab} /> : null}
    </div>
  )
}
