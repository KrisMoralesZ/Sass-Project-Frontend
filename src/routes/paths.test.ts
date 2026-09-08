import { describe, expect, it } from 'vitest'
import { paths, type AppPath } from './paths'

describe('paths', () => {
  it('exposes stable app route constants', () => {
    expect(paths).toEqual({
      home: '/',
      login: '/login',
      register: '/register',
      members: '/members',
      settings: '/settings',
      projects: '/projects',
      boards: '/boards',
    })
  })

  it('types AppPath as the union of path values', () => {
    const loginPath: AppPath = paths.login
    const homePath: AppPath = paths.home

    expect(loginPath).toBe('/login')
    expect(homePath).toBe('/')
  })
})
