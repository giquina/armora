import React, { useState } from 'react';
import { BookingData } from '../../types';
import { ProtectionLevel } from './ProtectionLevelSelector';
import { VenueTimeData } from './VenueTimeEstimator';
import { ProtectionServiceRequest, calculateProtectionPricing } from '../../utils/protectionPricingCalculator';
import { formatPrice } from '../../utils/priceFormatter';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './BookingConfirmation.module.css';

interface BookingConfirmationProps {
  bookingData: BookingData;
  protectionLevel: ProtectionLevel;
  venueTimeData?: VenueTimeData;
  destination: string;
  onConfirmBooking: (bookingId: string) => void;
  onBack: () => void;
}

export function BookingConfirmation({
  bookingData,
  protectionLevel,
  venueTimeData,
  destination,
  onConfirmBooking,
  onBack
}: BookingConfirmationProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { user } = bookingData;
  const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';

  // Calculate pricing using the new protection pricing system
  const protectionRequest: ProtectionServiceRequest = {
    destination,
    protectionLevel,
    venueTimeData,
    userType: user?.userType || 'guest',
    hasUnlockedReward: hasReward
  };

  const pricingBreakdown = calculateProtectionPricing(protectionRequest);


  const handleConfirmBooking = async () => {
    if (!agreedToTerms) return;

    setIsBooking(true);
    
    // Simulate API call to create booking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock booking ID
    const bookingId = `ARM-${Date.now().toString().slice(-6)}`;
    
    // In a real app, this would save the booking to backend
    const bookingRecord = {
      id: bookingId,
      userId: user?.id,
      service: protectionLevel.name,
      destination,
      totalCost: pricingBreakdown.total,
      additionalRequirements,
      createdAt: new Date(),
      status: 'confirmed'
    };
    
    // Save to localStorage for demo purposes
    const existingBookings = JSON.parse(localStorage.getItem('armora_bookings') || '[]');
    existingBookings.push(bookingRecord);
    localStorage.setItem('armora_bookings', JSON.stringify(existingBookings));
    
    onConfirmBooking(bookingId);
    setIsBooking(false);
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <h1 className={styles.title}>Confirm Protection</h1>
        <p className={styles.subtitle}>
          {protectionLevel.name} • Review protection details before confirming
        </p>
      </div>

      <div className={styles.bookingSummary}>

        <div className={styles.routeSection}>
          <h3 className={styles.sectionTitle}>Service Details</h3>
          <div className={styles.routeCard}>
            <div className={styles.routeItem}>
              <span className={styles.routeIcon}>📍</span>
              <div>
                <div className={styles.routeLabel}>Protection starts from</div>
                <div className={styles.routeLocation}>Current location</div>
              </div>
            </div>
            <div className={styles.routeSeparator}>
              <div className={styles.routeLine}></div>
            </div>
            <div className={styles.routeItem}>
              <span className={styles.routeIcon}>🏁</span>
              <div>
                <div className={styles.routeLabel}>Secure destination</div>
                <div className={styles.routeLocation}>{destination}</div>
              </div>
            </div>
            {protectionLevel.type === 'personal' && venueTimeData && (
              <div className={styles.venueDetails}>
                <div className={styles.venueTime}>
                  <span className={styles.venueLabel}>Time at venue:</span>
                  <span className={styles.venueValue}>{venueTimeData.venueHours} hours</span>
                </div>
                {venueTimeData.discreteProtection && (
                  <div className={styles.specialRequest}>
                    Discrete protection requested
                  </div>
                )}
                {venueTimeData.femaleOfficerPreferred && (
                  <div className={styles.specialRequest}>
                    Female officer preferred
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.estimateSection}>
          <h3 className={styles.sectionTitle}>Cost Breakdown</h3>
          <div className={styles.estimateCard}>
            {pricingBreakdown.components.map((component, index) => (
              <div key={index} className={styles.estimateRow}>
                <span>{component.label}</span>
                <span>{formatPrice(component.amount)}</span>
              </div>
            ))}
            <div className={styles.subtotalRow}>
              <span>Subtotal:</span>
              <span>{formatPrice(pricingBreakdown.subtotal)}</span>
            </div>
            {pricingBreakdown.discounts.map((discount, index) => (
              <div key={index} className={styles.discountRow}>
                <span>{discount.label}</span>
                <span className={styles.discountAmount}>-{formatPrice(discount.amount)}</span>
              </div>
            ))}
            <div className={`${styles.estimateRow} ${styles.totalCost}`}>
              <span>Total Service Fee:</span>
              <span className={styles.costAmount}>{formatPrice(pricingBreakdown.total)}</span>
            </div>
          </div>
        </div>

        <div className={styles.requirementsSection}>
          <h3 className={styles.sectionTitle}>Additional Requirements</h3>
          <textarea
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="Any special requirements or instructions for your Protection Officer..."
            className={styles.requirementsTextarea}
            rows={3}
            maxLength={200}
          />
          <div className={styles.characterCount}>
            {additionalRequirements.length}/200 characters
          </div>
        </div>

        <div className={styles.termsSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              I agree to the <button type="button" className={styles.termsLink}>Terms of Service</button> and 
              understand the <button type="button" className={styles.termsLink}>cancellation policy</button>
            </span>
          </label>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.importantNotes}>
          <h4>Important Notes:</h4>
          <ul>
            <li>Your Protection Officer will arrive 5-10 minutes before scheduled service</li>
            <li>Final cost may vary based on actual service duration</li>
            <li>Minimum service duration: 2 hours</li>
            {protectionLevel.type === 'personal' && <li>Client covers officer's venue entry fees if required</li>}
            <li>Cancellation within 30 minutes of service incurs a £15 fee</li>
          </ul>
        </div>
        
        <button
          className={styles.confirmButton}
          onClick={handleConfirmBooking}
          disabled={!agreedToTerms || isBooking}
        >
          {isBooking ? (
            <div className={styles.bookingLoader}>
              <LoadingSpinner size="small" variant="light" inline />
              <span>Confirming Protection Service...</span>
            </div>
          ) : (
            <>
              <span>Confirm Protection Service - {formatPrice(pricingBreakdown.total)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}