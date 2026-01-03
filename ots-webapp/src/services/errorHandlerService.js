// Error Handler Service
// Unified error handling, logging, recovery strategies, and user notifications.

const ERROR_LOG_NS = 'errors';
const MAX_LOGS = 100;

const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

let errorLogs = [];

/**
 * Log an error
 */
export const logError = (error, context = {}) => {
  const errorRecord = {
    id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    message: error.message || String(error),
    type: error.type || ERROR_TYPES.UNKNOWN,
    severity: error.severity || ERROR_SEVERITY.MEDIUM,
    stack: error.stack,
    context,
    status: error.status || 500
  };

  errorLogs.unshift(errorRecord);
  if (errorLogs.length > MAX_LOGS) errorLogs.pop();

  console.error(`[${errorRecord.type}] ${errorRecord.message}`, context);
  return errorRecord.id;
};

/**
 * Get all error logs
 */
export const getErrorLogs = (limit = 50) => {
  return errorLogs.slice(0, limit);
};

/**
 * Clear error logs
 */
export const clearErrorLogs = () => {
  errorLogs = [];
};

/**
 * Handle and recover from common errors
 */
export const handleError = (error, recovery = {}) => {
  const errorId = logError(error);

  switch (error.type) {
    case ERROR_TYPES.NETWORK:
      console.warn('[Recovery] Attempting retry with backoff...');
      return { recovered: true, action: 'RETRY_WITH_BACKOFF', errorId };

    case ERROR_TYPES.AUTH:
      console.warn('[Recovery] Redirecting to login...');
      return { recovered: true, action: 'REDIRECT_TO_LOGIN', errorId };

    case ERROR_TYPES.VALIDATION:
      console.warn('[Recovery] Validation failed, showing errors to user...');
      return { recovered: true, action: 'SHOW_VALIDATION_ERRORS', errorId };

    case ERROR_TYPES.CONFLICT:
      console.warn('[Recovery] Conflict detected, refreshing data...');
      return { recovered: true, action: 'REFRESH_DATA', errorId };

    default:
      return { recovered: false, action: 'NO_RECOVERY', errorId };
  }
};

/**
 * Convert HTTP status to error type
 */
export const getErrorType = (status) => {
  if (status >= 500) return ERROR_TYPES.SERVER;
  if (status === 404) return ERROR_TYPES.NOT_FOUND;
  if (status === 409) return ERROR_TYPES.CONFLICT;
  if (status === 401 || status === 403) return ERROR_TYPES.AUTH;
  if (status >= 400) return ERROR_TYPES.VALIDATION;
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get recovery hints for an error
 */
export const getRecoveryHints = (errorId) => {
  const error = errorLogs.find(e => e.id === errorId);
  if (!error) return ['Try refreshing the page', 'Check your internet connection'];

  const hints = ['Try refreshing the page'];
  if (error.type === ERROR_TYPES.NETWORK) hints.push('Check your internet connection');
  if (error.type === ERROR_TYPES.AUTH) hints.push('Try logging out and back in');
  if (error.type === ERROR_TYPES.VALIDATION) hints.push('Check the form for errors');

  return hints;
};

export const createError = (message, type, severity = ERROR_SEVERITY.MEDIUM, status = 500) => {
  return {
    message,
    type: type || ERROR_TYPES.UNKNOWN,
    severity,
    status,
    timestamp: new Date().toISOString()
  };
};

export { ERROR_TYPES, ERROR_SEVERITY };

export default {
  logError,
  getErrorLogs,
  clearErrorLogs,
  handleError,
  getErrorType,
  getRecoveryHints,
  createError,
  ERROR_TYPES,
  ERROR_SEVERITY
};
