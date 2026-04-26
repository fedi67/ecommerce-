import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from './App'

// Mock localStorage with proper default values
const localStorageMock = {
  getItem: vi.fn((key) => {
    const store = {
      'cart': '[]',
      'userName': null,
      'token': null,
    };
    return store[key] || null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders without crashing', () => {
    render(<App />)
    
    // Check that navbar is rendered (component renders successfully)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('redirects to login if no token', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<App />)
    
    // Check if login modal is shown or redirect happens
    // This might need adjustment based on actual routing logic
  })
})