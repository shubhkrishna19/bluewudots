// Retry Service - Exponential Backoff & Circuit Breaker Pattern
// Provides resilient error handling for async operations

const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // ms
const DEFAULT_BACKOFF_MULTIPLIER = 2
const DEFAULT_TIMEOUT = 30000 // ms

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - Result of the function
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    initialDelay = DEFAULT_RETRY_DELAY,
    backoffMultiplier = DEFAULT_BACKOFF_MULTIPLIER,
    timeout = DEFAULT_TIMEOUT,
    onRetry = null,
    shouldRetry = (err) => true,
    name = 'Operation',
  } = options

  let lastError
  let delay = initialDelay

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      console.log(`[Retry] ${name} - Attempt ${attempt}/${maxRetries + 1}`)

      // Execute with timeout
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`${name} timeout after ${timeout}ms`)), timeout)
        ),
      ])

      console.log(`[Retry] ${name} - Success on attempt ${attempt}`)
      return result
    } catch (error) {
      lastError = error

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        console.error(`[Retry] ${name} - Non-retryable error:`, error.message)
        throw error
      }

      if (attempt <= maxRetries) {
        console.warn(
          `[Retry] ${name} - Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`
        )

        if (onRetry) {
          onRetry({ attempt, maxRetries, delay, error })
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= backoffMultiplier
      }
    }
  }

  console.error(`[Retry] ${name} - Failed after ${maxRetries + 1} attempts`, lastError)
  throw lastError
}

/**
 * Wrap a function to automatically retry on failure
 */
export const withRetry = (fn, options = {}) => {
  return (...args) => retryWithBackoff(() => fn(...args), options)
}

/**
 * Retry logic for API calls with smart error detection
 */
export const retryApiCall = async (apiCall, options = {}) => {
  const { maxRetries = 3, timeout = 30000, ...restOptions } = options

  return retryWithBackoff(apiCall, {
    maxRetries,
    timeout,
    shouldRetry: (err) => {
      if (err.code === 'ERR_NETWORK' || !err.response) return true
      if (err.response?.status >= 500) return true
      if (err.code === 'ECONNABORTED') return true
      return false
    },
    ...restOptions,
  })
}

/**
 * Circuit breaker pattern - prevent cascading failures
 */
export const circuitBreaker = (fn, options = {}) => {
  const { failureThreshold = 5, resetTimeout = 60000, timeout = 30000 } = options

  let state = 'CLOSED'
  let failureCount = 0
  let lastFailureTime = null

  return async (...args) => {
    if (state === 'OPEN') {
      if (Date.now() - lastFailureTime > resetTimeout) {
        console.log('[CircuitBreaker] Attempting to reset circuit')
        state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable')
      }
    }

    try {
      const result = await Promise.race([
        fn(...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Circuit breaker timeout')), timeout)
        ),
      ])

      if (state === 'HALF_OPEN') {
        state = 'CLOSED'
        failureCount = 0
        console.log('[CircuitBreaker] Circuit closed')
      }

      return result
    } catch (error) {
      failureCount++
      lastFailureTime = Date.now()

      if (failureCount >= failureThreshold) {
        state = 'OPEN'
        console.error(`[CircuitBreaker] Circuit opened after ${failureCount} failures`)
      }

      throw error
    }
  }
}

export default {
  retryWithBackoff,
  withRetry,
  retryApiCall,
  circuitBreaker,
}
