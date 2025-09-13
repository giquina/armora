import React, { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import styles from './SchedulingPicker.module.css';

interface SchedulingPickerProps {
  selectedDateTime: string; // ISO string or empty
  onDateTimeChange: (dateTime: string) => void;
  disabled?: boolean;
  label?: string;
}

export function SchedulingPicker({
  selectedDateTime,
  onDateTimeChange,
  disabled = false,
  label = 'Select date and time'
}: SchedulingPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Parse existing dateTime on mount or when it changes
  useEffect(() => {
    if (selectedDateTime) {
      const date = new Date(selectedDateTime);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        setSelectedTime(timeString);
      }
    } else {
      setSelectedDate(null);
      setSelectedTime('');
    }
  }, [selectedDateTime]);

  // Combine date and time into ISO string
  const combineDateTime = (date: Date | null, time: string) => {
    if (!date || !time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);

    return combined.toISOString();
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

  // Get min and max dates (tomorrow to 30 days ahead)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate;
  };

  const formatFinalDisplay = () => {
    if (!selectedDate || !selectedTime) return null;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const combined = new Date(selectedDate);
    combined.setHours(hours, minutes, 0, 0);

    return combined.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      <div className={styles.pickerGrid}>
        <div className={styles.pickerSection}>
          <label className={styles.pickerLabel}>
            <span className={styles.pickerIcon}>📅</span>
            Date
          </label>
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={getMinDate()}
            maxDate={getMaxDate()}
            disabled={disabled}
          />
        </div>

        <div className={styles.pickerSection}>
          <label className={styles.pickerLabel}>
            <span className={styles.pickerIcon}>🕐</span>
            Time
          </label>
          <TimePicker
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            disabled={disabled || !selectedDate}
            placeholder={selectedDate ? 'Select time' : 'Select date first'}
          />
        </div>
      </div>

      {formatFinalDisplay() && (
        <div className={styles.confirmation}>
          <div className={styles.confirmationIcon}>✅</div>
          <div className={styles.confirmationText}>
            <strong>Pickup scheduled for:</strong>
            <br />
            {formatFinalDisplay()}
          </div>
        </div>
      )}

      <div className={styles.helpText}>
        <div className={styles.helpItem}>
          <span className={styles.helpIcon}>ℹ️</span>
          <span>Minimum: Tomorrow at any time</span>
        </div>
        <div className={styles.helpItem}>
          <span className={styles.helpIcon}>📆</span>
          <span>Maximum: 30 days in advance</span>
        </div>
        <div className={styles.helpItem}>
          <span className={styles.helpIcon}>🚗</span>
          <span>Officer arrives 5-10 minutes early</span>
        </div>
      </div>
    </div>
  );
}