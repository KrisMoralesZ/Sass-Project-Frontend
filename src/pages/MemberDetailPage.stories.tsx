import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, userEvent, waitFor } from 'storybook/test'
import { vi } from 'vitest'
import {
  getOrganizationMember,
  type OrganizationMember,
} from '@/features/organizations/api/get-member'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import { ApiError } from '@/lib/api/api-error'
import { paths } from '@/routes/paths'
import { ErrorCode } from '@/types/error-code'
import MemberDetailPage from './MemberDetailPage'

vi.mock('@/features/organizations/hooks/use-active-organization-id', () => ({
  useActiveOrganizationId: vi.fn(),
}))

vi.mock('@/features/organizations/api/get-member', () => {
  const getMemberMock = vi.fn()
  return {
    getOrganizationMember: getMemberMock,
    organizationMemberQueryOptions: (
      organizationId: string,
      userId: string,
    ) => ({
      queryKey: ['members', organizationId, userId],
      queryFn: () => getMemberMock(userId),
      enabled: organizationId.length > 0 && userId.length > 0,
    }),
  }
})

const memberWithAvatar: OrganizationMember = {
  id: 'membership-1',
  organizationId: 'org-1',
  userId: 'user-1',
  role: OrganizationRole.ADMIN,
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  avatarUrl: 'https://example.com/avatar.png',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
}

const memberWithoutAvatar: OrganizationMember = {
  ...memberWithAvatar,
  displayName: null,
  avatarUrl: null,
}

type MemberDetailScenario =
  | 'ready-with-avatar'
  | 'ready-without-avatar'
  | 'no-workspace'
  | 'loading'
  | 'error'

const meta = {
  title: 'Pages/MemberDetailPage',
  component: MemberDetailPage,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      vi.mocked(getOrganizationMember).mockReset()

      const scenario =
        (context.parameters.memberDetailScenario as MemberDetailScenario) ??
        'ready-with-avatar'

      if (scenario === 'no-workspace') {
        vi.mocked(useActiveOrganizationId).mockReturnValue(null)
      } else {
        vi.mocked(useActiveOrganizationId).mockReturnValue('org-1')
      }

      if (scenario === 'loading') {
        vi.mocked(getOrganizationMember).mockImplementation(
          () => new Promise(() => undefined),
        )
      } else if (scenario === 'error') {
        vi.mocked(getOrganizationMember).mockRejectedValue(
          new ApiError({
            code: ErrorCode.RESOURCE_NOT_FOUND,
            statusCode: 404,
            message: 'Organization not found',
          }),
        )
      } else if (scenario === 'ready-without-avatar') {
        vi.mocked(getOrganizationMember).mockResolvedValue(memberWithoutAvatar)
      } else {
        vi.mocked(getOrganizationMember).mockResolvedValue(memberWithAvatar)
      }

      return (
        <MemoryRouter initialEntries={[`${paths.members}/user-1`]}>
          <Routes>
            <Route path={paths.memberDetail} element={<Story />} />
          </Routes>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof MemberDetailPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('heading', {
        level: 1,
        name: 'Member details',
      }),
    ).toBeVisible()
    await expect(await canvas.findByText('Jane Doe')).toBeVisible()
    await expect(await canvas.findByAltText('Jane Doe')).toHaveAttribute(
      'src',
      'https://example.com/avatar.png',
    )
    await expect(canvas.getByText('jane@example.com')).toBeVisible()
    await expect(canvas.getByText('Admin')).toBeVisible()
    await expect(canvas.getByText('membership-1')).toBeVisible()
    await expect(canvas.getByText('user-1')).toBeVisible()
    await expect(canvas.getByText('org-1')).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Back to members' }),
    ).toHaveAttribute('href', paths.members)
  },
}

export const NoAvatar: Story = {
  parameters: {
    memberDetailScenario: 'ready-without-avatar',
  },
  play: async ({ canvas }) => {
    const emails = await canvas.findAllByText('jane@example.com')
    await expect(emails.length).toBeGreaterThan(0)
    await expect(canvas.queryByAltText('Jane Doe')).toBeNull()
  },
}

export const NoWorkspace: Story = {
  parameters: {
    memberDetailScenario: 'no-workspace',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Select a workspace to inspect a member.'),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  parameters: {
    memberDetailScenario: 'loading',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading member details...')).toBeVisible()
  },
}

export const Error: Story = {
  parameters: {
    memberDetailScenario: 'error',
  },
  play: async ({ canvas }) => {
    const alert = await canvas.findByRole('alert')
    await expect(alert).toHaveTextContent('Member not found')

    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await waitFor(() => {
      expect(getOrganizationMember).toHaveBeenCalledTimes(2)
    })
  },
}
