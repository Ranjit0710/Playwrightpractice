
// 4. CheckoutInfoPage - src/pages/checkout-info.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class CheckoutInfoPage extends BasePage {
  // Selectors
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private continueButton = '[data-test="continue"]';
  private cancelButton = '[data-test="cancel"]';
  private errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill the checkout information form
   * @param firstName First name
   * @param lastName Last name
   * @param postalCode Postal code
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    logger.info(`Filling checkout info: ${firstName} ${lastName}, ${postalCode}`);
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Continue to the next step
   */
  async continueToNextStep(): Promise<void> {
    logger.info('Continuing to next checkout step');
    await this.clickAndWait(this.continueButton);
  }

  /**
   * Cancel checkout and return to the cart
   */
  async cancelCheckout(): Promise<void> {
    logger.info('Cancelling checkout');
    await this.clickAndWait(this.cancelButton);
  }

  /**
   * Get the error message text
   * @returns The error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}