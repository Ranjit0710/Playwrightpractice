// src/utils/element-helper.ts
export class ElementHelper {
    constructor(private page: Page) {}
    
    async waitAndClick(selector: string, options?: { timeout?: number, force?: boolean }) {
      await this.page.waitForSelector(selector, { state: 'visible', ...options });
      await this.page.click(selector, { force: options?.force });
    }
    
    async fillForm(formData: Record<string, string>) {
      for (const [field, value] of Object.entries(formData)) {
        await this.page.fill(`[name="${field}"]`, value);
      }
    }
    
    async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
      try {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
        return true;
      } catch {
        return false;
      }
    }
  }