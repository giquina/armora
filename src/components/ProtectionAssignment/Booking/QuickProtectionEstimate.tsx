import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { PricingCalculator } from './PricingCalculator';
import styles from './QuickProtectionEstimate.module.css';

interface ServiceOption {
  id: 'essential' | 'executive' | 'shadow';
  name: string;
  rate: number;
}

interface PriceEstimate {
  serviceLevel: string;
  estimatedDuration: number;
  estimatedDistance: number;
  protectionFee: number;
  total: number;
  secureDestination: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'essential', name: 'Essential', rate: 50 },
  { id: 'executive', name: 'Executive', rate: 75 },
  { id: 'shadow', name: 'Shadow', rate: 65 }
];

export function QuickProtectionEstimate() {
  const { navigateToView } = useApp();

  // State management
  const [secureDestination, setDestination] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceOption>(SERVICE_OPTIONS[2]); // Default to Shadow
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState('📍 Current location');
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);

  // Auto-detect user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation('📍 Current location');
        },
        (error) => {
          setUserLocation('📍 Enter Commencement Point location');
        }
      );
    } else {
      setUserLocation('📍 Enter Commencement Point location');
    }
  }, []);

  // Calculate protection fee
  const calculatePrice = async () => {
    if (!secureDestination.trim()) return;

    setIsCalculating(true);
    setShowEstimate(false);

    // Simulate API calculation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Mock calculation (in production, this would use actual maps API)
      const estimatedDistance = Math.random() * 20 + 5; // 5-25 km
      const estimatedDuration = Math.max(2, Math.ceil((estimatedDistance * 2.5 + 15) / 60)); // Minimum 2 hours

      const protectionFee = estimatedDuration * selectedService.rate;
      const vehicleFee = estimatedDistance * 2.5;
      const total = protectionFee + vehicleFee;

      const priceEstimate: PriceEstimate = {
        serviceLevel: selectedService.name,
        estimatedDuration,
        estimatedDistance: Math.round(estimatedDistance * 10) / 10,
        protectionFee: Math.round(protectionFee),
        total: Math.round(total),
        secureDestination
      };

      setEstimate(priceEstimate);
      setShowEstimate(true);

      // Analytics
      console.log('[Analytics] Quick protection price calculated', {
        secureDestination,
        serviceLevel: selectedService.id,
        estimate: priceEstimate,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Price calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle service selection
  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedService(service);
    setShowServiceDropdown(false);
    // Recalculate if estimate exists
    if (estimate) {
      calculatePrice();
    }
  };

  // Handle booking continuation
  const handleGetFullQuote = () => {
    if (estimate) {
      // Store the estimate data for the full booking flow
      localStorage.setItem('armora_quick_estimate', JSON.stringify({
        secureDestination,
        serviceLevel: selectedService.id,
        estimate
      }));
      localStorage.setItem('armora_destination', secureDestination);
      navigateToView('booking');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>IMMEDIATE PROTECTION</h3>
        <p className={styles.subtitle}>Professional officers nearby • 2 min away</p>
      </div>

      {/* Auto-detected Commencement Point location */}
      <div className={styles.commencementPointLocation}>
        <span className={styles.locationText}>{userLocation}</span>
      </div>

      {/* Destination Input */}
      <div className={styles.secureDestinationInput}>
        <input
          type="text"
          placeholder="Enter location"
          value={secureDestination}
          onChange={(e) => setDestination(e.target.value)}
          className={styles.input}
          aria-label="Where to?"
        />
      </div>

      {/* Service Selection */}
      <div className={styles.serviceSelection}>
        <button
          className={styles.serviceButton}
          onClick={() => setShowServiceDropdown(!showServiceDropdown)}
          aria-label="Change service level"
        >
          <div className={styles.serviceInfo}>
            <span className={styles.serviceName}>⚡ {selectedService.name.toUpperCase()} SERVICE - £{selectedService.rate}/hr</span>
            <span className={styles.serviceNote}>
              {selectedService.id === 'shadow' ? 'Most popular' : 'Professional protection'}
            </span>
          </div>
          <span className={styles.changeLink}>(change)</span>
        </button>

        {/* Service Dropdown */}
        {showServiceDropdown && (
          <div className={styles.serviceDropdown}>
            {SERVICE_OPTIONS.map((service) => (
              <button
                key={service.id}
                className={`${styles.serviceOption} ${selectedService.id === service.id ? styles.selected : ''}`}
                onClick={() => handleServiceSelect(service)}
              >
                <span className={styles.optionName}>{service.name}</span>
                <span className={styles.optionPrice}>£{service.rate}/hr</span>
                {service.id === 'shadow' && <span className={styles.popularBadge}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Get Price Button */}
      <button
        className={`${styles.priceButton} ${isCalculating ? styles.calculating : ''}`}
        onClick={calculatePrice}
        disabled={!secureDestination.trim() || isCalculating}
      >
        {isCalculating ? (
          <>
            <span className={styles.spinner}>⏳</span>
            Calculating...
          </>
        ) : (
          'GET PRICE NOW →'
        )}
      </button>

      {/* Enhanced Pricing Calculator */}
      {secureDestination && (
        <div className={styles.pricingContainer}>
          <PricingCalculator
            secureDestination={secureDestination}
            serviceLevel={selectedService.id as 'essential' | 'executive' | 'shadow' | 'client-vehicle'}
            autoCalculate={true}
            showMembershipCTA={true}
            isCalculating={isCalculating}
          />

          {!isCalculating && (
            <button
              className={styles.fullQuoteButton}
              onClick={handleGetFullQuote}
            >
              Complete Protection Booking →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuickProtectionEstimate;