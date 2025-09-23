import React, { useState } from 'react';
import styles from './AssistanceRequestModal.module.css';

interface AssistanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reason: string, message?: string) => void;
  officerName: string;
}

const ASSISTANCE_REASONS = [
  { id: 'emergency', label: '🚨 Need immediate help', icon: '🚨', color: 'red', priority: 'emergency' },
  { id: 'unsafe', label: '⚠️ Feeling unsafe', icon: '⚠️', color: 'orange', priority: 'urgent' },
  { id: 'presence', label: '🤝 Request officer presence', icon: '🤝', color: 'yellow', priority: 'standard' },
  { id: 'update', label: 'ℹ️ Update instructions', icon: 'ℹ️', color: 'blue', priority: 'informational' },
  { id: 'other', label: '💬 Other concern', icon: '💬', color: 'gray', priority: 'general' }
];

export function AssistanceRequestModal({
  isOpen,
  onClose,
  onSend,
  officerName
}: AssistanceRequestModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!selectedReason) return;

    setIsSending(true);

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSend(selectedReason, customMessage);
    setIsSending(false);

    // Reset form
    setSelectedReason('');
    setCustomMessage('');
  };

  const handleClose = () => {
    if (isSending) return; // Prevent closing while sending
    setSelectedReason('');
    setCustomMessage('');
    onClose();
  };

  if (isSending) {
    return (
      <div className={styles.modalOverlay} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContent}>
          <div className={styles.sendingState}>
            <div className={styles.sendingIcon}>🔔</div>
            <h3 className={styles.sendingTitle}>Sending Signal...</h3>
            <p className={styles.sendingText}>
              Notifying {officerName} of your<br />
              assistance request
            </p>
            <div className={styles.loadingSpinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.titleIcon}>🔔</span>
            ASSISTANCE REQUEST
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.officerInfo}>
            <p className={styles.officerText}>
              Sending discrete signal to:<br />
              <strong>Protection Officer {officerName}</strong>
            </p>
          </div>

          <div className={styles.reasonSection}>
            <h3 className={styles.sectionTitle}>How can your protection officer help?</h3>

            <div className={styles.reasonGrid}>
              {ASSISTANCE_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  className={`${styles.reasonButton} ${selectedReason === reason.id ? styles.reasonSelected : ''}`}
                  onClick={() => setSelectedReason(reason.id)}
                  data-priority={reason.priority}
                >
                  <span className={styles.reasonIcon}>{reason.icon}</span>
                  <span className={styles.reasonLabel}>{reason.label.replace(/^.+ /, '')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.messageSection}>
            <label className={styles.messageLabel}>Optional message:</label>
            <textarea
              className={styles.messageInput}
              placeholder="Additional details for your protection officer (optional)"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <div className={styles.charCount}>{customMessage.length}/200</div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.sendButton} ${!selectedReason ? styles.sendDisabled : ''}`}
            onClick={handleSend}
            disabled={!selectedReason}
          >
            <span className={styles.sendIcon}>🔔</span>
            SEND SIGNAL
          </button>
        </div>

        <div className={styles.disclaimerText}>
          This sends a discrete notification to your protection officer. For emergencies, call 999 directly.
        </div>
      </div>
    </div>
  );
}