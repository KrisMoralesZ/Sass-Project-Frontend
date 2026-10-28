import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent } from 'storybook/test'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import InviteMemberDialog from './index'

const meta = {
  title: 'Features/Invitations/InviteMemberDialog',
  component: InviteMemberDialog,
  tags: ['autodocs'],
  args: {
    open: true,
    organizationId: 'org-1',
    onClose: () => {},
    onInvited: () => {},
  },
} satisfies Meta<typeof InviteMemberDialog>

export default meta

type Story = StoryObj<typeof meta>

async function findDialog(name: string) {
  const dialog = await screen.findByRole('dialog', { name })
  await expect(dialog).toBeVisible()
  return dialog
}

export const Open: Story = {
  play: async () => {
    await findDialog('Invite a member')
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeTruthy()
    const role = screen.getByRole('combobox', {
      name: 'Role',
    }) as HTMLSelectElement
    await expect(role.value).toBe(OrganizationRole.MEMBER)
  },
}

export const ValidationError: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: /send invite/i }))
    await expect(screen.getByText('Email is required')).toBeVisible()
  },
}
