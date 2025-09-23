import React, { useState } from 'react';
import { Booking } from '../utils/mockData';
import styles from './BookingCalendar.module.css';

interface BookingCalendarProps {
  bookings: Booking[];
  onDateSelect: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
}

export function BookingCalendar({ bookings, onDateSelect, onBookingClick }: BookingCalendarProps) {
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
        bookings: getBookingsForDate(date)
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        bookings: getBookingsForDate(date)
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
        bookings: getBookingsForDate(date)
      });
    }

    return days;
  };

  const getBookingsForDate = (date: Date): Booking[] => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.scheduledTime);
      return isSameDay(bookingDate, date);
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
          <h2 className={styles.calendarTitle}>📅 Booking Calendar</h2>
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
                ${day.bookings.length > 0 ? styles.hasBookings : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className={styles.dayNumber}>{day.date.getDate()}</div>

              {day.bookings.length > 0 && (
                <div className={styles.bookingIndicators}>
                  {day.bookings.slice(0, 3).map((booking, bookingIndex) => (
                    <div
                      key={booking.id}
                      className={styles.bookingDot}
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                      title={`${booking.serviceName} - ${booking.status}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                    >
                      <span className={styles.serviceIcon}>
                        {getServiceTypeIcon(booking.serviceType)}
                      </span>
                    </div>
                  ))}
                  {day.bookings.length > 3 && (
                    <div className={styles.moreIndicator}>
                      +{day.bookings.length - 3}
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

          {getBookingsForDate(selectedDate).length > 0 ? (
            <div className={styles.dayBookings}>
              {getBookingsForDate(selectedDate).map(booking => (
                <div
                  key={booking.id}
                  className={styles.dayBookingCard}
                  onClick={() => onBookingClick(booking)}
                >
                  <div className={styles.bookingTime}>
                    {booking.scheduledTime.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className={styles.bookingInfo}>
                    <div className={styles.bookingHeader}>
                      <span className={styles.serviceIcon}>
                        {getServiceTypeIcon(booking.serviceType)}
                      </span>
                      <span className={styles.serviceName}>{booking.serviceName}</span>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className={styles.route}>
                      {booking.commencementLocation.address.split(',')[0]} → {booking.secureDestination.address.split(',')[0]}
                    </div>
                    <div className={styles.price}>£{booking.pricing.total}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noDayBookings}>
              <span className={styles.emptyIcon}>📅</span>
              <span className={styles.emptyText}>No bookings on this date</span>
              <button className={styles.addBookingButton}>
                + Add Booking
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