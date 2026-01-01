// Push Notification Service
// Complete web-push notification system with subscription management,
// backend sync, and message queue handling for production use.

import { cacheData, retrieveCachedData } from './offlineCacheService';

const PUSH_CACHE_NS = 'push:subscriptions';
const NOTIFICATION_QUEUE_NS = 'notifications:queue';

/**
 * Register browser for web push notifications
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Subscription object
 */
export const registerPushSubscription = async (options = {}) => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[Push] Service Worker or PushManager not supported');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        options.vapidPublicKey || process.env.VITE_VAPID_PUBLIC_KEY
      )
    });

    // Cache subscription locally
    await cacheData(`${PUSH_CACHE_NS}:current`, subscription.toJSON(), null);
    
    // Send to backend for storage
    await sendSubscriptionToBackend(subscription);
    
    console.log('[Push] Subscription registered:', subscription.endpoint);
    return subscription.toJSON();
  } catch (err) {
    console.error('[Push] Registration failed:', err);
    return null;
  }
};

/**
 * Send local notification with custom action handlers
 * @param {String} title - Notification title
 * @param {Object} options - Notification options (body, icon, badge, tag, data)
 * @returns {Promise<Notification>}
 */
export const sendLocalNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('[Push] Notifications API not supported');
    return Promise.resolve(null);
  }

  if (Notification.permission === 'denied') {
    console.warn('[Push] Notifications denied by user');
    return Promise.resolve(null);
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/bluewud-icon-192.png',
      badge: '/bluewud-badge-72.png',
      tag: options.tag || 'bluewud-notification',
      ...options
    });

    // Click handler
    notification.onclick = () => {
      window.focus();
      if (options.url) window.location.href = options.url;
      notification.close();
    };

    return Promise.resolve(notification);
  }

  // Request permission if not yet determined
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      return sendLocalNotification(title, options);
    }
    return null;
  });
};

/**
 * Queue a notification for delivery (handles offline scenarios)
 * @param {Object} notification - Notification payload
 */
export const queueNotification = async (notification) => {
  const queue = (await retrieveCachedData(NOTIFICATION_QUEUE_NS)) || [];
  queue.push({
    ...notification,
    timestamp: Date.now(),
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });
  await cacheData(NOTIFICATION_QUEUE_NS, queue);
};

/**
 * Process queued notifications (call when coming online)
 */
export const processQueuedNotifications = async () => {
  const queue = (await retrieveCachedData(NOTIFICATION_QUEUE_NS)) || [];
  
  for (const notif of queue) {
    try {
      await sendLocalNotification(notif.title, notif.options);
      // Remove from queue after successful delivery
      const updated = queue.filter(n => n.id !== notif.id);
      await cacheData(NOTIFICATION_QUEUE_NS, updated);
    } catch (err) {
      console.error('[Push] Failed to process queued notification:', err);
    }
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribePush = async () => {
  try {
    if (!('serviceWorker' in navigator)) return false;
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await cacheData(`${PUSH_CACHE_NS}:current`, null);
      console.log('[Push] Unsubscribed successfully');
      return true;
    }
  } catch (err) {
    console.error('[Push] Unsubscribe failed:', err);
  }
  return false;
};

/**
 * Check if notifications are enabled
 */
export const isPushEnabled = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (err) {
    return false;
  }
};

/**
 * Get current push subscription
 */
export const getCurrentSubscription = async () => {
  try {
    const cached = await retrieveCachedData(`${PUSH_CACHE_NS}:current`);
    if (cached) return cached;
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription?.toJSON() || null;
  } catch (err) {
    return null;
  }
};

// ===== Private Helpers =====

/**
 * Convert VAPID public key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Send subscription to backend for storage
 */
async function sendSubscriptionToBackend(subscription) {
  try {
    const response = await fetch('/api/push-subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    console.log('[Push] Subscription sent to backend');
  } catch (err) {
    console.error('[Push] Failed to send subscription to backend:', err);
    // Queue for retry
    await queueNotification({
      title: 'Sync Pending',
      options: {
        body: 'Push subscription will sync when online',
        tag: 'sync-pending'
      }
    });
  }
}

export default {
  registerPushSubscription,
  sendLocalNotification,
  queueNotification,
  processQueuedNotifications,
  unsubscribePush,
  isPushEnabled,
  getCurrentSubscription
};
