import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import styled from 'styled-components'
import Button from '.'

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  width: min(100%, 20rem);
`

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' })

    await expect(button).toBeEnabled()
    await expect(button).not.toHaveAttribute('aria-busy')

    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' })

    await expect(button).toBeDisabled()
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving…',
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Saving…' })

    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeEnabled()
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Learn more',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Learn more' }),
    ).toBeEnabled()
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete workspace',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Delete workspace' }),
    ).toBeEnabled()
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Invite',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Invite' })).toBeEnabled()
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Continue',
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Continue' })
    const parent = button.parentElement

    await expect(button).toBeEnabled()
    await expect(parent).not.toBeNull()
    await expect(button.offsetWidth).toBe(parent!.clientWidth)
  },
}

export const Variants: Story = {
  render: () => (
    <Row>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Row>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Primary' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Secondary' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Ghost' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Danger' })).toBeVisible()
  },
}

export const Sizes: Story = {
  render: () => (
    <Row>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
    </Row>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Small' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Medium' })).toBeVisible()
  },
}

export const States: Story = {
  render: () => (
    <Row>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </Row>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Default' })).toBeEnabled()
    await expect(
      canvas.getByRole('button', { name: 'Disabled' }),
    ).toBeDisabled()

    const loading = canvas.getByRole('button', { name: 'Loading' })
    await expect(loading).toBeDisabled()
    await expect(loading).toHaveAttribute('aria-busy', 'true')
  },
}
