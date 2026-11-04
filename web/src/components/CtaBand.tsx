import { Link } from 'react-router'

import { useSettings } from '../lib/queries'
import { whatsappLink } from '../lib/whatsapp'
import { IconArrow, IconWhatsApp } from './Icons'

export function CtaBand() {
  const { data: settings } = useSettings()
  return (
    <section className="bg-ink">
      <div className="container-page flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
        <div>
          <p className="eyebrow text-gold">Let's talk about your site</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl">Have a project ready for cleaning?</h2>
          <p className="mt-3 max-w-xl text-white/65">
            Tell us about your site and we'll come back with a tailored quotation, usually within one business day.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact#quote" className="btn-gold">
            Request a Quotation <IconArrow className="h-4 w-4" />
          </Link>
          {settings?.whatsapp && (
            <a
              href={whatsappLink(settings.whatsapp, "Hello Nova Site Care, I'd like a quotation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
            >
              <IconWhatsApp className="h-4 w-4" /> WhatsApp Us
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
