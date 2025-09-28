import { useEffect, useState } from 'react';
import { ProtectionAssignmentData, PaymentIntent } from '../../types';
import { Button } from '../UI/Button';
// Logo removed - keeping pages clean and focused
import styles from './PaymentSuccess.module.css';

interface PaymentSuccessProps {
  protectionAssignmentData: ProtectionAssignmentData;
  paymentIntent: PaymentIntent;
  onContinue: () => void;
  onDownloadReceipt?: () => void;
}

export function PaymentSuccess({
  protectionAssignmentData,
  paymentIntent,
  onContinue,
  onDownloadReceipt
}: PaymentSuccessProps) {
  const [bookingId] = useState(`ARV-${Date.now().toString().slice(-6)}`);
  const [estimatedArrival, setEstimatedArrival] = useState('');

  useEffect(() => {
    // Calculate estimated arrival time
    const now = new Date();
    if (protectionAssignmentData.scheduledDateTime) {
      setEstimatedArrival(new Date(protectionAssignmentData.scheduledDateTime).toLocaleString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    } else {
      // Add 8 minutes for immediate protection assignment
      now.setMinutes(now.getMinutes() + 8);
      setEstimatedArrival(now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    }

    // Send confirmation analytics
    console.log('Payment successful', {
      bookingId,
      amount: paymentIntent.amount,
      service: protectionAssignmentData.service.id,
      paymentMethod: paymentIntent.paymentMethod?.type || 'card',
      timestamp: Date.now()
    });
  }, [protectionAssignmentData, paymentIntent, bookingId]);

  const formatCurrency = (amount: number): string => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const getServiceEmoji = (serviceId: string): string => {
    switch (serviceId) {
      case 'standard': return '🛡️';
      case 'executive': return '👑';
      case 'shadow': return '🕴️';
      default: return '🚗';
    }
  };

  return (
    <div className={styles.container}>
      {/* Success Animation */}
      <div className={styles.successAnimation}>
        <div className={styles.checkmark}>✓</div>
      </div>

      {/* Header - Logo removed for cleaner interface */}
      <div className={styles.header}>
        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.subtitle}>Your security transport is confirmed</p>
      </div>

      {/* Assignment Details Card */}
      <div className={styles.bookingCard}>
        <div className={styles.cardHeader}>
          <div className={styles.bookingInfo}>
            <h2 className={styles.bookingTitle}>
              {getServiceEmoji(protectionAssignmentData.service.id)} {protectionAssignmentData.service.name}
            </h2>
            <div className={styles.bookingId}>Assignment ID: {bookingId}</div>
          </div>
          <div className={styles.paymentAmount}>
            {formatCurrency(paymentIntent.amount)}
          </div>
        </div>

        <div className={styles.journeyDetails}>
          <div className={styles.journeyRoute}>
            <div className={styles.routePoint}>
              <span className={styles.routeIcon}>📍</span>
              <div className={styles.routeInfo}>
                <div className={styles.routeLabel}>commencement</div>
                <div className={styles.routeAddress}>{protectionAssignmentData.commencementPoint}</div>
              </div>
            </div>

            <div className={styles.routeLine}></div>

            <div className={styles.routePoint}>
              <span className={styles.routeIcon}>🏁</span>
              <div className={styles.routeInfo}>
                <div className={styles.routeLabel}>Destination</div>
                <div className={styles.routeAddress}>{protectionAssignmentData.secureDestination}</div>
              </div>
            </div>
          </div>

          <div className={styles.journeyMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Distance:</span>
              <span className={styles.metaValue}>{protectionAssignmentData.estimatedDistance} miles</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Duration:</span>
              <span className={styles.metaValue}>{Math.floor(protectionAssignmentData.estimatedDuration / 60)}h {protectionAssignmentData.estimatedDuration % 60}m</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Arrival:</span>
              <span className={styles.metaValue}>{estimatedArrival}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Updates */}
      <div className={styles.statusCard}>
        <h3 className={styles.statusTitle}>What happens next?</h3>
        <div className={styles.statusList}>
          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>🔍</div>
            <div className={styles.statusText}>
              <div className={styles.statusStep}>Protection Officer Assignment</div>
              <div className={styles.statusDesc}>Our security team is matching you with a qualified Protection Officer</div>
            </div>
          </div>

          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>📱</div>
            <div className={styles.statusText}>
              <div className={styles.statusStep}>SMS Confirmation</div>
              <div className={styles.statusDesc}>You'll receive Protection Officer details and vehicle information</div>
            </div>
          </div>

          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>🚗</div>
            <div className={styles.statusText}>
              <div className={styles.statusStep}>Vehicle Dispatch</div>
              <div className={styles.statusDesc}>Your security transport will arrive as scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className={styles.supportCard}>
        <h3 className={styles.supportTitle}>Need assistance?</h3>
        <div className={styles.supportContact}>
          <div className={styles.contactMethod}>
            <span className={styles.contactIcon}>📞</span>
            <div className={styles.contactInfo}>
              <div className={styles.contactLabel}>24/7 Operations Center</div>
              <a href="tel:+442071234567" className={styles.contactValue}>
                +44 20 7123 4567
              </a>
            </div>
          </div>

          <div className={styles.contactMethod}>
            <span className={styles.contactIcon}>💬</span>
            <div className={styles.contactInfo}>
              <div className={styles.contactLabel}>Live Support Chat</div>
              <div className={styles.contactValue}>Available in app</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        {onDownloadReceipt && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onDownloadReceipt}
            className={styles.receiptButton}
          >
            📄 Download Receipt
          </Button>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={onContinue}
          className={styles.continueButton}
          isFullWidth
        >
          Return to Dashboard
        </Button>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.paymentSecure}>
          <span className={styles.secureIcon}>🔒</span>
          <span className={styles.secureText}>Payment secured by Stripe • PCI DSS compliant</span>
        </div>

        <div className={styles.confirmationNote}>
          A confirmation email has been sent to {protectionAssignmentData.user?.email || 'your registered email address'}
        </div>
      </div>
    </div>
  );
}