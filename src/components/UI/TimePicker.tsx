import { useState, useRef, useEffect } from 'react';
import styles from './TimePicker.module.css';

interface TimePickerProps {
  selectedTime: string; // Format: "HH:MM" (24-hour)
  onTimeSelect: (time: string) => void;
  disabled?: boolean;
  placeholder?: string;
  inline?: boolean; // New: render full grid inline (always visible)
}

export function TimePicker({
  selectedTime,
  onTimeSelect,
  disabled = false,
  placeholder = 'Select time',
  inline = false
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(inline); // inline means always "open"
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse selected time on mount or when it changes
  useEffect(() => {
    if (selectedTime) {
      const [hourStr, minuteStr] = selectedTime.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      if (!isNaN(hour) && !isNaN(minute)) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
    } else {
      setSelectedHour(null);
      setSelectedMinute(null);
    }
  }, [selectedTime]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (inline) return; // no outside click handling for inline mode
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, inline]);

  // Generate time slots (15-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatDisplayTime(hour, minute);

        slots.push({
          value: timeString,
          display: displayTime,
          hour,
          minute,
          isPopular: isPopularTime(hour, minute)
        });
      }
    }
    return slots;
  };

  const isPopularTime = (hour: number, minute: number) => {
    // Popular times: 8:00, 9:00, 12:00, 17:00, 18:00, 19:00
    const popularHours = [8, 9, 12, 17, 18, 19];
    return popularHours.includes(hour) && minute === 0;
  };

  const formatDisplayTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const formatSelectedTime = () => {
    if (selectedHour === null || selectedMinute === null) {
      return placeholder;
    }
    return formatDisplayTime(selectedHour, selectedMinute);
  };

  const handleTimeSelect = (timeString: string, hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onTimeSelect(timeString);
    setIsOpen(false);
  };

  const timeSlots = generateTimeSlots();

  // Group time slots by periods for better organization
  const groupedTimeSlots = {
    morning: timeSlots.filter(slot => slot.hour >= 6 && slot.hour < 12),
    afternoon: timeSlots.filter(slot => slot.hour >= 12 && slot.hour < 18),
    evening: timeSlots.filter(slot => slot.hour >= 18 || slot.hour < 6)
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {!inline && (
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''} ${
            disabled ? styles.disabled : ''
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={styles.triggerText}>{formatSelectedTime()}</span>
          <svg
            className={styles.triggerIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </button>
      )}

      {(isOpen || inline) && (
        <div className={`${styles.dropdown} ${inline ? styles.inline : ''}`}>
          <div className={styles.header}>
            <h4 className={styles.title}>Select Time</h4>
            <p className={styles.subtitle}>Available 24/7</p>
          </div>

          <div className={styles.timeSection}>
            <h5 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🌅</span>
              Morning (6 AM - 12 PM)
            </h5>
            <div className={styles.timeGrid}>
              {groupedTimeSlots.morning.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  className={`${styles.timeSlot} ${
                    slot.isPopular ? styles.popular : ''
                  } ${
                    selectedTime === slot.value ? styles.selected : ''
                  }`}
                  onClick={() => handleTimeSelect(slot.value, slot.hour, slot.minute)}
                >
                  <span className={styles.timeText}>{slot.display}</span>
                  {slot.isPopular && <span className={styles.popularBadge}>Popular</span>}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.timeSection}>
            <h5 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>☀️</span>
              Afternoon (12 PM - 6 PM)
            </h5>
            <div className={styles.timeGrid}>
              {groupedTimeSlots.afternoon.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  className={`${styles.timeSlot} ${
                    slot.isPopular ? styles.popular : ''
                  } ${
                    selectedTime === slot.value ? styles.selected : ''
                  }`}
                  onClick={() => handleTimeSelect(slot.value, slot.hour, slot.minute)}
                >
                  <span className={styles.timeText}>{slot.display}</span>
                  {slot.isPopular && <span className={styles.popularBadge}>Popular</span>}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.timeSection}>
            <h5 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🌙</span>
              Evening & Night (6 PM - 6 AM)
            </h5>
            <div className={styles.timeGrid}>
              {groupedTimeSlots.evening.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  className={`${styles.timeSlot} ${
                    slot.isPopular ? styles.popular : ''
                  } ${
                    selectedTime === slot.value ? styles.selected : ''
                  }`}
                  onClick={() => handleTimeSelect(slot.value, slot.hour, slot.minute)}
                >
                  <span className={styles.timeText}>{slot.display}</span>
                  {slot.isPopular && <span className={styles.popularBadge}>Popular</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}