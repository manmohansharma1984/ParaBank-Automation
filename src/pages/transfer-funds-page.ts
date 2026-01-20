import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Transfer Funds page for moving money between accounts.
 *
 * Design decision: Focused page object for fund transfer operations,
 * enabling verification of successful transfers between accounts.
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
    this.transferCompleteMessage = page.locator('text=/Transfer Complete!/');
  }

  /**
   * Transfers specified amount from one account to another.
   * If account IDs are not provided, uses the default/first available accounts.
   */
  async transferFunds(amount: string, fromAccountId?: string, toAccountId?: string): Promise<void> {
    await this.amountInput.fill(amount);

    // Select from account if provided, otherwise use default
    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }

    // Select to account if provided, otherwise use default (typically the second account)
    if (toAccountId) {
      await this.toAccountSelect.selectOption(toAccountId);
    }

    await this.transferButton.click();
  }

  /**
   * Verifies fund transfer was completed successfully.
   */
  async verifyTransferComplete(): Promise<void> {
    await this.transferCompleteMessage.waitFor({ state: 'visible' });
  }
}