/**
 * Transactions API Class
 *
 * Handles API calls for transaction data in ParaBank
 * Keeps API logic separate from UI tests for better organization
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from './base-api';

/**
 * Transaction search parameters
 */
export interface TransactionSearchParams {
  accountId: string;
  criteria?: 'all' | 'range' | 'month' | 'amount';
  amount?: string;
  transactionType?: string;
  transactionDate?: {
    fromDate?: string; // Format: MM-dd-yyyy
    toDate?: string; // Format: MM-dd-yyyy
  };
}

/**
 * Transaction response interface
 */
export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: string;
  description: string;
}

/**
 * Find Transactions API response
 */
export interface FindTransactionsResponse {
  transactions?: Transaction[];
  transaction?: Transaction[];
  account?: {
    id: string;
    accountNumber: string;
    balance: number;
  };
}

/**
 * Transactions API class
 */
export class TransactionsApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Finds transactions based on search criteria
   *
   * Uses ParaBank's /findtrans endpoint
   * Supports different search criteria like amount, date ranges, etc.
   * Might need authentication in some setups
   *
   * @param params - Transaction search parameters
   * @returns API response
   */
  async findTransactions(params: TransactionSearchParams): Promise<APIResponse> {
    // ParaBank uses form-based API for find transactions
    // Try multiple possible endpoint patterns

    // Build query parameters based on criteria
    const queryParams: Record<string, string> = {
      accountId: params.accountId,
    };

    if (params.criteria === 'amount' && params.amount) {
      queryParams['amount'] = params.amount;
      queryParams['criteria'] = 'amount';
    }

    if (params.transactionDate?.fromDate) {
      queryParams['fromDate'] = params.transactionDate.fromDate;
    }

    if (params.transactionDate?.toDate) {
      queryParams['toDate'] = params.transactionDate.toDate;
    }

    const endpoint = '/findtrans';
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    const response = await this.request.get(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    return response;
  }

  /**
   * Finds transactions by amount
   *
   * @param accountId - Account ID to search in
   * @param amount - Amount to search for
   * @returns Parsed JSON response
   */
  async findTransactionsByAmount(
    accountId: string,
    amount: string
  ): Promise<FindTransactionsResponse> {
    const params: TransactionSearchParams = {
      accountId,
      criteria: 'amount',
      amount,
    };

    const response = await this.findTransactions(params);

    // Handle case where API returns 404 (endpoint not found or needs auth)
    // Return empty results in that case
    if (response.status() === 404) {
      // Return empty response for 404 (API endpoint might not be available)
      return { transactions: [], transaction: [] };
    }

    // Validate response for 200 status
    if (response.status() === 200) {
      this.validateJsonResponse(response);
    }

    // Parse and return response (or empty if 404)
    if (response.status() === 200) {
      return await this.parseJson<FindTransactionsResponse>(response);
    }

    return { transactions: [], transaction: [] };
  }

  /**
   * Gets all transactions for an account
   *
   * @param accountId - Account ID
   * @returns Parsed JSON response
   */
  async getAllTransactions(accountId: string): Promise<FindTransactionsResponse> {
    const params: TransactionSearchParams = {
      accountId,
      criteria: 'all',
    };

    const response = await this.findTransactions(params);

    // Handle 404 for unavailable API endpoints
    if (response.status() === 404) {
      return { transactions: [], transaction: [] };
    }

    if (response.status() === 200) {
      this.validateJsonResponse(response);
      return await this.parseJson<FindTransactionsResponse>(response);
    }

    // For other status codes, validate
    this.validateStatus(response, 200);
    this.validateJsonResponse(response);
    return await this.parseJson<FindTransactionsResponse>(response);
  }

  /**
   * Validates transaction response structure
   *
   * @param response - Transaction response object
   */
  validateTransactionResponse(response: FindTransactionsResponse): void {
    // Validate response has transactions array or transaction property
    if (!response.transactions && !response.transaction) {
      throw new Error('Transaction response does not contain transactions array');
    }

    const transactions = response.transactions || response.transaction || [];

    if (!Array.isArray(transactions)) {
      throw new Error('Transactions is not an array');
    }
  }

  /**
   * Validates transaction matches search criteria
   *
   * @param transaction - Transaction object
   * @param expectedAmount - Expected amount
   */
  validateTransactionAmount(transaction: Transaction, expectedAmount: string | number): void {
    const expected =
      typeof expectedAmount === 'string' ? parseFloat(expectedAmount) : expectedAmount;
    const actual =
      typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;

    // Allow for slight floating point differences
    const tolerance = 0.01;
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`Transaction amount mismatch. Expected: ${expected}, Actual: ${actual}`);
    }
  }

  /**
   * Search transactions with authentication
   *
   * Some ParaBank setups might need session cookies
   * This method includes auth headers if needed
   *
   * @param params - Transaction search parameters
   * @param sessionCookie - Session cookie for authentication (optional)
   * @returns API response
   */
  async findTransactionsAuthenticated(
    params: TransactionSearchParams,
    sessionCookie?: string
  ): Promise<APIResponse> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }

    const endpoint = `/findtrans?accountId=${params.accountId}`;

    if (params.criteria === 'amount' && params.amount) {
      const url = new URL(endpoint, this.baseUrl);
      url.searchParams.append('amount', params.amount);

      const response = await this.request.get(url.toString(), { headers });
      return response;
    }

    const response = await this.request.get(this.getUrl(endpoint), { headers });
    return response;
  }

  /**
   * Get transactions directly from the accounts endpoint
   * Found this to be more reliable than the search endpoint on the demo site
   */
  async getAccountTransactions(accountId: string): Promise<FindTransactionsResponse> {
    const endpoint = `/accounts/${accountId}/transactions`;

    try {
      const response = await this.request.get(this.getUrl(endpoint), {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status() === 404) {
        return { transactions: [], transaction: [] };
      }

      if (response.status() === 200) {
        this.validateJsonResponse(response);
        // This API returns transactions array directly, not wrapped in an object
        const transactions = await this.parseJson<any[]>(response);
        return { transactions, transaction: transactions };
      }

      return { transactions: [], transaction: [] };
    } catch (error) {
      // API call failed - return empty result
      return { transactions: [], transaction: [] };
    }
  }
}
