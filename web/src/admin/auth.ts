import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, ApiError, postJson } from '../lib/api'
import type { Me } from '../lib/types'

/** Ensures the XSRF-TOKEN cookie exists before any state-changing request. */
export const ensureCsrf = () => api<void>('/api/auth/csrf')

export function useMe() {
  return useQuery({
    queryKey: ['admin', 'me'],
    queryFn: async () => {
      try {
        return await api<Me>('/api/auth/me')
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null
        throw e
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      await ensureCsrf()
      return postJson<Me>('/api/auth/login', body)
    },
    onSuccess: async (me) => {
      // Session id and CSRF token change on login; fetch a fresh token for later writes.
      await ensureCsrf()
      qc.setQueryData(['admin', 'me'], me)
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api<void>('/api/auth/logout', { method: 'POST' }),
    onSettled: () => {
      qc.removeQueries({ queryKey: ['admin'] })
      qc.setQueryData(['admin', 'me'], null)
    },
  })
}
