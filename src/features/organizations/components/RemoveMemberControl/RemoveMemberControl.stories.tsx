import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent } from 'storybook/test'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import RemoveMemberControl from './index'

const meta = {
  title: 'Organizations/RemoveMemberControl',
  component: RemoveMemberControl,
  tags: ['autodocs'],
  args: {
    memberName: 'Jane Doe',
    canRemove: true,
    onRemove: async () => {},
  },
} satisfies Meta<typeof RemoveMemberControl>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Remove member' }))
    const dialog = await screen.findByRole('dialog', {
      name: 'Remove Jane Doe from this workspace?',
    })
    await expect(dialog).toBeVisible()
  },
}

export const LastOwner: Story = {
  args: {
    isLastOwner: true,
    lastOwnerMessage: 'At least one owner is required.',
  },
  play: async () => {
    const button = screen.getByRole('button', { name: 'Remove member' })
    await expect(button).toBeDisabled()
    await expect(screen.getByRole('note')).toHaveTextContent(
      'At least one owner is required.',
    )
  },
}

export const Forbidden: Story = {
  args: {
    defaultConfirmOpen: true,
    error: new ApiError({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      message: 'You do not have permission to remove members.',
    }),
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog', {
      name: 'Remove Jane Doe from this workspace?',
    })
    await expect(dialog).toBeVisible()
    await expect(screen.getByRole('alert')).toHaveTextContent(
      'do not have permission to remove members',
    )
  },
}
