import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { calculatePPOVenuePrice, PPOVenueBooking as PPOBooking } from '../../data/standardizedServices';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './PPOVenueBooking.module.css';

interface PPOVenueBookingProps {
  isVisible: boolean;
}

export function PPOVenueBooking({ isVisible }: PPOVenueBookingProps) {
  const { state } = useApp();
  const { user, questionnaireData } = state;

  const [selectedDuration, setSelectedDuration] = useState<'day' | '2_days' | 'month' | 'year'>('day');
  const [officerCount, setOfficerCount] = useState(1);
  const [venueType, setVenueType] = useState<'standard' | 'high_risk'>('standard');
  const [venueDescription, setVenueDescription] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<PPOBooking | null>(null);

  // Only show if user has completed questionnaire
  const hasCompletedQuestionnaire = user?.hasCompletedQuestionnaire || questionnaireData !== null;

  if (!isVisible || !hasCompletedQuestionnaire) {
    return null;
  }

  const handleGetQuote = () => {
    const quote = calculatePPOVenuePrice(selectedDuration, officerCount, venueType);
    setCurrentQuote(quote);
    setShowQuoteModal(true);
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);

    // Simulate API call for PPO venue booking
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('[PPO Booking] Venue protection request submitted:', {
      duration: selectedDuration,
      officerCount,
      venueType,
      venueDescription,
      specialRequirements,
      userEmail: user?.email,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(false);
    setShowQuoteModal(false);

    alert('Your Personal Protection Officer venue booking request has been submitted. Our security team will contact you within 24 hours to discuss requirements and confirm availability.');
  };

  const durationLabels = {
    day: '1 Day',
    '2_days': '2 Days',
    month: '1 Month',
    year: '1 Year'
  };

  return (
    <div className={styles.ppoSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>🛡️ Personal Protection Officers</h3>
        <p className={styles.subtitle}>
          Venue security services for events, offices, and high-risk locations
        </p>
      </div>

      <div className={styles.bookingForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Protection Duration</label>
            <select
              className={styles.select}
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value as 'day' | '2_days' | 'month' | 'year')}
            >
              {Object.entries(durationLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Officers</label>
            <select
              className={styles.select}
              value={officerCount}
              onChange={(e) => setOfficerCount(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map(count => (
                <option key={count} value={count}>{count} Officer{count > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Venue Risk Level</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="venueType"
                value="standard"
                checked={venueType === 'standard'}
                onChange={(e) => setVenueType(e.target.value as 'standard' | 'high_risk')}
                className={styles.radio}
              />
              <span className={styles.radioText}>Standard Venue</span>
              <span className={styles.radioDescription}>Office, event space, residence</span>
            </label>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="venueType"
                value="high_risk"
                checked={venueType === 'high_risk'}
                onChange={(e) => setVenueType(e.target.value as 'standard' | 'high_risk')}
                className={styles.radio}
              />
              <span className={styles.radioText}>High-Risk Venue (+50%)</span>
              <span className={styles.radioDescription}>Public events, diplomatic, celebrity</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Venue Description</label>
          <textarea
            className={styles.textarea}
            value={venueDescription}
            onChange={(e) => setVenueDescription(e.target.value)}
            placeholder="Describe the venue location, type of event or protection needed..."
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Special Requirements (Optional)</label>
          <textarea
            className={styles.textarea}
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder="Armed protection, counter-surveillance, VIP escort, etc..."
            rows={2}
          />
        </div>

        <Button
          onClick={handleGetQuote}
          className={styles.quoteButton}
          variant="primary"
          size="lg"
        >
          Get PPO Venue Quote
        </Button>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && currentQuote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>PPO Venue Protection Quote</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowQuoteModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.quoteDetails}>
                <div className={styles.quoteRow}>
                  <span>Duration:</span>
                  <span>{durationLabels[selectedDuration]}</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Officers:</span>
                  <span>{officerCount} Officer{officerCount > 1 ? 's' : ''}</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Venue Type:</span>
                  <span>{venueType === 'high_risk' ? 'High-Risk (+50%)' : 'Standard'}</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Base Rate:</span>
                  <span>£{currentQuote.basePrice.toLocaleString()}</span>
                </div>
                <div className={styles.quoteTotal}>
                  <span>Total Cost:</span>
                  <span>£{currentQuote.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.quoteIncludes}>
                <h4>Service Includes:</h4>
                <ul>
                  <li>SIA Level 3 certified Personal Protection Officers</li>
                  <li>Venue security assessment and planning</li>
                  <li>Threat risk analysis</li>
                  <li>Incident response protocols</li>
                  <li>24/7 command center support</li>
                  <li>Detailed security reports</li>
                </ul>
              </div>

              <div className={styles.modalActions}>
                <Button
                  onClick={() => setShowQuoteModal(false)}
                  variant="secondary"
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitBooking}
                  variant="primary"
                  disabled={isSubmitting}
                  className={styles.bookButton}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="small" variant="light" text="Submitting..." inline />
                  ) : (
                    'Request PPO Booking'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}