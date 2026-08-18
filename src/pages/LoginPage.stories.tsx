import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent, within } from 'storybook/test'
import PublicLayout from '@/components/layout/PublicLayout'
import { AuthSessionProvider } from '@/features/auth'
import { paths } from '@/routes/paths'
import LoginPage from './LoginPage'

const meta = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      const initialEntry =
        (context.parameters.initialEntry as
          string | { pathname: string; state?: unknown } | undefined) ??
        paths.login

      return (
        <MemoryRouter initialEntries={[initialEntry]}>
          <AuthSessionProvider>
            <PublicLayout>
              <Story />
            </PublicLayout>
          </AuthSessionProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof LoginPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: /Sass Project/i }),
    ).toHaveAttribute('href', paths.login)

    const nav = canvas.getByRole('navigation', { name: 'Public' })
    await expect(
      within(nav).getByRole('link', { name: 'Create account' }),
    ).toHaveAttribute('href', paths.register)

    await expect(canvas.getByLabelText(/Email/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/^Password/i)).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    await expect(
      canvas.getByRole('link', { name: 'Create one' }),
    ).toHaveAttribute('href', paths.register)
  },
}

export const FieldErrors: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))

    await expect(canvas.getByText('Email is required')).toBeVisible()
    await expect(canvas.getByText('Password is required')).toBeVisible()
  },
}

export const WithRedirectState: Story = {
  parameters: {
    initialEntry: {
      pathname: paths.login,
      state: { from: { pathname: paths.projects } },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeVisible()
    await expect(canvas.getByLabelText(/Email/i)).toBeEnabled()
  },
}
