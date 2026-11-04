import { Link } from 'react-router'

import { CtaBand } from '../components/CtaBand'
import { IconArrow, IconCheck } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { useServices } from '../lib/queries'
import { useSeo } from '../lib/seo'

export function Services() {
  useSeo('Our Services', 'Progressive, post-construction and final handover cleaning, plus residential, office, carpet, upholstery and move-in/move-out cleaning in Nairobi.')
  const { data: services = [], isLoading } = useServices()
  const construction = services.filter((s) => s.category === 'CONSTRUCTION')
  const general = services.filter((s) => s.category === 'GENERAL')

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Cleaning for every stage of a project, and every kind of property"
        intro="Construction cleaning is our core expertise. We bring the same discipline to homes, offices and commercial spaces."
      />

      <section className="py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Construction cleaning"
            title="From the first trade to the final handover"
            intro="Four stages, one accountable partner. Book a single stage or have Nova support the whole programme."
          />
          {isLoading && <p className="mt-10 text-stone">Loading services…</p>}
          <ol className="mt-16 grid gap-10 lg:grid-cols-4">
            {construction.map((s, i) => (
              <li key={s.id} className="relative">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink font-serif text-gold">{i + 1}</span>
                  {i < construction.length - 1 && <span className="hidden h-px flex-1 bg-gold/40 lg:block" />}
                </div>
                <Photo src={s.imageUrl} alt={s.title} className="mt-6 aspect-[4/3] w-full" />
                <h3 className="mt-6 text-xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{s.summary}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />{h}</li>
                  ))}
                </ul>
                <Link to={`/services/${s.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:text-gold-dark">
                  Learn more <IconArrow className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {general.length > 0 && (
        <section className="bg-sand py-24">
          <div className="container-page">
            <SectionHeading eyebrow="General cleaning" title="Homes, offices and furnishings" />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {general.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}
