import { Link } from 'react-router-dom'
import { paths } from '@/routes/paths'
import type { FC } from 'react'

const RegisterPage: FC = () => {
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

export default RegisterPage