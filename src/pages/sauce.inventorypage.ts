import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class InventoryPage extends BasePage {
  // Selectors
  private productList = '.inventory_item';
  private productTitle = '.inventory_item_name';
  private productPrice = '.inventory_item_price';
  private addToCartButton = (productId: string) => `[data-test="add-to-cart-${productId}"]`;
  private removeButton = (productId: string) => `[data-test="remove-${productId}"]`;
  private sortDropdown = '[data-test="product_sort_container"]';
  private shoppingCartBadge = '.shopping_cart_badge';
  private shoppingCartLink = '.shopping_cart_link';
  private hamburgerMenu = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the page title
   * @returns The page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the number of products displayed
   * @returns The number of products
   */
  async getProductCount(): Promise<number> {
    return await this.page.locator(this.productList).count();
  }

  /**
   * Get the list of product names
   * @returns Array of product names
   */
  async getProductNames(): Promise<string[]> {
    const products = this.page.locator(this.productTitle);
    const count = await products.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await products.nth(i).textContent();
      if (name) names.push(name.trim());
    }
    
    return names;
  }

  /**
   * Add a product to the cart by its name
   * @param productName The name of the product to add
   */
  async addProductToCart(productName: string): Promise<void> {
    logger.info(`Adding product to cart: ${productName}`);
    
    // Find the inventory item with the given name
    const productItem = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });
    
    // Click the Add to Cart button inside this item
    await productItem.locator('button').click();
    
    logger.info(`Added product to cart: ${productName}`);
  }

  /**
   * Sort products by the given option
   * @param sortOption The sort option (e.g., 'az', 'za', 'lohi', 'hilo')
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    logger.info(`Sorting products by: ${sortOption}`);
    
    try {
      // Try to directly select without waiting for visibility first
      await this.page.selectOption(this.sortDropdown, sortOption, { timeout: 60000 });
      
      // Wait for the page to stabilize
      await this.waitForPageLoad();
      logger.info('Successfully sorted products');
    } catch (error) {
      // If the standard approach fails, try alternative method
      logger.info('Standard sort failed, trying alternative approach');
      
      try {
        // Force-click the dropdown
        await this.page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) (element as HTMLElement).click();
        }, this.sortDropdown);
        
        // Small delay
        await this.page.waitForTimeout(500);
        
        // Select option by using JS directly
        await this.page.evaluate(({ selector, value }) => {
          const select = document.querySelector(selector) as HTMLSelectElement;
          if (select) select.value = value;
        
          // Dispatch change event to trigger React handlers
          const event = new Event('change', { bubbles: true });
          select.dispatchEvent(event);
        }, { selector: this.sortDropdown, value: sortOption });
        
        await this.waitForPageLoad();
        logger.info('Alternative sort approach succeeded');
      } catch (fallbackError) {
        logger.error('All sorting approaches failed', fallbackError);
        throw error; // Throw the original error
      }
    }
  }

  /**
   * Get the number of items in the cart
   * @returns The number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    try {
      const text = await this.page.locator(this.shoppingCartBadge).textContent();
      return text ? parseInt(text, 10) : 0;
    } catch (error) {
      return 0; // Return 0 if the badge is not present (cart is empty)
    }
  }

  /**
   * Navigate to the shopping cart
   */
  async goToCart(): Promise<void> {
    logger.info('Navigating to the shopping cart');
    await this.clickAndWait(this.shoppingCartLink);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    logger.info('Logging out');
    await this.page.click(this.hamburgerMenu);
    await this.page.waitForSelector(this.logoutLink, { state: 'visible' });
    await this.clickAndWait(this.logoutLink);
  }
}