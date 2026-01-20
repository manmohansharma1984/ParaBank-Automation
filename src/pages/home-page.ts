import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Home/Dashboard page for logged-in users.
 *
 * Design decision: Minimal page object focused on post-login verification
 * and basic navigation validation, following existing Page Object pattern.
 */
export class HomePage extends BasePage {
  private readonly navigationMenu: Locator;
  private readonly welcomeMessage: Locator;
  private readonly accountsOverviewLink: Locator;
  private readonly openAccountLink: Locator;
  private readonly transferFundsLink: Locator;
  private readonly billPayLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationMenu = page.locator('a[href*="openaccount"], a[href*="overview"], a[href*="transfer"]');
    this.welcomeMessage = page.locator('h1.title, .title').filter({ hasText: 'Welcome' });
    this.accountsOverviewLink = page.locator('a[href*="overview"]');
    this.openAccountLink = page.locator('a[href*="openaccount"]');
    this.transferFundsLink = page.locator('a[href*="transfer"]');
    this.billPayLink = page.locator('a[href*="billpay"]');
  }

  /**
   * Verifies user is successfully logged in and on home page.
   */
  async verifyLoggedInUser(): Promise<void> {
    await this.welcomeMessage.waitFor({ state: 'visible' });
  }

  /**
   * Verifies global navigation menu is present and functional.
   */
  async verifyGlobalNavigationMenu(): Promise<void> {
    await this.navigationMenu.first().waitFor({ state: 'visible' });
  }

  /**
   * Navigates to accounts overview page.
   */
  async navigateToAccountsOverview(): Promise<void> {
    await this.accountsOverviewLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigates to open new account page.
   */
  async navigateToOpenAccount(): Promise<void> {
    await this.openAccountLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigates to transfer funds page.
   */
  async navigateToTransferFunds(): Promise<void> {
    await this.transferFundsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigates to bill pay page.
   */
  async navigateToBillPay(): Promise<void> {
    await this.billPayLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}