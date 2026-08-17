import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main>
      <h1>Sass Project</h1>
      <p>
        Vite + React + React Router. Source layout lives under{' '}
        <code>src/</code> — see <code>src/README.md</code>.
      </p>
      <p>
        Implementation backlog:{' '}
        <code>docs/next-tasks-and-subtasks.md</code>
      </p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </main>
  )
}
