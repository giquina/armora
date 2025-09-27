import { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { AssignmentHistoryManager } from '../../utils/assignmentHistory';
import { ProtectionAssignmentData } from '../../types';
import styles from './AssignmentSuccess.module.css';

interface AssignmentSuccessProps {
  assignmentId: string;
  onClose?: () => void;
}

export function AssignmentSuccess({ assignmentId, onClose }: AssignmentSuccessProps) {
  const { navigateToView } = useApp();

  useEffect(() => {
    // Save protection assignment to history on mount
    try {
      const preserved = localStorage.getItem('armora_booking_state');
      if (preserved) {
        const state = JSON.parse(preserved);
        const protectionAssignmentData: ProtectionAssignmentData = state.protectionAssignmentData;

        if (protectionAssignmentData) {
          // Generate a random Protection Officer name for the demo
          const driverNames = ['John S.', 'Sarah M.', 'David L.', 'Emma R.', 'Michael T.', 'Lisa K.'];
          const randomDriver = driverNames[Math.floor(Math.random() * driverNames.length)];

          AssignmentHistoryManager.saveAssignmentToHistory(protectionAssignmentData, assignmentId, randomDriver);
        }
      }
    } catch (error) {
      console.error('❌ Failed to save protection assignment to history:', error);
    }

    // Auto-redirect to dashboard after 10 seconds
    const timer = setTimeout(() => {
      navigateToView('home');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigateToView, assignmentId]);

  const handleBackToDashboard = () => {
    navigateToView('home');
  };

  const handleViewBookingDetails = () => {
    // In a real app, this would navigate to protection assignment details page
    // For now, we'll just go to dashboard
    navigateToView('home');
  };

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <div className={styles.checkmark}>✓</div>
        </div>
        
        <div className={styles.successContent}>
          <h1 className={styles.title}>Assignment Confirmed!</h1>
          <p className={styles.subtitle}>
            Your security transport has been successfully protection confirmed
          </p>
          
          <div className={styles.bookingId}>
            <span className={styles.label}>Assignment Reference:</span>
            <span className={styles.id}>{assignmentId}</span>
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
                <p>Your officer will contact you 10 minutes before Commencement Point</p>
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
            <li>Check your email for detailed assignment confirmation</li>
            <li>SMS updates will be sent to your registered phone number</li>
            <li>24/7 support: Call 0800-ARMORA (0800-276672)</li>
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
            View Assignment Details
          </button>
        </div>

        <div className={styles.autoRedirect}>
          <p>Automatically returning to dashboard in 10 seconds...</p>
        </div>
      </div>
    </div>
  );
}