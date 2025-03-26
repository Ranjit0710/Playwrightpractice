// src/pages/cart.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { logger } from '../../utils/logger';
// import { BasePage } from './base.page';
// import { logger } from '../utils/logger';

export class CartPage extends BasePage {
  // Selectors for Automation Exercise website
  readonly selectors = {
    pageTitle: '.breadcrumbs ol li.active',
    emptyCartMessage: '#empty_cart',
    cartItems: '#cart_info_table tbody tr',
    cartItemName: (index: number) => `#cart_info_table tbody tr:nth-child(${index + 1}) td.cart_description h4 a`,
    cartItemPrice: (index: number) => `#cart_info_table tbody tr:nth-child(${index + 1}) td.cart_price p`,
    cartItemQuantity: (index: number) => `#cart_info_table tbody tr:nth-child(${index + 1}) td.cart_quantity button`,
    cartItemTotal: (index: number) => `#cart_info_table tbody tr:nth-child(${index + 1}) td.cart_total p`,
    cartItemRemove: (index: number) => `#cart_info_table tbody tr:nth-child(${index + 1}) td.cart_delete a`,
    proceedToCheckoutButton: '.btn.btn-default.check_out',
    registerLoginLink: '.modal-body a',
    continueShopping: 'div.container a.btn.btn-primary',
    
    // Cart summary
    cartSummary: '.heading',
    cartTotalPrice: '#cart_info_table tfoot tr:nth-child(1) td.cart_total p.cart_total_price'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    logger.info('Navigating to Cart page');
    await this.page.goto('https://automationexercise.com/view_cart');
    await this.waitForPageLoad();
  }

  /**
   * Get the count of items in the cart
   * @returns The count of items
   */
  async getCartItemsCount(): Promise<number> {
    try {
      // If cart is empty, this will throw an error
      return await this.page.locator(this.selectors.cartItems).count();
    } catch (error) {
      logger.warn('Cart appears to be empty');
      return 0;
    }
  }

  /**
   * Check if cart is empty
   * @returns True if cart is empty, false otherwise
   */
  async isCartEmpty(): Promise<boolean> {
    try {
      // First check if the empty cart message is displayed
      const emptyMessageVisible = await this.isElementVisible(this.selectors.emptyCartMessage);
      if (emptyMessageVisible) {
        return true;
      }
      
      // If no explicit empty message, check the item count
      const itemCount = await this.getCartItemsCount();
      return itemCount === 0;
    } catch (error) {
      // If we encounter an error checking, assume it's because cart is empty
      return true;
    }
  }

  /**
   * Get the name of a cart item at the specified index
   * @param index The index of the item (0-based)
   * @returns The name of the item
   */
  async getCartItemName(index: number): Promise<string> {
    return await this.getText(this.selectors.cartItemName(index));
  }

  /**
   * Get the price of a cart item at the specified index
   * @param index The index of the item (0-based)
   * @returns The price of the item as a string (e.g., "Rs. 500")
   */
  async getCartItemPrice(index: number): Promise<string> {
    return await this.getText(this.selectors.cartItemPrice(index));
  }

  /**
   * Get the quantity of a cart item at the specified index
   * @param index The index of the item (0-based)
   * @returns The quantity of the item
   */
  async getCartItemQuantity(index: number): Promise<number> {
    const quantityText = await this.getText(this.selectors.cartItemQuantity(index));
    return parseInt(quantityText);
  }

  /**
   * Get the total price of a cart item at the specified index
   * @param index The index of the item (0-based)
   * @returns The total price of the item as a string (e.g., "Rs. 500")
   */
  async getCartItemTotal(index: number): Promise<string> {
    return await this.getText(this.selectors.cartItemTotal(index));
  }

  /**
   * Remove a cart item at the specified index
   * @param index The index of the item to remove (0-based)
   */
  async removeCartItem(index: number): Promise<void> {
    logger.info(`Removing item at index ${index} from cart`);
    await this.clickAndWait(this.selectors.cartItemRemove(index));
  }

  /**
   * Get the total price of all items in the cart
   * @returns The total price as a string (e.g., "Rs. 1500")
   */
  async getTotalPrice(): Promise<string> {
    return await this.getText(this.selectors.cartTotalPrice);
  }

  /**
   * Proceed to checkout
   * @returns True if checkout succeeded, false if login/register modal appeared
   */
  async proceedToCheckout(): Promise<boolean> {
    logger.info('Proceeding to checkout');
    await this.page.click(this.selectors.proceedToCheckoutButton);
    
    try {
      // Check if login/register modal appears (for non-logged in users)
      await this.page.waitForSelector('.modal-content', { state: 'visible', timeout: 3000 });
      logger.info('Login/register modal appeared');
      return false;
    } catch (error) {
      // No modal appeared, checkout continues
      await this.waitForPageLoad();
      logger.info('Proceeded to checkout successfully');
      return true;
    }
  }

  /**
   * Click the Register/Login button from modal
   */
  async clickRegisterLogin(): Promise<void> {
    logger.info('Clicking Register/Login button from modal');
    await this.clickAndWait(this.selectors.registerLoginLink);
  }

  /**
   * Continue shopping (Go back to products page)
   */
  async continueShopping(): Promise<void> {
    logger.info('Clicking Continue Shopping button');
    await this.clickAndWait(this.selectors.continueShopping);
  }

  /**
   * Get details of all items in the cart
   * @returns Array of cart items with name, price, quantity, and total
   */
  async getCartItemDetails(): Promise<Array<{name: string, price: string, quantity: number, total: string}>> {
    const itemCount = await this.getCartItemsCount();
    const items = [];
    
    for (let i = 0; i < itemCount; i++) {
      const name = await this.getCartItemName(i);
      const price = await this.getCartItemPrice(i);
      const quantity = await this.getCartItemQuantity(i);
      const total = await this.getCartItemTotal(i);
      
      items.push({ name, price, quantity, total });
    }
    
    return items;
  }

  /**
   * Reload the page and wait for it to load
   */
  async reloadPage(): Promise<void> {
    logger.info('Reloading cart page');
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Get current URL
   * @returns The current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}