import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getDisplayName } from '../../utils/nameUtils';
import { BookingCard } from './components/BookingCard';
import { QuickActions } from './components/QuickActions';
import { LiveTrackingDashboard } from './components/LiveTrackingDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BookingCalendar } from './components/BookingCalendar';
import {
  mockBookings,
  mockFavoriteRoutes,
  mockUserStats,
  getTimeBasedGreeting,
  getTimeBasedSuggestion,
  Booking,
  FavoriteRoute
} from './utils/mockData';
import styles from './BookingsView.module.css';

type FilterType = 'all' | 'active' | 'scheduled' | 'completed';
type ServiceFilter = 'all' | 'transport' | 'venue';
type ViewType = 'overview' | 'tracking' | 'calendar' | 'analytics';

export function BookingsView() {
  const { state, navigateToView } = useApp();
  const { user } = state;

  const [bookings] = useState<Booking[]>(mockBookings);
  const [favoriteRoutes] = useState<FavoriteRoute[]>(mockFavoriteRoutes);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('transport');
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const greeting = getTimeBasedGreeting();
  const suggestion = getTimeBasedSuggestion();

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter !== 'all' && booking.status !== activeFilter) return false;
    return true;
  });

  const activeBookings = bookings.filter(b => b.status === 'active');
  const scheduledBookings = bookings.filter(b => b.status === 'scheduled');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleTrackDriver = (bookingId: string) => {
    console.log('Track driver for booking:', bookingId);
    // TODO: Implement driver tracking
  };

  const handleContactDriver = (bookingId: string) => {
    console.log('Contact driver for booking:', bookingId);
    // TODO: Implement driver contact
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancel booking:', bookingId);
    // TODO: Implement booking cancellation
  };

  const handleRebookTrip = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      // Store booking data for quick rebook
      localStorage.setItem('armora_rebook_data', JSON.stringify({
        pickup: booking.pickupLocation.address,
        destination: booking.destination.address,
        serviceType: booking.serviceType
      }));
      navigateToView('booking');
    }
  };

  const handleRateDriver = (bookingId: string, rating: number) => {
    console.log('Rate driver for booking:', bookingId, 'Rating:', rating);
    // TODO: Implement driver rating
  };

  const handleQuickBookRoute = (route: FavoriteRoute) => {
    localStorage.setItem('armora_selected_service', route.preferredService);
    localStorage.setItem('armora_quick_pickup', route.from);
    localStorage.setItem('armora_quick_destination', route.to);
    navigateToView('booking');
  };

  const handleNewBooking = () => {
    navigateToView('services');
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
    // TODO: Handle date selection
  };

  const handleBookingClick = (booking: Booking) => {
    console.log('Booking clicked:', booking);
    // TODO: Show booking details modal
  };

  const renderHeader = () => (
    <div className={styles.headerSection}>
      <div className={styles.greetingSection}>
        <h1 className={styles.greeting}>
          {greeting}{user ? `, ${getDisplayName(user)}` : ''}
        </h1>
        <p className={styles.subtitle}>Your secure transport dashboard</p>
      </div>

      <div className={styles.viewSelector}>
        {[
          { key: 'overview', label: 'Overview', icon: '📊' },
          { key: 'tracking', label: 'Live Tracking', icon: '📍' },
          { key: 'calendar', label: 'Calendar', icon: '📅' },
          { key: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(view => (
          <button
            key={view.key}
            className={`${styles.viewButton} ${activeView === view.key ? styles.active : ''}`}
            onClick={() => setActiveView(view.key as ViewType)}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{mockUserStats.activeBookings}</div>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statIcon}>🚗</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{mockUserStats.totalTrips}</div>
          <div className={styles.statLabel}>Total Trips</div>
          <div className={styles.statIcon}>📊</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{mockUserStats.averageRating}⭐</div>
          <div className={styles.statLabel}>Rating</div>
          <div className={styles.statIcon}>⭐</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>£{mockUserStats.totalSaved.toLocaleString()}</div>
          <div className={styles.statLabel}>Saved</div>
          <div className={styles.statIcon}>💰</div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className={styles.filtersSection}>
      <div className={styles.filterToggle}>
        <button
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filters ({activeFilter !== 'all' ? '1' : '0'})
        </button>
      </div>

      {showFilters && (
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status:</label>
            <div className={styles.filterOptions}>
              {[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' }
              ].map(filter => (
                <button
                  key={filter.value}
                  className={`${styles.filterOption} ${activeFilter === filter.value ? styles.active : ''}`}
                  onClick={() => setActiveFilter(filter.value as FilterType)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>{suggestion.icon}</div>
      <h3 className={styles.emptyStateTitle}>{suggestion.title}</h3>
      <p className={styles.emptyStateText}>{suggestion.subtitle}</p>
      <button
        className={styles.emptyStateButton}
        onClick={handleNewBooking}
      >
        🚀 Book Your First Ride
      </button>
    </div>
  );

  const renderFavoriteRoutes = () => {
    if (favoriteRoutes.length === 0) return null;

    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>⭐ Favorite Routes</h2>
          <p className={styles.sectionSubtitle}>Quick booking for your regular journeys</p>
        </div>

        <div className={styles.routesGrid}>
          {favoriteRoutes.map(route => (
            <div key={route.id} className={styles.routeCard}>
              <div className={styles.routeHeader}>
                <h3 className={styles.routeNickname}>{route.nickname}</h3>
                <div className={styles.routeFrequency}>{route.frequency}x used</div>
              </div>

              <div className={styles.routeDetails}>
                <div className={styles.routeFrom}>{route.from}</div>
                <div className={styles.routeArrow}>→</div>
                <div className={styles.routeTo}>{route.to}</div>
              </div>

              <div className={styles.routeFooter}>
                <div className={styles.routePrice}>£{route.estimatedPrice}</div>
                <button
                  className={styles.routeBookButton}
                  onClick={() => handleQuickBookRoute(route)}
                >
                  Quick Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBookings = () => {
    if (filteredBookings.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className={styles.bookingsContainer}>
        {/* Active Bookings */}
        {activeBookings.length > 0 && (activeFilter === 'all' || activeFilter === 'active') && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🔴 Live Bookings</h2>
            {activeBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onTrackDriver={() => handleTrackDriver(booking.id)}
                onContactDriver={() => handleContactDriver(booking.id)}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            ))}
          </div>
        )}

        {/* Scheduled Bookings */}
        {scheduledBookings.length > 0 && (activeFilter === 'all' || activeFilter === 'scheduled') && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📅 Upcoming Bookings</h2>
            {scheduledBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            ))}
          </div>
        )}

        {/* Completed Bookings */}
        {completedBookings.length > 0 && (activeFilter === 'all' || activeFilter === 'completed') && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>✅ Recent Trips</h2>
            {completedBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onRebook={() => handleRebookTrip(booking.id)}
                onRate={(rating) => handleRateDriver(booking.id, rating)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'tracking':
        return (
          <LiveTrackingDashboard
            activeBookings={activeBookings}
            onTrackDriver={handleTrackDriver}
            onContactDriver={handleContactDriver}
          />
        );
      case 'calendar':
        return (
          <BookingCalendar
            bookings={bookings}
            onDateSelect={handleDateSelect}
            onBookingClick={handleBookingClick}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard
            bookings={bookings}
            userStats={mockUserStats}
          />
        );
      case 'overview':
      default:
        return (
          <>
            <QuickActions />
            {renderFavoriteRoutes()}
            {renderFilters()}
            {renderBookings()}
          </>
        );
    }
  };

  return (
    <div className={styles.bookingsView}>
      {renderHeader()}

      {renderMainContent()}

      {/* Main CTA - Always visible */}
      <div className={styles.mainCTA}>
        <button
          className={styles.newBookingButton}
          onClick={handleNewBooking}
        >
          ➕ New Booking
        </button>
      </div>
    </div>
  );
}