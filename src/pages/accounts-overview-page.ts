import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Accounts Overview page for viewing account details and balances.
 *
 * Page object for viewing account balances and details
 */
export class AccountsOverviewPage extends BasePage {
  private readonly accountTable: Locator;
  private readonly accountLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTable = page.locator('table, .account-table, #accountTable');
    this.accountLinks = page.locator('a[href*="activity"]');
  }

  /**
   * Verifies accounts overview page is displayed with account information.
   */
  async verifyAccountsOverviewDisplayed(): Promise<void> {
    await this.accountTable.waitFor({ state: 'visible' });
  }

  /**
   * Verifies specific account exists and has balance information.
   */
  async verifyAccountExists(accountId: string): Promise<void> {
    const accountLink = this.accountLinks.filter({ hasText: accountId });
    await accountLink.waitFor({ state: 'visible' });
  }

  /**
   * Verifies balance information is displayed in the accounts table.
   */
  async verifyBalanceInformationDisplayed(): Promise<void> {
    await this.accountTable.waitFor({ state: 'visible' });

    const balanceCells = this.page.locator('table td').filter({ hasText: /\$/ });
    await balanceCells.first().waitFor({ state: 'visible' });
  }

   /**
    * Returns parsed balance and available amount for a given account row.
    * This is used to validate that the overview shows numeric balance details.
    */
  async getAccountBalanceDetails(accountId: string): Promise<{ balance: number; available: number }> {
    const row = this.page
      .locator('tr', { has: this.page.locator('a[href*="activity"]', { hasText: accountId }) })
      .first();

    await row.waitFor({ state: 'visible' });

    const cells = row.locator('td');
    const balanceText = (await cells.nth(1).textContent())?.trim() ?? '';
    const availableText = (await cells.nth(2).textContent())?.trim() ?? '';

    const parseAmount = (text: string): number => {
      const cleaned = text.replace(/[^0-9.-]/g, '');
      const value = parseFloat(cleaned);
      if (Number.isNaN(value)) {
        throw new Error(`Failed to parse balance amount from "${text}"`);
      }
      return value;
    };

    return {
      balance: parseAmount(balanceText),
      available: parseAmount(availableText),
    };
  }

  /**
   * Gets the total number of accounts displayed.
   */
  async getAccountCount(): Promise<number> {
    return await this.accountLinks.count();
  }

  /**
   * Gets the first account ID from the overview (typically the original checking account).
   */
  async getFirstAccountId(): Promise<string> {
    const firstAccountLink = this.accountLinks.first();
    const href = await firstAccountLink.getAttribute('href');
    if (!href) {
      throw new Error('Could not find account link');
    }
    // Extract account ID from href like "activity.htm?id=12345"
    const match = href.match(/id=(\d+)/);
    if (!match) {
      throw new Error('Could not extract account ID from link');
    }
    return match[1];
  }
}