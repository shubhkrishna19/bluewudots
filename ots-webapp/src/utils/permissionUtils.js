/**
 * Permission Utilities
 * Centralized mapping of permissions to roles and helper functions.
 */

export const PERMISSIONS = {
    VIEW_DASHBOARD: 'canViewDashboard',
    MANAGE_ORDERS: 'canManageOrders',
    MANAGE_INVENTORY: 'canManageInventory',
    MANAGE_USERS: 'canManageUsers',
    VIEW_REPORTS: 'canViewReports',
    MANAGE_SETTINGS: 'canManageSettings',
    MANAGE_CARRIERS: 'canManageCarriers',
    PROCESS_PAYMENTS: 'canProcessPayments',
    IS_DEALER: 'isDealer'
};

/**
 * Checks if a user object has a specific permission.
 * @param {Object} user - The user session object from AuthContext
 * @param {string} permission - The permission key from PERMISSIONS
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions[permission] === true;
};

/**
 * Helper to check if user is a dealer
 */
export const isDealer = (user) => {
    return hasPermission(user, PERMISSIONS.IS_DEALER);
};
