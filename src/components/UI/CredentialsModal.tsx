import React from 'react';
import { Button } from './Button';
import styles from './CredentialsModal.module.css';

export interface CredentialInfo {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  fullTitle: string;
  description: string;
  benefits: string[];
  significance: string;
  category: string;
}

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// All credentials data in one place
const ALL_CREDENTIALS: CredentialInfo[] = [
  {
    id: 'sia',
    title: 'Government Licensed',
    subtitle: 'SIA Authority',
    icon: '🏛️',
    fullTitle: 'Security Industry Authority Licensing',
    description: 'All our drivers hold government-issued security licenses with rigorous background checks and training completed, plus ongoing compliance monitoring and renewal requirements.',
    benefits: [
      'Verified trustworthy personnel handling your transport',
      'Professional security awareness and threat assessment training',
      'Government oversight ensures consistent service standards',
      'Peace of mind knowing drivers are properly vetted'
    ],
    significance: 'Mandatory requirement for security transport services',
    category: 'Legal Requirement'
  },
  {
    id: 'homeoffice',
    title: 'Home Office Approved',
    subtitle: 'Security Standards',
    icon: '🛡️',
    fullTitle: 'Home Office Security Standards',
    description: 'Enhanced security screening following government protocols with BS 7858 security screening standards compliance and advanced background verification procedures.',
    benefits: [
      'Highest level of driver vetting beyond basic requirements',
      'Protection of your personal information and privacy',
      'Confidence in driver integrity and professionalism',
      'Government-level security clearance processes'
    ],
    significance: 'Voluntary enhanced standards for VIP protection',
    category: 'Professional Excellence'
  },
  {
    id: 'cabinet',
    title: 'Cabinet Office Verified',
    subtitle: 'VIP Protection',
    icon: '⭐',
    fullTitle: 'Cabinet Office VIP Protection Standards',
    description: 'Protocols aligned with government executive protection, advanced threat awareness and response training, and discrete professional service appropriate for high-profile clients.',
    benefits: [
      'Service standards suitable for government officials and executives',
      'Understanding of confidentiality and privacy requirements',
      'Professional conduct appropriate for sensitive situations',
      'Expertise in secure transport protocols'
    ],
    significance: 'Meeting requirements for official government transport',
    category: 'Government Level'
  },
  {
    id: 'tfl',
    title: 'TfL Licensed',
    subtitle: 'Transport for London',
    icon: '🚗',
    fullTitle: 'Transport for London Licensing',
    description: 'All drivers licensed by Transport for London authority with vehicle compliance to TfL safety and quality standards, regular inspections and ongoing compliance monitoring, plus professional driving standards and local area expertise.',
    benefits: [
      'Legal compliance for all London transport operations',
      'Guaranteed vehicle safety and maintenance standards',
      'Expert knowledge of London routes and traffic patterns',
      'Consumer protection under TfL regulations'
    ],
    significance: 'Mandatory licensing for all private hire operations in London',
    category: 'Legal Requirement'
  }
];

export function CredentialsModal({ isOpen, onClose }: CredentialsModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className={styles.modal}>
        {/* Modal Header */}
        <header className={styles.modalHeader}>
          <div className={styles.modalTitleSection}>
            <span className={styles.modalIcon} role="img" aria-label="Security Credentials">
              🛡️
            </span>
            <div className={styles.modalTitleGroup}>
              <h2 id="modal-title" className={styles.modalTitle}>
                Armora Security Credentials
              </h2>
              <span className={styles.modalSubtitle}>
                Comprehensive Security Standards & Licensing
              </span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        {/* Modal Content */}
        <main className={styles.modalContent}>
          <div className={styles.introSection}>
            <p className={styles.introText}>
              Armora maintains the highest security standards through comprehensive licensing and certification. 
              Our credentials ensure your safety, privacy, and professional service quality.
            </p>
          </div>

          <div className={styles.credentialsGrid}>
            {ALL_CREDENTIALS.map((credential, index) => (
              <div key={credential.id} className={styles.credentialCard}>
                {/* Credential Header */}
                <div className={styles.credentialHeader}>
                  <span className={styles.credentialIcon} role="img" aria-label={credential.title}>
                    {credential.icon}
                  </span>
                  <div className={styles.credentialTitleGroup}>
                    <h3 className={styles.credentialTitle}>
                      {credential.fullTitle}
                    </h3>
                    <span className={styles.credentialCategory}>
                      {credential.category}
                    </span>
                  </div>
                </div>

                {/* Credential Description */}
                <div className={styles.credentialContent}>
                  <p className={styles.credentialDescription}>
                    {credential.description}
                  </p>

                  <div className={styles.benefitsSection}>
                    <h4 className={styles.benefitsTitle}>Key Benefits:</h4>
                    <ul className={styles.benefitsList}>
                      {credential.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className={styles.benefitItem}>
                          <span className={styles.benefitIcon}>✓</span>
                          <span className={styles.benefitText}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.significanceBadge}>
                    <span className={styles.significanceText}>
                      {credential.significance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Your Security Guarantee</h3>
              <p className={styles.summaryText}>
                Every Armora driver meets all four certification standards, ensuring government-level security, 
                legal compliance, and professional excellence for your transport needs.
              </p>
            </div>
          </div>
        </main>

        {/* Modal Footer */}
        <footer className={styles.modalFooter}>
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            onClick={onClose}
            className={styles.ctaButton}
          >
            Book with Confidence
          </Button>
        </footer>
      </div>
    </div>
  );
}