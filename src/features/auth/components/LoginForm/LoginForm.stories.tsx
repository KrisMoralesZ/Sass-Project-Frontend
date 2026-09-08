import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, fn, userEvent } from 'storybook/test'
import styled from 'styled-components'
import { paths } from '@/routes/paths'
import LoginForm from '.'

const Frame = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space.xl};
`

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
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
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeVisible()
    await expect(canvas.getByLabelText(/Email/i)).toBeEnabled()
    await expect(canvas.getByLabelText(/^Password/i)).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    await expect(
      canvas.getByRole('link', { name: 'Create one' }),
    ).toHaveAttribute('href', paths.register)
  },
}

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
  play: async ({ canvas }) => {
    const submit = canvas.getByRole('button', { name: 'Sign in' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByLabelText(/Email/i)).toBeDisabled()
    await expect(canvas.getByLabelText(/^Password/i)).toBeDisabled()
  },
}

export const FieldErrors: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))

    await expect(canvas.getByText('Email is required')).toBeVisible()
    await expect(canvas.getByText('Password is required')).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const InvalidEmail: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/Email/i), 'not-an-email')
    await userEvent.type(canvas.getByLabelText(/^Password/i), 'Password1')
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))

    await expect(canvas.getByText('Enter a valid email address')).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ValidSubmit: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/Email/i), 'owner@company.com')
    await userEvent.type(canvas.getByLabelText(/^Password/i), 'Password1')
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))

    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'owner@company.com',
      password: 'Password1',
    })
  },
}

export const ApiError: Story = {
  args: {
    formError: 'Invalid email or password.',
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toHaveTextContent('Invalid email or password.')
  },
}

export const AccountLocked: Story = {
  args: {
    formError: 'This account is temporarily locked. Try again later.',
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toHaveTextContent(/temporarily locked/i)
  },
}
