import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
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

async function findDialog(name: string) {
  const dialog = await screen.findByRole('dialog', { name })
  await waitFor(() => expect(dialog).toBeVisible())
  return dialog
}

export const Open: Story = {
  play: async ({ args }) => {
    const dialog = await findDialog('Invite teammate')

    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

export const Closed: Story = {
  args: {
    open: false,
  },
  play: async () => {
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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
  play: async () => {
    await findDialog('Save changes?')
    await expect(
      screen.getByRole('button', { name: 'Cancel' }),
    ).toBeInTheDocument()
    await expect(
      screen.getByRole('button', { name: 'Save' }),
    ).toBeInTheDocument()
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
  play: async () => {
    await findDialog('Delete workspace')
    await expect(
      screen.getByRole('button', { name: 'Delete workspace' }),
    ).toBeInTheDocument()
  },
}

export const NoOverlayDismiss: Story = {
  args: {
    title: 'Complete setup',
    children: 'Finish the required steps before closing this dialog.',
    closeOnOverlayClick: false,
    footer: <Button>Continue</Button>,
  },
  play: async ({ args }) => {
    const dialog = await findDialog('Complete setup')
    const overlay = dialog.parentElement

    await expect(overlay).not.toBeNull()
    await userEvent.click(overlay!)
    await expect(args.onClose).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')
    await expect(args.onClose).toHaveBeenCalledOnce()
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
  play: async ({ canvas }) => {
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))
    await findDialog('Invite teammate')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  },
}
