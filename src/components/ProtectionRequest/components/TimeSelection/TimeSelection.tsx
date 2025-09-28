import React, { useState } from 'react';
import styles from './TimeSelection.module.css';

export interface TimeOption {
  value: string;
  label: string;
  description: string;
  badge?: string;
  icon?: string;
  popular?: boolean;
}

interface TimeSelectionProps {
  /** Available time options */
  timeOptions: TimeOption[];
  /** Currently selected time option value */
  selectedTime: string;
  /** Time selection change handler */
  onTimeChange: (timeValue: string) => void;
  /** Scheduled date/time value for 'schedule' option */
  scheduledDateTime?: string;
  /** Scheduled date/time change handler */
  onScheduledDateTimeChange?: (dateTime: string) => void;
  /** Minimum date/time for scheduling */
  minDateTime?: string;
  /** Additional CSS classes */
  className?: string;
}

interface TimeOptionButtonProps {
  option: TimeOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

const TimeOptionButton: React.FC<TimeOptionButtonProps> = ({ option, isSelected, onSelect }) => {
  // Format the time display based on option value
  const getTimeDisplay = (optionValue: string, description: string) => {
    if (optionValue === 'schedule') return 'Choose time';

    // Extract time from description (e.g., "Protection commences: 17:54")
    const timeMatch = description.match(/(\d{2}:\d{2})/);
    return timeMatch ? timeMatch[1] : '';
  };

  const timeDisplay = getTimeDisplay(option.value, option.description);
  const hasTimeDisplay = timeDisplay && option.value !== 'schedule';

  return (
    <button
      className={`${styles.timeButton} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(option.value)}
      aria-pressed={isSelected}
    >
      <div className={styles.buttonContent}>
        <div className={styles.buttonHeader}>
          {option.icon && (
            <span className={styles.buttonIcon} role="img" aria-hidden="true">
              {option.icon}
            </span>
          )}
          <span className={styles.buttonLabel}>{option.label}</span>
          {option.badge && option.value === 'now' && (
            <span className={styles.fastestIndicator}></span>
          )}
        </div>

        {hasTimeDisplay && (
          <div className={styles.timeDisplay}>
            {timeDisplay}
          </div>
        )}

        {option.value === 'schedule' && (
          <div className={styles.timeDisplay}>
            {timeDisplay}
          </div>
        )}
      </div>
    </button>
  );
};

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  timeOptions,
  selectedTime,
  onTimeChange,
  scheduledDateTime,
  onScheduledDateTimeChange,
  minDateTime,
  className = ''
}) => {
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(selectedTime === 'schedule');

  // Handle time option selection
  const handleTimeSelect = (timeValue: string) => {
    onTimeChange(timeValue);
    setIsScheduleExpanded(timeValue === 'schedule');
  };

  // Handle scheduled date/time change
  const handleScheduledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onScheduledDateTimeChange) {
      onScheduledDateTimeChange(value);
    }
  };

  // Get current date/time for min value
  const currentDateTime = minDateTime || new Date().toISOString().slice(0, 16);

  return (
    <div className={`${styles.timeSelection} ${className}`}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>When should protection commence?</h3>
      </div>

      {/* Time Options Button Strip */}
      <div className={styles.timeButtonStrip}>
        {timeOptions.map((option) => (
          <TimeOptionButton
            key={option.value}
            option={option}
            isSelected={selectedTime === option.value}
            onSelect={handleTimeSelect}
          />
        ))}
      </div>

      {/* Scheduled Date/Time Picker */}
      {isScheduleExpanded && (
        <div className={styles.schedulePicker}>
          <div className={styles.scheduleHeader}>
            <h3 className={styles.scheduleTitle}>Select Date & Time</h3>
            <p className={styles.scheduleSubtitle}>
              Choose when your protection should begin
            </p>
          </div>

          <div className={styles.dateTimeWrapper}>
            <label htmlFor="scheduled-datetime" className={styles.dateTimeLabel}>
              Protection Start Time
            </label>
            <input
              id="scheduled-datetime"
              type="datetime-local"
              value={scheduledDateTime || ''}
              onChange={handleScheduledChange}
              min={currentDateTime}
              className={styles.dateTimeInput}
              required
            />
          </div>

          {/* Helper Text */}
          <div className={styles.scheduleHelp}>
            <div className={styles.helpItem}>
              <span className={styles.helpIcon}>ℹ️</span>
              <span className={styles.helpText}>
                CPO will be deployed 15 minutes before your scheduled time
              </span>
            </div>
            <div className={styles.helpItem}>
              <span className={styles.helpIcon}>⏰</span>
              <span className={styles.helpText}>
                Minimum 2 hours advance booking required
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {selectedTime && selectedTime !== 'schedule' && (
        <div className={styles.confirmationMessage}>
          <span className={styles.checkIcon}>✓</span>
          <span className={styles.confirmationText}>
            {selectedTime === 'now' && 'Your protection officer will arrive within 2-4 minutes'}
            {selectedTime === '30min' && 'Your protection officer will arrive by ' +
              timeOptions.find(opt => opt.value === '30min')?.description.match(/(\d{2}:\d{2})/)?.[1]}
            {selectedTime === '1hour' && 'Your protection officer will arrive by ' +
              timeOptions.find(opt => opt.value === '1hour')?.description.match(/(\d{2}:\d{2})/)?.[1]}
          </span>
        </div>
      )}

      {selectedTime === 'schedule' && scheduledDateTime && (
        <div className={styles.confirmationMessage}>
          <span className={styles.checkIcon}>✓</span>
          <span className={styles.confirmationText}>
            Protection scheduled for {new Date(scheduledDateTime).toLocaleString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}
    </div>
  );
};