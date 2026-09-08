import { describe, expect, it } from 'vitest'
import { ErrorCode } from '@/types/error-code'
import { ApiError } from './api-error'
import {
  getApiErrorMessage,
  getErrorCodeMessage,
} from './get-api-error-message'

describe('getErrorCodeMessage', () => {
  it('maps known codes to UI copy', () => {
    expect(getErrorCodeMessage(ErrorCode.UNAUTHORIZED)).toBe(
      'Please sign in to continue.',
    )
    expect(getErrorCodeMessage(ErrorCode.ACCOUNT_LOCKED)).toMatch(/locked/i)
  })

  it('falls back for unknown codes', () => {
    expect(getErrorCodeMessage('NOT_A_REAL_CODE')).toBe(
      'Something went wrong. Please try again.',
    )
  })
})

describe('getApiErrorMessage', () => {
  it('returns a generic Error message', () => {
    expect(getApiErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('falls back for unknown thrown values', () => {
    expect(getApiErrorMessage('nope')).toBe(
      'Something went wrong. Please try again.',
    )
  })

  it('surfaces validation field details', () => {
    const error = new ApiError({
      code: ErrorCode.VALIDATION_FAILED,
      statusCode: 400,
      message: ['Email is required', 'Password is required'],
    })

    expect(getApiErrorMessage(error)).toBe(
      'Email is required Password is required',
    )
  })

  it('uses mapped validation copy when details are empty', () => {
    const error = new ApiError({
      code: ErrorCode.VALIDATION_FAILED,
      statusCode: 400,
      message: '   ',
    })

    expect(getApiErrorMessage(error)).toBe(
      'Please fix the highlighted fields and try again.',
    )
  })

  it('uses mapped copy for known ApiError codes', () => {
    const error = new ApiError({
      code: ErrorCode.CONFLICT,
      statusCode: 409,
      message: 'ignored server string',
    })

    expect(getApiErrorMessage(error)).toMatch(/conflicts/i)
  })

  it('keeps the network helper message', () => {
    expect(getApiErrorMessage(ApiError.network())).toMatch(/connection/i)
  })
})
