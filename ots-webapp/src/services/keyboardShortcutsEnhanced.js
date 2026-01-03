/**
 * KeyboardShortcutsEnhanced.js
 * Global keyboard shortcuts for Bluewud OTS application
 * Supports custom shortcuts, command palette, and global hotkeys
 */

class KeyboardShortcutsEnhanced {
  constructor() {
    this.shortcuts = new Map()
    this.customShortcuts = new Map()
    this.isEnabled = true
    this.commandPalette = []
    this.searchIndex = []
    this.listeners = []
    this.initDefaultShortcuts()
    this.initEventListener()
  }

  // Initialize default shortcuts
  initDefaultShortcuts() {
    // Navigation shortcuts
    this.registerShortcut('ctrl+d', 'toggleDashboard', 'Toggle Dashboard View')
    this.registerShortcut('ctrl+o', 'openOrders', 'Open Orders')
    this.registerShortcut('ctrl+l', 'openLogistics', 'Open Logistics')
    this.registerShortcut('ctrl+a', 'openAnalytics', 'Open Analytics')

    // Action shortcuts
    this.registerShortcut('ctrl+n', 'newOrder', 'Create New Order')
    this.registerShortcut('ctrl+e', 'editOrder', 'Edit Selected Order')
    this.registerShortcut('ctrl+shift+d', 'deleteOrder', 'Delete Selected Order')

    // Search & Filter
    this.registerShortcut('ctrl+f', 'searchOrders', 'Search Orders')
    this.registerShortcut('ctrl+shift+f', 'advancedFilter', 'Advanced Filter')
    this.registerShortcut('ctrl+g', 'findNext', 'Find Next')
    this.registerShortcut('ctrl+shift+g', 'findPrevious', 'Find Previous')

    // Sync & Cache
    this.registerShortcut('ctrl+shift+s', 'syncData', 'Sync All Data')
    this.registerShortcut('ctrl+shift+c', 'clearCache', 'Clear Cache')

    // Command Palette
    this.registerShortcut('ctrl+k', 'commandPalette', 'Open Command Palette')
    this.registerShortcut('ctrl+shift+?', 'showHelp', 'Show Keyboard Help')

    // Quick actions
    this.registerShortcut('ctrl+p', 'printOrder', 'Print Order')
    this.registerShortcut('ctrl+shift+l', 'createLabel', 'Create Shipping Label')
    this.registerShortcut('alt+↑', 'previousOrder', 'Previous Order')
    this.registerShortcut('alt+↓', 'nextOrder', 'Next Order')
  }

  // Register a keyboard shortcut
  registerShortcut(key, action, description = '') {
    const normalizedKey = this.normalizeKey(key)
    this.shortcuts.set(normalizedKey, { action, description })
    this.commandPalette.push({ key: normalizedKey, action, description })
    this.searchIndex.push(action.toLowerCase())
  }

  // Normalize key combination
  normalizeKey(key) {
    return key.toLowerCase().replace(/cmd/g, 'ctrl').replace(/\s+/g, '').replace(/\+/g, '-')
  }

  // Get shortcut by action name
  getShortcutByAction(action) {
    for (const [key, { action: shortcutAction }] of this.shortcuts) {
      if (shortcutAction === action) {
        return key
      }
    }
    return null
  }

  // Initialize global event listener
  initEventListener() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e))
  }

  // Handle keyboard input
  handleKeyDown(event) {
    if (!this.isEnabled) return

    // Skip if input field is focused
    if (this.isFocusedOnInput(event.target)) {
      if (!this.shouldAllowShortcutInInput(event)) return
    }

    const key = this.buildKeyString(event)
    const shortcut = this.shortcuts.get(key)

    if (shortcut) {
      event.preventDefault()
      this.executeAction(shortcut.action, event)
    }
  }

  // Build key string from keyboard event
  buildKeyString(event) {
    const parts = []
    if (event.ctrlKey) parts.push('ctrl')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')

    const key = this.getKeyName(event)
    parts.push(key)

    return parts.join('-')
  }

  // Get readable key name
  getKeyName(event) {
    const keyMap = {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Enter: 'enter',
      Escape: 'esc',
      Tab: 'tab',
      ' ': 'space',
    }
    return keyMap[event.key] || event.key.toLowerCase()
  }

  // Check if focused on input element
  isFocusedOnInput(target) {
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  }

  // Check if shortcut should work in input
  shouldAllowShortcutInInput(event) {
    return ['ctrl', 'alt'].some((mod) => {
      return mod === 'ctrl' || mod === 'alt'
    })
  }

  // Execute action callback
  executeAction(action, event) {
    const callbacks = this.listeners.filter((l) => l.action === action)
    callbacks.forEach((callback) => {
      try {
        callback.handler(event)
      } catch (error) {
        console.error(`Error executing action '${action}':`, error)
      }
    })
  }

  // Register action handler
  on(action, handler) {
    this.listeners.push({ action, handler })
  }

  // Unregister action handler
  off(action, handler) {
    this.listeners = this.listeners.filter((l) => !(l.action === action && l.handler === handler))
  }

  // Search command palette
  searchCommandPalette(query) {
    return this.commandPalette.filter(
      (cmd) =>
        cmd.action.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Add custom shortcut
  addCustomShortcut(key, action, handler) {
    const normalizedKey = this.normalizeKey(key)
    this.customShortcuts.set(normalizedKey, { action, handler })
    this.registerShortcut(key, action)
    this.on(action, handler)
  }

  // Remove custom shortcut
  removeCustomShortcut(key) {
    const normalizedKey = this.normalizeKey(key)
    this.customShortcuts.delete(normalizedKey)
  }

  // Get all shortcuts (for help display)
  getAllShortcuts() {
    return Array.from(this.commandPalette)
  }

  // Enable/disable shortcuts globally
  setEnabled(enabled) {
    this.isEnabled = enabled
  }

  // Export shortcuts as JSON for settings backup
  exportShortcuts() {
    return JSON.stringify(Array.from(this.customShortcuts.entries()), null, 2)
  }

  // Import shortcuts from JSON
  importShortcuts(json) {
    try {
      const imported = JSON.parse(json)
      imported.forEach(([key, { action, handler }]) => {
        this.addCustomShortcut(key, action, handler || (() => {}))
      })
    } catch (error) {
      console.error('Error importing shortcuts:', error)
    }
  }
}

// Export singleton instance
const keyboardShortcuts = new KeyboardShortcutsEnhanced()

// Compatibility layer for legacy API
export const initShortcuts = () => {
  console.log('[Shortcuts] Initialized (Enhanced)')
}
export const registerDefaultShortcuts = (actionsMap) => {
  Object.entries(actionsMap).forEach(([action, handler]) => {
    keyboardShortcuts.on(action, handler)
  })
}
export const destroyShortcuts = () => {
  console.log('[Shortcuts] Destroyed (Enhanced)')
}

export { keyboardShortcuts }
export default keyboardShortcuts
