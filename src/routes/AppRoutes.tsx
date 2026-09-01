import type { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '@/pages/HomePage'
import { CreateOrganizationPage } from '@/pages/CreateOrganizationPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import RequireAuth from './RequireAuth'
import RequireGuest from './RequireGuest'
import { RequireOrganization } from './RequireOrganization'
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
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route
            path={paths.createOrganization}
            element={<CreateOrganizationPage />}
          />
          <Route element={<RequireOrganization />}>
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
              path={paths.boards}
              element={
                <PlaceholderPage
                  title="Boards"
                  description="Board views land in Phase 5."
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
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
