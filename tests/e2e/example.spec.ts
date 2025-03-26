import { test, expect } from '@playwright/test';
import { ExamplePage } from '../../src/pages/example.page';

test.describe('Example tests', () => {
  test('should have correct title', async ({ page }) => {
    // Initialize page object
    const examplePage = new ExamplePage(page);
    
    // Navigate to the page
    await examplePage.navigate();
    
    // Get the title
    const title = await examplePage.getTitle();
    
    // Assert
    expect(title).toContain('Playwright');
  });
});