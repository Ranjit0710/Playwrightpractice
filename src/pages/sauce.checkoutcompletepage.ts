// 6. CheckoutCompletePage - src/pages/checkout-complete.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class CheckoutCompletePage extends BasePage {
  // Selectors
  private completeHeader = '.complete-header';
  private completeText = '.complete-text';
  private backHomeButton = '[data-test="back-to-products"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the complete header text
   * @returns The complete header text
   */
  async getCompleteHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  /**
   * Get the complete text
   * @returns The complete text
   */
  async getCompleteText(): Promise<string> {
    return await this.getText(this.completeText);
  }

  /**
   * Go back to the home page
   */
  async backToHome(): Promise<void> {
    logger.info('Going back to home');
    await this.clickAndWait(this.backHomeButton);
  }
}