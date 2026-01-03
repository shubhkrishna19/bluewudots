import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useRegisterSW } from 'virtual:pwa-register/react'; // Look into this later if using vite-plugin-pwa, but for now manual

const ServiceWorkerUpdater = () => {
    const { showToast } = useNotifications();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('[SW] Registered with scope:', registration.scope);

                // Check for updates on page load
                registration.update();

                // Listen for waiting worker (update available)
                const checkUpdate = () => {
                    if (registration.waiting) {
                        notifyUpdate(registration);
                    }
                };

                checkUpdate();

                // Poll for updates every hour
                const interval = setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

                return () => clearInterval(interval);
            }).catch(err => {
                console.error('[SW] Registration failed:', err);
            });

            // Handle controller change (reload page)
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        }
    }, [showToast]);

    const notifyUpdate = (registration) => {
        showToast({
            title: 'Update Available',
            message: 'A new version of Bluewud OTS is available.',
            type: 'system_alert',
            icon: '🚀',
            priority: 'high',
            action: {
                label: 'Update Now',
                onClick: () => {
                    if (registration.waiting) {
                        // Send skip waiting message
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                }
            }
        });
    };

    return null; // This component handles logic only
};

export default ServiceWorkerUpdater;
