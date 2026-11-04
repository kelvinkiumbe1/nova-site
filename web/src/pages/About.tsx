import { CtaBand } from '../components/CtaBand'
import { IconCheck } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { SectionHeading } from '../components/SectionHeading'
import { useSeo } from '../lib/seo'

// DRAFT COPY: replace with Nova's own background, mission, vision and values once supplied.
const VALUES = ['Integrity', 'Excellence', 'Safety', 'Accountability', 'Respect']
const DIFFERENT = [
  'Construction cleaning is our specialty, not an add-on',
  'Teams trained for live sites, safety and handover standards',
  'Clear scope, transparent quotations and a single point of contact',
  'Quality inspection before every handover',
]

export function About() {
  useSeo('About Us', 'Nova Site Care is a Nairobi cleaning company specialising in construction, post-construction and handover cleaning for contractors and developers.')
  return (
    <>
      <PageHero
        eyebrow="About Nova"
        title="Built on care, detail and dependable service"
        intro="A Nairobi cleaning company specialising in construction sites and premium properties."
      />

      <section className="py-24">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Photo alt="The Nova Site Care team" className="aspect-[5/4] w-full" />
          <div>
            <SectionHeading eyebrow="Our story" title="Who we are" />
            <div className="mt-6 space-y-4 leading-relaxed text-stone">
              <p>
                Nova Site Care was founded to give Nairobi's construction industry a cleaning partner that understands how
                sites work: tight programmes, multiple trades, safety rules and demanding handover standards.
              </p>
              <p>
                Today we support contractors, developers, site managers and property owners from the first phase of a build
                through to final handover, and we bring the same standard to homes, offices and commercial spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {[
            { title: 'Our Mission', text: 'To deliver professional, reliable and detail-focused cleaning that helps our clients complete projects on time and present every space at its best.' },
            { title: 'Our Vision', text: "To be East Africa's most trusted name in construction and premium property cleaning." },
          ].map((c) => (
            <div key={c.title} className="border-t-2 border-gold bg-white p-10">
              <h2 className="text-3xl">{c.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-stone">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-page">
          <SectionHeading center eyebrow="Core values" title="What guides our work" />
          <div className="mt-14 flex flex-wrap justify-center gap-4">
            {VALUES.map((v) => (
              <span key={v} className="border border-ink/15 px-8 py-4 font-serif text-lg">{v}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading light eyebrow="The Nova difference" title="What makes Nova different" />
            <ul className="mt-8 space-y-4">
              {DIFFERENT.map((d) => (
                <li key={d} className="flex gap-3 text-white/80"><IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />{d}</li>
              ))}
            </ul>
          </div>
          <Photo alt="Nova team at work on a construction site" className="aspect-[4/3] w-full" />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
