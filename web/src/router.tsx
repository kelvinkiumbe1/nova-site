import { createBrowserRouter } from 'react-router'

import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
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
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Admin dashboard is added in the next step (lazy-loaded so it never slows the public site).
])
