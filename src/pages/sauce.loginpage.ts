// 1. LoginPage - src/pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  // Selectors
  private usernameInput = '[data-test="username"]';
  private passwordInput = '[data-test="password"]';
  private loginButton = '[data-test="login-button"]';
  private errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage() {
    logger.info('Navigating to the login page');
    await this.page.goto('https://www.saucedemo.com/');
    await this.waitForPageLoad();
  }

  /**
   * Login with the provided credentials
   * @param username 
   * @param password 
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in with username: ${username}`);
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.clickAndWait(this.loginButton);
  }

  /**
   * Get the error message text
   * @returns The error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if the error message is displayed
   * @returns True if the error message is displayed, false otherwise
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.errorMessage, { state: 'visible', timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}