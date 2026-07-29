export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  members: '/members',
  settings: '/settings',
  projects: '/projects',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]
