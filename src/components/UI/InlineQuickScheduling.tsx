import { useState, useEffect } from 'react';
import { Button } from './Button';
import styles from './InlineQuickScheduling.module.css';

interface TimePreset {
  id: string;
  label: string;
  value: string; // ISO string
  icon: string;
}

interface InlineQuickSchedulingProps {
  onTimeSelected: (dateTime: string, displayText: string) => void;
  onBookNow: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  userProfile?: {
    isBusinessUser?: boolean;
    preferredTime?: string;
  };
}

export function InlineQuickScheduling({
  onTimeSelected,
  onBookNow,
  onCancel,
  isLoading = false,
  userProfile
}: InlineQuickSchedulingProps) {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDisplayText, setSelectedDisplayText] = useState<string>('');

  // Generate smart time presets
  const generateTimePresets = (): TimePreset[] => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        id: 'now',
        label: 'Now',
        value: 'immediate',
        icon: '⚡'
      },
      {
        id: '15min',
        label: '+15 min',
        value: new Date(now.getTime() + 15 * 60000).toISOString(),
        icon: '⏰'
      },
      {
        id: '30min',
        label: '+30 min',
        value: new Date(now.getTime() + 30 * 60000).toISOString(),
        icon: '⏱️'
      },
      {
        id: '1hour',
        label: '+1 hour',
        value: new Date(now.getTime() + 60 * 60000).toISOString(),
        icon: '🕐'
      },
      {
        id: 'custom',
        label: 'Pick Time',
        value: 'custom',
        icon: '📅'
      }
    ];
  };

  const timePresets = generateTimePresets();

  // Auto-select default based on user profile
  useEffect(() => {
    if (userProfile?.isBusinessUser) {
      // Business users typically request protection ahead
      const oneHourPreset = timePresets.find(p => p.id === '1hour');
      if (oneHourPreset) {
        handleTimeSelect(oneHourPreset);
      }
    } else {
      // Regular users often want immediate protection assignment
      const nowPreset = timePresets.find(p => p.id === 'now');
      if (nowPreset) {
        handleTimeSelect(nowPreset);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleTimeSelect = (preset: TimePreset) => {

    if (preset.id === 'custom') {
      // Handle custom time selection - for now, show placeholder
      setSelectedTime('custom');
      setSelectedDisplayText('Custom time selection (Coming Soon)');
      onTimeSelected('custom', 'Custom time selection');
      return;
    }

    setSelectedTime(preset.value);

    let displayText = '';
    if (preset.value === 'immediate') {
      displayText = 'Immediate Commencement Point';
    } else {
      const date = new Date(preset.value);
      displayText = `Commencement Point at ${date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    setSelectedDisplayText(displayText);
    onTimeSelected(preset.value, displayText);
  };

  const handleBooking = () => {
    if (selectedTime) {
      onBookNow();
    }
  };

  return (
    <div className={styles.inlineScheduling}>
      {/* Header */}
      <div className={styles.header}>
        <h4 className={styles.title}>When do you need Commencement Point?</h4>
        <button
          className={styles.closeButton}
          onClick={onCancel}
          aria-label="Close scheduling"
        >
          ×
        </button>
      </div>

      {/* Horizontal Time Slots - One Click Selection */}
      <div className={styles.timeSlots}>
        {timePresets.map((preset) => (
          <button
            key={preset.id}
            className={`${styles.timeButton} ${
              selectedTime === preset.value || (selectedTime === 'custom' && preset.id === 'custom') ? styles.selected : ''
            }`}
            onClick={() => handleTimeSelect(preset)}
            disabled={false} // Enable all buttons including Pick Time
          >
            <span className={styles.timeIcon}>{preset.icon}</span>
            <span className={styles.timeLabel}>{preset.label}</span>
            {preset.id === 'custom' && (
              <span className={styles.comingSoon}>Beta</span>
            )}
          </button>
        ))}
      </div>

      {/* Selection Confirmation */}
      {selectedTime && selectedDisplayText && (
        <div className={styles.confirmation}>
          <div className={styles.confirmationIcon}>✓</div>
          <span className={styles.confirmationText}>
            {selectedDisplayText}
          </span>
        </div>
      )}

      {/* Action Button */}
      <div className={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          isFullWidth
          onClick={handleBooking}
          disabled={!selectedTime || isLoading}
          className={styles.bookButton}
        >
          {isLoading ? (
            <>
              <span className={styles.loadingSpinner}>⏳</span>
              Confirming...
            </>
          ) : (
            <>
              <span className={styles.buttonIcon}>🚗</span>
              {selectedTime === 'immediate' ? 'Request CPO' : 'Schedule Service'}
            </>
          )}
        </Button>
      </div>

      {/* Quick Benefits */}
      <div className={styles.benefits}>
        <div className={styles.benefitItem}>
          <span className={styles.benefitIcon}>⚡</span>
          <span className={styles.benefitText}>Instant confirmation</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.benefitIcon}>📱</span>
          <span className={styles.benefitText}>SMS updates</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.benefitIcon}>🔄</span>
          <span className={styles.benefitText}>Easy to change</span>
        </div>
      </div>
    </div>
  );
}