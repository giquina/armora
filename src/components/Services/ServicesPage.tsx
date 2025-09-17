import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { BackButton } from '../UI/BackButton';
import { WeddingEventSecurity } from '../WeddingEventSecurity';
import { ServiceCard } from './ServiceCard';
import { SERVICES_DATA, getRecommendedService } from '../../data/servicesData';
import styles from './ServicesPage.module.css';

export function ServicesPage() {
  const { state, navigateToView, handleBack } = useApp();
  const { questionnaireData } = state;
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const handleBooking = (serviceId: string) => {
    localStorage.setItem('armora_selected_service', serviceId);
    navigateToView('booking');
  };

  const handleServiceExpand = (serviceId: string) => {
    // Only one service can be expanded at a time
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const recommendedService = getRecommendedService(questionnaireData);

  return (
    <div className={styles.servicesContainer}>
      <BackButton onClick={handleBack} />
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Choose Your SafeRide Service</h1>
          <p className={styles.heroSubtitle}>Security-trained drivers for every journey - from daily commutes to executive transport</p>

          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>4.9★</span>
              <span className={styles.trustLabel}>Rating</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>3,741+</span>
              <span className={styles.trustLabel}>Secure Journeys</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>&lt;10min</span>
              <span className={styles.trustLabel}>Pickup Time</span>
            </div>
          </div>

          {recommendedService && (
            <div className={styles.personalizedBadge}>
              🚗 {SERVICES_DATA.find(s => s.id === recommendedService)?.name} - Your recommended driver service
            </div>
          )}
        </div>
      </div>

      {/* Services Grid - All 5 Services */}
      <div className={styles.servicesGrid}>
        {SERVICES_DATA.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isRecommended={recommendedService === service.id}
            onExpand={handleServiceExpand}
            onBook={handleBooking}
            autoCollapse={true}
            expandedService={expandedService}
          />
        ))}
      </div>

      {/* Progress Indicator when expanded */}
      <div className={styles.progressSection}>
        <span className={styles.serviceCount}>
          Showing {SERVICES_DATA.length} services
        </span>
      </div>

      {/* Trust Section */}
      <div className={styles.trustSection}>
        <h3 className={styles.trustTitle}>Industry Leading Standards</h3>
        <div className={styles.certificationBadges}>
          <div className={styles.certBadge}>Professionally Trained</div>
          <div className={styles.certBadge}>ISO 27001</div>
          <div className={styles.certBadge}>£10M Insured</div>
          <div className={styles.certBadge}>Military Trained</div>
        </div>
      </div>

      {/* Wedding & Event Security Section */}
      <section id="event-security" className={styles.weddingSection}>
        <WeddingEventSecurity />
      </section>
    </div>
  );
}