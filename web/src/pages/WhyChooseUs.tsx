import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { SectionHeading } from '../components/SectionHeading'
import { Testimonials } from '../components/Testimonials'
import { PILLARS } from '../lib/content'
import { useSeo } from '../lib/seo'

const PROCESS = [
  { title: 'Site visit', text: 'We assess the site or property, the scope and any safety or access requirements.' },
  { title: 'Tailored quotation', text: 'You receive a clear, itemised quotation and a schedule that fits your programme.' },
  { title: 'Scheduled cleaning', text: 'A supervised Nova team carries out the work with the right equipment and products.' },
  { title: 'Inspection & handover', text: 'We inspect against a checklist with you and resolve any items before sign-off.' },
]

export function WhyChooseUs() {
  useSeo('Why Choose Us', 'Professional, reliable, detail-focused construction and property cleaning in Nairobi. See how Nova Site Care works.')
  return (
    <>
      <PageHero eyebrow="Why choose Nova" title="When the finish matters, choose a team that sweats the details" />

      <section className="py-24">
        <div className="container-page space-y-20">
          {PILLARS.map(({ Icon, title, text }, i) => (
            <div key={title} className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <Photo alt={`${title}: Nova team at work`} className="aspect-[4/3] w-full" />
              <div>
                <Icon className="h-10 w-10 text-gold-dark" />
                <h2 className="mt-5 text-3xl sm:text-4xl">{title}</h2>
                <div className="mt-5 h-px w-16 bg-gold" />
                <p className="mt-5 text-lg leading-relaxed text-stone">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="container-page">
          <SectionHeading center eyebrow="How we work" title="Our process" />
          <ol className="mt-16 grid gap-8 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="bg-white p-8 ring-1 ring-ink/8">
                <span className="font-serif text-4xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Testimonials />
      <CtaBand />
    </>
  )
}
