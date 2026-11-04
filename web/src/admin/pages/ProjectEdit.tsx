import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ApiError } from '../../lib/api'
import { useServices } from '../../lib/queries'
import type { Project } from '../../lib/types'
import { ImagePicker, MultiImagePicker } from '../components/ImagePicker'
import { useToast } from '../components/toast-context'
import { Card, ErrorNote, Field, Loading, PageHeader, Toggle } from '../components/ui'
import { projects, type ProjectInput } from '../hooks'

const EMPTY: ProjectInput = {
  slug: null, title: '', location: null, serviceSlug: null, description: '', coverImageUrl: null,
  beforeImageUrl: null, afterImageUrl: null, gallery: [], completedOn: null, featured: false, published: false,
}

export function ProjectEdit() {
  const id = useParams().id
  const { data, isLoading } = projects.useList()
  if (id && isLoading) return <Loading />
  const existing = id ? data?.find((p) => p.id === Number(id)) : undefined
  if (id && !existing) return <ErrorNote error={new Error('Project not found')} />
  return <ProjectForm existing={existing} key={existing?.id ?? 'new'} />
}

function ProjectForm({ existing }: { existing?: Project }) {
  const [v, setV] = useState<ProjectInput>(existing ?? EMPTY)
  const { data: allServices = [] } = useServices()
  const save = projects.useSave()
  const remove = projects.useDelete()
  const toast = useToast()
  const navigate = useNavigate()
  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => setV((p) => ({ ...p, [k]: val }))
  const errors = save.error instanceof ApiError ? save.error.fieldErrors : {}

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate({ id: existing?.id, body: { ...v, slug: v.slug?.trim() || null } }, {
      onSuccess: () => { toast(v.published ? 'Project saved and published' : 'Project saved as draft'); navigate('/admin/projects') },
    })
  }

  const del = () => {
    if (!existing || !confirm(`Delete "${existing.title}"?`)) return
    remove.mutate(existing.id, { onSuccess: () => { toast('Project deleted'); navigate('/admin/projects') } })
  }

  return (
    <form onSubmit={submit}>
      <Link to="/admin/projects" className="text-sm text-stone hover:text-ink">← All projects</Link>
      <PageHeader title={existing ? `Edit: ${existing.title}` : 'New project'}
        actions={<button type="submit" className="btn-gold" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save project'}</button>} />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="space-y-5">
            <Field label="Project name *" error={errors.title} htmlFor="title">
              <input id="title" className="field" required value={v.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Riverside Apartments – Final Handover" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location" htmlFor="location">
                <input id="location" className="field" value={v.location ?? ''} onChange={(e) => set('location', e.target.value || null)} placeholder="e.g. Kilimani, Nairobi" />
              </Field>
              <Field label="Completed on" htmlFor="completedOn">
                <input id="completedOn" type="date" className="field" value={v.completedOn ?? ''} onChange={(e) => set('completedOn', e.target.value || null)} />
              </Field>
            </div>
            <Field label="Service provided" hint="Used for the Construction / Residential & Commercial filter." htmlFor="service">
              <select id="service" className="field" value={v.serviceSlug ?? ''} onChange={(e) => set('serviceSlug', e.target.value || null)}>
                <option value="">—</option>
                {allServices.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </Field>
            <Field label="Description" htmlFor="description">
              <textarea id="description" rows={5} className="field" value={v.description} onChange={(e) => set('description', e.target.value)} placeholder="Scope of work, size of the site, timeline, outcome…" />
            </Field>
          </Card>
          <Card className="space-y-6">
            <ImagePicker label="Cover photo" value={v.coverImageUrl} onChange={(u) => set('coverImageUrl', u)} hint="Shown on the project card." />
            <div className="grid gap-6 sm:grid-cols-2">
              <ImagePicker label="Before photo" value={v.beforeImageUrl} onChange={(u) => set('beforeImageUrl', u)} />
              <ImagePicker label="After photo" value={v.afterImageUrl} onChange={(u) => set('afterImageUrl', u)} />
            </div>
            <p className="text-xs text-stone">Add both a before and an after photo, taken from the same angle, to show the comparison slider on the website.</p>
            <MultiImagePicker label="More photos" value={v.gallery} onChange={(urls) => set('gallery', urls)} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="space-y-5">
            <Toggle checked={v.published} onChange={(b) => set('published', b)} label="Published on website" />
            <Toggle checked={v.featured} onChange={(b) => set('featured', b)} label="Featured (shown first and on the home page)" />
          </Card>
          <Card className="space-y-5">
            <Field label="Web address (optional)" hint="Generated from the name if left empty." error={errors.slug} htmlFor="slug">
              <input id="slug" className="field" value={v.slug ?? ''} onChange={(e) => set('slug', e.target.value.toLowerCase())} />
            </Field>
          </Card>
          <ErrorNote error={save.error} />
          {existing && <button type="button" onClick={del} className="text-sm text-red-700 hover:underline">Delete this project</button>}
        </div>
      </div>
    </form>
  )
}
