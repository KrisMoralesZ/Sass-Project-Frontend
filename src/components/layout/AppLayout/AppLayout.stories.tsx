import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import styled from 'styled-components'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { AuthSessionProvider } from '@/features/auth'
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

export const Home: Story = {
  args: {
    children: (
      <PageBlock
        title="Home"
        description="Authenticated workspace shell with navigation placeholders for projects, boards, members, and settings."
      />
    ),
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
}
