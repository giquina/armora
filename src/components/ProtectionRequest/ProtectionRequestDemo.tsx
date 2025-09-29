import React from 'react';
import { useProtectionRequestForm } from './hooks/useProtectionRequestForm';
import {
  ModernHeader,
  ServiceSelection,
  LocationInput,
  TimeSelection,
  BottomActionBar
} from './components';
import { ServiceTier } from './components/ServiceSelection/ServiceSelection';
import { TimeOption } from './components/TimeSelection/TimeSelection';
import styles from './ProtectionRequestDemo.module.css';

// Import design tokens
import '../../styles/design-tokens.css';

// Demo data
const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'essential',
    name: 'Essential Protection',
    icon: '🛡️',
    rate: '£65/hr',
    hourlyRate: 65,
    description: 'SIA Level 2 licensed Close Protection Officers',
    responseTime: '2-4 min',
    features: ['SIA Level 2 licensed', 'Real-time tracking', '24/7 support'],
    badge: 'MOST POPULAR',
    popular: true,
    officerProfile: ['SIA Level 2 certified', 'Professional security training', 'Vetted background'],
    idealFor: ['Daily security needs', 'Business meetings', 'Local travel']
  },
  {
    id: 'executive',
    name: 'Executive Shield',
    icon: '👔',
    rate: '£95/hr',
    hourlyRate: 95,
    description: 'Premium security detail for high-profile clients',
    responseTime: '3-5 min',
    features: ['SIA Level 3 licensed', 'Threat assessment', 'Discrete surveillance'],
    officerProfile: ['SIA Level 3 certified', 'Corporate security specialist', 'Executive protection trained'],
    idealFor: ['High-profile clients', 'Corporate executives', 'VIP events']
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    icon: '🥷',
    rate: '£125/hr',
    hourlyRate: 125,
    description: 'Special Forces trained protection specialists',
    responseTime: '5-8 min',
    features: ['Military-grade training', 'Covert operations', 'Counter-surveillance'],
    officerProfile: ['Special Forces background', 'Advanced tactical training', 'Counter-surveillance expert'],
    idealFor: ['Maximum security needs', 'Threat environments', 'International travel']
  },
  {
    id: 'client-vehicle',
    name: 'Client Vehicle Service',
    icon: '🚗',
    rate: '£55/hr',
    hourlyRate: 55,
    description: 'Security-trained CPO for your vehicle',
    responseTime: '4-6 min',
    features: ['Your vehicle', 'No mileage charges', 'Enhanced privacy'],
    officerProfile: ['SIA licensed', 'Advanced driving certified', 'Security driver trained'],
    idealFor: ['Personal vehicle use', 'Cost-effective security', 'Familiar vehicle preference']
  }
];

const TIME_OPTIONS: TimeOption[] = [
  {
    value: 'now',
    label: 'Now',
    description: 'CPO deploys immediately',
    badge: 'FASTEST',
    icon: '⚡',
    popular: true
  },
  {
    value: '30min',
    label: '30 mins',
    description: 'Protection starts in 30 minutes',
    icon: '🕒'
  },
  {
    value: '1hour',
    label: '1 hour',
    description: 'Protection starts in 1 hour',
    icon: '🕐'
  },
  {
    value: 'schedule',
    label: 'Schedule',
    description: 'Choose specific date & time',
    icon: '📅'
  }
];

interface ProtectionRequestDemoProps {
  onBack?: () => void;
  onClose?: () => void;
  hasUserDiscount?: boolean;
}

export const ProtectionRequestDemo: React.FC<ProtectionRequestDemoProps> = ({
  onBack,
  onClose,
  hasUserDiscount = true // Demo with discount
}) => {
  const {
    formData,
    selectedService,
    pricing,
    validation,
    isSubmitting,
    submitError,
    deploymentInfo,
    updateService,
    updateDestination,
    updateTime,
    updateScheduledDateTime,
    handleSubmit
  } = useProtectionRequestForm({
    serviceTiers: SERVICE_TIERS,
    timeOptions: TIME_OPTIONS,
    hasUserDiscount,
    onSubmit: async (formData, pricing) => {
      // Demo submission - log to console
      console.log('Protection Request Submitted:', {
        formData,
        pricing,
        deploymentInfo
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Protection request submitted!\n\nService: ${selectedService?.name}\nDestination: ${formData.destination}\nTotal: £${pricing.finalPrice}`);
    }
  });

  const handleLocationSelect = (location: any) => {
    updateDestination(location.address);
  };

  const getPrimaryButtonText = () => {
    if (!validation.isValid) {
      if (!formData.destination.trim()) {
        return 'Enter destination';
      }
      if (formData.selectedTime === 'schedule' && !formData.scheduledDateTime) {
        return 'Select date & time';
      }
      return 'Complete form';
    }
    return `Request CPO - £${pricing.finalPrice}`;
  };

  return (
    <div className={styles.protectionRequestDemo}>
      {/* Modern Header */}
      <ModernHeader
        currentStep={1}
        totalSteps={3}
        title="Request Close Protection"
        subtitle="Professional SIA-licensed protection services"
        onBack={onBack || (() => console.log('Back clicked'))}
        onClose={onClose}
        showProgress={true}
      />

      {/* Form Content */}
      <div className={styles.formContent}>
        {/* Service Selection */}
        <ServiceSelection
          serviceTiers={SERVICE_TIERS}
          selectedServiceId={formData.selectedServiceId}
          onServiceChange={updateService}
        />

        {/* Location Input */}
        <LocationInput
          value={formData.destination}
          onChange={updateDestination}
          onLocationSelect={handleLocationSelect}
          error={validation.errors.destination}
          savedLocations={{
            home: 'Mayfair, London W1K 5NA',
            office: 'Canary Wharf, London E14 5AB'
          }}
        />

        {/* Time Selection */}
        <TimeSelection
          timeOptions={TIME_OPTIONS}
          selectedTime={formData.selectedTime}
          onTimeChange={updateTime}
          scheduledDateTime={formData.scheduledDateTime}
          onScheduledDateTimeChange={updateScheduledDateTime}
          minDateTime={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
        />

        {/* Spacer for bottom bar */}
        <div className={styles.bottomSpacer} />
      </div>

      {/* Bottom Action Bar */}
      <BottomActionBar
        isValid={validation.isValid}
        pricing={pricing}
        primaryButtonText={getPrimaryButtonText()}
        onPrimaryAction={handleSubmit}
        isLoading={isSubmitting}
        error={submitError}
        additionalInfo={deploymentInfo}
      />

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.debugPanel}>
          <details>
            <summary>🔍 Debug Info</summary>
            <pre>{JSON.stringify({
              formData,
              validation,
              pricing,
              deploymentInfo
            }, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};