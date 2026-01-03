import { useState, useCallback, useEffect } from 'react'
import { localStorageUtils, sessionStorageUtils } from '../../src/utils/storageUtils'

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if not in storage
 * @param {number} expiryMs - Optional expiry time in milliseconds
 * @returns {[*, function]} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue, expiryMs = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return localStorageUtils.get(key, initialValue)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        localStorageUtils.set(key, valueToStore, expiryMs)
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, expiryMs]
  )

  return [storedValue, setValue]
}

/**
 * Custom hook for managing sessionStorage with React state
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if not in storage
 * @returns {[*, function]} - [value, setValue]
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return sessionStorageUtils.get(key, initialValue)
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        sessionStorageUtils.set(key, valueToStore)
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

/**
 * Custom hook for managing multiple localStorage values
 * @param {string} namespace - Namespace for grouped keys
 * @param {Object} initialState - Initial state object
 * @returns {[Object, function]} - [state, setState]
 */
export const useLocalStorageState = (namespace, initialState) => {
  const [state, setState] = useState(() => {
    const stored = localStorageUtils.get(namespace, null)
    return stored || initialState
  })

  const updateState = useCallback(
    (updates) => {
      setState((prevState) => {
        const newState = { ...prevState, ...updates }
        localStorageUtils.set(namespace, newState)
        return newState
      })
    },
    [namespace]
  )

  return [state, updateState]
}

/**
 * Custom hook for managing preferences with localStorage
 * @param {string} key - Preference key
 * @param {*} defaultValue - Default preference value
 * @returns {[*, function]} - [preference, setPreference]
 */
export const usePreference = (key, defaultValue) => {
  return useLocalStorage(`pref_${key}`, defaultValue, 30 * 24 * 60 * 60 * 1000) // 30 days
}

/**
 * Custom hook for managing user settings with localStorage
 * @param {Object} initialSettings - Initial settings object
 * @returns {[Object, function, function]} - [settings, updateSetting, reset]
 */
export const useUserSettings = (initialSettings) => {
  const [settings, setSettings] = useLocalStorageState('user_settings', initialSettings)

  const updateSetting = useCallback(
    (key, value) => {
      setSettings({ [key]: value })
    },
    [setSettings]
  )

  const resetSettings = useCallback(() => {
    setSettings(initialSettings)
  }, [initialSettings, setSettings])

  return [settings, updateSetting, resetSettings]
}

/**
 * Custom hook for managing temporary session data
 * @param {string} key - Session key
 * @param {*} initialValue - Initial value
 * @returns {[*, function]} - [value, setValue]
 */
export const useSessionValue = (key, initialValue) => {
  return useSessionStorage(key, initialValue)
}

export default {
  useLocalStorage,
  useSessionStorage,
  useLocalStorageState,
  usePreference,
  useUserSettings,
  useSessionValue,
}
