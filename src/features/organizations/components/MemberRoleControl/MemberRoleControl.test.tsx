import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrganizationRole } from '../../permissions/organization-role'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import AppThemeProvider from '@/styles/AppThemeProvider'
import MemberRoleControl from './index'

function renderControl(
  overrides: Partial<Parameters<typeof MemberRoleControl>[0]> = {},
) {
  const props = {
    currentRole: OrganizationRole.MEMBER,
    memberName: 'Jane Doe',
    canManage: true,
    onUpdateRole: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }

  const { rerender } = render(<MemberRoleControl {...props} />, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  })

  return { props, rerender }
}

function getSaveButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Save role' }) as HTMLButtonElement
}

describe('MemberRoleControl', () => {
  it('renders nothing without manage permission', () => {
    renderControl({ canManage: false })

    expect(screen.queryByRole('button', { name: 'Save role' })).toBeNull()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('shows the current role and keeps Save disabled until it changes', async () => {
    const user = userEvent.setup()
    renderControl()

    const select = screen.getByRole('combobox', {
      name: 'Workspace role',
    }) as HTMLSelectElement
    expect(select.value).toBe(OrganizationRole.MEMBER)
    expect(select.querySelectorAll('option')).toHaveLength(4)
    expect(getSaveButton().disabled).toBe(true)

    await user.selectOptions(select, OrganizationRole.ADMIN)
    expect(getSaveButton().disabled).toBe(false)
  })

  it('confirms the change before submitting and closes on success', async () => {
    const user = userEvent.setup()
    const { props } = renderControl()

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Workspace role' }),
      OrganizationRole.ADMIN,
    )
    await user.click(getSaveButton())

    expect(
      await screen.findByRole('dialog', { name: "Change Jane Doe's role?" }),
    ).toBeTruthy()
    expect(props.onUpdateRole).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Change role' }))

    await waitFor(() => {
      expect(props.onUpdateRole).toHaveBeenCalledWith(OrganizationRole.ADMIN)
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('keeps the dialog open and explains the last-owner rule on failure', async () => {
    const user = userEvent.setup()
    const lastOwnerError = new ApiError({
      code: ErrorCode.MEMBER_LAST_OWNER,
      statusCode: 409,
      message: 'The organization must keep at least one owner.',
    })
    const { props, rerender } = renderControl({
      onUpdateRole: vi.fn().mockRejectedValue(lastOwnerError),
    })

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Workspace role' }),
      OrganizationRole.VIEWER,
    )
    await user.click(getSaveButton())
    await user.click(screen.getByRole('button', { name: 'Change role' }))

    await waitFor(() => {
      expect(props.onUpdateRole).toHaveBeenCalled()
    })
    expect(screen.getByRole('dialog')).toBeTruthy()

    rerender(<MemberRoleControl {...props} error={lastOwnerError} />)

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('at least one owner')
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('cancels without submitting', async () => {
    const user = userEvent.setup()
    const { props } = renderControl()

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Workspace role' }),
      OrganizationRole.ADMIN,
    )
    await user.click(getSaveButton())
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    expect(props.onUpdateRole).not.toHaveBeenCalled()
  })
})
