import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock IntersectionObserver API (not available in jsdom)
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})