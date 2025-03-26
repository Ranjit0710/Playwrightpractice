import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExamplePage extends BasePage {
  // Selectors
  private readonly title = 'h1';
  private readonly getStartedLink = 'text=Get started';

  constructor(page: Page) {
    super(page);
  }

  // Add this method to fix the error
  async navigate(path: string = ''): Promise<void> {
    // You may want to customize this for your specific page
    await this.page.goto(`https://playwright.dev${path}`);
    await this.waitForPageLoad();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async clickGetStarted(): Promise<void> {
    await this.clickAndWait(this.getStartedLink);
  }
}