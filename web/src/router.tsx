import { createBrowserRouter } from 'react-router'

import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Projects } from './pages/Projects'
import { ServiceDetail } from './pages/ServiceDetail'
import { Services } from './pages/Services'
import { WhyChooseUs } from './pages/WhyChooseUs'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <Services /> },
      { path: '/services/:slug', element: <ServiceDetail /> },
      { path: '/about', element: <About /> },
      { path: '/projects', element: <Projects /> },
      { path: '/why-choose-us', element: <WhyChooseUs /> },
      // Lazy: the quote form's validation libraries only load when needed.
      { path: '/contact', lazy: async () => ({ Component: (await import('./pages/Contact')).Contact }) },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    // Lazy-loaded so the admin code never slows down the public site.
    path: '/admin/*',
    lazy: async () => ({ Component: (await import('./admin/AdminApp')).AdminApp }),
  },
])
