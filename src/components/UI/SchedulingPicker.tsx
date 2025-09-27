import { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import styles from './SchedulingPicker.module.css';

interface SchedulingPickerProps {
  selectedDateTime: string; // ISO string or empty
  onDateTimeChange: (dateTime: string) => void;
  disabled?: boolean;
  label?: string;
  autoExpandCalendar?: boolean; // New prop for auto-expanding calendar
  /**
   * alwaysExpanded: if true, the date calendar is always shown in its full form
   * (not minimized after selection) and the time selection is visible immediately.
   * This reduces the number of clicks for power users (e.g. dashboard scheduling modal).
   */
  alwaysExpanded?: boolean;
  /**
   * autoShowTime: when used with alwaysExpanded, optionally show the time picker
   * right away even before a date is chosen. We still enforce date selection before
   * producing a combined ISO string.
   */
  autoShowTime?: boolean;
  /**
   * autoSelectEarliestTime: when true and a date is (auto)selected, choose the earliest
   * available logical time slot automatically (reduces one more click). This will not
   * overwrite an existing selectedTime.
   */
  autoSelectEarliestTime?: boolean;
  /**
   * styleVariant: 'progressive' keeps the existing rich guided experience.
   * 'condensed' presents a minimalist two-row layout (Date + Time) inspired by
   * rideshare pickers but still branded Armora.
   */
  styleVariant?: 'progressive' | 'condensed';
}

export function SchedulingPicker({
  selectedDateTime,
  onDateTimeChange,
  disabled = false,
  label = 'Select date and time',
  autoExpandCalendar = false,
  alwaysExpanded = false,
  autoShowTime = false,
  autoSelectEarliestTime = false
  ,styleVariant = 'progressive'
}: SchedulingPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [calendarMinimized, setCalendarMinimized] = useState(false); // collapsed summary view after date chosen
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  // New optional fast-path: auto-select earliest time slot for chosen date
  // Accept (for future) an earliest time selection - for now we compute internally
  const AUTO_INTERVAL_MINUTES = 15;

  // Parse existing dateTime on mount or when it changes
  useEffect(() => {
    if (selectedDateTime) {
      const date = new Date(selectedDateTime);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        setSelectedTime(timeString);
        // If we have both date and time, show minimized view
        setCalendarMinimized(!alwaysExpanded);
        setShowTimeSelection(true);
      }
    } else {
      // Auto-select tomorrow if autoExpandCalendar is enabled and no date is selected
      if (autoExpandCalendar) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        setSelectedDate(tomorrow);
        // Don't auto-select time - let user choose
        // Start with calendar expanded for initial selection
        setCalendarMinimized(false);
        setShowTimeSelection(alwaysExpanded && autoShowTime);
      } else {
        setSelectedDate(null);
        setSelectedTime('');
        setCalendarMinimized(false);
        setShowTimeSelection(alwaysExpanded && autoShowTime);
      }
    }
  }, [selectedDateTime, autoExpandCalendar, alwaysExpanded, autoShowTime]);

  // Auto-select earliest time once we have a date but no time yet
  useEffect(() => {
    if (autoSelectEarliestTime && selectedDate && !selectedTime) {
      const earliest = computeEarliestTimeForDate(selectedDate);
      setSelectedTime(earliest);
      const combined = combineDateTime(selectedDate, earliest);
      onDateTimeChange(combined);
    }
  }, [autoSelectEarliestTime, selectedDate, selectedTime, onDateTimeChange]);

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
    if (alwaysExpanded) {
      // Keep calendar visible; optionally show time immediately
      setCalendarMinimized(false);
      setShowTimeSelection(true);
    } else {
      // Implement progressive disclosure: minimize calendar after date selection
      setCalendarMinimized(true);
      setShowTimeSelection(true);
    }
    const combined = combineDateTime(date, selectedTime);
    onDateTimeChange(combined);
  };

  const handleDateEdit = () => {
    // Re-expand calendar for date editing
    if (!alwaysExpanded) {
      setCalendarMinimized(false);
      setShowTimeSelection(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const combined = combineDateTime(selectedDate, time);
    onDateTimeChange(combined);
  };

  // Helper: compute earliest selectable time (next 15-min block) if date is today+1 or future
  const computeEarliestTimeForDate = (date: Date): string => {
    const now = new Date();
    // If scheduling for tomorrow or any future day: first slot 06:00 (example baseline) to encourage daytime scheduling
    // (Assumption: operating hours 00:00-23:45; adjust if business rules change.)
    if (date.getDate() !== now.getDate() || date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) {
      return '06:00';
    }
    // Same-day (should rarely happen since min is tomorrow) fallback: next 30 min
    const candidate = new Date(now.getTime() + 30 * 60000);
    const minutes = candidate.getMinutes();
    const rounded = Math.ceil(minutes / AUTO_INTERVAL_MINUTES) * AUTO_INTERVAL_MINUTES;
    candidate.setMinutes(rounded, 0, 0);
    const hh = candidate.getHours().toString().padStart(2, '0');
    const mm = candidate.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
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

  // =============== Condensed Variant ==================
  if (styleVariant === 'condensed') {
    return (
      <div className={`${styles.container} ${styles.condensed}`}>        
        <div className={styles.condensedRow}>
          <button
            type="button"
            className={styles.condensedTrigger}
            onClick={() => handleDateEdit()}
            disabled={disabled}
            aria-label="Select date"
          >
            <span className={styles.condensedIcon}>📅</span>
            <span className={styles.condensedPrimaryText}>{selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'}) : 'Pick Date'}</span>
            <span className={styles.condensedChevron}>▾</span>
          </button>
          {!calendarMinimized || !selectedDate ? (
            <div className={styles.inlinePanel}>
              <DatePicker
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                minDate={getMinDate()}
                maxDate={getMaxDate()}
                disabled={disabled}
                autoExpand={true}
                // Allow offset override (0 so user can pick earliest allowed)
                minOffsetDays={0}
              />
            </div>
          ) : null}
        </div>

        <div className={styles.condensedRow}>
          <button
            type="button"
            className={styles.condensedTrigger}
            onClick={() => setShowTimeSelection(!showTimeSelection)}
            disabled={disabled || !selectedDate}
            aria-label="Select time"
          >
            <span className={styles.condensedIcon}>🕐</span>
            <span className={styles.condensedPrimaryText}>{selectedTime ? selectedTime : 'Pick Time'}</span>
            <span className={styles.condensedChevron}>▾</span>
          </button>
          {showTimeSelection && selectedDate && (
            <div className={styles.inlinePanel}>
              <TimePicker
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                disabled={disabled}
                placeholder="Select your Commencement Point time"
                inline={true}
              />
            </div>
          )}
        </div>

        <ul className={styles.condensedHelpList}>
          <li>Choose up to 30 days ahead</li>
          <li>Officer arrives 5-10 min early</li>
          <li>Change or cancel up to 60 min before</li>
        </ul>

        {formatFinalDisplay() && (
          <div className={styles.confirmation + ' ' + styles.condensedConfirmation}>
            <div className={styles.confirmationIcon}>✅</div>
            <div className={styles.confirmationText}>
              <strong>Commencement Point scheduled:</strong><br />{formatFinalDisplay()}
            </div>
          </div>
        )}
      </div>
    )
  }

  // =============== Progressive Variant (default) ==================
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      {/* Progressive Disclosure: Date Selection */}
      <div className={styles.dateSection}>
        {!alwaysExpanded && calendarMinimized && selectedDate ? (
          <div className={styles.minimizedDateDisplay}>
            <div className={styles.selectedDateInfo}>
              <span className={styles.dateIcon}>📅</span>
              <span className={styles.selectedDateText}>
                Selected: {selectedDate.toLocaleDateString('en-GB', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
            <button
              type="button"
              className={styles.changeDateButton}
              onClick={handleDateEdit}
              disabled={disabled}
            >
              Change Date
            </button>
          </div>
        ) : (
          <div className={styles.fullCalendarSection}>
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
              autoExpand={true}
              minOffsetDays={0}
            />
          </div>
        )}
      </div>

      {/* Progressive Disclosure: Time Selection */}
      {showTimeSelection && selectedDate && (
        <div className={styles.timeSection}>
          <label className={styles.pickerLabel}>
            <span className={styles.pickerIcon}>🕐</span>
            Time
          </label>
          <TimePicker
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            disabled={disabled}
            placeholder="Select your Commencement Point time"
              inline={alwaysExpanded}
          />
        </div>
      )}

      {formatFinalDisplay() && (
        <div className={styles.confirmation}>
          <div className={styles.confirmationIcon}>✅</div>
          <div className={styles.confirmationText}>
            <strong>Commencement Point scheduled for:</strong>
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