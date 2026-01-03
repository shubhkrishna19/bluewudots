/**
 * Push Notification Service
 * Web Push API integration for order and delivery notifications
 * Compatible with Service Worker
 */

/**
 * Initialize push notifications with Service Worker registration
 * @param {Object} options Configuration for push notifications
 * @param {string} options.vapidPublicKey VAPID public key from push service
 * @returns {Promise<ServiceWorkerRegistration>} Registered Service Worker
 */
export const initializePushNotifications = async (options = {}) => {
  const { vapidPublicKey = '' } = options;

  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    const registration = await navigator.serviceWorker.register(
      '/service-worker.js',
      { scope: '/' }
    );

    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Failed to register Service Worker:', error);
    throw error;
  }
};

/**
 * Subscribe user to push notifications
 * @param {Object} options Subscription options
 * @param {string} options.vapidPublicKey VAPID public key
 * @returns {Promise<PushSubscription>} Push subscription object
 */
export const subscribeToPushNotifications = async (options = {}) => {
  const { vapidPublicKey } = options;

  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    if (!('PushManager' in window)) {
      throw new Error('Push notifications not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('Subscribed to push notifications:', subscription);
    await savePushSubscription(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>} Success status
 */
export const unsubscribeFromPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await removePushSubscription();
      console.log('Unsubscribed from push notifications');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    throw error;
  }
};

/**
 * Send a notification to the user
 * @param {Object} options Notification options
 * @param {string} options.title Notification title
 * @param {string} options.body Notification body text
 * @param {string} options.icon Icon URL
 * @param {string} options.tag Notification tag (for grouping)
 * @param {Object} options.data Additional data to include
 * @returns {Promise<void>}
 */
export const sendNotification = async (options = {}) => {
  const {
    title = 'Bluewud OTS',
    body = '',
    icon = '/bluewud-logo.png',
    tag = 'notification',
    data = {},
  } = options;

  try {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(title, {
      body,
      icon,
      tag,
      badge: '/bluewud-badge.png',
      data: { timestamp: Date.now(), ...data },
      actions: [
        {
          action: 'open',
          title: 'Open',
          icon: '/icons/open.png',
        },
        {
          action: 'close',
          title: 'Dismiss',
          icon: '/icons/close.png',
        },
      ],
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

/**
 * Send order status notification
 * @param {Object} order Order object
 * @param {string} newStatus New order status
 * @returns {Promise<void>}
 */
export const sendOrderStatusNotification = async (order, newStatus) => {
  const statusMessages = {
    'pending': '⏳ Order pending - awaiting pickup',
    'processing': '📦 Order is being processed',
    'picked': '🚚 Picked up by courier',
    'in-transit': '🚛 In transit to destination',
    'out-for-delivery': '📍 Out for delivery today',
    'delivered': '✅ Delivered successfully',
    'cancelled': '❌ Order cancelled',
    'returned': '🔄 Order returned',
  };

  await sendNotification({
    title: `Order ${order.id} - ${newStatus.toUpperCase()}`,
    body: statusMessages[newStatus] || `Status updated to ${newStatus}`,
    tag: `order-${order.id}`,
    data: {
      orderId: order.id,
      status: newStatus,
      customerName: order.customerName,
      trackingId: order.trackingId,
      action: 'view-order',
    },
  });
};

/**
 * Send delivery confirmation notification
 * @param {Object} delivery Delivery details
 * @returns {Promise<void>}
 */
export const sendDeliveryNotification = async (delivery) => {
  await sendNotification({
    title: '✅ Delivery Confirmed',
    body: `Package delivered to ${delivery.location}`,
    tag: `delivery-${delivery.orderId}`,
    data: {
      orderId: delivery.orderId,
      deliveredAt: new Date().toISOString(),
      signedBy: delivery.signedBy || 'Recipient',
      action: 'view-proof',
    },
  });
};

/**
 * Save push subscription to local storage
 * @param {PushSubscription} subscription Push subscription object
 * @returns {Promise<void>}
 */
const savePushSubscription = async (subscription) => {
  try {
    localStorage.setItem(
      'push-subscription',
      JSON.stringify(subscription.toJSON())
    );
  } catch (error) {
    console.warn('Failed to save push subscription:', error);
  }
};

/**
 * Remove push subscription from local storage
 * @returns {Promise<void>}
 */
const removePushSubscription = async () => {
  try {
    localStorage.removeItem('push-subscription');
  } catch (error) {
    console.warn('Failed to remove push subscription:', error);
  }
};

/**
 * Get current push subscription
 * @returns {Object|null} Saved subscription or null
 */
export const getPushSubscription = () => {
  try {
    const subscription = localStorage.getItem('push-subscription');
    return subscription ? JSON.parse(subscription) : null;
  } catch (error) {
    console.warn('Failed to get push subscription:', error);
    return null;
  }
};

/**
 * Check if push notifications are supported and enabled
 * @returns {Promise<boolean>} True if push notifications are available
 */
export const isPushNotificationAvailable = async () => {
  try {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      Notification.permission === 'granted'
    );
  } catch (error) {
    return false;
  }
};

/**
 * Request push notification permission
 * @returns {Promise<string>} Permission status: 'granted', 'denied', 'default'
 */
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
};

/**
 * Convert VAPID key from base64 to Uint8Array
 * @param {string} base64String Base64 encoded VAPID key
 * @returns {Uint8Array} Uint8Array of the key
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

/**
 * Usage Example:
 *
 * // 1. Initialize push notifications on app load
 * await initializePushNotifications({
 *   vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
 * });
 *
 * // 2. Request user permission
 * const permission = await requestNotificationPermission();
 * if (permission === 'granted') {
 *   await subscribeToPushNotifications({
 *     vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
 *   });
 * }
 *
 * // 3. Send notifications when order status changes
 * await sendOrderStatusNotification(order, 'in-transit');
 *
 * // 4. Verify if push is available before rendering UI
 * const available = await isPushNotificationAvailable();
 * if (available) {
 *   // Show notification settings in UI
 * }
 */

export default {
  initializePushNotifications,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendNotification,
  sendOrderStatusNotification,
  sendDeliveryNotification,
  getPushSubscription,
  isPushNotificationAvailable,
  requestNotificationPermission,
};
