import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useBooking, SERVICE_OPTIONS } from '../../contexts/BookingContext';
// import { MapView } from './MapView';
// import { ServiceCard } from './ServiceCard';
// import { BottomSheet } from './BottomSheet';
import styles from './ServiceSelection.module.css';

export function ServiceSelection() {
  const { navigateToView } = useApp();
  const { bookingData, setSelectedService } = useBooking();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const selectedService = SERVICE_OPTIONS.find(s => s.id === serviceId);
    if (selectedService) {
      setSelectedService(selectedService);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedServiceId && bookingData.selectedService) {
      setIsConfirming(true);
      // Add a slight delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 800));
      navigateToView('booking');
    }
  };

  const handleBackPress = () => {
    navigateToView('home');
  };

  if (!bookingData.pickup || !bookingData.destination) {
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
          Route: {bookingData.pickup?.address} → {bookingData.destination?.address}
        </div>
      </div>

      {/* Service Options in Bottom Sheet Style */}
      <div className={`${styles.serviceOptions} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        <h2 className={styles.sectionTitle}>Choose Your Service</h2>

        {/* Service Cards */}
        <div className={styles.serviceCardsContainer}>
          {SERVICE_OPTIONS.map((service, index) => (
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
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceName}>
                  {service.name}
                </h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                <div className={styles.serviceFeatures}>
                  {service.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className={styles.feature}>• {feature}</div>
                  ))}
                </div>
              </div>
              <div className={styles.vehicleSection}>
                <div className={styles.vehicleIcon}>
                  {service.vehicleType === 'Tesla Model S' ? '⚡' :
                   service.vehicleType === 'BMW X5' ? '🚙' : '🚗'}
                </div>
                <div className={styles.vehicleType}>
                  {service.vehicleType}
                </div>
              </div>
              <div className={styles.priceSection}>
                <div className={styles.price}>
                  £{service.price.toFixed(2)}
                </div>
                <div className={styles.eta}>
                  <span>🕒</span>
                  {service.eta}
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
                'Confirm Booking'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}