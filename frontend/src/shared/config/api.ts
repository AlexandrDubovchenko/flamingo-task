export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
} as const

export const API_ENDPOINTS = {
  USERS: '/users',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  AUTH: {
    GITHUB: '/auth/github',
    GITHUB_CALLBACK: '/auth/github/callback',
  },
} as const
