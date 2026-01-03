import { useState, useCallback } from 'react';
import { errorHandlerService } from '../../src/services/errorHandlerService';

/**
 * useErrorHandler Hook
 * Provides error state management and recovery handling
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleError = useCallback((err, context = {}) => {
    try {
      const processedError = errorHandlerService.logError(err, context);
      setError(processedError);
      return processedError;
    } catch (internalErr) {
      console.error('Error in handleError:', internalErr);
      setError({ message: 'An unexpected error occurred' });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsRecovering(false);
  }, []);

  const attemptRecovery = useCallback(async (recoveryFn) => {
    if (!error) return false;
    
    try {
      setIsRecovering(true);
      await recoveryFn?.();
      clearError();
      return true;
    } catch (recoveryErr) {
      handleError(recoveryErr, { context: 'Recovery failed' });
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [error, clearError, handleError]);

  return { error, isRecovering, handleError, clearError, attemptRecovery };
};

export default useErrorHandler;
