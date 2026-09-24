import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { vi } from 'vitest'
import AppLayout from '@/components/layout/AppLayout'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import { createOrganization } from '@/features/organizations/api/create-organization'
import type { Organization } from '@/features/organizations/api/organization-api.types'
import { ApiError } from '@/lib/api/api-error'
import { paths } from '@/routes/paths'
import { ErrorCode } from '@/types/error-code'
import CreateOrganizationPage from './CreateOrganizationPage'

const signOut = fn()

vi.mock('@/features/auth/hooks/use-logout', () => ({
  useLogout: () => ({
    signOut,
    isLoggingOut: false,
  }),
}))

vi.mock('@/features/organizations/api/create-organization', () => ({
  createOrganization: vi.fn(),
}))

const createdOrganization: Organization = {
  id: 'org-new',
  name: 'Acme Corporation',
  slug: 'acme-corp',
  plan: 'FREE',
  settings: {
    timezone: 'UTC',
    locale: 'en',
    branding: {
      logoUrl: null,
      primaryColor: null,
      accentColor: null,
      appName: null,
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

const meta = {
  title: 'Pages/CreateOrganizationPage',
  component: CreateOrganizationPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      sessionStorage.clear()
      vi.mocked(createOrganization).mockReset()

      const mockBehavior = context.parameters.createOrganizationMock as
        'success' | 'conflict' | 'generic-error' | 'pending' | undefined

      if (mockBehavior === 'success') {
        vi.mocked(createOrganization).mockResolvedValue(createdOrganization)
      } else if (mockBehavior === 'conflict') {
        vi.mocked(createOrganization).mockRejectedValue(
          new ApiError({
            code: ErrorCode.CONFLICT,
            statusCode: 409,
            message: 'Organization slug is already taken.',
          }),
        )
      } else if (mockBehavior === 'generic-error') {
        vi.mocked(createOrganization).mockRejectedValue(
          new ApiError({
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            statusCode: 500,
            message: 'Something went wrong while creating the workspace.',
          }),
        )
      } else if (mockBehavior === 'pending') {
        vi.mocked(createOrganization).mockImplementation(
          () => new Promise(() => undefined),
        )
      }

      return (
        <MemoryRouter initialEntries={[paths.createOrganization]}>
          <AuthSessionProvider>
            <AppLayout>
              <Story />
            </AppLayout>
          </AuthSessionProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof CreateOrganizationPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Create an organization' }),
    ).toBeVisible()
    await expect(canvas.getByText(/Workspace setup/i)).toBeVisible()
    await expect(canvas.getByLabelText(/Organization name/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/^Slug/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/^Plan/i)).toBeEnabled()
    await expect(
      canvas.getByRole('button', { name: 'Create organization' }),
    ).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeEnabled()

    const nav = canvas.getByRole('navigation', { name: 'Workspace' })
    await expect(
      within(nav).getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', paths.home)
  },
}

export const SlugValidationError: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByLabelText(/Organization name/i),
      'Acme Corporation',
    )
    await userEvent.type(canvas.getByLabelText(/^Slug/i), 'Bad Slug!')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create organization' }),
    )

    await expect(
      canvas.getByText(
        'Use lowercase letters, numbers, and single hyphens only.',
      ),
    ).toBeVisible()
    expect(createOrganization).not.toHaveBeenCalled()
  },
}

export const Submitting: Story = {
  parameters: {
    createOrganizationMock: 'pending',
  },
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByLabelText(/Organization name/i),
      'Acme Corporation',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create organization' }),
    )

    const submit = canvas.getByRole('button', { name: 'Create organization' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('aria-busy', 'true')
  },
}

export const SlugConflictError: Story = {
  play: async ({ canvas }) => {
    vi.mocked(createOrganization).mockRejectedValue(
      new Error('Organization slug is already taken.'),
    )

    await userEvent.type(
      canvas.getByLabelText(/Organization name/i),
      'Acme Corporation',
    )
    await userEvent.type(canvas.getByLabelText(/^Slug/i), 'acme-corp')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create organization' }),
    )

    await waitFor(async () => {
      await expect(
        canvas.getByText('Organization slug is already taken.'),
      ).toBeVisible()
    })
  },
}

export const GenericApiError: Story = {
  parameters: {
    createOrganizationMock: 'generic-error',
  },
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByLabelText(/Organization name/i),
      'Acme Corporation',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create organization' }),
    )

    await waitFor(async () => {
      await expect(
        canvas.getByText('Something went wrong on our side. Please try again.'),
      ).toBeVisible()
    })
  },
}

export const SuccessfulCreate: Story = {
  parameters: {
    createOrganizationMock: 'success',
  },
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByLabelText(/Organization name/i),
      'Acme Corporation',
    )
    await userEvent.type(canvas.getByLabelText(/^Slug/i), 'acme-corp')
    await userEvent.selectOptions(canvas.getByLabelText(/^Plan/i), 'FREE')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create organization' }),
    )

    await waitFor(() => {
      expect(vi.mocked(createOrganization).mock.calls[0]?.[0]).toEqual({
        name: 'Acme Corporation',
        slug: 'acme-corp',
        plan: 'FREE',
      })
    })

    await waitFor(() => {
      expect(sessionStorage.getItem('sass.org.activeOrganizationId')).toBe(
        'org-new',
      )
    })
  },
}
