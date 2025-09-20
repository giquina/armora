import React, { useState } from 'react';
import { ProtectionLevel } from './ProtectionLevelSelector';
import styles from './VenueTimeEstimator.module.css';

interface VenueTimeEstimatorProps {
  destination: string;
  protectionLevel: ProtectionLevel;
  onTimeEstimateComplete: (timeData: VenueTimeData) => void;
  onBack?: () => void;
}

export interface VenueTimeData {
  venueHours: number;
  discreteProtection: boolean;
  helpWithShopping: boolean;
  waitInside: boolean;
  femaleOfficerPreferred: boolean;
  customRequests?: string;
}

const TIME_OPTIONS = [
  { value: 0.5, label: '30 mins' },
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
  { value: 4, label: '4+ hours' },
  { value: -1, label: 'Not sure' }
];

export function VenueTimeEstimator({
  destination,
  protectionLevel,
  onTimeEstimateComplete,
  onBack
}: VenueTimeEstimatorProps) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [discreteProtection, setDiscreteProtection] = useState(false);
  const [helpWithShopping, setHelpWithShopping] = useState(false);
  const [waitInside, setWaitInside] = useState(true);
  const [femaleOfficerPreferred, setFemaleOfficerPreferred] = useState(false);
  const [customRequests, setCustomRequests] = useState('');

  const handleTimeSelect = (hours: number) => {
    setSelectedTime(hours);
  };

  const handleContinue = () => {
    if (selectedTime === null) return;

    const timeData: VenueTimeData = {
      venueHours: selectedTime === -1 ? 2 : selectedTime, // Default to 2 hours if "Not sure"
      discreteProtection,
      helpWithShopping,
      waitInside,
      femaleOfficerPreferred,
      customRequests: customRequests.trim() || undefined
    };

    onTimeEstimateComplete(timeData);
  };

  const formatDestination = (dest: string) => {
    return dest.length > 35 ? `${dest.substring(0, 35)}...` : dest;
  };

  // Only show this component for Personal Protection
  if (protectionLevel.type !== 'personal') {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            How long will you be at {formatDestination(destination)}?
          </h2>
          <p className={styles.subtitle}>
            Your Protection Officer will accompany you for the duration
          </p>
        </div>
      </div>

      {/* Time Selection */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Duration at venue</h3>
        <div className={styles.timeGrid}>
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.timeButton} ${selectedTime === option.value ? styles.selected : ''}`}
              onClick={() => handleTimeSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Additional options</h3>
        <div className={styles.optionsGrid}>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={discreteProtection}
              onChange={(e) => setDiscreteProtection(e.target.checked)}
              className={styles.checkbox}
            />
            <div className={styles.checkboxLabel}>
              <div className={styles.optionIcon}>🕴️</div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Discrete protection</span>
                <span className={styles.optionDescription}>Plainclothes officer</span>
              </div>
            </div>
          </label>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={helpWithShopping}
              onChange={(e) => setHelpWithShopping(e.target.checked)}
              className={styles.checkbox}
            />
            <div className={styles.checkboxLabel}>
              <div className={styles.optionIcon}>🛍️</div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Help with shopping/luggage</span>
                <span className={styles.optionDescription}>Officer assists with bags</span>
              </div>
            </div>
          </label>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={waitInside}
              onChange={(e) => setWaitInside(e.target.checked)}
              className={styles.checkbox}
            />
            <div className={styles.checkboxLabel}>
              <div className={styles.optionIcon}>🏢</div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Wait inside venue with me</span>
                <span className={styles.optionDescription}>Officer remains nearby inside</span>
              </div>
            </div>
          </label>

          <label className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={femaleOfficerPreferred}
              onChange={(e) => setFemaleOfficerPreferred(e.target.checked)}
              className={styles.checkbox}
            />
            <div className={styles.checkboxLabel}>
              <div className={styles.optionIcon}>👩‍💼</div>
              <div className={styles.optionContent}>
                <span className={styles.optionTitle}>Female Protection Officer preferred</span>
                <span className={styles.optionDescription}>Subject to availability</span>
              </div>
            </div>
          </label>

        </div>
      </div>

      {/* Custom Requests */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Special requests (optional)</h3>
        <textarea
          className={styles.customRequests}
          placeholder="Any specific requirements or preferences..."
          value={customRequests}
          onChange={(e) => setCustomRequests(e.target.value)}
          rows={3}
          maxLength={200}
        />
        <div className={styles.characterCount}>
          {customRequests.length}/200 characters
        </div>
      </div>

      {/* Continue Button */}
      <div className={styles.continueSection}>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={selectedTime === null}
        >
          Continue to Pricing →
        </button>
        {selectedTime === null && (
          <p className={styles.continueHint}>
            Please select how long you'll be at the venue
          </p>
        )}
      </div>

      {/* Info Note */}
      <div className={styles.infoNote}>
        <div className={styles.infoIcon}>ℹ️</div>
        <div className={styles.infoContent}>
          <p className={styles.infoText}>
            <strong>Note:</strong> Client covers officer's venue entry if required (e.g., museums, events).
            Any parking costs will be added to your final bill if applicable.
          </p>
        </div>
      </div>
    </div>
  );
}