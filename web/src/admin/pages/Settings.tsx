import { useState } from 'react'

import { ApiError } from '../../lib/api'
import type { SiteSettings } from '../../lib/types'
import { useToast } from '../components/toast-context'
import { Card, ErrorNote, Field, Loading, PageHeader } from '../components/ui'
import { toWhatsAppNumber } from '../format'
import { useAdminSettings, useSaveSettings } from '../hooks'

export function Settings() {
  const { data, isLoading, error } = useAdminSettings()
  if (isLoading) return <Loading />
  if (!data) return <ErrorNote error={error} />
  return <SettingsForm initial={data} />
}

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [v, setV] = useState(initial)
  const [areas, setAreas] = useState(initial.serviceAreas.join('\n'))
  const save = useSaveSettings()
  const toast = useToast()
  const errors = save.error instanceof ApiError ? save.error.fieldErrors : {}
  const set = <K extends keyof SiteSettings>(k: K, val: SiteSettings[K]) => setV((p) => ({ ...p, [k]: val }))
  const text = (k: keyof SiteSettings) => ({
    value: (v[k] as string | null) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, (e.target.value || null) as never),
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: SiteSettings = {
      ...v,
      whatsapp: v.whatsapp ? toWhatsAppNumber(v.whatsapp) : null,
      mapEmbedUrl: extractMapSrc(v.mapEmbedUrl),
      serviceAreas: areas.split('\n').map((a) => a.trim()).filter(Boolean),
    }
    save.mutate(body, { onSuccess: (saved) => { setV(saved); toast('Settings saved') } })
  }

  return (
    <form onSubmit={submit}>
      <PageHeader title="Site settings" description="Company details used across the website: header, footer, contact page and WhatsApp button."
        actions={<button type="submit" className="btn-gold" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save settings'}</button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <h2 className="font-serif text-lg">Company</h2>
          <Field label="Company name *" error={errors.companyName} htmlFor="companyName"><input id="companyName" required className="field" {...text('companyName')} /></Field>
          <Field label="Tagline" hint="Shown in the footer." error={errors.tagline} htmlFor="tagline"><input id="tagline" className="field" {...text('tagline')} /></Field>
          <Field label="Office address" error={errors.address} htmlFor="address"><input id="address" className="field" {...text('address')} /></Field>
          <Field label="Business hours" error={errors.businessHours} htmlFor="hours"><input id="hours" className="field" {...text('businessHours')} placeholder="Mon – Sat, 7:00am – 6:00pm" /></Field>
        </Card>
        <Card className="space-y-5">
          <h2 className="font-serif text-lg">Contact</h2>
          <Field label="Phone" error={errors.phone} htmlFor="phone"><input id="phone" type="tel" className="field" {...text('phone')} placeholder="0712 345 678" /></Field>
          <Field label="WhatsApp number" hint="Turns on the floating WhatsApp button. e.g. 0712 345 678" error={errors.whatsapp} htmlFor="whatsapp">
            <input id="whatsapp" type="tel" className="field" {...text('whatsapp')} />
          </Field>
          <Field label="Email" error={errors.email} htmlFor="email"><input id="email" type="email" className="field" {...text('email')} /></Field>
        </Card>
        <Card className="space-y-5">
          <h2 className="font-serif text-lg">Social media</h2>
          <p className="-mt-3 text-xs text-stone">Paste full links starting with https://. Leave empty to hide an icon.</p>
          {([['facebookUrl', 'Facebook'], ['instagramUrl', 'Instagram'], ['linkedinUrl', 'LinkedIn'], ['tiktokUrl', 'TikTok']] as const).map(([k, label]) => (
            <Field key={k} label={label} error={errors[k]} htmlFor={k}><input id={k} type="url" className="field" {...text(k)} placeholder="https://" /></Field>
          ))}
        </Card>
        <Card className="space-y-5">
          <h2 className="font-serif text-lg">Map & coverage</h2>
          <Field label="Google Maps embed" error={errors.mapEmbedUrl} htmlFor="map"
            hint="In Google Maps: find your location → Share → Embed a map → Copy HTML, and paste it here.">
            <textarea id="map" rows={3} className="field font-mono text-xs" value={v.mapEmbedUrl ?? ''} onChange={(e) => set('mapEmbedUrl', e.target.value || null)} />
          </Field>
          <Field label="Areas served" hint="One per line." error={errors.serviceAreas} htmlFor="areas">
            <textarea id="areas" rows={8} className="field" value={areas} onChange={(e) => setAreas(e.target.value)} />
          </Field>
        </Card>
      </div>
      <div className="mt-6"><ErrorNote error={save.error} /></div>
    </form>
  )
}

/** Accepts either the embed URL or the full <iframe> HTML that Google Maps gives you. */
function extractMapSrc(input: string | null) {
  if (!input) return null
  const m = input.match(/src="([^"]+)"/)
  return (m ? m[1] : input).trim().replaceAll('&amp;', '&')
}
