// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/pages/AutomationExcercise/home.page';
import { ProductsPage } from '../../../src/pages/AutomationExcercise/products.page';
import { CartPage } from '../../../src/pages/AutomationExcercise/cart.page';
import { LoginPage } from '../../../src/pages/AutomationExcercise/login.page';
import { CheckoutPage } from '../../../src/pages/AutomationExcercise/checkout.page';
import { TestContext } from '../../../src/utils/test-context';
import { logger } from '../../../src/utils/logger';
import { credentialsManager } from '../../../src/utils/credentials-manager';
import { TestDataGenerator } from '../../../src/utils/testdata-generator';
// import { HomePage } from '../../src/pages/home.page';
// import { ProductsPage } from '../../src/pages/products.page';
// import { CartPage } from '../../src/pages/cart.page';
// import { LoginPage } from '../../src/pages/login.page';
// import { CheckoutPage } from '../../src/pages/checkout.page';
// import { TestContext } from '../../src/utils/test-context';
// import { TestDataGenerator } from '../../src/utils/test-data-generator';
// import { logger } from '../../src/utils/logger';
// import { credentialsManager } from '../../src/utils/credentials-manager';

test.describe('End-to-End Checkout Process', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let testContext: TestContext;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test');
    
    // Initialize context and page objects
    testContext = new TestContext(page);
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Navigate to home page
    await homePage.navigateToHome();
  });

  test('Complete checkout process as a registered user', async () => {
    // Step 1: Check for or create a test user
    let credentials = credentialsManager.getCredentials();
    
    if (!credentials) {
      logger.info('No existing credentials found. Starting registration process...');
      
      // Navigate to login/signup page
      await homePage.clickOnLoginSignup();
      
      // Generate unique user data
      const timestamp = Date.now();
      const name = `Test User ${timestamp}`;
      const email = `testuser${timestamp}@example.com`;
      const password = 'Test@123';
      
      logger.info(`Registering new user: ${name} / ${email}`);
      
      // Start signup process
      await loginPage.signup(name, email);
      
      // Fill account information
      await loginPage.fillAccountInformation({
        title: 'Mr',
        password: password,
        dateOfBirth: { day: '10', month: '5', year: '1995' },
        newsletter: true,
        specialOffers: true
      });
      
      // Fill address information
      const address = TestDataGenerator.randomAddress();
      await loginPage.fillAddressInformation({
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || 'User',
        address1: address.street,
        city: address.city,
        state: address.state,
        zipcode: address.zipCode,
        country: 'United States',
        mobileNumber: TestDataGenerator.randomPhoneNumber()
      });
      
      // Create account
      await loginPage.createAccount();
      
      // Continue after account creation
      await loginPage.continueAfterAccountCreation();
      
      // Save credentials
      credentials = {
        name: name,
        email: email,
        password: password
      };
      
      credentialsManager.saveCredentials(credentials);
      logger.info('New user registered and credentials saved');
    } else {
      // Login with existing credentials
      logger.info(`Logging in with existing user: ${credentials.email}`);
      await homePage.clickOnLoginSignup();
      await loginPage.login(credentials.email, credentials.password);
    }
    
    // Verify login was successful
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Step 2: Navigate to products page
    await homePage.clickOnProducts();
    
    // Step 3: Add products to cart
    logger.info('Adding products to cart');
    await productsPage.addProductToCart(0);
    await productsPage.continueShopping();
    await productsPage.addProductToCart(1);
    
    // Step 4: View cart
    await productsPage.viewCart();
    
    // Verify cart contains 2 items
    const cartItemCount = await cartPage.getCartItemsCount();
    expect(cartItemCount).toBe(2);
    
    // Get cart items for verification later
    const cartItems = await cartPage.getCartItemDetails();
    logger.info(`Cart contains ${cartItems.length} items`);
    
    // Step 5: Proceed to checkout
    const checkoutSuccess = await cartPage.proceedToCheckout();
    expect(checkoutSuccess).toBeTruthy(); // Should succeed for logged-in user
    
    // Step 6: Verify delivery address matches user's address
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    logger.info(`Delivery address: ${JSON.stringify(deliveryAddress)}`);
    
    // Verify name in address matches logged-in user
    expect(deliveryAddress.name).toContain(credentials.name);
    
    // Step 7: Verify order review contains the correct items
    const orderItems = await checkoutPage.getOrderItemDetails();
    expect(orderItems.length).toBe(cartItems.length);
    
    // Verify the product names match what we added to cart
    const orderItemNames = orderItems.map(item => item.name);
    const cartItemNames = cartItems.map(item => item.name);
    expect(orderItemNames).toEqual(cartItemNames);
    
    // Step 8: Add comment to order
    const comment = 'Please deliver during business hours.';
    await checkoutPage.addComment(comment);
    
    // Step 9: Place order
    await checkoutPage.placeOrder();
    
    // Step 10: Fill payment details
    const paymentDetails = {
      nameOnCard: credentials.name,
      cardNumber: '4242424242424242', // Test card number
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2030'
    };
    
    await checkoutPage.fillPaymentDetails(paymentDetails);
    
    // Step 11: Confirm payment
    await checkoutPage.confirmPayment();
    
    // Step 12: Verify order was successful
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toContain('ORDER PLACED SUCCESSFULLY');
    
    logger.info('Order was placed successfully');
    
    // Optional: Download invoice if supported
    try {
      await checkoutPage.downloadInvoice();
      logger.info('Invoice downloaded successfully');
    } catch (error) {
      logger.warn('Invoice download failed or not supported');
    }
    
    // Step 13: Continue shopping
    await checkoutPage.continueShopping();
    
    // Verify we're back on home page
    const url = await homePage.getCurrentUrl();
    expect(url).toContain('automationexercise.com');
    
    // Cleanup: Logout
    await homePage.logout();
  });

  test('New user registration during checkout process', async () => {
    // Step 1: Add products to cart as a guest
    await homePage.clickOnProducts();
    
    logger.info('Adding product to cart as guest');
    await productsPage.addProductToCart(0);
    await productsPage.viewCart();
    
    // Verify cart has 1 item
    const cartItemCount = await cartPage.getCartItemsCount();
    expect(cartItemCount).toBe(1);
    
    // Step 2: Proceed to checkout - should prompt for login/register
    const checkoutSuccess = await cartPage.proceedToCheckout();
    expect(checkoutSuccess).toBeFalsy(); // Should fail for guest user
    
    // Step 3: Click Register/Login
    await cartPage.clickRegisterLogin();
    
    // Step 4: Register a new account
    // Generate unique user details
    const timestamp = Date.now();
    const name = `Checkout User ${timestamp}`;
    const email = `checkout_${timestamp}@example.com`;
    const password = 'Test@123';
    
    logger.info(`Registering new user during checkout: ${name} / ${email}`);
    
    // Start signup process
    await loginPage.signup(name, email);
    
    // Fill account information
    await loginPage.fillAccountInformation({
      title: 'Mr',
      password: password,
      dateOfBirth: { day: '15', month: '6', year: '1985' },
      newsletter: true,
      specialOffers: false
    });
    
    // Fill address information
    const address = TestDataGenerator.randomAddress();
    await loginPage.fillAddressInformation({
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1] || 'Checkout',
      address1: address.street,
      city: address.city,
      state: address.state,
      zipcode: address.zipCode,
      country: 'United States',
      mobileNumber: TestDataGenerator.randomPhoneNumber()
    });
    
    // Create account
    await loginPage.createAccount();
    
    // Verify account was created successfully
    const accountCreatedMessage = await loginPage.getAccountCreatedMessage();
    expect(accountCreatedMessage).toContain('ACCOUNT CREATED');
    
    // Continue after account creation
    await loginPage.continueAfterAccountCreation();
    
    // Verify user is logged in
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Step 5: Go back to cart and proceed to checkout
    await homePage.clickOnCart();
    
    // Verify cart still has the item
    const updatedCartItemCount = await cartPage.getCartItemsCount();
    expect(updatedCartItemCount).toBe(1);
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Step 6: Verify address and review order
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    expect(deliveryAddress.name).toContain(name);
    
    // Step 7: Place order
    await checkoutPage.placeOrder();
    
    // Step 8: Fill payment details
    const paymentDetails = {
      nameOnCard: `${name}`,
      cardNumber: '5555555555554444', // Test card number
      cvc: '456',
      expiryMonth: '10',
      expiryYear: '2029'
    };
    
    await checkoutPage.fillPaymentDetails(paymentDetails);
    
    // Step 9: Confirm payment
    await checkoutPage.confirmPayment();
    
    // Step 10: Verify order was successful
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toContain('ORDER PLACED SUCCESSFULLY');
    
    logger.info('Order was placed successfully after new registration');
    
    // Continue shopping
    await checkoutPage.continueShopping();
    
    // Cleanup: Logout
    await homePage.logout();
  });

  test('User can view and place order with multiple products', async () => {
    // Check if we have saved credentials
    const credentials = credentialsManager.getCredentials();
    
    if (!credentials) {
      logger.warn('No saved credentials found. Skipping test that requires login.');
      test.skip();
      return;
    }
    
    // Step 1: Login with existing account
    logger.info(`Logging in as ${credentials.email}`);
    await homePage.clickOnLoginSignup();
    await loginPage.login(credentials.email, credentials.password);
    
    // Step 2: Navigate to different categories and add products
    logger.info('Adding products from different categories');
    
    // Add a product from Women category
    await homePage.clickOnCategory('Women > Dress');
    const womenProductCount = await productsPage.getProductCount();
    if (womenProductCount > 0) {
      await productsPage.addProductToCart(0);
      await productsPage.continueShopping();
    }
    
    // Add a product from Men category
    await homePage.clickOnCategory('Men > Tshirts');
    const menProductCount = await productsPage.getProductCount();
    if (menProductCount > 0) {
      await productsPage.addProductToCart(0);
      await productsPage.continueShopping();
    }
    
    // Step 3: View cart
    await homePage.clickOnCart();
    
    // Verify cart has items
    const cartItemCount = await cartPage.getCartItemsCount();
    expect(cartItemCount).toBeGreaterThan(0);
    logger.info(`Cart contains ${cartItemCount} items from different categories`);
    
    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Step 5: Place order
    await checkoutPage.placeOrder();
    
    // Step 6: Fill payment details
    const paymentDetails = {
      nameOnCard: credentials.name,
      cardNumber: '378282246310005', // Test card number (American Express)
      cvc: '789',
      expiryMonth: '08',
      expiryYear: '2028'
    };
    
    await checkoutPage.fillPaymentDetails(paymentDetails);
    
    // Step 7: Confirm payment
    await checkoutPage.confirmPayment();
    
    // Step 8: Verify order was successful
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toContain('ORDER PLACED SUCCESSFULLY');
    
    logger.info('Successfully placed order with products from different categories');
    
    // Continue shopping
    await checkoutPage.continueShopping();
    
    // Cleanup: Logout
    await homePage.logout();
  });
});