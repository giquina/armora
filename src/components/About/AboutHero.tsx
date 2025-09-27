// Logo removed - keeping pages clean and focused
import styles from './AboutHero.module.css';

export function AboutHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* Logo container removed for cleaner interface */}

        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Elite Security Meets Premium Transport
          </h1>
          <p className={styles.heroSubtitle}>
            Over 30 Years of Private Security Excellence
          </p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>30+</div>
            <div className={styles.statLabel}>Years Experience</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>SIA</div>
            <div className={styles.statLabel}>Licensed Officers</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Protection</div>
          </div>
        </div>

        <div className={styles.heroFeatures}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🛡️</div>
            <span>Close Protection Specialists</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🚗</div>
            <span>Premium Fleet</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🤫</div>
            <span>Absolute Discretion</span>
          </div>
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className={styles.heroOverlay}></div>
    </section>
  );
}