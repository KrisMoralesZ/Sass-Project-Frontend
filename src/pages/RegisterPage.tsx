import { Link } from 'react-router-dom'
import { paths } from '@/routes/paths'

export function RegisterPage() {
  return (
    <main>
      <h1>Create account</h1>
      <p>
        Registration UI will call <code>POST /auth/register</code> in Phase 1.
      </p>
      <p>
        Already have an account? <Link to={paths.login}>Sign in</Link>
      </p>
    </main>
  )
}
