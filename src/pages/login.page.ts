// src/pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Selectors
  private usernameInput = 'input[name="username"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[type="submit"]';
  private errorMessage = '.oxd-alert-content-text';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Login to OrangeHRM with username and password
   * @param username Username to login with
   * @param password Password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.clickAndWait(this.loginButton);
  }

  /**
   * Get the error message element
   * @returns Locator for the error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}