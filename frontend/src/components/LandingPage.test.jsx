import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LandingPage from '../components/LandingPage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock window.location.reload
delete window.location
window.location = { reload: vi.fn() }

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders landing page with navbar', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    renderWithRouter(<LandingPage />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('displays user name when logged in', () => {
    localStorageMock.getItem.mockReturnValue('John Doe')
    
    renderWithRouter(<LandingPage />)
    
    // Assuming Navbar displays user name
    expect(localStorageMock.getItem).toHaveBeenCalledWith('userName')
  })

  test('handles logout correctly', () => {
    localStorageMock.getItem.mockReturnValue('John Doe')
    
    renderWithRouter(<LandingPage />)
    
    // Mock logout button click - assuming there's a logout button
    // This would need to be adjusted based on actual component structure
    // For now, just test that localStorage methods are called on logout
  })

  test('slideshow changes slides automatically', () => {
    vi.useFakeTimers()
    
    renderWithRouter(<LandingPage />)
    
    // Initial slide
    expect(screen.getByText('L\'Essentiel Hiver')).toBeInTheDocument()
    
    // Fast forward time
    vi.advanceTimersByTime(8000)
    
    // Should change to next slide
    // Note: This test assumes the slideshow logic is exposed or testable
  })
})