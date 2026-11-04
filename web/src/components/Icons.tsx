import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const IconCheck = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
export const IconArrow = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconMenu = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const IconClose = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const IconPhone = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>
)
export const IconMail = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3.5 6l8.5 7 8.5-7" /></svg>
)
export const IconPin = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
)
export const IconClock = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconShield = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
)
export const IconSparkle = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>
)
export const IconSearch = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
)
export const IconAward = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" /></svg>
)
export const IconWhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2a9.9 9.9 0 00-8.5 15.03L2 22l5.1-1.5A9.96 9.96 0 1012.04 2zm0 18.13a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.03.9.92-2.95-.2-.31a8.17 8.17 0 1113.97-5.67 8.17 8.17 0 01-7.18 9.36zm4.5-6.12c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 01-3.33-2.91c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 00-.65.3 2.74 2.74 0 00-.86 2.04 4.76 4.76 0 001 2.53 10.9 10.9 0 004.18 3.69c1.55.67 2.16.73 2.94.61a2.5 2.5 0 001.65-1.16 2.04 2.04 0 00.14-1.16c-.06-.1-.22-.16-.47-.28z" />
  </svg>
)
export const IconFacebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2A21 21 0 0014.6 2C12.2 2 10.6 3.4 10.6 6v2.5H8v3.4h2.6V22H14V11.9h2.7l.4-3.4z" /></svg>
)
export const IconInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
)
export const IconLinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06a4.2 4.2 0 013.78-2.07c4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.95c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4z" /></svg>
)
export const IconTikTok = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16.6 2h-3.4v13.4a2.9 2.9 0 11-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 105.4 6.2V8.6A8 8 0 0021 10V6.6a4.6 4.6 0 01-4.4-4.6z" /></svg>
)
