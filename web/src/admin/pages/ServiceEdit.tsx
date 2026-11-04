import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ApiError } from '../../lib/api'
import type { Service } from '../../lib/types'
import { ImagePicker } from '../components/ImagePicker'
import { useToast } from '../components/toast-context'
import { Card, ErrorNote, Field, Loading, PageHeader, Toggle } from '../components/ui'
import { services, type ServiceInput } from '../hooks'

const EMPTY: ServiceInput = {
  slug: null, title: '', category: 'CONSTRUCTION', summary: '', body: '', highlights: [], imageUrl: null,
  sortOrder: 100, featured: false, published: true, seoTitle: null, seoDescription: null,
}

export function ServiceEdit() {
  const id = useParams().id
  const { data, isLoading } = services.useList()
  if (id && isLoading) return <Loading />
  const existing = id ? data?.find((s) => s.id === Number(id)) : undefined
  if (id && !existing) return <ErrorNote error={new Error('Service not found')} />
  return <ServiceForm existing={existing} key={existing?.id ?? 'new'} />
}

function ServiceForm({ existing }: { existing?: Service }) {
  const [v, setV] = useState<ServiceInput>(existing ?? EMPTY)
  const [highlights, setHighlights] = useState((existing?.highlights ?? []).join('\n'))
  const save = services.useSave()
  const remove = services.useDelete()
  const toast = useToast()
  const navigate = useNavigate()
  const set = <K extends keyof ServiceInput>(k: K, val: ServiceInput[K]) => setV((p) => ({ ...p, [k]: val }))
  const errors = save.error instanceof ApiError ? save.error.fieldErrors : {}

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = { ...v, slug: v.slug?.trim() || null, highlights: highlights.split('\n').map((h) => h.trim()).filter(Boolean) }
    save.mutate({ id: existing?.id, body }, {
      onSuccess: () => { toast('Service saved'); navigate('/admin/services') },
    })
  }

  const del = () => {
    if (!existing || !confirm(`Delete "${existing.title}"? It will disappear from the website.`)) return
    remove.mutate(existing.id, { onSuccess: () => { toast('Service deleted'); navigate('/admin/services') } })
  }

  return (
    <form onSubmit={submit}>
      <Link to="/admin/services" className="text-sm text-stone hover:text-ink">← All services</Link>
      <PageHeader title={existing ? `Edit: ${existing.title}` : 'New service'}
        actions={<button type="submit" className="btn-gold" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save service'}</button>} />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="space-y-5">
          <Field label="Title *" error={errors.title} htmlFor="title">
            <input id="title" className="field" required value={v.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Short summary *" hint="One or two sentences, shown on service cards." error={errors.summary} htmlFor="summary">
            <textarea id="summary" rows={2} className="field" required maxLength={500} value={v.summary} onChange={(e) => set('summary', e.target.value)} />
          </Field>
          <Field label="Full description" hint="Shown on the service's own page. Leave a blank line between paragraphs." htmlFor="body">
            <textarea id="body" rows={8} className="field" value={v.body} onChange={(e) => set('body', e.target.value)} />
          </Field>
          <Field label="Key points" hint="One per line, e.g. “Fine dust removal”." error={errors.highlights} htmlFor="highlights">
            <textarea id="highlights" rows={4} className="field" value={highlights} onChange={(e) => setHighlights(e.target.value)} />
          </Field>
          <ImagePicker label="Image" value={v.imageUrl} onChange={(url) => set('imageUrl', url)} hint="A landscape photo works best (4:3)." />
        </Card>
        <div className="space-y-6">
          <Card className="space-y-5">
            <Field label="Category" htmlFor="category">
              <select id="category" className="field" value={v.category} onChange={(e) => set('category', e.target.value as ServiceInput['category'])}>
                <option value="CONSTRUCTION">Construction cleaning</option>
                <option value="GENERAL">General cleaning</option>
              </select>
            </Field>
            <Field label="Sort order" hint="Lower numbers appear first." htmlFor="sort">
              <input id="sort" type="number" className="field" value={v.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} />
            </Field>
            <Toggle checked={v.published} onChange={(b) => set('published', b)} label="Visible on website" />
            <Toggle checked={v.featured} onChange={(b) => set('featured', b)} label="Featured" />
          </Card>
          <Card className="space-y-5">
            <h2 className="font-serif text-lg">Search engines (optional)</h2>
            <Field label="Web address" hint={`novasitecare.co.ke/services/${v.slug || '…'} (generated from the title if empty)`} error={errors.slug} htmlFor="slug">
              <input id="slug" className="field" value={v.slug ?? ''} placeholder="post-construction-cleaning" onChange={(e) => set('slug', e.target.value.toLowerCase())} />
            </Field>
            <Field label="Page title" error={errors.seoTitle} htmlFor="seoTitle">
              <input id="seoTitle" className="field" maxLength={200} value={v.seoTitle ?? ''} onChange={(e) => set('seoTitle', e.target.value || null)} placeholder={`${v.title || 'Service'} in Nairobi`} />
            </Field>
            <Field label="Description" hint="About 150 characters, shown in Google results." error={errors.seoDescription} htmlFor="seoDescription">
              <textarea id="seoDescription" rows={3} maxLength={300} className="field" value={v.seoDescription ?? ''} onChange={(e) => set('seoDescription', e.target.value || null)} />
            </Field>
          </Card>
          <ErrorNote error={save.error} />
          {existing && <button type="button" onClick={del} className="text-sm text-red-700 hover:underline">Delete this service</button>}
        </div>
      </div>
    </form>
  )
}
