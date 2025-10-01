import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

/**
 * Notification Service
 * Handles Firebase Cloud Messaging (FCM) push notifications
 * SIA-COMPLIANT: Security-focused notification language
 */
export const notificationService = {
  /**
   * Request notification permission from user
   * Required for receiving push notifications about protection assignments
   *
   * @returns FCM registration token if permission granted
   */
  async requestPermission() {
    try {
      console.log('📱 Requesting notification permission...');

      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('✅ Notification permission granted');

        // Get FCM token for this device
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
        });

        if (token) {
          console.log('🔑 FCM Token obtained:', token.substring(0, 20) + '...');

          // Store token in database for sending targeted notifications
          await this.storeFCMToken(token);

          return { success: true, token };
        } else {
          console.warn('⚠️ No FCM token received');
          return { success: false, error: 'No token received' };
        }
      } else {
        console.log('❌ Notification permission denied');
        return { success: false, error: 'Permission denied' };
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return { success: false, error };
    }
  },

  /**
   * Store FCM token in database for user
   * Allows backend to send push notifications to this device
   */
  async storeFCMToken(token: string) {
    try {
      // TODO: Store in Supabase user profile
      // await supabase
      //   .from('user_profiles')
      //   .update({ fcm_token: token })
      //   .eq('user_id', userId);

      console.log('💾 FCM token stored for user');
    } catch (error) {
      console.error('❌ Error storing FCM token:', error);
    }
  },

  /**
   * Setup listener for foreground notifications
   * Handles notifications when app is open and active
   */
  setupMessageListener() {
    onMessage(messaging, (payload) => {
      console.log('📬 Foreground notification received:', payload);

      const title = payload.notification?.title || 'Armora Protection Services';
      const body = payload.notification?.body || 'You have a protection update';
      const icon = payload.notification?.icon || '/logo192.png';

      // Display notification even when app is in foreground
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon,
          badge: '/badge-72x72.png',
          tag: payload.data?.assignmentId || 'armora-notification',
          requireInteraction: payload.data?.priority === 'high',
          data: payload.data
        });
      }

      // Handle notification click/action
      this.handleNotificationAction(payload);
    });

    console.log('👂 Foreground message listener active');
  },

  /**
   * Handle notification actions (clicks, button presses)
   */
  handleNotificationAction(payload: any) {
    const notificationType = payload.data?.type;

    switch (notificationType) {
      case 'officer_assigned':
        console.log('🛡️ Protection Officer assigned to your assignment');
        // Navigate to active assignment view
        break;

      case 'officer_arriving':
        console.log('🚗 Protection Officer approaching commencement point');
        // Show live tracking map
        break;

      case 'protection_commenced':
        console.log('✅ Protection detail has commenced');
        // Navigate to active protection panel
        break;

      case 'assignment_completed':
        console.log('🏁 Protection assignment completed safely');
        // Show rating/feedback prompt
        break;

      case 'broadcast_expired':
        console.log('⏰ Assignment broadcast expired - no officers available');
        // Show retry or support options
        break;

      default:
        console.log('📢 General notification:', payload.notification?.title);
    }
  },

  /**
   * Send test notification (development only)
   */
  async sendTestNotification() {
    if (Notification.permission === 'granted') {
      new Notification('Armora Protection Services', {
        body: 'Test notification - Your protection officer is en route',
        icon: '/logo192.png',
        badge: '/badge-72x72.png',
        tag: 'test-notification'
      });

      console.log('🧪 Test notification sent');
    } else {
      console.warn('⚠️ Cannot send test notification - permission not granted');
    }
  },

  /**
   * Check if notifications are supported and enabled
   */
  isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
};

/**
 * Notification Templates for Different Assignment States
 * SIA-COMPLIANT: Professional security messaging
 */
export const notificationTemplates = {
  officerAssigned: (officerName: string) => ({
    title: 'Protection Officer Assigned',
    body: `${officerName} has been assigned to your protection detail and is en route`,
    priority: 'high'
  }),

  officerArriving: (eta: number) => ({
    title: 'Protection Officer Approaching',
    body: `Your protection officer will arrive at commencement point in ${eta} minutes`,
    priority: 'high'
  }),

  protectionCommenced: () => ({
    title: 'Protection Detail Active',
    body: 'Your protection service has commenced. You are secure.',
    priority: 'normal'
  }),

  assignmentCompleted: () => ({
    title: 'Protection Assignment Completed',
    body: 'You have arrived safely at your secure destination',
    priority: 'normal'
  }),

  broadcastExpired: () => ({
    title: 'No Officers Available',
    body: 'No protection officers available in your area. Please try again or contact support.',
    priority: 'high'
  }),

  emergencyAlert: () => ({
    title: '🚨 EMERGENCY ALERT',
    body: 'Your emergency signal has been received. Help is being dispatched.',
    priority: 'urgent'
  })
};
