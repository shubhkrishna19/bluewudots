/**
 * Integration Helpers
 * Utilities for integrating the AI package with the main app
 */

/**
 * Initialize all services and modules
 */
export const initializeIntegration = async (config = {}) => {
  try {
    const {
      enablePWA = true,
      enableOffline = true,
      enableKeyboardShortcuts = true,
      enableActivityLogging = true,
      debugMode = false,
    } = config

    if (debugMode) {
      console.log('[Integration] Initializing with config:', config)
    }

    const results = {}

    if (enablePWA && 'serviceWorker' in navigator) {
      results.pwa = await registerServiceWorker()
    }

    if (enableOffline) {
      results.offline = initializeOfflineSupport()
    }

    if (enableKeyboardShortcuts) {
      results.keyboard = initializeKeyboardShortcuts()
    }

    if (enableActivityLogging) {
      results.logging = initializeActivityLogging()
    }

    return results
  } catch (error) {
    console.error('[Integration] Initialization failed:', error)
    throw error
  }
}

/**
 * Register service worker
 */
const registerServiceWorker = async () => {
  if (!window.location.protocol.startsWith('http')) return null
  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('[SW] Registered:', registration)
    return registration
  } catch (error) {
    console.error('[SW] Registration failed:', error)
    return null
  }
}

/**
 * Initialize offline support
 */
const initializeOfflineSupport = () => {
  const db = new Map()
  const queue = []

  window.addEventListener('online', () => {
    console.log('[Offline] Online detected - syncing...')
    syncOfflineQueue()
  })

  window.addEventListener('offline', () => {
    console.log('[Offline] Offline detected')
  })

  return { db, queue }
}

/**
 * Sync offline queue
 */
const syncOfflineQueue = async () => {
  console.log('[Offline] Syncing queue...')
  // Implementation depends on your backend
}

/**
 * Initialize keyboard shortcuts
 */
const initializeKeyboardShortcuts = () => {
  const shortcuts = new Map()

  const registerShortcut = (keys, handler, description) => {
    shortcuts.set(keys, { handler, description })
  }

  const handleKeydown = (e) => {
    const keyCombo = [
      e.ctrlKey ? 'ctrl' : '',
      e.shiftKey ? 'shift' : '',
      e.altKey ? 'alt' : '',
      e.key.toLowerCase(),
    ]
      .filter(Boolean)
      .join('+')

    const shortcut = shortcuts.get(keyCombo)
    if (shortcut) {
      e.preventDefault()
      shortcut.handler(e)
    }
  }

  document.addEventListener('keydown', handleKeydown)

  return { registerShortcut, shortcuts }
}

/**
 * Initialize activity logging
 */
const initializeActivityLogging = () => {
  const logs = []

  const logActivity = (action, details) => {
    const entry = {
      timestamp: new Date(),
      action,
      details,
      userId: getUserId(),
    }
    logs.push(entry)
    console.log('[Activity]', entry)
  }

  return { logActivity, logs }
}

/**
 * Get user ID from session/localStorage
 */
const getUserId = () => {
  return sessionStorage.getItem('userId') || localStorage.getItem('userId') || 'anonymous'
}

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  const flags = window.__FF__ || {} // Feature flags
  return flags[featureName] ?? true // Default to enabled
}

/**
 * Get integration status
 */
export const getIntegrationStatus = () => {
  return {
    pwa: {
      supported: 'serviceWorker' in navigator,
      registered: navigator.serviceWorker?.controller ? true : false,
    },
    offline: navigator.onLine,
    storage: {
      localStorage: typeof localStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
    },
  }
}

/**
 * Migrate data from old format to new
 */
export const migrateData = (oldData, schema) => {
  const migrated = {}

  Object.keys(schema).forEach((key) => {
    const oldKey = schema[key].oldKey || key
    const transformer = schema[key].transform || ((v) => v)

    if (oldKey in oldData) {
      migrated[key] = transformer(oldData[oldKey])
    }
  })

  return migrated
}

/**
 * Validate integration compatibility
 */
export const validateCompatibility = () => {
  const issues = []

  // Check JavaScript support
  if (!window.Promise) issues.push('Promise support required')
  if (!window.fetch) issues.push('Fetch API required')
  if (typeof localStorage === 'undefined') issues.push('localStorage required')

  // Check module support
  if (!('import' in window)) issues.push('ES modules required')

  return {
    compatible: issues.length === 0,
    issues,
  }
}

export default {
  initializeIntegration,
  isFeatureEnabled,
  getIntegrationStatus,
  migrateData,
  validateCompatibility,
}
