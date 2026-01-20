import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Accounts Overview page for viewing account details and balances.
 *
 * Design decision: Dedicated page object for account overview functionality,
 * enabling verification of account creation and balance information.
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
   * Verifies balance information is displayed (presence of currency symbols).
   */
  async verifyBalanceInformationDisplayed(): Promise<void> {
    const balanceText = this.page.locator('text=/\\$|\\$0\\.00|Balance/');
    await balanceText.first().waitFor({ state: 'visible' });
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