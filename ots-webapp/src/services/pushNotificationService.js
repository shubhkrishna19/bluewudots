/**
 * Web Push Notification Service
 * 
 * Handles VAPID registration, service worker subscription, and real-time alerts.
 * Features:
 * - Browser subscription management
 * - Local & remote push notifications
 * - Offline notification queueing
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

/**
 * Convert base64 string to Uint8Array for VAPID key
 */
const urlBase64ToUint8Array = (base64String) => {
  if (!base64String) return new Uint8Array(0);
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Register the browser for push notifications
 */
export const subscribeUser = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription && VAPID_PUBLIC_KEY) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      console.log('[Push] New subscription:', subscription);
    }

    return subscription;
  } catch (error) {
    console.error('[Push] Subscription failed:', error);
    return null;
  }
};

/**
 * Send a local push notification (Immediate)
 */
export const sendLocalNotification = async (title, options = {}) => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      body: options.body || 'New update from Bluewud OTS',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: options.data || { dateOfArrival: Date.now() },
      ...options
    });
  } catch (error) {
    console.error('[Push] Local notification failed:', error);
  }
};

/**
 * Check if notifications are enabled
 */
export const isPushEnabled = async () => {
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
};

/**
 * Request notification permission
 */
export const requestPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  return await Notification.requestPermission();
};

export default {
  subscribeUser,
  sendLocalNotification,
  isPushEnabled,
  requestPermission
};
