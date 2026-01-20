import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../../src/pages/registration-page';
import { HomePage } from '../../../src/pages/home-page';
import { OpenAccountPage } from '../../../src/pages/open-account-page';
import { AccountsOverviewPage } from '../../../src/pages/accounts-overview-page';
import { TransferFundsPage } from '../../../src/pages/transfer-funds-page';
import { BillPayPage } from '../../../src/pages/bill-pay-page';
import { generateUserRegistrationData } from '../../../src/utils/test-data-generator';
import { envConfig } from '../../../config/environment.config';

// Constants for test data
const REGISTRATION_PATH = '/parabank/register.htm';
const PARABANK_TITLE = 'ParaBank';

test.describe('ParaBank E2E Tests', () => {
  let registrationPage: RegistrationPage;
  let homePage: HomePage;
  let openAccountPage: OpenAccountPage;
  let accountsOverviewPage: AccountsOverviewPage;
  let transferFundsPage: TransferFundsPage;
  let billPayPage: BillPayPage;
  const userData = generateUserRegistrationData();

  test.beforeEach(({ page }) => {
    registrationPage = new RegistrationPage(page);
    homePage = new HomePage(page);
    openAccountPage = new OpenAccountPage(page);
    accountsOverviewPage = new AccountsOverviewPage(page);
    transferFundsPage = new TransferFundsPage(page);
    billPayPage = new BillPayPage(page);
  });

  test('Complete ParaBank user journey', async ({ page }) => {
    let newAccountId: string;
    // Design decision: Use Playwright test steps for better reporting and debugging,
    // allowing failed assertions to be clearly identified in test output.
    await test.step('Navigate to registration page', async () => {
      // Design decision: Use configured baseURL for environment flexibility
      const registrationUrl = `${envConfig.baseUrl}${REGISTRATION_PATH}`;
      await page.goto(registrationUrl);
      await page.waitForLoadState('networkidle');

      expect(await page.title()).toContain(PARABANK_TITLE);
      expect(page.url()).toContain('register');
    });

    await test.step('Register new user', async () => {
      await registrationPage.registerUser(userData);
      await registrationPage.verifyRegistrationSuccess(userData.username);
      await registrationPage.verifyUserLoggedInAfterRegistration(userData);
    });

    await test.step('Verify user is logged in', async () => {
      // ParaBank automatically logs in users after successful registration
      // Verify user access to banking features through navigation and welcome elements
      await homePage.verifyLoggedInUser();
      await homePage.verifyGlobalNavigationMenu();
    });

    await test.step('View accounts overview', async () => {
      // Navigate to accounts overview to see existing accounts and balances
      await homePage.navigateToAccountsOverview();

      await accountsOverviewPage.verifyAccountsOverviewDisplayed();
      await accountsOverviewPage.verifyBalanceInformationDisplayed();
    });

    await test.step('Open new savings account', async () => {
      // Create additional savings account for fund transfers
      await homePage.navigateToOpenAccount();

      newAccountId = await openAccountPage.openNewAccount('SAVINGS');
      await openAccountPage.verifyAccountOpened();
    });

    await test.step('Verify new account in overview', async () => {
      // Confirm new account appears in accounts overview with proper balance
      await homePage.navigateToAccountsOverview();

      await accountsOverviewPage.verifyAccountExists(newAccountId);
      await accountsOverviewPage.verifyBalanceInformationDisplayed();
    });

    await test.step('Transfer funds between accounts', async () => {
      // Transfer money between available accounts
      await homePage.navigateToTransferFunds();

      await transferFundsPage.transferFunds('100.00');
      await transferFundsPage.verifyTransferComplete();
    });

    await test.step('Pay bill', async () => {
      // Navigate to bill payment functionality
      await homePage.navigateToBillPay();

      // Verify bill payment page is accessible
      expect(page.url()).toContain('billpay');
      await billPayPage.verifyBillPayPageLoaded();
    });
  });
});
