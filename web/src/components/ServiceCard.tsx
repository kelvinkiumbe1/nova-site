import { Link } from 'react-router'

import type { Service } from '../lib/types'
import { IconArrow, IconCheck } from './Icons'
import { Photo } from './Photo'

export function ServiceCard({ service, index }: { service: Service; index?: number }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-white ring-1 ring-ink/8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/8">
      <div className="relative">
        <Photo src={service.imageUrl} alt={service.title} className="aspect-[4/3] w-full" />
        {index !== undefined && (
          <span className="absolute top-4 left-4 bg-ink px-3 py-1 font-serif text-sm text-gold">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl">{service.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-stone">{service.summary}</p>
        {service.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {service.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink/80">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" /> {h}
              </li>
            ))}
          </ul>
        )}
        <Link
          to={`/services/${service.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-ink group-hover:text-gold-dark"
        >
          Learn more <IconArrow className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
