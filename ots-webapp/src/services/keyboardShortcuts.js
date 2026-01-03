/**
 * Keyboard Shortcuts Service
 * Global keyboard bindings for power users with conflict resolution,
 * command palette support, and accessibility features.
 */

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.listeners = new Map();
    this.isEnabled = true;
    this.defaultShortcuts = {
      'Ctrl+K': { action: 'commandPalette', description: 'Open command palette' },
      'Ctrl+/': { action: 'openSearch', description: 'Quick search orders' },
      'Ctrl+N': { action: 'newOrder', description: 'Create new order' },
      'Ctrl+Shift+L': { action: 'viewLogs', description: 'View activity logs' },
      'Ctrl+Shift+S': { action: 'syncData', description: 'Sync all data' },
      'Ctrl+Shift+D': { action: 'toggleDashboard', description: 'Toggle dashboard view' },
      'Escape': { action: 'closeModal', description: 'Close modal/popup' },
      '?': { action: 'showHelp', description: 'Show keyboard shortcuts help' }
    };
    this.init();
  }

  init() {
    // Load defaults
    Object.entries(this.defaultShortcuts).forEach(([combo, config]) => {
      this.registerShortcut(combo, config.action, { description: config.description });
    });

    // Attach global listener
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
  }

  /**
   * Register a shortcut
   */
  registerShortcut(combo, action, options = {}) {
    const normalizedCombo = this.normalizeKeyCombo(combo);
    this.shortcuts.set(normalizedCombo, {
      action,
      description: options.description || '',
      scope: options.scope || 'global',
      enabled: options.enabled !== false
    });
  }

  /**
   * Listen for an action
   */
  on(action, handler) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set());
    }
    this.listeners.get(action).add(handler);
    return () => this.off(action, handler);
  }

  off(action, handler) {
    if (this.listeners.has(action)) {
      this.listeners.get(action).delete(handler);
    }
  }

  /**
   * Normalize key combination string for consistent mapping
   */
  normalizeKeyCombo(combo) {
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
  getComboFromEvent(event) {
    const parts = [];
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');

    const key = event.key === ' ' ? 'space' : event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();

    // Avoid duplicates if Ctrl/Shift etc are the keys themselves
    if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
      parts.push(key);
    }

    return parts.sort().join('+');
  }

  handleKeyDown(event) {
    if (!this.isEnabled) return;

    const target = event.target;
    // Don't trigger shortcuts in inputs unless it's Escape
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      if (event.key !== 'Escape') return;
    }

    const combo = this.getComboFromEvent(event);
    const config = this.shortcuts.get(combo);

    if (config && config.enabled) {
      event.preventDefault();

      const handlers = this.listeners.get(config.action);
      if (handlers) {
        handlers.forEach(handler => handler(event));
      }

      // Also dispatch global event
      document.dispatchEvent(new CustomEvent('shortcut', {
        detail: { action: config.action, combo }
      }));

      console.log(`[Shortcuts] Executed: ${combo} (${config.action})`);
    }
  }

  getAllShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([combo, config]) => ({
      combo,
      action: config.action,
      description: config.description
    }));
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  }
}

// Singleton Instance
const keyboardShortcuts = new KeyboardShortcuts();

// Named exports for compatibility
export const registerShortcut = (c, a, o) => keyboardShortcuts.registerShortcut(c, a, o);
export const onShortcut = (a, h) => keyboardShortcuts.on(a, h);
export const getShortcutsVisible = () => keyboardShortcuts.getAllShortcuts();
export const setShortcutsEnabled = (e) => keyboardShortcuts.setEnabled(e);

export default keyboardShortcuts;
