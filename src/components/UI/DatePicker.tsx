import { useState, useEffect, useRef } from 'react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  autoExpand?: boolean; // New prop to auto-expand calendar
  /**
   * Optional number of days from now to use as the minimum selectable offset.
   * Ignored if explicit minDate prop is provided. Defaults to 1 (tomorrow) to
   * encourage scheduling ahead, but some flows (e.g. quick scheduled Assignment) may
   * allow same‑day selection with offset 0.
   */
  minOffsetDays?: number;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabled = false,
  autoExpand = false,
  minOffsetDays = 1
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [isOpen, setIsOpen] = useState(autoExpand); // Auto-expand if autoExpand is true
  const containerRef = useRef<HTMLDivElement>(null);

  // Set default min/max dates
  const today = new Date();
  const baseMin = new Date(today);
  baseMin.setHours(0,0,0,0);
  // Apply offset only if caller didn't explicitly pass a minDate
  if (!minDate) {
    baseMin.setDate(baseMin.getDate() + Math.max(0, minOffsetDays));
  }

  const defaultMinDate = minDate || baseMin;
  const defaultMaxDate = maxDate || (() => {
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    return maxDate;
  })();

  // Close calendar when clicking outside (but not if autoExpand is enabled)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && !autoExpand) {
        setIsOpen(false);
      }
    };

    if (isOpen && !autoExpand) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, autoExpand]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    if (date < defaultMinDate) return true;
    if (date > defaultMaxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
      if (!autoExpand) {
        setIsOpen(false);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Don't navigate beyond min/max range
    const firstDayOfNewMonth = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
    const lastDayOfNewMonth = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

    if (direction === 'prev' && lastDayOfNewMonth < defaultMinDate) return;
    if (direction === 'next' && firstDayOfNewMonth > defaultMaxDate) return;

    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const todayClass = isToday(date);

      days.push(
        <button
          key={day}
          type="button"
          className={`${styles.dayButton} ${disabled ? styles.disabled : ''} ${selected ? styles.selected : ''} ${todayClass ? styles.today : ''}`}
          onClick={() => handleDateClick(date)}
          disabled={disabled}
          aria-label={date.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
          data-testid={`datepicker-day-${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return 'Select date';
    return selectedDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const canNavigatePrev = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    const lastDayOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    return lastDayOfPrevMonth >= defaultMinDate;
  };

  const canNavigateNext = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    const firstDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    return firstDayOfNextMonth <= defaultMaxDate;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {!autoExpand && (
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''} ${
            disabled ? styles.disabled : ''
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={styles.triggerText}>{formatDisplayDate()}</span>
          <svg
            className={styles.triggerIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
      )}

      {(isOpen || autoExpand) && (
        <div className={`${styles.calendar} ${autoExpand ? styles.autoExpanded : ''}`}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={`${styles.navButton} ${!canNavigatePrev() ? styles.disabled : ''}`}
              onClick={() => navigateMonth('prev')}
              disabled={!canNavigatePrev()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>

            <h3 className={styles.monthTitle}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>

            <button
              type="button"
              className={`${styles.navButton} ${!canNavigateNext() ? styles.disabled : ''}`}
              onClick={() => navigateMonth('next')}
              disabled={!canNavigateNext()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </div>

          <div className={styles.weekDays}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {renderCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
}