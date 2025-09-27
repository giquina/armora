import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useProtectionAssignment, ServiceOption } from '../../contexts/ProtectionAssignmentContext';
import { STANDARDIZED_SERVICES, getAllServices } from '../../data/standardizedServices';
// import { MapView } from './MapView';
// import { ServiceCard } from './ServiceCard';
// import { BottomSheet } from './BottomSheet';
import styles from './ServiceSelection.module.css';

export function ServiceSelection() {
  const { navigateToView } = useApp();
  const { protectionAssignmentData, setSelectedService } = useProtectionAssignment();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExpanded] = useState(true);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const standardizedService = STANDARDIZED_SERVICES[serviceId];
    if (standardizedService) {
      // Convert standardized service to context format
      const serviceOption: ServiceOption = {
        id: standardizedService.id,
        name: standardizedService.name,
        description: standardizedService.description,
        price: standardizedService.price,
        eta: '3-5 min', // Default ETA
        features: standardizedService.features.map(f => f.text),
        vehicleType: standardizedService.vehicleType === 'client' ? 'Client Vehicle' : 'BMW X5',
        securityLevel: standardizedService.riskLevel,
        badge: standardizedService.badge,
        isRecommended: standardizedService.popularityRank <= 2
      };
      setSelectedService(serviceOption);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedServiceId && protectionAssignmentData.selectedService) {
      setIsConfirming(true);
      // Add a slight delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 800));
      navigateToView('protection-request');
    }
  };


  if (!protectionAssignmentData.commencementPoint || !protectionAssignmentData.secureDestination) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Setting up your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Map Section - Placeholder for now */}
      <div className={styles.mapSection}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Route: {protectionAssignmentData.commencementPoint?.address} → {protectionAssignmentData.secureDestination?.address}
        </div>
      </div>

      {/* Service Options in Bottom Sheet Style */}
      <div className={`${styles.serviceOptions} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        <h2 className={styles.sectionTitle}>Choose Your Service</h2>

        {/* Service Cards */}
        <div className={styles.serviceCardsContainer}>
          {getAllServices().sort((a, b) => a.popularityRank - b.popularityRank).map((service, index) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`${styles.serviceCard} ${
                selectedServiceId === service.id ? styles.selected : ''
              }`}
              style={{
                animationDelay: `${0.5 + index * 0.1}s`
              }}
            >
              {/* Most Popular Badge */}
              {service.badge && (
                <div className={styles.popularBadge}>
                  <span className={styles.badgeIcon}>🏆</span>
                  <span className={styles.badgeText}>{service.badge}</span>
                </div>
              )}

              <div className={styles.serviceContent}>
                <h3 className={styles.serviceName}>
                  {service.name}
                </h3>
                <p className={styles.serviceDescription}>
                  {service.tagline}
                </p>

                {/* Response Time */}
                <div className={styles.responseTime}>
                  <span className={styles.responseIcon}>⚡</span>
                  <span className={styles.responseText}>15-20 min response</span>
                </div>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                  <span>✓ SIA Licensed</span>
                  <span>✓ £10M Insurance</span>
                  <span>✓ 4.9★ Rating</span>
                </div>

                <div className={styles.serviceFeatures}>
                  {service.features.slice(0, 2).map((feature, featureIndex) => (
                    <div key={featureIndex} className={styles.feature}>
                      {feature.icon} {feature.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.vehicleSection}>
                <div className={styles.vehicleIcon}>
                  {service.vehicleType === 'client' ? '🔑' :
                   service.riskLevel === 'high' ? '🥷' :
                   service.riskLevel === 'medium' ? '👔' : '🛡️'}
                </div>
                <div className={styles.vehicleType}>
                  {service.vehicleType === 'client' ? 'Your Vehicle' : 'Company Vehicle'}
                </div>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.price}>
                  £{service.hourlyRate}
                </div>
                <div className={styles.priceUnit}>/hour</div>
                <div className={styles.eta}>
                  <span>🕒</span>
                  3-5 min
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        {selectedServiceId && (
          <div className={styles.actionBar}>
            <button
              className={`${styles.confirmButton} ${isConfirming ? styles.loading : ''}`}
              onClick={handleConfirmBooking}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Processing...
                </>
              ) : (
                'Confirm Assignment'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}