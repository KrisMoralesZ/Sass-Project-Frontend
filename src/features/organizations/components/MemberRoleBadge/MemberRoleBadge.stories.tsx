import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import styled from 'styled-components'
import { OrganizationRole } from '../../permissions/organization-role'
import MemberRoleBadge from '.'

const Frame = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`

const meta = {
  title: 'Organizations/MemberRoleBadge',
  component: MemberRoleBadge,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof MemberRoleBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Owner: Story = {
  args: { role: OrganizationRole.OWNER },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Owner')).toBeVisible()
  },
}

export const Admin: Story = {
  args: { role: OrganizationRole.ADMIN },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Admin')).toBeVisible()
  },
}

export const Member: Story = {
  args: { role: OrganizationRole.MEMBER },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Member')).toBeVisible()
  },
}

export const Viewer: Story = {
  args: { role: OrganizationRole.VIEWER },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Viewer')).toBeVisible()
  },
}

export const AllRoles: Story = {
  args: { role: OrganizationRole.OWNER },
  render: () => (
    <>
      <MemberRoleBadge role={OrganizationRole.OWNER} />
      <MemberRoleBadge role={OrganizationRole.ADMIN} />
      <MemberRoleBadge role={OrganizationRole.MEMBER} />
      <MemberRoleBadge role={OrganizationRole.VIEWER} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Owner')).toBeVisible()
    await expect(canvas.getByText('Admin')).toBeVisible()
    await expect(canvas.getByText('Member')).toBeVisible()
    await expect(canvas.getByText('Viewer')).toBeVisible()
  },
}
