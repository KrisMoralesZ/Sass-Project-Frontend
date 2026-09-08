import { render, screen } from '@testing-library/react'
import { MemoryRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from './paths'
import RequireAuth from './RequireAuth'

vi.mock('@/features/auth/useAuthSession', () => ({
  useAuthSession: vi.fn(),
}))

function LoginRedirectProbe() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from

  return <div data-testid="from">{from?.pathname ?? ''}</div>
}

function renderWithSession(
  status: 'anonymous' | 'loading' | 'authenticated',
  initialPath = '/projects',
) {
  vi.mocked(useAuthSession).mockReturnValue({
    user: null,
    status,
    isAuthenticated: status === 'authenticated',
    establishSession: vi.fn(),
    clearSession: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={paths.login} element={<LoginRedirectProbe />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/projects"
            element={
              <div>
                Protected
                <Outlet />
              </div>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  it('renders nothing while the session is hydrating', () => {
    const { container } = renderWithSession('loading')
    expect(container.textContent).toBe('')
  })

  it('redirects anonymous users to login', () => {
    renderWithSession('anonymous')
    expect(screen.getByTestId('from')).toBeTruthy()
  })

  it('preserves the intended destination in login redirect state', () => {
    renderWithSession('anonymous', '/projects')

    expect(screen.getByTestId('from').textContent).toBe('/projects')
  })

  it('renders the outlet when authenticated', () => {
    renderWithSession('authenticated')
    expect(screen.getByText('Protected')).toBeTruthy()
  })
})
