import { memo } from 'react';
import { ProtectionHub } from './types';
import { HubStatusBadge } from './HubStatusBadge';
import styles from './hub-card.module.css';

interface HubCardProps {
  hub: ProtectionHub;
  onSelect: (hub: ProtectionHub) => void;
  onToggleFavorite: (hubId: string) => void;
}

export const HubCard = memo(function HubCard({ hub, onSelect, onToggleFavorite }: HubCardProps) {
  const handleSelect = () => {
    onSelect(hub);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(hub.id);
  };

  const getServiceBadges = () => {
    const badges = [];
    if (hub.services.essential) badges.push('Essential');
    if (hub.services.executive) badges.push('Executive');
    if (hub.services.shadow) badges.push('Shadow');
    return badges;
  };

  const getResponseTimeColor = () => {
    if (hub.response.averageTime <= 10) return '#10B981'; // green
    if (hub.response.averageTime <= 20) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const getLoadIndicator = () => {
    switch (hub.response.currentLoad) {
      case 'low': return { color: '#10B981', text: 'Low demand' };
      case 'medium': return { color: '#F59E0B', text: 'Moderate demand' };
      case 'high': return { color: '#EF4444', text: 'High demand' };
      default: return { color: '#6B7280', text: 'Unknown' };
    }
  };

  return (
    <div
      className={`${styles.hubCard} ${hub.status === 'offline' ? styles.offline : ''}`}
      onClick={hub.status !== 'offline' ? handleSelect : undefined}
      role="button"
      tabIndex={hub.status !== 'offline' ? 0 : -1}
      aria-label={`Select ${hub.name} protection hub`}
    >
      {/* Gradient accent stripe */}
      <div className={styles.accentStripe} />

      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.hubInfo}>
          <h3 className={styles.hubName}>{hub.name}</h3>
          <p className={styles.hubLocation}>{hub.location.address}</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.favoriteButton} ${hub.isFavorite ? styles.favorited : ''}`}
            onClick={handleFavoriteClick}
            aria-label={hub.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {hub.isFavorite ? '❤️' : '🤍'}
          </button>
          <HubStatusBadge status={hub.status} />
        </div>
      </div>

      {/* Service Badges */}
      <div className={styles.serviceBadges}>
        {getServiceBadges().map(service => (
          <span key={service} className={`${styles.serviceBadge} ${styles[service.toLowerCase()]}`}>
            {service}
          </span>
        ))}
      </div>

      {/* Officer Availability */}
      <div className={styles.officerSection}>
        <div className={styles.officerStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{hub.officers.available}</span>
            <span className={styles.statLabel}>CPOs Available</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{hub.officers.active}</span>
            <span className={styles.statLabel}>Currently Active</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{hub.officers.total}</span>
            <span className={styles.statLabel}>Total Officers</span>
          </div>
        </div>
      </div>

      {/* Response Time & Coverage */}
      <div className={styles.performanceSection}>
        <div className={styles.responseTime}>
          <div className={styles.responseValue} style={{ color: getResponseTimeColor() }}>
            {hub.response.averageTime}min
          </div>
          <div className={styles.responseLabel}>Avg Response</div>
        </div>

        <div className={styles.coverage}>
          <div className={styles.coverageValue}>{hub.coverage.radius}mi</div>
          <div className={styles.coverageLabel}>Coverage</div>
        </div>

        <div className={styles.loadIndicator}>
          <div
            className={styles.loadDot}
            style={{ backgroundColor: getLoadIndicator().color }}
          />
          <div className={styles.loadText}>{getLoadIndicator().text}</div>
        </div>
      </div>

      {/* Rating & Distance */}
      <div className={styles.metaSection}>
        <div className={styles.rating}>
          <span className={styles.ratingStars}>
            {'★'.repeat(Math.floor(hub.ratings.overall))}
          </span>
          <span className={styles.ratingValue}>{hub.ratings.overall}</span>
          <span className={styles.ratingCount}>({hub.ratings.totalReviews})</span>
        </div>

        {hub.distance && (
          <div className={styles.distance}>
            <span className={styles.distanceIcon}>📍</span>
            <span className={styles.distanceValue}>{hub.distance}mi away</span>
          </div>
        )}
      </div>

      {/* Operating Hours */}
      <div className={styles.hoursSection}>
        <span className={styles.hoursLabel}>
          {hub.operatingHours.is24h ? '24/7 Operations' :
           `${hub.operatingHours.start} - ${hub.operatingHours.end}`}
        </span>
        {hub.operatingHours.is24h && <span className={styles.hours24Badge}>24H</span>}
      </div>

      {/* Specializations */}
      {hub.specializations.length > 0 && (
        <div className={styles.specializationsSection}>
          <div className={styles.specializationTags}>
            {hub.specializations.slice(0, 2).map(spec => (
              <span key={spec} className={styles.specializationTag}>
                {spec}
              </span>
            ))}
            {hub.specializations.length > 2 && (
              <span className={styles.moreTag}>
                +{hub.specializations.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Select Button */}
      <div className={styles.selectSection}>
        <button
          className={styles.selectButton}
          disabled={hub.status === 'offline'}
          aria-label={`Select ${hub.name} as your protection hub`}
        >
          {hub.status === 'offline' ? 'Currently Offline' : 'Select This Hub'}
        </button>
      </div>
    </div>
  );
});