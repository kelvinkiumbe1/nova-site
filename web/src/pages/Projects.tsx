import { useMemo, useState } from 'react'

import { BeforeAfter } from '../components/BeforeAfter'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { useGallery, useProjects, useServices } from '../lib/queries'
import { useSeo } from '../lib/seo'

type Filter = 'ALL' | 'CONSTRUCTION' | 'GENERAL'

export function Projects() {
  useSeo('Our Projects', 'Completed construction, commercial and residential cleaning projects by Nova Site Care in Nairobi, with before-and-after photos.')
  const { data: projects = [], isLoading } = useProjects()
  const { data: services = [] } = useServices()
  const [filter, setFilter] = useState<Filter>('ALL')

  const categoryOf = useMemo(() => new Map(services.map((s) => [s.slug, s.category])), [services])
  const visible = projects.filter((p) => filter === 'ALL' || (p.serviceSlug && categoryOf.get(p.serviceSlug) === filter))
  const showcase = projects.find((p) => p.beforeImageUrl && p.afterImageUrl)
  const { data: gallery = [] } = useGallery()

  return (
    <>
      <PageHero eyebrow="Our projects" title="Work we're proud to hand over" intro="A selection of completed projects, before-and-after results and our teams at work." />

      {showcase && (
        <section className="py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Before & after" title={showcase.title} intro={showcase.location ?? undefined} />
            <div className="mt-10"><BeforeAfter before={showcase.beforeImageUrl} after={showcase.afterImageUrl} title={showcase.title} /></div>
          </div>
        </section>
      )}

      <section className="bg-sand py-20">
        <div className="container-page">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {([['ALL', 'All'], ['CONSTRUCTION', 'Construction'], ['GENERAL', 'Residential & Commercial']] as const).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2.5 text-sm font-medium transition ${filter === key ? 'bg-ink text-gold' : 'bg-white text-ink hover:bg-ink/5'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {isLoading && <p className="mt-10 text-stone">Loading projects…</p>}
          {!isLoading && visible.length === 0 && (
            <p className="mt-10 text-stone">Projects will be published here soon.</p>
          )}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-20">
          <div className="container-page">
            <SectionHeading eyebrow="On site" title="Our teams at work" />
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((g) => (
                <figure key={g.id}>
                  <Photo src={g.url} alt={g.altText ?? 'Nova team at work'} className="aspect-square w-full" />
                  {g.caption && <figcaption className="mt-2 text-xs text-stone">{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  )
}
