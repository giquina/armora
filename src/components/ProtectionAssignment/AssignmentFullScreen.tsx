import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ServiceLevel, LocationData, AssignmentContext } from '../../types';
import { PaymentIntegration } from './PaymentIntegration';
import { AssignmentSuccess } from './AssignmentSuccess';
import styles from './AssignmentFullScreen.module.css';

interface AssignmentFullScreenProps {
  context?: AssignmentContext;
  onClose: () => void;
}

interface ServiceOption {
  id: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
  popular?: boolean;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'essential',
    name: 'Essential Protection',
    price: '£50/hour',
    description: 'Professional protection for everyday security',
    icon: '🛡️',
    features: ['SIA-licensed officers', 'Real-time tracking', '24/7 support'],
    popular: true
  },
  {
    id: 'executive',
    name: 'Executive Protection',
    price: '£75/hour',
    description: 'Premium security for high-profile clients',
    icon: '👔',
    features: ['Advanced threat assessment', 'Discrete surveillance', 'Emergency protocols']
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    price: '£65/hour',
    description: 'Special Forces trained, covert protection specialists',
    icon: '🕴️',
    features: ['Military-grade training', 'Covert operations', 'Counter-surveillance']
  },
  {
    id: 'client-vehicle',
    name: 'Client Vehicle Service',
    price: '£55/hour',
    description: 'Security-trained Protection Officer for your vehicle',
    icon: '🔑',
    features: ['Your vehicle', 'No mileage charges', 'Enhanced privacy']
  }
];

const AIRPORT_LOCATIONS = [
  { name: 'London Heathrow Airport', address: 'Heathrow Airport, Hounslow TW6 1AP' },
  { name: 'London Gatwick Airport', address: 'Gatwick Airport, Horley RH6 0NP' },
  { name: 'London City Airport', address: 'London City Airport, London E16 2PX' },
  { name: 'London Stansted Airport', address: 'Stansted Airport, Stansted CM24 1QW' },
  { name: 'London Luton Airport', address: 'Luton Airport, Luton LU2 9LY' }
];

type AssignmentStep = 'service' | 'location' | 'time' | 'payment' | 'success';

export function AssignmentFullScreen({ context, onClose }: AssignmentFullScreenProps) {
  const { state } = useApp();

  // Determine initial step based on context
  const getInitialStep = (): AssignmentStep => {
    if (context?.preselectedService) {
      return 'location'; // Skip service selection
    }
    return 'service';
  };

  const [currentStep, setCurrentStep] = useState<AssignmentStep>(getInitialStep());
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    context?.preselectedService
      ? SERVICE_OPTIONS.find(s => s.id === context.preselectedService) || null
      : null
  );
  const [fromLocation, setFromLocation] = useState('Current location');
  const [toLocation, setToLocation] = useState('');
  const [timeOption, setTimeOption] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [protectionAssignmentData, setProtectionAssignmentData] = useState<any>(null);
  const [bookingId, setBookingId] = useState('');

  // Service Selection Component
  const ServiceSelection = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>SELECT YOUR PROTECTION LEVEL</h2>
      <div className={styles.serviceGrid}>
        {SERVICE_OPTIONS.map((service) => (
          <button
            key={service.id}
            className={`${styles.serviceCard} ${selectedService?.id === service.id ? styles.selected : ''}`}
            onClick={() => {
              setSelectedService(service);
              setCurrentStep('location');
            }}
          >
            <div className={styles.serviceIcon}>{service.icon}</div>
            <h3 className={styles.serviceName}>{service.name}</h3>
            <div className={styles.servicePrice}>{service.price}</div>
            <p className={styles.serviceDescription}>{service.description}</p>
            {service.popular && <span className={styles.popularBadge}>Popular</span>}
            <ul className={styles.featureList}>
              {service.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );

  // Location Selection Component
  const LocationSelection = () => (
    <div className={styles.stepContainer}>
      {/* Show selected service as header if preselected */}
      {context?.preselectedService && selectedService && (
        <div className={styles.preselectedHeader}>
          <div className={styles.preselectedService}>
            <span className={styles.checkmark}>✓</span>
            <div>
              <h3>{selectedService.name.toUpperCase()}</h3>
              <p>{selectedService.price} • 2-hour minimum</p>
            </div>
          </div>
          <button
            className={styles.changeButton}
            onClick={() => setCurrentStep('service')}
          >
            Change
          </button>
        </div>
      )}

      <h2 className={styles.stepTitle}>WHERE DO YOU NEED PROTECTION?</h2>

      {/* From Location */}
      <div className={styles.locationSection}>
        <label className={styles.locationLabel}>From</label>
        <div className={styles.locationInput}>
          <span className={styles.locationIcon}>📍</span>
          <input
            type="text"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className={styles.textInput}
            placeholder="Current location"
          />
        </div>
      </div>

      {/* To Location */}
      <div className={styles.locationSection}>
        <label className={styles.locationLabel}>To</label>
        <div className={styles.locationInput}>
          <span className={styles.locationIcon}>🏁</span>
          <input
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className={styles.textInput}
            placeholder="Enter destination"
          />
        </div>
      </div>

      {/* Quick Airport Options */}
      <div className={styles.quickOptions}>
        <h4>Popular Destinations</h4>
        <div className={styles.airportGrid}>
          {AIRPORT_LOCATIONS.map((airport) => (
            <button
              key={airport.name}
              className={styles.airportButton}
              onClick={() => {
                setToLocation(airport.address);
                setCurrentStep('time');
              }}
            >
              ✈️ {airport.name}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        className={styles.continueButton}
        onClick={() => setCurrentStep('time')}
        disabled={!toLocation.trim()}
      >
        Continue to Timing →
      </button>
    </div>
  );

  // Time Selection Component
  const TimeSelection = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>WHEN DO YOU NEED PROTECTION?</h2>

      <div className={styles.timeOptions}>
        <label className={`${styles.timeOption} ${timeOption === 'now' ? styles.selected : ''}`}>
          <input
            type="radio"
            name="time"
            value="now"
            checked={timeOption === 'now'}
            onChange={() => setTimeOption('now')}
          />
          <div className={styles.timeContent}>
            <h4>🚨 NOW</h4>
            <p>Immediate protection (2-4 min response)</p>
          </div>
        </label>

        <label className={`${styles.timeOption} ${timeOption === 'schedule' ? styles.selected : ''}`}>
          <input
            type="radio"
            name="time"
            value="schedule"
            checked={timeOption === 'schedule'}
            onChange={() => setTimeOption('schedule')}
          />
          <div className={styles.timeContent}>
            <h4>📅 SCHEDULE</h4>
            <p>Plan your protection in advance</p>
          </div>
        </label>
      </div>

      {timeOption === 'schedule' && (
        <div className={styles.scheduleInputs}>
          <div className={styles.dateInput}>
            <label>Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className={styles.timeInput}>
            <label>Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        </div>
      )}

      <button
        className={styles.continueButton}
        onClick={handleContinueToPayment}
        disabled={timeOption === 'schedule' && (!scheduledDate || !scheduledTime)}
      >
        Continue to Payment →
      </button>
    </div>
  );

  const handleContinueToPayment = () => {
    if (!selectedService) return;

    const locationData: LocationData = {
      commencementPoint: fromLocation,
      secureDestination: toLocation,
      estimatedDistance: 10, // Would calculate in production
      estimatedDuration: 30, // Would calculate in production
    };

    const assignmentData = {
      service: selectedService as any as ServiceLevel,
      commencementPoint: fromLocation,
      secureDestination: toLocation,
      estimatedDistance: 10,
      estimatedDuration: 30,
      estimatedCost: 130,
      user: state.user,
      scheduledDateTime: timeOption === 'schedule' && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined,
      isScheduled: timeOption === 'schedule'
    };

    setProtectionAssignmentData(assignmentData);
    setCurrentStep('payment');
  };

  const handleBookingComplete = (completedBookingId: string) => {
    setBookingId(completedBookingId);
    setCurrentStep('success');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'service':
        onClose();
        break;
      case 'location':
        if (context?.preselectedService) {
          onClose(); // If service was preselected, go back to previous page
        } else {
          setCurrentStep('service');
        }
        break;
      case 'time':
        setCurrentStep('location');
        break;
      case 'payment':
        setCurrentStep('time');
        break;
      default:
        onClose();
    }
  };

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Back
        </button>
        <div className={styles.progressDots}>
          <span className={currentStep === 'service' || (!context?.preselectedService) ? styles.active : styles.completed}>•</span>
          <span className={currentStep === 'location' ? styles.active : currentStep === 'time' || currentStep === 'payment' || currentStep === 'success' ? styles.completed : ''}></span>
          <span className={currentStep === 'time' ? styles.active : currentStep === 'payment' || currentStep === 'success' ? styles.completed : ''}></span>
          <span className={currentStep === 'payment' ? styles.active : currentStep === 'success' ? styles.completed : ''}></span>
        </div>
      </div>

      <div className={styles.content}>
        {currentStep === 'service' && <ServiceSelection />}
        {currentStep === 'location' && <LocationSelection />}
        {currentStep === 'time' && <TimeSelection />}
        {currentStep === 'payment' && protectionAssignmentData && (
          <PaymentIntegration
            protectionAssignmentData={protectionAssignmentData}
            onBookingComplete={handleBookingComplete}
            onBack={() => setCurrentStep('time')}
          />
        )}
        {currentStep === 'success' && (
          <AssignmentSuccess
            assignmentId={bookingId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}