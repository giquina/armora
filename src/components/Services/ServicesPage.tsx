import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { WeddingEventSecurity } from '../WeddingEventSecurity';
import { ServiceCard } from './ServiceCard';
import { ServiceComparisonTable } from './ServiceComparisonTable';
import { ServicePricingCalculator } from './ServicePricingCalculator';
import { QuickToolsBar } from './QuickToolsBar';
import { LiveServiceAvailability } from './LiveServiceAvailability';
import { TrustBadges } from './TrustBadges';
import { SERVICES_DATA, getRecommendedService } from '../../data/servicesData';
import styles from './ServicesPage.module.css';

export function ServicesPage() {
  const { state, navigateToView } = useApp();
  const { questionnaireData, deviceCapabilities } = state;
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Memoize expensive calculations
  const recommendedService = useMemo(() => {
    return getRecommendedService(questionnaireData);
  }, [questionnaireData]);

  const handleBooking = useCallback((serviceId: string) => {
    localStorage.setItem('armora_selected_service', serviceId);
    navigateToView('booking');
  }, [navigateToView]);

  const handleServiceExpand = useCallback((serviceId: string) => {
    // Only one service can be expanded at a time
    setExpandedService(current => current === serviceId ? null : serviceId);
  }, []);

  const handleShowComparison = useCallback(() => {
    setShowComparison(true);
    setShowCalculator(false);
  }, []);

  const handleShowCalculator = useCallback(() => {
    setShowCalculator(true);
    setShowComparison(false);
  }, []);


  const handleShowChat = useCallback(() => {
    setShowChat(true);
    // You can implement a chat modal here
    console.log('Opening live chat...');
  }, []);

  return (
    <div className={styles.servicesContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Our Security Services</h1>
          <p className={styles.heroSubtitle}>Professional protection tailored to your needs - from everyday safety to VIP luxury</p>

          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>4.9★</span>
              <span className={styles.trustLabel}>Rating</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>3,741+</span>
              <span className={styles.trustLabel}>Safe Rides</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>&lt;10min</span>
              <span className={styles.trustLabel}>Response</span>
            </div>
          </div>

          {recommendedService && (
            <div className={styles.personalizedBadge}>
              🎯 {SERVICES_DATA.find(s => s.id === recommendedService)?.name} recommended for you
            </div>
          )}
        </div>
      </div>

      {/* Quick Tools Bar */}
      <QuickToolsBar
        onShowComparison={handleShowComparison}
        onShowCalculator={handleShowCalculator}
        onShowChat={handleShowChat}
      />

      {/* Interactive Components */}
      {showComparison && <ServiceComparisonTable />}
      {showCalculator && <ServicePricingCalculator />}

      {/* Services Grid - All 5 Services with Enhanced Features */}
      <div className={styles.servicesGrid}>
        {SERVICES_DATA.map((service) => (
          <div key={service.id} className={styles.serviceCardWrapper}>
            <ServiceCard
              service={service}
              isRecommended={recommendedService === service.id}
              onExpand={handleServiceExpand}
              onBook={handleBooking}
              autoCollapse={true}
              expandedService={expandedService}
            />

            {/* Live Availability for each service */}
            <LiveServiceAvailability serviceId={service.id} />

            {/* Trust Badges for expanded service */}
            {expandedService === service.id && (
              <TrustBadges serviceLevel={service.id} compact={false} />
            )}
          </div>
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