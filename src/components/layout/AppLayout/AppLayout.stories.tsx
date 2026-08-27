import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect, within } from 'storybook/test'
import styled from 'styled-components'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import { paths } from '@/routes/paths'
import AppLayout from '.'

const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size['2xl']};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`

const Lead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

function PageBlock({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <Page>
      <div>
        <Title>{title}</Title>
        <Lead>{description}</Lead>
      </div>
      {children}
    </Page>
  )
}

const meta = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      const initialPath =
        (context.parameters.initialPath as string | undefined) ?? paths.home

      return (
        <MemoryRouter initialEntries={[initialPath]}>
          <AuthSessionProvider>
            <Story />
          </AuthSessionProvider>
        </MemoryRouter>
      )
    },
  ],
} satisfies Meta<typeof AppLayout>

export default meta

type Story = StoryObj<typeof meta>

async function expectWorkspaceShell(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await expect(
    canvas.getByRole('link', { name: /Sass Project/i }),
  ).toHaveAttribute('href', paths.home)

  const nav = canvas.getByRole('navigation', { name: 'Workspace' })
  const navQueries = within(nav)

  await expect(navQueries.getByRole('link', { name: 'Home' })).toHaveAttribute(
    'href',
    paths.home,
  )
  await expect(
    navQueries.getByRole('link', { name: 'Projects' }),
  ).toHaveAttribute('href', paths.projects)
  await expect(
    navQueries.getByRole('link', { name: 'Boards' }),
  ).toHaveAttribute('href', paths.boards)
  await expect(
    navQueries.getByRole('link', { name: 'Members' }),
  ).toHaveAttribute('href', paths.members)
  await expect(
    navQueries.getByRole('link', { name: 'Settings' }),
  ).toHaveAttribute('href', paths.settings)

  await expect(canvas.getByRole('button', { name: 'Sign out' })).toBeEnabled()
}

export const Home: Story = {
  args: {
    children: (
      <PageBlock
        title="Home"
        description="Authenticated workspace shell with navigation placeholders for projects, boards, members, and settings."
      />
    ),
  },
  play: async ({ canvas }) => {
    await expectWorkspaceShell(canvas)

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Home' }),
    ).toBeVisible()
    await expect(
      canvas.getByText(
        'Authenticated workspace shell with navigation placeholders for projects, boards, members, and settings.',
      ),
    ).toBeVisible()
  },
}

export const Projects: Story = {
  parameters: {
    initialPath: paths.projects,
  },
  args: {
    children: (
      <PageBlock
        title="Projects"
        description="Project list and CRUD UI land in Phase 4."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Launch checklist</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">2h ago</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invite flow</TableCell>
              <TableCell>Planning</TableCell>
              <TableCell align="right">Yesterday</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PageBlock>
    ),
  },
  play: async ({ canvas }) => {
    await expectWorkspaceShell(canvas)

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Projects' }),
    ).toBeVisible()
    await expect(canvas.getByText('Launch checklist')).toBeVisible()
    await expect(canvas.getByText('Invite flow')).toBeVisible()
  },
}

export const Boards: Story = {
  parameters: {
    initialPath: paths.boards,
  },
  args: {
    children: (
      <PageBlock
        title="Boards"
        description="Board views land in Phase 5. Nav placeholder only for now."
      />
    ),
  },
  play: async ({ canvas }) => {
    await expectWorkspaceShell(canvas)

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Boards' }),
    ).toBeVisible()
    await expect(
      canvas.getByText(
        'Board views land in Phase 5. Nav placeholder only for now.',
      ),
    ).toBeVisible()
  },
}

export const Members: Story = {
  parameters: {
    initialPath: paths.members,
  },
  args: {
    children: (
      <PageBlock
        title="Members"
        description="Members directory lands in Phase 3."
      />
    ),
  },
  play: async ({ canvas }) => {
    await expectWorkspaceShell(canvas)

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Members' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Members directory lands in Phase 3.'),
    ).toBeVisible()
  },
}

export const Settings: Story = {
  parameters: {
    initialPath: paths.settings,
  },
  args: {
    children: (
      <PageBlock
        title="Settings"
        description="Organization and profile settings land in Phases 2–3."
      />
    ),
  },
  play: async ({ canvas }) => {
    await expectWorkspaceShell(canvas)

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Settings' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Organization and profile settings land in Phases 2–3.'),
    ).toBeVisible()
  },
}
