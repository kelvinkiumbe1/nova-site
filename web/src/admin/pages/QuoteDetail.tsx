import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { IconMail, IconPhone, IconWhatsApp } from '../../components/Icons'
import { useServices } from '../../lib/queries'
import type { Quote, QuoteStatus } from '../../lib/types'
import { whatsappLink } from '../../lib/whatsapp'
import { useToast } from '../components/toast-context'
import { Card, ErrorNote, Loading, PageHeader, StatusBadge } from '../components/ui'
import { fmtDate, fmtDateTime, STATUS_LABELS, STATUSES, toWhatsAppNumber } from '../format'
import { useDeleteQuote, useQuote, useUpdateQuote } from '../hooks'

export function QuoteDetail() {
  const id = Number(useParams().id)
  const { data: q, isLoading, error } = useQuote(id)
  if (isLoading) return <Loading />
  if (error || !q) return <ErrorNote error={error ?? new Error('Quote request not found')} />
  return <QuoteView q={q} key={q.updatedAt} />
}

function QuoteView({ q }: { q: Quote }) {
  const { data: services = [] } = useServices()
  const update = useUpdateQuote(q.id)
  const remove = useDeleteQuote()
  const toast = useToast()
  const navigate = useNavigate()
  const [status, setStatus] = useState<QuoteStatus>(q.status)
  const [notes, setNotes] = useState(q.adminNotes ?? '')

  const serviceTitle = services.find((s) => s.slug === q.serviceSlug)?.title ?? q.serviceSlug
  const firstName = q.fullName.split(' ')[0]
  const rows: [string, string | null | undefined][] = [
    ['Company', q.company],
    ['Service', serviceTitle],
    ['Property type', q.propertyType],
    ['Site location', q.siteLocation],
    ['Project stage', q.projectStage],
    ['Approximate size', q.sizeEstimate],
    ['Preferred date', q.preferredDate && fmtDate(q.preferredDate)],
    ['Received', fmtDateTime(q.createdAt)],
  ]

  const save = () =>
    update.mutate({ status, adminNotes: notes }, {
      onSuccess: () => toast('Quote request updated'),
      onError: (e) => toast(e.message, 'error'),
    })

  const del = () => {
    if (!confirm(`Delete the request from ${q.fullName}? This can't be undone.`)) return
    remove.mutate(q.id, { onSuccess: () => { toast('Quote request deleted'); navigate('/admin/quotes') } })
  }

  return (
    <>
      <Link to="/admin/quotes" className="text-sm text-stone hover:text-ink">← All quote requests</Link>
      <PageHeader title={q.fullName} actions={<StatusBadge status={q.status} />} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${q.phone.replace(/\s/g, '')}`} className="btn-gold !py-2"><IconPhone className="h-4 w-4" /> Call {q.phone}</a>
              <a href={whatsappLink(toWhatsAppNumber(q.phone), `Hello ${firstName}, this is Nova Site Care regarding your quotation request for ${q.siteLocation}.`)}
                target="_blank" rel="noopener noreferrer" className="btn-outline-dark !py-2"><IconWhatsApp className="h-4 w-4" /> WhatsApp</a>
              {q.email && <a href={`mailto:${q.email}?subject=${encodeURIComponent('Your quotation request – Nova Site Care')}`} className="btn-outline-dark !py-2"><IconMail className="h-4 w-4" /> Email</a>}
            </div>
            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {rows.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs tracking-wider text-stone uppercase">{k}</dt>
                  <dd className="mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
            {q.message && (
              <div className="mt-6 border-t border-ink/8 pt-6">
                <p className="text-xs tracking-wider text-stone uppercase">Project details</p>
                <p className="mt-2 whitespace-pre-line">{q.message}</p>
              </div>
            )}
          </Card>
        </div>
        <Card className="h-fit space-y-5">
          <h2 className="font-serif text-xl">Follow-up</h2>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" className="field" value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="notes">Internal notes</label>
            <textarea id="notes" rows={6} className="field" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Site visit booked for Tuesday 10am, quoted KES 85,000" />
            <p className="mt-1 text-xs text-stone">Only visible to admins.</p>
          </div>
          <ErrorNote error={update.error} />
          <button type="button" className="btn-gold w-full" disabled={update.isPending} onClick={save}>
            {update.isPending ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="w-full text-sm text-red-700 hover:underline" onClick={del}>Delete request</button>
        </Card>
      </div>
    </>
  )
}
