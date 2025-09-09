import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './BookingSuccess.module.css';

interface BookingSuccessProps {
  bookingId: string;
}

export function BookingSuccess({ bookingId }: BookingSuccessProps) {
  const { navigateToView } = useApp();

  useEffect(() => {
    // Auto-redirect to dashboard after 10 seconds
    const timer = setTimeout(() => {
      navigateToView('dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigateToView]);

  const handleBackToDashboard = () => {
    navigateToView('dashboard');
  };

  const handleViewBookingDetails = () => {
    // In a real app, this would navigate to booking details page
    // For now, we'll just go to dashboard
    navigateToView('dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <div className={styles.checkmark}>✓</div>
        </div>
        
        <div className={styles.successContent}>
          <h1 className={styles.title}>Booking Confirmed!</h1>
          <p className={styles.subtitle}>
            Your security transport has been successfully booked
          </p>
          
          <div className={styles.bookingId}>
            <span className={styles.label}>Booking Reference:</span>
            <span className={styles.id}>{bookingId}</span>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h3 className={styles.stepsTitle}>What happens next?</h3>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <div className={styles.stepContent}>
                <h4>Officer Assignment</h4>
                <p>We'll assign your certified security professional within 15 minutes</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <div className={styles.stepContent}>
                <h4>Pre-Arrival Contact</h4>
                <p>Your officer will contact you 10 minutes before pickup</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <h4>Secure Transport</h4>
                <p>Professional protection service to your destination</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.importantInfo}>
          <h4>Important Information</h4>
          <ul>
            <li>Check your email for detailed booking confirmation</li>
            <li>SMS updates will be sent to your registered phone number</li>
            <li>Emergency support: Call 0800-ARMORA (0800-276672)</li>
            <li>Cancellations within 30 minutes incur a £15 fee</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.primaryButton}
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
          <button 
            className={styles.secondaryButton}
            onClick={handleViewBookingDetails}
          >
            View Booking Details
          </button>
        </div>

        <div className={styles.autoRedirect}>
          <p>Automatically returning to dashboard in 10 seconds...</p>
        </div>
      </div>
    </div>
  );
}