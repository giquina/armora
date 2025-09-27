import { FC, ReactNode, useEffect, useState, useMemo } from 'react';
import { getCurrentTheme, SeasonalTheme } from '../../utils/seasonalThemes';
import styles from './SeasonalTheme.module.css';

interface SeasonalThemeProps {
  children?: ReactNode;
  className?: string;
  testMonth?: number; // For testing different months
}

const SeasonalThemeComponent: FC<SeasonalThemeProps> = ({ 
  children, 
  className = '',
  testMonth 
}) => {
  const [theme, setTheme] = useState<SeasonalTheme>(getCurrentTheme());
  const [isLoaded, setIsLoaded] = useState(false);

  // Update theme when component mounts or testMonth changes
  useEffect(() => {
    const newTheme = testMonth ? 
      getCurrentTheme() : // Use testMonth logic if needed
      getCurrentTheme();
    
    setTheme(newTheme);
    
    // Smooth loading transition
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [testMonth]);

  // Generate particles based on theme
  const particles = useMemo(() => {
    return Array.from({ length: theme.particles.count }, (_, i) => ({
      id: i,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: theme.particles.size.min + Math.random() * (theme.particles.size.max - theme.particles.size.min),
      rotation: Math.random() * 360
    }));
  }, [theme]);

  // Particle shape renderer
  const renderParticleShape = (particleTheme: SeasonalTheme['particles'], size: number) => {
    switch (particleTheme.shape) {
      case 'snowflake':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L12 22M7.05 5.64L16.95 18.36M5.64 7.05L18.36 16.95M2 12L22 12M7.05 18.36L16.95 5.64M5.64 16.95L18.36 7.05"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        );
      
      case 'leaf':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
              d="M17 8C8 10 5.5 16.5 3 21C8.5 18.5 15 16 17 7V8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path
              d="M3 21C7.5 16.5 15 13 17 8"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </svg>
        );
      
      case 'sparkle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L13.09 8.26L20 7.27L14.18 12.18L15.64 18.36L12 15.77L8.36 18.36L9.82 12.18L4 7.27L10.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
        );
      
      case 'circle':
      default:
        return (
          <div 
            className={styles.circleParticle}
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, currentColor 0%, transparent 70%)`
            }}
          />
        );
    }
  };

  return (
    <div 
      className={`${styles.seasonalContainer} ${className} ${isLoaded ? styles.loaded : ''}`}
      style={{
        '--theme-gradient': theme.atmosphere.gradient,
        '--theme-overlay': theme.atmosphere.overlay || 'transparent',
        '--theme-glow': theme.atmosphere.glow || 'transparent',
        '--particle-color': theme.particles.color,
        '--particle-secondary': theme.particles.secondaryColor || theme.particles.color,
        '--animation-intensity': theme.animation.intensity,
      } as React.CSSProperties}
    >
      {/* Atmospheric background */}
      <div className={styles.atmosphereLayer} />
      
      {/* Particle field */}
      <div className={styles.particleField}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`${styles.particle} ${styles[`particle${theme.particles.shape}`]} ${styles[`direction${theme.particles.direction}`]} ${styles[`intensity${theme.animation.intensity}`]}`}
            style={{
              '--delay': `${particle.delay}s`,
              '--duration': `${particle.duration}s`,
              '--x': `${particle.x}%`,
              '--y': `${particle.y}%`,
              '--rotation': `${particle.rotation}deg`,
              '--size': `${particle.size}px`,
              color: Math.random() > 0.7 ? theme.particles.secondaryColor : theme.particles.color,
            } as React.CSSProperties}
          >
            {renderParticleShape(theme.particles, particle.size)}
          </div>
        ))}
      </div>

      {/* Glow overlay */}
      {theme.atmosphere.glow && (
        <div className={styles.glowOverlay} />
      )}

      {/* Content */}
      <div className={styles.content}>
        {children}
      </div>

    </div>
  );
};

export default SeasonalThemeComponent;