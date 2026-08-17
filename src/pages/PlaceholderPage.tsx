export function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  )
}
