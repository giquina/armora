import { useState, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number;
  prevent?: boolean;
}

export const useSwipeGesture = (
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) => {
  const { threshold = 50, prevent = false } = config;
  const [isSwiping, setIsSwiping] = useState(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const currentPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    currentPos.current = { x: touch.clientX, y: touch.clientY };
    setIsSwiping(true);

    if (prevent) {
      e.preventDefault();
    }
  }, [prevent]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startPos.current) return;

    const touch = e.touches[0];
    currentPos.current = { x: touch.clientX, y: touch.clientY };

    if (prevent) {
      e.preventDefault();
    }
  }, [prevent]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!startPos.current || !currentPos.current) {
      setIsSwiping(false);
      return;
    }

    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine swipe direction
    if (Math.max(absDeltaX, absDeltaY) > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    startPos.current = null;
    currentPos.current = null;
    setIsSwiping(false);

    if (prevent) {
      e.preventDefault();
    }
  }, [handlers, threshold, prevent]);

  const swipeProps = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { swipeProps, isSwiping };
};