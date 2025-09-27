import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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

// Service worker registration removed to avoid stale cached chunks causing ChunkLoadError.
// Proactively unregister any existing service workers and clear caches (best-effort, non-blocking).
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister());
    if (registrations.length > 0) {
    }
  }).catch(err => console.warn('[SW] Unregister failed:', err));

  // Clear runtime caches that may still hold old chunks
  if ('caches' in window) {
    caches.keys().then(keys => {
      return Promise.all(keys.map(k => caches.delete(k)));
    }).catch(err => console.warn('[SW] Cache clear failed:', err));
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
