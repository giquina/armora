import React, { useState } from 'react';
import { ServiceLevel } from '../../types';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { calculateHourlyPrice, calculateJourneyPrice } from '../../data/standardizedServices';
import styles from './GuestQuoteModal.module.css';

interface GuestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: ServiceLevel | null;
  onSignUp: () => void;
}

export function GuestQuoteModal({ isOpen, onClose, selectedService, onSignUp }: GuestQuoteModalProps) {
  const [pricingType, setPricingType] = useState<'hourly' | 'journey'>('hourly');
  const [hours, setHours] = useState(4);
  const [estimatedDistance, setEstimatedDistance] = useState(10);
  const [estimatedDuration, setEstimatedDuration] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !selectedService) return null;

  const hourlyQuote = calculateHourlyPrice(selectedService.id, hours);
  const journeyQuote = calculateJourneyPrice(selectedService.id, estimatedDuration, estimatedDistance);

  const currentQuote = pricingType === 'hourly' ? hourlyQuote : journeyQuote;

  const handleRequestQuote = async () => {
    setIsSubmitting(true);

    // Simulate API call for quote request
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('[Guest Quote] Quote requested:', {
      service: selectedService.name,
      pricingType,
      hours: pricingType === 'hourly' ? hours : null,
      distance: pricingType === 'journey' ? estimatedDistance : null,
      estimatedCost: currentQuote.finalPrice,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(false);
    alert(`Your quote request has been submitted! We'll email you a detailed quote within 1 hour.\n\nEstimated Cost: £${currentQuote.finalPrice.toFixed(2)}\n\nTo book directly, please create an account for security verification.`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Security Transport Quote</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalContent}>
          {/* Guest Notice */}
          <div className={styles.guestNotice}>
            <div className={styles.noticeIcon}>👤</div>
            <div className={styles.noticeContent}>
              <h4>Guest Quote Request</h4>
              <p>As a guest, you can request quotes but cannot book directly. Registration is required for security vetting and direct booking access.</p>
            </div>
          </div>

          {/* Service Summary */}
          <div className={styles.serviceDetails}>
            <h4>{selectedService.name}</h4>
            <p>{selectedService.description}</p>
          </div>

          {/* Pricing Type Selection */}
          <div className={styles.pricingTypeSection}>
            <h4>Select Pricing Type</h4>
            <div className={styles.pricingOptions}>
              <label className={`${styles.pricingOption} ${pricingType === 'hourly' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="pricingType"
                  value="hourly"
                  checked={pricingType === 'hourly'}
                  onChange={(e) => setPricingType(e.target.value as 'hourly')}
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>Hourly Rate</span>
                  <span className={styles.optionDescription}>Fixed hourly blocks (minimum 4 hours)</span>
                </div>
              </label>

              <label className={`${styles.pricingOption} ${pricingType === 'journey' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="pricingType"
                  value="journey"
                  checked={pricingType === 'journey'}
                  onChange={(e) => setPricingType(e.target.value as 'journey')}
                />
                <div className={styles.optionContent}>
                  <span className={styles.optionTitle}>Per Journey</span>
                  <span className={styles.optionDescription}>Based on time and distance</span>
                </div>
              </label>
            </div>
          </div>

          {/* Hourly Configuration */}
          {pricingType === 'hourly' && (
            <div className={styles.configSection}>
              <label className={styles.label}>
                Duration (hours):
                <select
                  className={styles.select}
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                >
                  {[4, 6, 8, 10, 12].map(h => (
                    <option key={h} value={h}>{h} hours</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Journey Configuration */}
          {pricingType === 'journey' && (
            <div className={styles.configSection}>
              <label className={styles.label}>
                Estimated Distance (miles):
                <input
                  type="number"
                  className={styles.input}
                  value={estimatedDistance}
                  onChange={(e) => setEstimatedDistance(parseInt(e.target.value) || 0)}
                  min="1"
                  max="200"
                />
              </label>
              <label className={styles.label}>
                Estimated Duration (minutes):
                <input
                  type="number"
                  className={styles.input}
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 0)}
                  min="15"
                  max="480"
                />
              </label>
            </div>
          )}

          {/* Quote Summary */}
          <div className={styles.quoteSummary}>
            <div className={styles.quoteRow}>
              <span>Service:</span>
              <span>{selectedService.name}</span>
            </div>
            <div className={styles.quoteRow}>
              <span>Pricing Type:</span>
              <span>{pricingType === 'hourly' ? 'Hourly Rate' : 'Per Journey'}</span>
            </div>
            {pricingType === 'hourly' && (
              <div className={styles.quoteRow}>
                <span>Duration:</span>
                <span>{hours} hours</span>
              </div>
            )}
            {pricingType === 'journey' && (
              <>
                <div className={styles.quoteRow}>
                  <span>Distance:</span>
                  <span>{estimatedDistance} miles</span>
                </div>
                <div className={styles.quoteRow}>
                  <span>Duration:</span>
                  <span>{estimatedDuration} minutes</span>
                </div>
              </>
            )}
            <div className={styles.quoteTotal}>
              <span>Estimated Cost:</span>
              <span>£{currentQuote.finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.modalActions}>
            <Button
              onClick={onSignUp}
              variant="secondary"
              className={styles.signupButton}
            >
              Create Account to Book
            </Button>
            <Button
              onClick={handleRequestQuote}
              variant="primary"
              disabled={isSubmitting}
              className={styles.quoteButton}
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" variant="light" text="Requesting..." inline />
              ) : (
                'Request Quote'
              )}
            </Button>
          </div>

          <p className={styles.disclaimer}>
            * Quote is an estimate. Final price may vary based on actual route, traffic conditions, and security requirements.
          </p>
        </div>
      </div>
    </div>
  );
}