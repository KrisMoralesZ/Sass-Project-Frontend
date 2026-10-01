import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from './paths'
import RequireGuest from './RequireGuest'

vi.mock('@/features/auth/useAuthSession', () => ({
  useAuthSession: vi.fn(),
}))

function renderWithSession(status: 'anonymous' | 'loading' | 'authenticated') {
  vi.mocked(useAuthSession).mockReturnValue({
    user: null,
    status,
    isAuthenticated: status === 'authenticated',
    establishSession: vi.fn(),
    clearSession: vi.fn(),
    syncSessionUserDisplayName: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={[paths.login]}>
      <Routes>
        <Route path={paths.home} element={<div>Home</div>} />
        <Route element={<RequireGuest />}>
          <Route path={paths.login} element={<div>Login</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireGuest', () => {
  it('renders nothing while the session is hydrating', () => {
    const { container } = renderWithSession('loading')
    expect(container.textContent).toBe('')
  })

  it('renders guest screens when anonymous', () => {
    renderWithSession('anonymous')
    expect(screen.getByText('Login')).toBeTruthy()
  })

  it('sends authenticated users home with replace navigation', () => {
    renderWithSession('authenticated')
    expect(screen.getByText('Home')).toBeTruthy()
  })
})
