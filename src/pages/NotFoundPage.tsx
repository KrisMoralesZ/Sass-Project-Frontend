import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/routes/paths'

const NotFoundPage: FC = () => {
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

export default NotFoundPage
