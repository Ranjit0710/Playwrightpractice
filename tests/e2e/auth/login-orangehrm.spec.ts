// tests/e2e/auth/login-orangehrm.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/login.page';

test.describe('OrangeHRM Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to OrangeHRM login page
    await page.goto('https://opensource-demo.orangehrmlive.com/');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Initialize the login page object
    const loginPage = new LoginPage(page);
    
    // Login with the demo credentials
    await loginPage.login('Admin', 'admin123');
    
    // Verify successful login by checking dashboard elements
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toContainText('Dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Initialize the login page object
    const loginPage = new LoginPage(page);
    
    // Login with invalid credentials
    await loginPage.login('Admin', 'wrongpassword');
    
    // Verify error message
    await expect(loginPage.getErrorMessage()).toContain('Invalid credentials');
  });
});