// tests/e2e/shopping-cart.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/pages/AutomationExcercise/home.page';
import { ProductsPage } from '../../../src/pages/AutomationExcercise/products.page';
import { CartPage } from '../../../src/pages/AutomationExcercise/cart.page';
import { LoginPage } from '../../../src/pages/AutomationExcercise/login.page';
import { TestContext } from '../../../src/utils/test-context';
import { logger } from '../../../src/utils/logger';
import { credentialsManager } from '../../../src/utils/credentials-manager';
// import { HomePage } from '../../src/pages/home.page';
// import { ProductsPage } from '../../src/pages/products.page';
// import { CartPage } from '../../src/pages/cart.page';
// import { LoginPage } from '../../src/pages/login.page';
// import { TestContext } from '../../src/utils/test-context';
// import { logger } from '../../src/utils/logger';
// import { credentialsManager } from '../../src/utils/credentials-manager';

test.describe('Shopping Cart Functionality', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let loginPage: LoginPage;
  let testContext: TestContext;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test');
    
    // Initialize context and page objects
    testContext = new TestContext(page);
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    loginPage = new LoginPage(page);
    
    // Navigate to home page
    await homePage.navigateToHome();
    
    // Optional: Log in if credentials are available
    const credentials = credentialsManager.getCredentials();
    if (credentials) {
      logger.info(`Logging in with user: ${credentials.email}`);
      await homePage.clickOnLoginSignup();
      await loginPage.login(credentials.email, credentials.password);
      
      // Verify login successful
      const isLoggedIn = await homePage.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
      
      logger.info('Login successful');
    } else {
      logger.info('No saved credentials found. Continuing as guest user.');
    }
    
    // Navigate to Products page
    await homePage.clickOnProducts();
  });

  test('User should be able to add products to cart', async () => {
    // Add first product to cart
    await productsPage.addProductToCart(0);
    
    // Continue shopping
    await productsPage.continueShopping();
    
    // Add second product to cart
    await productsPage.addProductToCart(1);
    
    // View cart
    await productsPage.viewCart();
    
    // Verify cart contains 2 items
    const cartItemCount = await cartPage.getCartItemsCount();
    expect(cartItemCount).toBe(2);
    
    // Get cart items details
    const cartItems = await cartPage.getCartItemDetails();
    logger.info(`Cart contains ${cartItems.length} items`);
    
    // Verify prices and totals make sense
    for (const item of cartItems) {
      const priceValue = parseFloat(item.price.replace('Rs. ', ''));
      const totalValue = parseFloat(item.total.replace('Rs. ', ''));
      
      // Total should be price * quantity
      expect(totalValue).toBeCloseTo(priceValue * item.quantity, 1);
    }
  });

  test('User should be able to remove products from cart', async () => {
    // Add a product to cart
    await productsPage.addProductToCart(0);
    
    // View cart
    await productsPage.viewCart();
    
    // Verify cart contains 1 item
    const initialItemCount = await cartPage.getCartItemsCount();
    expect(initialItemCount).toBe(1);
    
    // Get the name of the product before removing
    const productName = await cartPage.getCartItemName(0);
    logger.info(`Removing product: ${productName}`);
    
    // Remove the item from cart
    await cartPage.removeCartItem(0);
    
    // Verify cart is empty
    const isCartEmpty = await cartPage.isCartEmpty();
    expect(isCartEmpty).toBeTruthy();
    
    logger.info('Successfully removed product from cart');
  });

  test('Cart total should update correctly when adding multiple items', async () => {
    // Add first product to cart
    await productsPage.addProductToCart(0);
    await productsPage.continueShopping();
    
    // Add second product to cart
    await productsPage.addProductToCart(1);
    await productsPage.continueShopping();
    
    // Add third product to cart
    await productsPage.addProductToCart(2);
    
    // View cart
    await productsPage.viewCart();
    
    // Verify cart contains 3 items
    const cartItemCount = await cartPage.getCartItemsCount();
    expect(cartItemCount).toBe(3);
    
    // Get cart items details
    const cartItems = await cartPage.getCartItemDetails();
    
    // Calculate expected total manually
    let expectedTotal = 0;
    for (const item of cartItems) {
      const price = parseFloat(item.price.replace('Rs. ', ''));
      const quantity = item.quantity;
      expectedTotal += price * quantity;
    }
    
    // Get the actual total from the page
    const totalText = await cartPage.getTotalPrice();
    const actualTotal = parseFloat(totalText.replace('Rs. ', ''));
    
    // Verify total matches our calculated expected total
    expect(actualTotal).toBeCloseTo(expectedTotal, 1);
    
    logger.info(`Cart total: ${totalText}, Expected total: Rs. ${expectedTotal}`);
  });

  test('User can proceed to checkout from cart', async () => {
    // Add a product to cart
    await productsPage.addProductToCart(0);
    
    // View cart
    await productsPage.viewCart();
    
    // Try to proceed to checkout
    const checkoutSuccess = await cartPage.proceedToCheckout();
    
    // Check if we're logged in from the beforeEach hook
    const credentials = credentialsManager.getCredentials();
    
    if (credentials) {
      // For logged-in users, should proceed to checkout
      expect(checkoutSuccess).toBeTruthy();
      logger.info('Logged-in user was able to proceed to checkout');
    } else {
      // For guest users, a modal should appear to register/login
      expect(checkoutSuccess).toBeFalsy();
      
      // Verify we can click register/login from modal
      await cartPage.clickRegisterLogin();
      
      // Verify we're on the login/register page
      const url = await cartPage.getCurrentUrl();
      expect(url).toContain('/login');
      
      logger.info('Guest user was redirected to login/register page from cart');
    }
  });

  test('Cart should persist items after refreshing the page', async () => {
    // Add a product to cart
    await productsPage.addProductToCart(0);
    await productsPage.continueShopping();
    
    // Add another product to cart
    await productsPage.addProductToCart(1);
    
    // View cart
    await productsPage.viewCart();
    
    // Get initial cart items
    const initialCartItems = await cartPage.getCartItemDetails();
    const initialItemCount = initialCartItems.length;
    expect(initialItemCount).toBe(2);
    
    // Store names for later comparison
    const initialProductNames = initialCartItems.map(item => item.name);
    
    // Refresh the page
    await cartPage.reloadPage();
    
    // Verify cart still contains the same number of items
    const newItemCount = await cartPage.getCartItemsCount();
    expect(newItemCount).toBe(initialItemCount);
    
    // Get updated cart items
    const updatedCartItems = await cartPage.getCartItemDetails();
    const updatedProductNames = updatedCartItems.map(item => item.name);
    
    // Verify product names match (items are the same)
    expect(updatedProductNames).toEqual(initialProductNames);
    
    logger.info('Cart items persisted after page refresh');
  });
});