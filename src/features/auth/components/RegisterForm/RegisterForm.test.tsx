import { fireEvent, render, screen } from '@testing-library/react'
import { type ComponentProps } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppThemeProvider from '@/styles/AppThemeProvider'
import RegisterForm from './index'

function renderRegisterForm(props: ComponentProps<typeof RegisterForm> = {}) {
  return render(
    <AppThemeProvider>
      <MemoryRouter>
        <RegisterForm {...props} />
      </MemoryRouter>
    </AppThemeProvider>,
  )
}

describe('RegisterForm', () => {
  it('shows validation errors for empty required fields', () => {
    renderRegisterForm()

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Email is required')).toBeTruthy()
    expect(screen.getByText('Confirm your password')).toBeTruthy()
  })

  it('validates email format, password rules, and confirmation mismatch', () => {
    renderRegisterForm()

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: 'bad-email' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: 'short' },
    })
    fireEvent.change(screen.getByLabelText(/^Confirm password/), {
      target: { value: 'different' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Enter a valid email address')).toBeTruthy()
    expect(screen.getByText(/Password must be at least/)).toBeTruthy()
    expect(screen.getByText('Passwords do not match')).toBeTruthy()
  })

  it('submits trimmed email and omits an empty display name', () => {
    const onSubmit = vi.fn()
    renderRegisterForm({ onSubmit })

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: '  owner@company.com  ' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: 'Password1' },
    })
    fireEvent.change(screen.getByLabelText(/^Confirm password/), {
      target: { value: 'Password1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'owner@company.com',
      password: 'Password1',
    })
  })

  it('includes a trimmed display name when provided', () => {
    const onSubmit = vi.fn()
    renderRegisterForm({ onSubmit })

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: 'owner@company.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Display name/), {
      target: { value: '  Owner  ' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: 'Password1' },
    })
    fireEvent.change(screen.getByLabelText(/^Confirm password/), {
      target: { value: 'Password1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'owner@company.com',
      password: 'Password1',
      displayName: 'Owner',
    })
  })

  it('shows server errors and clears field errors on edit', () => {
    renderRegisterForm({ formError: 'Email already registered' })

    expect(screen.getByRole('alert').textContent).toBe(
      'Email already registered',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    expect(screen.getByText('Email is required')).toBeTruthy()

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: 'owner@company.com' },
    })
    expect(screen.queryByText('Email is required')).toBeNull()
  })
})
