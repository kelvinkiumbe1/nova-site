import { useState } from 'react'

import { MediaLibraryModal } from './MediaLibraryModal'

export function ImagePicker({ label, value, onChange, hint }: {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  hint?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex items-center gap-4">
        <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-sm bg-sand ring-1 ring-ink/10">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-stone">No image</span>}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className="btn-outline-dark !px-4 !py-2" onClick={() => setOpen(true)}>
            {value ? 'Change image' : 'Choose image'}
          </button>
          {value && (
            <button type="button" className="text-left text-xs text-red-700 hover:underline" onClick={() => onChange(null)}>Remove</button>
          )}
        </div>
      </div>
      {hint && <p className="mt-1 text-xs text-stone">{hint}</p>}
      <MediaLibraryModal open={open} onClose={() => setOpen(false)} onSelect={(urls) => onChange(urls[0] ?? null)} />
    </div>
  )
}

export function MultiImagePicker({ label, value, onChange }: { label: string; value: string[]; onChange: (urls: string[]) => void }) {
  const [open, setOpen] = useState(false)
  const move = (i: number, d: -1 | 1) => {
    const next = [...value]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div>
      <p className="label">{label}</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-sm ring-1 ring-ink/10">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 px-1.5 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move left">←</button>
              <button type="button" onClick={() => onChange(value.filter((u) => u !== url))} aria-label="Remove">Remove</button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move right">→</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setOpen(true)} className="grid aspect-square place-items-center rounded-sm border-2 border-dashed border-ink/15 text-sm text-stone hover:border-gold hover:text-ink">
          + Add
        </button>
      </div>
      <MediaLibraryModal multiple open={open} onClose={() => setOpen(false)}
        onSelect={(urls) => onChange([...value, ...urls.filter((u) => !value.includes(u))])} />
    </div>
  )
}
