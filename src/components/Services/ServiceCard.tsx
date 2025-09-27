import { memo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getDynamicCaseStudies } from '../../data/servicesData';
import styles from './ServiceCard.module.css';

export interface Review {
  rating: number;
  text: string;
  author: string;
  role: string;
}

export interface CaseStudy {
  title: string;
  situation: string;
  solution: string;
  result: string;
  userType?: string;
}

export interface OfficerDescription {
  general: string;
  qualifications: string[];
}

export interface ServiceData {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  vehicle: string;
  price: string;
  protectionRate?: string;
  transportRate?: string;
  rating: string;
  totalRides: string;
  collapsedFeatures: string[];
  collapsedReview: {
    snippet: string;
    author: string;
  };
  personalizedMessage: string;
  whatYouGet: string[];
  officerDescription: OfficerDescription;
  reviews: Review[];
  caseStudies: CaseStudy[];
  trustSignals: string[];
  stats: {
    clients?: string;
    rating?: string;
    responseTime?: string;
    special?: string;
  };
}

interface ServiceCardProps {
  service: ServiceData;
  isRecommended?: boolean;
  onExpand?: (serviceId: string) => void;
  onBook: (serviceId: string) => void;
  autoCollapse?: boolean;
  expandedService?: string | null;
}

export const ServiceCard = memo(function ServiceCard({
  service,
  isRecommended = false,
  onExpand,
  onBook,
  autoCollapse = false,
  expandedService
}: ServiceCardProps) {
  const { state } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if this card should be expanded based on the parent state
  const shouldBeExpanded = expandedService === service.id || (!autoCollapse && isExpanded);

  const handleExpandToggle = () => {
    if (autoCollapse) {
      // In mobile mode, let the parent handle the expansion
      if (onExpand) {
        onExpand(service.id);
      }
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleBookNow = () => {
    onBook(service.id);
  };

  const handleCompare = () => {
    // Service comparison implementation placeholder
  };

  // getPersonalizedMessage removed as unused

  // Get dynamic case studies based on user profile
  const getDynamicCaseStudiesForUser = () => {
    const { questionnaireData } = state;
    let userProfile = 'general';

    if (questionnaireData?.profileSelection) {
      userProfile = questionnaireData.profileSelection.toLowerCase();
    } else if (questionnaireData?.step1_transportProfile) {
      userProfile = questionnaireData.step1_transportProfile.toLowerCase();
    }

    return getDynamicCaseStudies(service, userProfile);
  };

  const dynamicCaseStudies = getDynamicCaseStudiesForUser();

  return (
    <div className={`${styles.serviceCard} ${isRecommended ? styles.recommended : ''} ${shouldBeExpanded ? styles.expanded : ''}`}>
      {/* Collapsed State - Always Visible */}
      <div className={styles.collapsedContent}>
        {/* Service Header */}
        <div className={styles.serviceHeader}>
          <div className={styles.serviceIcon}>{service.icon}</div>
          <div className={styles.serviceInfo}>
            <h3 className={styles.serviceName}>{service.name}</h3>
            <p className={styles.serviceTagline}>{service.tagline}</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className={styles.vehicleInfo}>
          <span className={styles.vehicle}>{service.vehicle}</span>
        </div>

        {/* Service Rates Breakdown */}
        <div className={styles.serviceRates}>
          <div className={styles.ratesTitle}>Service Rates:</div>
          <div className={styles.rateItem}>
            <span className={styles.rateLabel}>Protection:</span>
            <span className={styles.rateValue}>{service.protectionRate || '£50'}/hour</span>
          </div>
          <div className={styles.rateItem}>
            <span className={styles.rateLabel}>Transport:</span>
            <span className={styles.rateValue}>
              {service.transportRate === 'No mileage charge' ? 'No mileage charge' : `${service.transportRate || '£2.50'}/mile`}
            </span>
          </div>
          <div className={styles.rateMinimum}>(2-hour minimum)</div>
        </div>

        {/* Rating and Assignments */}
        <div className={styles.ratingSection}>
          <span className={styles.rating}>{service.rating}</span>
          <span className={styles.totalRides}>{service.totalRides}</span>
        </div>

        {/* Collapsed Features (3 checkmarks) */}
        <div className={styles.collapsedFeatures}>
          {service.collapsedFeatures.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Quick Review Snippet */}
        <div className={styles.reviewSnippet}>
          <p className={styles.snippetText}>
            "{service.collapsedReview.snippet}..."
          </p>
          <span className={styles.snippetAuthor}>- {service.collapsedReview.author}</span>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`${styles.expandedContent} ${shouldBeExpanded ? styles.visible : ''}`}>
        {/* What You Get Section */}
        <div className={styles.expandedSection}>
          <h4 className={styles.sectionTitle}>WHAT YOU GET</h4>
          <ul className={styles.bulletList}>
            {service.whatYouGet.map((item, index) => (
              <li key={index} className={styles.bulletItem}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Our Officers Section */}
        <div className={styles.expandedSection}>
          <h4 className={styles.sectionTitle}>OUR OFFICERS</h4>
          <p className={styles.officerDescription}>{service.officerDescription.general}</p>
        </div>

        {/* Client Reviews Section */}
        <div className={styles.expandedSection}>
          <h4 className={styles.sectionTitle}>CLIENT REVIEWS</h4>
          <div className={styles.reviewsList}>
            {service.reviews.map((review, index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewStars}>
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <div className={styles.reviewAuthor}>
                    <span className={styles.authorName}>{review.author}</span>
                    <span className={styles.authorRole}>{review.role}</span>
                  </div>
                </div>
                <p className={styles.reviewText}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real-World Case Studies Section */}
        <div className={styles.expandedSection}>
          <h4 className={styles.sectionTitle}>REAL-WORLD CASE STUDIES</h4>
          <div className={styles.caseStudiesList}>
            {dynamicCaseStudies.map((caseStudy, index) => (
              <div key={index} className={styles.caseStudyCard}>
                <h5 className={styles.caseStudyTitle}>{caseStudy.title}</h5>
                <div className={styles.caseStudyContent}>
                  <div className={styles.caseStudyItem}>
                    <strong>Situation:</strong> {caseStudy.situation}
                  </div>
                  <div className={styles.caseStudyItem}>
                    <strong>Solution:</strong> {caseStudy.solution}
                  </div>
                  <div className={styles.caseStudyItem}>
                    <strong>Result:</strong> "{caseStudy.result}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className={styles.expandedSection}>
          <h4 className={styles.sectionTitle}>STATISTICS</h4>
          <div className={styles.statisticsList}>
            {service.trustSignals.map((stat, index) => (
              <div key={index} className={styles.statisticItem}>
                {stat}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.selectButton} onClick={handleBookNow}>
            SELECT THIS SERVICE
          </button>
          <button className={styles.compareButton} onClick={handleCompare}>
            COMPARE
          </button>
        </div>
      </div>

      {/* Expand/Collapse Toggle */}
      <button
        className={styles.expandToggle}
        onClick={handleExpandToggle}
      >
        {shouldBeExpanded ? 'SHOW LESS ↑' : 'LEARN MORE ↓'}
      </button>
    </div>
  );
});