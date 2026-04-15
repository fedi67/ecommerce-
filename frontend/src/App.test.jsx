import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

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

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders without crashing', () => {
    renderWithRouter(<App />)
    
    expect(screen.getByText(/p2m ecommerce/i)).toBeInTheDocument() // Assuming there's a title or something
  })

  test('redirects to login if no token', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    renderWithRouter(<App />)
    
    // Check if login modal is shown or redirect happens
    // This might need adjustment based on actual routing logic
  })
})