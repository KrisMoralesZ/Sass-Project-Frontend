import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import styled from 'styled-components'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import ArchiveOrganizationPanel from '.'

const Frame = styled.div`
  width: 100%;
  max-width: 46rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space.xl};
`

const meta = {
  title: 'Organizations/ArchiveOrganizationPanel',
  component: ArchiveOrganizationPanel,
  tags: ['autodocs'],
  args: {
    organizationName: 'Acme Workspace',
    canArchive: true,
    isArchiving: false,
    onArchive: fn(),
  },
  argTypes: {
    onArchive: { control: false },
    error: { control: false },
    canArchive: { control: 'boolean' },
    isArchiving: { control: 'boolean' },
    defaultConfirmOpen: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof ArchiveOrganizationPanel>

export default meta

type Story = StoryObj<typeof meta>

async function findArchiveDialog() {
  const dialog = await screen.findByRole('dialog', {
    name: 'Archive Acme Workspace?',
  })
  await waitFor(() => expect(dialog).toBeVisible())
  return dialog
}

export const Owner: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Archive workspace' }),
    )
    await findArchiveDialog()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    await expect(args.onArchive).not.toHaveBeenCalled()
  },
}

export const Confirm: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Archive workspace' }),
    )
    await findArchiveDialog()
    await userEvent.click(screen.getByRole('button', { name: 'Archive' }))
    await expect(args.onArchive).toHaveBeenCalledOnce()
  },
}

export const Archiving: Story = {
  args: {
    isArchiving: true,
    defaultConfirmOpen: true,
  },
  play: async () => {
    await findArchiveDialog()
    await expect(screen.getByRole('button', { name: 'Archive' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

export const Forbidden: Story = {
  args: {
    defaultConfirmOpen: true,
    error: new ApiError({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      message: 'Requires at least the OWNER role.',
    }),
  },
  play: async () => {
    await findArchiveDialog()
    await expect(screen.getByRole('alert')).toHaveTextContent(
      /Only the workspace owner/i,
    )
    await expect(screen.queryByText(/Requires at least the OWNER/i)).toBeNull()
  },
}

export const Hidden: Story = {
  args: {
    canArchive: false,
  },
  play: async ({ canvas, args }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Archive workspace' }),
    ).toBeNull()
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(args.onArchive).not.toHaveBeenCalled()
  },
}
