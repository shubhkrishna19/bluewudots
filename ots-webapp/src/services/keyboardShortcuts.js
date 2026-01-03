/**
 * Keyboard Shortcut Service - Global keyboard bindings for power users
 */

// Registered shortcuts
const shortcuts = new Map();

// Modifier key state
let modifiers = { ctrl: false, alt: false, shift: false, meta: false };

/**
 * Parse a shortcut string into components
 * @param {string} shortcut - e.g., "Ctrl+Shift+N"
 * @returns {object}
 */
const parseShortcut = (shortcut) => {
    const parts = shortcut.toLowerCase().split('+');
    return {
        ctrl: parts.includes('ctrl') || parts.includes('control'),
        alt: parts.includes('alt'),
        shift: parts.includes('shift'),
        meta: parts.includes('meta') || parts.includes('cmd'),
        key: parts.find(p => !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd'].includes(p))
    };
};

/**
 * Check if event matches a shortcut
 * @param {KeyboardEvent} event 
 * @param {object} shortcut 
 * @returns {boolean}
 */
const matchesShortcut = (event, shortcut) => {
    return (
        event.ctrlKey === shortcut.ctrl &&
        event.altKey === shortcut.alt &&
        event.shiftKey === shortcut.shift &&
        event.metaKey === shortcut.meta &&
        event.key.toLowerCase() === shortcut.key
    );
};

/**
 * Register a keyboard shortcut
 * @param {string} shortcut - e.g., "Ctrl+N"
 * @param {function} callback 
 * @param {object} options - { description, scope }
 */
export const registerShortcut = (shortcut, callback, options = {}) => {
    const id = shortcut.toLowerCase();

    // Conflict Resolution: Warn if shortcut already exists in same scope
    if (shortcuts.has(id) && shortcuts.get(id).scope === (options.scope || 'global')) {
        console.warn(`[Shortcuts] Conflict: ${shortcut} is already registered in ${options.scope || 'global'} scope. Overwriting.`);
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

    return () => unregisterShortcut(shortcut);
};

/**
 * Unregister a shortcut
 * @param {string} shortcut 
 */
export const unregisterShortcut = (shortcut) => {
    shortcuts.delete(shortcut.toLowerCase());
};

/**
 * Enable/disable a shortcut
 * @param {string} shortcut 
 * @param {boolean} enabled 
 */
export const setShortcutEnabled = (shortcut, enabled) => {
    const entry = shortcuts.get(shortcut.toLowerCase());
    if (entry) {
        entry.enabled = enabled;
    }
};

/**
 * Get all registered shortcuts
 * @returns {object[]}
 */
export const getShortcuts = () => {
    return Array.from(shortcuts.entries()).map(([id, data]) => ({
        id,
        shortcut: data.shortcut,
        description: data.description,
        scope: data.scope,
        enabled: data.enabled
    }));
};

/**
 * Handle keyboard event
 * @param {KeyboardEvent} event 
 */
const handleKeyDown = (event) => {
    // Don't trigger shortcuts if typing in an input
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Escape to blur
        if (event.key === 'Escape') {
            target.blur();
        }
        return;
    }

    for (const [id, data] of shortcuts) {
        if (data.enabled && matchesShortcut(event, data.parsed)) {
            event.preventDefault();
            event.stopPropagation();
            data.callback(event);
            return;
        }
    }
};

/**
 * Initialize the shortcut listener
 */
export const initShortcuts = () => {
    document.addEventListener('keydown', handleKeyDown);
};

/**
 * Clean up the shortcut listener
 */
export const destroyShortcuts = () => {
    document.removeEventListener('keydown', handleKeyDown);
    shortcuts.clear();
};

/**
 * Default shortcuts for the OTS app
 * @param {object} actions - { newOrder, search, bulk, export, ... }
 */
export const registerDefaultShortcuts = (actions) => {
    const defaults = [
        { shortcut: 'Ctrl+N', action: 'newOrder', description: 'Create new order' },
        { shortcut: 'Ctrl+F', action: 'search', description: 'Focus search' },
        { shortcut: 'Ctrl+B', action: 'bulk', description: 'Open bulk actions' },
        { shortcut: 'Ctrl+E', action: 'export', description: 'Export data' },
        { shortcut: 'Ctrl+/', action: 'help', description: 'Show shortcuts' },
        { shortcut: 'Alt+1', action: 'dashboard', description: 'Go to Dashboard' },
        { shortcut: 'Alt+2', action: 'orders', description: 'Go to Orders' },
        { shortcut: 'Alt+3', action: 'tracking', description: 'Go to Tracking' },
        { shortcut: 'Escape', action: 'closeModal', description: 'Close modal/panel' }
    ];

    defaults.forEach(({ shortcut, action, description }) => {
        if (actions[action]) {
            registerShortcut(shortcut, actions[action], { description });
        }
    });
};

/**
 * Format shortcut for display (Mac vs Windows)
 * @param {string} shortcut 
 * @returns {string}
 */
export const formatShortcut = (shortcut) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    return shortcut
        .replace(/Ctrl/gi, isMac ? '⌘' : 'Ctrl')
        .replace(/Alt/gi, isMac ? '⌥' : 'Alt')
        .replace(/Shift/gi, isMac ? '⇧' : 'Shift')
        .replace(/\+/g, isMac ? '' : '+');
};

export default {
    registerShortcut,
    unregisterShortcut,
    setShortcutEnabled,
    getShortcuts,
    initShortcuts,
    destroyShortcuts,
    registerDefaultShortcuts,
    formatShortcut
};
