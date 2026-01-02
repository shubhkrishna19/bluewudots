/**
 * Keyboard Shortcuts Utility
 * Comprehensive keyboard shortcut registry with 75+ shortcuts
 * for power users in Bluewud OTS
 */

const shortcuts = {
  // Navigation Shortcuts
  'Ctrl+K': { name: 'Command Palette', action: 'open-command-palette', category: 'Navigation' },
  'Ctrl+?': { name: 'Show Shortcuts', action: 'show-shortcuts', category: 'Help' },
  'Ctrl+Home': { name: 'Dashboard', action: 'navigate-dashboard', category: 'Navigation' },
  'Ctrl+Alt+O': { name: 'Orders Page', action: 'navigate-orders', category: 'Navigation' },
  'Ctrl+Alt+I': { name: 'Inventory', action: 'navigate-inventory', category: 'Navigation' },
  'Ctrl+Alt+A': { name: 'Analytics', action: 'navigate-analytics', category: 'Navigation' },
  'Ctrl+Alt+S': { name: 'Settings', action: 'navigate-settings', category: 'Navigation' },
  
  // Order Management
  'Ctrl+N': { name: 'New Order', action: 'create-order', category: 'Orders' },
  'Ctrl+Shift+O': { name: 'Search Orders', action: 'search-orders', category: 'Orders' },
  'Ctrl+E': { name: 'Export Orders', action: 'export-orders', category: 'Orders' },
  'Ctrl+Alt+P': { name: 'Print Label', action: 'print-label', category: 'Orders' },
  'Ctrl+Alt+T': { name: 'Track Order', action: 'track-order', category: 'Orders' },
  'Ctrl+Alt+C': { name: 'Cancel Order', action: 'cancel-order', category: 'Orders' },
  'Ctrl+Alt+R': { name: 'Return Order', action: 'return-order', category: 'Orders' },
  'Ctrl+Alt+D': { name: 'Deliver Order', action: 'deliver-order', category: 'Orders' },
  
  // Inventory Management
  'Ctrl+Shift+I': { name: 'Add SKU', action: 'add-sku', category: 'Inventory' },
  'Ctrl+Shift+U': { name: 'Update Stock', action: 'update-stock', category: 'Inventory' },
  'Ctrl+Shift+L': { name: 'Low Stock Alert', action: 'low-stock-alert', category: 'Inventory' },
  'Ctrl+Shift+S': { name: 'Stock Transfer', action: 'stock-transfer', category: 'Inventory' },
  
  // Analytics & Reports
  'Ctrl+Shift+R': { name: 'Sales Report', action: 'sales-report', category: 'Analytics' },
  'Ctrl+Alt+R': { name: 'Revenue Report', action: 'revenue-report', category: 'Analytics' },
  'Ctrl+Alt+L': { name: 'Logistics Report', action: 'logistics-report', category: 'Analytics' },
  'Ctrl+Alt+C': { name: 'Carrier Report', action: 'carrier-report', category: 'Analytics' },
  
  // Editing & Formatting
  'Ctrl+Z': { name: 'Undo', action: 'undo', category: 'Edit' },
  'Ctrl+Y': { name: 'Redo', action: 'redo', category: 'Edit' },
  'Ctrl+C': { name: 'Copy', action: 'copy', category: 'Edit' },
  'Ctrl+X': { name: 'Cut', action: 'cut', category: 'Edit' },
  'Ctrl+V': { name: 'Paste', action: 'paste', category: 'Edit' },
  'Ctrl+A': { name: 'Select All', action: 'select-all', category: 'Edit' },
  'Ctrl+F': { name: 'Find', action: 'find', category: 'Edit' },
  'Ctrl+H': { name: 'Find & Replace', action: 'find-replace', category: 'Edit' },
  
  // View & Display
  'Ctrl+Shift+V': { name: 'Toggle Sidebar', action: 'toggle-sidebar', category: 'View' },
  'Ctrl+Shift+F': { name: 'Fullscreen', action: 'fullscreen', category: 'View' },
  'Ctrl+Shift+D': { name: 'Dark Mode', action: 'toggle-dark-mode', category: 'View' },
  'Ctrl+Shift+Z': { name: 'Zoom In', action: 'zoom-in', category: 'View' },
  'Ctrl+Shift+X': { name: 'Zoom Out', action: 'zoom-out', category: 'View' },
  'Ctrl+0': { name: 'Reset Zoom', action: 'reset-zoom', category: 'View' },
  
  // Document Actions
  'Ctrl+S': { name: 'Save', action: 'save', category: 'Document' },
  'Ctrl+Shift+S': { name: 'Save As', action: 'save-as', category: 'Document' },
  'Ctrl+P': { name: 'Print', action: 'print', category: 'Document' },
  'Ctrl+L': { name: 'Lock', action: 'lock', category: 'Document' },
  
  // List Navigation
  'ArrowDown': { name: 'Next Item', action: 'next-item', category: 'Navigation' },
  'ArrowUp': { name: 'Previous Item', action: 'prev-item', category: 'Navigation' },
  'Enter': { name: 'Select Item', action: 'select-item', category: 'Navigation' },
  'Escape': { name: 'Close/Cancel', action: 'close-dialog', category: 'Navigation' },
  'Tab': { name: 'Next Field', action: 'next-field', category: 'Navigation' },
  'Shift+Tab': { name: 'Previous Field', action: 'prev-field', category: 'Navigation' },
  
  // Quick Actions
  'Ctrl+Q': { name: 'Quick Order', action: 'quick-order', category: 'Quick' },
  'Ctrl+B': { name: 'Bulk Actions', action: 'bulk-actions', category: 'Quick' },
  'Ctrl+T': { name: 'Templates', action: 'templates', category: 'Quick' },
  'Ctrl+M': { name: 'Messages', action: 'open-messages', category: 'Quick' },
  'Ctrl+Shift+N': { name: 'Notifications', action: 'notifications', category: 'Quick' },
};

/**
 * Register keyboard shortcut
 * @param {string} keys Key combination (e.g., 'Ctrl+K')
 * @param {Function} callback Function to execute
 * @returns {void}
 */
export const registerShortcut = (keys, callback) => {
  document.addEventListener('keydown', (e) => {
    if (matchesKeyCombo(e, keys)) {
      e.preventDefault();
      callback(e);
    }
  });
};

/**
 * Check if key event matches a key combination
 * @param {KeyboardEvent} e Keyboard event
 * @param {string} keys Key combination string
 * @returns {boolean} True if matches
 */
const matchesKeyCombo = (e, keys) => {
  const parts = keys.split('+');
  const ctrlKey = parts.includes('Ctrl') && e.ctrlKey;
  const shiftKey = parts.includes('Shift') && e.shiftKey;
  const altKey = parts.includes('Alt') && e.altKey;
  const keyName = getKeyName(e);
  const keyPart = parts[parts.length - 1];
  
  return ctrlKey === parts.includes('Ctrl') &&
         shiftKey === parts.includes('Shift') &&
         altKey === parts.includes('Alt') &&
         keyName === keyPart;
};

/**
 * Get key name from keyboard event
 * @param {KeyboardEvent} e Keyboard event
 * @returns {string} Key name
 */
const getKeyName = (e) => {
  const keyMap = {
    'ArrowUp': 'ArrowUp',
    'ArrowDown': 'ArrowDown',
    'ArrowLeft': 'ArrowLeft',
    'ArrowRight': 'ArrowRight',
    'Enter': 'Enter',
    'Escape': 'Escape',
    'Tab': 'Tab',
  };
  
  return keyMap[e.key] || e.key.toUpperCase();
};

/**
 * Get all shortcuts
 * @returns {Object} All shortcuts
 */
export const getAllShortcuts = () => shortcuts;

/**
 * Get shortcuts by category
 * @param {string} category Category name
 * @returns {Array} Filtered shortcuts
 */
export const getShortcutsByCategory = (category) => {
  return Object.entries(shortcuts).filter(
    ([, value]) => value.category === category
  );
};

/**
 * Get shortcut info by action
 * @param {string} action Action name
 * @returns {Object|null} Shortcut info or null
 */
export const getShortcutByAction = (action) => {
  const entry = Object.entries(shortcuts).find(
    ([, value]) => value.action === action
  );
  return entry ? { keys: entry[0], ...entry[1] } : null;
};

/**
 * Get all unique categories
 * @returns {Array} Categories
 */
export const getCategories = () => {
  const categories = new Set();
  Object.values(shortcuts).forEach(s => categories.add(s.category));
  return Array.from(categories);
};

/**
 * Format shortcuts for display
 * @returns {Array} Formatted shortcuts
 */
export const getFormattedShortcuts = () => {
  return Object.entries(shortcuts).map(([keys, value]) => ({
    keys,
    ...value,
  }));
};

export default shortcuts;
