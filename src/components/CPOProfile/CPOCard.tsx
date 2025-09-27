import { FC } from 'react';
import { CPOProfile, CPOMatch } from '../../types/cpo';
import { BadgeDisplay } from './components/BadgeDisplay';
import { AvailabilityStatus } from './components/AvailabilityStatus';
import { SpecializationTags } from './components/SpecializationTags';
import styles from './styles/cpo-profile.module.css';

interface CPOCardProps {
  cpo: CPOProfile;
  match?: CPOMatch;
  onRequestOfficer: (cpoId: string) => void;
  onViewDetails: (cpoId: string) => void;
  onAddToFavorites: (cpoId: string) => void;
  isFavorite?: boolean;
  showMatchScore?: boolean;
  compact?: boolean;
}

export const CPOCard: FC<CPOCardProps> = ({
  cpo,
  match,
  onRequestOfficer,
  onViewDetails,
  onAddToFavorites,
  isFavorite = false,
  showMatchScore = false,
  compact = false
}) => {
  const formatResponseTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''}`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  const getExperienceBadgeText = (years: number): string => {
    if (years >= 20) return '20+ Years Elite';
    if (years >= 15) return '15+ Years Senior';
    if (years >= 10) return '10+ Years Experienced';
    if (years >= 5) return '5+ Years Professional';
    return `${years} Years`;
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className={styles.starFull}>★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className={styles.starHalf}>☆</span>
        );
      } else {
        stars.push(
          <span key={i} className={styles.starEmpty}>☆</span>
        );
      }
    }
    return stars;
  };

  const primarySpecializations = cpo.specializations
    .sort((a, b) => b.yearsExperience - a.yearsExperience)
    .slice(0, compact ? 2 : 3);

  return (
    <div className={`${styles.cpoCard} ${compact ? styles.compact : ''}`}>
      {/* Match Score Banner */}
      {showMatchScore && match && (
        <div className={styles.matchScoreBanner}>
          <span className={styles.matchScore}>{Math.round(match.matchScore)}% Match</span>
          {match.matchReasons.length > 0 && (
            <span className={styles.matchReason}>
              {match.matchReasons[0]}
            </span>
          )}
        </div>
      )}

      {/* Header Section */}
      <div className={styles.cardHeader}>
        <div className={styles.profileSection}>
          <div className={styles.profilePhoto}>
            {cpo.profilePhoto ? (
              <img
                src={cpo.profilePhoto}
                alt={`${cpo.firstName} ${cpo.lastName}`}
                className={styles.photoImg}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                {cpo.firstName[0]}{cpo.lastName[0]}
              </div>
            )}
          </div>

          <div className={styles.basicInfo}>
            <h3 className={styles.officerName}>
              {cpo.firstName} {cpo.lastName}
              {cpo.callSign && (
                <span className={styles.callSign}>"{cpo.callSign}"</span>
              )}
            </h3>

            <div className={styles.experienceBadge}>
              {getExperienceBadgeText(cpo.yearsOfExperience)}
            </div>
          </div>
        </div>

        <button
          className={styles.favoriteButton}
          onClick={() => onAddToFavorites(cpo.id)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      {/* Badges Section */}
      <div className={styles.badgesSection}>
        <BadgeDisplay
          sia={cpo.sia}
          militaryBackground={cpo.militaryBackground}
          policeBackground={cpo.policeBackground}
          yearsOfExperience={cpo.yearsOfExperience}
          compact={compact}
        />
      </div>

      {/* Availability and Response Time */}
      <div className={styles.availabilitySection}>
        <AvailabilityStatus availability={cpo.availability} />
        <div className={styles.responseTime}>
          <span className={styles.responseLabel}>Response Time:</span>
          <span className={styles.responseValue}>
            {formatResponseTime(match?.estimatedResponseTime || cpo.averageResponseTime)}
          </span>
        </div>
      </div>

      {/* Specializations */}
      {!compact && (
        <div className={styles.specializationsSection}>
          <SpecializationTags
            specializations={primarySpecializations}
            maxDisplay={3}
            clickable={false}
          />
        </div>
      )}

      {/* Rating and Stats */}
      <div className={styles.statsSection}>
        <div className={styles.ratingContainer}>
          <div className={styles.stars}>
            {renderRatingStars(cpo.rating)}
          </div>
          <span className={styles.ratingText}>
            {cpo.rating.toFixed(1)} ({cpo.completedAssignments} assignments)
          </span>
        </div>

        {cpo.vehicle && (
          <div className={styles.vehicleInfo}>
            <span className={styles.vehicleIcon}>🚗</span>
            <span className={styles.vehicleText}>
              {cpo.vehicle.make} {cpo.vehicle.model}
            </span>
          </div>
        )}
      </div>

      {/* Languages */}
      {cpo.languages.length > 1 && (
        <div className={styles.languagesSection}>
          <span className={styles.languagesLabel}>Languages:</span>
          <span className={styles.languagesList}>
            {cpo.languages.slice(0, 3).join(', ')}
            {cpo.languages.length > 3 && ` +${cpo.languages.length - 3} more`}
          </span>
        </div>
      )}

      {/* Proximity Info (if match data available) */}
      {match && (
        <div className={styles.proximityInfo}>
          <span className={styles.distanceText}>
            📍 {match.proximityKm.toFixed(1)}km away
          </span>
          {match.priceEstimate && (
            <span className={styles.priceEstimate}>
              Est. £{match.priceEstimate}/hr
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button
          className={styles.detailsButton}
          onClick={() => onViewDetails(cpo.id)}
        >
          View Details
        </button>

        <button
          className={styles.requestButton}
          onClick={() => onRequestOfficer(cpo.id)}
          disabled={cpo.availability.status === 'On_Assignment'}
        >
          {cpo.availability.status === 'Available_Now' ?
            'Request This Officer' :
            cpo.availability.status === 'Available_Soon' ?
            'Request for Later' :
            'Currently Unavailable'
          }
        </button>
      </div>

      {/* Verification Badge */}
      {cpo.isVerified && (
        <div className={styles.verifiedBadge}>
          <span className={styles.verifiedIcon}>✓</span>
          <span className={styles.verifiedText}>Armora Verified</span>
        </div>
      )}
    </div>
  );
};