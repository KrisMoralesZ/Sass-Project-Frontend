import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import styled from 'styled-components'
import Table, {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '.'

const Frame = styled.div`
  width: min(100%, 42rem);
`

const members = [
  { name: 'Alex Rivera', email: 'alex@acme.com', role: 'Owner' },
  { name: 'Jordan Lee', email: 'jordan@acme.com', role: 'Admin' },
  { name: 'Sam Chen', email: 'sam@acme.com', role: 'Member' },
] as const

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.email}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table')
    await expect(table).toBeVisible()

    await expect(
      canvas.getByRole('columnheader', { name: 'Name' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: 'Email' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: 'Role' }),
    ).toBeVisible()

    await expect(
      canvas.getByRole('cell', { name: 'Alex Rivera' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('cell', { name: 'jordan@acme.com' }),
    ).toBeVisible()
    await expect(canvas.getByRole('cell', { name: 'Member' })).toBeVisible()

    // Header row + 3 body rows
    await expect(canvas.getAllByRole('row')).toHaveLength(4)
  },
}

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={3}>No members in this workspace yet.</TableEmpty>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(
      canvas.getByRole('cell', { name: 'No members in this workspace yet.' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('cell', { name: 'Alex Rivera' })).toBeNull()
  },
}

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Workspace members</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.email}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Workspace members' })
    await expect(table).toBeVisible()
    await expect(canvas.getByText('Workspace members')).toBeVisible()
    await expect(canvas.getByRole('cell', { name: 'Sam Chen' })).toBeVisible()
  },
}

export const AlignedColumns: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead align="center">Issues</TableHead>
          <TableHead align="right">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Launch checklist</TableCell>
          <TableCell align="center">12</TableCell>
          <TableCell align="right">2h ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Billing polish</TableCell>
          <TableCell align="center">4</TableCell>
          <TableCell align="right">Yesterday</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Invite flow</TableCell>
          <TableCell align="center">7</TableCell>
          <TableCell align="right">3d ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('columnheader', { name: 'Project' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: 'Issues' }),
    ).toHaveStyle({
      textAlign: 'center',
    })
    await expect(
      canvas.getByRole('columnheader', { name: 'Updated' }),
    ).toHaveStyle({
      textAlign: 'right',
    })

    await expect(
      canvas.getByRole('cell', { name: 'Launch checklist' }),
    ).toBeVisible()
    await expect(canvas.getByRole('cell', { name: '12' })).toHaveStyle({
      textAlign: 'center',
    })
    await expect(canvas.getByRole('cell', { name: 'Yesterday' })).toHaveStyle({
      textAlign: 'right',
    })
  },
}
