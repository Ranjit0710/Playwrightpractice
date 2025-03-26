// tests/e2e/registration.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/pages/AutomationExcercise/home.page';
import { LoginPage } from '../../../src/pages/AutomationExcercise/login.page';
import { logger } from '../../../src/utils/logger';
import { TestDataGenerator } from '../../../src/utils/testdata-generator';
import { credentialsManager } from '../../../src/utils/credentials-manager';
// import { HomePage } from '../../src/pages/home.page';
// import { LoginPage } from '../../src/pages/login.page';
// import { TestDataGenerator } from '../../src/utils/test-data-generator';
// import { logger } from '../../src/utils/logger';
// import { credentialsManager } from '../../src/utils/credentials-manager';

test.describe('User Registration', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up registration test');
    
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    
    // Navigate to home page
    await homePage.navigateToHome();
    
    // Go to login/signup page
    await homePage.clickOnLoginSignup();
  });

  test('Register a new user account', async () => {
    // Generate unique user data
    const timestamp = Date.now();
    const name = `Test User ${timestamp}`;
    const email = `testuser${timestamp}@example.com`;
    const password = 'Test@123';
    
    logger.info(`Registering new user: ${name} / ${email}`);
    
    // Start signup process with name and email
    await loginPage.signup(name, email);
    
    // Verify we're on the account information page
    const accountInfoTitle = await loginPage.page.textContent('.login-form h2.title');
    expect(accountInfoTitle?.toUpperCase() || '').toContain('ENTER ACCOUNT INFORMATION');
    
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
    
    // Verify account was created successfully
    const accountCreatedMessage = await loginPage.getAccountCreatedMessage();
    expect(accountInfoTitle?.toUpperCase() || '').toContain('Account Created');
    
    // Continue after account creation
    await loginPage.continueAfterAccountCreation();
    
    // Verify user is logged in
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Verify username is displayed correctly
    const username = await homePage.getLoggedInUsername();
    expect(username).toBe(name);
    
    // Save credentials to file for later use
    const credentials = {
      name: name,
      email: email,
      password: password
    };
    
    // Save credentials using the credentials manager
    credentialsManager.saveCredentials(credentials);
    
    logger.info(`Successfully registered user: ${name}`);
    logger.info(`Credentials: ${JSON.stringify(credentials)}`);
    
    // Output credentials to console for easy access
    console.log('REGISTRATION SUCCESS - CREDENTIALS:');
    console.log(JSON.stringify(credentials, null, 2));
  });
});