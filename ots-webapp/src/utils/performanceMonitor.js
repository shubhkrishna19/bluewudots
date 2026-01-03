/**
 * Performance Monitor Utility
 * Tools for tracking and logging component render performance.
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to log component render times.
 * @param {string} componentName - Name of the component for logging
 */
export const useRenderTime = (componentName) => {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(performance.now());

    useEffect(() => {
        const now = performance.now();
        const renderTime = now - lastRenderTime.current;
        renderCount.current += 1;

        if (process.env.NODE_ENV === 'development') {
            console.log(
                `[Perf] ${componentName} - Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
            );
        }

        lastRenderTime.current = now;
    });
};

/**
 * Measure the execution time of a function.
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for logging
 * @returns {Function} Wrapped function with timing
 */
export const measureTime = (fn, label) => {
    return async (...args) => {
        const start = performance.now();
        const result = await fn(...args);
        const duration = performance.now() - start;

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Perf] ${label} executed in ${duration.toFixed(2)}ms`);
        }

        return result;
    };
};

/**
 * Log a performance mark for Chrome DevTools.
 * @param {string} markName
 */
export const perfMark = (markName) => {
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(markName);
    }
};

/**
 * Measure between two marks.
 * @param {string} name
 * @param {string} startMark
 * @param {string} endMark
 */
export const perfMeasure = (name, startMark, endMark) => {
    if (typeof performance !== 'undefined' && performance.measure) {
        try {
            performance.measure(name, startMark, endMark);
        } catch (e) {
            console.warn('Performance measure failed:', e);
        }
    }
};

export default {
    useRenderTime,
    measureTime,
    perfMark,
    perfMeasure
};
