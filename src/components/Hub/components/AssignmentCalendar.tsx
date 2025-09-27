import React, { useState } from 'react';
import { Assignment } from '../utils/mockData';
import styles from './AssignmentCalendar.module.css';

interface AssignmentCalendarProps {
  assignments: Assignment[];
  onDateSelect: (date: Date) => void;
  onAssignmentClick: (assignment: Assignment) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  assignments: Assignment[];
}

export function AssignmentCalendar({ assignments, onDateSelect, onAssignmentClick }: AssignmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getCalendarDays = (): CalendarDay[] => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Add previous month days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        assignments: getAssignmentsForDate(date)
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        assignments: getAssignmentsForDate(date)
      });
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        assignments: getAssignmentsForDate(date)
      });
    }

    return days;
  };

  const getAssignmentsForDate = (date: Date): Assignment[] => {
    return assignments.filter(assignment => {
      const assignmentDate = new Date(assignment.scheduledTime);
      return isSameDay(assignmentDate, date);
    });
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateSelect(day.date);
  };

  const getServiceTypeIcon = (serviceType: string): string => {
    switch (serviceType) {
      case 'standard': return '🛡️';
      case 'executive': return '👔';
      case 'shadow': return '🕵️';
      default: return '🚗';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'scheduled': return '#FFD700';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.headerTop}>
          <h2 className={styles.calendarTitle}>📅 Assignment Calendar</h2>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'month' ? styles.active : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'week' ? styles.active : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
        </div>

        <div className={styles.navigationBar}>
          <button className={styles.navButton} onClick={() => navigateMonth('prev')}>
            ←
          </button>
          <h3 className={styles.monthTitle}>{formatMonth(currentDate)}</h3>
          <button className={styles.navButton} onClick={() => navigateMonth('next')}>
            →
          </button>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {/* Week day headers */}
        <div className={styles.weekHeader}>
          {weekDays.map(day => (
            <div key={day} className={styles.weekDay}>{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className={styles.calendarDays}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                ${styles.calendarDay}
                ${!day.isCurrentMonth ? styles.otherMonth : ''}
                ${day.isToday ? styles.today : ''}
                ${selectedDate && isSameDay(day.date, selectedDate) ? styles.selected : ''}
                ${day.assignments.length > 0 ? styles.hasAssignments : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className={styles.dayNumber}>{day.date.getDate()}</div>

              {day.assignments.length > 0 && (
                <div className={styles.assignmentIndicators}>
                  {day.assignments.slice(0, 3).map((assignment, assignmentIndex) => (
                    <div
                      key={assignment.id}
                      className={styles.assignmentDot}
                      style={{ backgroundColor: getStatusColor(assignment.status) }}
                      title={`${assignment.serviceName} - ${assignment.status}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignmentClick(assignment);
                      }}
                    >
                      <span className={styles.serviceIcon}>
                        {getServiceTypeIcon(assignment.serviceType)}
                      </span>
                    </div>
                  ))}
                  {day.assignments.length > 3 && (
                    <div className={styles.moreIndicator}>
                      +{day.assignments.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className={styles.selectedDateDetails}>
          <h3 className={styles.selectedDateTitle}>
            {selectedDate.toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>

          {getAssignmentsForDate(selectedDate).length > 0 ? (
            <div className={styles.dayAssignments}>
              {getAssignmentsForDate(selectedDate).map(assignment => (
                <div
                  key={assignment.id}
                  className={styles.dayAssignmentCard}
                  onClick={() => onAssignmentClick(assignment)}
                >
                  <div className={styles.assignmentTime}>
                    {assignment.scheduledTime.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className={styles.assignmentInfo}>
                    <div className={styles.assignmentHeader}>
                      <span className={styles.serviceIcon}>
                        {getServiceTypeIcon(assignment.serviceType)}
                      </span>
                      <span className={styles.serviceName}>{assignment.serviceName}</span>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(assignment.status) }}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    <div className={styles.route}>
                      {assignment.commencementLocation.address.split(',')[0]} → {assignment.secureDestination.address.split(',')[0]}
                    </div>
                    <div className={styles.price}>£{assignment.pricing.total}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noDayAssignments}>
              <span className={styles.emptyIcon}>📅</span>
              <span className={styles.emptyText}>No assignments on this date</span>
              <button className={styles.addBookingButton}>
                + Add Assignment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Calendar Legend */}
      <div className={styles.calendarLegend}>
        <h4 className={styles.legendTitle}>Status Legend</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: '#00ff88' }}></div>
            <span className={styles.legendLabel}>Active</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: '#FFD700' }}></div>
            <span className={styles.legendLabel}>Scheduled</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: '#10B981' }}></div>
            <span className={styles.legendLabel}>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: '#EF4444' }}></div>
            <span className={styles.legendLabel}>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}