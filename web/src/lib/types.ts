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

export type QuoteStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST'

export interface Quote {
  id: number
  fullName: string
  company: string | null
  phone: string
  email: string | null
  serviceSlug: string | null
  propertyType: string | null
  siteLocation: string
  projectStage: string | null
  sizeEstimate: string | null
  preferredDate: string | null
  message: string | null
  status: QuoteStatus
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface QuoteStats {
  newCount: number
  openCount: number
  lastSevenDays: number
  total: number
}

export interface Page<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export interface MediaAsset {
  id: number
  url: string
  contentType: string
  width: number | null
  height: number | null
  sizeBytes: number
  originalName: string | null
  altText: string | null
  caption: string | null
  showInGallery: boolean
  sortOrder: number
  createdAt: string
}

export interface GalleryItem {
  id: number
  url: string
  altText: string | null
  caption: string | null
  width: number | null
  height: number | null
}

export interface Me {
  email: string
  fullName: string
  role: 'ADMIN' | 'EDITOR'
}
