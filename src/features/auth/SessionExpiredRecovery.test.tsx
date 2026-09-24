import { type ReactNode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { paths } from '@/routes/paths'
import SessionExpiredRecovery from './SessionExpiredRecovery'
import { notifySessionCleared } from './session-events'
import {
  SESSION_EXPIRED_MESSAGE,
  SESSION_EXPIRED_TITLE,
} from './session-expired-notice'

const navigate = vi.fn()

vi.mock('@/components/ui/Toast', () => ({
  default: ({
    open,
    title,
    children,
  }: {
    open: boolean
    title: string
    children: ReactNode
  }) =>
    open ? (
      <div>
        <span>{title}</span>
        <span>{children}</span>
      </div>
    ) : null,
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

function renderRecovery(initialPath: string) {
  window.history.pushState({}, '', initialPath)

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<SessionExpiredRecovery />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SessionExpiredRecovery', () => {
  it('shows a toast and redirects to login when the session expires', async () => {
    renderRecovery('/members')

    notifySessionCleared('expired')

    await waitFor(() => {
      expect(screen.getByText(SESSION_EXPIRED_TITLE)).toBeTruthy()
    })
    expect(screen.getByText(SESSION_EXPIRED_MESSAGE)).toBeTruthy()
    expect(navigate).toHaveBeenCalledWith(paths.login, { replace: true })
  })

  it('does not redirect when already on login or register', async () => {
    renderRecovery(paths.login)
    navigate.mockClear()

    notifySessionCleared('expired')

    await waitFor(() => {
      expect(screen.getByText(SESSION_EXPIRED_TITLE)).toBeTruthy()
    })
    expect(navigate).not.toHaveBeenCalled()
  })

  it('ignores explicit logout events', async () => {
    renderRecovery('/members')
    navigate.mockClear()

    notifySessionCleared('logout')

    await waitFor(() => {
      expect(screen.queryByText(SESSION_EXPIRED_TITLE)).toBeNull()
    })
    expect(navigate).not.toHaveBeenCalled()
  })
})
