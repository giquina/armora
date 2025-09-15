import React from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './ServicesPage.module.css';

export function ServicesPage() {
  const { navigateToView } = useApp();

  const handleTransportBooking = () => {
    navigateToView('booking');
  };

  const handleVenueSecurityBooking = () => {
    navigateToView('venue-protection-welcome');
  };

  return (
    <div className={styles.servicesContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.subtitle}>
          Choose how we can protect you
        </p>
      </div>

      {/* Transport Security Services */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🚗 Transport Security Services</h2>
        <p className={styles.sectionSubtitle}>SIA certified Close Protection Officers with military/police backgrounds</p>
      </div>

      <div className={styles.servicesGrid}>
        {/* Standard Protection */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            </svg>
          </div>
          <div className={styles.serviceHeader}>
            <h3 className={styles.serviceTitle}>Standard Protection</h3>
            <div className={styles.serviceBadge}>Most Popular</div>
          </div>
          <div className={styles.serviceContent}>
            <p className={styles.serviceDescription}>
              SIA Level 2 certified drivers in premium vehicles with GPS tracking, emergency protocols, and secure communication systems.
            </p>
            <div className={styles.serviceFeatures}>
              <div className={styles.feature}>✓ SIA Level 2 certified driver</div>
              <div className={styles.feature}>✓ Premium vehicle (BMW 5 Series)</div>
              <div className={styles.feature}>✓ Real-time GPS tracking</div>
              <div className={styles.feature}>✓ Emergency response protocols</div>
            </div>
            <div className={styles.servicePricing}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.price}>£45/hour</span>
            </div>
          </div>
          <button className={styles.serviceButton} onClick={handleTransportBooking}>
            Book Standard Protection
          </button>
        </div>

        {/* Executive Security */}
        <div className={`${styles.serviceCard} ${styles.premiumCard}`}>
          <div className={styles.serviceIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 11-3-3 3-3"/>
              <path d="m19 8h3"/>
            </svg>
          </div>
          <div className={styles.serviceHeader}>
            <h3 className={styles.serviceTitle}>Executive Security</h3>
            <div className={styles.serviceBadge}>Premium</div>
          </div>
          <div className={styles.serviceContent}>
            <p className={styles.serviceDescription}>
              SIA Level 3 Close Protection Officers with special forces training in luxury armored vehicles with advanced security systems.
            </p>
            <div className={styles.serviceFeatures}>
              <div className={styles.feature}>✓ SIA Level 3 Close Protection Officer</div>
              <div className={styles.feature}>✓ Armored luxury vehicle</div>
              <div className={styles.feature}>✓ Route security assessment</div>
              <div className={styles.feature}>✓ Counter-surveillance protocols</div>
            </div>
            <div className={styles.servicePricing}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.price}>£75/hour</span>
            </div>
          </div>
          <button className={styles.serviceButton} onClick={handleTransportBooking}>
            Book Executive Security
          </button>
        </div>

        {/* Shadow Protection */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className={styles.serviceHeader}>
            <h3 className={styles.serviceTitle}>Shadow Protection</h3>
            <div className={styles.serviceBadge}>Discrete</div>
          </div>
          <div className={styles.serviceContent}>
            <p className={styles.serviceDescription}>
              Covert protection specialists in unmarked vehicles providing discrete security without compromising your privacy or routine.
            </p>
            <div className={styles.serviceFeatures}>
              <div className={styles.feature}>✓ Covert protection specialist</div>
              <div className={styles.feature}>✓ Unmarked security vehicles</div>
              <div className={styles.feature}>✓ Discrete following protocols</div>
              <div className={styles.feature}>✓ Silent emergency response</div>
            </div>
            <div className={styles.servicePricing}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.price}>£65/hour</span>
            </div>
          </div>
          <button className={styles.serviceButton} onClick={handleTransportBooking}>
            Book Shadow Protection
          </button>
        </div>
      </div>

      {/* Event Security Services */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🏛️ Event Security Services</h2>
        <p className={styles.sectionSubtitle}>Professional Close Protection Officers for weddings, corporate events, and private celebrations</p>
      </div>

      <div className={styles.servicesGrid}>
        {/* Wedding & Event Security */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div className={styles.serviceHeader}>
            <h3 className={styles.serviceTitle}>Wedding & Event Security</h3>
            <div className={styles.serviceBadge}>New</div>
          </div>
          <div className={styles.serviceContent}>
            <p className={styles.serviceDescription}>
              SIA licensed Close Protection Officers providing discrete security for weddings, receptions, and private celebrations.
            </p>
            <div className={styles.serviceFeatures}>
              <div className={styles.feature}>✓ Discrete plainclothes officers</div>
              <div className={styles.feature}>✓ Venue security assessment</div>
              <div className={styles.feature}>✓ Guest safety coordination</div>
              <div className={styles.feature}>✓ Emergency response planning</div>
            </div>
            <div className={styles.servicePricing}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.price}>£500/day</span>
            </div>
          </div>
          <button className={styles.serviceButton} onClick={handleVenueSecurityBooking}>
            Book Event Security
          </button>
        </div>

        {/* Corporate Protection */}
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4v18"/>
              <path d="M19 21V11l-6-4"/>
            </svg>
          </div>
          <div className={styles.serviceHeader}>
            <h3 className={styles.serviceTitle}>Corporate Protection</h3>
            <div className={styles.serviceBadge}>Business</div>
          </div>
          <div className={styles.serviceContent}>
            <p className={styles.serviceDescription}>
              Executive protection for corporate events, conferences, and high-profile business meetings with threat assessment protocols.
            </p>
            <div className={styles.serviceFeatures}>
              <div className={styles.feature}>✓ Executive protection specialists</div>
              <div className={styles.feature}>✓ Corporate threat assessment</div>
              <div className={styles.feature}>✓ VIP escort services</div>
              <div className={styles.feature}>✓ Conference security coordination</div>
            </div>
            <div className={styles.servicePricing}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.price}>£750/day</span>
            </div>
          </div>
          <button className={styles.serviceButton} onClick={handleVenueSecurityBooking}>
            Book Corporate Protection
          </button>
        </div>

        {/* Coming Soon Services */}
        <div className={`${styles.serviceCard} ${styles.comingSoon}`}>
          <div className={styles.serviceIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className={styles.serviceHeader}>
            <h3 className={styles.serviceTitle}>Personal Protection</h3>
            <div className={styles.serviceBadge}>Q2 2025</div>
          </div>
          <div className={styles.serviceContent}>
            <p className={styles.serviceDescription}>
              24/7 personal bodyguard services, residential security, and international travel protection launching Q2 2025.
            </p>
            <div className={styles.serviceFeatures}>
              <div className={styles.feature}>⏳ Personal bodyguard services</div>
              <div className={styles.feature}>⏳ Residential security teams</div>
              <div className={styles.feature}>⏳ International travel protection</div>
              <div className={styles.feature}>⏳ 24/7 security coordination</div>
            </div>
            <div className={styles.servicePricing}>
              <span className={styles.priceLabel}>Coming</span>
              <span className={styles.price}>Q2 2025</span>
            </div>
          </div>
          <button className={`${styles.serviceButton} ${styles.disabledButton}`} disabled>
            Get Early Access
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h4 className={styles.infoTitle}>Why Choose ARMORA?</h4>
          <ul className={styles.infoList}>
            <li>🎯 SIA Licensed & Certified Officers</li>
            <li>🔒 Military & Police Backgrounds</li>
            <li>📱 Real-time Tracking & Updates</li>
            <li>⚡ 24/7 Emergency Response</li>
            <li>🛡️ Comprehensive Insurance Coverage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}