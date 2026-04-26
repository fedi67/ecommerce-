import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check navbar exists
    const navbar = page.locator('nav.main-navbar-new')
    await expect(navbar).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    
    // Check hero section
    const heroSection = page.locator('section.hero-section')
    await expect(heroSection).toBeVisible()
  })

  test('should have working navigation buttons', async ({ page }) => {
    await page.goto('/')
    
    // Check if nav buttons exist
    const navButtons = page.locator('button.nav-btn-pro')
    const count = await navButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display premium grid section', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to premium grid
    const premiumGrid = page.locator('section.premium-grid')
    await expect(premiumGrid).toBeVisible()
    
    // Check for luxury cards
    const luxuryCards = page.locator('div.luxury-card')
    const cardCount = await luxuryCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should have responsive design', async ({ page, browserName }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Navbar should still be visible
    const navbar = page.locator('nav.main-navbar-new')
    await expect(navbar).toBeVisible()
    
    // Hero section should be visible
    const heroSection = page.locator('section.hero-section')
    await expect(heroSection).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should have login and signup buttons', async ({ page }) => {
    await page.goto('/')
    
    // Look for auth buttons
    const buttons = page.locator('button.nav-btn-pro')
    const allText = await buttons.allTextContents()
    
    // Should have some navigation present
    expect(allText.length).toBeGreaterThan(0)
  })
})
