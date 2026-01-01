// Keyboard Shortcuts Service
// Global keyboard bindings for power users with conflict resolution,
// accessibility support, and customizable key combinations.

const shortcuts = new Map();
let isEnabled = true;

const DEFAULT_SHORTCUTS = {
  'Ctrl+K': { action: 'openCommandPalette', description: 'Open command palette' },
  'Ctrl+/': { action: 'openSearch', description: 'Quick search orders' },
  'Ctrl+N': { action: 'newOrder', description: 'Create new order' },
  'Ctrl+Shift+L': { action: 'viewLogs', description: 'View activity logs' },
  'Ctrl+Shift+S': { action: 'saveChanges', description: 'Save all changes' },
  'Ctrl+Shift+D': { action: 'toggleDarkMode', description: 'Toggle dark mode' },
  'Escape': { action: 'closeModal', description: 'Close modal/popup' },
  '?': { action: 'showHelp', description: 'Show keyboard shortcuts help' }
};

/**
 * Initialize keyboard shortcuts system
 * @param {Object} customShortcuts - Optional custom shortcuts to add
 */
export const initializeShortcuts = (customShortcuts = {}) => {
  // Load defaults
  Object.entries(DEFAULT_SHORTCUTS).forEach(([combo, config]) => {
    registerShortcut(combo, config.action, config.description);
  });

  // Load custom shortcuts
  Object.entries(customShortcuts).forEach(([combo, config]) => {
    registerShortcut(combo, config.action, config.description);
  });

  // Attach global listener
  document.addEventListener('keydown', handleKeyDown);
  console.log('[Shortcuts] Initialized with', shortcuts.size, 'shortcuts');
};

/**
 * Register a keyboard shortcut
 * @param {String} combo - Key combination (e.g., 'Ctrl+K', 'Shift+Alt+S')
 * @param {String|Function} action - Action name or callback function
 * @param {String} description - Human-readable description
 */
export const registerShortcut = (combo, action, description = '') => {
  if (shortcuts.has(combo)) {
    console.warn(`[Shortcuts] Overwriting existing shortcut: ${combo}`);
  }

  shortcuts.set(combo, { action, description, callback: null });
  console.log(`[Shortcuts] Registered: ${combo} -> ${action}`);
};

/**
 * Bind a shortcut to a callback function
 * @param {String} action - Action name
 * @param {Function} callback - Function to execute
 */
export const bindAction = (action, callback) => {
  for (const [combo, config] of shortcuts.entries()) {
    if (config.action === action) {
      config.callback = callback;
      return true;
    }
  }
  console.warn(`[Shortcuts] Action not found: ${action}`);
  return false;
};

/**
 * Get all registered shortcuts
 * @returns {Array} - Array of {combo, action, description}
 */
export const getAllShortcuts = () => {
  return Array.from(shortcuts.entries()).map(([combo, config]) => ({
    combo,
    action: config.action,
    description: config.description
  }));
};

/**
 * Toggle shortcuts on/off
 */
export const toggleShortcuts = (enable = null) => {
  isEnabled = enable !== null ? enable : !isEnabled;
  console.log(`[Shortcuts] ${isEnabled ? 'Enabled' : 'Disabled'}`);
  return isEnabled;
};

/**
 * Remove a shortcut
 */
export const removeShortcut = (combo) => {
  if (shortcuts.has(combo)) {
    shortcuts.delete(combo);
    console.log(`[Shortcuts] Removed: ${combo}`);
    return true;
  }
  return false;
};

/**
 * Cleanup and remove all listeners
 */
export const cleanup = () => {
  document.removeEventListener('keydown', handleKeyDown);
  shortcuts.clear();
  console.log('[Shortcuts] Cleaned up');
};

// ===== Private Helpers =====

function parseKeyCombo(event) {
  const parts = [];
  if (event.ctrlKey || event.metaKey) parts.push('Ctrl');
  if (event.shiftKey) parts.push('Shift');
  if (event.altKey) parts.push('Alt');

  const key = event.key === ' ' ? 'Space' : event.key.length === 1 ? event.key.toUpperCase() : event.key;
  parts.push(key);

  return parts.join('+');
}

function handleKeyDown(event) {
  if (!isEnabled) return;

  // Skip if focused on input/textarea
  const target = event.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    // Allow some shortcuts even in inputs
    if (!['Escape'].includes(event.key)) return;
  }

  const combo = parseKeyCombo(event);
  const config = shortcuts.get(combo);

  if (config) {
    event.preventDefault();
    
    if (config.callback) {
      try {
        config.callback();
      } catch (err) {
        console.error(`[Shortcuts] Error executing ${combo}:`, err);
      }
    } else if (typeof config.action === 'function') {
      try {
        config.action();
      } catch (err) {
        console.error(`[Shortcuts] Error executing ${combo}:`, err);
      }
    } else {
      // Dispatch custom event for action
      document.dispatchEvent(new CustomEvent('shortcut', {
        detail: { action: config.action, combo }
      }));
    }

    console.log(`[Shortcuts] Executed: ${combo}`);
  }
}

export default {
  initializeShortcuts,
  registerShortcut,
  bindAction,
  getAllShortcuts,
  toggleShortcuts,
  removeShortcut,
  cleanup,
  DEFAULT_SHORTCUTS
};
