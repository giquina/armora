import React, { useState, useEffect } from 'react';
import { ServiceLevel } from '../../types';
import { Button } from '../UI/Button';
import { InlineQuickScheduling } from '../UI/InlineQuickScheduling';
import { StreamlinedBookingModal } from '../UI/StreamlinedBookingModal';
import styles from './ServiceCard.module.css';

// Service tier configuration for visual differentiation
const SERVICE_CONFIG = {
  standard: {
    theme: 'professional',
    icon: '🛡️',
    vehicle: 'Nissan Leaf EV',
    vehicleNote: '(Discreet)',
    driverLevel: 'SIA Level 2 Security Certified',
    capacity: '4 passengers',
    eta: '5-8 min',
    rating: 4.8,
    reviewCount: 2847,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
    accentColor: '#c0c0c0'
  },
  executive: {
    theme: 'luxury',
    icon: '👑',
    vehicle: 'BMW 5 Series',
    vehicleNote: '(Security Modified)',
    driverLevel: 'SIA Level 3 Security Certified',
    capacity: '4 passengers',
    eta: '3-5 min',
    rating: 4.9,
    reviewCount: 1653,
    gradient: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
    accentColor: '#FFD700'
  },
  shadow: {
    theme: 'tactical',
    icon: '🕴️',
    vehicle: 'Armored BMW X5',
    vehicleNote: '(Tactical Spec)',
    driverLevel: 'Special Forces Trained',
    capacity: '4 passengers',
    eta: 'On-demand',
    rating: 5.0,
    reviewCount: 892,
    gradient: 'linear-gradient(135deg, #0f0f1f 0%, #1a1a2e 100%)',
    accentColor: '#ff4444'
  }
};

interface ServiceCardProps {
  service: ServiceLevel;
  isSelected: boolean;
  onSelect: (serviceId: 'standard' | 'executive' | 'shadow') => void;
  mode: 'selection' | 'preview';
  isRecommended?: boolean;
  onBookNow?: (serviceId: 'standard' | 'executive' | 'shadow') => void;
  onScheduleSelect?: (serviceId: 'standard' | 'executive' | 'shadow') => void;
}

export function ServiceCard({
  service,
  isSelected,
  onSelect,
  mode,
  isRecommended = false,
  onBookNow,
  onScheduleSelect
}: ServiceCardProps) {
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'busy' | 'surge'>('available');
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [showInlineScheduling, setShowInlineScheduling] = useState(false);
  const [showStreamlinedBooking, setShowStreamlinedBooking] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [pickupTime, setPickupTime] = useState<'now' | '15min' | '30min' | 'custom'>('now');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [scheduledDisplayText, setScheduledDisplayText] = useState('');

  // Form validation - require both pickup and dropoff locations
  const isFormValid = pickupLocation.trim() !== '' && dropoffLocation.trim() !== '';

  // Calculate estimated journey details (placeholder logic)
  const getJourneyEstimate = () => {
    if (pickupLocation && dropoffLocation) {
      return {
        distance: '8.5 km',
        duration: '15-20 min',
        estimatedCost: service.hourlyRate ? `£${Math.round(service.hourlyRate * 0.4)}` : 'TBD'
      };
    }
    return null;
  };

  const config = SERVICE_CONFIG[service.id];

  // Simulate dynamic availability (in real app, this would come from API) - FIXED: Add empty dependency array
  useEffect(() => {
    const statuses: Array<'available' | 'busy' | 'surge'> = ['available', 'available', 'available', 'busy', 'surge'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setAvailabilityStatus(randomStatus);
  }, []); // Run only once on mount

  const handleSelect = () => {
    if (mode === 'selection') {
      onSelect(service.id);
    }
  };

  const handleScheduleForLater = () => {
    setShowQuickBooking(false); // Close quick booking if open
    setShowInlineScheduling(true);
    onSelect(service.id); // Select this service
  };

  const handleInlineTimeSelected = (dateTime: string, displayText: string) => {
    setScheduledDateTime(dateTime);
    setScheduledDisplayText(displayText);
  };

  const handleInlineBookNow = () => {
    // Store comprehensive booking details
    const bookingData = {
      serviceId: service.id,
      scheduledDateTime: scheduledDateTime || 'immediate',
      scheduledDisplayText: scheduledDisplayText || 'Immediate pickup',
      pickupLocation,
      dropoffLocation,
      timestamp: new Date().toISOString(),
      bookingType: scheduledDateTime === 'immediate' ? 'immediate' : 'scheduled'
    };

    localStorage.setItem('armora_booking_details', JSON.stringify(bookingData));

    setIsBookingLoading(true);
    setTimeout(() => {
      onBookNow?.(service.id);
    }, 300);
  };

  const handleCancelInlineScheduling = () => {
    setShowInlineScheduling(false);
    setScheduledDateTime('');
    setScheduledDisplayText('');
  };

  const handleStreamlinedBookNow = () => {
    setShowQuickBooking(false); // Close other booking interfaces
    setShowInlineScheduling(false);
    setShowStreamlinedBooking(true);
    onSelect(service.id); // Select this service
  };

  const handleStreamlinedBookingConfirm = (bookingData: any) => {
    console.log('[Analytics] Streamlined booking completed', {
      service: service.id,
      bookingData,
      timestamp: Date.now()
    });

    // Store comprehensive booking data
    localStorage.setItem('armora_streamlined_booking', JSON.stringify(bookingData));

    setIsBookingLoading(true);
    setShowStreamlinedBooking(false);

    // Brief delay for UX then proceed to booking flow
    setTimeout(() => {
      onBookNow?.(service.id);
    }, 500);
  };

  const handleStreamlinedBookingClose = () => {
    setShowStreamlinedBooking(false);
  };

  const getAvailabilityInfo = () => {
    switch (availabilityStatus) {
      case 'available':
        return { text: `${config.eta} away`, color: '#22c55e', icon: '🟢' };
      case 'busy':
        return { text: '10-15 min', color: '#f59e0b', icon: '🟡' };
      case 'surge':
        return { text: 'High demand', color: '#ef4444', icon: '🔴' };
      default:
        return { text: config.eta, color: '#22c55e', icon: '🟢' };
    }
  };

  const availability = getAvailabilityInfo();

  const cardClasses = [
    styles.serviceCard,
    isSelected && styles.selected,
    isRecommended && styles.recommended,
    service.isPopular && styles.popular,
    mode === 'preview' && styles.preview
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleSelect}
      data-testid={`service-${service.id}`}
      data-service={service.id}
      style={{
        '--service-gradient': config.gradient,
        '--service-accent': config.accentColor,
        '--availability-color': availability.color
      } as React.CSSProperties}
    >
      {/* Top Corner Badges and Availability */}
      <div className={styles.topSection}>
        {/* Service Icon - Left Side */}
        <div className={styles.serviceIconContainer}>
          <div className={styles.serviceIcon}>{config.icon}</div>
        </div>

        {/* Right Corner Badges */}
        <div className={styles.topRightBadges}>
          {/* Availability Indicator */}
          <div className={styles.availabilityIndicator}>
            <span className={styles.availabilityDot} style={{ backgroundColor: availability.color }}></span>
            <span className={styles.availabilityText}>{availability.text}</span>
          </div>

          {/* Popular Badge */}
          {service.isPopular && (
            <div className={styles.popularBadge}>
              <span className={styles.popularIcon}>🔥</span>
              Most Popular
            </div>
          )}

          {/* Recommended Badge */}
          {isRecommended && (
            <div className={styles.recommendedBadge}>
              <span className={styles.recommendedIcon}>⭐</span>
              Recommended
            </div>
          )}
        </div>
      </div>

      {/* Service Header */}
      <div className={styles.serviceHeader}>
        <div className={styles.serviceInfo}>
          <h3 className={styles.serviceName}>{service.name}</h3>
          <p className={styles.serviceTagline}>{service.tagline}</p>
        </div>
        <div className={styles.priceInfo}>
          <div className={styles.price}>{service.price}</div>
          {availabilityStatus === 'surge' && (
            <div className={styles.surgeIndicator}>+£5 surge</div>
          )}
        </div>
      </div>

      {/* Vehicle and Driver Info - Compact Horizontal Layout */}
      <div className={styles.vehicleSection}>
        <div className={styles.vehicleInfo}>
          <div className={styles.vehicleDetail}>
            <span className={styles.vehicleLabel}>Vehicle:</span>
            <span className={styles.vehicleValue}>{config.vehicle} | {config.capacity}</span>
          </div>
        </div>
        <div className={styles.driverInfo}>
          <span className={styles.driverLabel}>Driver:</span>
          <span className={styles.driverLevel}>{config.driverLevel}</span>
        </div>
      </div>

      {/* Rating Section */}
      <div className={styles.ratingSection}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(config.rating) ? styles.starFilled : styles.starEmpty}>
              ⭐
            </span>
          ))}
          <span className={styles.ratingNumber}>{config.rating}</span>
        </div>
        <span className={styles.reviewCount}>({config.reviewCount.toLocaleString()} rides)</span>
      </div>

      {/* Service Description */}
      <div className={styles.descriptionSection}>
        <p className={styles.description}>{service.description}</p>
      </div>


      {/* Social Proof */}
      {service.socialProof && (
        <div className={styles.socialProof}>
          <div className={styles.socialProofItem}>
            <span className={styles.socialProofNumber}>
              {service.socialProof.tripsCompleted.toLocaleString()}
            </span>
            <span className={styles.socialProofLabel}>trips completed</span>
          </div>
          {service.socialProof.selectionRate && (
            <div className={styles.socialProofItem}>
              <span className={styles.socialProofNumber}>
                {service.socialProof.selectionRate}%
              </span>
              <span className={styles.socialProofLabel}>choose this service</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Booking Dropdown */}
      {showQuickBooking && (
        <div className={styles.quickBookingDropdown}>
          <div className={styles.quickBookingHeader}>
            <h4 className={styles.quickBookingTitle}>Quick Book - {service.name}</h4>
            <button
              className={styles.quickBookingClose}
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickBooking(false);
              }}
            >
              ×
            </button>
          </div>
          <div className={styles.quickBookingContent}>
            <div className={styles.pickupTimeOptions}>
              <label className={styles.pickupLabel}>Pickup Time:</label>
              <div className={styles.timeButtons}>
                <button
                  className={`${styles.timeButton} ${pickupTime === 'now' ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPickupTime('now');
                  }}
                >
                  Now
                </button>
                <button
                  className={`${styles.timeButton} ${pickupTime === '15min' ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPickupTime('15min');
                  }}
                >
                  +15 min
                </button>
                <button
                  className={`${styles.timeButton} ${pickupTime === '30min' ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPickupTime('30min');
                  }}
                >
                  +30 min
                </button>
              </div>
            </div>
            {/* Enhanced Location Section */}
            <div className={styles.locationSection}>
              <div className={styles.sectionHeader}>
                <h5 className={styles.sectionTitle}>Journey Details</h5>
                {getJourneyEstimate() && (
                  <div className={styles.journeyEstimate}>
                    <span className={styles.estimateText}>
                      {getJourneyEstimate()?.distance} • {getJourneyEstimate()?.duration} • {getJourneyEstimate()?.estimatedCost}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.locationInputGroup}>
                <div className={styles.locationInputWrapper}>
                  <div className={styles.locationIcon}>📍</div>
                  <div className={styles.locationInputField}>
                    <label className={styles.locationLabel}>Pickup Location</label>
                    <input
                      type="text"
                      placeholder="Enter pickup address or use current location"
                      className={`${styles.locationInput} ${!pickupLocation && isFormValid === false ? styles.inputError : ''}`}
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    className={styles.currentLocationButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPickupLocation('Current Location');
                    }}
                    title="Use current location"
                  >
                    📍
                  </button>
                </div>

                <div className={styles.routeConnector}>
                  <div className={styles.routeLine}></div>
                  <div className={styles.routeDots}>
                    <div className={styles.routeDot}></div>
                    <div className={styles.routeDot}></div>
                    <div className={styles.routeDot}></div>
                  </div>
                </div>

                <div className={styles.locationInputWrapper}>
                  <div className={styles.locationIcon}>🏁</div>
                  <div className={styles.locationInputField}>
                    <label className={styles.locationLabel}>Drop-off Destination</label>
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      className={`${styles.locationInput} ${!dropoffLocation && isFormValid === false ? styles.inputError : ''}`}
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    className={styles.swapLocationButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      const temp = pickupLocation;
                      setPickupLocation(dropoffLocation);
                      setDropoffLocation(temp);
                    }}
                    title="Swap pickup and drop-off locations"
                    disabled={!pickupLocation && !dropoffLocation}
                  >
                    ⇄
                  </button>
                </div>
              </div>
            </div>
            {/* Enhanced Action Section */}
            <div className={styles.actionSection}>
              {!isFormValid && (
                <div className={styles.validationMessage}>
                  <span className={styles.validationIcon}>ℹ️</span>
                  <span className={styles.validationText}>
                    Please enter both pickup and drop-off locations to continue
                  </span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                isFullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFormValid) {
                    setIsBookingLoading(true);
                    // Store booking details
                    const bookingData = {
                      serviceId: service.id,
                      pickupTime,
                      pickupLocation,
                      dropoffLocation,
                      estimate: getJourneyEstimate()
                    };
                    localStorage.setItem('armora_booking_details', JSON.stringify(bookingData));

                    setTimeout(() => {
                      onSelect(service.id);
                      onBookNow?.(service.id);
                    }, 500);
                  }
                }}
                disabled={isBookingLoading || !isFormValid}
                className={`${styles.confirmBookingButton} ${!isFormValid ? styles.disabledButton : ''}`}
              >
                {isBookingLoading ? (
                  <>
                    <span className={styles.loadingSpinner}>⏳</span>
                    Confirming Booking...
                  </>
                ) : (
                  <>
                    <span className={styles.buttonIcon}>🚗</span>
                    {isFormValid ? `Book ${service.name.split(' ')[1]} - ${getJourneyEstimate()?.estimatedCost || service.price}` : 'Complete Journey Details'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card Footer - Direct Booking Actions */}
      <div className={styles.cardFooter}>
        {mode === 'selection' ? (
          <div className={styles.bookingActions}>
            <Button
              variant="primary"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                handleStreamlinedBookNow();
              }}
              className={styles.bookNowButton}
              disabled={isBookingLoading}
            >
              {isBookingLoading ? 'Processing...' : 'Book Now'}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                handleScheduleForLater();
              }}
              className={styles.scheduleButton}
            >
              Schedule for Later
            </Button>
          </div>
        ) : (
          <div className={styles.previewFooter}>
            <p className={styles.previewText}>
              Create account to book this service
            </p>
          </div>
        )}
      </div>

      {/* New Inline Quick Scheduling - Option A Implementation */}
      {showInlineScheduling && (
        <InlineQuickScheduling
          onTimeSelected={handleInlineTimeSelected}
          onBookNow={handleInlineBookNow}
          onCancel={handleCancelInlineScheduling}
          isLoading={isBookingLoading}
          userProfile={{
            isBusinessUser: false, // This could be passed from props if available
            preferredTime: '9:00'
          }}
        />
      )}

      {/* New Streamlined Booking Modal - Redesigned Book Now Flow */}
      <StreamlinedBookingModal
        isOpen={showStreamlinedBooking}
        onClose={handleStreamlinedBookingClose}
        selectedService={{
          id: service.id,
          name: service.name,
          hourlyRate: service.hourlyRate || 45,
          description: service.description
        }}
        onBookingConfirm={handleStreamlinedBookingConfirm}
        userProfile={{
          hasUnlockedReward: false, // This would come from actual user data
          userType: 'registered', // This would come from actual user data
          recentLocations: [] // This would come from user's booking history
        }}
      />

    </div>
  );
}