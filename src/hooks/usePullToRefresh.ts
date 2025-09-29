import { useState, useRef, useCallback, useEffect } from 'react';

interface PullToRefreshConfig {
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = (
  onRefresh: () => Promise<void> | void,
  config: PullToRefreshConfig = {}
) => {
  const { threshold = 80, resistance = 2.5, enabled = true } = config;
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing) return;

    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !enabled || isRefreshing) return;

    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0) {
      e.preventDefault();
      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      setPullDistance(distance);
    } else {
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [isPulling, enabled, isRefreshing, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enabled || isRefreshing) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500); // Minimum refresh duration for UX
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, enabled, isRefreshing, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  const refreshIndicatorStyle = {
    transform: `translateY(${pullDistance}px)`,
    opacity: pullDistance / threshold,
  };

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    refreshIndicatorStyle,
    shouldShowIndicator: pullDistance > 10,
  };
};