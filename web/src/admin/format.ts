import type { QuoteStatus } from '../lib/types'

export const STATUS_LABELS: Record<QuoteStatus, string> = {
  NEW: 'New', CONTACTED: 'Contacted', QUOTED: 'Quoted', WON: 'Won', LOST: 'Lost',
}
export const STATUSES = Object.keys(STATUS_LABELS) as QuoteStatus[]

const dateTime = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium' })
export const fmtDateTime = (iso: string) => dateTime.format(new Date(iso))
export const fmtDate = (iso: string) => dateOnly.format(new Date(iso.length === 10 ? iso + 'T00:00:00' : iso))
export const fmtBytes = (n: number) => (n > 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`)

/** Turns a phone number typed in Kenya into the international format wa.me expects. */
export function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('0')) return '254' + digits.slice(1)
  if (digits.length === 9) return '254' + digits
  return digits
}
