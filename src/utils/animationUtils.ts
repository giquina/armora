/**
 * Animation utilities for premium interactive experiences
 * Optimized for 60fps performance with GPU acceleration
 */

import { useEffect, useRef, useState } from 'react';

// Counter animation hook with easing functions
export const useCounterAnimation = (
  endValue: number,
  duration: number = 2000,
  delay: number = 0,
  easing: 'easeOut' | 'easeInOut' | 'linear' = 'easeOut'
) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current - delay;
    
    if (elapsed < 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    const newValue = Math.floor(easedProgress * endValue);

    setCurrentValue(newValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setCurrentValue(endValue);
      setIsAnimating(false);
    }
  };

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentValue(0);
    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
    setCurrentValue(endValue);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { currentValue, startAnimation, stopAnimation, isAnimating };
};

// Intersection Observer hook for scroll-triggered animations
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);
        
        if (intersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-50px',
        ...options
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Staggered animation utilities
export const getStaggeredDelay = (index: number, baseDelay: number = 0.1) => {
  return index * baseDelay;
};

// Animation presets for different use cases
export const animationPresets = {
  modalEntrance: {
    from: { transform: 'translateY(100%) scale(0.9)', opacity: 0 },
    to: { transform: 'translateY(0) scale(1)', opacity: 1 },
    duration: '0.6s',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // elastic ease-out
  },
  
  cardSlideIn: {
    left: { transform: 'translateX(-100%) scale(0.8)', opacity: 0 },
    right: { transform: 'translateX(100%) scale(0.8)', opacity: 0 },
    up: { transform: 'translateY(50%) scale(0.8)', opacity: 0 },
    down: { transform: 'translateY(-50%) scale(0.8)', opacity: 0 },
    to: { transform: 'translate(0) scale(1)', opacity: 1 },
    duration: '0.8s',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  numberGlow: {
    keyframes: `
      0% { filter: drop-shadow(0 3px 12px rgba(255, 215, 0, 0.4)); }
      50% { filter: drop-shadow(0 6px 20px rgba(255, 215, 0, 0.7)); }
      100% { filter: drop-shadow(0 3px 12px rgba(255, 215, 0, 0.4)); }
    `,
    duration: '2s',
    timing: 'ease-in-out infinite'
  },

  particleFloat: {
    keyframes: `
      0%, 100% { 
        transform: translate(-50%, -50%) scale(0.8) rotate(0deg);
        opacity: 0.3;
      }
      33% {
        transform: translate(-60%, -45%) scale(1.1) rotate(5deg);
        opacity: 0.6;
      }
      66% {
        transform: translate(-40%, -55%) scale(0.9) rotate(-5deg);
        opacity: 0.5;
      }
    `,
    duration: '4s',
    timing: 'ease-in-out infinite'
  }
};

// Format numbers for counter display
export const formatCounterValue = (value: number, format: 'default' | 'time' | 'percentage') => {
  switch (format) {
    case 'time':
      return value === 12 ? '12min' : `${value}min`;
    case 'percentage':
      return `${value}%`;
    default:
      return value.toLocaleString();
  }
};

// Performance utilities
export const requestIdleCallback = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback);
  }
  return setTimeout(callback, 0);
};

// Accessibility utilities
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getAccessibleAnimationDuration = (defaultDuration: string) => {
  return respectsReducedMotion() ? '0.01s' : defaultDuration;
};