import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import { vi } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import { OrganizationPermission } from '@/features/organizations/permissions/organization-permission'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { useListInvitations } from '../../hooks/use-list-invitations'
import { useRevokeInvitation } from '../../hooks/use-revoke-invitation'
import type { Invitation } from '../../api/invitation-api.types'
import PendingInvitations from './index'

vi.mock('@/features/organizations/hooks/use-permission', () => ({
  usePermission: vi.fn(),
}))

vi.mock('../../hooks/use-list-invitations', () => ({
  useListInvitations: vi.fn(),
}))

vi.mock('../../hooks/use-revoke-invitation', () => ({
  useRevokeInvitation: vi.fn(),
}))

const invitation: Invitation = {
  id: 'invite-1',
  organizationId: 'org-1',
  email: 'carol@example.com',
  role: OrganizationRole.MEMBER,
  status: 'pending',
  invitedByUserId: 'user-1',
  expiresAt: '2026-01-22T00:00:00.000Z',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
}

const expiredInvitation: Invitation = {
  ...invitation,
  id: 'invite-2',
  email: 'old@example.com',
  status: 'expired',
  expiresAt: '2026-01-01T00:00:00.000Z',
}

const response = {
  items: [invitation],
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
  title: 'Invitations/PendingInvitations',
  component: PendingInvitations,
  tags: ['autodocs'],
  args: { organizationId: 'org-1' },
} satisfies Meta<typeof PendingInvitations>

export default meta

type Story = StoryObj<typeof meta>

function mockPermissions(read: boolean, revoke = read) {
  const readPermission = OrganizationPermission.INVITE_READ
  const revokePermission = OrganizationPermission.INVITE_REVOKE

  vi.mocked(usePermission).mockImplementation((permission) => ({
    isPending: false,
    isError: false,
    error: null,
    role: OrganizationRole.ADMIN,
    allowed:
      permission === readPermission ? read : permission === revokePermission ? revoke : true,
  }) as ReturnType<typeof usePermission>)
}

function mockList(query: Record<string, unknown>) {
  vi.mocked(useListInvitations).mockReturnValue(
    query as unknown as ReturnType<typeof useListInvitations>,
  )
}

function mockRevokeReady() {
  vi.mocked(useRevokeInvitation).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useRevokeInvitation>)
}

const revokeMutateMock = vi.fn()

function apiError(
  code: ErrorCode,
  message: string,
  statusCode: number,
): ApiError {
  return new ApiError({ code, statusCode, message })
}

export const Default: Story = {
  render: (args) => {
    mockPermissions(true)
    mockRevokeReady()
    mockList({ data: response, isPending: false, isError: false })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Pending invitations' }),
    ).toBeVisible()
    await expect(canvas.getByRole('cell', { name: 'carol@example.com' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Revoke' })).toBeVisible()
  },
}

export const Empty: Story = {
  render: (args) => {
    mockPermissions(true)
    mockRevokeReady()
    mockList({
      data: { ...response, items: [], pagination: { ...response.pagination, total: 0 } },
      isPending: false,
      isError: false,
    })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('cell', { name: 'No pending invitations.' })).toBeVisible()
  },
}

export const Loading: Story = {
  render: (args) => {
    mockPermissions(true)
    mockRevokeReady()
    mockList({ data: undefined, isPending: true, isError: false })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading invitations...',
    )
  },
}

const errorRefetch = vi.fn()

export const ErrorForbidden: Story = {
  render: (args) => {
    mockPermissions(true)
    mockRevokeReady()
    mockList({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(ErrorCode.FORBIDDEN, 'Missing required permission(s).', 403),
      refetch: errorRefetch,
    })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent('You cannot view these invitations')
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await waitFor(() => {
      expect(errorRefetch).toHaveBeenCalled()
    })
  },
}

export const ErrorWorkspaceArchived: Story = {
  render: (args) => {
    mockPermissions(true)
    mockRevokeReady()
    mockList({
      data: undefined,
      isPending: false,
      isError: true,
      error: apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Organization not found', 404),
    })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'No invitations are available',
    )
  },
}

export const ExpiredOnly: Story = {
  render: (args) => {
    mockPermissions(true)
    mockRevokeReady()
    mockList({
      data: { ...response, items: [expiredInvitation] },
      isPending: false,
      isError: false,
    })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('cell', { name: 'old@example.com' }),
    ).toBeVisible()
    await expect(canvas.getByText('Expired')).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Revoke' })).toBeNull()
  },
}

export const CannotRevoke: Story = {
  render: (args) => {
    mockPermissions(true, false)
    mockRevokeReady()
    mockList({ data: response, isPending: false, isError: false })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('cell', { name: 'carol@example.com' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Revoke' })).toBeNull()
  },
}

export const CannotView: Story = {
  render: (args) => {
    mockPermissions(false)
    mockRevokeReady()
    mockList({ data: response, isPending: false, isError: false })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('heading', { name: 'Pending invitations' }),
    ).toBeNull()
  },
}

export const RevokeFlow: Story = {
  render: (args) => {
    mockPermissions(true)
    vi.mocked(useRevokeInvitation).mockReturnValue({
      mutate: revokeMutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useRevokeInvitation>)
    mockList({ data: response, isPending: false, isError: false })
    return <PendingInvitations organizationId={args.organizationId} />
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke' }))
    const dialog = canvas.getByRole('dialog', { name: 'Revoke invitation' })
    await expect(dialog).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke invite' }))
    await waitFor(() => {
      expect(revokeMutateMock).toHaveBeenCalledWith('invite-1', expect.any(Object))
    })
  },
}