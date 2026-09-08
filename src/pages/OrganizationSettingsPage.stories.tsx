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

type SettingsPageScenario =
  | 'no-active-org'
  | 'loading'
  | 'load-error'
  | 'ready'
  | 'save-success'
  | 'save-error'

function mockSettingsPage(scenario: SettingsPageScenario) {
  mutate.mockReset()

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
  } else if (scenario === 'load-error') {
    vi.mocked(useOrganization).mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      error: new Error('Failed to load organization'),
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
    isError: scenario === 'save-error',
    error:
      scenario === 'save-error'
        ? new Error('You do not have permission to update these settings.')
        : null,
  } as unknown as ReturnType<typeof useUpdateOrganization>)
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

export const LoadError: Story = {
  parameters: {
    settingsPageScenario: 'load-error',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failed to load organization')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Try again' }),
    ).toBeEnabled()
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

export const SaveError: Story = {
  parameters: {
    settingsPageScenario: 'save-error',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      /do not have permission/i,
    )
  },
}
