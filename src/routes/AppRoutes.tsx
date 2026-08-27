import type { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout, PublicLayout } from '@/components/layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import RegisterPage from '@/pages/RegisterPage'
import { RequireAuth } from './RequireAuth'
import { RequireGuest } from './RequireGuest'
import { paths } from './paths'

/**
 * Top-level route tree: guest shell vs authenticated workspace shell.
 */
const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route element={<RequireGuest />}>
        <Route element={<PublicLayout />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route
            path={paths.projects}
            element={
              <PlaceholderPage
                title="Projects"
                description="Project list and CRUD UI land in Phase 4."
              />
            }
          />
          <Route
            path={paths.members}
            element={
              <PlaceholderPage
                title="Members"
                description="Members directory lands in Phase 3."
              />
            }
          />
          <Route
            path={paths.settings}
            element={
              <PlaceholderPage
                title="Settings"
                description="Organization and profile settings land in Phases 2–3."
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
