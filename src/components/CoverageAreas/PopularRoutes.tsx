import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './PopularRoutes.module.css';

export function PopularRoutes() {
  const { navigateToView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'london' | 'intercity' | 'airport'>('london');

  const londonRoutes = [
    {
      id: 'mayfair-heathrow',
      from: 'Mayfair',
      to: 'Heathrow Airport',
      distance: '16.8 mi',
      duration: '35-45 mins',
      price: 152,
      popular: true,
      description: 'Premium West London to international hub'
    },
    {
      id: 'canary-wharf-gatwick',
      from: 'Canary Wharf',
      to: 'Gatwick Airport',
      distance: '42 mi',
      duration: '55-75 mins',
      price: 198,
      popular: false,
      description: 'Financial district to South London airport'
    },
    {
      id: 'westminster-stansted',
      from: 'Westminster',
      to: 'Stansted Airport',
      distance: '38 mi',
      duration: '50-70 mins',
      price: 176,
      popular: false,
      description: 'Central London to Essex aviation hub'
    },
    {
      id: 'city-london-city',
      from: 'The City',
      to: 'London City Airport',
      distance: '6 mi',
      duration: '15-25 mins',
      price: 96,
      popular: true,
      description: 'Financial district to business airport'
    },
    {
      id: 'knightsbridge-kensington',
      from: 'Knightsbridge',
      to: 'Kensington Palace',
      distance: '2.1 mi',
      duration: '8-12 mins',
      price: 78,
      popular: false,
      description: 'Luxury shopping to royal residence'
    },
    {
      id: 'shoreditch-canary-wharf',
      from: 'Shoreditch',
      to: 'Canary Wharf',
      distance: '8.2 mi',
      duration: '20-30 mins',
      price: 112,
      popular: true,
      description: 'Creative quarter to financial district'
    }
  ];

  const intercityRoutes = [
    {
      id: 'london-manchester',
      from: 'Central London',
      to: 'Manchester',
      distance: '200 mi',
      duration: '4-5 hours',
      price: 802,
      popular: true,
      description: 'Capital to northern powerhouse'
    },
    {
      id: 'london-birmingham',
      from: 'Central London',
      to: 'Birmingham',
      distance: '120 mi',
      duration: '2.5-3 hours',
      price: 425,
      popular: true,
      description: 'London to second city'
    },
    {
      id: 'manchester-liverpool',
      from: 'Manchester',
      to: 'Liverpool',
      distance: '35 mi',
      duration: '45-60 mins',
      price: 186,
      popular: false,
      description: 'Northwest cities connection'
    },
    {
      id: 'london-bristol',
      from: 'Central London',
      to: 'Bristol',
      distance: '118 mi',
      duration: '2-3 hours',
      price: 398,
      popular: false,
      description: 'Capital to southwest hub'
    },
    {
      id: 'birmingham-manchester',
      from: 'Birmingham',
      to: 'Manchester',
      distance: '88 mi',
      duration: '1.5-2 hours',
      price: 312,
      popular: false,
      description: 'Midlands to northwest'
    },
    {
      id: 'london-oxford',
      from: 'Central London',
      to: 'Oxford',
      distance: '56 mi',
      duration: '1-1.5 hours',
      price: 248,
      popular: true,
      description: 'Capital to university city'
    }
  ];

  const airportRoutes = [
    {
      id: 'heathrow-gatwick',
      from: 'Heathrow',
      to: 'Gatwick',
      distance: '45 mi',
      duration: '60-90 mins',
      price: 215,
      popular: true,
      description: 'Major airport transfer'
    },
    {
      id: 'stansted-heathrow',
      from: 'Stansted',
      to: 'Heathrow',
      distance: '42 mi',
      duration: '55-80 mins',
      price: 198,
      popular: false,
      description: 'International hub connection'
    },
    {
      id: 'luton-gatwick',
      from: 'Luton',
      to: 'Gatwick',
      distance: '58 mi',
      duration: '70-100 mins',
      price: 264,
      popular: false,
      description: 'Cross-London airport transfer'
    },
    {
      id: 'manchester-airport-city',
      from: 'Manchester Airport',
      to: 'Manchester City Centre',
      distance: '9 mi',
      duration: '20-30 mins',
      price: 118,
      popular: true,
      description: 'Airport to city center'
    },
    {
      id: 'birmingham-airport-city',
      from: 'Birmingham Airport',
      to: 'Birmingham City Centre',
      distance: '8 mi',
      duration: '18-25 mins',
      price: 108,
      popular: false,
      description: 'Airport to city center'
    },
    {
      id: 'bristol-airport-city',
      from: 'Bristol Airport',
      to: 'Bristol City Centre',
      distance: '7 mi',
      duration: '15-22 mins',
      price: 98,
      popular: false,
      description: 'Airport to city center'
    }
  ];

  const getRoutes = () => {
    switch (selectedCategory) {
      case 'london': return londonRoutes;
      case 'intercity': return intercityRoutes;
      case 'airport': return airportRoutes;
      default: return londonRoutes;
    }
  };

  const handleBookRoute = (route: any) => {
    // Store route data for quick booking
    const routeData = {
      pickup: route.from,
      destination: route.to,
      estimatedDistance: parseFloat(route.distance),
      estimatedDuration: route.duration,
      estimatedCost: route.price
    };

    localStorage.setItem('armora_quick_route', JSON.stringify(routeData));
    navigateToView('booking');
  };

  const categories = [
    { id: 'london', label: 'Central London', icon: '🏛️' },
    { id: 'intercity', label: 'Inter-City', icon: '🚗' },
    { id: 'airport', label: 'Airport Routes', icon: '✈️' }
  ];

  return (
    <section className={styles.routesSection}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Popular Protection Routes</h2>
        <p className={styles.sectionSubtitle}>
          Pre-calculated pricing for frequently requested journeys
        </p>

        {/* Category Selector */}
        <div className={styles.categorySelector}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                selectedCategory === category.id ? styles.categoryActive : ''
              }`}
              onClick={() => setSelectedCategory(category.id as any)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryLabel}>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Routes Grid */}
        <div className={styles.routesGrid}>
          {getRoutes().map((route) => (
            <div key={route.id} className={`${styles.routeCard} ${route.popular ? styles.routePopular : ''}`}>
              {route.popular && (
                <div className={styles.popularBadge}>
                  <span className={styles.popularIcon}>⭐</span>
                  <span className={styles.popularText}>Popular</span>
                </div>
              )}

              <div className={styles.routeHeader}>
                <div className={styles.routePath}>
                  <div className={styles.fromLocation}>{route.from}</div>
                  <div className={styles.routeArrow}>→</div>
                  <div className={styles.toLocation}>{route.to}</div>
                </div>
                <div className={styles.routePrice}>£{route.price}</div>
              </div>

              <div className={styles.routeDetails}>
                <div className={styles.routeInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span className={styles.infoText}>{route.distance}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>⏱️</span>
                    <span className={styles.infoText}>{route.duration}</span>
                  </div>
                </div>
                <p className={styles.routeDescription}>{route.description}</p>
              </div>

              <div className={styles.routeActions}>
                <button
                  className={styles.bookRouteButton}
                  onClick={() => handleBookRoute(route)}
                >
                  Book This Route
                </button>
                <button
                  className={styles.quoteButton}
                  onClick={() => handleBookRoute(route)}
                >
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Route Information */}
        <div className={styles.routeInfo}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>
              <span className={styles.infoTitleIcon}>💰</span>
              Transparent Pricing
            </h3>
            <p className={styles.infoText}>
              All prices include SIA-licensed officer, secure vehicle, fuel, and insurance.
              No hidden fees or surge pricing.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>
              <span className={styles.infoTitleIcon}>🕐</span>
              Time Estimates
            </h3>
            <p className={styles.infoText}>
              Journey times include security briefing and route optimization.
              Real-time traffic monitoring for accurate arrivals.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>
              <span className={styles.infoTitleIcon">🛡️</span>
              Protection Included
            </h3>
            <p className={styles.infoText}>
              Every route includes threat assessment, secure vehicle, and
              trained Close Protection Officer throughout the journey.
            </p>
          </div>
        </div>

        {/* Custom Route CTA */}
        <div className={styles.customRouteSection}>
          <div className={styles.customRouteCard}>
            <h3 className={styles.customRouteTitle}>Don't See Your Route?</h3>
            <p className={styles.customRouteText}>
              We provide protection services anywhere in the UK.
              Get a custom quote for your specific journey requirements.
            </p>
            <div className={styles.customRouteButtons}>
              <button
                className={styles.customQuoteButton}
                onClick={() => navigateToView('booking')}
              >
                Get Custom Quote
              </button>
              <button
                className={styles.callButton}
                onClick={() => window.location.href = 'tel:+442071234567'}
              >
                Call for Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}