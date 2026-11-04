import { Link } from 'react-router'

import { useSeo } from '../lib/seo'

export function NotFound() {
  useSeo('Page not found')
  return (
    <section className="container-page py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl">We couldn't find that page</h1>
      <p className="mt-4 text-stone">It may have moved. Let's get you back on track.</p>
      <Link to="/" className="btn-gold mt-8">Back to home</Link>
    </section>
  )
}
