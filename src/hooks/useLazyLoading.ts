import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadConfig {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export const useLazyLoading = (config: LazyLoadConfig = {}) => {
  const { rootMargin = '50px', threshold = 0.1, triggerOnce = true } = config;
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (triggerOnce && hasTriggered)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return { elementRef, isVisible };
};

export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback(() => {
    const element = scrollElementRef.current;
    if (element) {
      setScrollTop(element.scrollTop);
    }
  }, []);

  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  };
};

export const useImageLazyLoading = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const loadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }

      if (failedImages.has(src)) {
        reject(new Error('Image previously failed to load'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        resolve();
      };
      img.onerror = () => {
        setFailedImages(prev => new Set(prev).add(src));
        reject(new Error('Failed to load image'));
      };
      img.src = src;
    });
  }, [loadedImages, failedImages]);

  const isLoaded = useCallback((src: string) => loadedImages.has(src), [loadedImages]);
  const hasFailed = useCallback((src: string) => failedImages.has(src), [failedImages]);

  return { loadImage, isLoaded, hasFailed };
};