import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import styles from './VenueProtectionWelcome.module.css';

export function VenueProtectionWelcome() {
  const { state, navigateToView } = useApp();
  const { deviceCapabilities } = state;

  const handleStartAssessment = () => {
    navigateToView('venue-security-questionnaire');
  };

  const handleLearnMore = () => {
    // Could open a modal or navigate to info page
    console.log('Learn more about venue protection services');
  };

  const handleBack = () => {
    navigateToView('home');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className={styles.headerTitle}>Professional Venue Protection Services</h1>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroIcon}>🏛️</div>
        <h2 className={styles.heroTitle}>SIA Level 3 Close Protection Officers for Your Event</h2>
        <p className={styles.heroSubtitle}>
          Complete this security assessment to receive a customized protection plan and quote
        </p>

        {/* Service Badges */}
        <div className={styles.badgeSection}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🛡️</span>
            <span className={styles.badgeText}>Licensed Officers</span>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>💷</span>
            <span className={styles.badgeText}>£2M+ Insurance</span>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🎖️</span>
            <span className={styles.badgeText}>Military Trained</span>
          </div>
        </div>
      </div>

      {/* Distinction Section */}
      <div className={styles.distinctionSection}>
        <div className={styles.distinctionCard}>
          <h3 className={styles.distinctionTitle}>
            Close Protection Officers, Not Door Supervisors
          </h3>
          <p className={styles.distinctionText}>
            Our officers are SIA Level 3 Close Protection specialists with advanced training in threat assessment,
            risk mitigation, and dignitary protection. They provide professional security that blends seamlessly
            into your event while maintaining the highest standards of safety and discretion.
          </p>
        </div>
      </div>

      {/* Service Overview */}
      <div className={styles.serviceOverview}>
        <h3 className={styles.overviewTitle}>What We Provide</h3>
        <div className={styles.serviceList}>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>👥</span>
            <div className={styles.serviceContent}>
              <h4 className={styles.serviceItemTitle}>Event Security Management</h4>
              <p className={styles.serviceItemText}>Comprehensive security planning and crowd management for your venue</p>
            </div>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>🎭</span>
            <div className={styles.serviceContent}>
              <h4 className={styles.serviceItemTitle}>VIP Protection</h4>
              <p className={styles.serviceItemText}>Discrete close protection for high-profile guests and speakers</p>
            </div>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>📋</span>
            <div className={styles.serviceContent}>
              <h4 className={styles.serviceItemTitle}>Threat Assessment</h4>
              <p className={styles.serviceItemText}>Professional venue reconnaissance and security risk evaluation</p>
            </div>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>⚡</span>
            <div className={styles.serviceContent}>
              <h4 className={styles.serviceItemTitle}>Incident Response</h4>
              <p className={styles.serviceItemText}>Coordinated response protocols and venue evacuation planning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className={styles.pricingPreview}>
        <h3 className={styles.pricingTitle}>Professional Venue Protection</h3>
        <div className={styles.pricingRange}>
          <span className={styles.priceFrom}>From £500-£1000</span>
          <span className={styles.priceUnit}>per day per officer</span>
        </div>
        <p className={styles.pricingNote}>
          Final pricing depends on venue size, threat level, and specific requirements
        </p>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          isFullWidth={deviceCapabilities.isMobile}
          onClick={handleStartAssessment}
          className={styles.startButton}
        >
          Start Security Assessment
        </Button>

        <button
          className={styles.learnMoreButton}
          onClick={handleLearnMore}
        >
          Learn More About Our Services
        </button>
      </div>

      {/* Contact Information */}
      <div className={styles.contactInfo}>
        <h4 className={styles.contactTitle}>Need Immediate Consultation?</h4>
        <p className={styles.contactText}>
          Our venue security specialists are available 24/7 for urgent requests
        </p>
        <div className={styles.contactDetails}>
          <a href="tel:+442071234567" className={styles.contactLink}>
            +44 20 7123 4567
          </a>
          <a href="mailto:venue.protection@armora.security" className={styles.contactLink}>
            venue.protection@armora.security
          </a>
        </div>
      </div>
    </div>
  );
}