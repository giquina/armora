import { useState, useEffect, useRef } from 'react';
import styles from './CompactTimePicker.module.css';

interface CompactTimePickerProps {
  selectedTime: string; // Format: "HH:MM" (24-hour)
  onTimeSelect: (time: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
}

export function CompactTimePicker({
  selectedTime,
  onTimeSelect,
  disabled = false,
  autoFocus = false,
  label = 'Commencement Point Time:'
}: CompactTimePickerProps) {
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  // Parse selected time on mount or when it changes
  useEffect(() => {
    if (selectedTime) {
      const [hourStr, minuteStr] = selectedTime.split(':');
      const hour24 = parseInt(hourStr, 10);
      const minute24 = parseInt(minuteStr, 10);

      if (!isNaN(hour24) && !isNaN(minute24)) {
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const periodValue = hour24 >= 12 ? 'PM' : 'AM';

        setHour(hour12);
        setMinute(minute24);
        setPeriod(periodValue);
      }
    } else {
      // Smart default: current time + 15 minutes
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15);

      const hour24 = now.getHours();
      const minute24 = Math.round(now.getMinutes() / 15) * 15; // Round to nearest 15-minute interval

      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const periodValue = hour24 >= 12 ? 'PM' : 'AM';

      setHour(hour12);
      setMinute(minute24 >= 60 ? 0 : minute24);
      setPeriod(periodValue);

      // Emit the default time
      const defaultTime24 = (periodValue === 'PM' && hour12 !== 12 ? hour12 + 12 :
                            periodValue === 'AM' && hour12 === 12 ? 0 : hour12);
      const timeString = `${defaultTime24.toString().padStart(2, '0')}:${(minute24 >= 60 ? 0 : minute24).toString().padStart(2, '0')}`;
      setTimeout(() => onTimeSelect(timeString), 100);
    }
  }, [selectedTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // Convert to 24-hour format and emit
  const emitTimeChange = (newHour: number, newMinute: number, newPeriod: 'AM' | 'PM') => {
    const hour24 = newPeriod === 'PM' && newHour !== 12 ? newHour + 12 :
                   newPeriod === 'AM' && newHour === 12 ? 0 : newHour;
    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
  };

  // Hour scroll/input handlers
  const handleHourScroll = (direction: 'up' | 'down') => {
    const newHour = direction === 'up'
      ? (hour === 12 ? 1 : hour + 1)
      : (hour === 1 ? 12 : hour - 1);
    setHour(newHour);
    emitTimeChange(newHour, minute, period);
  };

  const handleHourInput = (value: string) => {
    const num = parseInt(value, 10);
    if (num >= 1 && num <= 12) {
      setHour(num);
      emitTimeChange(num, minute, period);
    }
  };

  // Minute scroll/input handlers
  const handleMinuteScroll = (direction: 'up' | 'down') => {
    const newMinute = direction === 'up'
      ? (minute >= 45 ? 0 : minute + 15)
      : (minute <= 0 ? 45 : minute - 15);
    setMinute(newMinute);
    emitTimeChange(hour, newMinute, period);
  };

  const handleMinuteInput = (value: string) => {
    const num = parseInt(value, 10);
    if (num >= 0 && num <= 59) {
      // Round to nearest 15-minute interval
      const roundedMinute = Math.round(num / 15) * 15;
      const finalMinute = roundedMinute >= 60 ? 0 : roundedMinute;
      setMinute(finalMinute);
      emitTimeChange(hour, finalMinute, period);
    }
  };

  // Period toggle
  const handlePeriodToggle = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    emitTimeChange(hour, minute, newPeriod);
  };

  // Wheel event handlers
  const handleWheel = (
    e: React.WheelEvent,
    type: 'hour' | 'minute' | 'period'
  ) => {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 'up' : 'down';

    switch (type) {
      case 'hour':
        handleHourScroll(direction);
        break;
      case 'minute':
        handleMinuteScroll(direction);
        break;
      case 'period':
        handlePeriodToggle();
        break;
    }
  };

  // Click-to-type handlers
  const handleFieldClick = (type: 'hour' | 'minute') => {
    const currentValue = type === 'hour' ? hour.toString() : minute.toString().padStart(2, '0');
    const newValue = prompt(`Enter ${type} (${type === 'hour' ? '1-12' : '0-59'}):`, currentValue);

    if (newValue !== null) {
      if (type === 'hour') {
        handleHourInput(newValue);
      } else {
        handleMinuteInput(newValue);
      }
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      <div className={styles.timeSelector}>
        {/* Hour Field */}
        <div
          ref={hourRef}
          className={`${styles.timeField} ${disabled ? styles.disabled : ''}`}
          onWheel={(e) => !disabled && handleWheel(e, 'hour')}
          onClick={() => !disabled && handleFieldClick('hour')}
          role="spinbutton"
          aria-label="Hour"
          aria-valuenow={hour}
          aria-valuemin={1}
          aria-valuemax={12}
        >
          <button
            type="button"
            className={styles.incrementButton}
            onClick={() => !disabled && handleHourScroll('up')}
            disabled={disabled}
            tabIndex={-1}
          >
            ▲
          </button>

          <div className={styles.timeDisplay}>
            {hour.toString().padStart(2, '0')}
          </div>

          <button
            type="button"
            className={styles.decrementButton}
            onClick={() => !disabled && handleHourScroll('down')}
            disabled={disabled}
            tabIndex={-1}
          >
            ▼
          </button>
        </div>

        {/* Separator */}
        <div className={styles.separator}>:</div>

        {/* Minute Field */}
        <div
          ref={minuteRef}
          className={`${styles.timeField} ${disabled ? styles.disabled : ''}`}
          onWheel={(e) => !disabled && handleWheel(e, 'minute')}
          onClick={() => !disabled && handleFieldClick('minute')}
          role="spinbutton"
          aria-label="Minute"
          aria-valuenow={minute}
          aria-valuemin={0}
          aria-valuemax={59}
        >
          <button
            type="button"
            className={styles.incrementButton}
            onClick={() => !disabled && handleMinuteScroll('up')}
            disabled={disabled}
            tabIndex={-1}
          >
            ▲
          </button>

          <div className={styles.timeDisplay}>
            {minute.toString().padStart(2, '0')}
          </div>

          <button
            type="button"
            className={styles.decrementButton}
            onClick={() => !disabled && handleMinuteScroll('down')}
            disabled={disabled}
            tabIndex={-1}
          >
            ▼
          </button>
        </div>

        {/* Period Field */}
        <div
          ref={periodRef}
          className={`${styles.timeField} ${styles.periodField} ${disabled ? styles.disabled : ''}`}
          onWheel={(e) => !disabled && handleWheel(e, 'period')}
          onClick={() => !disabled && handlePeriodToggle()}
          role="button"
          aria-label="AM/PM"
        >
          <button
            type="button"
            className={styles.incrementButton}
            onClick={() => !disabled && handlePeriodToggle()}
            disabled={disabled}
            tabIndex={-1}
          >
            ▲
          </button>

          <div className={styles.timeDisplay}>
            {period}
          </div>

          <button
            type="button"
            className={styles.decrementButton}
            onClick={() => !disabled && handlePeriodToggle()}
            disabled={disabled}
            tabIndex={-1}
          >
            ▼
          </button>
        </div>
      </div>

      <div className={styles.helpText}>
        <span className={styles.helpIcon}>💡</span>
        <span>Scroll, click, or use arrows to adjust time</span>
      </div>
    </div>
  );
}