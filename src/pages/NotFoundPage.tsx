import { Link } from 'react-router-dom'
import { paths } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>That route does not exist yet.</p>
      <p>
        <Link to={paths.home}>Back to home</Link>
      </p>
    </main>
  )
}
