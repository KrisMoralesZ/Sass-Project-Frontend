import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent } from 'storybook/test'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import {
  OrganizationRole,
  type OrganizationRole as OrganizationRoleType,
} from '../../permissions/organization-role'
import MemberRoleControl from './index'

const meta = {
  title: 'Organizations/MemberRoleControl',
  component: MemberRoleControl,
  tags: ['autodocs'],
  args: {
    currentRole: OrganizationRole.MEMBER,
    memberName: 'Jane Doe',
    canManage: true,
    onUpdateRole: async () => {},
  },
} satisfies Meta<typeof MemberRoleControl>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const select = screen.getByRole('combobox', {
      name: 'Workspace role',
    }) as HTMLSelectElement
    await expect(select.value).toBe(OrganizationRole.MEMBER)
    await expect(screen.getByRole('button', { name: 'Save role' })).toBeDisabled()

    await userEvent.selectOptions(select, OrganizationRole.ADMIN)
    await expect(screen.getByRole('button', { name: 'Save role' })).not.toBeDisabled()
  },
}

export const LastOwner: Story = {
  args: { isLastOwner: true, lastOwnerMessage: 'At least one owner is required.' },
  play: async () => {
    await expect(screen.getByRole('note')).toHaveTextContent(
      'At least one owner is required.',
    )
    await expect(screen.getByRole('button', { name: 'Save role' })).toBeDisabled()
    await expect(
      screen.getByRole('combobox', { name: 'Workspace role' }),
    ).toBeDisabled()
  },
}

export const ApiErrorDialog: Story = {
  args: {
    defaultConfirmOpen: true,
    error: new ApiError({
      code: ErrorCode.MEMBER_LAST_OWNER,
      statusCode: 409,
      message: 'The organization must keep at least one owner.',
    }),
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: "Change Jane Doe's role?" })
    await expect(dialog).toBeVisible()
    await expect(screen.getByRole('alert')).toHaveTextContent(
      'at least one owner',
    )
  },
}

export const Forbidden: Story = {
  args: {
    canManage: true,
    defaultConfirmOpen: true,
    error: new ApiError({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      message: 'You do not have permission to change member roles.',
    }),
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: "Change Jane Doe's role?" })
    await expect(dialog).toBeVisible()
    await expect(screen.getByRole('alert')).toHaveTextContent(
      'do not have permission to change member roles',
    )
  },
}

export const RoleMenu: Story = {
  args: {
    currentRole: OrganizationRole.OWNER,
    roles: [
      OrganizationRole.OWNER,
      OrganizationRole.ADMIN,
      OrganizationRole.MEMBER,
      OrganizationRole.VIEWER,
    ] as readonly OrganizationRoleType[],
  },
  play: async () => {
    const select = screen.getByRole('combobox', {
      name: 'Workspace role',
    }) as HTMLSelectElement
    await expect(select.value).toBe(OrganizationRole.OWNER)
  },
}
