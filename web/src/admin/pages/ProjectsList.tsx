import { Link } from 'react-router'

import { Badge, Card, Empty, ErrorNote, Loading, PageHeader } from '../components/ui'
import { fmtDate } from '../format'
import { projects } from '../hooks'

export function ProjectsList() {
  const { data, isLoading, error } = projects.useList()
  return (
    <>
      <PageHeader
        title="Projects"
        description="Completed work shown in the Projects section, with before-and-after photos."
        actions={<Link to="/admin/projects/new" className="btn-gold">+ New project</Link>}
      />
      <ErrorNote error={error} />
      {isLoading ? <Loading /> : data?.length === 0 ? (
        <Empty>No projects yet. Add your first completed project to showcase it on the website.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((p) => (
            <Link key={p.id} to={`/admin/projects/${p.id}`}>
              <Card className="!p-0 overflow-hidden transition hover:-translate-y-0.5">
                <div className="aspect-[16/10] bg-sand">
                  {(p.coverImageUrl ?? p.afterImageUrl) && <img src={(p.coverImageUrl ?? p.afterImageUrl)!} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="p-5">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-stone">{[p.location, p.completedOn && fmtDate(p.completedOn)].filter(Boolean).join(' · ') || '—'}</p>
                  <div className="mt-3 flex gap-2">
                    {p.published ? <Badge tone="green">Published</Badge> : <Badge>Draft</Badge>}
                    {p.featured && <Badge tone="gold">Featured</Badge>}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
