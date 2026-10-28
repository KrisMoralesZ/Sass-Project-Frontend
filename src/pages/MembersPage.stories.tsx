import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { vi } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useListOrganizationMembers } from '@/features/organizations/hooks/use-list-organization-members'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import type { OrganizationMember } from '@/features/organizations/api/get-member'
import { paths } from '@/routes/paths'
import MembersPage from './MembersPage'

vi.mock('@/features/organizations/hooks/use-active-organization-id', () => ({
  useActiveOrganizationId: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-list-organization-members', () => ({
  useListOrganizationMembers: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-permission', () => ({
  usePermission: vi.fn(),
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

const memberWithoutDisplayName: OrganizationMember = {
  id: 'membership-2',
  organizationId: 'org-1',
  userId: 'user-2',
  role: OrganizationRole.MEMBER,
  email: 'bob@example.com',
  displayName: null,
  avatarUrl: null,
  createdAt: '2026-02-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
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

const meta = {
  title: 'Pages/MembersPage',
  component: MembersPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[paths.members]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof MembersPage>

export default meta

type Story = StoryObj<typeof meta>

function mockInvitePermission(allowed: boolean) {
  vi.mocked(usePermission).mockReturnValue({
    isPending: false,
    isError: false,
    error: null,
    role: allowed ? OrganizationRole.ADMIN : OrganizationRole.MEMBER,
    allowed,
  } as ReturnType<typeof usePermission>)
}

function renderScenario(
  query: Record<string, unknown>,
  organizationId: string | null = 'org-1',
) {
  vi.mocked(useActiveOrganizationId).mockReturnValue(organizationId)
  vi.mocked(useListOrganizationMembers).mockReturnValue(
    query as unknown as ReturnType<typeof useListOrganizationMembers>,
  )
  mockInvitePermission(true)
  return <MembersPage />
}

function mockPaginatedQuery() {
  vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
  vi.mocked(useListOrganizationMembers).mockImplementation((_orgId, query) => {
    const page = query?.page ?? 1
    return {
      data: {
        items: [member, memberWithoutDisplayName],
        pagination: {
          page,
          limit: 20,
          total: 2,
          totalPages: 2,
          hasNextPage: page < 2,
          hasPreviousPage: page > 1,
        },
      },
      isPending: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useListOrganizationMembers>
  })
  mockInvitePermission(true)
}

function apiError(
  code: ErrorCode,
  message: string,
  statusCode: number,
): ApiError {
  return new ApiError({ code, statusCode, message })
}

export const Default: Story = {
  render: () =>
    renderScenario({
      data: response,
      isPending: false,
      isError: false,
      isFetching: false,
    }),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Members' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Jane Doe' }),
    ).toHaveAttribute('href', `${paths.members}/user-1`)
    await expect(canvas.getByText('jane@example.com')).toBeVisible()
    await expect(canvas.getByText('Admin')).toBeVisible()
  },
}

export const Empty: Story = {
  render: () =>
    renderScenario({
      data: {
        ...response,
        items: [],
        pagination: { ...response.pagination, total: 0 },
      },
      isPending: false,
      isError: false,
      isFetching: false,
    }),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('No members in this workspace yet.'),
    ).toBeVisible()

    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Search members' }),
      'zebra',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }))

    await waitFor(async () => {
      await expect(
        canvas.getByText('No members match your search.'),
      ).toBeVisible()
    })
  },
}

export const Loading: Story = {
  render: () =>
    renderScenario({ data: undefined, isPending: true, isError: false }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading members...',
    )
  },
}

export const NoWorkspace: Story = {
  render: () =>
    renderScenario({ data: undefined, isPending: false, isError: false }, null),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Select a workspace to view its members.'),
    ).toBeVisible()
  },
}

const errorRefetch = vi.fn()

export const Error: Story = {
  render: () =>
    renderScenario({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(ErrorCode.INTERNAL_SERVER_ERROR, 'Server error', 500),
      refetch: errorRefetch,
    }),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('Members could not be loaded')
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await waitFor(() => {
      expect(errorRefetch).toHaveBeenCalled()
    })
  },
}

export const ErrorTenantForbidden: Story = {
  render: () =>
    renderScenario({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(
        ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
        'You do not have access to this organization.',
        403,
      ),
    }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'This workspace is unavailable',
    )
  },
}

export const ErrorForbidden: Story = {
  render: () =>
    renderScenario({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(
        ErrorCode.FORBIDDEN,
        'Missing required permission(s).',
        403,
      ),
    }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'You cannot view these members',
    )
  },
}

export const ErrorWorkspaceArchived: Story = {
  render: () =>
    renderScenario({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(
        ErrorCode.RESOURCE_NOT_FOUND,
        'Organization not found',
        404,
      ),
    }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'This workspace is no longer available',
    )
  },
}

export const Pagination: Story = {
  render: () => {
    mockPaginatedQuery()
    return <MembersPage />
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('bob@example.com').length).toBeGreaterThan(
      0,
    )
    await expect(canvas.getByText('Member')).toBeVisible()

    const next = canvas.getByRole('button', { name: 'Next' })
    await expect(next).toBeEnabled()
    await userEvent.click(next)

    await waitFor(() => {
      expect(useListOrganizationMembers).toHaveBeenLastCalledWith('org-1', {
        page: 2,
        limit: 20,
        search: undefined,
        sortBy: 'createdAt',
        sortOrder: 'ASC',
      })
    })

    const previous = canvas.getByRole('button', { name: 'Previous' })
    await expect(previous).toBeEnabled()
    await userEvent.click(previous)

    await waitFor(() => {
      expect(useListOrganizationMembers).toHaveBeenLastCalledWith('org-1', {
        page: 1,
        limit: 20,
        search: undefined,
        sortBy: 'createdAt',
        sortOrder: 'ASC',
      })
    })
  },
}

export const InviteMember: Story = {
  render: () =>
    renderScenario({
      data: response,
      isPending: false,
      isError: false,
      isFetching: false,
    }),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Invite member' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }))
    const dialog = await screen.findByRole('dialog', {
      name: 'Invite a member',
    })
    await expect(dialog).toBeVisible()
  },
}

export const NoInvitePermission: Story = {
  render: () => {
    vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
    vi.mocked(useListOrganizationMembers).mockReturnValue({
      data: response,
      isPending: false,
      isError: false,
      isFetching: false,
    } as unknown as ReturnType<typeof useListOrganizationMembers>)
    mockInvitePermission(false)
    return <MembersPage />
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Invite member' }),
    ).toBeNull()
  },
}
