import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import Button from '../Button'
import Dialog from '.'

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    children: { control: 'text' },
    footer: { control: false },
    onClose: { control: false },
  },
  args: {
    open: true,
    onClose: fn(),
    title: 'Invite teammate',
    children:
      'Send an invite so they can join this workspace. They’ll get an email with a link to accept.',
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {}

export const Closed: Story = {
  args: {
    open: false,
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Save changes?',
    children: 'Unsaved edits will be lost if you leave this page.',
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
}

export const DangerConfirm: Story = {
  args: {
    title: 'Delete workspace',
    children:
      'This permanently removes the workspace and all of its projects. This action cannot be undone.',
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete workspace</Button>
      </>
    ),
  },
}

export const NoOverlayDismiss: Story = {
  args: {
    title: 'Complete setup',
    children: 'Finish the required steps before closing this dialog.',
    closeOnOverlayClick: false,
    footer: <Button>Continue</Button>,
  },
}

export const Interactive: Story = {
  args: {
    open: false,
  },
  render: function InteractiveDialog(args) {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog {...args} open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
}
