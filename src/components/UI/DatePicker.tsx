import React from 'react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  selectedDate?: Date | null;
  onDateSelect: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  className = '',
  disabled = false
}: DatePickerProps) {
  // Convert Date objects to string format for input
  const dateToString = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Generate today's date as minimum if not provided
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultMinDate = minDate || today;
  
  // Generate max date (30 days from now if not provided)
  const defaultMaxDate = maxDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    if (dateString) {
      const newDate = new Date(dateString + 'T00:00:00');
      onDateSelect(newDate);
    } else {
      onDateSelect(null);
    }
  };

  const formatDisplayDate = (date: Date | null | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className={`${styles.datePicker} ${className}`}>
      <div className={styles.inputWrapper}>
        <input
          type="date"
          value={dateToString(selectedDate)}
          onChange={handleDateChange}
          min={dateToString(defaultMinDate)}
          max={dateToString(defaultMaxDate)}
          disabled={disabled}
          className={styles.dateInput}
          aria-label="Select date"
        />
        <div className={styles.displayValue}>
          {formatDisplayDate(selectedDate)}
        </div>
        <div className={styles.calendarIcon} aria-hidden="true">
          📅
        </div>
      </div>
    </div>
  );
}