/**
 * Armora Security - Firebase Cloud Messaging Service Worker
 *
 * Handles background push notifications for protection assignments,
 * CPO status updates, and emergency alerts.
 *
 * SECURITY-FOCUSED NOTIFICATIONS:
 * - Assignment confirmations
 * - CPO (Close Protection Officer) approaching Principal
 * - Protection detail active/completed
 * - Emergency alerts and panic button responses
 * - Route changes and ETA updates
 */

// Import Firebase scripts using compat version for service worker compatibility
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration for Armora Protection
// NOTE: If REACT_APP_FIREBASE_APP_ID is not set, retrieve it from:
// Firebase Console → Project Settings → General → Your apps → App ID
const firebaseConfig = {
  apiKey: "AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU",
  authDomain: "armora-protection.firebaseapp.com",
  projectId: "armora-protection",
  storageBucket: "armora-protection.firebasestorage.app",
  messagingSenderId: "1010601153585",
  appId: "1:1010601153585:android:9cb1f76fb75c9be748b110"
};

// Initialize Firebase app in service worker context
try {
  firebase.initializeApp(firebaseConfig);
  console.log('[FCM-SW] Firebase initialized successfully');
} catch (error) {
  console.error('[FCM-SW] Firebase initialization failed:', error);
}

// Get Firebase Messaging instance
const messaging = firebase.messaging();

/**
 * BACKGROUND MESSAGE HANDLER
 *
 * Handles push notifications when the app is in the background or closed.
 * Creates rich notifications with professional security styling.
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM-SW] Background message received:', payload);

  try {
    // Extract notification data from payload
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Armora Security';
    const notificationBody = payload.notification?.body || payload.data?.body || 'Protection update available';

    // Parse additional data for routing and context
    const notificationData = {
      assignmentId: payload.data?.assignmentId || null,
      type: payload.data?.type || 'general', // Types: assignment, cpo_update, emergency, route_change
      url: payload.data?.url || '/',
      timestamp: Date.now(),
      urgent: payload.data?.urgent === 'true' || payload.data?.priority === 'high'
    };

    // Determine icon based on notification type
    let icon = '/logo192.png';
    if (notificationData.type === 'emergency') {
      icon = '/logo512.png'; // Use larger icon for emergencies
    }

    // Configure notification options with professional security focus
    const notificationOptions = {
      body: notificationBody,
      icon: icon,
      badge: '/logo192.png', // Fallback to logo192 since badge-72x72 doesn't exist
      vibrate: [200, 100, 200], // Professional vibration pattern
      requireInteraction: notificationData.urgent, // Keep visible if urgent
      silent: false,
      timestamp: notificationData.timestamp,
      data: notificationData,

      // Professional action buttons for quick response
      actions: getNotificationActions(notificationData.type),

      // Additional visual enhancements
      tag: notificationData.assignmentId || 'armora-notification', // Group related notifications
      renotify: notificationData.urgent, // Re-alert if urgent

      // PWA-specific options
      dir: 'ltr',
      lang: 'en-GB' // UK English for England & Wales service area
    };

    // Show the notification
    return self.registration.showNotification(notificationTitle, notificationOptions);

  } catch (error) {
    console.error('[FCM-SW] Error showing notification:', error);

    // Fallback notification if error occurs
    return self.registration.showNotification('Armora Security', {
      body: 'You have a new protection update',
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: { url: '/', type: 'general' }
    });
  }
});

/**
 * NOTIFICATION CLICK HANDLER
 *
 * Opens the app when user clicks on a notification.
 * Intelligently focuses existing windows or opens new ones.
 * Routes to the correct view based on notification data.
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[FCM-SW] Notification clicked:', event.action, event.notification.data);

  // Close the notification
  event.notification.close();

  // Handle different action buttons
  if (event.action === 'dismiss') {
    // User dismissed - just close, no action needed
    return;
  }

  // Determine target URL based on notification data
  let targetUrl = event.notification.data?.url || '/';

  // Route to specific views based on notification type
  switch (event.notification.data?.type) {
    case 'assignment':
      // Route to assignments view with specific assignment
      if (event.notification.data?.assignmentId) {
        targetUrl = `/?view=assignments&id=${event.notification.data.assignmentId}`;
      } else {
        targetUrl = '/?view=assignments';
      }
      break;

    case 'cpo_update':
      // Route to active protection detail
      targetUrl = '/?view=home'; // Hub view shows EnhancedProtectionPanel
      break;

    case 'emergency':
      // Route directly to active protection with panic state
      targetUrl = '/?view=home&emergency=true';
      break;

    case 'route_change':
      // Show live tracking
      targetUrl = '/?view=home&tracking=active';
      break;

    default:
      // General notifications go to hub
      targetUrl = '/';
  }

  // Handle action-specific routing
  if (event.action === 'view_detail' && event.notification.data?.assignmentId) {
    targetUrl = `/?view=assignments&id=${event.notification.data.assignmentId}`;
  } else if (event.action === 'contact_cpo') {
    targetUrl = '/?view=home&action=call_cpo';
  }

  // Open or focus the app window
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const targetUrlObj = new URL(targetUrl, self.location.origin);

        // If app is open on same origin, focus it and navigate
        if (clientUrl.origin === targetUrlObj.origin) {
          console.log('[FCM-SW] Focusing existing window');

          // Navigate to target URL
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: targetUrl,
            data: event.notification.data
          });

          return client.focus();
        }
      }

      // No existing window found, open new one
      console.log('[FCM-SW] Opening new window:', targetUrl);
      return clients.openWindow(targetUrl);
    }).catch((error) => {
      console.error('[FCM-SW] Error handling notification click:', error);
      // Fallback: try to open window anyway
      return clients.openWindow('/');
    })
  );
});

/**
 * NOTIFICATION CLOSE HANDLER
 *
 * Tracks when users dismiss notifications without clicking.
 * Useful for analytics and understanding user engagement.
 */
self.addEventListener('notificationclose', (event) => {
  console.log('[FCM-SW] Notification closed:', event.notification.data);

  // Could send analytics event here if needed
  // trackEvent('notification_dismissed', event.notification.data);
});

/**
 * Helper: Get appropriate action buttons based on notification type
 *
 * @param {string} type - Notification type (assignment, cpo_update, emergency, etc.)
 * @returns {Array} Array of notification action objects
 */
function getNotificationActions(type) {
  const baseActions = [];

  switch (type) {
    case 'assignment':
      return [
        { action: 'view_detail', title: 'View Assignment', icon: '/logo192.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/logo192.png' }
      ];

    case 'cpo_update':
      return [
        { action: 'view_detail', title: 'View Status', icon: '/logo192.png' },
        { action: 'contact_cpo', title: 'Contact CPO', icon: '/logo192.png' }
      ];

    case 'emergency':
      return [
        { action: 'view_detail', title: 'Open App', icon: '/logo512.png' }
      ];

    case 'route_change':
      return [
        { action: 'view_detail', title: 'View Route', icon: '/logo192.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/logo192.png' }
      ];

    default:
      return [
        { action: 'view_detail', title: 'View Details', icon: '/logo192.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/logo192.png' }
      ];
  }
}

/**
 * MESSAGE HANDLER
 *
 * Handles messages from the main application thread.
 * Used for updating service worker state or configuration.
 */
self.addEventListener('message', (event) => {
  console.log('[FCM-SW] Message from app:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    // Force service worker to activate immediately
    self.skipWaiting();
  }
});

/**
 * ERROR HANDLER
 *
 * Catches and logs any unhandled errors in the service worker.
 */
self.addEventListener('error', (event) => {
  console.error('[FCM-SW] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[FCM-SW] Unhandled promise rejection:', event.reason);
});

console.log('[FCM-SW] Firebase Cloud Messaging Service Worker loaded successfully');
