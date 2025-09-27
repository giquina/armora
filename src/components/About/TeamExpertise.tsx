import styles from './TeamExpertise.module.css';

interface ExpertiseItem {
  number: string;
  label: string;
  description: string;
  icon: string;
}

const expertiseData: ExpertiseItem[] = [
  {
    number: '30+',
    label: 'Years Experience',
    description: 'Deep roots in private security sector',
    icon: '🎖️'
  },
  {
    number: '24/7',
    label: 'Availability',
    description: 'Round-the-clock protection services',
    icon: '⏰'
  },
  {
    number: '100%',
    label: 'Discretion',
    description: 'Absolute confidentiality guaranteed',
    icon: '🤐'
  },
  {
    number: 'SIA',
    label: 'Licensed',
    description: 'All officers fully certified',
    icon: '🛡️'
  },
  {
    number: 'Level 3',
    label: 'CP Officers',
    description: 'Close Protection specialists on staff',
    icon: '👨‍💼'
  },
  {
    number: 'Special Forces',
    label: 'Training',
    description: 'Military-grade expertise available',
    icon: '🎯'
  }
];

const certifications = [
  {
    title: 'SIA Level 2 Security',
    description: 'Door Supervision & Security Guarding',
    all: true
  },
  {
    title: 'SIA Level 3 Close Protection',
    description: 'VIP & Executive Protection',
    selective: true
  },
  {
    title: 'Advanced Driving',
    description: 'Defensive & Evasive Techniques',
    all: true
  },
  {
    title: 'First Aid Certified',
    description: 'Medical Response Training',
    all: true
  },
  {
    title: 'Security Cleared',
    description: 'Enhanced background checks',
    selective: true
  }
];

export function TeamExpertise() {
  return (
    <section className={styles.expertiseSection}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Our Team Expertise</h2>
        <p className={styles.sectionDescription}>
          Every Close Protection Officer on our team brings professional security experience,
          continuous training, and unwavering commitment to client safety.
        </p>

        {/* Expertise Grid */}
        <div className={styles.expertiseGrid}>
          {expertiseData.map((item, index) => (
            <div key={index} className={styles.expertiseItem}>
              <div className={styles.expertiseIcon}>{item.icon}</div>
              <div className={styles.expertiseNumber}>{item.number}</div>
              <div className={styles.expertiseLabel}>{item.label}</div>
              <div className={styles.expertiseDescription}>{item.description}</div>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className={styles.certificationsSection}>
          <h3 className={styles.certificationsTitle}>Professional Certifications</h3>
          <div className={styles.certificationsList}>
            {certifications.map((cert, index) => (
              <div key={index} className={styles.certificationItem}>
                <div className={styles.certificationHeader}>
                  <h4 className={styles.certificationName}>{cert.title}</h4>
                  <span className={styles.certificationBadge}>
                    {cert.all ? '✓ All Officers' : '✓ Selected Officers'}
                  </span>
                </div>
                <p className={styles.certificationDescription}>{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Training Philosophy */}
        <div className={styles.philosophySection}>
          <div className={styles.philosophyContent}>
            <h3 className={styles.philosophyTitle}>Our Training Philosophy</h3>
            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyItem}>
                <span className={styles.philosophyIcon}>🎯</span>
                <h4 className={styles.philosophyItemTitle}>Continuous Development</h4>
                <p className={styles.philosophyText}>
                  Regular training updates ensure our team stays current with evolving security threats
                  and protection techniques.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <span className={styles.philosophyIcon}>🤝</span>
                <h4 className={styles.philosophyItemTitle}>Client-Focused Approach</h4>
                <p className={styles.philosophyText}>
                  Every interaction is designed to provide seamless, professional service while
                  maintaining the highest security standards.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <span className={styles.philosophyIcon}>🔒</span>
                <h4 className={styles.philosophyItemTitle}>Discretion & Professionalism</h4>
                <p className={styles.philosophyText}>
                  Our officers are trained to blend security expertise with impeccable professional
                  conduct and absolute discretion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}