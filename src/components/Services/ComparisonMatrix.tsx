import styles from './ComparisonMatrix.module.css';

interface ComparisonItem {
  feature: string;
  traditional: string;
  armora: string;
  isAdvantage?: boolean;
}

const comparisonData: ComparisonItem[] = [
  {
    feature: 'Minimum protection assignment',
    traditional: '12 hours',
    armora: '2 hours',
    isAdvantage: true
  },
  {
    feature: 'Pricing model',
    traditional: 'Daily only',
    armora: 'Hourly',
    isAdvantage: true
  },
  {
    feature: 'Essential rate',
    traditional: 'Not offered',
    armora: '£50/hr',
    isAdvantage: true
  },
  {
    feature: 'Flexibility',
    traditional: 'None',
    armora: 'Total',
    isAdvantage: true
  },
  {
    feature: 'Assignment changes',
    traditional: 'Penalties',
    armora: 'Flexible',
    isAdvantage: true
  },
  {
    feature: 'Technology',
    traditional: 'Phone only',
    armora: 'App-based',
    isAdvantage: true
  },
  {
    feature: 'Transparency',
    traditional: 'Quote only',
    armora: 'Instant pricing',
    isAdvantage: true
  },
  {
    feature: 'Vehicle options',
    traditional: 'Limited fleet',
    armora: 'Multiple tiers + your vehicle',
    isAdvantage: true
  },
  {
    feature: 'Officer credentials',
    traditional: 'SIA Licensed',
    armora: 'SIA Licensed + Enhanced training',
    isAdvantage: false
  },
  {
    feature: 'Real-time tracking',
    traditional: 'Basic',
    armora: 'Advanced + Live updates',
    isAdvantage: true
  }
];

export function ComparisonMatrix() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>The Armora Difference</h2>
        <p className={styles.subtitle}>
          Professional protection shouldn't require corporate budgets or celebrity status
        </p>
      </div>

      <div className={styles.matrix}>
        <div className={styles.tableHeader}>
          <div className={styles.featureColumn}>Feature</div>
          <div className={styles.traditionalColumn}>Traditional Security</div>
          <div className={styles.armoraColumn}>Armora</div>
        </div>

        {comparisonData.map((item, index) => (
          <div
            key={index}
            className={`${styles.row} ${item.isAdvantage ? styles.advantageRow : ''}`}
          >
            <div className={styles.feature}>
              {item.feature}
            </div>
            <div className={styles.traditional}>
              {item.traditional}
            </div>
            <div className={styles.armora}>
              {item.isAdvantage && <span className={styles.checkmark}>✓</span>}
              {item.armora}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.callout}>
        <div className={styles.calloutContent}>
          <h3 className={styles.calloutTitle}>Ready to Experience the Difference?</h3>
          <p className={styles.calloutText}>
            Join thousands of professionals who've discovered flexible, transparent protection
          </p>
          <div className={styles.calloutActions}>
            <button className={styles.primaryButton}>Request CPO Now</button>
            <button className={styles.secondaryButton}>Calculate Your Journey</button>
          </div>
        </div>
      </div>

      <div className={styles.testimonials}>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonial}>
            <div className={styles.quote}>
              "Finally, security that makes sense. 2 hours when I need 2 hours, not 12."
            </div>
            <div className={styles.author}>- Sarah K., Tech Executive</div>
          </div>
          <div className={styles.testimonial}>
            <div className={styles.quote}>
              "The app shows exactly what I'm paying for. No hidden fees, no surprises."
            </div>
            <div className={styles.author}>- Michael R., Investment Manager</div>
          </div>
          <div className={styles.testimonial}>
            <div className={styles.quote}>
              "Traditional firms wanted £600 minimum. Armora charged £180 for what I actually used."
            </div>
            <div className={styles.author}>- Emma T., Legal Counsel</div>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>67%</div>
            <div className={styles.statLabel}>Average savings vs traditional</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>4.8★</div>
            <div className={styles.statLabel}>Customer satisfaction</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>2-10min</div>
            <div className={styles.statLabel}>Assignment time</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>5,000+</div>
            <div className={styles.statLabel}>Successful assignments</div>
          </div>
        </div>
      </div>
    </div>
  );
}