import React, { useState } from 'react';
import styles from './ExtendTimeModal.module.css';

interface ExtendTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (duration: number, reason?: string) => void;
  currentRate: number;
  officerAvailableUntil: string;
}

const QUICK_EXTENSIONS = [
  { duration: 0.5, label: '+30 mins' },
  { duration: 1, label: '+1 hour' },
  { duration: 2, label: '+2 hours' }
];

const EXTENSION_REASONS = [
  '📋 Meeting extended',
  '🛍️ Additional stop',
  '🚦 Traffic delay',
  '🛡️ Prefer continued protection'
];

export function ExtendTimeModal({
  isOpen,
  onClose,
  onConfirm,
  currentRate,
  officerAvailableUntil
}: ExtendTimeModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(0.5);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customDuration, setCustomDuration] = useState<number>(0.5);
  const [useCustomDuration, setUseCustomDuration] = useState(false);

  if (!isOpen) return null;

  const getCurrentEndTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Assume current end is 30 mins from now
    return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getNewEndTime = (duration: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30 + (duration * 60)); // Current end + extension
    return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateCost = (duration: number) => {
    return Math.round(currentRate * duration);
  };

  const handleConfirm = () => {
    const finalDuration = useCustomDuration ? customDuration : selectedDuration;
    onConfirm(finalDuration, selectedReason);

    // Reset form
    setSelectedDuration(0.5);
    setSelectedReason('');
    setCustomDuration(0.5);
    setUseCustomDuration(false);
  };

  const finalDuration = useCustomDuration ? customDuration : selectedDuration;
  const totalCost = calculateCost(finalDuration);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.titleIcon}>⏰</span>
            EXTEND PROTECTION
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {/* Current Status */}
          <div className={styles.statusSection}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Current end:</span>
              <span className={styles.statusValue}>{getCurrentEndTime()}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>CPO available until:</span>
              <span className={styles.statusValue}>
                {officerAvailableUntil} <span className={styles.statusSuccess}>✓</span>
              </span>
            </div>
          </div>

          {/* Quick Extensions */}
          <div className={styles.quickSection}>
            <h3 className={styles.sectionTitle}>Quick extend:</h3>
            <div className={styles.quickGrid}>
              {QUICK_EXTENSIONS.map((option) => (
                <button
                  key={option.duration}
                  className={`${styles.quickButton} ${!useCustomDuration && selectedDuration === option.duration ? styles.quickSelected : ''}`}
                  onClick={() => {
                    setSelectedDuration(option.duration);
                    setUseCustomDuration(false);
                  }}
                >
                  <div className={styles.quickLabel}>{option.label}</div>
                  <div className={styles.quickPrice}>£{calculateCost(option.duration)}.00</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration */}
          <div className={styles.customSection}>
            <h3 className={styles.sectionTitle}>Custom duration:</h3>
            <div className={styles.customDurationControl}>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={customDuration}
                onChange={(e) => {
                  setCustomDuration(parseFloat(e.target.value));
                  setUseCustomDuration(true);
                }}
                className={styles.durationSlider}
              />
              <div className={styles.durationLabels}>
                <span>30m</span>
                <span className={styles.durationValue}>
                  {customDuration === 1 ? '1 hour' : `${customDuration}${customDuration < 1 ? ' hours' : ' hours'}`}
                </span>
                <span>6h</span>
              </div>
            </div>
          </div>

          {/* Extension Preview */}
          <div className={styles.previewSection}>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>New end time:</span>
              <span className={styles.previewValue}>{getNewEndTime(finalDuration)}</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>Extension cost:</span>
              <span className={styles.previewValue}>£{totalCost}.00</span>
            </div>
          </div>

          {/* Reason Selection */}
          <div className={styles.reasonSection}>
            <h3 className={styles.sectionTitle}>Reason (optional):</h3>
            <div className={styles.reasonGrid}>
              {EXTENSION_REASONS.map((reason) => (
                <button
                  key={reason}
                  className={`${styles.reasonButton} ${selectedReason === reason ? styles.reasonSelected : ''}`}
                  onClick={() => setSelectedReason(selectedReason === reason ? '' : reason)}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.totalSection}>
            <div className={styles.totalLabel}>Total:</div>
            <div className={styles.totalValue}>£{totalCost}.00</div>
          </div>

          <div className={styles.footerButtons}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              <span className={styles.confirmIcon}>⏰</span>
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}