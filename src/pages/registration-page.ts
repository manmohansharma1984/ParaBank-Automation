import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Registration page object for ParaBank user creation.
 *
 * Handles user registration separately from the test flow
 * reuse across different test scenarios and maintain clear separation of concerns.
 */
export class RegistrationPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ssnInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.addressInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.confirmPasswordInput = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
    this.errorMessage = page.locator('.error, span.error');
  }

  async navigate(): Promise<void> {
    await super.navigate('/parabank/register.htm');
  }

  async fillRegistrationForm(userData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.fillField(this.firstNameInput, userData.firstName);
    await this.fillField(this.lastNameInput, userData.lastName);
    await this.fillField(this.addressInput, userData.address);
    await this.fillField(this.cityInput, userData.city);
    await this.fillField(this.stateInput, userData.state);
    await this.fillField(this.zipCodeInput, userData.zipCode);
    await this.fillField(this.phoneInput, userData.phone);
    await this.fillField(this.ssnInput, userData.ssn);
    await this.fillField(this.usernameInput, userData.username);
    await this.fillField(this.passwordInput, userData.password);
    await this.fillField(this.confirmPasswordInput, userData.confirmPassword);
  }

  async submitRegistration(): Promise<void> {
    await this.click(this.registerButton);
    await this.page.waitForLoadState('networkidle');
  }

  async registerUser(userData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.fillRegistrationForm(userData);
    await this.submitRegistration();
  }

  async verifyRegistrationSuccess(expectedUsername?: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    const title = this.page.locator('.title, h1.title').first();
    const titleText = await title.textContent();

    expect(titleText).toMatch(/Welcome|Account Services|Accounts Overview/i);

    if (expectedUsername) {
      const welcomeMessage = this.page.locator('h1.title, .title').filter({ hasText: 'Welcome' });
      await welcomeMessage.waitFor({ state: 'visible' });
    }
  }

  /**
   * Verifies that user registration was successful and user is logged in.
   */
  async verifyUserLoggedInAfterRegistration(userData: { firstName: string; username: string }): Promise<void> {
    // Verify welcome message is displayed
    const welcomeMessage = this.page.locator('h1.title, .title').filter({ hasText: 'Welcome' });
    await welcomeMessage.waitFor({ state: 'visible' });

    // Verify navigation menu is available (indicating successful login)
    const navigationMenu = this.page.locator('a[href*="openaccount"], a[href*="overview"]');
    await navigationMenu.first().waitFor({ state: 'visible' });
  }

  async getErrorMessage(): Promise<string> {
    const errorCount = await this.errorMessage.count();
    if (errorCount > 0) {
      return this.getTextContent(this.errorMessage.first());
    }
    return '';
  }
}
