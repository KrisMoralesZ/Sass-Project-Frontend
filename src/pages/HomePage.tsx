import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main>
      <h1>Sass Project</h1>
      <p>
        Vite + React + React Router scaffold. See{' '}
        <code>docs/next-tasks-and-subtasks.md</code> for the implementation
        backlog.
      </p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </main>
  )
}
