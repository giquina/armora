import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  animated?: boolean;
  className?: string;
}

export function SkeletonLoader({ 
  variant = 'text',
  width,
  height,
  count = 1,
  animated = true,
  className = ''
}: SkeletonLoaderProps) {
  const getSkeletonClass = () => {
    let classes = `${styles.skeleton} ${styles[variant]}`;
    if (animated) classes += ` ${styles.animated}`;
    if (className) classes += ` ${className}`;
    return classes;
  };

  const getSkeletonStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={getSkeletonClass()}
      style={getSkeletonStyle()}
      role="status"
      aria-label="Loading content"
    />
  ));

  return count > 1 ? (
    <div className={styles.container}>
      {skeletons}
    </div>
  ) : (
    skeletons[0]
  );
}

// Pre-built skeleton components for common use cases
export function LocationSkeletonLoader() {
  return (
    <div className={styles.locationSkeleton}>
      <SkeletonLoader variant="rectangular" height={56} className={styles.inputSkeleton} />
      <SkeletonLoader variant="rectangular" height={56} className={styles.inputSkeleton} />
      <div className={styles.estimateSkeleton}>
        <SkeletonLoader variant="text" width="60%" height={20} />
        <SkeletonLoader variant="text" width="40%" height={16} />
        <SkeletonLoader variant="text" width="50%" height={16} />
        <SkeletonLoader variant="text" width="70%" height={20} />
      </div>
    </div>
  );
}

export function ServiceCardSkeletonLoader() {
  return (
    <div className={styles.serviceSkeleton}>
      <SkeletonLoader variant="text" width="80%" height={24} />
      <SkeletonLoader variant="text" width="60%" height={16} />
      <SkeletonLoader variant="rectangular" width="100%" height={80} />
      <SkeletonLoader variant="text" width="90%" height={16} count={3} />
    </div>
  );
}

export function BookingSkeletonLoader() {
  return (
    <div className={styles.bookingSkeleton}>
      <div className={styles.sectionSkeleton}>
        <SkeletonLoader variant="text" width="40%" height={20} />
        <SkeletonLoader variant="rectangular" height={80} />
      </div>
      <div className={styles.sectionSkeleton}>
        <SkeletonLoader variant="text" width="35%" height={20} />
        <SkeletonLoader variant="rectangular" height={120} />
      </div>
      <div className={styles.sectionSkeleton}>
        <SkeletonLoader variant="text" width="45%" height={20} />
        <SkeletonLoader variant="rectangular" height={100} />
      </div>
    </div>
  );
}