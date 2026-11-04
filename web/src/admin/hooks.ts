import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, del, sendJson } from '../lib/api'
import type { MediaAsset, Page, Project, Quote, QuoteStats, QuoteStatus, Service, SiteSettings, Testimonial } from '../lib/types'

/** After any admin write, refresh both admin lists and the public site's cached data. */
function useInvalidate() {
  const qc = useQueryClient()
  return (...keys: string[][]) => {
    keys.forEach((k) => qc.invalidateQueries({ queryKey: k }))
    qc.invalidateQueries({ queryKey: ['public'] })
  }
}

// ---- quotes ----
export const useQuoteStats = () =>
  useQuery({ queryKey: ['admin', 'quotes', 'stats'], queryFn: () => api<QuoteStats>('/api/admin/quotes/stats') })

export const useQuotes = (status: QuoteStatus | '', page: number, size = 20) =>
  useQuery({
    queryKey: ['admin', 'quotes', 'list', status, page, size],
    queryFn: () => api<Page<Quote>>(`/api/admin/quotes?page=${page}&size=${size}${status ? `&status=${status}` : ''}`),
    placeholderData: (prev) => prev,
  })

export const useQuote = (id: number) =>
  useQuery({ queryKey: ['admin', 'quotes', id], queryFn: () => api<Quote>(`/api/admin/quotes/${id}`) })

export function useUpdateQuote(id: number) {
  const invalidate = useInvalidate()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { status: QuoteStatus; adminNotes: string }) => sendJson<Quote>('PATCH', `/api/admin/quotes/${id}`, body),
    onSuccess: (updated) => {
      qc.setQueryData(['admin', 'quotes', id], updated)
      invalidate(['admin', 'quotes', 'list'], ['admin', 'quotes', 'stats'])
    },
  })
}

export function useDeleteQuote() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => del(`/api/admin/quotes/${id}`),
    onSuccess: () => invalidate(['admin', 'quotes']),
  })
}

// ---- generic CRUD for services / projects / testimonials ----
function crud<T extends { id: number }, U>(resource: string) {
  const base = `/api/admin/${resource}`
  return {
    useList: () => useQuery({ queryKey: ['admin', resource], queryFn: () => api<T[]>(base) }),
    useSave: () => {
      const invalidate = useInvalidate()
      return useMutation({
        mutationFn: ({ id, body }: { id?: number; body: U }) =>
          id ? sendJson<T>('PUT', `${base}/${id}`, body) : sendJson<T>('POST', base, body),
        onSuccess: () => invalidate(['admin', resource]),
      })
    },
    useDelete: () => {
      const invalidate = useInvalidate()
      return useMutation({
        mutationFn: (id: number) => del(`${base}/${id}`),
        onSuccess: () => invalidate(['admin', resource]),
      })
    },
  }
}

/** slug is optional on input: the server generates it from the title when empty. */
export type ServiceInput = Omit<Service, 'id' | 'updatedAt' | 'slug'> & { slug: string | null }
export type ProjectInput = Omit<Project, 'id' | 'updatedAt' | 'slug'> & { slug: string | null }
export type TestimonialInput = Omit<Testimonial, 'id'>

export const services = crud<Service, ServiceInput>('services')
export const projects = crud<Project, ProjectInput>('projects')
export const testimonials = crud<Testimonial, TestimonialInput>('testimonials')

// ---- settings ----
export const useAdminSettings = () =>
  useQuery({ queryKey: ['admin', 'settings'], queryFn: () => api<SiteSettings>('/api/admin/settings') })

export function useSaveSettings() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: SiteSettings) => sendJson<SiteSettings>('PUT', '/api/admin/settings', body),
    onSuccess: () => invalidate(['admin', 'settings']),
  })
}

// ---- media ----
export const useMedia = (page: number) =>
  useQuery({
    queryKey: ['admin', 'media', page],
    queryFn: () => api<Page<MediaAsset>>(`/api/admin/media?page=${page}&size=48`),
    placeholderData: (prev) => prev,
  })

export function useUploadMedia() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return api<MediaAsset>('/api/admin/media', { method: 'POST', body: fd })
    },
    onSuccess: () => invalidate(['admin', 'media']),
  })
}

export function useUpdateMedia() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Pick<MediaAsset, 'altText' | 'caption' | 'showInGallery' | 'sortOrder'> }) =>
      sendJson<MediaAsset>('PATCH', `/api/admin/media/${id}`, body),
    onSuccess: () => invalidate(['admin', 'media']),
  })
}

export function useDeleteMedia() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) => del(`/api/admin/media/${id}${force ? '?force=true' : ''}`),
    onSuccess: () => invalidate(['admin', 'media']),
  })
}

// ---- account ----
export const useChangePassword = () =>
  useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      sendJson<void>('POST', '/api/admin/account/password', body),
  })
