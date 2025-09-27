import { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';
import { CompactTimePicker } from './CompactTimePicker';
import styles from './CompactSchedulingPicker.module.css';

interface CompactSchedulingPickerProps {
  selectedDateTime: string; // ISO string or empty
  onDateTimeChange: (dateTime: string) => void;
  disabled?: boolean;
  label?: string;
  autoOpen?: boolean;
  onSchedulingToggle?: (isScheduled: boolean) => void;
}

export function CompactSchedulingPicker({
  selectedDateTime,
  onDateTimeChange,
  disabled = false,
  label = 'Schedule Commencement Point time',
  autoOpen = false,
  onSchedulingToggle
}: CompactSchedulingPickerProps) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse existing dateTime on mount or when it changes
  useEffect(() => {
    if (selectedDateTime) {
      const date = new Date(selectedDateTime);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        setSelectedTime(timeString);
        setIsScheduled(true);
        setIsExpanded(true);
      }
    } else {
      setSelectedDate(null);
      setSelectedTime('');
      setIsScheduled(false);
      setIsExpanded(false);
    }
  }, [selectedDateTime]);

  // Auto-open when scheduling is enabled
  useEffect(() => {
    if (isScheduled && autoOpen) {
      setIsExpanded(true);
    }
  }, [isScheduled, autoOpen]);

  // Combine date and time into ISO string
  const combineDateTime = (date: Date | null, time: string) => {
    if (!date || !time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);

    return combined.toISOString();
  };

  const handleSchedulingToggle = (checked: boolean) => {
    setIsScheduled(checked);
    setIsExpanded(checked);

    if (checked) {
      // Auto-select tomorrow if no date selected
      if (!selectedDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow);
      }

      // If no time selected, the CompactTimePicker will auto-set default time
      if (!selectedTime) {
        // The CompactTimePicker will handle the default time setting
      }
    } else {
      // Clear scheduling
      setSelectedDate(null);
      setSelectedTime('');
      onDateTimeChange('');
    }

    onSchedulingToggle?.(checked);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const combined = combineDateTime(date, selectedTime);
    onDateTimeChange(combined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const combined = combineDateTime(selectedDate, time);
    onDateTimeChange(combined);
  };

  // Get min and max dates (today for current time + 15 min, tomorrow for future times)
  const getMinDate = () => {
    const now = new Date();

    // If it's late in the day (after 11:30 PM), start from tomorrow
    if (now.getHours() >= 23 && now.getMinutes() >= 30) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    }

    // Otherwise allow today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate;
  };

  const validateTime = (selectedDate: Date, selectedTime: string): boolean => {
    if (!selectedDate || !selectedTime) return false;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const minimumTime = new Date(now.getTime() + 15 * 60000); // 15 minutes from now

    return selectedDateTime >= minimumTime;
  };

  const formatFinalDisplay = () => {
    if (!selectedDate || !selectedTime) return null;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const combined = new Date(selectedDate);
    combined.setHours(hours, minutes, 0, 0);

    return combined.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isValidSelection = selectedDate && selectedTime && validateTime(selectedDate, selectedTime);

  return (
    <div className={styles.container}>
      <div className={styles.toggleSection}>
        <label className={styles.toggleContainer}>
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => handleSchedulingToggle(e.target.checked)}
            disabled={disabled}
            className={styles.toggleInput}
          />
          <div className={styles.toggleSwitch}>
            <div className={styles.toggleSlider}></div>
          </div>
          <span className={styles.toggleLabel}>{label}</span>
        </label>
      </div>

      {isScheduled && (
        <div className={`${styles.schedulingPanel} ${isExpanded ? styles.expanded : ''}`}>
          {/* Date Selection */}
          <div className={styles.dateSection}>
            <label className={styles.dateLabel}>Date:</label>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              disabled={disabled}
            />
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className={styles.timeSection}>
              <CompactTimePicker
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                disabled={disabled}
                label="Time:"
              />
            </div>
          )}

          {/* Validation Messages */}
          {selectedDate && selectedTime && !validateTime(selectedDate, selectedTime) && (
            <div className={styles.validationError}>
              <span className={styles.errorIcon}>⚠️</span>
              <span>Please select a time at least 15 minutes from now</span>
            </div>
          )}

          {/* Confirmation Display */}
          {isValidSelection && (
            <div className={styles.confirmation}>
              <div className={styles.confirmationIcon}>✅</div>
              <div className={styles.confirmationText}>
                <strong>Scheduled for:</strong> {formatFinalDisplay()}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className={styles.helpText}>
            <div className={styles.helpItem}>
              <span className={styles.helpIcon}>ℹ️</span>
              <span>Officer arrives 5-10 minutes early</span>
            </div>
            {selectedDate && (
              <div className={styles.helpItem}>
                <span className={styles.helpIcon}>📱</span>
                <span>You'll receive SMS confirmation</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}