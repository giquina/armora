import React from 'react';
import styles from './ArmoraLogo.module.css';

export interface ArmoraLogoProps {
  size?: 'small' | 'medium' | 'large' | 'hero';
  variant?: 'full' | 'compact' | 'minimal' | 'animated' | 'monochrome';
  showOrbits?: boolean;
  interactive?: boolean;
  className?: string;
}

export const ArmoraLogo: React.FC<ArmoraLogoProps> = ({
  size = 'medium',
  variant = 'full',
  showOrbits = true,
  interactive = false,
  className = ''
}) => {
  const logoClass = `
    ${styles.armoraLogo4d} 
    ${styles[size]} 
    ${styles[variant]} 
    ${interactive ? styles.interactive : ''} 
    ${className}
  `.trim();

  return (
    <div className={logoClass}>
      <div className={styles.shieldContainer}>
        {/* Multi-layered depth system */}
        <div className={styles.shieldShadowLayer}></div>
        <div className={styles.shieldDepthLayer3}></div>
        <div className={styles.shieldDepthLayer2}></div>
        <div className={styles.shieldDepthLayer1}></div>
        
        {/* Main shield body with premium materials */}
        <div className={styles.shieldMain}>
          {/* Metallic base with brushed gold texture */}
          <div className={styles.shieldBaseMetallic}></div>
          
          {/* Premium glass overlay with reflections */}
          <div className={styles.shieldGlassOverlay}></div>
          
          {/* Central emblem area */}
          <div className={styles.shieldEmblemArea}>
            {/* 3D raised "A" with premium effects */}
            <div className={styles.letterA3d}>
              <div className={styles.letterFront}>A</div>
              <div className={styles.letterBevel}>A</div>
              <div className={styles.letterShadow}>A</div>
            </div>
          </div>
          
          {/* Security circuit patterns */}
          <div className={styles.securityCircuits}>
            <svg className={styles.circuitPattern} viewBox="0 0 100 100">
              <path d="M10,50 Q30,30 50,50 Q70,70 90,50" />
              <circle cx="20" cy="45" r="2" />
              <circle cx="80" cy="55" r="2" />
              <path d="M30,20 L70,20 M30,80 L70,80" />
              <circle cx="50" cy="20" r="1" />
              <circle cx="50" cy="80" r="1" />
            </svg>
          </div>
          
          {/* Holographic security strips */}
          <div className={styles.holographicStrips}></div>
        </div>
        
        {/* Dynamic orbital rings */}
        {showOrbits && (
          <div className={styles.orbitalSystem}>
            <div className={styles.orbitRing1}></div>
            <div className={styles.orbitRing2}></div>
            <div className={styles.orbitRing3}></div>
          </div>
        )}
        
        {/* Energy field effect */}
        <div className={styles.energyField}></div>
      </div>
    </div>
  );
};