import React, { useState } from 'react';
import { CPOProfile, CPOMatch } from '../../types/cpo';
import { BadgeDisplay } from './components/BadgeDisplay';
import { AvailabilityStatus } from './components/AvailabilityStatus';
import { SpecializationTags } from './components/SpecializationTags';
import styles from './styles/cpo-profile.module.css';

interface CPODetailModalProps {
  cpo: CPOProfile;
  match?: CPOMatch;
  isOpen: boolean;
  onClose: () => void;
  onRequestOfficer: (cpoId: string) => void;
  onAddToFavorites: (cpoId: string) => void;
  isFavorite?: boolean;
}

export const CPODetailModal: React.FC<CPODetailModalProps> = ({
  cpo,
  match,
  isOpen,
  onClose,
  onRequestOfficer,
  onAddToFavorites,
  isFavorite = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'certifications' | 'testimonials'>('overview');

  if (!isOpen) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.starFull}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={styles.starHalf}>☆</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
      }
    }
    return stars;
  };

  const getServiceRateForBudget = (budget: string): number => {
    switch (budget) {
      case 'essential': return cpo.hourlyRates.essential;
      case 'executive': return cpo.hourlyRates.executive;
      case 'shadow': return cpo.hourlyRates.shadow;
      default: return cpo.hourlyRates.essential;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>

          {match && (
            <div className={styles.matchBadge}>
              {Math.round(match.matchScore)}% Match
            </div>
          )}

          <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
            onClick={() => onAddToFavorites(cpo.id)}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        {/* Officer Profile Section */}
        <div className={styles.profileHeader}>
          <div className={styles.profilePhotoLarge}>
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

          <div className={styles.profileInfo}>
            <h2 className={styles.officerName}>
              {cpo.firstName} {cpo.lastName}
              {cpo.callSign && (
                <span className={styles.callSign}>"{cpo.callSign}"</span>
              )}
            </h2>

            <div className={styles.experienceTag}>
              {cpo.yearsOfExperience} Years Experience
            </div>

            <div className={styles.ratingSection}>
              <div className={styles.stars}>
                {renderRatingStars(cpo.rating)}
              </div>
              <span className={styles.ratingText}>
                {cpo.rating.toFixed(1)} ({cpo.completedAssignments} completed assignments)
              </span>
            </div>

            <AvailabilityStatus availability={cpo.availability} showDetails={true} />
          </div>
        </div>

        {/* Badges and Certifications */}
        <div className={styles.badgesSection}>
          <BadgeDisplay
            sia={cpo.sia}
            militaryBackground={cpo.militaryBackground}
            policeBackground={cpo.policeBackground}
            yearsOfExperience={cpo.yearsOfExperience}
          />

          {cpo.isVerified && (
            <div className={styles.verificationBadge}>
              <span className={styles.verifiedIcon}>✓</span>
              <span>Armora Verified</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'experience' ? styles.active : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'certifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            Certifications
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'testimonials' ? styles.active : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Testimonials
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              {/* Specializations */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Specializations</h3>
                <SpecializationTags
                  specializations={cpo.specializations}
                  showExperience={true}
                  maxDisplay={10}
                />
              </div>

              {/* Personal Information */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Nationality:</span>
                    <span className={styles.value}>{cpo.nationality}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Languages:</span>
                    <span className={styles.value}>{cpo.languages.join(', ')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Coverage Areas:</span>
                    <span className={styles.value}>{cpo.coverageAreas.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              {cpo.vehicle && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Vehicle</h3>
                  <div className={styles.vehicleCard}>
                    <div className={styles.vehicleInfo}>
                      <h4>{cpo.vehicle.make} {cpo.vehicle.model} ({cpo.vehicle.year})</h4>
                      <p>Type: {cpo.vehicle.type.replace('_', ' ')}</p>
                      <p>Capacity: {cpo.vehicle.capacity} principals</p>
                      <p>Color: {cpo.vehicle.color}</p>
                    </div>
                    {cpo.vehicle.features.length > 0 && (
                      <div className={styles.vehicleFeatures}>
                        <h5>Features:</h5>
                        <ul>
                          {cpo.vehicle.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Rates */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Service Rates</h3>
                <div className={styles.ratesGrid}>
                  <div className={styles.rateCard}>
                    <h4>Essential Protection</h4>
                    <div className={styles.ratePrice}>£{cpo.hourlyRates.essential}/hour</div>
                    <p>Standard close protection services</p>
                  </div>
                  <div className={styles.rateCard}>
                    <h4>Executive Shield</h4>
                    <div className={styles.ratePrice}>£{cpo.hourlyRates.executive}/hour</div>
                    <p>Enhanced protection for corporate clients</p>
                  </div>
                  <div className={styles.rateCard}>
                    <h4>Shadow Protocol</h4>
                    <div className={styles.ratePrice}>£{cpo.hourlyRates.shadow}/hour</div>
                    <p>Discrete high-level protection</p>
                  </div>
                </div>
                <div className={styles.rateNotes}>
                  <p>Minimum engagement: {cpo.minimumEngagement} hours</p>
                  {cpo.travelAllowance > 0 && (
                    <p>Travel allowance: £{cpo.travelAllowance} for distances over 50km</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className={styles.experienceContent}>
              {/* Military Background */}
              {cpo.militaryBackground.hasMilitaryService && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Military Service</h3>
                  <div className={styles.experienceCard}>
                    <div className={styles.experienceHeader}>
                      <h4>{cpo.militaryBackground.branch?.replace('_', ' ')}</h4>
                      <span className={styles.duration}>
                        {cpo.militaryBackground.yearsOfService} years
                      </span>
                    </div>
                    {cpo.militaryBackground.rank && (
                      <p><strong>Rank:</strong> {cpo.militaryBackground.rank}</p>
                    )}
                    {cpo.militaryBackground.securityClearance && (
                      <p><strong>Security Clearance:</strong> {cpo.militaryBackground.securityClearance.replace('_', ' ')}</p>
                    )}
                    {cpo.militaryBackground.specializations && cpo.militaryBackground.specializations.length > 0 && (
                      <div>
                        <strong>Specializations:</strong>
                        <ul>
                          {cpo.militaryBackground.specializations.map((spec, index) => (
                            <li key={index}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Police Background */}
              {cpo.policeBackground.hasPoliceService && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Police Service</h3>
                  <div className={styles.experienceCard}>
                    <div className={styles.experienceHeader}>
                      <h4>{cpo.policeBackground.force}</h4>
                      <span className={styles.duration}>
                        {cpo.policeBackground.yearsOfService} years
                      </span>
                    </div>
                    {cpo.policeBackground.rank && (
                      <p><strong>Rank:</strong> {cpo.policeBackground.rank}</p>
                    )}
                    {cpo.policeBackground.specializations && cpo.policeBackground.specializations.length > 0 && (
                      <div>
                        <strong>Specializations:</strong>
                        <ul>
                          {cpo.policeBackground.specializations.map((spec, index) => (
                            <li key={index}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Assignments */}
              {cpo.recentAssignments.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Recent Assignments</h3>
                  <div className={styles.assignmentsList}>
                    {cpo.recentAssignments.slice(0, 5).map((assignment, index) => (
                      <div key={index} className={styles.assignmentCard}>
                        <div className={styles.assignmentHeader}>
                          <span className={styles.assignmentType}>{assignment.type}</span>
                          <span className={styles.assignmentDate}>
                            {formatDate(assignment.startDate)}
                          </span>
                        </div>
                        <div className={styles.assignmentDetails}>
                          <p>Duration: {assignment.duration} hours</p>
                          <p>Location: {assignment.location}</p>
                          {assignment.rating && (
                            <div className={styles.assignmentRating}>
                              Rating: {assignment.rating}/5
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className={styles.certificationsContent}>
              {/* SIA License Details */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>SIA License</h3>
                <div className={styles.certificationCard}>
                  <h4>SIA {cpo.sia.level.replace('_', ' ')}</h4>
                  <p><strong>License Number:</strong> {cpo.sia.licenseNumber}</p>
                  <p><strong>Expires:</strong> {formatDate(cpo.sia.expiryDate)}</p>
                  <p><strong>Status:</strong> {cpo.sia.verified ? 'Verified ✓' : 'Pending Verification'}</p>
                  {cpo.sia.specialistSectors.length > 0 && (
                    <div>
                      <strong>Specialist Sectors:</strong>
                      <ul>
                        {cpo.sia.specialistSectors.map((sector, index) => (
                          <li key={index}>{sector}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Certifications */}
              {cpo.certifications.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Additional Certifications</h3>
                  <div className={styles.certificationsList}>
                    {cpo.certifications.map((cert, index) => (
                      <div key={index} className={styles.certificationCard}>
                        <h4>{cert.name}</h4>
                        <p><strong>Issuing Body:</strong> {cert.issuingBody}</p>
                        <p><strong>Issue Date:</strong> {formatDate(cert.issueDate)}</p>
                        {cert.expiryDate && (
                          <p><strong>Expires:</strong> {formatDate(cert.expiryDate)}</p>
                        )}
                        <p><strong>Certificate Number:</strong> {cert.certificateNumber}</p>
                        {cert.level && <p><strong>Level:</strong> {cert.level}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {cpo.equipment.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Equipment & Capabilities</h3>
                  <div className={styles.equipmentGrid}>
                    {cpo.equipment.map((item, index) => (
                      <div key={index} className={styles.equipmentItem}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className={styles.testimonialsContent}>
              {cpo.testimonials.length > 0 ? (
                <div className={styles.testimonialsList}>
                  {cpo.testimonials.map((testimonial, index) => (
                    <div key={index} className={styles.testimonialCard}>
                      <div className={styles.testimonialHeader}>
                        <div className={styles.testimonialRating}>
                          {renderRatingStars(testimonial.rating)}
                        </div>
                        <div className={styles.testimonialMeta}>
                          <span className={styles.principalName}>
                            {testimonial.principalName}
                          </span>
                          <span className={styles.testimonialDate}>
                            {formatDate(testimonial.date)}
                          </span>
                          {testimonial.verified && (
                            <span className={styles.verifiedTestimonial}>Verified ✓</span>
                          )}
                        </div>
                      </div>
                      <blockquote className={styles.testimonialComment}>
                        "{testimonial.comment}"
                      </blockquote>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noTestimonials}>
                  <p>No testimonials available yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
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

          {match && (
            <div className={styles.priceEstimate}>
              Estimated cost: £{match.priceEstimate}
              {match.estimatedResponseTime && (
                <span className={styles.responseTime}>
                  • Response time: {match.estimatedResponseTime} mins
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};