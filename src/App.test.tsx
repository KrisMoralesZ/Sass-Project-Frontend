import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('@/routes', () => ({
  AppRoutes: () => <div data-testid="app-routes">Routes</div>,
}))

describe('App', () => {
  it('renders the route tree', () => {
    render(<App />)

    expect(screen.getByTestId('app-routes')).toBeTruthy()
  })
})
