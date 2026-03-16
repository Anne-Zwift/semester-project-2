import { BASE_URL } from '../utils/constants';
import type { ApiResponse } from '../types/Api';
import { store } from '../utils/store';

/**
 * The generic API Client function that handles the core logic of making an API call.
 * @template T The expected type of response data (e.g, Listings[]).
 * @param {string} endpoint - The API endpoint path (e.g, 'profile/details').
 * @param {ApiOptions} [options= {}] - Custom fetch options (method, body, custom headers).
 * @returns {Promise<ApiResponse<T> | null>} A promise that resolves with the wrapped API response data, or null for 204 No content   response.
 * @throws {Error} If the HTTP response status is outside the 200-299 range (e.g, 401, 500). *
 */

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<ApiResponse<T> | null> {
  const url = `${BASE_URL}/${endpoint.replace(/^\//, '')}`;

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  const apiKey = store.getApiKey();
  if (apiKey) {
    headers.set('X-Noroff-API-Key', apiKey);
  }

  const accessToken = store.getToken();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    const message = result.errors?.[0]?.message || 'An API error occurred';
    throw new Error(message);
  }

  return result;
}

/** Helper methods */
export const get = <T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { signal });
export const del = <T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<ApiResponse<T> | null> =>
  apiClient<T>(endpoint, { method: 'DELETE', signal });
export const post = <T, D = unknown>(
  endpoint: string,
  body?: D,
  signal?: AbortSignal,
): Promise<ApiResponse<T> | null> =>
  apiClient<T>(endpoint, { method: 'POST', body, signal });
export const put = <T, D = unknown>(
  endpoint: string,
  body?: D,
  signal?: AbortSignal,
): Promise<ApiResponse<T> | null> =>
  apiClient<T>(endpoint, { method: 'PUT', body, signal });
