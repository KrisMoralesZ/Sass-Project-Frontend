import { Link, Outlet } from 'react-router-dom'
import { paths } from '@/routes/paths'

/**
 * Guest shell for login/register and other unauthenticated screens.
 * Visual styling lands with styled-components (task 0.1.4).
 */
export function PublicLayout() {
  return (
    <div>
      <header>
        <Link to={paths.login}>Sass Project</Link>
        <nav aria-label="Public">
          <Link to={paths.login}>Sign in</Link>
          <Link to={paths.register}>Create account</Link>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
