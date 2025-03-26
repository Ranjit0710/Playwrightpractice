// 3. CartPage - src/pages/cart.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class CartPage extends BasePage {
  // Selectors
  private cartItems = '.cart_item';
  private cartItemName = '.inventory_item_name';
  private cartItemPrice = '.inventory_item_price';
  private removeButton = (productId: string) => `[data-test="remove-${productId}"]`;
  private continueShoppingButton = '[data-test="continue-shopping"]';
  private checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the number of items in the cart
   * @returns The number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.page.locator(this.cartItems).count();
  }

  /**
   * Get the list of product names in the cart
   * @returns Array of product names
   */
  async getCartItemNames(): Promise<string[]> {
    const items = this.page.locator(this.cartItemName);
    const count = await items.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await items.nth(i).textContent();
      if (name) names.push(name.trim());
    }
    
    return names;
  }

  /**
   * Remove an item from the cart by its name
   * @param productName The name of the product to remove
   */
  async removeItemFromCart(productName: string): Promise<void> {
    logger.info(`Removing item from cart: ${productName}`);
    const items = this.page.locator(this.cartItemName);
    const count = await items.count();
    
    for (let i = 0; i < count; i++) {
      const name = await items.nth(i).textContent();
      if (name && name.trim() === productName) {
        // Get the product ID from the parent container
        const itemContainer = items.nth(i).locator('..').locator('..');
        const fullId = await itemContainer.locator('button').first().getAttribute('id') || '';
        const productId = fullId.replace('remove-', '');
        
        await this.page.click(this.removeButton(productId));
        logger.info(`Removed item from cart: ${productName}`);
        return;
      }
    }
    
    throw new Error(`Product not found in cart: ${productName}`);
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    logger.info('Continuing shopping');
    await this.clickAndWait(this.continueShoppingButton);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    logger.info('Proceeding to checkout');
    await this.clickAndWait(this.checkoutButton);
  }
}