import { Link } from 'react-router'

import { CtaBand } from '../components/CtaBand'
import { IconArrow, IconCheck } from '../components/Icons'
import { Photo } from '../components/Photo'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { Testimonials } from '../components/Testimonials'
import { PILLARS } from '../lib/content'
import { useProjects, useServices } from '../lib/queries'
import { useSeo } from '../lib/seo'

export function Home() {
  useSeo('Nova Site Care | Construction & Property Cleaning in Nairobi',
    'Premium construction, post-construction, handover, office and residential cleaning across Nairobi. Request a quotation today.')
  const { data: services = [] } = useServices()
  const { data: projects = [] } = useProjects()
  const construction = services.filter((s) => s.category === 'CONSTRUCTION')
  const general = services.filter((s) => s.category === 'GENERAL')

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Photo alt="Nova team cleaning a newly completed modern building" className="absolute inset-0 -z-10 h-full w-full opacity-60" eager />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="container-page py-28 sm:py-36 lg:py-44">
          <p className="eyebrow text-gold">Nairobi's construction cleaning specialists</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Construction-Ready.<br />
            <span className="text-gold">Handover-Perfect.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-white/75">
            Premium construction and property cleaning for contractors, developers, site managers and property owners across Nairobi.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact#quote" className="btn-gold">Request a Quotation <IconArrow className="h-4 w-4" /></Link>
            <Link to="/services" className="btn-outline-light">Explore Our Services</Link>
          </div>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
            {['Trained, supervised teams', 'Commercial-grade equipment', 'Nairobi-wide coverage'].map((t) => (
              <li key={t} className="flex items-center gap-2"><IconCheck className="h-4 w-4 text-gold" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <Photo alt="Nova cleaning professionals on site" className="aspect-[4/5] w-full max-w-md" />
            <div className="absolute -right-2 -bottom-6 hidden bg-gold p-6 sm:block lg:right-8">
              <p className="font-serif text-2xl text-ink">From site<br />to handover</p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Welcome to Nova Site Care"
              title="A cleaning partner built for construction and premium properties"
              intro="Nova Site Care delivers professional cleaning at every stage of a project, from progressive site cleaning during works to the final, detailed clean before handover. We also look after homes, offices and commercial spaces with the same care and standards."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Construction & post-construction', 'Final handover presentation', 'Offices & commercial spaces', 'Homes, carpets & upholstery'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-medium"><span className="h-px w-5 bg-gold" />{t}</li>
              ))}
            </ul>
            <Link to="/about" className="btn-outline-dark mt-10">About Nova <IconArrow className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Construction services */}
      <section className="bg-sand py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Our specialty"
              title="Construction cleaning, every phase"
              intro="Clean, safe sites keep projects on schedule. We support your programme from the first trade to the final walk-through."
            />
            <Link to="/services" className="btn-outline-dark shrink-0">All services</Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {construction.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* Other services */}
      {general.length > 0 && (
        <section className="py-24">
          <div className="container-page">
            <SectionHeading center eyebrow="Beyond the build site" title="Residential & commercial cleaning" />
            <div className="mt-14 grid gap-px bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-2 lg:grid-cols-5">
              {general.map((s) => (
                <Link key={s.id} to={`/services/${s.slug}`} className="group bg-cream p-7 transition hover:bg-white">
                  <h3 className="text-lg">{s.title}</h3>
                  <p className="mt-3 text-sm text-stone">{s.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold group-hover:text-gold-dark">
                    Details <IconArrow className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="bg-sand py-24">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Our work" title="Featured projects" />
              <Link to="/projects" className="btn-outline-dark shrink-0">View all projects</Link>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {projects.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="py-24">
        <div className="container-page">
          <SectionHeading center eyebrow="Why choose Nova" title="The standard you can hand over with confidence" />
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full ring-1 ring-gold">
                  <Icon className="h-7 w-7 text-gold-dark" />
                </div>
                <h3 className="mt-6 text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <CtaBand />
    </>
  )
}
