import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useListOrganizations } from '@/features/organizations/hooks/use-list-organizations'
import AppThemeProvider from '@/styles/AppThemeProvider'
import RequireOrganization from './RequireOrganization'

vi.mock('@/features/organizations/hooks/use-list-organizations', () => ({
  useListOrganizations: vi.fn(),
}))

function renderGuard() {
  return render(
    <AppThemeProvider>
      <MemoryRouter>
        <Routes>
          <Route element={<RequireOrganization />}>
            <Route path="/" element={<div>Workspace home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AppThemeProvider>,
  )
}

describe('RequireOrganization', () => {
  it('shows a loading message while organizations are fetching', () => {
    vi.mocked(useListOrganizations).mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizations>)

    renderGuard()

    expect(screen.getByText('Loading your workspaces...')).toBeTruthy()
  })

  it('prompts users to create a workspace when the list is empty', () => {
    vi.mocked(useListOrganizations).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizations>)

    renderGuard()

    expect(screen.getByText('Create your first workspace')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Create organization' }),
    ).toBeTruthy()
  })

  it('renders the outlet when the user has at least one workspace', () => {
    vi.mocked(useListOrganizations).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        items: [
          {
            id: 'org-1',
            name: 'Acme',
            slug: 'acme',
            plan: 'FREE',
            settings: {
              timezone: 'UTC',
              locale: 'en',
              branding: {
                logoUrl: null,
                primaryColor: null,
                accentColor: null,
                appName: null,
              },
              featureFlags: {
                betaBoards: false,
                advancedReports: false,
                memberInvites: false,
                customBranding: false,
              },
            },
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizations>)

    renderGuard()

    expect(screen.getByText('Workspace home')).toBeTruthy()
  })
})
