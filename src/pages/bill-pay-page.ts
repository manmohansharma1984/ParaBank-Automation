import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Bill Payment page for paying bills and utilities.
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
    // Clear locators for bill payment form - primary ID with name fallback
    this.payeeNameInput = page.locator('#payee\\.name, input[name*="payee"]').first();
    this.addressInput = page.locator('#payee\\.address\\.street, input[name*="street"]').first();
    this.cityInput = page.locator('#payee\\.address\\.city, input[name*="city"]').first();
    this.stateInput = page.locator('#payee\\.address\\.state, input[name*="state"]').first();
    this.zipCodeInput = page.locator('#payee\\.address\\.zipCode, input[name*="zip"]').first();
    this.phoneInput = page.locator('#payee\\.phoneNumber, input[name*="phone"]').first();
    this.accountInput = page.locator('#payee\\.accountNumber, input[name*="account"]').first();
    this.verifyAccountInput = page.locator('#verifyAccount, input[name*="verify"]').first();
    this.amountInput = page.locator('#amount, input[name*="amount"]').first();
    this.sendPaymentButton = page.locator('input[value="Send Payment"], input[type="submit"]').first();
    this.billPaymentCompleteMessage = page.locator('h1:has-text("Bill Payment Complete"), h1:has-text("Bill Payment")').first();
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
    await this.payeeNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.payeeNameInput.fill(payeeDetails.name);

    await this.addressInput.waitFor({ state: 'visible' });
    await this.addressInput.fill(payeeDetails.address);

    await this.cityInput.waitFor({ state: 'visible' });
    await this.cityInput.fill(payeeDetails.city);

    await this.stateInput.waitFor({ state: 'visible' });
    await this.stateInput.fill(payeeDetails.state);

    await this.zipCodeInput.waitFor({ state: 'visible' });
    await this.zipCodeInput.fill(payeeDetails.zipCode);

    await this.phoneInput.waitFor({ state: 'visible' });
    await this.phoneInput.fill(payeeDetails.phone);

    await this.accountInput.waitFor({ state: 'visible' });
    await this.accountInput.fill(payeeDetails.account);

    await this.verifyAccountInput.waitFor({ state: 'visible' });
    await this.verifyAccountInput.fill(payeeDetails.account);

    await this.amountInput.waitFor({ state: 'visible' });
    await this.amountInput.fill(payeeDetails.amount);

    await this.sendPaymentButton.waitFor({ state: 'visible' });
    await this.sendPaymentButton.click();

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verifies bill payment was completed successfully.
   */
  async verifyBillPaymentComplete(): Promise<void> {
    try {
      await this.billPaymentCompleteMessage.waitFor({ state: 'visible' });
    } catch (error) {
      // Check for success indicators on the page
      const pageText = await this.page.locator('body').textContent();
      const hasSuccessIndicators = pageText?.includes('complete') || pageText?.includes('successful') || pageText?.includes('paid');

      if (!hasSuccessIndicators) {
        throw new Error('Bill payment completion not verified');
      }
    }
  }

  /**
   * Verifies bill pay page is loaded and accessible.
   */
  async verifyBillPayPageLoaded(): Promise<void> {
    const pageTitle = this.page.locator('.title, h1').first();
    await pageTitle.waitFor({ state: 'visible' });
  }
}