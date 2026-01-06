/**
 * RBAC Middleware Utility
 * Defines permissions and roles for the Bluewud OTS ecosystem.
 */

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  WAREHOUSE: 'warehouse',
  SALES: 'sales',
  DEALER: 'dealer',
}

MANAGE_LOGISTICS: 'manage_logistics',
  VIEW_FINANCIALS: 'view_financials',
    MANAGE_WH_OPS: 'manage_wh_ops',
      SYSTEM_ADMIN: 'system_admin',
        PLACE_DEALER_ORDER: 'place_dealer_order',
          MANAGE_DEALERS: 'manage_dealers',
            MANAGE_USERS: 'manage_users',
              MANAGE_SETTINGS: 'manage_settings',
                MANAGE_CARRIERS: 'manage_carriers',
                  PROCESS_PAYMENTS: 'manage_payments',
                    PLACE_WHOLESALE_ORDER: 'place_wholesale_order',
                      VIEW_ALL_ORDERS: 'view_all_orders',
                        VIEW_OWN_ORDERS: 'view_own_orders',
                          PROCESS_QC: 'process_qc',
                            VIEW_ACTIVITY_LOG: 'view_activity_log',

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.MANAGE_LOGISTICS,
    PERMISSIONS.VIEW_FINANCIALS,
  ],
  [ROLES.OPERATOR]: [
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MANAGE_INVENTORY,
  ],
  [ROLES.WAREHOUSE]: [
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.MANAGE_WH_OPS,
    PERMISSIONS.MANAGE_ORDERS, // For picking/packing
  ],
  [ROLES.SALES]: [
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_ORDERS, // For lookup
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.DEALER]: [
    PERMISSIONS.PLACE_DEALER_ORDER,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
}

/**
 * Check if a user has a specific permission.
 * @param {Object} user - User object containing role
 * @param {string} permission - Permission key
 * @returns {boolean}
 */
export const can = (user, permission) => {
  if (!user || !user.role) return false
  const permissions = ROLE_PERMISSIONS[user.role] || []
  return permissions.includes(permission)
}

/**
 * Components wrapper for RBAC
 */
export const Guard = ({ user, permission, role, children, fallback = null }) => {
  const hasPermission = permission ? can(user, permission) : true
  const hasRole = role ? user?.role === role : true

  if (hasPermission && hasRole) {
    return children
  }
  return fallback
}

export default { can, ROLES, PERMISSIONS, Guard }
