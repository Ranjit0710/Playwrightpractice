// 5. CheckoutOverviewPage - src/pages/checkout-overview.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class CheckoutOverviewPage extends BasePage {
  // Selectors
  private cartItems = '.cart_item';
  private cartItemName = '.inventory_item_name';
  private cartItemPrice = '.inventory_item_price';
  private subtotalLabel = '.summary_subtotal_label';
  private taxLabel = '.summary_tax_label';
  private totalLabel = '.summary_total_label';
  private cancelButton = '[data-test="cancel"]';
  private finishButton = '[data-test="finish"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the subtotal amount
   * @returns The subtotal amount as a number
   */
  async getSubtotal(): Promise<number> {
    const subtotalText = await this.getText(this.subtotalLabel);
    // Extract the number from text like "Item total: $29.99"
    const match = subtotalText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the tax amount
   * @returns The tax amount as a number
   */
  async getTax(): Promise<number> {
    const taxText = await this.getText(this.taxLabel);
    // Extract the number from text like "Tax: $2.40"
    const match = taxText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the total amount
   * @returns The total amount as a number
   */
  async getTotal(): Promise<number> {
    const totalText = await this.getText(this.totalLabel);
    // Extract the number from text like "Total: $32.39"
    const match = totalText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Cancel checkout and return to the inventory
   */
  async cancelCheckout(): Promise<void> {
    logger.info('Cancelling checkout');
    await this.clickAndWait(this.cancelButton);
  }

  /**
   * Finish the checkout process
   */
  async finishCheckout(): Promise<void> {
    logger.info('Finishing checkout');
    await this.clickAndWait(this.finishButton);
  }
}