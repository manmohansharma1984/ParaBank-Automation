import { Page, Locator } from '@playwright/test';

/**
 * Base page object class providing common Playwright interactions.
 *
 * Design decision: Centralize element waiting and interaction logic to ensure
 * consistent behavior across all page objects and reduce duplication.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = ''): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'https://parabank.parasoft.com';
    const url = path ? `${baseUrl}${path}` : baseUrl;
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  // Helper methods that get reused across pages
  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async selectDropdown(
    locator: Locator,
    value: string | { label?: string; value?: string }
  ): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async getTextContent(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() || '';
  }
}
