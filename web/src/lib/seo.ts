import { useEffect } from 'react'

const SITE = 'Nova Site Care'

/**
 * Sets the title and meta description in the browser. The server also injects these into the
 * initial HTML for crawlers and link previews (WhatsApp/Facebook), which don't run JavaScript.
 */
export function useSeo(title: string | undefined, description?: string | null) {
  useEffect(() => {
    if (!title) return
    document.title = title.includes(SITE) ? title : `${title} | ${SITE}`
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
