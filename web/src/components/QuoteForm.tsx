import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ApiError, postJson } from '../lib/api'
import { useServices } from '../lib/queries'
import { IconCheck } from './Icons'
import { turnstileEnabled } from '../lib/turnstile'
import { Turnstile } from './Turnstile'

const schema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name').max(200),
  company: z.string().max(200).optional(),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{9,20}$/, 'Enter a valid phone number, e.g. 0712 345 678'),
  email: z.union([z.literal(''), z.email('Enter a valid email address')]).optional(),
  serviceSlug: z.string().optional(),
  propertyType: z.string().optional(),
  siteLocation: z.string().trim().min(2, 'Where is the site or property?').max(300),
  projectStage: z.string().optional(),
  sizeEstimate: z.string().max(100).optional(),
  preferredDate: z.string().optional(),
  message: z.string().max(4000).optional(),
  website: z.string().optional(), // honeypot
})
type FormValues = z.infer<typeof schema>

const PROPERTY_TYPES = ['Residential (apartment / house)', 'Residential development', 'Office', 'Commercial / retail', 'Industrial / warehouse', 'Institution (school, hospital…)', 'Other']
const STAGES = ['Construction ongoing', 'Between phases', 'Construction complete', 'Ready for handover', 'Occupied property', 'Moving in / out']

export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const { data: services = [] } = useServices()
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { serviceSlug: defaultService ?? '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      postJson<{ id: number | null }>('/api/public/quotes', {
        ...values,
        preferredDate: values.preferredDate || undefined,
        turnstileToken: token || undefined,
      }),
    onSuccess: () => reset(),
    onError: (err) => {
      if (err instanceof ApiError) {
        Object.entries(err.fieldErrors).forEach(([field, message]) =>
          setError(field as keyof FormValues, { message }))
      }
      setToken('')
      setResetKey((k) => k + 1)
    },
  })

  if (mutation.isSuccess) {
    return (
      <div className="bg-white p-10 text-center ring-1 ring-ink/8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold"><IconCheck className="h-8 w-8 text-ink" /></div>
        <h3 className="mt-6 text-2xl">Thank you, we've received your request</h3>
        <p className="mt-3 text-stone">Our team will review your project details and contact you shortly, usually within one business day.</p>
        <button type="button" className="btn-outline-dark mt-8" onClick={() => mutation.reset()}>Submit another request</button>
      </div>
    )
  }

  const err = (name: keyof FormValues) =>
    errors[name] && <p className="mt-1 text-xs text-red-700" role="alert">{errors[name]?.message}</p>

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="bg-white p-6 ring-1 ring-ink/8 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">Full name *</label>
          <input id="fullName" className="field" autoComplete="name" {...register('fullName')} />
          {err('fullName')}
        </div>
        <div>
          <label className="label" htmlFor="company">Company <span className="text-stone">(optional)</span></label>
          <input id="company" className="field" autoComplete="organization" {...register('company')} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone *</label>
          <input id="phone" type="tel" className="field" autoComplete="tel" placeholder="0712 345 678" {...register('phone')} />
          {err('phone')}
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="field" autoComplete="email" {...register('email')} />
          {err('email')}
        </div>
        <div>
          <label className="label" htmlFor="serviceSlug">Service needed</label>
          <select id="serviceSlug" className="field" {...register('serviceSlug')}>
            <option value="">Select a service</option>
            {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="propertyType">Property type</label>
          <select id="propertyType" className="field" {...register('propertyType')}>
            <option value="">Select type</option>
            {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="siteLocation">Site location *</label>
          <input id="siteLocation" className="field" placeholder="e.g. Kilimani, Nairobi" {...register('siteLocation')} />
          {err('siteLocation')}
        </div>
        <div>
          <label className="label" htmlFor="projectStage">Project stage</label>
          <select id="projectStage" className="field" {...register('projectStage')}>
            <option value="">Select stage</option>
            {STAGES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sizeEstimate">Approximate size</label>
          <input id="sizeEstimate" className="field" placeholder="e.g. 12 units / 800 m²" {...register('sizeEstimate')} />
        </div>
        <div>
          <label className="label" htmlFor="preferredDate">Preferred date</label>
          <input id="preferredDate" type="date" className="field" min={today} {...register('preferredDate')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">Project details</label>
          <textarea id="message" rows={5} className="field" placeholder="Tell us about the scope, access, timelines or anything else we should know." {...register('message')} />
        </div>
        {/* Honeypot: hidden from people, visible to naive bots */}
        <div className="absolute -left-[9999px]" aria-hidden>
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>
      </div>

      <div className="mt-6"><Turnstile onToken={setToken} resetKey={resetKey} /></div>

      {mutation.isError && (
        <p className="mt-6 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {mutation.error instanceof ApiError && Object.keys(mutation.error.fieldErrors).length > 0
            ? 'Please check the highlighted fields.'
            : mutation.error.message || 'Something went wrong. Please try again or contact us on WhatsApp.'}
        </p>
      )}

      <button type="submit" className="btn-gold mt-8 w-full sm:w-auto" disabled={mutation.isPending || (turnstileEnabled && !token)}>
        {mutation.isPending ? 'Sending…' : 'Submit Request'}
      </button>
      <p className="mt-4 text-xs text-stone">We'll only use your details to respond to this request.</p>
    </form>
  )
}
