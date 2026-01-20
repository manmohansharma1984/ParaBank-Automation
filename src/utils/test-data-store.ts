import * as fs from 'fs';
import * as path from 'path';

interface TestData {
  userData?: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  accountNumber?: string;
  initialBalance?: number;
  paymentAmount?: string;
  paymentAccountId?: string;
}

class TestDataStore {
  private static instance: TestDataStore;
  private data: TestData = {};
  private readonly dataFilePath: string;

  private constructor() {
    this.dataFilePath = path.join(process.cwd(), 'test-data.json');
    this.loadData();
  }

  public static getInstance(): TestDataStore {
    if (!TestDataStore.instance) {
      TestDataStore.instance = new TestDataStore();
    }
    return TestDataStore.instance;
  }

  private loadData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.data = JSON.parse(fileContent) as TestData;
      }
    } catch (error) {
      console.warn('Failed to load test data:', error);
      this.data = {};
    }
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.warn('Failed to save test data:', error);
    }
  }

  public setUserData(userData: TestData['userData']): void {
    this.data.userData = userData;
    this.saveData();
  }

  public getUserData(): TestData['userData'] {
    return this.data.userData;
  }

  public setAccountNumber(accountNumber: string): void {
    this.data.accountNumber = accountNumber;
    this.saveData();
  }

  public getAccountNumber(): string | undefined {
    return this.data.accountNumber;
  }

  public setInitialBalance(balance: number): void {
    this.data.initialBalance = balance;
    this.saveData();
  }

  public getInitialBalance(): number | undefined {
    return this.data.initialBalance;
  }

  public setPaymentData(amount: string, accountId: string): void {
    this.data.paymentAmount = amount;
    this.data.paymentAccountId = accountId;
    this.saveData();
  }

  public getPaymentData(): { amount: string | undefined; accountId: string | undefined } {
    return {
      amount: this.data.paymentAmount,
      accountId: this.data.paymentAccountId,
    };
  }

  public clearData(): void {
    this.data = {};
    if (fs.existsSync(this.dataFilePath)) {
      fs.unlinkSync(this.dataFilePath);
    }
  }
}

export const testDataStore = TestDataStore.getInstance();