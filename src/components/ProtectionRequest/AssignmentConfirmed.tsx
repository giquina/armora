import { useState, useEffect } from 'react';
import styles from './AssignmentConfirmed.module.css';

interface AssignmentConfirmedProps {
  assignmentId?: string;
  onClose: () => void;
  onTrackAssignment?: () => void;
  onNewAssignment?: () => void;
}

interface AssignmentData {
  selectedService: string;
  serviceName: string;
  serviceRate: string;
  secureDestination: string;
  commencementTime: string;
  scheduledDateTime?: string;
  isImmediate: boolean;
  estimatedServiceFee: number;
  originalServiceFee: number;
  discountApplied: boolean;
  discountAmount: number;
  createdAt: string;
  user?: any;
}

export function AssignmentConfirmed({
  assignmentId,
  onClose,
  onTrackAssignment,
  onNewAssignment
}: AssignmentConfirmedProps) {
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);
  const [assignmentReference, setAssignmentReference] = useState<string>('');
  const [cpoETA, setCpoETA] = useState<string>('');
  // Removed unused state variables for cleaner TypeScript compilation

  useEffect(() => {
    // Load assignment data from localStorage
    const savedData = localStorage.getItem('armora_assignment_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setAssignmentData(data);
      } catch (error) {
        console.warn('Failed to load assignment data:', error);
      }
    }

    // Generate assignment reference
    const reference = assignmentId || `ARM-${Date.now().toString().slice(-6)}`;
    setAssignmentReference(reference);

    // Calculate CPO ETA based on service type and time
    calculateCpoETA(assignmentData?.selectedService);

    // Store assignment in history
    storeAssignmentHistory(reference);
  }, [assignmentId, assignmentData?.selectedService]);

  const calculateCpoETA = (serviceType?: string) => {
    if (!assignmentData?.isImmediate) {
      setCpoETA('As scheduled');
      return;
    }

    const responseTimeMap: { [key: string]: string } = {
      'essential': '2-4 minutes',
      'executive': '3-5 minutes',
      'shadow': '5-8 minutes',
      'client-vehicle': '4-6 minutes'
    };

    const eta = responseTimeMap[serviceType || 'essential'] || '2-4 minutes';
    setCpoETA(eta);
  };

  const storeAssignmentHistory = (reference: string) => {
    if (!assignmentData) return;

    const historyItem = {
      id: reference,
      serviceName: assignmentData.serviceName,
      destination: assignmentData.secureDestination,
      serviceFee: assignmentData.estimatedServiceFee,
      createdAt: assignmentData.createdAt,
      status: 'confirmed' as const,
      isImmediate: assignmentData.isImmediate
    };

    const existingHistory = JSON.parse(localStorage.getItem('armora_assignment_history') || '[]');
    const updatedHistory = [historyItem, ...existingHistory].slice(0, 20); // Keep last 20
    localStorage.setItem('armora_assignment_history', JSON.stringify(updatedHistory));
  };

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(assignmentReference);
      // Could show a toast notification here
      alert('Assignment reference copied to clipboard');
    } catch (error) {
      console.warn('Failed to copy assignment reference:', error);
      // Fallback: select text for manual copy
      const textArea = document.createElement('textarea');
      textArea.value = assignmentReference;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Assignment reference copied to clipboard');
    }
  };

  const handleShareAssignment = async () => {
    const shareData = {
      title: 'Armora Protection Assignment Confirmed',
      text: `My Close Protection Officer has been deployed. Assignment: ${assignmentReference}`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert('Assignment details copied to clipboard');
      }
    } catch (error) {
      console.warn('Failed to share assignment:', error);
    }
  };

  const formatScheduledTime = () => {
    if (!assignmentData?.scheduledDateTime) return '';
    const date = new Date(assignmentData.scheduledDateTime);
    return date.toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = () => {
    if (assignmentData?.isImmediate) {
      return `Your Close Protection Officer is being deployed and will arrive within ${cpoETA}.`;
    } else {
      return `Your protection assignment has been scheduled for ${formatScheduledTime()}.`;
    }
  };

  if (!assignmentData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Assignment data not found</h2>
          <button className={styles.closeButton} onClick={onClose}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Success Header */}
      <div className={styles.header}>
        <div className={styles.successIcon}>✅</div>
        <h1 className={styles.title}>Protection Assignment Confirmed</h1>
        <p className={styles.subtitle}>Your Close Protection Officer has been deployed</p>
      </div>

      {/* Assignment Reference */}
      <div className={styles.referenceCard}>
        <div className={styles.referenceHeader}>
          <span className={styles.referenceLabel}>Assignment Reference</span>
          <button
            className={styles.copyButton}
            onClick={handleCopyReference}
            title="Copy assignment reference"
          >
            📋 Copy
          </button>
        </div>
        <div className={styles.referenceNumber}>{assignmentReference}</div>
      </div>

      {/* Status Information */}
      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <h3 className={styles.statusTitle}>Assignment Status</h3>
          <div className={styles.statusBadge}>Confirmed</div>
        </div>
        <p className={styles.statusMessage}>{getStatusMessage()}</p>

        {assignmentData.isImmediate && (
          <div className={styles.etaInfo}>
            <div className={styles.etaIcon}>🚗</div>
            <div className={styles.etaDetails}>
              <span className={styles.etaLabel}>CPO Arrival</span>
              <span className={styles.etaTime}>{cpoETA}</span>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Details */}
      <div className={styles.detailsCard}>
        <h3 className={styles.detailsTitle}>Assignment Details</h3>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Protection Level:</span>
          <span className={styles.detailValue}>{assignmentData.serviceName}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Service Rate:</span>
          <span className={styles.detailValue}>{assignmentData.serviceRate}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Secure Destination:</span>
          <span className={styles.detailValue}>{assignmentData.secureDestination}</span>
        </div>

        {assignmentData.scheduledDateTime && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Scheduled Time:</span>
            <span className={styles.detailValue}>{formatScheduledTime()}</span>
          </div>
        )}

        <div className={styles.serviceFeeSummary}>
          <div className={styles.feeRow}>
            <span className={styles.feeLabel}>Service Fee (2hr minimum):</span>
            <span className={styles.feeValue}>
              {assignmentData.discountApplied && (
                <span className={styles.originalFee}>£{assignmentData.originalServiceFee}</span>
              )}
              £{assignmentData.estimatedServiceFee}
            </span>
          </div>
          {assignmentData.discountApplied && (
            <div className={styles.discountRow}>
              <span className={styles.discountLabel}>Member Discount (50%):</span>
              <span className={styles.discountValue}>-£{assignmentData.discountAmount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        {assignmentData.isImmediate && (
          <button
            className={styles.trackButton}
            onClick={onTrackAssignment}
          >
            📍 Track CPO Live
          </button>
        )}

        <button
          className={styles.shareButton}
          onClick={handleShareAssignment}
        >
          📤 Share Assignment
        </button>

        <button
          className={styles.newAssignmentButton}
          onClick={onNewAssignment}
        >
          🛡️ Request New Protection
        </button>
      </div>

      {/* Support Information */}
      <div className={styles.supportCard}>
        <h4 className={styles.supportTitle}>Need Assistance?</h4>
        <div className={styles.supportOptions}>
          <div className={styles.supportOption}>
            <span className={styles.supportIcon}>📞</span>
            <div className={styles.supportDetails}>
              <span className={styles.supportLabel}>24/7 Support</span>
              <span className={styles.supportValue}>0800 ARMORA (276672)</span>
            </div>
          </div>
          <div className={styles.supportOption}>
            <span className={styles.supportIcon}>🆘</span>
            <div className={styles.supportDetails}>
              <span className={styles.supportLabel}>Emergency</span>
              <span className={styles.supportValue}>Press & Hold Panic Button</span>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button className={styles.closeButton} onClick={onClose}>
        Return to Dashboard
      </button>
    </div>
  );
}