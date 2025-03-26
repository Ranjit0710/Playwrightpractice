// src/pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { logger } from '../../utils/logger';
//import { BasePage } from './base.page';
//import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  // Selectors for Automation Exercise website
  readonly selectors = {
    pageTitle: '.login-form h2',
    loginToAccountText: '.login-form h2',
    loginEmail: 'input[data-qa="login-email"]',
    loginPassword: 'input[data-qa="login-password"]',
    loginButton: 'button[data-qa="login-button"]',
    loginErrorMessage: '.login-form p',
    
    newUserText: '.signup-form h2',
    signupName: 'input[data-qa="signup-name"]',
    signupEmail: 'input[data-qa="signup-email"]',
    signupButton: 'button[data-qa="signup-button"]',
    signupErrorMessage: '.signup-form p',
    
    // Account Information Form Selectors (on signup page)
    accountInfoTitle: '.title',
    titleMr: '#id_gender1',
    titleMrs: '#id_gender2',
    name: 'input[data-qa="name"]',
    email: 'input[data-qa="email"]',
    password: 'input[data-qa="password"]',
    dayOfBirth: 'select[data-qa="days"]',
    monthOfBirth: 'select[data-qa="months"]',
    yearOfBirth: 'select[data-qa="years"]',
    newsletter: '#newsletter',
    specialOffers: '#optin',
    firstName: 'input[data-qa="first_name"]',
    lastName: 'input[data-qa="last_name"]',
    company: 'input[data-qa="company"]',
    address1: 'input[data-qa="address"]',
    address2: 'input[data-qa="address2"]',
    country: 'select[data-qa="country"]',
    state: 'input[data-qa="state"]',
    city: 'input[data-qa="city"]',
    zipcode: 'input[data-qa="zipcode"]',
    mobileNumber: 'input[data-qa="mobile_number"]',
    createAccountButton: 'button[data-qa="create-account"]',
    
    // Account Created Page
    accountCreatedMessage: 'h2[data-qa="account-created"]',
    continueButton: 'a[data-qa="continue-button"]'
  };

  constructor(page: Page) {
    super(page);
  }

  async navigateToLoginPage(): Promise<void> {
    logger.info('Navigating to Login page');
    await this.page.goto('https://automationexercise.com/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    logger.info(`Logging in with email: ${email}`);
    await this.page.fill(this.selectors.loginEmail, email);
    await this.page.fill(this.selectors.loginPassword, password);
    await this.clickAndWait(this.selectors.loginButton);
  }

  async getLoginErrorMessage(): Promise<string> {
    return await this.getText(this.selectors.loginErrorMessage);
  }

  async signup(name: string, email: string): Promise<void> {
    logger.info(`Signing up with name: ${name} and email: ${email}`);
    await this.page.fill(this.selectors.signupName, name);
    await this.page.fill(this.selectors.signupEmail, email);
    await this.clickAndWait(this.selectors.signupButton);
  }

  async getSignupErrorMessage(): Promise<string> {
    return await this.getText(this.selectors.signupErrorMessage);
  }

  // Account Information Form Methods
  async fillAccountInformation(data: {
    title: 'Mr' | 'Mrs';
    password: string;
    dateOfBirth: { day: string; month: string; year: string };
    newsletter: boolean;
    specialOffers: boolean;
  }): Promise<void> {
    logger.info('Filling account information');
    
    // Title
    if (data.title === 'Mr') {
      await this.page.check(this.selectors.titleMr);
    } else {
      await this.page.check(this.selectors.titleMrs);
    }
    
    // Password
    await this.page.fill(this.selectors.password, data.password);
    
    // Date of birth
    await this.page.selectOption(this.selectors.dayOfBirth, data.dateOfBirth.day);
    await this.page.selectOption(this.selectors.monthOfBirth, data.dateOfBirth.month);
    await this.page.selectOption(this.selectors.yearOfBirth, data.dateOfBirth.year);
    
    // Newsletter and special offers
    if (data.newsletter) {
      await this.page.check(this.selectors.newsletter);
    }
    
    if (data.specialOffers) {
      await this.page.check(this.selectors.specialOffers);
    }
  }

  async fillAddressInformation(data: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }): Promise<void> {
    logger.info('Filling address information');
    
    await this.page.fill(this.selectors.firstName, data.firstName);
    await this.page.fill(this.selectors.lastName, data.lastName);
    
    if (data.company) {
      await this.page.fill(this.selectors.company, data.company);
    }
    
    await this.page.fill(this.selectors.address1, data.address1);
    
    if (data.address2) {
      await this.page.fill(this.selectors.address2, data.address2);
    }
    
    await this.page.selectOption(this.selectors.country, data.country);
    await this.page.fill(this.selectors.state, data.state);
    await this.page.fill(this.selectors.city, data.city);
    await this.page.fill(this.selectors.zipcode, data.zipcode);
    await this.page.fill(this.selectors.mobileNumber, data.mobileNumber);
  }

  async createAccount(): Promise<void> {
    logger.info('Creating account');
    await this.clickAndWait(this.selectors.createAccountButton);
  }

  async getAccountCreatedMessage(): Promise<string> {
    return await this.getText(this.selectors.accountCreatedMessage);
  }

  async continueAfterAccountCreation(): Promise<void> {
    logger.info('Continuing after account creation');
    await this.clickAndWait(this.selectors.continueButton);
  }
}