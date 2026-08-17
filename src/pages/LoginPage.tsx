import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import { paths } from '@/routes/paths'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { enterDevPreviewSession } = useAuthSession()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? paths.home

  return (
    <main>
      <h1>Sign in</h1>
      <p>
        Auth API wiring lands in Phase 1. Use the preview action to exercise
        authenticated layouts now.
      </p>
      <button
        type="button"
        onClick={() => {
          enterDevPreviewSession()
          navigate(from, { replace: true })
        }}
      >
        Preview app shell
      </button>
      <p>
        Need an account? <Link to={paths.register}>Create one</Link>
      </p>
    </main>
  )
}
