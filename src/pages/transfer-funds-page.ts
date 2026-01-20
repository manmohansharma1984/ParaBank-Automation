import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Transfer Funds page for moving money between accounts.
 *
 * Page object for transferring money between accounts
 */
export class TransferFundsPage extends BasePage {
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly toAccountSelect: Locator;
  private readonly transferButton: Locator;
  private readonly transferCompleteMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
    // The confirmation title is the most reliable visible indicator.
    this.transferCompleteMessage = page.locator('h1.title:has-text("Transfer Complete")');
  }

  /**
   * Gets available account IDs from the "From Account" dropdown.
   */
  async getAvailableFromAccounts(): Promise<string[]> {
    await this.fromAccountSelect.waitFor({ state: 'visible' });
    return await this.fromAccountSelect.locator('option').allTextContents();
  }

  /**
   * Gets available account IDs from the "To Account" dropdown.
   */
  async getAvailableToAccounts(): Promise<string[]> {
    await this.toAccountSelect.waitFor({ state: 'visible' });
    return await this.toAccountSelect.locator('option').allTextContents();
  }

  /**
   * Transfers specified amount from one account to another.
   * If account IDs are not provided, uses the default/first available accounts.
   * Ensures transfer is not to the same account.
   */
  async transferFunds(amount: string, fromAccountId?: string, toAccountId?: string): Promise<void> {
    await this.amountInput.fill(amount);

    // Select from account if provided, otherwise use default
    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }

    // Select to account - ensure it's different from the from account
    if (toAccountId) {
      await this.toAccountSelect.selectOption(toAccountId);
    } else if (fromAccountId) {
      // If no toAccountId provided but we have a fromAccountId,
      // find a different account to transfer to
      const availableToAccounts = await this.getAvailableToAccounts();
      const differentAccount = availableToAccounts.find(account => account !== fromAccountId);
      if (differentAccount) {
        await this.toAccountSelect.selectOption(differentAccount);
      }
      // If no different account found, let it use the default (first option)
    }

    await this.transferButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verifies fund transfer was completed successfully.
   */
  async verifyTransferComplete(): Promise<void> {
    await this.transferCompleteMessage.first().waitFor({ state: 'visible' });
  }
}