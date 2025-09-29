import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { WeddingEventSecurity } from '../WeddingEventSecurity';
import { ServiceCard } from './ServiceCard';
import { ServiceComparisonTable } from './ServiceComparisonTable';
import { TrustBadges } from './TrustBadges';
import { SERVICES_DATA, getRecommendedService } from '../../data/servicesData';
import styles from './ServicesPage.module.css';

export function ServicesPage() {
  const { state, navigateToView, startProtectionRequest } = useApp();
  const { questionnaireData } = state;
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Memoize expensive calculations
  const recommendedService = useMemo(() => {
    return getRecommendedService(questionnaireData);
  }, [questionnaireData]);

  const handleProtectionRequest = useCallback((serviceId: string) => {
    // Navigate to protection request with preselected service
    startProtectionRequest(serviceId as 'essential' | 'executive' | 'shadow' | 'client-vehicle', 'services');
  }, [startProtectionRequest]);

  const handleServiceExpand = useCallback((serviceId: string) => {
    // Only one service can be expanded at a time
    setExpandedService(current => current === serviceId ? null : serviceId);
  }, []);

  const handleShowComparison = useCallback(() => {
    setShowComparison(prev => !prev);
  }, []);

  return (
    <div className={styles.servicesContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Our Protection Services</h1>
          <p className={styles.heroSubtitle}>SIA-Licensed Close Protection Officers • Executive Security Specialists</p>

          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>⭐</span>
              <span className={styles.trustNumber}>4.9</span>
              <span className={styles.trustLabel}>CLIENT RATING</span>
            </div>
            <div className={styles.trustDivider}></div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🛡️</span>
              <span className={styles.trustNumber}>3,741+</span>
              <span className={styles.trustLabel}>ASSIGNMENTS<br/>COMPLETED</span>
            </div>
            <div className={styles.trustDivider}></div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>⚡</span>
              <span className={styles.trustNumber}>&lt;10min</span>
              <span className={styles.trustLabel}>RESPONSE TIME</span>
            </div>
            <div className={styles.trustDivider}></div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔒</span>
              <span className={styles.trustNumber}>100%</span>
              <span className={styles.trustLabel}>SIA LICENSED</span>
            </div>
          </div>

          {recommendedService && (
            <div className={styles.personalizedBadge}>
              🎯 {SERVICES_DATA.find(s => s.id === recommendedService)?.name} Protection recommended based on your security profile
            </div>
          )}

          {/* Service Comparison Toggle */}
          <button
            className={styles.comparisonToggle}
            onClick={handleShowComparison}
          >
            📊 {showComparison ? 'Hide Comparison' : 'Compare Protection Levels'}
          </button>
        </div>
      </div>

      {/* Interactive Components */}
      {showComparison && <ServiceComparisonTable />}

      {/* Services Grid - All 5 Services with Enhanced Features */}
      <div className={styles.servicesGrid}>
        {SERVICES_DATA.map((service) => (
          <div key={service.id} className={styles.serviceCardWrapper}>
            <ServiceCard
              service={service}
              isRecommended={recommendedService === service.id}
              onExpand={handleServiceExpand}
              onBook={handleProtectionRequest}
              autoCollapse={true}
              expandedService={expandedService}
            />


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