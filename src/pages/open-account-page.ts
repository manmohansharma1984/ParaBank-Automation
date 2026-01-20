import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Open New Account page for creating additional bank accounts.
 *
 * Design decision: Focused page object for account creation functionality,
 * following existing Page Object pattern for ParaBank operations.
 */
export class OpenAccountPage extends BasePage {
  private readonly accountTypeSelect: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly openAccountButton: Locator;
  private readonly accountOpenedMessage: Locator;
  private readonly newAccountId: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.accountOpenedMessage = page.locator('text=/Account Opened!/');
    this.newAccountId = page.locator('#newAccountId');
  }

  /**
   * Opens a new account of specified type from existing account.
   */
  async openNewAccount(accountType: 'CHECKING' | 'SAVINGS', fromAccountId?: string): Promise<string> {
    // Select account type
    await this.accountTypeSelect.selectOption(accountType);

    // If fromAccountId provided, select it
    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }

    // Submit account creation
    await this.openAccountButton.click();

    // Verify success and capture new account ID
    await this.accountOpenedMessage.waitFor({ state: 'visible' });
    const accountId = await this.newAccountId.textContent();

    if (!accountId) {
      throw new Error('Failed to capture new account ID');
    }

    return accountId.trim();
  }

  /**
   * Verifies account creation was successful.
   */
  async verifyAccountOpened(): Promise<void> {
    await this.accountOpenedMessage.waitFor({ state: 'visible' });
  }
}