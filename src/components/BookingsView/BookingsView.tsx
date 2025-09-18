import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { mockBookings, Booking } from './utils/mockData';
import styles from './BookingsView.module.css';

type ViewType = 'active' | 'upcoming' | 'history';

export function BookingsView() {
  const { state, navigateToView } = useApp();
  const { user } = state;

  const [bookings] = useState<Booking[]>(mockBookings);
  const [activeView, setActiveView] = useState<ViewType | null>(null);
  const [liveUpdateTime, setLiveUpdateTime] = useState(new Date());

  // Live update for active operations
  useEffect(() => {
    const hasActiveOperation = bookings.some(b => b.status === 'active');
    if (hasActiveOperation) {
      const interval = setInterval(() => {
        setLiveUpdateTime(new Date());
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [bookings]);

  const activeBookings = bookings.filter(b => b.status === 'active');
  const scheduledBookings = bookings.filter(b => b.status === 'scheduled');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  // Determine user state for smart content display
  const hasActiveOperation = activeBookings.length > 0;
  const hasUpcomingBookings = scheduledBookings.length > 0;
  const hasHistory = completedBookings.length > 0;
  const isNewUser = !hasActiveOperation && !hasUpcomingBookings && !hasHistory;
  const hasMultipleSections = [hasActiveOperation, hasUpcomingBookings, hasHistory].filter(Boolean).length > 1;

  // Mock favorite routes based on booking history
  const getFavoriteRoutes = () => {
    const routeCounts: { [key: string]: { count: number; booking: Booking } } = {};

    completedBookings.forEach(booking => {
      const route = `${booking.pickupLocation.address.split(',')[0]} → ${booking.destination.address.split(',')[0]}`;
      if (routeCounts[route]) {
        routeCounts[route].count++;
      } else {
        routeCounts[route] = { count: 1, booking };
      }
    });

    return Object.entries(routeCounts)
      .filter(([_, data]) => data.count >= 2)
      .sort(([_, a], [__, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([route, data]) => ({ route, ...data }));
  };

  const favoriteRoutes = getFavoriteRoutes();

  // Quick Actions
  const handleBookFirstRide = () => navigateToView('home');
  const handleExploreServices = () => navigateToView('services');
  const handleRebookLast = () => {
    const lastBooking = completedBookings[0];
    if (lastBooking) {
      localStorage.setItem('armora_rebook_data', JSON.stringify({
        pickup: lastBooking.pickupLocation.address,
        destination: lastBooking.destination.address,
        serviceType: lastBooking.serviceType
      }));
      navigateToView('booking');
    }
  };

  const handleTrackCPO = (bookingId: string) => {
    console.log('Track CPO for booking:', bookingId);
    // TODO: Implement CPO tracking with map
  };

  const handleContactCPO = (bookingId: string) => {
    console.log('Contact CPO for booking:', bookingId);
    // TODO: Implement CPO contact
  };

  const handleShareTrip = (bookingId: string) => {
    console.log('Share trip for booking:', bookingId);
    // TODO: Implement trip sharing
  };

  const handleEmergencySOS = () => {
    console.log('Emergency SOS activated');
    // TODO: Implement emergency contact
    alert('Emergency services would be contacted. This is a demo.');
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancel booking:', bookingId);
    // TODO: Implement booking cancellation
  };

  const handleManageBooking = (bookingId: string) => {
    console.log('Manage booking:', bookingId);
    // TODO: Implement booking management
  };

  const handleRebookTrip = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      localStorage.setItem('armora_rebook_data', JSON.stringify({
        pickup: booking.pickupLocation.address,
        destination: booking.destination.address,
        serviceType: booking.serviceType
      }));
      navigateToView('booking');
    }
  };

  const handleViewReceipt = (bookingId: string) => {
    console.log('View receipt for booking:', bookingId);
    // TODO: Implement receipt viewing
  };

  const formatETA = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // STATE 1: NEW USER (No bookings ever)
  const renderNewUserState = () => (
    <div className={styles.contentSection}>
      <div className={styles.emptyState}>
        <h2 className={styles.emptyStateTitle}>No protection assignments yet - let's change that!</h2>

        <div className={styles.popularRides}>
          <h3 className={styles.sectionSubtitle}>🎯 Popular first assignments with Armora CPO Services:</h3>
          <div className={styles.suggestionsList}>
            <div className={styles.suggestionItem}>
              <span className={styles.suggestionIcon}>✈️</span>
              <div className={styles.suggestionContent}>
                <span className={styles.suggestionTitle}>Executive Transport</span>
                <span className={styles.suggestionDesc}>Secure airport escort</span>
              </div>
            </div>
            <div className={styles.suggestionItem}>
              <span className={styles.suggestionIcon}>🌙</span>
              <div className={styles.suggestionContent}>
                <span className={styles.suggestionTitle}>High-Risk Movement</span>
                <span className={styles.suggestionDesc}>Enhanced threat protection</span>
              </div>
            </div>
            <div className={styles.suggestionItem}>
              <span className={styles.suggestionIcon}>👔</span>
              <div className={styles.suggestionContent}>
                <span className={styles.suggestionTitle}>VIP Escort Service</span>
                <span className={styles.suggestionDesc}>Discrete protection detail</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.primaryCTA} onClick={handleBookFirstRide}>
            REQUEST PROTECTION →
          </button>
          <button className={styles.secondaryCTA} onClick={handleExploreServices}>
            VIEW SECURITY SERVICES
          </button>
        </div>

        <div className={styles.trustSignals}>
          <h4 className={styles.trustTitle}>Why 2,847 principals choose our protection:</h4>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✓</span>
              <span>Professional Close Protection Officers</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✓</span>
              <span>Available 24/7</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✓</span>
              <span>4.9★ average rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // STATE 2: ACTIVE RIDE IN PROGRESS
  const renderActiveRideState = () => {
    if (activeBookings.length === 0) return null;
    const activeRide = activeBookings[0];

    return (
      <div className={styles.contentSection}>
        <div className={styles.liveRideCard}>
          <div className={styles.liveHeader}>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              <span className={styles.liveText}>OPERATION ACTIVE</span>
            </div>
            <div className={styles.bookingId}>[LEVEL 2] {activeRide.id.replace('AR-', 'DELTA-')}</div>
          </div>

          <div className={styles.miniMap}>
            <div className={styles.mapPlaceholder}>
              <span className={styles.mapIcon}>🗺️</span>
              <span className={styles.mapText}>Live tracking map would appear here</span>
            </div>
          </div>

          <div className={styles.rideInfo}>
            <div className={styles.serviceDetails}>
              <h3 className={styles.serviceName}>{activeRide.serviceName}</h3>
              <div className={styles.etaInfo}>
                <span className={styles.etaLabel}>⏱️ ETA: 5 minutes | Status: In Transit</span>
              </div>
            </div>

            <div className={styles.driverInfo}>
              <h4 className={styles.driverTitle}>PROTECTION OFFICER:</h4>
              <div className={styles.driverDetails}>
                <span className={styles.driverName}>{activeRide.driver.name}</span>
                <span className={styles.vehicleInfo}>
                  SIA License: 1234-5678-9012
                </span>
                <span className={styles.vehicleInfo}>
                  Security Level: Executive Protection
                </span>
                <span className={styles.vehicleInfo}>
                  Comms Status: Encrypted Channel Active
                </span>
                <span className={styles.vehicleInfo}>
                  {activeRide.driver.vehicle} • Armored Level B6
                </span>
                <span className={styles.vehicleInfo}>
                  Registration: {activeRide.driver.plate}
                </span>
                <span className={styles.driverRating}>
                  Rating: {activeRide.driver.rating}/5 (247 operations)
                </span>
              </div>
            </div>

            <div className={styles.securityProtocols}>
              <h4 className={styles.protocolsTitle}>SECURITY PROTOCOLS:</h4>
              <div className={styles.protocolsList}>
                <div className={styles.protocolItem}>✓ Identity Verified</div>
                <div className={styles.protocolItem}>✓ Route Pre-Cleared</div>
                <div className={styles.protocolItem}>✓ Panic Button Active</div>
                <div className={styles.protocolItem}>✓ Command Center Monitoring</div>
              </div>
            </div>

            <div className={styles.journeyInfo}>
              <h4 className={styles.journeyTitle}>ASSIGNMENT:</h4>
              <div className={styles.journeyDetails}>
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>📍</span>
                  <span className={styles.locationText}>
                    <strong>Secure Point A:</strong> {activeRide.pickupLocation.address.split(',')[0]}
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>📍</span>
                  <span className={styles.locationText}>
                    <strong>Target Location:</strong> {activeRide.destination.address.split(',')[0]}
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>⏱️</span>
                  <span className={styles.locationText}>
                    <strong>Estimated Duration:</strong> 45 minutes
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>🛡️</span>
                  <span className={styles.locationText}>
                    <strong>Threat Level:</strong> Standard
                  </span>
                </div>
                <div className={styles.locationItem}>
                  <span className={styles.locationIcon}>📡</span>
                  <span className={styles.locationText}>
                    <strong>Tracking:</strong> Live GPS + Panic Button Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.liveActions}>
            <button
              className={styles.operationsCenterButton}
              onClick={() => handleTrackCPO(activeRide.id)}
            >
              OPERATIONS CENTER
            </button>
            <button
              className={styles.secureCommsButton}
              onClick={() => handleContactCPO(activeRide.id)}
            >
              SECURE COMMS
            </button>
            <button
              className={styles.routeDetailsButton}
              onClick={() => handleShareTrip(activeRide.id)}
            >
              ROUTE DETAILS
            </button>
            <button
              className={styles.emergencyProtocolButton}
              onClick={handleEmergencySOS}
            >
              EMERGENCY PROTOCOL
            </button>
          </div>
        </div>

        {hasUpcomingBookings && renderUpcomingPreview()}
      </div>
    );
  };

  // STATE 3: UPCOMING BOOKINGS
  const renderUpcomingBookingsState = () => {
    if (scheduledBookings.length === 0) return null;

    return (
      <div className={styles.contentSection}>
        {renderQuickActions()}

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>NEXT OPERATIONS</h2>
          <div className={styles.sectionUnderline}></div>
        </div>

        <div className={styles.upcomingList}>
          {scheduledBookings.map(booking => (
            <div key={booking.id} className={styles.upcomingCard}>
              <div className={styles.upcomingHeader}>
                <div className={styles.upcomingTime}>
                  <span className={styles.timeIcon}>⏰</span>
                  <span>Tomorrow, 9:00 AM</span>
                </div>
                <div className={styles.upcomingStatus}>
                  <span className={styles.statusDot}></span>
                  <span>Confirmed</span>
                </div>
              </div>

              <div className={styles.upcomingDetails}>
                <h4 className={styles.upcomingService}>{booking.serviceName}</h4>
                <div className={styles.upcomingRoute}>
                  {booking.pickupLocation.address.split(',')[0]} → {booking.destination.address.split(',')[0]}
                </div>
                <div className={styles.upcomingCPO}>
                  CPO: Assigned 30 min before
                </div>
                <div className={styles.upcomingPrice}>
                  £{booking.pricing.total}.00 estimated
                </div>
              </div>

              <div className={styles.upcomingActions}>
                <button className={styles.changeTimeButton}>CHANGE TIME</button>
                <button className={styles.upgradeButton}>UPGRADE TO EXECUTIVE</button>
                <button className={styles.addReturnButton}>ADD RETURN</button>
                <button
                  className={styles.cancelButton}
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  CANCEL BOOKING
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionFooter}>
          <button className={styles.scheduleAnotherButton} onClick={() => navigateToView('home')}>
            + SCHEDULE ANOTHER OPERATION
          </button>
        </div>
      </div>
    );
  };

  // STATE 4: RIDE HISTORY
  const renderHistoryState = () => {
    if (completedBookings.length === 0) return null;

    const monthlyStats = {
      rides: completedBookings.length,
      total: completedBookings.reduce((sum, b) => sum + b.pricing.total, 0),
      saved: 127.50, // Mock savings
      mostUsed: 'Standard Protection'
    };

    return (
      <div className={styles.contentSection}>
        {renderQuickActions()}

        {favoriteRoutes.length > 0 && (
          <div className={styles.frequentRoutesSection}>
            <h2 className={styles.sectionTitle}>YOUR FREQUENT ROUTES</h2>
            <div className={styles.sectionUnderline}></div>

            {favoriteRoutes.map((route, index) => (
              <div key={index} className={styles.frequentRouteCard}>
                <div className={styles.routeInfo}>
                  <h4 className={styles.routeName}>{route.route}</h4>
                  <div className={styles.routeStats}>
                    <span>Used {route.count} times</span>
                    {route.count >= 5 && <span> • Usually Mon-Fri 8:00 AM</span>}
                  </div>
                </div>
                <div className={styles.routeActions}>
                  <button
                    className={styles.bookAgainButton}
                    onClick={() => handleRebookTrip(route.booking.id)}
                  >
                    BOOK AGAIN
                  </button>
                  {route.count >= 5 && (
                    <button className={styles.setDailyButton}>
                      SET AS DAILY COMMUTE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.historySection}>
          <h2 className={styles.sectionTitle}>RECENT OPERATIONS</h2>
          <div className={styles.sectionUnderline}></div>

          <div className={styles.historyList}>
            {completedBookings.slice(0, 5).map((booking, index) => (
              <div key={booking.id} className={styles.historyCard}>
                <div className={styles.historyHeader}>
                  <div className={styles.historyDate}>
                    {index === 0 ? 'Yesterday, 6:30 PM' :
                     index === 1 ? 'Monday, 8:00 AM' :
                     '3 days ago'}
                  </div>
                  <div className={styles.historyStatus}>
                    <span className={styles.completedIcon}>✓</span>
                    <span>Completed</span>
                  </div>
                </div>

                <div className={styles.historyDetails}>
                  <h4 className={styles.historyService}>{booking.serviceName}</h4>
                  <div className={styles.historyRoute}>
                    {booking.pickupLocation.address.split(',')[0]} → {booking.destination.address.split(',')[0]}
                  </div>
                  <div className={styles.historyCPO}>
                    CPO: {booking.driver.name} ⭐⭐⭐⭐⭐
                  </div>
                  <div className={styles.historyPrice}>
                    £{booking.pricing.total}.00 • {booking.route.duration} minutes • {booking.route.distance} miles
                  </div>
                </div>

                <div className={styles.historyActions}>
                  <button
                    className={styles.bookReturnButton}
                    onClick={() => handleRebookTrip(booking.id)}
                  >
                    BOOK RETURN
                  </button>
                  <button
                    className={styles.viewReceiptButton}
                    onClick={() => handleViewReceipt(booking.id)}
                  >
                    VIEW RECEIPT
                  </button>
                  <button
                    className={styles.bookAgainButton}
                    onClick={() => handleRebookTrip(booking.id)}
                  >
                    BOOK AGAIN
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.viewAllHistory}>
            <button className={styles.viewAllButton}>VIEW ALL HISTORY →</button>
          </div>
        </div>

        <div className={styles.monthlyStatsSection}>
          <h2 className={styles.sectionTitle}>THIS MONTH</h2>
          <div className={styles.sectionUnderline}></div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{monthlyStats.rides}</span>
              <span className={styles.statLabel}>Operations</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>£{monthlyStats.total.toFixed(2)}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>£{monthlyStats.saved}</span>
              <span className={styles.statLabel}>Saved</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{monthlyStats.mostUsed}</span>
              <span className={styles.statLabel}>Most used</span>
            </div>
          </div>

          <button className={styles.detailedBreakdownButton}>
            VIEW DETAILED BREAKDOWN
          </button>
        </div>
      </div>
    );
  };

  // Helper Components
  const renderQuickActions = () => (
    <div className={styles.quickActionsSection}>
      <h2 className={styles.sectionTitle}>QUICK ACTIONS</h2>
      <div className={styles.sectionUnderline}></div>

      <div className={styles.quickActionsList}>
        {completedBookings.length > 0 && (
          <button className={styles.quickActionButton} onClick={handleRebookLast}>
            Rebook Last Operation
          </button>
        )}
        {favoriteRoutes.length > 0 && (
          <button className={styles.quickActionButton}>
            Favorite Routes
          </button>
        )}
        <button className={styles.quickActionButton}>
          Add to Calendar
        </button>
        {completedBookings.length >= 5 && (
          <>
            <button className={styles.quickActionButton}>
              Monthly Summary
            </button>
            <button className={styles.quickActionButton}>
              Download Receipts
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderUpcomingPreview = () => (
    <div className={styles.upcomingPreview}>
      <h3 className={styles.previewTitle}>NEXT OPERATIONS</h3>
      {scheduledBookings.slice(0, 2).map(booking => (
        <div key={booking.id} className={styles.previewCard}>
          <span className={styles.previewTime}>Tomorrow 09:00: Operation Delta - </span>
          <span className={styles.previewRoute}>
            {booking.pickupLocation.address.split(',')[0]} → {booking.destination.address.split(',')[0]}
          </span>
        </div>
      ))}
    </div>
  );

  const renderTabNavigation = () => {
    if (!hasMultipleSections) return null;

    const tabs = [];
    if (hasActiveOperation) tabs.push({ key: 'active', label: 'ACTIVE DETAIL', count: activeBookings.length, icon: '🟢' });
    if (hasUpcomingBookings) tabs.push({ key: 'upcoming', label: 'SCHEDULED', count: scheduledBookings.length, icon: '⏰' });
    if (hasHistory) tabs.push({ key: 'history', label: 'COMPLETED', count: completedBookings.length, icon: '✅' });

    const currentView = activeView || (hasActiveOperation ? 'active' : hasUpcomingBookings ? 'upcoming' : 'history');

    return (
      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tabButton} ${currentView === tab.key ? styles.activeTab : ''}`}
            onClick={() => setActiveView(tab.key as ViewType)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
            <span className={styles.tabCount}>({tab.count})</span>
          </button>
        ))}
      </div>
    );
  };

  const renderMainContent = () => {
    if (isNewUser) {
      return renderNewUserState();
    }

    if (hasMultipleSections) {
      const currentView = activeView || (hasActiveOperation ? 'active' : hasUpcomingBookings ? 'upcoming' : 'history');

      switch (currentView) {
        case 'active':
          return renderActiveRideState();
        case 'upcoming':
          return renderUpcomingBookingsState();
        case 'history':
          return renderHistoryState();
        default:
          return renderActiveRideState() || renderUpcomingBookingsState() || renderHistoryState();
      }
    }

    // Single section states
    if (hasActiveOperation && !hasUpcomingBookings && !hasHistory) {
      return renderActiveRideState();
    }

    if (hasUpcomingBookings && !hasActiveOperation && !hasHistory) {
      return renderUpcomingBookingsState();
    }

    if (hasHistory && !hasActiveOperation && !hasUpcomingBookings) {
      return renderHistoryState();
    }

    return renderNewUserState();
  };

  return (
    <div className={styles.bookingsView}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>PROTECTION OPERATIONS</h1>
        <p className={styles.pageSubtitle}>Real-time Security Coordination</p>
        <div className={styles.titleUnderline}></div>
      </div>

      {renderTabNavigation()}
      {renderMainContent()}
    </div>
  );
}