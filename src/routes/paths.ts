export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  members: '/members',
  settings: '/settings',
  projects: '/projects',
  boards: '/boards',
  createOrganization: '/organizations/new',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]
