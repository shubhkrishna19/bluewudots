/**
 * RBAC Middleware Utility
 * Defines permissions and roles for the Bluewud OTS ecosystem.
 */

export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    OPERATOR: 'operator',
    VIEWER: 'viewer',
    DEALER: 'dealer',
    GUEST: 'guest'
};

export const PERMISSIONS = {
    VIEW_ANALYTICS: 'view_analytics',
    VIEW_REPORTS: 'view_reports',
    MANAGE_ORDERS: 'manage_orders',
    MANAGE_INVENTORY: 'manage_inventory',
    MANAGE_DEALERS: 'manage_dealers',
    MANAGE_USERS: 'manage_users',
    MANAGE_SETTINGS: 'manage_settings',
    MANAGE_CARRIERS: 'manage_carriers',
    PROCESS_PAYMENTS: 'process_payments',
    PLACE_WHOLESALE_ORDER: 'place_wholesale_order',
    VIEW_ALL_ORDERS: 'view_all_orders',
    VIEW_OWN_ORDERS: 'view_own_orders',
    PROCESS_QC: 'process_qc'
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS),
    [ROLES.MANAGER]: [
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.MANAGE_ORDERS,
        PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.MANAGE_CARRIERS,
        PERMISSIONS.PROCESS_PAYMENTS,
        PERMISSIONS.PLACE_WHOLESALE_ORDER,
        PERMISSIONS.VIEW_ALL_ORDERS,
        PERMISSIONS.PROCESS_QC
    ],
    [ROLES.OPERATOR]: [
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_ORDERS,
        PERMISSIONS.VIEW_ALL_ORDERS
    ],
    [ROLES.VIEWER]: [
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.VIEW_ALL_ORDERS
    ],
    [ROLES.DEALER]: [
        PERMISSIONS.PLACE_WHOLESALE_ORDER,
        PERMISSIONS.VIEW_OWN_ORDERS,
        PERMISSIONS.VIEW_ANALYTICS
    ],
    [ROLES.GUEST]: []
};

/**
 * Check if a user has a specific permission.
 * @param {Object} user - User object containing role
 * @param {string} permission - Permission key
 * @returns {boolean}
 */
export const can = (user, permission) => {
    if (!user || !user.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
};

/**
 * Components wrapper for RBAC
 */
export const Guard = ({ user, permission, children, fallback = null }) => {
    if (can(user, permission)) {
        return children;
    }
    return fallback;
};

export default { can, ROLES, PERMISSIONS, Guard };
