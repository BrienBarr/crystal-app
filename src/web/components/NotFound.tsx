import { Link } from 'react-router-dom'

export function NotFound({ message = 'Page not found' }: { message?: string }) {
  return (
    <main className="page">
      <h1 className="page-title">{message}</h1>
      <p>
        <Link to="/">Back to Browse</Link>
      </p>
    </main>
  )
}
