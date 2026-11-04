import { useLocation } from 'react-router'

import { useSettings } from '../lib/queries'
import { whatsappLink } from '../lib/whatsapp'
import { IconWhatsApp } from './Icons'

export function WhatsAppButton() {
  const { data: settings } = useSettings()
  const { pathname } = useLocation()
  if (!settings?.whatsapp || pathname.startsWith('/admin')) return null

  const page = pathname === '/' ? 'your website' : `your website (${pathname})`
  return (
    <a
      href={whatsappLink(settings.whatsapp, `Hello Nova Site Care, I found you on ${page} and I'd like to ask about your cleaning services.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <IconWhatsApp className="h-7 w-7" />
    </a>
  )
}
