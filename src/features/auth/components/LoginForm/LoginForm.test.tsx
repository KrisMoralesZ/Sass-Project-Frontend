import { fireEvent, render, screen } from '@testing-library/react'
import { type ComponentProps } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppThemeProvider from '@/styles/AppThemeProvider'
import LoginForm from './index'

function renderLoginForm(props: ComponentProps<typeof LoginForm> = {}) {
  return render(
    <AppThemeProvider>
      <MemoryRouter>
        <LoginForm {...props} />
      </MemoryRouter>
    </AppThemeProvider>,
  )
}

describe('LoginForm', () => {
  it('shows validation errors for empty fields', () => {
    renderLoginForm()

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Email is required')).toBeTruthy()
    expect(screen.getByText('Password is required')).toBeTruthy()
  })

  it('validates email format and password length', () => {
    renderLoginForm()

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: 'not-an-email' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Enter a valid email address')).toBeTruthy()
    expect(screen.getByText(/Password must be at least/)).toBeTruthy()
  })

  it('rejects passwords longer than the backend maximum', () => {
    renderLoginForm()

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: 'owner@company.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: 'Aa1' + 'x'.repeat(70) },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      screen.getByText(/Password must be at most 72 characters/),
    ).toBeTruthy()
  })

  it('submits trimmed credentials after validation succeeds', () => {
    const onSubmit = vi.fn()
    renderLoginForm({ onSubmit })

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: '  owner@company.com  ' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: 'Password1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'owner@company.com',
      password: 'Password1',
    })
  })

  it('shows server errors, notices, and clears field errors on edit', () => {
    renderLoginForm({
      formError: 'Invalid credentials',
      notice: 'Your session expired.',
    })

    expect(screen.getByRole('alert').textContent).toBe('Invalid credentials')
    expect(screen.getByRole('status').textContent).toBe('Your session expired.')

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByText('Email is required')).toBeTruthy()

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: 'owner@company.com' },
    })
    expect(screen.queryByText('Email is required')).toBeNull()
  })
})
