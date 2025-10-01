/**
 * Firebase Configuration
 * Handles Firebase initialization for real-time tracking and push notifications
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let database: Database | null = null;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);

  // Initialize messaging only if supported (not in all browsers)
  isSupported().then((supported) => {
    if (supported && app) {
      messaging = getMessaging(app);
    }
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app as firebase, database, messaging };
export default app;
