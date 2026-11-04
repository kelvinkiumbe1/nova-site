import { useEffect, useRef } from 'react'

import { TURNSTILE_SITE_KEY as SITE_KEY } from '../lib/turnstile'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Cloudflare Turnstile bot check. Renders nothing when VITE_TURNSTILE_SITE_KEY is unset (dev). */
export function Turnstile({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let cancelled = false
    const render = () => {
      if (cancelled || !ref.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        theme: 'light',
        callback: onToken,
        'expired-callback': () => onToken(''),
      })
    }
    if (window.turnstile) render()
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (!s) {
        s = document.createElement('script')
        s.src = SCRIPT_SRC
        s.async = true
        document.head.appendChild(s)
      }
      s.addEventListener('load', render)
    }
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  if (!SITE_KEY) return null
  return <div ref={ref} />
}
