import { NavLink, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from '@/routes/paths'
import type { FC } from 'react'

const navItems = [
  { to: paths.home, label: 'Home' },
  { to: paths.projects, label: 'Projects' },
  { to: paths.members, label: 'Members' },
  { to: paths.settings, label: 'Settings' },
] as const

/**
 * Authenticated workspace shell with navigation placeholders.
 * Visual styling lands with styled-components (task 0.1.4).
 */
const AppLayout: FC = () => {
  const { clearSession } = useAuthSession()

  return (
    <div>
      <aside>
        <div>Sass Project</div>
        <nav aria-label="Workspace">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === paths.home}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={clearSession}>
          Sign out
        </button>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
