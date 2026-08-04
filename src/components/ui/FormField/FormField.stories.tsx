import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import styled from 'styled-components'
import Input from '../Input'
import FormField from '.'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  width: min(100%, 20rem);
`

const meta = {
  title: 'UI/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    hint: { control: 'text' },
    error: { control: 'text' },
    children: { control: false },
  },
  args: {
    label: 'Workspace name',
    required: false,
    children: <Input placeholder="Acme Corp" fullWidth />,
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
} satisfies Meta<typeof FormField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Workspace name')

    await expect(input).toBeEnabled()
    await expect(input).not.toHaveAttribute('aria-invalid')

    await userEvent.type(input, 'Canopy')
    await expect(input).toHaveValue('Canopy')
  },
}

export const WithHint: Story = {
  args: {
    label: 'Slug',
    hint: 'Used in your workspace URL. Lowercase letters and hyphens only.',
    children: <Input placeholder="acme-corp" fullWidth />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Slug')
    const hint = canvas.getByText(
      'Used in your workspace URL. Lowercase letters and hyphens only.',
    )

    await expect(hint).toBeVisible()
    await expect(input).toHaveAttribute('aria-describedby', hint.id)
  },
}

export const Error: Story = {
  args: {
    label: 'Slug',
    error: 'This slug is already taken.',
    children: <Input defaultValue="taken-slug" fullWidth />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Slug')
    const error = canvas.getByRole('alert')

    await expect(error).toHaveTextContent('This slug is already taken.')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute('aria-describedby', error.id)
  },
}

export const Required: Story = {
  args: {
    label: 'Email',
    required: true,
    hint: 'We’ll send invites to this address.',
    children: <Input type="email" placeholder="you@company.com" fullWidth />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/Email/)

    await expect(input).toHaveAttribute('aria-required', 'true')
    await expect(input).toHaveAttribute('type', 'email')
    await expect(
      canvas.getByText('We’ll send invites to this address.'),
    ).toBeVisible()
  },
}

export const Disabled: Story = {
  args: {
    label: 'Workspace ID',
    hint: 'Assigned automatically and cannot be changed.',
    children: <Input disabled value="ws_8f3a2c" fullWidth />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Workspace ID')

    await expect(input).toBeDisabled()
    await expect(input).toHaveValue('ws_8f3a2c')
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    required: true,
    children: (
      <Input
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        fullWidth
      />
    ),
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText(/Password/)

    await expect(input).toHaveAttribute('type', 'password')
    await expect(input).toHaveAttribute('aria-required', 'true')

    await userEvent.type(input, 'secret')
    await expect(input).toHaveValue('secret')
  },
}

export const States: Story = {
  args: {
    children: <Input fullWidth />,
  },
  render: () => (
    <>
      <FormField label="Default">
        <Input placeholder="Default field" fullWidth />
      </FormField>
      <FormField label="With hint" hint="Helpful context for this field.">
        <Input placeholder="Hinted field" fullWidth />
      </FormField>
      <FormField label="Required" required>
        <Input placeholder="Required field" fullWidth />
      </FormField>
      <FormField label="Error" error="Something went wrong.">
        <Input defaultValue="Invalid value" fullWidth />
      </FormField>
      <FormField label="Disabled" hint="Read-only value.">
        <Input disabled value="Locked" fullWidth />
      </FormField>
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Default')).toBeEnabled()
    await expect(
      canvas.getByText('Helpful context for this field.'),
    ).toBeVisible()
    await expect(canvas.getByLabelText(/Required/)).toHaveAttribute(
      'aria-required',
      'true',
    )

    const invalid = canvas.getByLabelText('Error')
    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Something went wrong.',
    )

    await expect(canvas.getByLabelText('Disabled')).toBeDisabled()
  },
}
