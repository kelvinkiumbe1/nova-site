import { Link } from 'react-router'

import { Badge, Card, ErrorNote, Loading, PageHeader } from '../components/ui'
import { services } from '../hooks'

export function ServicesList() {
  const { data, isLoading, error } = services.useList()
  return (
    <>
      <PageHeader
        title="Services"
        description="Services shown on the website. Lower sort numbers appear first."
        actions={<Link to="/admin/services/new" className="btn-gold">+ New service</Link>}
      />
      <ErrorNote error={error} />
      {isLoading ? <Loading /> : (
        <Card className="!p-0">
          <ul className="divide-y divide-ink/8">
            {data?.map((s) => (
              <li key={s.id}>
                <Link to={`/admin/services/${s.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-cream">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-sand">
                    {s.imageUrl && <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.title}</p>
                    <p className="truncate text-sm text-stone">{s.summary}</p>
                  </div>
                  <div className="hidden flex-wrap justify-end gap-2 sm:flex">
                    <Badge>{s.category === 'CONSTRUCTION' ? 'Construction' : 'General'}</Badge>
                    {s.featured && <Badge tone="gold">Featured</Badge>}
                    {!s.published && <Badge>Hidden</Badge>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
