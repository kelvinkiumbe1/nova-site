import { Link, useParams } from 'react-router'

import { CtaBand } from '../components/CtaBand'
import { IconArrow, IconCheck } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { useService } from '../lib/queries'
import { useSeo } from '../lib/seo'
import { NotFound } from './NotFound'

export function ServiceDetail() {
  const { slug = '' } = useParams()
  const { data: s, isLoading, isError } = useService(slug)
  useSeo(s?.seoTitle ?? s?.title, s?.seoDescription ?? s?.summary)

  if (isLoading) return <div className="container-page py-32 text-stone">Loading…</div>
  if (isError || !s) return <NotFound />

  return (
    <>
      <PageHero
        eyebrow={s.category === 'CONSTRUCTION' ? 'Construction cleaning' : 'Our services'}
        title={s.title}
        intro={s.summary}
      />
      <section className="py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Photo src={s.imageUrl} alt={s.title} className="aspect-[16/10] w-full" />
            {s.body && (
              <div className="mt-10 space-y-5 leading-relaxed text-ink/80">
                {s.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
            )}
          </div>
          <aside className="h-fit bg-white p-8 ring-1 ring-ink/8 lg:sticky lg:top-28">
            <h2 className="text-2xl">What's included</h2>
            <div className="mt-4 h-px w-12 bg-gold" />
            <ul className="mt-6 space-y-3">
              {s.highlights.map((h) => (
                <li key={h} className="flex gap-3"><IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />{h}</li>
              ))}
            </ul>
            <Link to={`/contact?service=${s.slug}#quote`} className="btn-gold mt-8 w-full">
              Get a quote for this service <IconArrow className="h-4 w-4" />
            </Link>
            <Link to="/services" className="mt-4 block text-center text-sm text-stone hover:text-ink">← All services</Link>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
