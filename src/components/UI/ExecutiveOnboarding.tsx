import { FC } from 'react';
import styles from './ExecutiveOnboarding.module.css';

interface TrustIndicator {
  icon: string;
  title: string;
  description: string;
  verified: boolean;
}

interface ExecutiveOnboardingProps {
  userProfile: 'executive' | 'standard' | 'high-risk';
  currentStep: number;
  totalSteps: number;
}

const ExecutiveOnboarding: FC<ExecutiveOnboardingProps> = ({
  userProfile,
  currentStep,
  totalSteps
}) => {
  const trustIndicators: TrustIndicator[] = [
    {
      icon: '🏛️',
      title: 'Government Approved',
      description: 'Fully licensed by Transport for London and Metropolitan Police',
      verified: true
    },
    {
      icon: '🛡️',
      title: 'SIA Licensed Officers',
      description: 'All security personnel hold current SIA Close Protection licenses',
      verified: true
    },
    {
      icon: '🎖️',
      title: 'Military Background',
      description: '85% of our team are ex-military with specialized training',
      verified: true
    },
    {
      icon: '💼',
      title: 'Corporate Trusted',
      description: 'Serving FTSE 100 executives and government officials',
      verified: true
    },
    {
      icon: '🔒',
      title: 'Encrypted Communications',
      description: 'End-to-end encrypted protection assignment and communication systems',
      verified: true
    },
    {
      icon: '📋',
      title: 'Full Insurance',
      description: '£10M professional indemnity and comprehensive coverage',
      verified: true
    },
    {
      icon: '🏥',
      title: 'First Aid Trained CPOs',
      description: 'All protection officers certified in priority first aid response',
      verified: true
    },
    {
      icon: '👮',
      title: 'SIA Close Protection Officers',
      description: 'Specialist bodyguard services with advanced training',
      verified: true
    }
  ];

  const getProfileSpecificContent = () => {
    switch (userProfile) {
      case 'executive':
        return {
          title: 'Executive Security Transport',
          subtitle: 'Premium protection for business leaders',
          highlights: [
            'Discreet professional service',
            'Real-time threat assessment',
            'Executive protection protocols',
            'Premium vehicle fleet'
          ]
        };
      case 'high-risk':
        return {
          title: 'Enhanced Security Solutions',
          subtitle: 'Specialized protection for high-risk scenarios',
          highlights: [
            'Advanced threat mitigation',
            'Counter-surveillance techniques',
            'Secure route planning',
            'Priority response protocols'
          ]
        };
      default:
        return {
          title: 'Professional Security Transport',
          subtitle: 'Trusted protection for peace of mind',
          highlights: [
            'Professional security officers',
            'Safe and secure transport',
            'Real-time tracking',
            'Priority support available'
          ]
        };
    }
  };

  const profileContent = getProfileSpecificContent();
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.executiveContainer}>
      {/* Progress Header */}
      <div className={styles.progressHeader}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Profile-Specific Header */}
      <div className={styles.profileHeader}>
        <h2 className={styles.profileTitle}>{profileContent.title}</h2>
        <p className={styles.profileSubtitle}>{profileContent.subtitle}</p>
      </div>

      {/* Trust Indicators Grid */}
      <div className={styles.trustGrid}>
        <h3 className={styles.sectionTitle}>Why Executives Choose Armora</h3>
        <div className={styles.indicatorGrid}>
          {trustIndicators.map((indicator, index) => (
            <div key={index} className={styles.trustIndicator}>
              <div className={styles.indicatorHeader}>
                <span className={styles.indicatorIcon}>{indicator.icon}</span>
                <div className={styles.indicatorTitle}>
                  {indicator.title}
                  {indicator.verified && (
                    <span className={styles.verifiedBadge}>✓</span>
                  )}
                </div>
              </div>
              <p className={styles.indicatorDescription}>
                {indicator.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Highlights */}
      <div className={styles.highlightsSection}>
        <h3 className={styles.sectionTitle}>Your Service Includes</h3>
        <div className={styles.highlightsList}>
          {profileContent.highlights.map((highlight, index) => (
            <div key={index} className={styles.highlight}>
              <span className={styles.checkIcon}>✓</span>
              <span className={styles.highlightText}>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Statistics */}
      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>2,847</div>
          <div className={styles.statLabel}>Executives Protected</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>99.8%</div>
          <div className={styles.statLabel}>Safety Record</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>24/7</div>
          <div className={styles.statLabel}>Support Available</div>
        </div>
      </div>

      {/* Security Assurance */}
      <div className={styles.assuranceSection}>
        <div className={styles.assuranceIcon}>🔐</div>
        <div className={styles.assuranceContent}>
          <h4 className={styles.assuranceTitle}>Your Privacy is Paramount</h4>
          <p className={styles.assuranceText}>
            All personal information is encrypted and stored securely. 
            Your travel patterns and preferences are never shared or stored 
            beyond operational requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveOnboarding;