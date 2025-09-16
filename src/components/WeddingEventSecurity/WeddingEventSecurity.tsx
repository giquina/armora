import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './WeddingEventSecurity.module.css';

interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
}

interface WeddingPackage {
  name: string;
  price: string;
  duration: string;
  officers: number;
  popular?: boolean;
  features: string[];
}

interface Testimonial {
  rating: number;
  quote: string;
  name: string;
  eventType: string;
  date: string;
}

interface TimelineEvent {
  time: string;
  activity: string;
  description: string;
}

interface Certification {
  icon: string;
  text: string;
}

const weddingSecurityFeatures: SecurityFeature[] = [
  {
    icon: '👰',
    title: 'Bridal Party Protection',
    description: 'Discrete protection for wedding party throughout ceremony and reception'
  },
  {
    icon: '🎁',
    title: 'Gift & Asset Security',
    description: 'Secure gift table monitoring and valuable item protection'
  },
  {
    icon: '🚗',
    title: 'Guest Parking Management',
    description: 'Valet coordination and vehicle security in parking areas'
  },
  {
    icon: '🚪',
    title: 'Venue Access Control',
    description: 'Guest list verification and unauthorized access prevention'
  },
  {
    icon: '👥',
    title: 'Crowd Management',
    description: 'Flow control for ceremonies, photos, and reception activities'
  },
  {
    icon: '🚨',
    title: 'Medical Support',
    description: '24/7 medical and security support protocols'
  }
];

const weddingPackages: WeddingPackage[] = [
  {
    name: 'Essential',
    price: '£500',
    duration: '8 hours',
    officers: 2,
    features: [
      'Venue security assessment',
      'Gift table monitoring',
      'Medical response protocols',
      'Guest list verification',
      'Basic crowd management'
    ]
  },
  {
    name: 'Premium',
    price: '£850',
    duration: '12 hours',
    officers: 3,
    popular: true,
    features: [
      'Bridal party protection',
      'Advanced crowd management',
      'Parking area security',
      'Photo session coordination',
      'Reception flow management',
      'VIP guest escort services'
    ]
  },
  {
    name: 'Premium',
    price: '£1,500',
    duration: 'Full day',
    officers: 5,
    features: [
      'Full venue security sweep',
      'Dedicated bridal security',
      'Asset protection specialists',
      'Guest arrival coordination',
      'Multi-location coverage',
      'Premium vehicle escort',
      '24/7 security coordination'
    ]
  }
];

const testimonial: Testimonial = {
  rating: 5,
  quote: "ARMORA's team made our wedding day absolutely perfect. We didn't even notice they were there, but we felt completely safe and secure. Professional and discrete - exactly what we needed.",
  name: "Sarah & James Mitchell",
  eventType: "Countryside Wedding",
  date: "September 2024"
};

const weddingTimeline: TimelineEvent[] = [
  {
    time: '2 hours before',
    activity: 'Venue Sweep',
    description: 'Complete security assessment and perimeter check'
  },
  {
    time: '1 hour before',
    activity: 'Guest Arrival',
    description: 'Guest list verification and parking coordination'
  },
  {
    time: 'During Ceremony',
    activity: 'Perimeter Security',
    description: 'Discrete ceremony protection and crowd management'
  },
  {
    time: 'Reception',
    activity: 'Gift Security',
    description: 'Gift table monitoring and asset protection'
  },
  {
    time: 'Evening',
    activity: 'Party Security',
    description: 'Reception flow management and guest safety'
  },
  {
    time: 'End',
    activity: 'Departure',
    description: 'Safe departure coordination and final sweep'
  }
];

const certifications: Certification[] = [
  { icon: '✅', text: 'SIA Licensed' },
  { icon: '🏥', text: 'First Aid Certified' },
  { icon: '🔒', text: 'DBS Checked' },
  { icon: '🛡️', text: 'Fully Insured' },
  { icon: '🎖️', text: 'Military Trained' }
];

export function WeddingEventSecurity() {
  const { navigateToView } = useApp();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(150);
  const [venueType, setVenueType] = useState('mixed');
  const [duration, setDuration] = useState(12);
  const [highProfileGuests, setHighProfileGuests] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Premium');

  const handleBookingClick = () => {
    navigateToView('venue-protection-welcome');
  };

  const calculateRecommendation = () => {
    let officers = 2;
    let cost = 500;
    let recommendedPackage = 'Essential';

    if (guestCount > 100) officers += 1;
    if (guestCount > 200) officers += 1;
    if (guestCount > 300) officers += 1;

    if (venueType === 'outdoor' || venueType === 'mixed') officers += 1;
    if (highProfileGuests) officers += 2;

    cost = officers * (duration * 25) + 200;

    if (officers >= 5 || cost >= 1200) {
      recommendedPackage = 'Premium';
    } else if (officers >= 3 || cost >= 700) {
      recommendedPackage = 'Premium';
    }

    return { officers, cost, recommendedPackage };
  };

  const recommendation = calculateRecommendation();

  return (
    <div className={styles.weddingSecurityContainer}>
      {/* NEW Badge */}
      <div className={styles.newBadge}>NEW</div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroHeader}>
          <div className={styles.heroIcon}>💍🛡️</div>
          <div className={styles.heroContent}>
            <h3 className={styles.heroTitle}>Wedding & Event Security</h3>
            <p className={styles.heroSubtitle}>SIA licensed Close Protection Officers for your special day</p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>✅</span>
          <span className={styles.trustText}>200+ Weddings Secured</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span className={styles.trustText}>4.9/5 Average Rating</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏆</span>
          <span className={styles.trustText}>Award Winning Team</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📞</span>
          <span className={styles.trustText}>24/7 Support</span>
        </div>
      </div>

      {/* Service Features Grid */}
      <div className={styles.featuresSection}>
        <h4 className={styles.sectionTitle}>Complete Wedding Security Coverage</h4>
        <div className={styles.featuresGrid}>
          {weddingSecurityFeatures.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <div className={styles.featureContent}>
                <h5 className={styles.featureTitle}>{feature.title}</h5>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Packages */}
      <div className={styles.pricingSection}>
        <h4 className={styles.sectionTitle}>Choose Your Protection Level</h4>
        <div className={styles.packagesGrid}>
          {weddingPackages.map((pkg, index) => (
            <div
              key={index}
              className={`${styles.packageCard} ${pkg.popular ? styles.popularPackage : ''} ${selectedPackage === pkg.name ? styles.selectedPackage : ''}`}
              onClick={() => setSelectedPackage(pkg.name)}
            >
              {pkg.popular && <div className={styles.popularBadge}>Most Popular</div>}
              <div className={styles.packageHeader}>
                <h5 className={styles.packageName}>{pkg.name}</h5>
                <div className={styles.packagePrice}>{pkg.price}</div>
                <div className={styles.packageDuration}>{pkg.duration} • {pkg.officers} officers</div>
              </div>
              <div className={styles.packageFeatures}>
                {pkg.features.map((feature, i) => (
                  <div key={i} className={styles.packageFeature}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Calculator */}
      <div className={styles.calculatorSection}>
        <div
          className={styles.calculatorHeader}
          onClick={() => setCalculatorOpen(!calculatorOpen)}
        >
          <h4 className={styles.calculatorTitle}>
            🧮 Security Calculator
            <span className={styles.calculatorToggle}>{calculatorOpen ? '−' : '+'}</span>
          </h4>
          <p className={styles.calculatorSubtitle}>Get personalized recommendations for your event</p>
        </div>

        {calculatorOpen && (
          <div className={styles.calculatorContent}>
            <div className={styles.calculatorInputs}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Guest Count: {guestCount}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Venue Type</label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className={styles.select}
                >
                  <option value="indoor">Indoor Only</option>
                  <option value="outdoor">Outdoor Only</option>
                  <option value="mixed">Indoor & Outdoor</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Duration: {duration} hours</label>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={highProfileGuests}
                    onChange={(e) => setHighProfileGuests(e.target.checked)}
                    className={styles.checkbox}
                  />
                  High-profile guests attending
                </label>
              </div>
            </div>

            <div className={styles.calculatorResults}>
              <h5 className={styles.resultsTitle}>Recommended for your event:</h5>
              <div className={styles.resultItem}>
                <strong>{recommendation.officers} Security Officers</strong>
              </div>
              <div className={styles.resultItem}>
                <strong>Estimated Cost: £{recommendation.cost}</strong>
              </div>
              <div className={styles.resultItem}>
                <strong>Suggested Package: {recommendation.recommendedPackage}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Testimonial */}
      <div className={styles.testimonialSection}>
        <div className={styles.testimonialCard}>
          <div className={styles.testimonialRating}>
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className={styles.star}>⭐</span>
            ))}
          </div>
          <blockquote className={styles.testimonialQuote}>
            "{testimonial.quote}"
          </blockquote>
          <div className={styles.testimonialAuthor}>
            <strong>{testimonial.name}</strong>
            <span className={styles.testimonialEvent}>{testimonial.eventType} • {testimonial.date}</span>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className={styles.timelineSection}>
        <h4 className={styles.sectionTitle}>Your Security Timeline</h4>
        <div className={styles.timeline}>
          {weddingTimeline.map((event, index) => (
            <div key={index} className={styles.timelineEvent}>
              <div className={styles.timelineTime}>{event.time}</div>
              <div className={styles.timelineContent}>
                <h6 className={styles.timelineActivity}>{event.activity}</h6>
                <p className={styles.timelineDescription}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <button className={styles.primaryCta} onClick={handleBookingClick}>
          📞 Book Free Consultation
        </button>
        <button className={styles.secondaryCta}>
          📄 Download Security Guide
        </button>
        <button className={styles.tertiaryCta}>
          💬 Chat with Expert
        </button>
      </div>

      {/* Certification Badges */}
      <div className={styles.certificationsSection}>
        <div className={styles.certificationsBadges}>
          {certifications.map((cert, index) => (
            <div key={index} className={styles.certificationBadge}>
              <span className={styles.certIcon}>{cert.icon}</span>
              <span className={styles.certText}>{cert.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}