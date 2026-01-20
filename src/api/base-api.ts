/**
 * Base API Class
 *
 * Base class for API test classes
 * Provides common HTTP request functionality
 */

import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Base class for API interactions with consistent error handling
 */
export abstract class BaseApi {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.request = request;
    // Use configured API base URL for different environments
    this.baseUrl = baseUrl || 'https://parabank.parasoft.com/parabank/services/bank';
  }

  /**
   * Gets the full URL for an endpoint
   *
   * @param endpoint - API endpoint (relative to base URL)
   * @returns Full URL string
   */
  protected getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Makes a GET request
   *
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns API response
   */
  protected async get(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<APIResponse> {
    const url = this.getUrl(endpoint);
    return await this.request.get(url, { params });
  }

  /**
   * Makes a POST request
   *
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns API response
   */
  protected async post(endpoint: string, data?: unknown): Promise<APIResponse> {
    const url = this.getUrl(endpoint);
    return await this.request.post(url, { data });
  }

  /**
   * Validates response status
   *
   * @param response - API response
   * @param expectedStatus - Expected HTTP status code (default: 200)
   */
  protected validateStatus(response: APIResponse, expectedStatus: number = 200): void {
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, but got ${response.status()}`);
    }
  }

  /**
   * Parses JSON response
   *
   * @param response - API response
   * @returns Parsed JSON object
   */
  protected async parseJson<T = unknown>(response: APIResponse): Promise<T> {
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${text}`);
    }
  }

  /**
   * Validates JSON response
   *
   * @param response - API response
   */
  protected validateJsonResponse(response: APIResponse): void {
    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Expected JSON response, but got content-type: ${contentType}`);
    }
  }
}
