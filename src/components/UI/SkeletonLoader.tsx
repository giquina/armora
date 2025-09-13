import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonLoader({ width = '100%', height = '1rem', className = '' }: SkeletonLoaderProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={style}
      aria-hidden="true"
    />
  );
}

export function LocationSkeletonLoader() {
  return (
    <div className={styles.locationSkeleton}>
      <div className={styles.skeletonHeader}>
        <SkeletonLoader width="60%" height="20px" />
        <SkeletonLoader width="40%" height="16px" />
      </div>
      
      <div className={styles.skeletonContent}>
        <SkeletonLoader width="100%" height="16px" />
        <SkeletonLoader width="80%" height="16px" />
        <SkeletonLoader width="90%" height="16px" />
      </div>
      
      <div className={styles.skeletonActions}>
        <SkeletonLoader width="120px" height="36px" />
        <SkeletonLoader width="80px" height="36px" />
      </div>
    </div>
  );
}