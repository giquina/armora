import styles from './ServiceExplanation.module.css';

export function ServiceExplanation() {
  return (
    <div className={styles.serviceExplanation}>
      <div className={styles.infoIcon}>ℹ️</div>
      <div className={styles.content}>
        <h3 className={styles.title}>Professional Close Protection Service</h3>
        <p className={styles.description}>
          A licensed security officer will accompany you for safety.
          This is NOT a taxi or chauffeur service.
        </p>
        <div className={styles.howItWorks}>
          <h4 className={styles.processTitle}>How Protection Services Work:</h4>
          <ol className={styles.processList}>
            <li>Book your protection level</li>
            <li>CPO (Close Protection Officer) arrives in uniform with ID</li>
            <li>Officer stays with you for entire duration</li>
            <li>Not a taxi - this is personal security</li>
          </ol>
        </div>
        <div className={styles.trustIndicators}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>All officers SIA licensed & insured</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>Background checked & vetted</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>You'll receive officer details before arrival</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>Verify ID on arrival</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span>24/7 support line: 0800 XXX XXXX</span>
          </div>
        </div>
      </div>
    </div>
  );
}