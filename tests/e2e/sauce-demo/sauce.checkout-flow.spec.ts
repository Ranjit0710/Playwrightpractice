import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/sauce.loginpage';
import { InventoryPage } from '../../../src/pages/sauce.inventorypage';
import { CartPage } from '../../../src/pages/sauce.cartpage';
import { CheckoutInfoPage } from '../../../src/pages/sauce.checkoutinfopage';
import { CheckoutOverviewPage } from '../../../src/pages/sauce.checkoutoverviewpage';
import { CheckoutCompletePage } from '../../../src/pages/sauce.checkoutcompletepage';

test.describe('Sauce Demo E2E Tests', () => {
  // Initialize page objects
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  // Test data
  const username = 'standard_user';
  const password = 'secret_sauce';
  const productToAdd = 'Sauce Labs Backpack';
  const secondProduct = 'Sauce Labs Bike Light';
  const firstName = 'Test';
  const lastName = 'User';
  const postalCode = '12345';

  test.beforeEach(async ({ page }) => {
    // Initialize all page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    // Navigate to the login page and login
    await loginPage.navigateToLoginPage();
    await loginPage.login(username, password);
    
    // Verify we are on the inventory page
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('Complete end-to-end checkout flow', async () => {
    // Add a product to the cart
    await inventoryPage.addProductToCart(productToAdd);
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
    
    // Add another product to the cart
    await inventoryPage.addProductToCart(secondProduct);
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);
    
    // Go to the cart
    await inventoryPage.goToCart();
    const cartItems = await cartPage.getCartItemCount();
    expect(cartItems).toBe(2);
    
    // Verify cart contents
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toContain(productToAdd);
    expect(cartItemNames).toContain(secondProduct);
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Fill checkout information
    await checkoutInfoPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await checkoutInfoPage.continueToNextStep();
    
    // Verify checkout overview
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();
    const total = await checkoutOverviewPage.getTotal();
    
    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
    
    // Finish checkout
    await checkoutOverviewPage.finishCheckout();
    
    // Verify checkout completion
    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header.toLowerCase()).toContain("thank you");
    
    // Go back to home
    await checkoutCompletePage.backToHome();
    
    // Verify we're back on the inventory page
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });
});