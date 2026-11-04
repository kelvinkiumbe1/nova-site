import { useState } from 'react'

import { ApiError } from '../../lib/api'
import { useMe } from '../auth'
import { useToast } from '../components/toast-context'
import { Card, ErrorNote, Field, PageHeader } from '../components/ui'
import { useChangePassword } from '../hooks'

export function Account() {
  const { data: me } = useMe()
  const change = useChangePassword()
  const toast = useToast()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const mismatch = confirm.length > 0 && next !== confirm
  const errors = change.error instanceof ApiError ? change.error.fieldErrors : {}

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mismatch) return
    change.mutate({ currentPassword: current, newPassword: next }, {
      onSuccess: () => { toast('Password changed'); setCurrent(''); setNext(''); setConfirm('') },
    })
  }

  return (
    <>
      <PageHeader title="My account" description={me ? `Signed in as ${me.email}` : undefined} />
      <Card className="max-w-lg">
        <form onSubmit={submit} className="space-y-5">
          <h2 className="font-serif text-xl">Change password</h2>
          <Field label="Current password" htmlFor="cur">
            <input id="cur" type="password" autoComplete="current-password" required className="field" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <Field label="New password" hint="At least 12 characters." error={errors.newPassword} htmlFor="new">
            <input id="new" type="password" autoComplete="new-password" required minLength={12} className="field" value={next} onChange={(e) => setNext(e.target.value)} />
          </Field>
          <Field label="Confirm new password" error={mismatch ? "Passwords don't match" : undefined} htmlFor="confirm">
            <input id="confirm" type="password" autoComplete="new-password" required className="field" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </Field>
          {!errors.newPassword && <ErrorNote error={change.error} />}
          <button type="submit" className="btn-gold" disabled={change.isPending || mismatch}>Change password</button>
        </form>
      </Card>
    </>
  )
}
