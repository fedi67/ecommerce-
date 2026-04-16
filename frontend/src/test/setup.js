import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})