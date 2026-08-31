import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, fn, userEvent } from 'storybook/test'
import styled from 'styled-components'
import RegisterForm from '.'

const Frame = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space.xl};
`

const meta = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    isSubmitting: false,
    formError: undefined,
  },
  argTypes: {
    onSubmit: { control: false },
    formError: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Frame>
          <Story />
        </Frame>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof RegisterForm>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Create account' }),
    ).toBeVisible()
    await expect(canvas.getByLabelText(/Email/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/Display name/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/^Password/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/Confirm password/i)).toBeEnabled()
    await expect(
      canvas.getByRole('button', { name: 'Create account' }),
    ).toBeEnabled()
    await expect(canvas.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login',
    )
  },
}

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
  play: async ({ canvas }) => {
    const submit = canvas.getByRole('button', { name: 'Create account' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByLabelText(/Email/i)).toBeDisabled()
  },
}

export const FieldErrors: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create account' }),
    )

    const alerts = canvas.getAllByRole('alert')
    await expect(alerts.length).toBeGreaterThanOrEqual(3)
    await expect(canvas.getByText('Email is required')).toBeVisible()
    await expect(canvas.getByText('Password is required')).toBeVisible()
    await expect(canvas.getByText('Confirm your password')).toBeVisible()
  },
}

export const PasswordMismatch: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/Email/i), 'owner@company.com')
    await userEvent.type(canvas.getByLabelText(/^Password/i), 'Password1')
    await userEvent.type(
      canvas.getByLabelText(/Confirm password/i),
      'Password2',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create account' }),
    )

    await expect(canvas.getByText('Passwords do not match')).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ValidSubmit: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/Email/i), 'owner@company.com')
    await userEvent.type(canvas.getByLabelText(/Display name/i), 'Jane Owner')
    await userEvent.type(canvas.getByLabelText(/^Password/i), 'Password1')
    await userEvent.type(
      canvas.getByLabelText(/Confirm password/i),
      'Password1',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create account' }),
    )

    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'owner@company.com',
      password: 'Password1',
      displayName: 'Jane Owner',
    })
  },
}

export const ApiError: Story = {
  args: {
    formError: 'An account with this email already exists.',
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toHaveTextContent(
      'An account with this email already exists.',
    )
  },
}
