/**
 * API Utilities
 * Provides API request handling with retry logic, offline support, and response normalization
 */

import { localStorageUtils } from './storageUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.bluewud.com';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const OFFLINE_CACHE_KEY = 'api_offline_cache';
const PENDING_REQUESTS_KEY = 'api_pending_requests';

/**
 * Create API error with standardized format
 */
class APIError extends Error {
  constructor(message, statusCode = null, details = {}) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Retry logic with exponential backoff
 */
const retryWithBackoff = async (
  fn,
  maxRetries = MAX_RETRIES,
  delayMs = RETRY_DELAY_MS
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Check if response is successful
 */
const isSuccessStatus = (status) => status >= 200 && status < 300;

/**
 * Normalize API response
 */
const normalizeResponse = (data) => {
  return {
    success: true,
    data: data || null,
    error: null,
    timestamp: Date.now(),
  };
};

/**
 * Core fetch function with error handling
 */
const fetchWithErrorHandling = async (
  endpoint,
  options = {}
) => {
  const { method = 'GET', body = null, headers = {}, timeout = 30000, ...rest } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...rest,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!isSuccessStatus(response.status)) {
      throw new APIError(
        data?.message || `HTTP ${response.status}`,
        response.status,
        { response: data }
      );
    }

    return normalizeResponse(data);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof APIError) throw error;
    throw new APIError(
      error.message || 'Network request failed',
      null,
      { originalError: error }
    );
  }
};

/**
 * Make API request with retry and offline support
 */
const request = async (
  endpoint,
  options = {}
) => {
  const { retries = MAX_RETRIES, cacheOffline = true, cacheDuration = 3600000, ...fetchOptions } = options;

  try {
    const response = await retryWithBackoff(
      () => fetchWithErrorHandling(endpoint, fetchOptions),
      retries
    );

    if (cacheOffline) {
      const cacheEntry = {
        data: response.data,
        timestamp: Date.now(),
        expiry: Date.now() + cacheDuration,
      };
      localStorageUtils.set(`${OFFLINE_CACHE_KEY}_${endpoint}`, cacheEntry);
    }

    return response;
  } catch (error) {
    if (cacheOffline && typeof navigator !== 'undefined' && !navigator.onLine) {
      const cached = localStorageUtils.get(`${OFFLINE_CACHE_KEY}_${endpoint}`);
      if (cached && cached.expiry > Date.now()) {
        return normalizeResponse(cached.data);
      }
    }
    throw error;
  }
};

/**
 * GET request
 */
const get = (endpoint, options = {}) =>
  request(endpoint, { ...options, method: 'GET' });

/**
 * POST request
 */
const post = (endpoint, body, options = {}) =>
  request(endpoint, { ...options, method: 'POST', body });

/**
 * PUT request
 */
const put = (endpoint, body, options = {}) =>
  request(endpoint, { ...options, method: 'PUT', body });

/**
 * PATCH request
 */
const patch = (endpoint, body, options = {}) =>
  request(endpoint, { ...options, method: 'PATCH', body });

/**
 * DELETE request
 */
const del = (endpoint, options = {}) =>
  request(endpoint, { ...options, method: 'DELETE' });

/**
 * Batch requests with Promise.all
 */
const batch = async (requests) => {
  const results = await Promise.allSettled(
    requests.map((req) => {
      const [endpoint, options] = Array.isArray(req) ? req : [req, {}];
      return request(endpoint, options);
    })
  );

  return results.map((result) =>
    result.status === 'fulfilled'
      ? result.value
      : { success: false, error: result.reason, data: null }
  );
};

/**
 * Queue request for retry when online
 */
const queueForRetry = (endpoint, options = {}) => {
  const queue = localStorageUtils.get(PENDING_REQUESTS_KEY, []);
  queue.push({
    id: `${endpoint}_${Date.now()}_${Math.random()}`,
    endpoint,
    options,
    timestamp: Date.now(),
  });
  localStorageUtils.set(PENDING_REQUESTS_KEY, queue);
};

/**
 * Process queued requests
 */
const processQueue = async () => {
  const queue = localStorageUtils.get(PENDING_REQUESTS_KEY, []);
  if (!queue.length) return { success: true, processed: 0 };

  const results = [];
  const failed = [];

  for (const item of queue) {
    try {
      const result = await request(item.endpoint, item.options);
      results.push({ id: item.id, result });
    } catch (error) {
      failed.push(item);
    }
  }

  localStorageUtils.set(PENDING_REQUESTS_KEY, failed);
  return { success: true, processed: results.length, pending: failed.length };
};

export default {
  request,
  get,
  post,
  put,
  patch,
  del,
  batch,
  queueForRetry,
  processQueue,
  APIError,
  retryWithBackoff,
};

export {
  request,
  get,
  post,
  put,
  patch,
  del,
  batch,
  queueForRetry,
  processQueue,
  APIError,
};
