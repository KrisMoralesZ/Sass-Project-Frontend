import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { expect, userEvent } from 'storybook/test'
import { vi } from 'vitest'
import { setActiveOrganizationId } from '@/features/organizations/active-organization-storage'
import { useAcceptInvitation } from '@/features/invitations/hooks/use-accept-invitation'
import type { AcceptInvitationResponse } from '@/features/invitations/api/invitation-api.types'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { ApiError } from '@/lib/api/api-error'
import { paths } from '@/routes/paths'
import { ErrorCode } from '@/types/error-code'
import InviteAcceptPage from './InviteAcceptPage'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: vi.fn() }
})

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

function apiError(
  code: ErrorCode,
  message: string,
  statusCode: number,
): ApiError {
  return new ApiError({ code, statusCode, message })
}

type AcceptScenario =
  'ready' | 'missing-token' | 'accepting' | 'accepted' | 'error'

const navigateMock = vi.fn()
const acceptMutateMock = vi.fn()

const meta = {
  title: 'Pages/InviteAcceptPage',
  component: InviteAcceptPage,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      vi.mocked(useAcceptInvitation).mockReset()
      vi.mocked(setActiveOrganizationId).mockReset()
      vi.mocked(useNavigate).mockReturnValue(navigateMock)

      const scenario =
        (context.parameters.acceptScenario as AcceptScenario) ?? 'ready'
      const token =
        (context.parameters.acceptToken as string | undefined) ?? 'tok-123'
      const error = context.parameters.acceptError as ApiError | undefined

      if (scenario === 'accepting') {
        vi.mocked(useAcceptInvitation).mockReturnValue({
          mutate: vi.fn(),
          isPending: true,
          isError: false,
          isSuccess: false,
        } as unknown as ReturnType<typeof useAcceptInvitation>)
      } else if (scenario === 'error') {
        vi.mocked(useAcceptInvitation).mockReturnValue({
          mutate: acceptMutateMock,
          isPending: false,
          isError: true,
          isSuccess: false,
          error: error ?? apiError(ErrorCode.BAD_REQUEST, 'Invalid', 400),
        } as unknown as ReturnType<typeof useAcceptInvitation>)
      } else if (scenario === 'accepted') {
        vi.mocked(useAcceptInvitation).mockImplementation(
          (options) =>
            ({
              mutate: () => options?.onAccepted?.(acceptedResponse),
              isPending: false,
              isError: false,
              isSuccess: false,
            }) as unknown as ReturnType<typeof useAcceptInvitation>,
        )
      } else {
        vi.mocked(useAcceptInvitation).mockReturnValue({
          mutate: acceptMutateMock,
          isPending: false,
          isError: false,
          isSuccess: false,
        } as unknown as ReturnType<typeof useAcceptInvitation>)
      }

      const initialEntry = token
        ? `${paths.inviteAccept}?token=${token}`
        : paths.inviteAccept

      return (
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path={paths.inviteAccept} element={<Story />} />
          </Routes>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof InviteAcceptPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('heading', {
        level: 1,
        name: 'Accept your invitation',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Development build: no email is sent', { exact: false }),
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Accept invitation' }),
    )
    await expect(acceptMutateMock).toHaveBeenCalledWith({ token: 'tok-123' })
  },
}

export const MissingToken: Story = {
  parameters: { acceptToken: '' },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'Link is missing its token',
    )
    await expect(
      canvas.queryByRole('button', { name: 'Accept invitation' }),
    ).toBeNull()
  },
}

export const Accepting: Story = {
  parameters: { acceptScenario: 'accepting' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Accept invitation' })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-busy', 'true')
  },
}

export const Accepted: Story = {
  parameters: { acceptScenario: 'accepted' },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Accept invitation' }),
    )
    await expect(vi.mocked(setActiveOrganizationId)).toHaveBeenCalledWith(
      'org-1',
    )
    await expect(navigateMock).toHaveBeenCalledWith(paths.home, {
      replace: true,
    })
  },
}

export const ExpiredToken: Story = {
  parameters: {
    acceptScenario: 'error',
    acceptError: apiError(
      ErrorCode.BAD_REQUEST,
      'This invitation has expired. Ask for a new invitation.',
      400,
    ),
  },
  play: async ({ canvas }) => {
    const alert = await canvas.findByRole('alert')
    await expect(alert).toHaveTextContent('Invitation could not be accepted')
    await expect(alert).toHaveTextContent('expired')

    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await expect(acceptMutateMock).toHaveBeenCalledWith({ token: 'tok-123' })
  },
}

export const WrongEmail: Story = {
  parameters: {
    acceptScenario: 'error',
    acceptError: apiError(
      ErrorCode.FORBIDDEN,
      'This invitation was issued to a different email address',
      403,
    ),
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'different email address',
    )
  },
}

export const NotFound: Story = {
  parameters: {
    acceptScenario: 'error',
    acceptError: apiError(
      ErrorCode.RESOURCE_NOT_FOUND,
      'Invitation not found',
      404,
    ),
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'could not be found',
    )
  },
}

export const AlreadyMember: Story = {
  parameters: {
    acceptScenario: 'error',
    acceptError: apiError(
      ErrorCode.CONFLICT,
      'You are already a member of this organization',
      409,
    ),
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'already a member',
    )
  },
}
