import React, { useState, useEffect, useCallback } from 'react';
import styles from './SituationSelector.module.css';

export interface Situation {
  id: 'medical' | 'business' | 'event' | 'travel' | 'general';
  icon: string;
  label: string;
  description: string;
  price: string;
  responseTime: string;
  duration: string;
  scenarios: string;
  cpoActions: string[];
  realExample: string;
  idealFor: string;
  recommended: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
}

const SITUATIONS: Situation[] = [
  {
    id: 'medical',
    icon: '',
    label: 'Medical',
    description: 'Hospital visits, clinic appointments',
    price: 'from £50/hr + £2.50/mile',
    responseTime: '2-4 min',
    duration: '2-3 hours',
    scenarios: 'Hospital appointments, clinics, procedures, specialist consultations',
    cpoActions: [
      'Provides secure vehicle transport to appointment',
      'Meets you at entrance and handles check-in',
      'Remains in waiting areas for your security',
      'Escorts between departments and consultations',
      'Ensures safe journey home in secure vehicle'
    ],
    realExample: 'Client needed discrete protection AND secure transport from Chelsea to Harley Street consultation and return journey',
    idealFor: 'Vulnerable patients, elderly, those attending sensitive appointments',
    recommended: 'essential'
  },
  {
    id: 'business',
    icon: '',
    label: 'Business',
    description: 'Meetings, negotiations, corporate events',
    price: 'from £75/hr + £2.50/mile',
    responseTime: '3-5 min',
    duration: '2-6 hours',
    scenarios: 'Corporate meetings, negotiations, conferences, business dinners',
    cpoActions: [
      'Secure vehicle transport to business location',
      'Advance venue security assessment',
      'Discrete presence during meetings',
      'Secure handling of documents/devices',
      'Protected transit to next location in secure vehicle'
    ],
    realExample: 'CEO required protection and secure transport during hostile takeover negotiations from Mayfair to Canary Wharf',
    idealFor: 'Executives, high-net-worth individuals, sensitive business dealings',
    recommended: 'executive'
  },
  {
    id: 'event',
    icon: '',
    label: 'Event',
    description: 'Concerts, theaters, public gatherings',
    price: 'from £65/hr + £2.50/mile',
    responseTime: '5-8 min',
    duration: '3-5 hours',
    scenarios: 'Premieres, galas, sporting events, concerts, award ceremonies',
    cpoActions: [
      'Secure vehicle transport to event venue',
      'Crowd management and navigation',
      'VIP entrance coordination',
      'Continuous proximity protection throughout event',
      'Protected departure and secure vehicle exit'
    ],
    realExample: 'TV personality required secure transport and protection for BAFTA awards at Royal Festival Hall',
    idealFor: 'Celebrities, public figures, VIP event attendees',
    recommended: 'shadow'
  },
  {
    id: 'travel',
    icon: '',
    label: 'Travel',
    description: 'Airport transfers, station pickups',
    price: 'from £55/hr + £2.50/mile',
    responseTime: '4-6 min',
    duration: '2-3 hours',
    scenarios: 'Airport transfers, train stations, hotel check-ins, port arrivals',
    cpoActions: [
      'Secure vehicle collection from terminal/station',
      'Luggage monitoring and security assistance',
      'Fast-track assistance where possible',
      'Route planning and threat assessment during transport',
      'Door-to-door protection service in secure vehicle'
    ],
    realExample: 'International executive needed secure vehicle transport and protection from Heathrow to Mayfair hotel',
    idealFor: 'Business travelers, families, international visitors',
    recommended: 'client-vehicle'
  },
  {
    id: 'general',
    icon: '',
    label: 'General',
    description: 'Shopping, errands, daily activities',
    price: 'from £50/hr + £2.50/mile',
    responseTime: '2-4 min',
    duration: '2-4 hours',
    scenarios: 'Shopping trips, restaurant visits, errands, daily activities',
    cpoActions: [
      'Secure vehicle transport to destination',
      'Personal escort throughout activities',
      'Carries shopping/belongings if needed',
      'Monitors surroundings continuously',
      'Protected transport back to residence in secure vehicle'
    ],
    realExample: 'Client required secure transport and protection for Bond Street luxury shopping with return to Kensington',
    idealFor: 'Daily activities, personal errands, anyone needing peace of mind',
    recommended: 'essential'
  }
];

interface SituationSelectorProps {
  selectedSituation: string | null;
  onSituationSelect: (situation: Situation | null) => void;
}

export function SituationSelector({ selectedSituation, onSituationSelect }: SituationSelectorProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleSituationSelect = (situation: Situation) => {
    // If this situation is already selected, deselect it (pass null)
    // Otherwise, select this situation
    if (selectedSituation === situation.id) {
      onSituationSelect(null);
    } else {
      onSituationSelect(situation);
    }
  };

  // Carousel navigation utilities
  const carouselCards = SITUATIONS.length; // 5 cards

  const getCarouselScrollPosition = (index: number) => {
    // Mobile: 1.5 cards visible (showing 67% width + 16px gap)
    // Tablet/Desktop: More cards visible
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) {
      // Mobile: Each card is ~67% of container width for 1.5 card display
      const cardWidth = Math.min(window.innerWidth * 0.67, 280);
      return index * (cardWidth + 16);
    } else if (isTablet) {
      return index * (320 + 16);
    } else {
      return index * (300 + 16);
    }
  };

  const scrollToCarouselIndex = useCallback((index: number) => {
    const container = document.getElementById('situationCarousel');
    if (container) {
      container.scrollTo({ left: getCarouselScrollPosition(index), behavior: 'smooth' });
      setCurrentCarouselIndex(index);
    }
  }, []);

  const navigateCarousel = useCallback((direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.max(0, currentCarouselIndex - 1)
      : Math.min(carouselCards - 1, currentCarouselIndex + 1);
    scrollToCarouselIndex(newIndex);
  }, [currentCarouselIndex, carouselCards, scrollToCarouselIndex]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).closest('.carouselWrapper')) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            navigateCarousel('left');
            break;
          case 'ArrowRight':
            event.preventDefault();
            navigateCarousel('right');
            break;
          case 'Home':
            event.preventDefault();
            scrollToCarouselIndex(0);
            break;
          case 'End':
            event.preventDefault();
            scrollToCarouselIndex(carouselCards - 1);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [carouselCards, currentCarouselIndex, navigateCarousel, scrollToCarouselIndex]);

  // Update current index on scroll
  useEffect(() => {
    const container = document.getElementById('situationCarousel');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      let cardSpacing;
      if (isMobile) {
        const cardWidth = Math.min(window.innerWidth * 0.67, 280);
        cardSpacing = cardWidth + 16;
      } else if (isTablet) {
        cardSpacing = 320 + 16;
      } else {
        cardSpacing = 300 + 16;
      }

      const newIndex = Math.round(scrollLeft / cardSpacing);
      if (newIndex !== currentCarouselIndex && newIndex >= 0 && newIndex < carouselCards) {
        setCurrentCarouselIndex(newIndex);
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    return () => container.removeEventListener('scroll', throttledScroll);
  }, [carouselCards, currentCarouselIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Where do you need protection and secure transport?</h2>
        <p className={styles.instruction}>Select your journey type to see recommended protection level</p>
      </div>

      {/* Carousel Wrapper */}
      <div className={styles.carouselWrapper}>
        {/* Navigation Arrows */}
        <button
          className={`${styles.navArrow} ${styles.navArrowLeft}`}
          onClick={() => navigateCarousel('left')}
          disabled={currentCarouselIndex === 0}
          aria-label="Previous situation"
        >
          ‹
        </button>

        <button
          className={`${styles.navArrow} ${styles.navArrowRight}`}
          onClick={() => navigateCarousel('right')}
          disabled={currentCarouselIndex === carouselCards - 1}
          aria-label="Next situation"
        >
          ›
        </button>

        {/* Carousel Container */}
        <div
          id="situationCarousel"
          className={styles.carouselContainer}
          role="region"
          aria-label="Situation protection options carousel"
        >
          <div className={styles.carouselTrack}>
            {SITUATIONS.map((situation) => {
              const isSelected = selectedSituation === situation.id;
              const isExpanded = expandedCard === situation.id;

              return (
                <div
                  key={situation.id}
                  className={`${styles.situationCard} ${isSelected ? styles.selected : ''} ${isExpanded ? styles.expanded : styles.collapsed}`}
                >
                  {/* Collapsed View - Always Visible */}
                  <div className={styles.cardHeader}>
                    <div className={styles.titleSection}>
                      <h3 className={styles.label}>{situation.label}</h3>
                      <span className={styles.price}>{situation.price}</span>
                    </div>
                    {isSelected && <span className={styles.checkmark}>✓</span>}
                  </div>

                  <div className={styles.responseInfo}>
                    <span className={styles.responseTime}>{situation.responseTime}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.duration}>{situation.duration}</span>
                  </div>

                  <div className={styles.briefDescription}>
                    {situation.description}
                  </div>

                  {/* Action Buttons - Always Visible */}
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.selectButton} ${isSelected ? styles.selectButtonSelected : ''}`}
                      onClick={() => handleSituationSelect(situation)}
                      aria-label={isSelected ? `Deselect ${situation.label} protection service` : `Select ${situation.label} protection service`}
                    >
                      {isSelected ? 'Selected ✓' : 'Select This Protection'}
                    </button>
                    <button
                      className={styles.detailsButton}
                      onClick={() => toggleExpand(situation.id)}
                      aria-label={`${isExpanded ? 'Hide' : 'View'} details for ${situation.label}`}
                    >
                      {isExpanded ? 'Show Less ↑' : 'View Details ↓'}
                    </button>
                  </div>

                  {/* Expanded Content - Conditionally Visible */}
                  {isExpanded && (
                    <div className={styles.expandedContent}>
                      <div className={styles.forSection}>
                        <strong>For:</strong> {situation.scenarios}
                      </div>

                      <div className={styles.actionsSection}>
                        <div className={styles.actionsTitle}>What your CPO does:</div>
                        <ul className={styles.actionsList}>
                          {situation.cpoActions.map((action, index) => (
                            <li key={index} className={styles.actionItem}>• {action}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.exampleSection}>
                        <strong>Real example:</strong> {situation.realExample}
                      </div>

                      <div className={styles.footer}>
                        <div className={styles.idealFor}>
                          <strong>Ideal for:</strong> {situation.idealFor}
                        </div>
                        <div className={styles.badges}>
                          <div className={styles.siaLicensed}>✓ SIA Licensed</div>
                          <div className={styles.transportIncluded}>🚗 Secure Vehicle Included</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className={styles.carouselIndicators}>
          {SITUATIONS.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${currentCarouselIndex === index ? styles.indicatorActive : ''}`}
              onClick={() => scrollToCarouselIndex(index)}
              aria-label={`Go to situation ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { SITUATIONS };