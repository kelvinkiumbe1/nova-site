import { useTestimonials } from '../lib/queries'
import { SectionHeading } from './SectionHeading'

export function Testimonials() {
  const { data: testimonials = [] } = useTestimonials()
  if (testimonials.length === 0) return null
  return (
    <section className="bg-ink-soft py-24">
      <div className="container-page">
        <SectionHeading center light eyebrow="Client feedback" title="Trusted on site and at home" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <figure key={t.id} className="flex flex-col border border-white/10 p-8">
              <span className="font-serif text-6xl leading-none text-gold" aria-hidden>“</span>
              <blockquote className="mt-2 flex-1 leading-relaxed text-white/80">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <p className="font-semibold text-white">{t.authorName}</p>
                <p className="text-sm text-white/50">{[t.authorRole, t.company].filter(Boolean).join(', ')}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
