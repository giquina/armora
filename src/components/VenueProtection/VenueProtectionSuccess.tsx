import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
// Logo removed - keeping pages clean and focused
import confetti from 'canvas-confetti';
import styles from './VenueProtectionSuccess.module.css';

export function VenueProtectionSuccess() {
  const { navigateToView } = useApp();
  const [assessment, setAssessment] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Load assessment data
    const savedAssessment = localStorage.getItem('armora_venue_assessment');
    if (savedAssessment) {
      try {
        const assessmentData = JSON.parse(savedAssessment);
        setAssessment(assessmentData);
      } catch (error) {
        console.error('Failed to load venue assessment:', error);
      }
    }

    // Trigger confetti animation
    const timer = setTimeout(() => {
      setShowConfetti(true);
      fireConfetti();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const fireConfetti = () => {
    // Launch confetti from multiple positions
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#1a1a2e']
      });

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#1a1a2e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleBookAnotherEvent = () => {
    // Clear current assessment and restart
    localStorage.removeItem('armora_venue_assessment');
    localStorage.removeItem('armora_venue_questionnaire_progress');
    navigateToView('venue-protection-welcome');
  };

  const handleReturnToDashboard = () => {
    navigateToView('home');
  };

  const handleBookTransport = () => {
    navigateToView('booking');
  };

  return (
    <div className={styles.container}>
      {/* Success Header - Logo removed for cleaner interface */}
      <div className={styles.header}>
        <div className={styles.successIcon}>
          <div className={`${styles.checkmark} ${showConfetti ? styles.animate : ''}`}>
            ✓
          </div>
        </div>
        <h1 className={styles.title}>Assessment Complete!</h1>
        <p className={styles.subtitle}>
          Your venue security plan is being prepared
        </p>
      </div>

      {/* Reference Information */}
      {assessment && (
        <div className={styles.referenceSection}>
          <div className={styles.referenceCard}>
            <h2 className={styles.referenceTitle}>Your Reference Number</h2>
            <div className={styles.referenceNumber}>
              {assessment.referenceNumber}
            </div>
            <p className={styles.referenceText}>
              You'll receive a detailed quote within <strong>2 hours</strong>
            </p>
          </div>
        </div>
      )}

      {/* Assessment Summary */}
      {assessment && assessment.quote && (
        <div className={styles.summarySection}>
          <h3 className={styles.summaryTitle}>Quote Summary</h3>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Event Type:</span>
              <span className={styles.summaryValue}>
                {formatEventType(assessment.step1)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Duration:</span>
              <span className={styles.summaryValue}>
                {formatDuration(assessment.step2)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Expected Attendance:</span>
              <span className={styles.summaryValue}>
                {assessment.step3} guests
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Service Level:</span>
              <span className={styles.summaryValue}>
                {formatServiceLevel(assessment.step7)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Recommended Officers:</span>
              <span className={styles.summaryValue}>
                {assessment.quote.officers} officers
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span className={styles.totalLabel}>Estimated Total:</span>
              <span className={styles.totalValue}>
                £{assessment.quote.totalEstimate.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className={styles.nextStepsSection}>
        <h3 className={styles.nextStepsTitle}>What Happens Next?</h3>
        <div className={styles.stepsList}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Venue Assessment</h4>
              <p className={styles.stepDescription}>
                Our security specialist will contact you within 2 hours to discuss your requirements
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Detailed Quote</h4>
              <p className={styles.stepDescription}>
                Receive a comprehensive quote with officer assignments and security plan
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Event Security</h4>
              <p className={styles.stepDescription}>
                Our professional officers arrive prepared to provide seamless venue protection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          onClick={handleBookAnotherEvent}
          className={styles.primaryAction}
        >
          Request Another Event
        </Button>

        <div className={styles.secondaryActions}>
          <button
            className={styles.secondaryButton}
            onClick={handleBookTransport}
          >
            Also need secure transport? →
          </button>

          <button
            className={styles.secondaryButton}
            onClick={handleReturnToDashboard}
          >
            Return to Dashboard
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className={styles.contactSection}>
        <h4 className={styles.contactTitle}>Need Immediate Assistance?</h4>
        <p className={styles.contactText}>
          Our venue protection specialists are available 24/7
        </p>
        <div className={styles.contactDetails}>
          <a href="tel:+442071234567" className={styles.contactLink}>
            📞 +44 20 7123 4567
          </a>
          <a href="mailto:venue.protection@armora.security" className={styles.contactLink}>
            ✉️ venue.protection@armora.security
          </a>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatEventType(eventType: string): string {
  const types: { [key: string]: string } = {
    'wedding': 'Wedding',
    'corporate': 'Corporate Event',
    'private-party': 'Private Party',
    'conference': 'Conference/Summit',
    'gala': 'Gala/Charity Event',
    'political': 'Political Event',
    'entertainment': 'Entertainment Event',
    'other': 'Other'
  };
  return types[eventType] || eventType;
}

function formatDuration(duration: string): string {
  const durations: { [key: string]: string } = {
    'single-day': 'Single Day',
    '2-days': '2 Days',
    'weekend': 'Weekend',
    'week': 'One Week',
    'month': 'Monthly Coverage',
    'custom': 'Custom Duration'
  };
  return durations[duration] || duration;
}

function formatServiceLevel(level: string): string {
  const levels: { [key: string]: string } = {
    'standard': 'Standard Protection',
    'executive': 'Executive Protection',
    'elite': 'Elite Protection'
  };
  return levels[level] || level;
}