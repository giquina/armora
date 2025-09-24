// Auto-recover from webpack ChunkLoadError by reloading once per session
// Useful when a previously split chunk was removed/renamed, or when caches are stale.
export function installChunkErrorRecovery() {
  if (typeof window === 'undefined') return;

  const reloadKey = 'armora-chunk-error-reload-done';

  function shouldReloadOnce() {
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, '1');
      return true;
    }
    return false;
  }

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // Different bundlers/frameworks report slightly different error shapes/messages
    const reason: any = event.reason || {};
    const name = reason.name || '';
    const message = String(reason.message || reason || '');

    const isChunkError =
      name === 'ChunkLoadError' ||
      message.includes('Loading chunk') ||
      message.includes('ChunkLoadError') ||
      // Safari sometimes throws generic TypeError messages
      message.includes('Importing a module script failed');

    if (isChunkError && shouldReloadOnce()) {
      // Best-effort: clear runtime caches to avoid refetching stale chunks
      if ('caches' in window && caches.keys) {
        caches.keys().then(keys => keys.forEach(k => caches.delete(k))).finally(() => {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    }
  });
}
