import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import AppThemeProvider from '@/styles/AppThemeProvider'
import { createInvitation } from '../../api/create-invitation'
import type { Invitation } from '../../api/invitation-api.types'
import InviteMemberDialog from './index'

vi.mock('../../api/create-invitation', () => ({
  createInvitation: vi.fn(),
}))

const invitation: Invitation = {
  id: 'invite-1',
  organizationId: 'org-1',
  email: 'jane@example.com',
  role: OrganizationRole.MEMBER,
  status: 'pending',
  invitedByUserId: 'user-1',
  expiresAt: '2026-01-22T00:00:00.000Z',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
}

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </QueryClientProvider>
  )
}

function renderDialog(
  overrides: Partial<Parameters<typeof InviteMemberDialog>[0]> = {},
) {
  const props = {
    open: true,
    organizationId: 'org-1',
    onClose: vi.fn(),
    onInvited: vi.fn(),
    ...overrides,
  }

  render(<InviteMemberDialog {...props} />, { wrapper: Wrapper })

  return props
}

describe('InviteMemberDialog', () => {
  beforeEach(() => {
    vi.mocked(createInvitation).mockReset()
    vi.mocked(createInvitation).mockResolvedValue(invitation)
  })

  it('renders nothing when closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders the invite form with a default Member role', () => {
    renderDialog()

    expect(screen.getByRole('dialog', { name: 'Invite a member' })).toBeTruthy()
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeTruthy()

    const role = screen.getByRole('combobox', {
      name: 'Role',
    }) as HTMLSelectElement
    expect(role.value).toBe(OrganizationRole.MEMBER)
    expect(role.querySelectorAll('option')).toHaveLength(4)
  })

  it('validates the email before submitting', async () => {
    const user = userEvent.setup()
    const props = renderDialog()

    await user.click(screen.getByRole('button', { name: /send invite/i }))
    expect(await screen.findByText('Email is required')).toBeTruthy()
    expect(createInvitation).not.toHaveBeenCalled()

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'not-an-email',
    )
    await user.click(screen.getByRole('button', { name: /send invite/i }))
    expect(await screen.findByText('Enter a valid email address')).toBeTruthy()
    expect(createInvitation).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it('creates the invite with the chosen role and reports success', async () => {
    const user = userEvent.setup()
    const props = renderDialog()

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'jane@example.com',
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Role' }),
      OrganizationRole.ADMIN,
    )
    await user.click(screen.getByRole('button', { name: /send invite/i }))

    await waitFor(() => {
      expect(vi.mocked(createInvitation).mock.calls[0][0]).toEqual({
        email: 'jane@example.com',
        role: OrganizationRole.ADMIN,
      })
    })
    await waitFor(() => {
      expect(props.onInvited).toHaveBeenCalledWith(invitation)
      expect(props.onClose).toHaveBeenCalled()
    })
  })

  it('shows conflict errors on the email field', async () => {
    const user = userEvent.setup()
    vi.mocked(createInvitation).mockRejectedValue(
      new ApiError({
        code: ErrorCode.CONFLICT,
        statusCode: 409,
        message: 'Conflict',
      }),
    )
    const props = renderDialog()

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'taken@example.com',
    )
    await user.click(screen.getByRole('button', { name: /send invite/i }))

    expect(
      await screen.findByText(/pending invite or is already a member/),
    ).toBeTruthy()
    expect(props.onClose).not.toHaveBeenCalled()
  })
})
