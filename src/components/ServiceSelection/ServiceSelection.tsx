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

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const selectedService = SERVICE_OPTIONS.find(s => s.id === serviceId);
    if (selectedService) {
      setSelectedService(selectedService);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedServiceId && bookingData.selectedService) {
      // Navigate to booking confirmation
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {SERVICE_OPTIONS.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              style={{
                padding: 'var(--space-lg)',
                background: selectedServiceId === service.id ?
                  'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 215, 0, 0.04))' :
                  'var(--bg-secondary)',
                border: selectedServiceId === service.id ?
                  '2px solid var(--accent-primary)' :
                  '2px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 'var(--font-base)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 var(--space-xs) 0'
                }}>
                  {service.name}
                </h3>
                <p style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--text-secondary)',
                  margin: '0 0 var(--space-sm) 0'
                }}>
                  {service.description}
                </p>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-tertiary)'
                }}>
                  {service.features.slice(0, 2).map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '80px'
              }}>
                <div style={{ fontSize: '32px', marginBottom: 'var(--space-xs)' }}>
                  {service.vehicleType === 'Tesla Model S' ? '⚡' :
                   service.vehicleType === 'BMW X5' ? '🚙' : '🚗'}
                </div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-primary)',
                  textAlign: 'center'
                }}>
                  {service.vehicleType}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                minWidth: '80px'
              }}>
                <div style={{
                  fontSize: 'var(--font-lg)',
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }}>
                  £{service.price.toFixed(2)}
                </div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: 'var(--space-xs)'
                }}>
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
              className={styles.confirmButton}
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}