import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import Button from '../Button'
import Toast from '.'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
    },
    duration: { control: 'number' },
    title: { control: 'text' },
    children: { control: 'text' },
    onClose: { control: false },
  },
  args: {
    open: true,
    onClose: fn(),
    title: 'Invite sent',
    children: 'Alex will get an email with a link to join the workspace.',
    variant: 'default',
    // Keep Storybook previews open until dismissed.
    duration: null,
  },
} satisfies Meta<typeof Toast>

export default meta

type Story = StoryObj<typeof meta>

async function findStatusToast() {
  const toast = await screen.findByRole('status')
  await waitFor(() => expect(toast).toBeVisible())
  return toast
}

export const Default: Story = {
  play: async ({ args }) => {
    const toast = await findStatusToast()

    await expect(toast).toHaveTextContent('Invite sent')
    await expect(toast).toHaveAttribute('aria-live', 'polite')

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    children: 'Your workspace settings were updated.',
  },
  play: async () => {
    const toast = await findStatusToast()
    await expect(toast).toHaveTextContent('Changes saved')
    await expect(toast).toHaveTextContent(
      'Your workspace settings were updated.',
    )
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Couldn’t save changes',
    children: 'Check your connection and try again.',
  },
  play: async () => {
    const toast = await screen.findByRole('alert')
    await waitFor(() => expect(toast).toBeVisible())

    await expect(toast).toHaveAttribute('aria-live', 'assertive')
    await expect(toast).toHaveTextContent('Couldn’t save changes')
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Invite expires soon',
    children: 'This invite link will expire in 24 hours.',
  },
  play: async () => {
    const toast = await findStatusToast()
    await expect(toast).toHaveTextContent('Invite expires soon')
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'New board created',
    children: 'You can start adding issues right away.',
  },
  play: async () => {
    const toast = await findStatusToast()
    await expect(toast).toHaveTextContent('New board created')
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Copied to clipboard',
    children: undefined,
  },
  play: async () => {
    const toast = await findStatusToast()
    await expect(toast).toHaveTextContent('Copied to clipboard')
    await expect(toast).not.toHaveTextContent(
      'Alex will get an email with a link to join the workspace.',
    )
  },
}

export const Closed: Story = {
  args: {
    open: false,
  },
  play: async () => {
    await expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const Interactive: Story = {
  args: {
    open: false,
    variant: 'success',
    title: 'Member invited',
    children: 'They’ll appear in the members list after accepting.',
  },
  render: function InteractiveToast(args) {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Toast {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
  play: async ({ canvas }) => {
    await expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Show toast' }))
    await findStatusToast()
    await expect(screen.getByText('Member invited')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument(),
    )
  },
}
