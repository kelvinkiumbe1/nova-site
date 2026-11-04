export type ServiceCategory = 'CONSTRUCTION' | 'GENERAL'

export interface Service {
  id: number
  slug: string
  title: string
  category: ServiceCategory
  summary: string
  body: string
  highlights: string[]
  imageUrl: string | null
  sortOrder: number
  featured: boolean
  published: boolean
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
}

export interface Project {
  id: number
  slug: string
  title: string
  location: string | null
  serviceSlug: string | null
  description: string
  coverImageUrl: string | null
  beforeImageUrl: string | null
  afterImageUrl: string | null
  gallery: string[]
  completedOn: string | null
  featured: boolean
  published: boolean
  updatedAt: string
}

export interface Testimonial {
  id: number
  authorName: string
  authorRole: string | null
  company: string | null
  quote: string
  sortOrder: number
  published: boolean
}

export interface SiteSettings {
  companyName: string
  tagline: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  businessHours: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  linkedinUrl: string | null
  tiktokUrl: string | null
  mapEmbedUrl: string | null
  serviceAreas: string[]
}

export interface QuoteSubmission {
  fullName: string
  company?: string
  phone: string
  email?: string
  serviceSlug?: string
  propertyType?: string
  siteLocation: string
  projectStage?: string
  sizeEstimate?: string
  preferredDate?: string
  message?: string
  turnstileToken?: string
  website?: string
}
