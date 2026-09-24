import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'storybook/test'
import AppLayout from '@/components/layout/AppLayout'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import { paths } from '@/routes/paths'
import PlaceholderPage from './PlaceholderPage'

const meta = {
  title: 'Pages/PlaceholderPage',
  component: PlaceholderPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Projects',
    description: 'Project list and CRUD UI land in Phase 4.',
  },
  decorators: [
    (Story, context) => {
      const initialPath =
        (context.parameters.initialPath as string | undefined) ?? paths.projects

      return (
        <MemoryRouter initialEntries={[initialPath]}>
          <AuthSessionProvider>
            <AppLayout>
              <Story />
            </AppLayout>
          </AuthSessionProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof PlaceholderPage>

export default meta

type Story = StoryObj<typeof meta>

export const Projects: Story = {
  parameters: {
    initialPath: paths.projects,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Projects' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Project list and CRUD UI land in Phase 4.'),
    ).toBeVisible()
  },
}

export const Members: Story = {
  args: {
    title: 'Members',
    description: 'Members directory lands in Phase 3.',
  },
  parameters: {
    initialPath: paths.members,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Members' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Members directory lands in Phase 3.'),
    ).toBeVisible()
  },
}

export const Settings: Story = {
  args: {
    title: 'Settings',
    description: 'Organization and profile settings land in Phases 2–3.',
  },
  parameters: {
    initialPath: paths.settings,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Settings' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Organization and profile settings land in Phases 2–3.'),
    ).toBeVisible()
  },
}
