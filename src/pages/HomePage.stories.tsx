import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, within } from 'storybook/test'
import AppLayout from '@/components/layout/AppLayout'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import { paths } from '@/routes/paths'
import HomePage from './HomePage'

const meta = {
  title: 'Pages/HomePage',
  component: HomePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[paths.home]}>
        <AuthSessionProvider>
          <AppLayout>
            <Story />
          </AppLayout>
        </AuthSessionProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HomePage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: /Sass Project/i }),
    ).toHaveAttribute('href', paths.home)

    const nav = canvas.getByRole('navigation', { name: 'Workspace' })
    await expect(
      within(nav).getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', paths.home)
    await expect(canvas.getByRole('button', { name: 'Sign out' })).toBeEnabled()

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Workspace home' }),
    ).toBeVisible()
    await expect(
      canvas.getByText(/Authenticated shell is active/i),
    ).toBeVisible()
  },
}
