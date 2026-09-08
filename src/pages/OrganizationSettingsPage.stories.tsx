import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { vi } from 'vitest'
import AppLayout from '@/components/layout/AppLayout'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import type { Organization } from '@/features/organizations/api/organization-api.types'
import { useActiveOrganizationId } from '@/features/organizations/hooks/use-active-organization-id'
import { useOrganization } from '@/features/organizations/hooks/use-organization'
import { useUpdateOrganization } from '@/features/organizations/hooks/use-update-organization'
import { usePermission } from '@/features/organizations/hooks/use-permission'
import { useArchiveOrganization } from '@/features/organizations/hooks/use-archive-organization'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { paths } from '@/routes/paths'
import OrganizationSettingsPage from './OrganizationSettingsPage'

vi.mock('@/features/auth/hooks/use-logout', () => ({
  useLogout: () => ({
    signOut: fn(),
    isLoggingOut: false,
  }),
}))

vi.mock('@/features/organizations/hooks/use-active-organization-id', () => ({
  useActiveOrganizationId: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-organization', () => ({
  useOrganization: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-update-organization', () => ({
  useUpdateOrganization: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-permission', () => ({
  usePermission: vi.fn(),
}))

vi.mock('@/features/organizations/hooks/use-archive-organization', () => ({
  useArchiveOrganization: vi.fn(),
}))

const organization: Organization = {
  id: 'org-acme',
  name: 'Acme',
  slug: 'acme',
  plan: 'FREE',
  settings: {
    timezone: 'America/New_York',
    locale: 'en',
    branding: {
      logoUrl: 'https://cdn.example.com/logo.png',
      primaryColor: '#1a5c40',
      accentColor: null,
      appName: 'Acme Workspace',
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
}

const mutate = fn()
const archiveMutateAsync = fn()

type SettingsPageScenario =
  | 'no-active-org'
  | 'loading'
  | 'load-not-found'
  | 'load-unavailable'
  | 'ready'
  | 'read-only'
  | 'permission-pending'
  | 'save-success'
  | 'save-forbidden'
  | 'save-validation'
  | 'archive-forbidden'

function mockPermission(scenario: SettingsPageScenario) {
  if (scenario === 'permission-pending') {
    vi.mocked(usePermission).mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      role: null,
      allowed: false,
    })
    return
  }

  if (scenario === 'read-only') {
    vi.mocked(usePermission).mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      role: 'VIEWER',
      allowed: false,
    })
    return
  }

  vi.mocked(usePermission).mockReturnValue({
    isPending: false,
    isError: false,
    error: null,
    role: 'OWNER',
    allowed: true,
  })
}

function mockSettingsPage(scenario: SettingsPageScenario) {
  mutate.mockReset()
  archiveMutateAsync.mockReset()
  mockPermission(scenario)

  if (scenario === 'no-active-org') {
    vi.mocked(useActiveOrganizationId).mockReturnValue(null)
    vi.mocked(useOrganization).mockReturnValue({
      isPending: false,
      isError: false,
      data: undefined,
      error: null,
      refetch: fn(),
    } as unknown as ReturnType<typeof useOrganization>)
    vi.mocked(useUpdateOrganization).mockReturnValue({
      mutate,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useUpdateOrganization>)
    vi.mocked(useArchiveOrganization).mockReturnValue({
      mutate: fn(),
      mutateAsync: archiveMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useArchiveOrganization>)
    return
  }

  vi.mocked(useActiveOrganizationId).mockReturnValue('org-acme')

  if (scenario === 'loading') {
    vi.mocked(useOrganization).mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: fn(),
    } as unknown as ReturnType<typeof useOrganization>)
  } else if (scenario === 'load-not-found') {
    vi.mocked(useOrganization).mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      error: new ApiError({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        statusCode: 404,
        message: 'Organization not found',
      }),
      refetch: fn(),
    } as unknown as ReturnType<typeof useOrganization>)
  } else if (scenario === 'load-unavailable') {
    vi.mocked(useOrganization).mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      error: new ApiError({
        code: ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
        statusCode: 403,
        message: 'You do not have access to this organization.',
      }),
      refetch: fn(),
    } as unknown as ReturnType<typeof useOrganization>)
  } else {
    vi.mocked(useOrganization).mockReturnValue({
      isPending: false,
      isError: false,
      data: organization,
      error: null,
      refetch: fn(),
    } as unknown as ReturnType<typeof useOrganization>)
  }

  if (scenario === 'save-success') {
    mutate.mockImplementation((_body, options) => {
      options?.onSuccess?.(organization, _body, undefined)
    })
  }

  vi.mocked(useUpdateOrganization).mockReturnValue({
    mutate,
    isPending: false,
    isError: scenario === 'save-forbidden' || scenario === 'save-validation',
    error:
      scenario === 'save-forbidden'
        ? new ApiError({
            code: ErrorCode.FORBIDDEN,
            statusCode: 403,
            message: 'Missing required permission(s): settings:update.',
          })
        : scenario === 'save-validation'
          ? new ApiError({
              code: ErrorCode.VALIDATION_FAILED,
              statusCode: 400,
              message: [
                'settings.locale must be shorter than or equal to 16 characters',
              ],
            })
          : null,
  } as unknown as ReturnType<typeof useUpdateOrganization>)

  vi.mocked(useArchiveOrganization).mockReturnValue({
    mutate: fn(),
    mutateAsync: archiveMutateAsync,
    isPending: false,
    isError: scenario === 'archive-forbidden',
    error:
      scenario === 'archive-forbidden'
        ? new ApiError({
            code: ErrorCode.FORBIDDEN,
            statusCode: 403,
            message: 'Requires at least the OWNER role.',
          })
        : null,
  } as unknown as ReturnType<typeof useArchiveOrganization>)
}

const meta = {
  title: 'Pages/OrganizationSettingsPage',
  component: OrganizationSettingsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      mockSettingsPage(
        (context.parameters.settingsPageScenario as SettingsPageScenario) ??
          'ready',
      )

      return (
        <MemoryRouter initialEntries={[paths.settings]}>
          <AuthSessionProvider>
            <AppLayout>
              <Story />
            </AppLayout>
          </AuthSessionProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof OrganizationSettingsPage>

export default meta

type Story = StoryObj<typeof meta>

export const NoActiveOrganization: Story = {
  parameters: {
    settingsPageScenario: 'no-active-org',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Organization settings' }),
    ).toBeVisible()
    await expect(
      canvas.getByText(/Select a workspace in the sidebar/i),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  parameters: {
    settingsPageScenario: 'loading',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Loading workspace settings...'),
    ).toBeVisible()
  },
}

export const LoadNotFound: Story = {
  parameters: {
    settingsPageScenario: 'load-not-found',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('alert').querySelector('h2'),
    ).toHaveTextContent(/no longer available/i)
    await expect(canvas.getByText(/archived or deleted/i)).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Try again' }),
    ).toBeEnabled()
  },
}

export const LoadUnavailable: Story = {
  parameters: {
    settingsPageScenario: 'load-unavailable',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('alert').querySelector('h2'),
    ).toHaveTextContent(/unavailable/i)
    await expect(canvas.getByText(/Choose another workspace/i)).toBeVisible()
  },
}

export const Default: Story = {
  parameters: {
    settingsPageScenario: 'ready',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Organization settings' }),
    ).toBeVisible()
    await expect(canvas.getByText('Acme')).toBeVisible()
    await expect(canvas.getByLabelText(/Timezone/i)).toHaveValue(
      'America/New_York',
    )
    await expect(
      canvas.getByRole('button', { name: 'Save settings' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Archive workspace' }),
    ).toBeVisible()
  },
}

export const ReadOnly: Story = {
  parameters: {
    settingsPageScenario: 'read-only',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/Timezone/i)).toBeDisabled()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      /only admins and owners/i,
    )
    await expect(
      canvas.queryByRole('button', { name: 'Save settings' }),
    ).toBeNull()
  },
}

export const PermissionPending: Story = {
  parameters: {
    settingsPageScenario: 'permission-pending',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      /Checking whether you can edit/i,
    )
  },
}

export const SaveSuccess: Story = {
  parameters: {
    settingsPageScenario: 'save-success',
  },
  play: async ({ canvas }) => {
    await userEvent.selectOptions(canvas.getByLabelText(/Locale/i), 'pt-BR')
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }))

    await waitFor(async () => {
      await expect(screen.getByText('Settings saved')).toBeVisible()
    })
    await expect(
      screen.getByText(/Acme now uses the updated defaults/i),
    ).toBeVisible()
  },
}

export const SaveForbidden: Story = {
  parameters: {
    settingsPageScenario: 'save-forbidden',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      /do not have permission to update/i,
    )
    await expect(canvas.getByLabelText(/Timezone/i)).toBeDisabled()
    await expect(
      canvas.queryByRole('button', { name: 'Save settings' }),
    ).toBeNull()
  },
}

export const SaveValidation: Story = {
  parameters: {
    settingsPageScenario: 'save-validation',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Locale must be 16 characters or fewer.'),
    ).toBeVisible()
  },
}

export const ArchiveForbidden: Story = {
  parameters: {
    settingsPageScenario: 'archive-forbidden',
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Archive workspace' }),
    )

    await waitFor(async () => {
      await expect(screen.getByRole('alert')).toHaveTextContent(
        /Only the workspace owner/i,
      )
    })
  },
}
