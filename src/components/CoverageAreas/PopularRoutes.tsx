import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './PopularRoutes.module.css';

interface RoutePrice {
  from: string;
  to: string;
  distance: number;
  price: number;
  time: string;
  popular?: boolean;
}

export function PopularRoutes() {
  const { navigateToView } = useApp();
  const [selectedTab, setSelectedTab] = useState<'london' | 'intercity' | 'airports'>('london');

  // Pre-calculated popular routes
  const londonRoutes: RoutePrice[] = [
    { from: 'Mayfair', to: 'Heathrow Airport', distance: 16.8, price: 152, time: '42 min', popular: true },
    { from: 'Canary Wharf', to: 'Gatwick Airport', distance: 42.0, price: 198, time: '65 min', popular: true },
    { from: 'Westminster', to: 'Stansted Airport', distance: 38.0, price: 176, time: '55 min' },
    { from: 'The City', to: 'London City Airport', distance: 6.0, price: 96, time: '15 min', popular: true },
    { from: 'Kensington', to: 'Luton Airport', distance: 32.5, price: 162, time: '48 min' },
    { from: 'Chelsea', to: 'Oxford Street', distance: 3.2, price: 85, time: '12 min' },
    { from: 'Shoreditch', to: 'Waterloo Station', distance: 4.5, price: 88, time: '18 min' },
    { from: 'Hampstead', to: 'The Shard', distance: 8.2, price: 102, time: '25 min' }
  ];

  const intercityRoutes: RoutePrice[] = [
    { from: 'London', to: 'Manchester', distance: 201.0, price: 802, time: '3.5 hours', popular: true },
    { from: 'London', to: 'Birmingham', distance: 113.0, price: 425, time: '2 hours' },
    { from: 'Manchester', to: 'Liverpool', distance: 35.0, price: 186, time: '45 min' },
    { from: 'Birmingham', to: 'Bristol', distance: 91.0, price: 328, time: '1.5 hours' },
    { from: 'Leeds', to: 'Manchester', distance: 44.0, price: 210, time: '1 hour' },
    { from: 'London', to: 'Bristol', distance: 118.0, price: 445, time: '2 hours' },
    { from: 'London', to: 'Cardiff', distance: 155.0, price: 538, time: '3 hours', popular: true },
    { from: 'Birmingham', to: 'London', distance: 113.0, price: 425, time: '2 hours' }
  ];

  const airportRoutes: RoutePrice[] = [
    { from: 'Central Manchester', to: 'Manchester Airport', distance: 9.5, price: 124, time: '20 min', popular: true },
    { from: 'Birmingham Centre', to: 'Birmingham Airport', distance: 11.0, price: 128, time: '25 min' },
    { from: 'Bristol Centre', to: 'Bristol Airport', distance: 8.0, price: 120, time: '18 min' },
    { from: 'Liverpool Centre', to: 'Liverpool Airport', distance: 7.5, price: 119, time: '20 min' },
    { from: 'Newcastle Centre', to: 'Newcastle Airport', distance: 7.0, price: 118, time: '15 min' },
    { from: 'Edinburgh Centre', to: 'Edinburgh Airport', distance: 9.0, price: 145, time: '25 min' },
    { from: 'Cardiff Centre', to: 'Cardiff Airport', distance: 12.0, price: 130, time: '30 min' },
    { from: 'Leeds Centre', to: 'Leeds Bradford', distance: 10.0, price: 125, time: '25 min' }
  ];

  const getCurrentRoutes = () => {
    switch (selectedTab) {
      case 'london':
        return londonRoutes;
      case 'intercity':
        return intercityRoutes;
      case 'airports':
        return airportRoutes;
      default:
        return londonRoutes;
    }
  };

  const handleQuickBook = (route: RoutePrice) => {
    // Store route data for quick protection assignment
    localStorage.setItem('armora_quick_route', JSON.stringify(route));
    navigateToView('protection-request');
  };

  const formatPrice = (price: number) => {
    return `£${price.toFixed(0)}`;
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>POPULAR PROTECTION ROUTES</h2>
        <p className={styles.subtitle}>
          Pre-calculated prices for frequently requested journeys
        </p>

        {/* Tab Navigation */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${selectedTab === 'london' ? styles.activeTab : ''}`}
            onClick={() => setSelectedTab('london')}
          >
            <span className={styles.tabIcon}>🏙️</span>
            London Routes
          </button>
          <button
            className={`${styles.tab} ${selectedTab === 'intercity' ? styles.activeTab : ''}`}
            onClick={() => setSelectedTab('intercity')}
          >
            <span className={styles.tabIcon}>🚗</span>
            Inter-City
          </button>
          <button
            className={`${styles.tab} ${selectedTab === 'airports' ? styles.activeTab : ''}`}
            onClick={() => setSelectedTab('airports')}
          >
            <span className={styles.tabIcon}>✈️</span>
            Regional Airports
          </button>
        </div>

        {/* Routes Table */}
        <div className={styles.routesTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerFrom}>From</div>
            <div className={styles.headerTo}>To</div>
            <div className={styles.headerDistance}>Distance</div>
            <div className={styles.headerTime}>Time</div>
            <div className={styles.headerPrice}>Price</div>
            <div className={styles.headerAction}></div>
          </div>

          {getCurrentRoutes().map((route, index) => (
            <div
              key={index}
              className={`${styles.routeRow} ${route.popular ? styles.popularRoute : ''}`}
            >
              {route.popular && (
                <span className={styles.popularBadge}>Popular</span>
              )}
              <div className={styles.routeFrom}>
                <span className={styles.locationIcon}>📍</span>
                {route.from}
              </div>
              <div className={styles.routeTo}>
                <span className={styles.locationIcon}>🏁</span>
                {route.to}
              </div>
              <div className={styles.routeDistance}>{route.distance} mi</div>
              <div className={styles.routeTime}>{route.time}</div>
              <div className={styles.routePrice}>
                <span className={styles.priceAmount}>{formatPrice(route.price)}</span>
                <span className={styles.priceLabel}>estimated</span>
              </div>
              <div className={styles.routeAction}>
                <button
                  className={styles.bookButton}
                  onClick={() => handleQuickBook(route)}
                >
                  Quick Request
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Notes */}
        <div className={styles.pricingNotes}>
          <h3 className={styles.notesTitle}>Pricing Information</h3>
          <div className={styles.notesGrid}>
            <div className={styles.noteItem}>
              <span className={styles.noteIcon}>💷</span>
              <div>
                <strong>Standard Protection:</strong> £50/hour (2h minimum)
              </div>
            </div>
            <div className={styles.noteItem}>
              <span className={styles.noteIcon}>🚗</span>
              <div>
                <strong>Vehicle Operation:</strong> £2.50 per mile
              </div>
            </div>
            <div className={styles.noteItem}>
              <span className={styles.noteIcon}>⭐</span>
              <div>
                <strong>Members:</strong> 20% discount on all routes
              </div>
            </div>
            <div className={styles.noteItem}>
              <span className={styles.noteIcon}>📍</span>
              <div>
                <strong>Regional:</strong> Additional fees may apply outside London
              </div>
            </div>
          </div>
        </div>

        {/* Long Distance Notice */}
        {selectedTab === 'intercity' && (
          <div className={styles.longDistanceNotice}>
            <div className={styles.noticeIcon}>ℹ️</div>
            <div className={styles.noticeContent}>
              <strong>Long Distance Protection Services</strong>
              <p>
                For journeys over 100 miles, we recommend our overnight protection packages.
                Officer deployment from regional hubs may be required for optimal service.
              </p>
              <button className={styles.noticeButton}>
                Learn About Overnight Protection
              </button>
            </div>
          </div>
        )}

        {/* Custom Route CTA */}
        <div className={styles.customRouteCTA}>
          <h3>Need a custom route quote?</h3>
          <p>Get instant pricing for any journey in England & Wales</p>
          <button
            className={styles.customRouteButton}
            onClick={() => navigateToView('protection-request')}
          >
            Calculate Custom Route
          </button>
        </div>
      </div>
    </section>
  );
}