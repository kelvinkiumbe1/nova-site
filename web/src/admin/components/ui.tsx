import type { ReactNode } from 'react'

import type { QuoteStatus } from '../../lib/types'
import { STATUS_LABELS } from '../format'

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-serif text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md bg-white p-6 ring-1 ring-ink/8 ${className}`}>{children}</div>
}

export function Field({ label, error, hint, children, htmlFor }: {
  label: string; error?: string; hint?: string; children: ReactNode; htmlFor?: string
}) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-stone">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-700" role="alert">{error}</p>}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-gold' : 'bg-ink/20'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-5.5' : 'left-0.5'}`} />
      </button>
      {label}
    </label>
  )
}

const STATUS_STYLES: Record<QuoteStatus, string> = {
  NEW: 'bg-gold/20 text-gold-dark ring-gold/40',
  CONTACTED: 'bg-sky-50 text-sky-800 ring-sky-200',
  QUOTED: 'bg-violet-50 text-violet-800 ring-violet-200',
  WON: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  LOST: 'bg-ink/5 text-stone ring-ink/10',
}

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'green' }) {
  const t = { neutral: 'bg-ink/5 text-stone', gold: 'bg-gold/20 text-gold-dark', green: 'bg-emerald-50 text-emerald-800' }[tone]
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${t}`}>{children}</span>
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-md border border-dashed border-ink/15 p-10 text-center text-sm text-stone">{children}</div>
}

export function Loading() {
  return <p className="py-10 text-center text-sm text-stone">Loading…</p>
}

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null
  const msg = error instanceof Error ? error.message : 'Something went wrong.'
  return <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{msg}</p>
}
