import { vi } from 'vitest'

const store = new Map<string, string>()

const memoryStorage: Storage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => {
    store.set(key, String(value))
  },
  removeItem: (key) => {
    store.delete(key)
  },
  clear: () => {
    store.clear()
  },
  key: (index) => [...store.keys()][index] ?? null,
  get length() {
    return store.size
  },
}

vi.stubGlobal('sessionStorage', memoryStorage)
vi.stubGlobal('window', {
  sessionStorage: memoryStorage,
  location: { pathname: '/projects' },
})

vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
