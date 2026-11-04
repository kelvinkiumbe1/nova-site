import { useEffect, useRef, useState } from 'react'

import { IconClose } from '../../components/Icons'
import { ApiError } from '../../lib/api'
import { useMedia, useUploadMedia } from '../hooks'
import { useToast } from './toast-context'

/** Pick existing images or upload new ones. Calls onSelect with the chosen image URLs. */
export function MediaLibraryModal({ open, onClose, onSelect, multiple = false }: {
  open: boolean
  onClose: () => void
  onSelect: (urls: string[]) => void
  multiple?: boolean
}) {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const { data, isLoading } = useMedia(page)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const toggle = (url: string) =>
    setSelected((s) => (multiple ? (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]) : [url]))

  const finish = () => {
    onSelect(selected)
    setSelected([])
    onClose()
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      className="m-auto h-[85vh] w-[min(64rem,95vw)] rounded-md p-0 backdrop:bg-ink/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-serif text-xl">Media library</h2>
          <button type="button" onClick={onClose} aria-label="Close"><IconClose className="h-6 w-6" /></button>
        </div>
        <div className="border-b border-ink/10 px-6 py-4">
          <UploadDropzone onUploaded={(url) => toggle(url)} />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && <p className="text-sm text-stone">Loading…</p>}
          {data && data.items.length === 0 && <p className="text-sm text-stone">No images yet. Upload your first one above.</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {data?.items.map((m) => {
              const isSel = selected.includes(m.url)
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggle(m.url)}
                  className={`relative aspect-square overflow-hidden rounded-sm ring-2 transition ${isSel ? 'ring-gold' : 'ring-transparent hover:ring-ink/20'}`}
                  aria-pressed={isSel}
                  title={m.altText ?? m.originalName ?? ''}
                >
                  <img src={m.url} alt={m.altText ?? ''} loading="lazy" className="h-full w-full object-cover" />
                  {isSel && <span className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-ink">✓</span>}
                </button>
              )
            })}
          </div>
          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <button type="button" className="btn-outline-dark !px-3 !py-1.5" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page + 1} of {data.totalPages}</span>
              <button type="button" className="btn-outline-dark !px-3 !py-1.5" disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-ink/10 px-6 py-4">
          <span className="text-sm text-stone">{selected.length} selected</span>
          <div className="flex gap-3">
            <button type="button" className="btn-outline-dark" onClick={onClose}>Cancel</button>
            <button type="button" className="btn-gold" disabled={selected.length === 0} onClick={finish}>
              {multiple ? 'Add selected' : 'Use image'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function UploadDropzone({ onUploaded }: { onUploaded?: (url: string) => void }) {
  const upload = useUploadMedia()
  const toast = useToast()
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const handle = async (files: FileList | null) => {
    if (!files?.length) return
    const list = Array.from(files)
    setProgress({ done: 0, total: list.length })
    let ok = 0
    for (const [i, f] of list.entries()) {
      try {
        const m = await upload.mutateAsync(f)
        ok++
        onUploaded?.(m.url)
      } catch (e) {
        toast(`${f.name}: ${e instanceof ApiError ? e.message : 'upload failed'}`, 'error')
      }
      setProgress({ done: i + 1, total: list.length })
    }
    setProgress(null)
    if (ok) toast(`${ok} image${ok > 1 ? 's' : ''} uploaded`)
    if (input.current) input.current.value = ''
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files) }}
      className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm transition ${dragging ? 'border-gold bg-gold/5' : 'border-ink/15'}`}
    >
      {progress ? (
        <p>Uploading {progress.done + 1 > progress.total ? progress.total : progress.done + 1} of {progress.total}…</p>
      ) : (
        <>
          <p>Drag photos here, or</p>
          <button type="button" className="btn-gold !py-2" onClick={() => input.current?.click()}>Choose files</button>
          <p className="text-xs text-stone">JPEG, PNG or WebP, up to 15 MB. Large photos are resized automatically.</p>
        </>
      )}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => handle(e.target.files)} />
    </div>
  )
}
