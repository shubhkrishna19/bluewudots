import { useState, useCallback, useEffect, useRef } from 'react'
import apiUtils from '../../src/utils/apiUtils'

/**
 * Custom hook for making API requests with loading and error states
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Object} - {data, loading, error, refetch}
 */
export const useAPI = (endpoint, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiUtils.get(endpoint, options)
      if (isMountedRef.current) {
        setData(response.data)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch')
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [endpoint, options])

  useEffect(() => {
    fetchData()
    return () => {
      isMountedRef.current = false
    }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Custom hook for POST/PUT/DELETE requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (POST, PUT, DELETE)
 * @returns {Object} - {execute, data, loading, error}
 */
export const useMutation = (endpoint, method = 'POST') => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  const execute = useCallback(
    async (body = null, options = {}) => {
      try {
        setLoading(true)
        setError(null)
        let response
        switch (method.toUpperCase()) {
          case 'POST':
            response = await apiUtils.post(endpoint, body, options)
            break
          case 'PUT':
            response = await apiUtils.put(endpoint, body, options)
            break
          case 'DELETE':
            response = await apiUtils.del(endpoint, options)
            break
          default:
            throw new Error(`Unsupported method: ${method}`)
        }
        if (isMountedRef.current) {
          setData(response.data)
        }
        return response
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'Mutation failed')
        }
        throw err
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    },
    [endpoint, method]
  )

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return { execute, data, loading, error }
}

/**
 * Custom hook for batch API requests
 * @param {Array} requests - Array of [endpoint, options] tuples
 * @returns {Object} - {data, loading, error}
 */
export const useBatchAPI = (requests) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true)
        setError(null)
        const results = await apiUtils.batch(requests)
        if (isMountedRef.current) {
          setData(results)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'Batch request failed')
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchBatch()
    return () => {
      isMountedRef.current = false
    }
  }, [requests])

  return { data, loading, error }
}

/**
 * Custom hook for paginated API requests
 * @param {string} endpoint - API endpoint
 * @param {number} pageSize - Items per page
 * @returns {Object} - {items, page, nextPage, prevPage, loading, error}
 */
export const usePaginatedAPI = (endpoint, pageSize = 20) => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        const response = await apiUtils.get(`${endpoint}?page=${page}&limit=${pageSize}`)
        if (isMountedRef.current) {
          setItems(response.data.items || [])
          setHasMore(response.data.hasMore !== false)
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'Failed to fetch page')
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchPage()
    return () => {
      isMountedRef.current = false
    }
  }, [endpoint, page, pageSize])

  const nextPage = useCallback(() => {
    if (hasMore) setPage((p) => p + 1)
  }, [hasMore])

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1))
  }, [])

  return { items, page, nextPage, prevPage, loading, error, hasMore }
}

export default {
  useAPI,
  useMutation,
  useBatchAPI,
  usePaginatedAPI,
}
