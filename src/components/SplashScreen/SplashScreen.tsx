import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Logo } from '../UI/Logo';
import styles from './SplashScreen.module.css';

export function SplashScreen() {
  const { navigateToView } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToView('welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigateToView]);

  return (
    <div className={styles.splashScreen}>
      <div className={styles.content}>
        {/* Premium Logo with Orbital Animation */}
        <Logo 
          size="xl"
          showOrbital={true}
          animated={true}
          className={styles.logoContainer}
        />

        {/* Brand Name */}
        <h1 className={styles.brandName}>
          <span className={styles.brandArmora}>ARMORA</span>
          <span className={styles.brandSecurityTransport}>Security Transport</span>
        </h1>

        {/* Tagline */}
        <p className={styles.tagline}>
          Your Personal Security Driver Team
        </p>

        {/* Loading Animation */}
        <div className={styles.loadingContainer}>
          <div className={styles.loadingBar}>
            <div className={styles.loadingProgress}></div>
          </div>
          <p className={styles.loadingText}>Securing your journey...</p>
        </div>
      </div>

      {/* Premium Background Effect */}
      <div className={styles.backgroundEffect}>
        <div className={styles.gradientOrb}></div>
        <div className={styles.gradientOrb}></div>
      </div>
    </div>
  );
}