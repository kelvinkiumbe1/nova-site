import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'

import { IconClose, IconMenu } from '../../components/Icons'
import { useLogout, useMe } from '../auth'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/quotes', label: 'Quote Requests' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/gallery', label: 'Gallery & Media' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/settings', label: 'Site Settings' },
  { to: '/admin/account', label: 'My Account' },
]

export function AdminLayout() {
  const { data: me } = useMe()
  const logout = useLogout()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  const sidebar = (
    <nav className="flex flex-col gap-1 p-4" aria-label="Admin">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          className={({ isActive }) =>
            `rounded-sm px-4 py-2.5 text-sm transition ${isActive ? 'bg-gold text-ink font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
          }
        >
          {n.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#f6f4f0] lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden bg-ink lg:sticky lg:top-0 lg:block lg:h-screen">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="font-serif text-lg tracking-[0.18em] text-white">NOVA</p>
          <p className="text-[0.6rem] tracking-[0.4em] text-gold">ADMIN</p>
        </div>
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-white px-4 sm:px-8">
          <button type="button" className="lg:hidden" aria-label="Menu" onClick={() => setOpenOn(open ? null : pathname)}>
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
          <Link to="/" target="_blank" className="text-sm text-stone hover:text-ink">View website ↗</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-stone sm:inline">{me?.fullName ?? me?.email}</span>
            <button
              type="button"
              className="font-semibold hover:text-gold-dark"
              onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/admin/login') })}
            >
              Log out
            </button>
          </div>
        </header>
        {open && <div className="bg-ink lg:hidden">{sidebar}</div>}
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
