import { Link } from 'react-router'

import logoMark from '../assets/logo-mark.webp'
import logoFull from '../assets/logo-full.webp'

/** Compact logo for the header: the gold skyline emblem on a black badge, with the name beside it. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="Nova Site Care home">
      <span className="grid h-11 w-11 place-items-center rounded-md bg-ink ring-1 ring-gold/50">
        <img src={logoMark} alt="" width={34} height={24} className="h-auto w-[34px]" />
      </span>
      <span className="leading-none">
        <span className={`block font-sans text-xl font-semibold tracking-[0.24em] ${light ? 'text-white' : 'text-ink'}`}>
          NOVA
        </span>
        <span className="mt-1 block text-[0.6rem] font-semibold tracking-[0.42em] text-gold-dark">SITE CARE</span>
      </span>
    </Link>
  )
}

/** The full logo with tagline, for dark backgrounds (footer). */
export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Nova Site Care home" className="inline-block">
      <img src={logoFull} alt="Nova Site Care — Clean spaces. Lasting impressions." width={640} height={540}
           loading="lazy" className={`h-auto ${className}`} />
    </Link>
  )
}
