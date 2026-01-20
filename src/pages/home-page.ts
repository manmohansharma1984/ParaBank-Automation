import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Home/Dashboard page for logged-in users.
 *
 * Page object for the home page after login
 * and basic navigation validation, following existing Page Object pattern.
 */
export class HomePage extends BasePage {
  private readonly navigationMenu: Locator;
  private readonly welcomeMessage: Locator;
  private readonly accountsOverviewLink: Locator;
  private readonly openAccountLink: Locator;
  private readonly transferFundsLink: Locator;
  private readonly billPayLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationMenu = page.locator('a[href*="openaccount"], a[href*="overview"], a[href*="transfer"]');
    // ParaBank shows "Welcome <name>" sometimes as a paragraph, sometimes as a title element.
    this.welcomeMessage = page.locator('p:has-text("Welcome"), h1.title:has-text("Welcome"), .title:has-text("Welcome")');
    this.accountsOverviewLink = page.locator('a[href*="overview"]');
    this.openAccountLink = page.locator('a[href*="openaccount"]');
    this.transferFundsLink = page.locator('a[href*="transfer"]');
    this.billPayLink = page.locator('a[href*="billpay"]');
    this.logoutLink = page.locator('a:has-text("Log Out"), a[href*="logout"]');
  }

  /**
   * Verifies user is successfully logged in and on home page.
   */
  async verifyLoggedInUser(): Promise<void> {
    await this.welcomeMessage.first().waitFor({ state: 'visible' });
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
  }

  /**
   * Navigates to bill pay page.
   */
  async navigateToBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.first().waitFor({ state: 'visible' });
    await this.logoutLink.first().click();
    await this.page.waitForLoadState('networkidle');
  }
}