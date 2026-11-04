import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'

import { ensureCsrf, useMe } from './auth'
import { AdminLayout } from './components/AdminLayout'
import { ToastProvider } from './components/Toast'
import { Loading } from './components/ui'
import { Account } from './pages/Account'
import { Dashboard } from './pages/Dashboard'
import { Gallery } from './pages/Gallery'
import { Login } from './pages/Login'
import { ProjectEdit } from './pages/ProjectEdit'
import { ProjectsList } from './pages/ProjectsList'
import { QuoteDetail } from './pages/QuoteDetail'
import { Quotes } from './pages/Quotes'
import { ServiceEdit } from './pages/ServiceEdit'
import { ServicesList } from './pages/ServicesList'
import { Settings } from './pages/Settings'
import { Testimonials } from './pages/Testimonials'

function RequireAuth() {
  const { data: me, isLoading } = useMe()
  const location = useLocation()
  if (isLoading) return <Loading />
  if (!me) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function AdminApp() {
  useEffect(() => {
    document.title = 'Admin | Nova Site Care'
    // Keep the admin out of search results.
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    ensureCsrf().catch(() => {})
    return () => meta.remove()
  }, [])

  return (
    <ToastProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="quotes/:id" element={<QuoteDetail />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/new" element={<ServiceEdit />} />
            <Route path="services/:id" element={<ServiceEdit />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectEdit />} />
            <Route path="projects/:id" element={<ProjectEdit />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </ToastProvider>
  )
}
