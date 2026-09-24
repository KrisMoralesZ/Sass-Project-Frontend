import type { Meta, StoryObj } from '@storybook/react-vite'
import { vi } from 'vitest'
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

const meta = {
  title: 'Pages/MembersPage',
  component: MembersPage,
  tags: ['autodocs'],
} satisfies Meta<typeof MembersPage>

export default meta

type Story = StoryObj<typeof meta>

function renderScenario(
  query: Record<string, unknown>,
  organizationId: string | null = 'org-1',
) {
  vi.mocked(useActiveOrganizationId).mockReturnValue(organizationId)
  vi.mocked(useListOrganizationMembers).mockReturnValue(
    query as unknown as ReturnType<typeof useListOrganizationMembers>,
  )
  return <MembersPage />
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
}

export const Loading: Story = {
  render: () =>
    renderScenario({ data: undefined, isPending: true, isError: false }),
}

export const NoWorkspace: Story = {
  render: () =>
    renderScenario(
      { data: undefined, isPending: false, isError: false },
      null,
    ),
}

export const Error: Story = {
  render: () =>
    renderScenario({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'Server error',
        500,
      ),
    }),
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
}