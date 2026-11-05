import { Link } from 'react-router'

import { useServices, useSettings } from '../lib/queries'
import { NAV } from '../lib/nav'
import { phones, telHref } from '../lib/contact'
import { IconClock, IconMail, IconPhone, IconPin } from './Icons'
import { LogoFull } from './Logo'
import { SocialLinks } from './SocialLinks'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { data: settings } = useSettings()
  const { data: services } = useServices()

  return (
    <footer className="bg-ink text-white/70">
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoFull className="w-52" />
          <p className="mt-5 text-sm leading-relaxed">
            {settings?.tagline ?? 'Premium construction and property cleaning in Nairobi.'}
          </p>
          {settings && <SocialLinks settings={settings} className="mt-6 text-white/80" />}
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold tracking-[0.25em] text-gold uppercase">Quick links</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-gold">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold tracking-[0.25em] text-gold uppercase">Services</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services?.slice(0, 7).map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="hover:text-gold">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-semibold tracking-[0.25em] text-gold uppercase">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {phones(settings).map((p) => (
              <li key={p} className="flex gap-3"><IconPhone className="h-5 w-5 shrink-0 text-gold" />
                <a href={telHref(p)} className="hover:text-gold">{p}</a></li>
            ))}
            {settings?.email && (
              <li className="flex gap-3"><IconMail className="h-5 w-5 shrink-0 text-gold" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a></li>
            )}
            {settings?.address && (
              <li className="flex gap-3"><IconPin className="h-5 w-5 shrink-0 text-gold" />{settings.address}</li>
            )}
            {settings?.businessHours && (
              <li className="flex gap-3"><IconClock className="h-5 w-5 shrink-0 text-gold" />{settings.businessHours}</li>
            )}
          </ul>
          {!!settings?.serviceAreas.length && (
            <p className="mt-5 text-xs leading-relaxed text-white/50">
              Serving: {settings.serviceAreas.join(' · ')}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {YEAR} {settings?.companyName ?? 'Nova Site Care'}. All rights reserved.</p>
          <p>Construction · Commercial · Residential cleaning in Nairobi</p>
        </div>
      </div>
    </footer>
  )
}
