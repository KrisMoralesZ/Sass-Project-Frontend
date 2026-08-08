import type { Meta, StoryObj } from '@storybook/react-vite'
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
}
