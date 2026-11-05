import type { SiteSettings } from './types'

/** All public phone numbers, main line first. */
export function phones(s: SiteSettings | undefined): string[] {
  return [s?.phone, s?.phoneAlt].filter((p): p is string => !!p?.trim())
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** 254769479951 -> 0769 479 951 (how Kenyans read a number); other countries keep +international. */
export function displayWhatsApp(number: string) {
  const m = /^254(\d{3})(\d{3})(\d{3})$/.exec(number)
  return m ? `0${m[1]} ${m[2]} ${m[3]}` : `+${number}`
}
