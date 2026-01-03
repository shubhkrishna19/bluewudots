/**
 * @deprecated This file is deprecated. Please use src/services/rbacMiddleware.js instead.
 *
 * Permission Utilities
 * Centralized mapping of permissions to roles and helper functions.
 */

import { can, ROLES, PERMISSIONS as RBAC_PERMISSIONS } from '../services/rbacMiddleware'

export const PERMISSIONS = RBAC_PERMISSIONS

/**
 * Checks if a user object has a specific permission.
 * @param {Object} user - The user session object from AuthContext
 * @param {string} permission - The permission key from PERMISSIONS
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  return can(user, permission)
}

/**
 * Helper to check if user is a dealer
 */
export const isDealer = (user) => {
  return user?.role === ROLES.DEALER
}

export default { hasPermission, isDealer, PERMISSIONS }
