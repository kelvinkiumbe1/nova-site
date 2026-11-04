import { Link } from 'react-router'

import { fmtDateTime } from '../format'
import { projects, useQuotes, useQuoteStats } from '../hooks'
import { Card, Empty, Loading, PageHeader, StatusBadge } from '../components/ui'

export function Dashboard() {
  const { data: stats } = useQuoteStats()
  const { data: recent, isLoading } = useQuotes('', 0, 8)
  const { data: allProjects } = projects.useList()

  const tiles = [
    { label: 'New requests', value: stats?.newCount, to: '/admin/quotes?status=NEW', highlight: true },
    { label: 'Open leads', value: stats?.openCount, to: '/admin/quotes' },
    { label: 'Requests in last 7 days', value: stats?.lastSevenDays, to: '/admin/quotes' },
    { label: 'Published projects', value: allProjects?.filter((p) => p.published).length, to: '/admin/projects' },
  ]

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of quote requests and website content." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className={`rounded-md p-6 ring-1 transition hover:-translate-y-0.5 ${t.highlight ? 'bg-ink text-white ring-ink' : 'bg-white ring-ink/8'}`}>
            <p className={`text-sm ${t.highlight ? 'text-white/70' : 'text-stone'}`}>{t.label}</p>
            <p className={`mt-2 font-serif text-4xl ${t.highlight ? 'text-gold' : ''}`}>{t.value ?? '–'}</p>
          </Link>
        ))}
      </div>

      <Card className="mt-8 !p-0">
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
          <h2 className="font-serif text-xl">Recent quote requests</h2>
          <Link to="/admin/quotes" className="text-sm font-semibold hover:text-gold-dark">View all →</Link>
        </div>
        {isLoading ? <Loading /> : recent && recent.items.length === 0 ? (
          <div className="p-6"><Empty>No quote requests yet. They'll appear here as soon as someone submits the form.</Empty></div>
        ) : (
          <ul className="divide-y divide-ink/8">
            {recent?.items.map((q) => (
              <li key={q.id}>
                <Link to={`/admin/quotes/${q.id}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-cream">
                  <div>
                    <p className="font-semibold">{q.fullName}{q.company && <span className="font-normal text-stone"> · {q.company}</span>}</p>
                    <p className="text-sm text-stone">{q.siteLocation} · {fmtDateTime(q.createdAt)}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
