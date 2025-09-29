import { useState, useRef, useCallback } from 'react';

interface SwipeToDeleteConfig {
  threshold?: number;
  onDelete?: () => void;
  enabled?: boolean;
}

export const useSwipeToDelete = (config: SwipeToDeleteConfig = {}) => {
  const { threshold = 100, onDelete, enabled = true } = config;
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isDeletable, setIsDeletable] = useState(false);

  const startX = useRef(0);
  const currentX = useRef(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    const touch = e.touches[0];
    startX.current = touch.clientX;
    currentX.current = touch.clientX;
    setIsSwipeActive(true);
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwipeActive || !enabled) return;

    const touch = e.touches[0];
    currentX.current = touch.clientX;
    const deltaX = currentX.current - startX.current;

    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      const distance = Math.min(Math.abs(deltaX), threshold * 1.5);
      setSwipeDistance(distance);
      setIsDeletable(distance >= threshold);

      // Prevent scrolling when swiping
      e.preventDefault();
    } else {
      setSwipeDistance(0);
      setIsDeletable(false);
    }
  }, [isSwipeActive, enabled, threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipeActive || !enabled) return;

    setIsSwipeActive(false);

    if (isDeletable && onDelete) {
      onDelete();
    } else {
      // Animate back to original position
      setSwipeDistance(0);
      setIsDeletable(false);
    }
  }, [isSwipeActive, enabled, isDeletable, onDelete]);

  const swipeProps = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  const swipeStyle = {
    transform: `translateX(-${swipeDistance}px)`,
    transition: isSwipeActive ? 'none' : 'transform 0.3s ease',
  };

  const deleteIndicatorStyle = {
    opacity: swipeDistance / threshold,
    transform: `translateX(${Math.min(swipeDistance, threshold)}px)`,
  };

  const reset = useCallback(() => {
    setSwipeDistance(0);
    setIsDeletable(false);
    setIsSwipeActive(false);
  }, []);

  return {
    elementRef,
    swipeProps,
    swipeStyle,
    deleteIndicatorStyle,
    isSwipeActive,
    isDeletable,
    swipeDistance,
    reset,
  };
};