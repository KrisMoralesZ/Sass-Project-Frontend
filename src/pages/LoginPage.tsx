import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import { paths } from '@/routes/paths'

/** Local-only shell preview until login UI (1.2) ships. Not a real API session. */
const DEV_PREVIEW_TOKENS = {
  accessToken: 'dev-access-token',
  refreshToken: 'dev-refresh-token',
} as const

// TODO: Refactor this page to use FC instead of function component
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { establishSession } = useAuthSession()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? paths.home

  return (
    <main>
      <h1>Sign in</h1>
      <p>
        Login form and <code>POST /auth/login</code> wiring land in task 1.2.
      </p>
      {import.meta.env.DEV ? (
        <p>
          <button
            type="button"
            onClick={() => {
              establishSession({ ...DEV_PREVIEW_TOKENS })
              navigate(from, { replace: true })
            }}
          >
            Preview app shell (dev only)
          </button>
        </p>
      ) : null}
      <p>
        Need an account? <Link to={paths.register}>Create one</Link>
      </p>
    </main>
  )
}
