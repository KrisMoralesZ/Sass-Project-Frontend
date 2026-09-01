import type { FC } from 'react'

export interface IPlaceholderPage {
  title: string
  description: string
}

const PlaceholderPage: FC<IPlaceholderPage> = ({ title, description }) => {
  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  )
}

export default PlaceholderPage
