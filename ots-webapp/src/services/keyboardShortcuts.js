/**
 * Keyboard Shortcuts Service
 * Global keyboard bindings for power users with conflict resolution,
 * command palette support, and accessibility features.
 */

const shortcuts = new Map();
const listeners = new Map();
let isEnabled = true;

const DEFAULT_SHORTCUTS = {
  'Ctrl+K': { action: 'commandPalette', description: 'Open command palette' },
  'Ctrl+/': { action: 'openSearch', description: 'Quick search orders' },
  'Ctrl+N': { action: 'newOrder', description: 'Create new order' },
  'Ctrl+Shift+L': { action: 'viewLogs', description: 'View activity logs' },
  'Ctrl+Shift+S': { action: 'syncData', description: 'Sync all data' },
  'Ctrl+Shift+D': { action: 'toggleDashboard', description: 'Toggle dashboard view' },
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
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleKeyDown);
  }
  console.log('[Shortcuts] Initialized');
};

export const initShortcuts = initializeShortcuts;

/**
 * Register a shortcut
 */
export const registerShortcut = (combo, action, options = {}) => {
  const normalizedCombo = normalizeKeyCombo(combo);
  shortcuts.set(normalizedCombo, {
    action,
    description: options.description || '',
    scope: options.scope || 'global',
    enabled: options.enabled !== false
  });
  return () => unregisterShortcut(combo);
};

export const unregisterShortcut = (combo) => {
  const normalizedCombo = normalizeKeyCombo(combo);
  return shortcuts.delete(normalizedCombo);
};

export const removeShortcut = unregisterShortcut;

/**
 * Listen for an action
 */
export const on = (action, handler) => {
  if (!listeners.has(action)) {
    listeners.set(action, new Set());
  }
  listeners.get(action).add(handler);
  return () => off(action, handler);
};

export const onShortcut = on;

export const off = (action, handler) => {
  if (listeners.has(action)) {
    listeners.get(action).delete(handler);
  }
};

/**
 * Bind a shortcut to a callback function (for named actions)
 */
export const bindAction = (action, callback) => {
  on(action, callback);
  return true;
};

export const registerDefaultShortcuts = (actionsMap) => {
  Object.entries(actionsMap).forEach(([actionName, callback]) => {
    bindAction(actionName, callback);
  });
};

/**
 * Normalize key combination string for consistent mapping
 */
function normalizeKeyCombo(combo) {
  return combo.toLowerCase()
    .replace(/cmd/g, 'ctrl')
    .replace(/meta/g, 'ctrl')
    .replace(/\s/g, '')
    .split('+')
    .sort()
    .join('+');
}

/**
 * Get shortcut combo from keyboard event
 */
function getComboFromEvent(event) {
  const parts = [];
  if (event.ctrlKey || event.metaKey) parts.push('ctrl');
  if (event.shiftKey) parts.push('shift');
  if (event.altKey) parts.push('alt');

  const key = event.key === ' ' ? 'space' : event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();

  if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
    parts.push(key);
  }

  return parts.sort().join('+');
}

function handleKeyDown(event) {
  if (!isEnabled) return;

  const target = event.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    if (event.key !== 'Escape') return;
  }

  const combo = getComboFromEvent(event);
  const config = shortcuts.get(combo);

  if (config && config.enabled) {
    event.preventDefault();

    const actionHandlers = listeners.get(config.action);
    if (actionHandlers) {
      actionHandlers.forEach(handler => handler(event));
    }

    // Dispatch global event
    document.dispatchEvent(new CustomEvent('shortcut', {
      detail: { action: config.action, combo }
    }));

    console.log(`[Shortcuts] Executed: ${combo} (${config.action})`);
  }
}

export const getAllShortcuts = () => {
  return Array.from(shortcuts.entries()).map(([combo, config]) => ({
    combo,
    action: config.action,
    description: config.description
  }));
};

export const getShortcutsVisible = getAllShortcuts;
export const getShortcuts = getAllShortcuts;

export const setEnabled = (enabled) => {
  isEnabled = enabled;
};

export const setShortcutsEnabled = setEnabled;
export const toggleShortcuts = (val = null) => {
  isEnabled = val !== null ? val : !isEnabled;
  return isEnabled;
};

export const formatShortcut = (combo) => {
  return combo
    .split('+')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' + ');
};

export const cleanup = () => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeyDown);
  }
  shortcuts.clear();
  listeners.clear();
};

export const destroyShortcuts = cleanup;

export default {
  initializeShortcuts,
  initShortcuts,
  registerShortcut,
  unregisterShortcut,
  removeShortcut,
  on,
  onShortcut,
  off,
  bindAction,
  registerDefaultShortcuts,
  getAllShortcuts,
  getShortcutsVisible,
  getShortcuts,
  setShortcutsEnabled,
  toggleShortcuts,
  formatShortcut,
  cleanup,
  destroyShortcuts,
  DEFAULT_SHORTCUTS
};
