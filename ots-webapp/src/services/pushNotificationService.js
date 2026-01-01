// Push Notification Service Stub
// This module provides functions to register for web push notifications and send notifications.
// In production, integrate with a backend to store subscription info and send push messages.

export const registerPushSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('[Push] Service Worker or Push API not supported');
        return null;
    }
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            // VAPID public key placeholder – replace with real key in production
            applicationServerKey: urlBase64ToUint8Array('BPLACEHOLDER_PUBLIC_KEY')
        });
        console.log('[Push] Subscription obtained', subscription);
        // TODO: Send subscription to backend for storage
        return subscription;
    } catch (err) {
        console.error('[Push] Subscription failed', err);
        return null;
    }
};

export const sendLocalNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
        new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
            if (perm === 'granted') new Notification(title, options);
        });
    }
};

// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
