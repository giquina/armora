import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize Sentry for error monitoring and performance tracking
Sentry.init({
  dsn: "https://2eccb0faaa6cc2708b1e767e51af88c1@o4510152121712640.ingest.de.sentry.io/4510153279864912",

  // Set environment based on build mode
  environment: process.env.NODE_ENV,

  // Enable performance monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true, // Mask sensitive data in replays
      blockAllMedia: true, // Don't capture media in replays
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors

  // Automatically capture unhandled promise rejections
  autoSessionTracking: true,

  // Send default PII (IP addresses, user agents) for better error tracking
  sendDefaultPii: true,

  // Release tracking (uses git commit hash if available)
  release: process.env.REACT_APP_VERSION || 'armora@1.0.0',

  // Filter out development errors
  beforeSend(event, hint) {
    // Don't send chunk loading errors in development
    if (process.env.NODE_ENV === 'development') {
      const errorMessage = hint?.originalException?.toString() || '';
      if (errorMessage.includes('ChunkLoadError') ||
          errorMessage.includes('Loading chunk')) {
        return null;
      }
    }
    return event;
  },
});

// Comprehensive error suppression for development
if (process.env.NODE_ENV === 'development') {
  // Suppress React error overlay for chunk loading errors
  const originalError = console.error;
  console.error = (...args) => {
    const errorMessage = args[0];
    if (typeof errorMessage === 'string') {
      // Suppress chunk loading errors
      if (errorMessage.includes('ChunkLoadError') ||
          errorMessage.includes('ScenarioError') ||
          errorMessage.includes('Loading chunk') ||
          errorMessage.includes('failed')) {
        console.warn('[SUPPRESSED CHUNK ERROR]', ...args);
        return;
      }
    }
    originalError(...args);
  };

  // Global error handler to prevent error overlay
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || event.error?.message || '';
    if (errorMessage.includes('ChunkLoadError') ||
        errorMessage.includes('ScenarioError') ||
        errorMessage.includes('Loading chunk')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      console.warn('Suppressed chunk loading error:', errorMessage);
      return false;
    }
  });

  // Suppress unhandled promise rejections from chunk loading
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason || '';
    if (typeof reason === 'string' &&
        (reason.includes('ChunkLoadError') ||
         reason.includes('ScenarioError') ||
         reason.includes('Loading chunk'))) {
      event.preventDefault();
      console.warn('Suppressed chunk loading promise rejection:', reason);
      return false;
    }
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Service Worker - DISABLED IN DEVELOPMENT to prevent caching issues
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                console.log('New content available; please refresh.');
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} else if ('serviceWorker' in navigator && process.env.NODE_ENV === 'development') {
  // Unregister any existing service workers in development
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('Unregistered service worker in development mode');
    });
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
