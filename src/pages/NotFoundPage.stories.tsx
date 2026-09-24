import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'storybook/test'
import AppLayout from '@/components/layout/AppLayout'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import { paths } from '@/routes/paths'
import NotFoundPage from './NotFoundPage'

const meta = {
  title: 'Pages/NotFoundPage',
  component: NotFoundPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/missing-route']}>
        <AuthSessionProvider>
          <AppLayout>
            <Story />
          </AppLayout>
        </AuthSessionProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof NotFoundPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('That route does not exist yet.'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Back to home' }),
    ).toHaveAttribute('href', paths.home)
  },
}
