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
    registerShortcut(combo, config.action, { description: config.description });
  });

  // Load custom shortcuts
  Object.entries(customShortcuts).forEach(([combo, config]) => {
    registerShortcut(combo, config.action, { description: config.description });
  });

  // Attach global listener
  document.addEventListener('keydown', handleKeyDown);
  console.log('[Shortcuts] Initialized with', shortcuts.size, 'shortcuts');
};

/**
 * Register a keyboard shortcut
 * @param {String} shortcut - Key combination (e.g., 'Ctrl+K', 'Shift+Alt+S')
 * @param {String|Function} callback - Action name or callback function
 * @param {Object} options - Options { description, scope }
 */
export const registerShortcut = (shortcut, callback, options = {}) => {
  const id = shortcut.toLowerCase();

  // Conflict Resolution: Warn if shortcut already exists in same scope
  if (shortcuts.has(id)) {
    const existing = shortcuts.get(id);
    if (existing.scope === (options.scope || 'global')) {
      console.warn(`[Shortcuts] Conflict: ${shortcut} is already registered in ${options.scope || 'global'} scope. Overwriting.`);
    }
  }

  const parsed = parseShortcut(shortcut);

  shortcuts.set(id, {
    shortcut,
    parsed,
    callback,
    description: options.description || '',
    scope: options.scope || 'global',
    enabled: true
  });

  // Support simpler signature usage from other parts of app if they pass (combo, action, description)
  // but here we standard on (shortcut, callback, options)

  return () => unregisterShortcut(shortcut);
};

export const unregisterShortcut = (shortcut) => {
  const id = shortcut.toLowerCase();
  if (shortcuts.has(id)) {
    shortcuts.delete(id);
    return true;
  }
  return false;
};

/**
 * Bind a shortcut to a callback function (for named actions)
 * @param {String} action - Action name
 * @param {Function} callback - Function to execute
 */
export const bindAction = (action, callback) => {
  for (const [combo, config] of shortcuts.entries()) {
    if (config.callback === action || (typeof config.callback === 'string' && config.callback === action)) {
      config.callback = callback; // Rebind string action to function
      return true;
    }
  }
  // Also check if action matches config.action (legacy structure)
  for (const [combo, config] of shortcuts.entries()) {
    if (config.action === action) {
      config.callback = callback;
      return true;
    }
  }
  return false;
};

/**
 * Get all registered shortcuts
 * @returns {Array} - Array of {combo, action, description}
 */
export const getAllShortcuts = () => {
  return Array.from(shortcuts.entries()).map(([combo, config]) => ({
    shortcut: config.shortcut,
    combo, // normalized combo
    action: typeof config.callback === 'string' ? config.callback : (config.action || 'Custom Action'),
    description: config.description
  }));
};

export const getShortcuts = getAllShortcuts;

/**
 * Format shortcut for display (e.g. 'ctrl+k' -> 'Ctrl + K')
 */
export const formatShortcut = (combo) => {
  return combo
    .split('+')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' + ');
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
  return unregisterShortcut(combo);
};

/**
 * Cleanup and remove all listeners
 */
export const cleanup = () => {
  document.removeEventListener('keydown', handleKeyDown);
  shortcuts.clear();
  console.log('[Shortcuts] Cleaned up');
};

/**
 * Destroy shortcuts (Alias for cleanup)
 */
export const destroyShortcuts = cleanup;

/**
 * Register default shortcuts (Helper)
 */
export const registerDefaultShortcuts = (actionsMap) => {
  Object.entries(actionsMap).forEach(([actionName, callback]) => {
    // Find shortcuts mapped to this action name and bind them
    bindAction(actionName, callback);
  });
};

// ===== Private Helpers =====

function parseShortcut(shortcut) {
  // Simple parser for checking (Not fully used in this simplified logic but good to have)
  return shortcut.split('+');
}

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
  const config = shortcuts.get(combo.toLowerCase());

  if (config && config.enabled) {
    event.preventDefault();

    if (typeof config.callback === 'function') {
      try {
        config.callback();
      } catch (err) {
        console.error(`[Shortcuts] Error executing ${combo}:`, err);
      }
    } else if (typeof config.action === 'function') {
      // Legacy support
      config.action();
    } else {
      // Dispatch custom event for action
      document.dispatchEvent(new CustomEvent('shortcut', {
        detail: { action: config.callback || config.action, combo }
      }));
    }

    console.log(`[Shortcuts] Executed: ${combo}`);
  }
}

export const initShortcuts = initializeShortcuts; // Alias

export default {
  initializeShortcuts,
  registerShortcut,
  bindAction,
  getAllShortcuts,
  toggleShortcuts,
  removeShortcut,
  cleanup,
  destroyShortcuts,
  registerDefaultShortcuts,
  DEFAULT_SHORTCUTS,
  getShortcuts,
  formatShortcut
};
