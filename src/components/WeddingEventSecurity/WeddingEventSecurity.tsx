import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './WeddingEventSecurity.module.css';

interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
  storytelling?: string;
}

interface WeddingPackage {
  name: string;
  brandName: string;
  icon: string;
  price: string;
  pricePerGuest?: string;
  duration: string;
  officers: number;
  popular?: boolean;
  features: SecurityFeature[];
  coverageLevel: number; // 1-5 scale
  guestRatio: string;
  confidenceStats: string[];
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
    brandName: 'Guardian Shield',
    icon: '🛡️',
    price: '£500',
    pricePerGuest: '£2.08 per guest',
    duration: '8 hours',
    officers: 2,
    coverageLevel: 2,
    guestRatio: '1:120',
    confidenceStats: ['Zero incidents in 50+ events', 'Average response: 15 seconds'],
    features: [
      {
        icon: '🔍',
        title: 'Venue security assessment',
        description: 'Complete security evaluation',
        storytelling: 'Your venue, expertly evaluated'
      },
      {
        icon: '💝',
        title: 'Gift table monitoring',
        description: 'Continuous gift protection',
        storytelling: 'Your treasures stay treasured'
      },
      {
        icon: '🚨',
        title: 'Medical response protocols',
        description: 'Emergency medical support',
        storytelling: 'Help arrives in seconds'
      },
      {
        icon: '✋',
        title: 'Guest list verification',
        description: 'Access control management',
        storytelling: 'Only invited guests enter'
      },
      {
        icon: '👥',
        title: 'Basic crowd management',
        description: 'Flow control for ceremonies',
        storytelling: 'Smooth sailing ceremonies'
      }
    ]
  },
  {
    name: 'Premium',
    brandName: 'Royal Guard',
    icon: '👑',
    price: '£850',
    pricePerGuest: '£3.54 per guest',
    duration: '12 hours',
    officers: 3,
    popular: true,
    coverageLevel: 4,
    guestRatio: '1:80',
    confidenceStats: ['Zero incidents in 150+ events', 'Average response: 10 seconds', 'Chosen by 67% of couples'],
    features: [
      {
        icon: '👰',
        title: 'Bridal party protection',
        description: 'Dedicated VIP security',
        storytelling: 'Your special people, specially protected'
      },
      {
        icon: '🎯',
        title: 'Advanced crowd management',
        description: 'Expert flow coordination',
        storytelling: 'Every moment flows perfectly'
      },
      {
        icon: '🚗',
        title: 'Parking area security',
        description: 'Vehicle protection services',
        storytelling: 'Your guests arrive and leave safely'
      },
      {
        icon: '📸',
        title: 'Photo session coordination',
        description: 'Photography security support',
        storytelling: 'Picture-perfect moments, protected'
      },
      {
        icon: '🥂',
        title: 'Reception flow management',
        description: 'Event coordination support',
        storytelling: 'Celebration flows like clockwork'
      },
      {
        icon: '⭐',
        title: 'VIP guest escort services',
        description: 'Personal protection for VIPs',
        storytelling: 'Your VIPs receive VIP treatment'
      }
    ]
  },
  {
    name: 'Fortress',
    brandName: 'Fortress Protocol',
    icon: '🏰',
    price: '£1,500',
    pricePerGuest: '£5 per guest',
    duration: 'Full day',
    officers: 5,
    coverageLevel: 5,
    guestRatio: '1:60',
    confidenceStats: ['Zero incidents in 25+ luxury events', 'Average response: 8 seconds', 'Celebrity-grade protection'],
    features: [
      {
        icon: '🔒',
        title: 'Full venue security sweep',
        description: 'Complete perimeter security',
        storytelling: 'Fortress-level protection established'
      },
      {
        icon: '💎',
        title: 'Dedicated bridal security',
        description: 'Personal Close Protection Officer',
        storytelling: 'Your own personal guardian angel'
      },
      {
        icon: '🛡️',
        title: 'Asset protection specialists',
        description: 'Valuables security experts',
        storytelling: 'Every precious item safeguarded'
      },
      {
        icon: '🚪',
        title: 'Guest arrival coordination',
        description: 'VIP arrival management',
        storytelling: 'Red carpet treatment for everyone'
      },
      {
        icon: '🗺️',
        title: 'Multi-location coverage',
        description: 'Multiple venue protection',
        storytelling: 'Every location under our watch'
      },
      {
        icon: '🚙',
        title: 'Premium vehicle escort',
        description: 'Secure transportation',
        storytelling: 'Presidential-style convoy protection'
      },
      {
        icon: '⏰',
        title: '24/7 security coordination',
        description: 'Round-the-clock command center',
        storytelling: 'Never alone, always protected'
      }
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

  const handleProtectionRequest = () => {
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
                <div className={styles.packageBrand}>
                  <span className={styles.packageIcon}>{pkg.icon}</span>
                  <h5 className={styles.packageName}>{pkg.brandName}</h5>
                </div>
                <div className={styles.packagePrice}>{pkg.price}</div>
                <div className={styles.packagePricing}>{pkg.pricePerGuest} (240 guests)</div>
                <div className={styles.packageDuration}>{pkg.duration} • {pkg.officers} officers</div>
                <div className={styles.protectionMeter}>
                  <div className={styles.meterLabel}>Protection Intensity</div>
                  <div className={styles.meterBar}>
                    <div
                      className={styles.meterFill}
                      style={{ width: `${(pkg.coverageLevel / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className={styles.meterRatio}>Officer ratio: {pkg.guestRatio}</div>
                </div>
              </div>
              <div className={styles.packageFeatures}>
                {pkg.features.map((feature, i) => (
                  <div key={i} className={styles.packageFeature}>
                    <span className={styles.featureEmoji}>{feature.icon}</span>
                    <div className={styles.featureText}>
                      <div className={styles.featureTitle}>{feature.title}</div>
                      <div className={styles.featureStory}>{feature.storytelling}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confidence Stats */}
              <div className={styles.confidenceStats}>
                {pkg.confidenceStats.map((stat, i) => (
                  <div key={i} className={styles.confidenceStat}>
                    <span className={styles.statIcon}>✅</span>
                    <span className={styles.statText}>{stat}</span>
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
        <button className={styles.primaryCta} onClick={handleProtectionRequest}>
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