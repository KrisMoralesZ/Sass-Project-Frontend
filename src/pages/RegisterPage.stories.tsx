import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent, within } from 'storybook/test'
import PublicLayout from '@/components/layout/PublicLayout'
import { AuthSessionProvider } from '@/features/auth'
import { paths } from '@/routes/paths'
import RegisterPage from './RegisterPage'

const meta = {
  title: 'Pages/RegisterPage',
  component: RegisterPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[paths.register]}>
        <AuthSessionProvider>
          <PublicLayout>
            <Story />
          </PublicLayout>
        </AuthSessionProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof RegisterPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Create account' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: /Sass Project/i }),
    ).toHaveAttribute('href', paths.login)

    const nav = canvas.getByRole('navigation', { name: 'Public' })
    await expect(
      within(nav).getByRole('link', { name: 'Sign in' }),
    ).toHaveAttribute('href', paths.login)

    await expect(canvas.getByLabelText(/Email/i)).toBeEnabled()
  },
}

export const FieldErrors: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create account' }),
    )

    await expect(canvas.getByText('Email is required')).toBeVisible()
    await expect(canvas.getByText('Password is required')).toBeVisible()
    await expect(canvas.getByText('Confirm your password')).toBeVisible()
  },
}
