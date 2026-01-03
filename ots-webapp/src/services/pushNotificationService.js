/**
 * Push Notification Service
 * Manages web push notifications for real-time alerts
 * 
 * Features:
 * - Service Worker integration
 * - Subscription management
 * - Notification persistence
 * - Badge & icon management
 * - Notification click handling
 */

class PushNotificationService {
  constructor(vapidPublicKey) {
    this.vapidPublicKey = vapidPublicKey;
    this.swRegistration = null;
    this.subscriptions = new Map();
    this.notificationSettings = {
      badge: '/badge-icon.png',
      icon: '/notification-icon.png',
      vibrate: [100, 50, 100],
      tag: 'bluewud-notification'
    };
  }

  /**
   * Initializes the Push Notification Service
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Check browser support
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push Notifications not supported in this browser');
        return;
      }

      // Register Service Worker
      this.swRegistration = await navigator.serviceWorker.register(
        '/sw.js',
        { scope: '/' }
      );
      console.log('Service Worker registered for Push Notifications');

      // Check for existing subscription
      const existingSubscription = await this.swRegistration.pushManager.getSubscription();
      if (existingSubscription) {
        this.subscriptions.set('default', existingSubscription);
      }

      // Listen for push messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'PUSH_NOTIFICATION') {
          this.handleNotificationClick(event.data);
        }
      });
    } catch (error) {
      console.error('Failed to initialize Push Notifications:', error);
    }
  }

  // Alias for App.jsx compatibility
  async registerServiceWorker() {
    return this.initialize();
  }

  async subscribeUser() {
    // Compatibility with HEAD version usage if any
    // Assuming user ID is not available here, we might need to handle this.
    // For now, reuse registerPushSubscription with a placeholder or throw.
    console.warn("subscribeUser called without userId, using default");
    return this.registerPushSubscription('default-user');
  }

  /**
   * Requests and registers push subscription
   * @param {string} userId - User ID
   * @returns {Promise<object>} Subscription object
   */
  async registerPushSubscription(userId) {
    try {
      // Check permission
      if (Notification.permission === 'denied') {
        return {
          success: false,
          error: 'Notification permission denied',
          userId
        };
      }

      // Request permission if needed
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          return {
            success: false,
            error: 'User denied notification permission',
            userId
          };
        }
      }

      // Subscribe to push
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey || 'BIN2Jc5VkkmiY...') // Fallback key if env missing
      });

      // Store subscription
      this.subscriptions.set(userId, subscription);

      // Persist to backend
      await this.persistSubscription(userId, subscription);

      return {
        success: true,
        subscription: subscription.toJSON(),
        userId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to register push subscription:', error);
      return {
        success: false,
        error: error.message,
        userId
      };
    }
  }

  /**
   * Unsubscribes from push notifications
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async unregisterPushSubscription(userId) {
    try {
      const subscription = this.subscriptions.get(userId);
      if (subscription) {
        await subscription.unsubscribe();
        this.subscriptions.delete(userId);
        await this.removeSubscription(userId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unregister push subscription:', error);
      return false;
    }
  }

  /**
   * Sends notification to user
   * @param {string} title - Notification title
   * @param {object} options - Notification options
   * @returns {Promise<void>}
   */
  async sendNotification(title, options = {}) {
    try {
      if (!this.swRegistration) {
        // Try to get registration if missing
        this.swRegistration = await navigator.serviceWorker.ready;
      }

      if (!this.swRegistration) {
        throw new Error('Service Worker not registered');
      }

      const notificationOptions = {
        ...this.notificationSettings,
        ...options,
        tag: options.tag || this.notificationSettings.tag,
        requireInteraction: options.requireInteraction || false
      };

      await this.swRegistration.showNotification(title, notificationOptions);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  /**
   * Sends order status update notification
   * @param {object} order - Order object
   * @returns {Promise<void>}
   */
  async sendOrderStatusNotification(order) {
    const title = `Order ${order.id} - ${order.status}`;
    const options = {
      body: order.message || `Your order status: ${order.status}`,
      icon: '/order-icon.png',
      badge: '/badge-icon.png',
      tag: `order-${order.id}`,
      data: {
        orderId: order.id,
        status: order.status,
        timestamp: Date.now(),
        url: `/orders/${order.id}`
      },
      actions: [
        {
          action: 'open',
          title: 'View Order',
          icon: '/icons/view.png'
        },
        {
          action: 'close',
          title: 'Dismiss',
          icon: '/icons/close.png'
        }
      ]
    };

    await this.sendNotification(title, options);
  }

  /**
   * Handles notification click
   * @param {object} data - Notification data
   */
  handleNotificationClick(data) {
    if (data.action === 'open' && data.url) {
      window.location.href = data.url;
    }
  }

  /**
   * Gets current subscription status
   * @param {string} userId - User ID
   * @returns {object} Subscription status
   */
  getSubscriptionStatus(userId) {
    const subscription = this.subscriptions.get(userId);
    return {
      userId,
      isSubscribed: !!subscription,
      subscription: subscription ? subscription.toJSON() : null,
      permissionStatus: Notification.permission
    };
  }

  /**
   * Persists subscription to backend
   * @param {string} userId - User ID
   * @param {object} subscription - Subscription object
   * @returns {Promise<boolean>}
   */
  async persistSubscription(userId, subscription) {
    try {
      const response = await fetch('/api/push-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscription: subscription.toJSON()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to persist subscription:', error);
      return false;
    }
  }

  /**
   * Removes subscription from backend
   * @param {string} userId - User ID
   * @returns {Promise<boolean>}
   */
  async removeSubscription(userId) {
    try {
      const response = await fetch(`/api/push-subscriptions/${userId}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to remove subscription:', error);
      return false;
    }
  }

  /**
   * Converts VAPID public key from base64 to Uint8Array
   * @param {string} base64String - Base64 encoded key
   * @returns {Uint8Array}
   */
  urlBase64ToUint8Array(base64String) {
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
}

// Export as singleton instance
// This ensures 'import pushNotificationService from ...' works as expected in App.jsx
const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
const pushNotificationInstance = new PushNotificationService(vapidKey);

export const initPushNotificationService = (key) => {
  // Re-initialize if needed with specific key, though typically env var is enough
  pushNotificationInstance.vapidPublicKey = key;
  return pushNotificationInstance;
};

export const getPushNotificationService = () => pushNotificationInstance;

export default pushNotificationInstance;
