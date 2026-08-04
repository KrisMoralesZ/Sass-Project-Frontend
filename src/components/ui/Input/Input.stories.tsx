import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import styled from 'styled-components'
import Input from '.'

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
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'url'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    placeholder: 'Workspace name',
    size: 'md',
    error: false,
    disabled: false,
    fullWidth: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Workspace name')

    await expect(input).toBeEnabled()
    await expect(input).not.toHaveAttribute('aria-invalid')

    await userEvent.type(input, 'Canopy')
    await expect(input).toHaveValue('Canopy')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Acme Corp',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByDisplayValue('Acme Corp')

    await expect(input).toBeDisabled()
    await expect(input).toHaveValue('Acme Corp')
  },
}

export const Error: Story = {
  args: {
    error: true,
    defaultValue: 'taken-slug',
    placeholder: 'Slug',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByDisplayValue('taken-slug')

    await expect(input).toBeEnabled()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Search…',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Search…')).toBeEnabled()
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: 'Email address',
    type: 'email',
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Email address')
    const parent = input.parentElement

    await expect(input).toBeEnabled()
    await expect(input).toHaveAttribute('type', 'email')
    await expect(parent).not.toBeNull()
    await expect(input.offsetWidth).toBe(parent!.clientWidth)
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
    autoComplete: 'current-password',
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Password')

    await expect(input).toHaveAttribute('type', 'password')
    await userEvent.type(input, 'secret')
    await expect(input).toHaveValue('secret')
  },
}

export const Sizes: Story = {
  render: () => (
    <Row>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
    </Row>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Small')).toBeVisible()
    await expect(canvas.getByPlaceholderText('Medium')).toBeVisible()
  },
}

export const States: Story = {
  render: () => (
    <Stack>
      <Input placeholder="Default" />
      <Input disabled value="Disabled" />
      <Input error defaultValue="Invalid value" />
    </Stack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Default')).toBeEnabled()
    await expect(canvas.getByDisplayValue('Disabled')).toBeDisabled()

    const invalid = canvas.getByDisplayValue('Invalid value')
    await expect(invalid).toBeEnabled()
    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
  },
}
