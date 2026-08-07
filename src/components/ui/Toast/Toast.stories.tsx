import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
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

export const Default: Story = {}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    children: 'Your workspace settings were updated.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Couldn’t save changes',
    children: 'Check your connection and try again.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Invite expires soon',
    children: 'This invite link will expire in 24 hours.',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'New board created',
    children: 'You can start adding issues right away.',
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Copied to clipboard',
    children: undefined,
  },
}

export const Closed: Story = {
  args: {
    open: false,
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
}
