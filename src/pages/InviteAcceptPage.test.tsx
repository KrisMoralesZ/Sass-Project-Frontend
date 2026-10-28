import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActiveOrganizationId } from '@/features/organizations/active-organization-storage'
import { useAcceptInvitation } from '@/features/invitations/hooks/use-accept-invitation'
import type { AcceptInvitationResponse } from '@/features/invitations/api/invitation-api.types'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { ApiError } from '@/lib/api/api-error'
import { paths } from '@/routes/paths'
import { ErrorCode } from '@/types/error-code'
import AppThemeProvider from '@/styles/AppThemeProvider'
import InviteAcceptPage from './InviteAcceptPage'

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
}))

vi.mock('@/features/organizations/active-organization-storage', () => ({
  setActiveOrganizationId: vi.fn(),
}))

vi.mock('@/features/invitations/hooks/use-accept-invitation', () => ({
  useAcceptInvitation: vi.fn(),
}))

const acceptedResponse: AcceptInvitationResponse = {
  invitation: {
    id: 'invite-1',
    organizationId: 'org-1',
    email: 'invitee@acme.local',
    role: OrganizationRole.MEMBER,
    status: 'accepted',
    invitedByUserId: 'owner-1',
    expiresAt: '2026-01-22T00:00:00.000Z',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  membership: {
    id: 'membership-1',
    organizationId: 'org-1',
    userId: 'user-1',
    role: OrganizationRole.MEMBER,
    email: 'invitee@acme.local',
    displayName: null,
    avatarUrl: null,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
}

const navigateMock = vi.fn()

function mockToken(token: string | null) {
  vi.mocked(useSearchParams).mockReturnValue([
    new URLSearchParams(token === null ? '' : { token }),
  ] as unknown as ReturnType<typeof useSearchParams>)
}

function renderPage() {
  return render(
    <AppThemeProvider>
      <InviteAcceptPage />
    </AppThemeProvider>,
  )
}

describe('InviteAcceptPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(navigateMock)
  })

  it('renders the accept prompt and submits the token', async () => {
    const user = userEvent.setup()
    const mutate = vi.fn()
    mockToken('tok-abc')
    vi.mocked(useAcceptInvitation).mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useAcceptInvitation>)

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Accept your invitation' }),
    ).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Accept invitation' }))
    expect(mutate).toHaveBeenCalledWith({ token: 'tok-abc' })
  })

  it('explains a missing token without offering to accept', () => {
    mockToken(null)
    vi.mocked(useAcceptInvitation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useAcceptInvitation>)

    renderPage()

    expect(screen.getByRole('alert').textContent).toContain(
      'Link is missing its token',
    )
    expect(
      screen.queryByRole('button', { name: 'Accept invitation' }),
    ).toBeNull()
  })

  it('activates the joined workspace and navigates home on success', async () => {
    const user = userEvent.setup()
    mockToken('tok-abc')
    vi.mocked(useAcceptInvitation).mockImplementation(
      (options) =>
        ({
          mutate: () => options?.onAccepted?.(acceptedResponse),
          isPending: false,
          isError: false,
          isSuccess: false,
        }) as unknown as ReturnType<typeof useAcceptInvitation>,
    )

    renderPage()

    await user.click(screen.getByRole('button', { name: 'Accept invitation' }))

    expect(setActiveOrganizationId).toHaveBeenCalledWith('org-1')
    expect(navigateMock).toHaveBeenCalledWith(paths.home, { replace: true })
  })

  it('maps expired-token failures and offers a retry', async () => {
    const user = userEvent.setup()
    const mutate = vi.fn()
    mockToken('tok-abc')
    vi.mocked(useAcceptInvitation).mockReturnValue({
      mutate,
      isPending: false,
      isError: true,
      isSuccess: false,
      error: new ApiError({
        code: ErrorCode.BAD_REQUEST,
        statusCode: 400,
        message: 'This invitation has expired. Ask for a new invitation.',
      }),
    } as unknown as ReturnType<typeof useAcceptInvitation>)

    renderPage()

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain('Invitation could not be accepted')
    expect(alert.textContent).toContain('expired')

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(mutate).toHaveBeenCalledWith({ token: 'tok-abc' })
  })
})
