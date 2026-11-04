import { useState } from 'react'

import { ApiError } from '../../lib/api'
import type { Testimonial } from '../../lib/types'
import { useToast } from '../components/toast-context'
import { Badge, Card, Empty, ErrorNote, Field, Loading, PageHeader, Toggle } from '../components/ui'
import { testimonials, type TestimonialInput } from '../hooks'

const EMPTY: TestimonialInput = { authorName: '', authorRole: null, company: null, quote: '', sortOrder: 100, published: true }

export function Testimonials() {
  const { data, isLoading, error } = testimonials.useList()
  const [editing, setEditing] = useState<Testimonial | 'new' | null>(null)

  return (
    <>
      <PageHeader title="Testimonials" description="Client feedback shown on the Home and Why Choose Us pages (up to three)."
        actions={<button type="button" className="btn-gold" onClick={() => setEditing('new')}>+ New testimonial</button>} />
      {editing && (
        <TestimonialForm key={editing === 'new' ? 'new' : editing.id} existing={editing === 'new' ? undefined : editing} onDone={() => setEditing(null)} />
      )}
      <ErrorNote error={error} />
      {isLoading ? <Loading /> : data?.length === 0 && !editing ? (
        <Empty>No testimonials yet. Only add genuine feedback from real clients, with their permission.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((t) => (
            <Card key={t.id}>
              <p className="leading-relaxed">“{t.quote}”</p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="font-semibold">{t.authorName}</p>
                  <p className="text-sm text-stone">{[t.authorRole, t.company].filter(Boolean).join(', ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  {!t.published && <Badge>Hidden</Badge>}
                  <button type="button" className="text-sm font-semibold hover:text-gold-dark" onClick={() => setEditing(t)}>Edit</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

function TestimonialForm({ existing, onDone }: { existing?: Testimonial; onDone: () => void }) {
  const [v, setV] = useState<TestimonialInput>(existing ?? EMPTY)
  const save = testimonials.useSave()
  const remove = testimonials.useDelete()
  const toast = useToast()
  const set = <K extends keyof TestimonialInput>(k: K, val: TestimonialInput[K]) => setV((p) => ({ ...p, [k]: val }))
  const errors = save.error instanceof ApiError ? save.error.fieldErrors : {}

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate({ id: existing?.id, body: v }, { onSuccess: () => { toast('Testimonial saved'); onDone() } })
  }
  const del = () => {
    if (!existing || !confirm('Delete this testimonial?')) return
    remove.mutate(existing.id, { onSuccess: () => { toast('Testimonial deleted'); onDone() } })
  }

  return (
    <Card className="mb-8">
      <form onSubmit={submit} className="space-y-5">
        <h2 className="font-serif text-xl">{existing ? 'Edit testimonial' : 'New testimonial'}</h2>
        <Field label="Quote *" error={errors.quote} htmlFor="quote">
          <textarea id="quote" rows={4} required className="field" value={v.quote} onChange={(e) => set('quote', e.target.value)} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Name *" error={errors.authorName} htmlFor="authorName">
            <input id="authorName" required className="field" value={v.authorName} onChange={(e) => set('authorName', e.target.value)} />
          </Field>
          <Field label="Role" htmlFor="authorRole">
            <input id="authorRole" className="field" value={v.authorRole ?? ''} onChange={(e) => set('authorRole', e.target.value || null)} placeholder="e.g. Site Manager" />
          </Field>
          <Field label="Company" htmlFor="company">
            <input id="company" className="field" value={v.company ?? ''} onChange={(e) => set('company', e.target.value || null)} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Toggle checked={v.published} onChange={(b) => set('published', b)} label="Visible on website" />
          <label className="flex items-center gap-2 text-sm">Order
            <input type="number" className="field !w-24 !py-1.5" value={v.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
          </label>
        </div>
        <ErrorNote error={save.error} />
        <div className="flex items-center justify-between">
          {existing ? <button type="button" onClick={del} className="text-sm text-red-700 hover:underline">Delete</button> : <span />}
          <div className="flex gap-3">
            <button type="button" className="btn-outline-dark" onClick={onDone}>Cancel</button>
            <button type="submit" className="btn-gold" disabled={save.isPending}>Save</button>
          </div>
        </div>
      </form>
    </Card>
  )
}
