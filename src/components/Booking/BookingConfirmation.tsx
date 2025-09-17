import React, { useState } from 'react';
import { BookingData } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { BookingProgressIndicator } from '../UI/ProgressIndicator';
import styles from './BookingConfirmation.module.css';

interface BookingConfirmationProps {
  bookingData: BookingData;
  onConfirmBooking: (bookingId: string) => void;
  onBack: () => void;
}

export function BookingConfirmation({ bookingData, onConfirmBooking, onBack }: BookingConfirmationProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { service, pickup, destination, estimatedDistance, estimatedDuration, estimatedCost, user } = bookingData;
  const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

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
      service: service.id,
      pickup,
      destination,
      estimatedCost,
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
      {/* Progress Indicator */}
      <BookingProgressIndicator currentStep="booking-confirmation" />
      
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <h1 className={styles.title}>Confirm Your Booking</h1>
        <p className={styles.subtitle}>
          Review your security transport details before confirming
        </p>
      </div>

      <div className={styles.bookingSummary}>
        <div className={styles.serviceSection}>
          <h3 className={styles.sectionTitle}>Selected Service</h3>
          <div className={styles.serviceCard}>
            <div className={styles.serviceInfo}>
              <h4>{service.name}</h4>
              <p>{service.tagline}</p>
            </div>
            <div className={styles.servicePrice}>
              {hasReward ? (
                <>
                  <span className={styles.discountedPrice}>£{Math.round(service.hourlyRate * 0.5)}/hour</span>
                  <span className={styles.originalPrice}>£{service.hourlyRate}/hour</span>
                </>
              ) : (
                <span className={styles.price}>£{service.hourlyRate}/hour</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.routeSection}>
          <h3 className={styles.sectionTitle}>Route Details</h3>
          <div className={styles.routeCard}>
            <div className={styles.routeItem}>
              <span className={styles.routeIcon}>📍</span>
              <div>
                <div className={styles.routeLabel}>Pickup</div>
                <div className={styles.routeLocation}>{pickup}</div>
              </div>
            </div>
            <div className={styles.routeSeparator}>
              <div className={styles.routeLine}></div>
            </div>
            <div className={styles.routeItem}>
              <span className={styles.routeIcon}>🏁</span>
              <div>
                <div className={styles.routeLabel}>Destination</div>
                <div className={styles.routeLocation}>{destination}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.estimateSection}>
          <h3 className={styles.sectionTitle}>Trip Estimate</h3>
          <div className={styles.estimateCard}>
            <div className={styles.estimateRow}>
              <span>Distance:</span>
              <span>{estimatedDistance} miles</span>
            </div>
            <div className={styles.estimateRow}>
              <span>Duration:</span>
              <span>{formatDuration(estimatedDuration)}</span>
            </div>
            <div className={`${styles.estimateRow} ${styles.totalCost}`}>
              <span>Estimated Total:</span>
              <span className={styles.costAmount}>£{estimatedCost}</span>
            </div>
            {hasReward && (
              <div className={styles.rewardBanner}>
                🎉 50% First Ride Discount Applied!
              </div>
            )}
          </div>
        </div>

        <div className={styles.requirementsSection}>
          <h3 className={styles.sectionTitle}>Additional Requirements</h3>
          <textarea
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="Any special requirements or instructions for your security officer..."
            className={styles.requirementsTextarea}
            rows={3}
          />
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
            <li>Your security officer will arrive 5-10 minutes before scheduled pickup</li>
            <li>Final cost may vary based on actual travel time and traffic conditions</li>
            <li>Minimum charge: 1 hour service</li>
            <li>Cancellation within 30 minutes of pickup incurs a £15 fee</li>
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
              <span>Confirming Your Booking...</span>
            </div>
          ) : (
            <>
              <span className={styles.lockIcon}>🔒</span>
              <span>Confirm Secure Booking - £{estimatedCost}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}