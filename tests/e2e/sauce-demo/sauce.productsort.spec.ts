
// 10. TEST: Product Sorting Tests - tests/e2e/sauce-demo/product-sort.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/sauce.loginpage';
import { InventoryPage } from '../../../src/pages/sauce.inventorypage';

test.describe('Sauce Demo Product Sorting Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Sort products by name (A to Z)', async () => {
    await inventoryPage.sortProducts('az');
    
    const productNames = await inventoryPage.getProductNames();
    const sortedNames = [...productNames].sort();
    
    expect(productNames).toEqual(sortedNames);
  });

  test('Sort products by name (Z to A)', async () => {
    await inventoryPage.sortProducts('za');
    
    const productNames = await inventoryPage.getProductNames();
    const sortedNames = [...productNames].sort().reverse();
    
    expect(productNames).toEqual(sortedNames);
  });
});