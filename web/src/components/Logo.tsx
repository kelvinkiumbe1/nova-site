import { Link } from 'react-router'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="Nova Site Care home">
      <span className="grid h-10 w-10 place-items-center rounded-sm bg-ink ring-1 ring-gold/60">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden>
          <path d="M18 46V18h5l18 19V18h5v28h-5L23 27v19z" fill="#C9A24A" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-serif text-xl font-semibold tracking-[0.18em] ${light ? 'text-white' : 'text-ink'}`}>
          NOVA
        </span>
        <span className="block text-[0.62rem] font-semibold tracking-[0.42em] text-gold">SITE CARE</span>
      </span>
    </Link>
  )
}
