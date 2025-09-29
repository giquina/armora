import { FC, useState, useCallback } from 'react';
import styles from './FavoriteCPOs.module.css';

interface CPOProfile {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  completedAssignments: number;
  specializations: string[];
  tier: 'Essential' | 'Executive' | 'Shadow';
  availability: 'available' | 'busy' | 'offline';
  lastAssignment: string;
  responseTime: string;
  vehicleTypes: string[];
  siaLicense: string;
}

interface FavoriteCPOsProps {
  className?: string;
  onBookWithCPO?: (cpoId: string) => void;
  onViewProfile?: (cpoId: string) => void;
}

// Mock data for favorite CPOs
const mockFavoriteCPOs: CPOProfile[] = [
  {
    id: 'cpo-001',
    name: 'Sarah Mitchell',
    photo: '/images/officers/sarah-m.jpg',
    rating: 4.9,
    completedAssignments: 127,
    specializations: ['Airport Security', 'Executive Protection', 'Event Security'],
    tier: 'Executive',
    availability: 'available',
    lastAssignment: '2 days ago',
    responseTime: '8 minutes',
    vehicleTypes: ['Range Rover Sport', 'BMW 5 Series'],
    siaLicense: 'SIA-2345-6789'
  },
  {
    id: 'cpo-002',
    name: 'John Davis',
    photo: '/images/officers/john-d.jpg',
    rating: 4.8,
    completedAssignments: 203,
    specializations: ['Close Protection', 'Surveillance', 'Risk Assessment'],
    tier: 'Shadow',
    availability: 'available',
    lastAssignment: '5 days ago',
    responseTime: '12 minutes',
    vehicleTypes: ['BMW 5 Series', 'Mercedes E-Class'],
    siaLicense: 'SIA-1234-5678'
  },
  {
    id: 'cpo-003',
    name: 'Michael Thompson',
    photo: '/images/officers/michael-t.jpg',
    rating: 4.7,
    completedAssignments: 89,
    specializations: ['Personal Protection', 'Secure Transport', 'Venue Security'],
    tier: 'Essential',
    availability: 'busy',
    lastAssignment: '1 day ago',
    responseTime: '15 minutes',
    vehicleTypes: ['Mercedes E-Class', 'BMW 3 Series'],
    siaLicense: 'SIA-3456-7890'
  }
];

export const FavoriteCPOs: FC<FavoriteCPOsProps> = ({
  className = '',
  onBookWithCPO,
  onViewProfile
}) => {
  const [selectedCPO, setSelectedCPO] = useState<string | null>(null);

  const handleBookWithCPO = useCallback((cpoId: string) => {
    if (onBookWithCPO) {
      onBookWithCPO(cpoId);
    } else {
      // Default behavior: navigate to booking with pre-selected CPO
      console.log('Booking with CPO:', cpoId);
    }
  }, [onBookWithCPO]);

  const handleViewProfile = useCallback((cpoId: string) => {
    if (onViewProfile) {
      onViewProfile(cpoId);
    } else {
      // Default behavior: show CPO profile modal/page
      console.log('Viewing CPO profile:', cpoId);
    }
  }, [onViewProfile]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#10B981'; // Green
      case 'busy': return '#F59E0B'; // Amber
      case 'offline': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  };

  const getServiceTierStyle = (tier: string) => {
    switch (tier) {
      case 'Essential': return { color: '#00D4FF', background: 'rgba(0, 212, 255, 0.1)' };
      case 'Executive': return { color: '#FFD700', background: 'rgba(255, 215, 0, 0.1)' };
      case 'Shadow': return { color: '#FF6B6B', background: 'rgba(255, 107, 107, 0.1)' };
      default: return { color: '#A0A0A0', background: 'rgba(160, 160, 160, 0.1)' };
    }
  };

  return (
    <div className={`${styles.favoriteCPOsContainer} ${className}`}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h3 className={styles.sectionTitle}>Your Favorite CPOs</h3>
            <span className={styles.subtitle}>Trusted protection officers you've worked with</span>
          </div>
          <div className={styles.headerStats}>
            <span className={styles.stat}>
              <span className={styles.statNumber}>{mockFavoriteCPOs.filter(cpo => cpo.availability === 'available').length}</span>
              <span className={styles.statLabel}>Available</span>
            </span>
          </div>
        </div>
      </div>

      {/* CPO Cards Grid */}
      <div className={styles.cpoGrid}>
        {mockFavoriteCPOs.map((cpo) => (
          <div
            key={cpo.id}
            className={`${styles.cpoCard} ${selectedCPO === cpo.id ? styles.selected : ''}`}
            onClick={() => setSelectedCPO(selectedCPO === cpo.id ? null : cpo.id)}
          >
            {/* CPO Photo and Status */}
            <div className={styles.cpoHeader}>
              <div className={styles.cpoPhotoContainer}>
                <img
                  src={cpo.photo}
                  alt={cpo.name}
                  className={styles.cpoPhoto}
                  onError={(e) => {
                    // Fallback to initials if photo fails to load
                    e.currentTarget.style.display = 'none';
                    const initialsEl = e.currentTarget.nextElementSibling as HTMLElement;
                    if (initialsEl) initialsEl.style.display = 'flex';
                  }}
                />
                <div className={styles.cpoInitials} style={{ display: 'none' }}>
                  {cpo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div
                  className={styles.availabilityIndicator}
                  style={{ backgroundColor: getAvailabilityColor(cpo.availability) }}
                  title={`${cpo.availability.charAt(0).toUpperCase() + cpo.availability.slice(1)}`}
                />
              </div>

              {/* Service Tier Badge */}
              <div
                className={styles.tierBadge}
                style={getServiceTierStyle(cpo.tier)}
              >
                {cpo.tier}
              </div>
            </div>

            {/* CPO Information */}
            <div className={styles.cpoInfo}>
              <div className={styles.cpoName}>{cpo.name}</div>
              <div className={styles.cpoCredentials}>SIA: {cpo.siaLicense}</div>

              {/* Rating and Stats */}
              <div className={styles.cpoStats}>
                <div className={styles.rating}>
                  <span className={styles.stars}>{'★'.repeat(Math.floor(cpo.rating))}</span>
                  <span className={styles.ratingNumber}>{cpo.rating}</span>
                </div>
                <div className={styles.completedCount}>
                  {cpo.completedAssignments} assignments
                </div>
              </div>

              {/* Specializations */}
              <div className={styles.specializations}>
                {cpo.specializations.slice(0, 2).map((spec, index) => (
                  <span key={index} className={styles.specializationTag}>
                    {spec}
                  </span>
                ))}
                {cpo.specializations.length > 2 && (
                  <span className={styles.moreSpecs}>
                    +{cpo.specializations.length - 2} more
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className={styles.quickInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>⏱️</span>
                  <span className={styles.infoText}>~{cpo.responseTime}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <span className={styles.infoText}>{cpo.lastAssignment}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.cpoActions}>
              <button
                className={`${styles.actionButton} ${styles.primaryAction}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookWithCPO(cpo.id);
                }}
                disabled={cpo.availability === 'offline'}
              >
                <span className={styles.actionIcon}>🛡️</span>
                <span className={styles.actionText}>
                  {cpo.availability === 'available' ? 'Book Now' :
                   cpo.availability === 'busy' ? 'Request' : 'Unavailable'}
                </span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.secondaryAction}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProfile(cpo.id);
                }}
              >
                <span className={styles.actionIcon}>👤</span>
                <span className={styles.actionText}>Profile</span>
              </button>
            </div>

            {/* Expanded Details */}
            {selectedCPO === cpo.id && (
              <div className={styles.expandedDetails}>
                <div className={styles.detailsSection}>
                  <h4 className={styles.detailsTitle}>Full Specializations</h4>
                  <div className={styles.allSpecializations}>
                    {cpo.specializations.map((spec, index) => (
                      <span key={index} className={styles.specializationTag}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.detailsSection}>
                  <h4 className={styles.detailsTitle}>Approved Vehicles</h4>
                  <div className={styles.vehicleList}>
                    {cpo.vehicleTypes.map((vehicle, index) => (
                      <div key={index} className={styles.vehicleItem}>
                        <span className={styles.vehicleIcon}>🚗</span>
                        <span className={styles.vehicleName}>{vehicle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.detailsSection}>
                  <h4 className={styles.detailsTitle}>Performance Metrics</h4>
                  <div className={styles.metricsGrid}>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>{cpo.rating}/5.0</span>
                      <span className={styles.metricLabel}>Avg Rating</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>{cpo.responseTime}</span>
                      <span className={styles.metricLabel}>Response Time</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>100%</span>
                      <span className={styles.metricLabel}>Safety Record</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className={styles.viewAllSection}>
        <button className={styles.viewAllButton}>
          <span className={styles.viewAllText}>View All Available CPOs</span>
          <span className={styles.viewAllIcon}>→</span>
        </button>
      </div>
    </div>
  );
};