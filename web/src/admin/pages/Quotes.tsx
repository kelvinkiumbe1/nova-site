import { Link, useSearchParams } from 'react-router'

import type { QuoteStatus } from '../../lib/types'
import { Card, Empty, ErrorNote, Loading, PageHeader, StatusBadge } from '../components/ui'
import { fmtDateTime, STATUS_LABELS, STATUSES } from '../format'
import { useQuotes } from '../hooks'

export function Quotes() {
  const [params, setParams] = useSearchParams()
  const status = (params.get('status') ?? '') as QuoteStatus | ''
  const page = Number(params.get('page') ?? 0)
  const { data, isLoading, error } = useQuotes(status, page)

  const go = (next: { status?: string; page?: number }) => {
    const p = new URLSearchParams(params)
    if (next.status !== undefined) { p.set('status', next.status); p.set('page', '0') }
    if (next.page !== undefined) p.set('page', String(next.page))
    if (!p.get('status')) p.delete('status')
    setParams(p)
  }

  return (
    <>
      <PageHeader title="Quote requests" description="Requests submitted through the website's quotation form." />
      <div className="mb-6 flex flex-wrap gap-2">
        {(['', ...STATUSES] as const).map((s) => (
          <button
            key={s || 'all'}
            type="button"
            onClick={() => go({ status: s })}
            className={`rounded-full px-4 py-1.5 text-sm transition ${status === s ? 'bg-ink text-gold' : 'bg-white ring-1 ring-ink/10 hover:bg-ink/5'}`}
          >
            {s ? STATUS_LABELS[s] : 'All'}
          </button>
        ))}
      </div>
      <ErrorNote error={error} />
      {isLoading ? <Loading /> : data && data.items.length === 0 ? (
        <Empty>No quote requests{status && ` with status "${STATUS_LABELS[status]}"`}.</Empty>
      ) : (
        <Card className="!p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 text-xs tracking-wider text-stone uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">Client</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                <th className="hidden px-6 py-3 font-semibold md:table-cell">Location</th>
                <th className="hidden px-6 py-3 font-semibold lg:table-cell">Received</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {data?.items.map((q) => (
                <tr key={q.id} className="hover:bg-cream">
                  <td className="px-6 py-4">
                    <Link to={`/admin/quotes/${q.id}`} className="font-semibold hover:text-gold-dark">{q.fullName}</Link>
                    {q.company && <p className="text-xs text-stone">{q.company}</p>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><a href={`tel:${q.phone.replace(/\s/g, '')}`} className="hover:text-gold-dark">{q.phone}</a></td>
                  <td className="hidden px-6 py-4 md:table-cell">{q.siteLocation}</td>
                  <td className="hidden px-6 py-4 whitespace-nowrap text-stone lg:table-cell">{fmtDateTime(q.createdAt)}</td>
                  <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-stone">{data.totalItems} requests</span>
          <div className="flex items-center gap-3">
            <button type="button" className="btn-outline-dark !px-3 !py-1.5" disabled={page === 0} onClick={() => go({ page: page - 1 })}>Previous</button>
            <span>Page {page + 1} of {data.totalPages}</span>
            <button type="button" className="btn-outline-dark !px-3 !py-1.5" disabled={page + 1 >= data.totalPages} onClick={() => go({ page: page + 1 })}>Next</button>
          </div>
        </div>
      )}
    </>
  )
}
