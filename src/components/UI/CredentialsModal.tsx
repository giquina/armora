import { FC } from 'react';
import { Button } from './Button';
import CredentialIcons from './CredentialIcons';
import styles from './CredentialsModal.module.css';

export interface CredentialInfo {
  id: string;
  title: string;
  subtitle: string;
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
    title: 'Security Industry Authority',
    subtitle: 'SIA Licensed',
    fullTitle: 'Security Industry Authority (SIA) Licensing',
    description: 'Government-mandated licensing for all security personnel with enhanced security screening following government protocols and criminal background verification.',
    benefits: [
      'Enhanced security screening following government protocols with criminal background verification',
      'Professional security awareness and advanced threat assessment training',
      'Ongoing compliance monitoring with government oversight standards',
      'BS 7858 security screening standards with rigorous background checks'
    ],
    significance: 'SIA certified close protection operatives, not just Protection Officers',
    category: 'Government Licensing'
  },
  {
    id: 'homeoffice',
    title: 'Home Office Approved',
    subtitle: 'Security Standards',
    fullTitle: 'Home Office Approved Security Standards',
    description: 'BS 7858 security screening standards with enhanced background verification procedures beyond standard licensing requirements.',
    benefits: [
      'Advanced vetting procedures beyond standard licensing requirements',
      'Government-level security clearance processes with rigorous background verification',
      'Enhanced standards for VIP and executive protection services',
      'Professional security solutions tailored to your specific needs'
    ],
    significance: 'Professional security solutions tailored to your specific needs',
    category: 'Government Standards'
  },
  {
    id: 'cabinet',
    title: 'Cabinet Office Standards',
    subtitle: 'VIP Protection',
    fullTitle: 'Cabinet Office VIP Protection Standards',
    description: 'Government executive protection protocols and security procedures with advanced threat awareness training and discrete professional conduct.',
    benefits: [
      'Government executive protection protocols and security procedures',
      'Advanced threat awareness training and discrete professional conduct',
      'Specialist training in VIP transport and threat assessment',
      'Service standards suitable for government officials and executives'
    ],
    significance: '24/7 On-Demand Close Protection services available around the clock',
    category: 'Executive Protection'
  },
  {
    id: 'tfl',
    title: 'Transport for London',
    subtitle: 'TfL Licensed',
    fullTitle: 'Transport for London (TfL) Licensed Operations',
    description: 'Fully licensed private hire operations with commercial vehicle compliance and regular safety inspections under Transport for London regulatory oversight.',
    benefits: [
      'Legal compliance for all London private hire operations with TfL oversight',
      'Regular safety inspections and regulatory compliance monitoring',
      'Professional transport operations meeting all legal requirements',
      'Expert knowledge of London routes with advanced traffic management'
    ],
    significance: 'Professional security transport services available around the clock',
    category: 'Transport Licensing'
  },
  {
    id: 'phv',
    title: 'Private Hire Vehicle',
    subtitle: 'PHV Licensed',
    fullTitle: 'Private Hire Vehicle (PHV) Licensed Fleet',
    description: 'Commercial Principal vehicle licensing with comprehensive insurance coverage and professional maintenance standards for all fleet vehicles.',
    benefits: [
      'Commercial Principal vehicle licensing with comprehensive insurance coverage',
      'Professional maintenance standards for reliability and operational safety',
      'Regular safety inspections ensuring roadworthiness and regulatory compliance',
      'Advanced fleet management with professional service standards'
    ],
    significance: 'Commercial vehicle compliance with professional service standards',
    category: 'Vehicle Licensing'
  },
  {
    id: 'cpo',
    title: 'Close Protection Officers',
    subtitle: 'CPO Certified',
    fullTitle: 'Close Protection Officers (CPO) Certified Team',
    description: 'Level 3 Close Protection Officer certification with specialized security training and advanced situational awareness protocols.',
    benefits: [
      'Level 3 Close Protection Officer certification with specialized security training',
      'Advanced situational awareness and personal protection protocols',
      'Professional close protection expertise with discrete service delivery',
      'Rapid response capabilities and security protocol implementation'
    ],
    significance: 'Advanced personal protection protocols with specialized training',
    category: 'Protection Certification'
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
              Armora operates under comprehensive government licensing and security industry certifications. 
              Our multi-level compliance framework ensures professional security protocols, regulatory adherence, 
              and advanced personal protection capabilities for executive transport services.
            </p>
          </div>

          <div className={styles.credentialsGrid}>
            {ALL_CREDENTIALS.map((credential, index) => (
              <div key={credential.id} className={styles.credentialCard}>
                {/* Credential Header */}
                <div className={styles.credentialHeader}>
                  <div className={styles.credentialIcon}>
                    <CredentialIcons 
                      type={credential.id as 'sia' | 'homeoffice' | 'cabinet' | 'tfl' | 'phv' | 'cpo'} 
                      className={styles.credentialLogo}
                    />
                  </div>
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
              <h3 className={styles.summaryTitle}>Comprehensive Security Standards Compliance</h3>
              <p className={styles.summaryText}>
                All Armora security operatives and fleet vehicles maintain full compliance with these six government 
                certification standards, ensuring professional security protocols, regulatory compliance, and advanced 
                personal protection capabilities for executive transport services.
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
            Proceed with Professional Security Transport
          </Button>
        </footer>
      </div>
    </div>
  );
}