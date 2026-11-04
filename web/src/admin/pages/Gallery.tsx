import { useState } from 'react'

import { ApiError } from '../../lib/api'
import type { MediaAsset } from '../../lib/types'
import { UploadDropzone } from '../components/MediaLibraryModal'
import { useToast } from '../components/toast-context'
import { Badge, Card, Empty, ErrorNote, Loading, PageHeader, Toggle } from '../components/ui'
import { fmtBytes } from '../format'
import { useDeleteMedia, useMedia, useUpdateMedia } from '../hooks'

export function Gallery() {
  const [page, setPage] = useState(0)
  const { data, isLoading, error } = useMedia(page)
  const [editing, setEditing] = useState<MediaAsset | null>(null)

  return (
    <>
      <PageHeader title="Gallery & media" description="All uploaded images. Switch on “Show in gallery” to feature a photo in the “Our teams at work” section." />
      <Card><UploadDropzone /></Card>
      <div className="mt-8">
        <ErrorNote error={error} />
        {isLoading ? <Loading /> : data?.items.length === 0 ? <Empty>No images uploaded yet.</Empty> : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data?.items.map((m) => (
              <button key={m.id} type="button" onClick={() => setEditing(m)} className="group overflow-hidden rounded-md bg-white text-left ring-1 ring-ink/8 transition hover:-translate-y-0.5">
                <div className="aspect-[4/3] bg-sand"><img src={m.url} alt={m.altText ?? ''} loading="lazy" className="h-full w-full object-cover" /></div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-sm">{m.caption || m.altText || <span className="text-red-700">Add a description</span>}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone">{m.width ? `${m.width}×${m.height} · ` : ''}{fmtBytes(m.sizeBytes)}</span>
                    {m.showInGallery && <Badge tone="gold">Gallery</Badge>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        {data && data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <button type="button" className="btn-outline-dark !px-3 !py-1.5" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page + 1} of {data.totalPages}</span>
            <button type="button" className="btn-outline-dark !px-3 !py-1.5" disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
      {editing && <EditMedia media={editing} onClose={() => setEditing(null)} key={editing.id} />}
    </>
  )
}

function EditMedia({ media, onClose }: { media: MediaAsset; onClose: () => void }) {
  const [altText, setAltText] = useState(media.altText ?? '')
  const [caption, setCaption] = useState(media.caption ?? '')
  const [showInGallery, setShowInGallery] = useState(media.showInGallery)
  const [sortOrder, setSortOrder] = useState(media.sortOrder)
  const [usedBy, setUsedBy] = useState<string[] | null>(null)
  const update = useUpdateMedia()
  const remove = useDeleteMedia()
  const toast = useToast()

  const save = () =>
    update.mutate({ id: media.id, body: { altText, caption, showInGallery, sortOrder } }, {
      onSuccess: () => { toast('Image updated'); onClose() },
    })

  const del = (force = false) => {
    if (!force && !confirm('Delete this image permanently?')) return
    remove.mutate({ id: media.id, force }, {
      onSuccess: () => { toast('Image deleted'); onClose() },
      onError: (e) => {
        if (e instanceof ApiError && e.status === 409) setUsedBy((e.body.usedBy as string[]) ?? [])
        else toast(e.message, 'error')
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md bg-white" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Edit image">
        <div className="grid md:grid-cols-2">
          <img src={media.url} alt={media.altText ?? ''} className="h-full max-h-[60vh] w-full bg-sand object-contain" />
          <div className="space-y-4 p-6">
            <div>
              <label className="label" htmlFor="alt">Description *</label>
              <input id="alt" className="field" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="e.g. Nova team polishing floors in a new office" />
              <p className="mt-1 text-xs text-stone">Describes the photo for Google and screen readers.</p>
            </div>
            <div>
              <label className="label" htmlFor="caption">Caption (optional)</label>
              <input id="caption" className="field" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <Toggle checked={showInGallery} onChange={setShowInGallery} label="Show in “Our teams at work” gallery" />
            {showInGallery && (
              <div>
                <label className="label" htmlFor="order">Gallery order</label>
                <input id="order" type="number" className="field" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
              </div>
            )}
            <p className="text-xs break-all text-stone">{media.originalName}</p>
            <ErrorNote error={update.error} />
            {usedBy && (
              <div className="rounded-sm bg-amber-50 p-3 text-sm text-amber-900">
                <p className="font-semibold">This image is still used on the website:</p>
                <ul className="mt-1 list-disc pl-5">{usedBy.map((u) => <li key={u}>{u}</li>)}</ul>
                <button type="button" className="mt-2 font-semibold text-red-700 hover:underline" onClick={() => del(true)}>Delete anyway</button>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <button type="button" className="text-sm text-red-700 hover:underline" onClick={() => del()}>Delete</button>
              <div className="flex gap-3">
                <button type="button" className="btn-outline-dark" onClick={onClose}>Cancel</button>
                <button type="button" className="btn-gold" disabled={update.isPending} onClick={save}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
