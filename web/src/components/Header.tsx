import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { NAV } from '../lib/nav'
import { IconClose, IconMenu } from './Icons'
import { Logo } from './Logo'

export function Header() {
  const { pathname } = useLocation()
  // Menu is open only for the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition hover:text-gold-dark ${
                  isActive ? 'text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold' : 'text-ink/70'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/contact#quote" className="btn-gold hidden sm:inline-flex">
            Request a Quote
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-ink/5 bg-cream lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-4">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `border-b border-ink/5 py-3 text-base ${isActive ? 'font-semibold text-gold-dark' : 'text-ink'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/contact#quote" className="btn-gold mt-4">
              Request a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
