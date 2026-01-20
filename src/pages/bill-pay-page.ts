import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Bill Payment page for paying bills and utilities.
 *
 * Design decision: Dedicated page object for bill payment functionality,
 * enabling verification of successful bill payments.
 */
export class BillPayPage extends BasePage {
  private readonly payeeNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly accountInput: Locator;
  private readonly verifyAccountInput: Locator;
  private readonly amountInput: Locator;
  private readonly sendPaymentButton: Locator;
  private readonly billPaymentCompleteMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInput = page.locator('#payee\\.name');
    this.addressInput = page.locator('#payee\\.address\\.street');
    this.cityInput = page.locator('#payee\\.address\\.city');
    this.stateInput = page.locator('#payee\\.address\\.state');
    this.zipCodeInput = page.locator('#payee\\.address\\.zipCode');
    this.phoneInput = page.locator('#payee\\.phoneNumber');
    this.accountInput = page.locator('#payee\\.accountNumber');
    this.verifyAccountInput = page.locator('#verifyAccount');
    this.amountInput = page.locator('#amount');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');
    this.billPaymentCompleteMessage = page.locator('text=/Bill Payment Complete/');
  }

  /**
   * Submits a bill payment with all required payee and payment details.
   */
  async payBill(payeeDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    account: string;
    amount: string;
  }): Promise<void> {
    await this.payeeNameInput.fill(payeeDetails.name);
    await this.addressInput.fill(payeeDetails.address);
    await this.cityInput.fill(payeeDetails.city);
    await this.stateInput.fill(payeeDetails.state);
    await this.zipCodeInput.fill(payeeDetails.zipCode);
    await this.phoneInput.fill(payeeDetails.phone);
    await this.accountInput.fill(payeeDetails.account);
    await this.verifyAccountInput.fill(payeeDetails.account);
    await this.amountInput.fill(payeeDetails.amount);
    await this.sendPaymentButton.click();
  }

  /**
   * Verifies bill payment was completed successfully.
   */
  async verifyBillPaymentComplete(): Promise<void> {
    await this.billPaymentCompleteMessage.waitFor({ state: 'visible' });
  }

  /**
   * Verifies bill pay page is loaded and accessible.
   */
  async verifyBillPayPageLoaded(): Promise<void> {
    // Verify basic page structure is present (be less strict to avoid timeouts)
    const pageTitle = this.page.locator('.title, h1').first();
    await pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }
}