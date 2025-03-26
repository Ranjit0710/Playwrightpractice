// src/pages/base.page.ts
import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  constructor(public readonly page: Page) {}
  
  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Click on element and wait for page to load
   */
  async clickAndWait(selector: string, waitOptions?: { timeout?: number }) {
    logger.info(`Clicking on element: ${selector}`);
    await this.page.click(selector);
    await this.waitForPageLoad();
  }
  
  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return (await element.textContent() || '').trim();
  }
  
  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }
  
  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    logger.info(`Filling input ${selector} with value: ${value}`);
    await this.page.fill(selector, value);
  }
  
  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    logger.info(`Selecting option ${value} from dropdown ${selector}`);
    await this.page.selectOption(selector, value);
  }
  
  /**
   * Check/uncheck checkbox
   */
  async setCheckbox(selector: string, checked: boolean): Promise<void> {
    logger.info(`Setting checkbox ${selector} to ${checked ? 'checked' : 'unchecked'}`);
    if (checked) {
      await this.page.check(selector);
    } else {
      await this.page.uncheck(selector);
    }
  }
  
  /**
   * Execute action with error handling
   */
  async safeExecute<T>(action: () => Promise<T>, errorMsg: string): Promise<T> {
    try {
      return await action();
    } catch (error) {
      logger.error(`${errorMsg}: ${(error as Error).message}`);
      
      // Take screenshot on error
      await this.page.screenshot({ 
        path: `./reports/screenshots/error-${Date.now()}.png`,
        fullPage: true
      });
      
      throw error;
    }
  }
  
  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    logger.info(`Scrolling to element: ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }
  
  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
  
  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}