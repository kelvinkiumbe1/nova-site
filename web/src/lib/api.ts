/** Thin fetch wrapper for the Spring Boot API (same origin; proxied to :8081 in dev). */

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>
  body: Record<string, unknown>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}, body: Record<string, unknown> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
    this.body = body
  }
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(name + '='))
    ?.split('=')[1]
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const method = (init.method ?? 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    const token = readCookie('XSRF-TOKEN')
    if (token) headers.set('X-XSRF-TOKEN', decodeURIComponent(token))
  }

  const res = await fetch(path, { ...init, headers, credentials: 'same-origin' })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    let fieldErrors: Record<string, string> = {}
    let body: Record<string, unknown> = {}
    try {
      body = await res.json()
      if (typeof body?.detail === 'string') message = body.detail
      if (body?.errors) fieldErrors = body.errors as Record<string, string>
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 413) message = 'That file is too large (max 15 MB).'
    throw new ApiError(res.status, message, fieldErrors, body)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const postJson = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const sendJson = <T>(method: 'PUT' | 'PATCH' | 'POST', path: string, body: unknown) =>
  api<T>(path, { method, body: JSON.stringify(body) })

export const del = (path: string) => api<void>(path, { method: 'DELETE' })
