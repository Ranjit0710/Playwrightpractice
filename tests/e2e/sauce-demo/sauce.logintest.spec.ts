// 8. TEST: Login Tests - tests/e2e/sauce-demo/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/sauce.loginpage';
import { InventoryPage } from '../../../src/pages/sauce.inventorypage';

test.describe('Sauce Demo Login Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('Valid login with standard user', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    // Logout
    await inventoryPage.logout();
    
    // Verify we're back on the login page
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBe(false);
  });

  test('Invalid login with incorrect password', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('Locked out user login', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });
});
