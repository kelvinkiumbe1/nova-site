import { useQuery } from '@tanstack/react-query'

import { api } from './api'
import type { GalleryItem, Project, Service, SiteSettings, Testimonial } from './types'

export const useServices = () =>
  useQuery({ queryKey: ['public', 'services'], queryFn: () => api<Service[]>('/api/public/services') })

export const useService = (slug: string) =>
  useQuery({
    queryKey: ['public', 'services', slug],
    queryFn: () => api<Service>(`/api/public/services/${encodeURIComponent(slug)}`),
  })

export const useProjects = () =>
  useQuery({ queryKey: ['public', 'projects'], queryFn: () => api<Project[]>('/api/public/projects') })

export const useTestimonials = () =>
  useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: () => api<Testimonial[]>('/api/public/testimonials'),
  })

export const useSettings = () =>
  useQuery({
    queryKey: ['public', 'settings'],
    queryFn: () => api<SiteSettings>('/api/public/settings'),
    staleTime: 10 * 60_000,
  })

export const useGallery = () =>
  useQuery({ queryKey: ['public', 'gallery'], queryFn: () => api<GalleryItem[]>('/api/public/gallery') })
