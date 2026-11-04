import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

import { ApiError } from '../../lib/api'
import { useLogin, useMe } from '../auth'

export function Login() {
  const { data: me } = useMe()
  const login = useLogin()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (me) return <Navigate to={from} replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password }, { onSuccess: () => navigate(from, { replace: true }) })
  }

  const error = login.error instanceof ApiError && login.error.status === 401
    ? 'Incorrect email or password.'
    : login.error ? 'Could not sign in. Please try again.' : null

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-md bg-white p-8">
        <p className="font-serif text-2xl tracking-[0.18em]">NOVA</p>
        <p className="text-[0.62rem] tracking-[0.42em] text-gold-dark">SITE CARE ADMIN</p>
        <h1 className="mt-8 font-serif text-2xl">Sign in</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="username" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" className="btn-gold mt-6 w-full" disabled={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
