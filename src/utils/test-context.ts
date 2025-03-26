/**
 * Manages test context and state across page objects
 */
import { Page } from '@playwright/test';
import { logger } from './logger';

export class TestContext {
  private testData: Map<string, any> = new Map();
  
  constructor(public readonly page: Page) {}
  
  /**
   * Set test data for sharing between page objects and tests
   */
  setData(key: string, value: any): void {
    this.testData.set(key, value);
  }
  
  /**
   * Get test data that was previously set
   */
  getData<T>(key: string): T | undefined {
    return this.testData.get(key) as T | undefined;
  }
  
  /**
   * Clear all test data
   */
  clearData(): void {
    this.testData.clear();
  }
  
  /**
   * Log the URL and title for debugging
   */
  async logPageInfo(): Promise<void> {
    const url = this.page.url();
    const title = await this.page.title();
    logger.info(`Current page: "${title}" (${url})`);
  }
  
  /**
   * Store details of a product for later verification
   */
  storeProductDetails(details: {
    name: string;
    price: string;
    quantity?: number;
  }): void {
    this.setData(`product_${details.name}`, details);
    logger.info(`Stored product details for ${details.name}`);
  }
  
  /**
   * Store a screenshot for reporting
   */
  async takeScreenshot(name: string): Promise<string> {
    const filename = `./reports/screenshots/${name}_${Date.now()}.png`;
    await this.page.screenshot({ path: filename });
    logger.info(`Screenshot saved: ${filename}`);
    return filename;
  }}