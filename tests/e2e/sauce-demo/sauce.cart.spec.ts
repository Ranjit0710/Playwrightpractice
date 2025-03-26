
// 9. TEST: Shopping Cart Tests - tests/e2e/sauce-demo/cart.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/sauce.loginpage';
import { InventoryPage } from '../../../src/pages/sauce.inventorypage';
import { CartPage } from '../../../src/pages/sauce.cartpage';

test.describe('Sauce Demo Shopping Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  // Test data
  const username = 'standard_user';
  const password = 'secret_sauce';
  const productToAdd = 'Sauce Labs Backpack';
  const secondProduct = 'Sauce Labs Bolt T-Shirt';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(username, password);
  });

  test('Add and remove products from cart', async () => {
    // Add a product to the cart
    await inventoryPage.addProductToCart(productToAdd);
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
    
    // Add another product
    await inventoryPage.addProductToCart(secondProduct);
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);
    
    // Go to cart
    await inventoryPage.goToCart();
    
    // Verify cart items
    let cartItems = await cartPage.getCartItemCount();
    expect(cartItems).toBe(2);
    
    // Remove one item
    await cartPage.removeItemFromCart(productToAdd);
    cartItems = await cartPage.getCartItemCount();
    expect(cartItems).toBe(1);
    
    // Verify the remaining item
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).not.toContain(productToAdd);
    expect(cartItemNames).toContain(secondProduct);
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify we're back on the inventory page
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });
});