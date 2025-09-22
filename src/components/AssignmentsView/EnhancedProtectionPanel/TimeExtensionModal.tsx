import React, { useState } from 'react';
import styles from './TimeExtensionModal.module.css';

interface TimeExtensionOption {
  id: 'vehicle_wait' | 'accompany' | 'route_extension' | 'security_hold';
  icon: string;
  title: string;
  description: string;
  rate: string;
  examples: string[];
}

interface TimeExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (extensionData: {
    type: string;
    duration: number;
    reason?: string;
    estimatedCost: number;
  }) => void;
  currentRate: number;
  officerName: string;
}

export const TimeExtensionModal: React.FC<TimeExtensionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentRate,
  officerName
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'type' | 'duration' | 'confirm'>('type');

  const extensionOptions: TimeExtensionOption[] = [
    {
      id: 'vehicle_wait',
      icon: '🚗',
      title: 'CPO Waits in Vehicle',
      description: 'Officer remains with secure vehicle while you attend to matters',
      rate: '£25/30min (Standby Rate)',
      examples: ['In meeting', 'Shopping', 'Medical appointment']
    },
    {
      id: 'accompany',
      icon: '🚶',
      title: 'CPO Accompanies You',
      description: 'Officer continues active protection duties with you',
      rate: '£50/30min (Active Rate)',
      examples: ['Extended meeting', 'Additional venue', 'Event overrun']
    },
    {
      id: 'route_extension',
      icon: '📍',
      title: 'Add Destination',
      description: 'Include additional stops or modify current route',
      rate: '£75/hour + mileage',
      examples: ['Quick stop needed', 'Route change', 'Return journey']
    },
    {
      id: 'security_hold',
      icon: '🛡️',
      title: 'Enhanced Protection',
      description: 'Elevated security response required',
      rate: '£100/hour (Enhanced Rate)',
      examples: ['Crowd situation', 'Threat assessment', 'VIP protocol']
    }
  ];

  const durationOptions = [
    { value: 30, label: '+30 minutes', multiplier: 0.5 },
    { value: 60, label: '+1 hour', multiplier: 1 },
    { value: 120, label: '+2 hours', multiplier: 2 },
    { value: 180, label: '+3 hours', multiplier: 3 }
  ];

  const calculateCost = () => {
    const selectedOption = extensionOptions.find(opt => opt.id === selectedType);
    if (!selectedOption) return 0;

    const duration = selectedDuration / 60; // Convert to hours

    switch (selectedType) {
      case 'vehicle_wait':
        return Math.round(25 * (selectedDuration / 30)); // £25 per 30min
      case 'accompany':
        return Math.round(50 * (selectedDuration / 30)); // £50 per 30min
      case 'route_extension':
        return Math.round(75 * duration); // £75 per hour
      case 'security_hold':
        return Math.round(100 * duration); // £100 per hour
      default:
        return 0;
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep('duration');
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!selectedType) return;

    const extensionData = {
      type: selectedType,
      duration: selectedDuration,
      reason: reason.trim() || undefined,
      estimatedCost: calculateCost()
    };

    onConfirm(extensionData);
    handleReset();
  };

  const handleReset = () => {
    setSelectedType(null);
    setSelectedDuration(30);
    setReason('');
    setStep('type');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const renderTypeSelection = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h3 className={styles.stepTitle}>Extend Protection Service</h3>
        <p className={styles.stepDescription}>
          Select the type of extension needed for CPO {officerName}
        </p>
      </div>

      <div className={styles.optionsGrid}>
        {extensionOptions.map((option) => (
          <button
            key={option.id}
            className={styles.optionCard}
            onClick={() => handleTypeSelect(option.id)}
          >
            <div className={styles.optionIcon}>{option.icon}</div>
            <div className={styles.optionContent}>
              <h4 className={styles.optionTitle}>{option.title}</h4>
              <p className={styles.optionDescription}>{option.description}</p>
              <div className={styles.optionRate}>{option.rate}</div>
              <div className={styles.optionExamples}>
                {option.examples.map((example, index) => (
                  <span key={index} className={styles.exampleTag}>
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDurationSelection = () => {
    const selectedOption = extensionOptions.find(opt => opt.id === selectedType);

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepHeader}>
          <h3 className={styles.stepTitle}>{selectedOption?.title}</h3>
          <p className={styles.stepDescription}>
            How much additional time do you need?
          </p>
        </div>

        <div className={styles.durationGrid}>
          {durationOptions.map((duration) => (
            <button
              key={duration.value}
              className={`${styles.durationCard} ${
                selectedDuration === duration.value ? styles.selected : ''
              }`}
              onClick={() => setSelectedDuration(duration.value)}
            >
              <div className={styles.durationLabel}>{duration.label}</div>
              <div className={styles.durationCost}>
                £{calculateCost() || Math.round(currentRate * duration.multiplier)}
              </div>
            </button>
          ))}
        </div>

        <div className={styles.reasonSection}>
          <label className={styles.reasonLabel}>
            Brief explanation (optional)
          </label>
          <input
            type="text"
            className={styles.reasonInput}
            placeholder="e.g., Meeting running late, Traffic delay..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className={styles.stepActions}>
          <button className={styles.backButton} onClick={() => setStep('type')}>
            ← Back
          </button>
          <button
            className={styles.continueButton}
            onClick={() => handleDurationSelect(selectedDuration)}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    const selectedOption = extensionOptions.find(opt => opt.id === selectedType);
    const selectedDurationOption = durationOptions.find(opt => opt.value === selectedDuration);
    const estimatedCost = calculateCost();

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepHeader}>
          <h3 className={styles.stepTitle}>Confirm Extension</h3>
          <p className={styles.stepDescription}>
            Review your protection service extension
          </p>
        </div>

        <div className={styles.confirmationCard}>
          <div className={styles.confirmationRow}>
            <span className={styles.confirmationLabel}>Service Type:</span>
            <span className={styles.confirmationValue}>{selectedOption?.title}</span>
          </div>
          <div className={styles.confirmationRow}>
            <span className={styles.confirmationLabel}>Duration:</span>
            <span className={styles.confirmationValue}>{selectedDurationOption?.label}</span>
          </div>
          <div className={styles.confirmationRow}>
            <span className={styles.confirmationLabel}>CPO:</span>
            <span className={styles.confirmationValue}>{officerName}</span>
          </div>
          {reason && (
            <div className={styles.confirmationRow}>
              <span className={styles.confirmationLabel}>Reason:</span>
              <span className={styles.confirmationValue}>{reason}</span>
            </div>
          )}
          <div className={`${styles.confirmationRow} ${styles.totalCost}`}>
            <span className={styles.confirmationLabel}>Estimated Cost:</span>
            <span className={styles.confirmationValue}>£{estimatedCost}</span>
          </div>
        </div>

        <div className={styles.confirmationNote}>
          <p>Your CPO will be notified immediately. You will be charged only for the actual time used.</p>
        </div>

        <div className={styles.stepActions}>
          <button className={styles.backButton} onClick={() => setStep('duration')}>
            ← Back
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm Extension
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.stepIndicator}>
            <div className={`${styles.stepDot} ${step === 'type' ? styles.active : styles.completed}`} />
            <div className={`${styles.stepDot} ${step === 'duration' ? styles.active : step === 'confirm' ? styles.completed : ''}`} />
            <div className={`${styles.stepDot} ${step === 'confirm' ? styles.active : ''}`} />
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        {step === 'type' && renderTypeSelection()}
        {step === 'duration' && renderDurationSelection()}
        {step === 'confirm' && renderConfirmation()}
      </div>
    </div>
  );
};