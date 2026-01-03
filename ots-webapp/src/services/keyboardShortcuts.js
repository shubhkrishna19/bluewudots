/**
 * Keyboard Shortcuts Service
 * Global keyboard bindings for power users with conflict resolution,
 * accessibility support, and customizable key combinations.
 */

const shortcuts = new Map();
let isEnabled = true;

export const DEFAULT_SHORTCUTS = {
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
 * @param {String} combo - Key combination (e.g., 'Ctrl+K')
 * @param {String|Function} action - Action name or callback function
 * @param {Object} options - { description, scope, enabled }
 */
export const registerShortcut = (combo, action, options = {}) => {
  const normalizedCombo = combo.replace(/\s/g, '');

  if (shortcuts.has(normalizedCombo)) {
    console.warn(`[Shortcuts] Overwriting existing shortcut: ${normalizedCombo}`);
  }

  const config = {
    action: typeof action === 'string' ? action : null,
    callback: typeof action === 'function' ? action : null,
    description: options.description || '',
    scope: options.scope || 'global',
    enabled: options.enabled !== false
  };

  shortcuts.set(normalizedCombo, config);
  return () => removeShortcut(normalizedCombo);
};

/**
 * Bind a shortcut to a callback function
 */
export const bindAction = (action, callback) => {
  let bound = false;
  for (const config of shortcuts.values()) {
    if (config.action === action) {
      config.callback = callback;
      bound = true;
    }
  }
  if (!bound) console.warn(`[Shortcuts] Action not found: ${action}`);
  return bound;
};

/**
 * Get all registered shortcuts
 */
export const getAllShortcuts = () => {
  return Array.from(shortcuts.entries()).map(([combo, config]) => ({
    combo,
    action: config.action,
    description: config.description,
    enabled: config.enabled
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
    return true;
  }
  return false;
};

/**
 * Cleanup
 */
export const cleanup = () => {
  document.removeEventListener('keydown', handleKeyDown);
  shortcuts.clear();
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

  const target = event.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    if (!['Escape'].includes(event.key)) return;
  }

  const combo = parseKeyCombo(event);
  const config = shortcuts.get(combo);

  if (config && config.enabled) {
    event.preventDefault();

    if (config.callback) {
      config.callback();
    } else if (config.action) {
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
