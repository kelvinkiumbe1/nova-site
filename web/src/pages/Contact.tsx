import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { QuoteForm } from '../components/QuoteForm'
import { SectionHeading } from '../components/SectionHeading'
import { SocialLinks } from '../components/SocialLinks'
import { useSettings } from '../lib/queries'
import { useSeo } from '../lib/seo'
import { whatsappLink } from '../lib/whatsapp'

const DEFAULT_MAP = 'https://www.google.com/maps?q=Nairobi%2C%20Kenya&z=11&output=embed'

export function Contact() {
  useSeo('Contact Us & Request a Quote', 'Contact Nova Site Care for construction, office and residential cleaning in Nairobi. Call, WhatsApp or request a quotation online.')
  const { data: s } = useSettings()
  const [params] = useSearchParams()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  const items = [
    s?.phone && { Icon: IconPhone, label: 'Call us', value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` },
    s?.whatsapp && { Icon: IconWhatsApp, label: 'WhatsApp', value: `+${s.whatsapp}`, href: whatsappLink(s.whatsapp, "Hello Nova Site Care, I'd like a quotation.") },
    s?.email && { Icon: IconMail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    s?.address && { Icon: IconPin, label: 'Office', value: s.address },
    s?.businessHours && { Icon: IconClock, label: 'Business hours', value: s.businessHours },
  ].filter(Boolean) as { Icon: typeof IconPhone; label: string; value: string; href?: string }[]

  return (
    <>
      <PageHero eyebrow="Contact us" title="Let's discuss your site or property" intro="Request a quotation online, or reach us directly by phone or WhatsApp." />

      <section className="py-24" id="quote">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading eyebrow="Get in touch" title="Contact details" />
            <ul className="mt-10 space-y-6">
              {items.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center bg-ink"><Icon className="h-5 w-5 text-gold" /></span>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-stone uppercase">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block font-medium hover:text-gold-dark" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{value}</a>
                    ) : (
                      <p className="mt-1 font-medium">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {s && <SocialLinks settings={s} className="mt-10 text-ink" />}
          </div>
          <div>
            <h2 className="text-3xl">Request a quotation</h2>
            <p className="mt-3 mb-8 text-stone">Share a few details and we'll prepare a tailored quotation for your project.</p>
            <QuoteForm defaultService={params.get('service') ?? undefined} />
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="grid lg:grid-cols-[1fr_2fr]">
          <div className="container-page py-16 lg:pr-12 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <SectionHeading eyebrow="Coverage" title="Areas we serve" />
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {s?.serviceAreas.map((a) => (
                <li key={a} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{a}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-stone">Not listed? Contact us. We regularly take on projects across Nairobi and its environs.</p>
          </div>
          <iframe
            title="Map of Nova Site Care service coverage in Nairobi"
            src={s?.mapEmbedUrl || DEFAULT_MAP}
            className="h-[420px] w-full border-0 lg:h-full lg:min-h-[480px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
