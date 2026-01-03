// Rate Limit Service
// Prevents API abuse with token bucket algorithm,
// sliding window tracking, and configurable limits per endpoint.

const rateLimiters = new Map()

/**
 * Create or get rate limiter for an endpoint
 */
export const getRateLimiter = (endpoint, maxRequests = 100, windowMs = 60000) => {
  if (!rateLimiters.has(endpoint)) {
    rateLimiters.set(endpoint, {
      endpoint,
      maxRequests,
      windowMs,
      tokens: maxRequests,
      lastRefill: Date.now(),
      requests: [],
    })
  }
  return rateLimiters.get(endpoint)
}

/**
 * Check if request is allowed
 * @returns {Object} {allowed, remaining, resetTime, retryAfter}
 */
export const checkLimit = (endpoint, maxRequests = 100, windowMs = 60000) => {
  const limiter = getRateLimiter(endpoint, maxRequests, windowMs)
  const now = Date.now()

  // Remove old requests outside window
  limiter.requests = limiter.requests.filter((time) => now - time < windowMs)

  if (limiter.requests.length < maxRequests) {
    limiter.requests.push(now)
    return {
      allowed: true,
      remaining: maxRequests - limiter.requests.length,
      resetTime: Math.ceil((now + windowMs) / 1000),
      retryAfter: null,
    }
  }

  const oldestRequest = limiter.requests[0]
  const resetTime = oldestRequest + windowMs

  return {
    allowed: false,
    remaining: 0,
    resetTime: Math.ceil(resetTime / 1000),
    retryAfter: Math.ceil((resetTime - now) / 1000),
  }
}

/**
 * Middleware function for express/fastify
 */
export const rateLimitMiddleware = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const endpoint = `${req.method}:${req.path}`
    const limit = checkLimit(endpoint, maxRequests, windowMs)

    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': limit.remaining,
      'X-RateLimit-Reset': limit.resetTime,
    })

    if (!limit.allowed) {
      res.set('Retry-After', limit.retryAfter)
      return res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: limit.retryAfter,
      })
    }

    next()
  }
}

/**
 * Reset limiter for an endpoint
 */
export const resetLimiter = (endpoint) => {
  if (rateLimiters.has(endpoint)) {
    const limiter = rateLimiters.get(endpoint)
    limiter.requests = []
    return true
  }
  return false
}

/**
 * Get current status of all limiters
 */
export const getStatus = () => {
  const status = {}
  for (const [endpoint, limiter] of rateLimiters.entries()) {
    const now = Date.now()
    status[endpoint] = {
      requests: limiter.requests.filter((time) => now - time < limiter.windowMs).length,
      max: limiter.maxRequests,
      window: limiter.windowMs,
    }
  }
  return status
}

export default {
  getRateLimiter,
  checkLimit,
  rateLimitMiddleware,
  resetLimiter,
  getStatus,
}
