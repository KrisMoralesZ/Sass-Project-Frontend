import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AppThemeProvider from '@/styles/AppThemeProvider'
import { ApiError } from '@/lib/api/api-error'
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

let revokeMutate: ReturnType<typeof vi.fn>

function mockPermissions(read: boolean, revoke = read) {
  const readPermission = OrganizationPermission.INVITE_READ
  const revokePermission = OrganizationPermission.INVITE_REVOKE

  vi.mocked(usePermission).mockImplementation((permission) => ({
    isPending: false,
    isError: false,
    error: null,
    role: OrganizationRole.ADMIN,
    allowed:
      permission === readPermission
        ? read
        : permission === revokePermission
          ? revoke
          : true,
  }) as ReturnType<typeof usePermission>)
}

function mockList(query: Partial<ReturnType<typeof useListInvitations>>) {
  vi.mocked(useListInvitations).mockReturnValue(
    query as unknown as ReturnType<typeof useListInvitations>,
  )
}

function renderComponent() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <PendingInvitations organizationId="org-1" />
      </AppThemeProvider>
    </QueryClientProvider>,
  )
}

describe('PendingInvitations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    revokeMutate = vi.fn()
    vi.mocked(useRevokeInvitation).mockReturnValue({
      mutate: revokeMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useRevokeInvitation>)
    mockPermissions(true)
    mockList({
      data: response,
      isPending: false,
      isError: false,
      isFetching: false,
    })
  })

  it('renders pending invitations with revoke actions', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', { name: 'Pending invitations' }),
    ).toBeTruthy()
    expect(screen.getByRole('cell', { name: 'carol@example.com' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Revoke' })).toBeTruthy()
  })

  it('renders nothing without invite:read', () => {
    mockPermissions(false)

    renderComponent()

    expect(
      screen.queryByRole('heading', { name: 'Pending invitations' }),
    ).toBeNull()
  })

  it('hides revoke actions without invite:revoke', () => {
    mockPermissions(true, false)

    renderComponent()

    expect(screen.getByRole('cell', { name: 'carol@example.com' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Revoke' })).toBeNull()
  })

  it('renders expired invitations as read-only', () => {
    mockList({ data: { ...response, items: [expiredInvitation] } })

    renderComponent()

    expect(screen.getByText('Expired')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Revoke' })).toBeNull()
  })

  it('renders the empty state', () => {
    mockList({
      data: { ...response, items: [], pagination: { ...response.pagination, total: 0 } },
    })

    renderComponent()

    expect(
      screen.getByRole('cell', { name: 'No pending invitations.' }),
    ).toBeTruthy()
  })

  it('confirms before revoking and calls the mutation on confirm', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Revoke' }))
    expect(
      screen.getByRole('dialog', { name: 'Revoke invitation' }),
    ).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Revoke invite' }))

    expect(revokeMutate).toHaveBeenCalledWith('invite-1', expect.any(Object))
  })

  it('shows a success toast after a successful revoke', async () => {
    const user = userEvent.setup()
    revokeMutate.mockImplementation((_id, options) => {
      options.onSuccess?.(invitation)
    })

    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Revoke' }))
    await user.click(screen.getByRole('button', { name: 'Revoke invite' }))

    expect(screen.getByText('Invite revoked')).toBeTruthy()
    expect(screen.getByText("carol@example.com's invite was revoked.")).toBeTruthy()
  })

  it('shows an error toast when a revoke fails', async () => {
    const user = userEvent.setup()
    revokeMutate.mockImplementation((_id, options) => {
      options.onError?.(
        new ApiError({
          code: 'FORBIDDEN',
          statusCode: 403,
          message: 'Missing required permission(s).',
        }),
      )
    })

    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Revoke' }))
    await user.click(screen.getByRole('button', { name: 'Revoke invite' }))

    expect(screen.getByText('Could not revoke invite')).toBeTruthy()
    expect(
      screen.getByText(
        'You do not have permission to revoke invitations. Ask an admin to update your role.',
      ),
    ).toBeTruthy()
  })
})