import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AppThemeProvider from '@/styles/AppThemeProvider'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useListOrganizationMembers } from '@/features/organizations/hooks/use-list-organization-members'
import type { OrganizationMember } from '@/features/organizations/api/get-member'
import MembersPage from './MembersPage'

vi.mock('@/features/organizations/hooks/use-active-organization-id', () => ({
  useActiveOrganizationId: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-list-organization-members', () => ({
  useListOrganizationMembers: vi.fn(),
}))

const member: OrganizationMember = {
  id: 'membership-1',
  organizationId: 'org-1',
  userId: 'user-1',
  role: OrganizationRole.ADMIN,
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  avatarUrl: null,
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
}

const response = {
  items: [member],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

function renderPage() {
  return render(
    <AppThemeProvider>
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    </AppThemeProvider>,
  )
}

function mockReadyQuery(overrides = {}) {
  vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
  vi.mocked(useListOrganizationMembers).mockReturnValue({
    data: response,
    isPending: false,
    isError: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useListOrganizationMembers>)
}

describe('MembersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders members and their role badges', () => {
    mockReadyQuery()

    renderPage()

    expect(screen.getByRole('cell', { name: 'Jane Doe' })).toBeTruthy()
    expect(screen.getByRole('cell', { name: 'jane@example.com' })).toBeTruthy()
    expect(screen.getByText('Admin')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Jane Doe' }).getAttribute('href'),
    ).toBe('/members/user-1')
  })

  it('submits a search and resets pagination', async () => {
    const user = userEvent.setup()
    mockReadyQuery()

    renderPage()

    await user.type(
      screen.getByRole('textbox', { name: 'Search members' }),
      'jane',
    )
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(useListOrganizationMembers).toHaveBeenLastCalledWith('org-1', {
      page: 1,
      limit: 20,
      search: 'jane',
      sortBy: 'createdAt',
      sortOrder: 'ASC',
    })
  })

  it('renders loading and error states', () => {
    vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useListOrganizationMembers>)

    const { rerender } = renderPage()
    expect(screen.getByRole('status').textContent).toContain(
      'Loading members...',
    )

    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizationMembers>)
    rerender(
      <AppThemeProvider>
        <MembersPage />
      </AppThemeProvider>,
    )

    expect(screen.getByRole('alert').textContent).toContain(
      'Members could not be loaded',
    )
  })

  it('renders the empty state', () => {
    mockReadyQuery({ data: { ...response, items: [] } })

    renderPage()

    expect(
      screen.getByRole('cell', { name: 'No members in this workspace yet.' }),
    ).toBeTruthy()
  })

  it('explains a missing tenant context', () => {
    vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new ApiError({
        code: ErrorCode.TENANT_ORGANIZATION_REQUIRED,
        statusCode: 400,
        message: 'Organization context is required.',
      }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizationMembers>)

    renderPage()

    expect(screen.getByRole('alert').textContent).toContain(
      'Select a workspace',
    )
    expect(screen.getByRole('alert').textContent).toContain('view its members')
  })

  it('explains an unavailable workspace', () => {
    vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new ApiError({
        code: ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
        statusCode: 403,
        message: 'You do not have access to this organization.',
      }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizationMembers>)

    renderPage()

    expect(screen.getByRole('alert').textContent).toContain(
      'This workspace is unavailable',
    )
  })

  it('explains forbidden access and an archived workspace', () => {
    vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new ApiError({
        code: ErrorCode.FORBIDDEN,
        statusCode: 403,
        message: 'Missing required permission(s).',
      }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizationMembers>)

    const { rerender } = renderPage()
    expect(screen.getByRole('alert').textContent).toContain(
      'You cannot view these members',
    )

    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new ApiError({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        statusCode: 404,
        message: 'Organization not found',
      }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizationMembers>)
    rerender(
      <AppThemeProvider>
        <MemoryRouter>
          <MembersPage />
        </MemoryRouter>
      </AppThemeProvider>,
    )

    expect(screen.getByRole('alert').textContent).toContain(
      'This workspace is no longer available',
    )
  })
})
