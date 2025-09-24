import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { installChunkErrorRecovery } from './utils/chunkErrorRecovery';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Install global recovery for dynamic chunk load failures
installChunkErrorRecovery();

// Service Worker handling
// - In production: register SW for PWA features if available
// - In development: aggressively unregister any existing SWs and clear caches
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  } else {
    // Development: ensure no stale service workers or caches remain
    const reloadKey = 'armora-sw-cleanup-done';
    const alreadyReloaded = sessionStorage.getItem(reloadKey);

    const clearAllCaches = (): Promise<void> => {
      if (window.caches && caches.keys) {
        return caches
          .keys()
          .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
          .then(() => {});
      }
      return Promise.resolve();
    };

    navigator.serviceWorker.getRegistrations().then((regs) => {
      const unregisterAll = regs.length > 0 ? Promise.all(regs.map((r) => r.unregister())) : Promise.resolve();
      unregisterAll
        .then(() => clearAllCaches())
        .then(() => {
          if (!alreadyReloaded) {
            sessionStorage.setItem(reloadKey, '1');
            window.location.reload();
          }
        });
    });
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
