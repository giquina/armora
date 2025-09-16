import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { WeddingEventSecurity } from '../WeddingEventSecurity';
import styles from './ServicesPage.module.css';

interface ServiceData {
  id: string;
  name: string;
  category: 'transport' | 'event' | 'corporate' | 'personal';
  badge: string;
  isLive: boolean;
  availability: 'now' | '15min' | 'today' | 'advance';
  briefDescription: string;
  features: Array<{ icon: string; text: string; detail: string }>;
  pricing: {
    from: number;
    unit: string;
    currency: string;
    discount?: { type: string; value: number; condition: string };
  };
  stats: {
    rating: number;
    totalRatings: number;
    bookingsThisMonth: number;
    responseTime: string;
  };
  testimonial: {
    text: string;
    author: string;
    role: string;
  };
}

const ENHANCED_SERVICES: ServiceData[] = [
  {
    id: 'standard',
    name: 'Standard Protection',
    category: 'transport',
    badge: 'Most Popular',
    isLive: true,
    availability: 'now',
    briefDescription: 'SIA Level 2 certified drivers in premium vehicles with GPS tracking and security protocols.',
    features: [
      { icon: '✓', text: 'SIA Level 2 Certified', detail: 'Fully licensed security professionals' },
      { icon: '✓', text: 'Premium BMW 5 Series', detail: 'Luxury vehicles with safety features' },
      { icon: '✓', text: 'Real-time GPS Tracking', detail: 'Live location monitoring 24/7' },
      { icon: '✓', text: 'Security Protocols', detail: 'Instant response to threats' }
    ],
    pricing: { from: 45, unit: 'hour', currency: 'GBP', discount: { type: 'percentage', value: 10, condition: 'monthly' } },
    stats: { rating: 4.8, totalRatings: 2847, bookingsThisMonth: 341, responseTime: '2 min' },
    testimonial: { text: 'Professional service that made me feel completely secure.', author: 'Sarah M.', role: 'Regular Client' }
  },
  {
    id: 'executive',
    name: 'Executive Security',
    category: 'transport',
    badge: 'Premium',
    isLive: true,
    availability: '15min',
    briefDescription: 'SIA Level 3 Close Protection Officers with special forces training in luxury armored vehicles.',
    features: [
      { icon: '✓', text: 'SIA Level 3 Officers', detail: 'Elite close protection specialists' },
      { icon: '✓', text: 'Armored Luxury Vehicle', detail: 'Bulletproof BMW X5 with advanced security' },
      { icon: '✓', text: 'Route Assessment', detail: 'Pre-journey security evaluation' },
      { icon: '✓', text: 'Counter-surveillance', detail: 'Advanced threat detection protocols' }
    ],
    pricing: { from: 75, unit: 'hour', currency: 'GBP' },
    stats: { rating: 4.9, totalRatings: 1923, bookingsThisMonth: 287, responseTime: '1.5 min' },
    testimonial: { text: 'Exceptional protection for high-stakes business meetings.', author: 'David L.', role: 'Executive' }
  },
  {
    id: 'shadow',
    name: 'Shadow Protection',
    category: 'transport',
    badge: 'Discrete',
    isLive: true,
    availability: 'now',
    briefDescription: 'Covert protection specialists in unmarked vehicles providing discrete security.',
    features: [
      { icon: '✓', text: 'Covert Specialists', detail: 'Invisible protection professionals' },
      { icon: '✓', text: 'Unmarked Vehicles', detail: 'Blend seamlessly into traffic' },
      { icon: '✓', text: 'Discrete Following', detail: 'Undetectable security coverage' },
      { icon: '✓', text: 'Silent Response', detail: 'Discrete action without exposure' }
    ],
    pricing: { from: 65, unit: 'hour', currency: 'GBP' },
    stats: { rating: 4.7, totalRatings: 1456, bookingsThisMonth: 198, responseTime: '3 min' },
    testimonial: { text: 'Perfect for maintaining privacy while staying protected.', author: 'Emma R.', role: 'Public Figure' }
  },
  {
    id: 'wedding',
    name: 'Wedding Security',
    category: 'event',
    badge: 'New',
    isLive: true,
    availability: 'advance',
    briefDescription: 'SIA licensed Close Protection Officers providing discrete security for weddings and celebrations.',
    features: [
      { icon: '✓', text: 'Plainclothes Officers', detail: 'Invisible security at your event' },
      { icon: '✓', text: 'Venue Assessment', detail: 'Complete security evaluation' },
      { icon: '✓', text: 'Guest Coordination', detail: 'Seamless crowd management' },
      { icon: '✓', text: 'Security Planning', detail: 'Comprehensive response protocols' }
    ],
    pricing: { from: 500, unit: 'day', currency: 'GBP' },
    stats: { rating: 4.9, totalRatings: 234, bookingsThisMonth: 45, responseTime: 'Same day' },
    testimonial: { text: 'Made our special day worry-free and perfectly secure.', author: 'James & Lisa', role: 'Newlyweds' }
  },
  {
    id: 'corporate',
    name: 'Corporate Protection',
    category: 'corporate',
    badge: 'Business',
    isLive: true,
    availability: 'today',
    briefDescription: 'Executive protection for corporate events, conferences, and high-profile business meetings.',
    features: [
      { icon: '✓', text: 'Executive Specialists', detail: 'Corporate security experts' },
      { icon: '✓', text: 'Threat Assessment', detail: 'Business risk evaluation' },
      { icon: '✓', text: 'VIP Escort Services', detail: 'High-profile client protection' },
      { icon: '✓', text: 'Conference Security', detail: 'Event-wide coordination' }
    ],
    pricing: { from: 750, unit: 'day', currency: 'GBP' },
    stats: { rating: 4.8, totalRatings: 567, bookingsThisMonth: 89, responseTime: '1 hour' },
    testimonial: { text: 'Professional service that impressed our international clients.', author: 'Michael T.', role: 'CEO' }
  },
  {
    id: 'personal',
    name: 'Personal Protection',
    category: 'personal',
    badge: 'Q2 2025',
    isLive: false,
    availability: 'advance',
    briefDescription: '24/7 personal bodyguard services, residential security, and international travel protection.',
    features: [
      { icon: '⏳', text: 'Personal Bodyguards', detail: '24/7 dedicated protection' },
      { icon: '⏳', text: 'Residential Teams', detail: 'Home security specialists' },
      { icon: '⏳', text: 'Travel Protection', detail: 'International security coverage' },
      { icon: '⏳', text: '24/7 Coordination', detail: 'Round-the-clock monitoring' }
    ],
    pricing: { from: 1200, unit: 'day', currency: 'GBP' },
    stats: { rating: 0, totalRatings: 0, bookingsThisMonth: 0, responseTime: 'Coming Q2' },
    testimonial: { text: 'Early access available for select clients.', author: 'Armora Team', role: 'Security Specialists' }
  }
];

const DYNAMIC_TAGLINES = [
  'Your Safety, Our Mission',
  'Protection Redefined',
  'Security Without Compromise'
];

const HERO_CAROUSEL_SLIDES = [
  {
    id: 'executive-protection',
    title: 'Executive Protection',
    subtitle: 'Elite security for high-profile individuals',
    description: 'SIA Level 3 certified close protection officers with special forces training in luxury armored vehicles.',
    features: ['Special Forces Trained', 'Armored Vehicles', 'Counter-surveillance'],
    ctaText: 'Book Executive Security',
    serviceId: 'executive',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(26, 26, 46, 0.8))',
    accent: '#FFD700'
  },
  {
    id: 'wedding-security',
    title: 'Wedding Security',
    subtitle: 'Your special day, perfectly secured',
    description: 'Discrete plainclothes officers providing invisible protection for your most important celebration.',
    features: ['Plainclothes Officers', 'Venue Assessment', 'Guest Coordination'],
    ctaText: 'Secure Your Wedding',
    serviceId: 'wedding',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1), rgba(26, 26, 46, 0.8))',
    accent: '#FFB6C1'
  },
  {
    id: 'shadow-services',
    title: 'Shadow Protection',
    subtitle: 'Discrete, invisible security',
    description: 'Covert protection specialists in unmarked vehicles providing undetectable security coverage.',
    features: ['Covert Specialists', 'Unmarked Vehicles', 'Silent Response'],
    ctaText: 'Book Shadow Services',
    serviceId: 'shadow',
    backgroundImage: 'linear-gradient(135deg, rgba(128, 128, 128, 0.1), rgba(26, 26, 46, 0.8))',
    accent: '#808080'
  },
  {
    id: 'corporate-events',
    title: 'Corporate Protection',
    subtitle: 'Professional venue protection',
    description: 'Executive protection for corporate events, conferences, and high-profile business meetings.',
    features: ['Executive Specialists', 'Threat Assessment', 'VIP Escort'],
    ctaText: 'Secure Your Event',
    serviceId: 'corporate',
    backgroundImage: 'linear-gradient(135deg, rgba(70, 130, 180, 0.1), rgba(26, 26, 46, 0.8))',
    accent: '#4682B4'
  },
  {
    id: 'transport-security',
    title: '24/7 Transport Security',
    subtitle: 'Round-the-clock availability',
    description: 'Premium transport security services available 24/7 with GPS tracking and security protocols.',
    features: ['24/7 Availability', 'GPS Tracking', 'Security Protocols'],
    ctaText: 'Book Now',
    serviceId: 'standard',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(26, 26, 46, 0.8))',
    accent: '#FFD700'
  }
];

const TESTIMONIALS_CAROUSEL = [
  {
    id: 'sarah-executive',
    text: 'Exceptional service that made me feel completely secure during my business trip. The professionalism and attention to detail were outstanding.',
    author: 'Sarah Thompson',
    role: 'Regular Executive Client',
    service: 'Executive Security',
    rating: 5,
    verified: true
  },
  {
    id: 'david-corporate',
    text: 'Professional service that impressed our international clients. Armora handled our corporate event security flawlessly.',
    author: 'David Mitchell',
    role: 'Corporate Director',
    service: 'Corporate Protection',
    rating: 5,
    verified: true
  },
  {
    id: 'emma-wedding',
    text: 'Made our special day worry-free and perfectly secure. The team was invisible yet we felt completely protected.',
    author: 'Emma & James Rodriguez',
    role: 'Wedding Clients',
    service: 'Wedding Security',
    rating: 5,
    verified: true
  },
  {
    id: 'michael-shadow',
    text: 'Perfect for maintaining privacy while staying protected. You would never know they were there.',
    author: 'Michael K.',
    role: 'Public Figure',
    service: 'Shadow Protection',
    rating: 5,
    verified: true
  },
  {
    id: 'lisa-standard',
    text: 'Reliable transport security for my daily commute. Professional drivers who make safety their priority.',
    author: 'Lisa Chen',
    role: 'Business Professional',
    service: 'Standard Protection',
    rating: 5,
    verified: true
  }
];

export function ServicesPage() {
  const { state, navigateToView } = useApp();
  const { questionnaireData } = state;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [currentTagline, setCurrentTagline] = useState(0);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([30, 150]);
  const [showPricingCalculator, setShowPricingCalculator] = useState(false);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const [testimonialsIndex, setTestimonialsIndex] = useState(0);

  // Dynamic tagline rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % DYNAMIC_TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hero carousel rotation
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setHeroCarouselIndex((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(carouselInterval);
  }, []);

  // Testimonials rotation
  useEffect(() => {
    const testimonialsInterval = setInterval(() => {
      setTestimonialsIndex((prev) => (prev + 1) % TESTIMONIALS_CAROUSEL.length);
    }, 8000); // 8 seconds per testimonial
    return () => clearInterval(testimonialsInterval);
  }, []);

  const handleBooking = (serviceId: string) => {
    localStorage.setItem('armora_selected_service', serviceId);
    if (serviceId === 'wedding' || serviceId === 'corporate') {
      navigateToView('venue-protection-welcome');
    } else {
      navigateToView('booking');
    }
  };

  const handleComparisonToggle = (serviceId: string) => {
    if (selectedForComparison.includes(serviceId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== serviceId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, serviceId]);
    }
  };

  const filteredServices = ENHANCED_SERVICES.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  }).filter(service => {
    return service.pricing.from >= priceRange[0] && service.pricing.from <= priceRange[1];
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'now': return '#10B981'; // green
      case '15min': return '#F59E0B'; // yellow
      case 'today': return '#F97316'; // orange
      case 'advance': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'now': return 'Available now';
      case '15min': return 'Available in 15 min';
      case 'today': return 'Available today';
      case 'advance': return 'Advance booking required';
      default: return 'Check availability';
    }
  };

  const getRecommendedService = () => {
    if (!questionnaireData) return null;
    const questionnaireBased = questionnaireData.recommendedService;
    if (questionnaireBased === 'armora-shadow') return 'shadow';
    if (questionnaireBased === 'armora-executive') return 'executive';
    if (questionnaireBased === 'armora-standard' || questionnaireBased === 'armora-secure') return 'standard';
    return 'standard';
  };

  const recommendedService = getRecommendedService();

  return (
    <div className={styles.servicesContainer}>
      {/* Animated Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {DYNAMIC_TAGLINES[currentTagline]}
          </h1>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>2,847</span>
              <span className={styles.statLabel}>Active Protections</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>&lt;2min</span>
              <span className={styles.statLabel}>Response</span>
            </div>
          </div>
          {recommendedService && (
            <div className={styles.personalizedBadge}>
              🎯 {ENHANCED_SERVICES.find(s => s.id === recommendedService)?.name} recommended for you
            </div>
          )}
        </div>
      </div>

      {/* Hero Carousel Section */}
      <div className={styles.heroCarousel}>
        <div className={styles.carouselContainer}>
          {HERO_CAROUSEL_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.carouselSlide} ${index === heroCarouselIndex ? styles.active : ''}`}
              style={{ background: slide.backgroundImage }}
            >
              <div className={styles.slideContent}>
                <div className={styles.slideText}>
                  <h2 className={styles.slideTitle} style={{ color: slide.accent }}>
                    {slide.title}
                  </h2>
                  <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                  <p className={styles.slideDescription}>{slide.description}</p>

                  <div className={styles.slideFeatures}>
                    {slide.features.map((feature, featureIndex) => (
                      <span key={featureIndex} className={styles.slideFeature}>
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  <button
                    className={styles.slideCTA}
                    onClick={() => handleBooking(slide.serviceId)}
                    style={{
                      background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}CC)`,
                      boxShadow: `0 4px 20px ${slide.accent}33`
                    }}
                  >
                    {slide.ctaText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className={styles.carouselIndicators}>
          {HERO_CAROUSEL_SLIDES.map((_, index) => (
            <button
              key={index}
              className={`${styles.carouselDot} ${index === heroCarouselIndex ? styles.active : ''}`}
              onClick={() => setHeroCarouselIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className={styles.categoryTabs}>
        <div className={styles.tabsContainer}>
          {[
            { id: 'all', label: 'All Services', icon: '🛡️' },
            { id: 'transport', label: 'Transport Security', icon: '🚗' },
            { id: 'event', label: 'Event Protection', icon: '🏛️' },
            { id: 'corporate', label: 'Corporate Security', icon: '💼' },
            { id: 'personal', label: 'Personal Protection', icon: '🛡️' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`${styles.categoryTab} ${activeCategory === tab.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className={styles.filterControls}>
        <div className={styles.priceFilter}>
          <label className={styles.filterLabel}>Price Range: £{priceRange[0]}-£{priceRange[1]}/hour</label>
          <input
            type="range"
            min="30"
            max="150"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className={styles.rangeSlider}
          />
        </div>
        <div className={styles.filterActions}>
          <button
            className={styles.comparisonToggle}
            onClick={() => setShowComparison(!showComparison)}
          >
            Compare ({selectedForComparison.length})
          </button>
          <button
            className={styles.calculatorToggle}
            onClick={() => setShowPricingCalculator(!showPricingCalculator)}
          >
            Calculator
          </button>
        </div>
      </div>

      {/* Enhanced Services Grid */}
      <div className={styles.enhancedServicesGrid}>
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`${styles.enhancedServiceCard} ${
              !service.isLive ? styles.comingSoon : ''
            } ${
              recommendedService === service.id ? styles.recommended : ''
            } ${
              selectedForComparison.includes(service.id) ? styles.selectedForComparison : ''
            }`}
          >
            {/* Service Header */}
            <div className={styles.enhancedServiceHeader}>
              <div className={styles.serviceTopRow}>
                <div className={`${styles.serviceBadge} ${styles[service.badge.toLowerCase().replace(' ', '')]}`}>
                  {service.badge}
                </div>
                <div
                  className={styles.availabilityIndicator}
                  style={{ backgroundColor: getAvailabilityColor(service.availability) }}
                  title={getAvailabilityText(service.availability)}
                />
              </div>
              <h3 className={styles.enhancedServiceTitle}>{service.name}</h3>
              <p className={styles.enhancedServiceDescription}>{service.briefDescription}</p>
            </div>

            {/* Service Features */}
            <div className={styles.enhancedFeatures}>
              {service.features.map((feature, index) => (
                <div key={index} className={styles.enhancedFeature}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <div className={styles.featureContent}>
                    <span className={styles.featureText}>{feature.text}</span>
                    <span className={styles.featureDetail}>{feature.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Stats */}
            <div className={styles.serviceStats}>
              <div className={styles.statRow}>
                <div className={styles.rating}>
                  {service.stats.rating > 0 ? (
                    <>
                      <span className={styles.stars}>{'⭐'.repeat(Math.floor(service.stats.rating))}</span>
                      <span className={styles.ratingNumber}>{service.stats.rating}</span>
                      <span className={styles.ratingCount}>({service.stats.totalRatings})</span>
                    </>
                  ) : (
                    <span className={styles.comingSoonText}>Coming Soon</span>
                  )}
                </div>
                <div className={styles.bookingsCount}>
                  {service.stats.bookingsThisMonth > 0 ?
                    `${service.stats.bookingsThisMonth} bookings this month` :
                    'Pre-launch phase'
                  }
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className={styles.testimonial}>
              <p className={styles.testimonialText}>"{service.testimonial.text}"</p>
              <div className={styles.testimonialAuthor}>
                - {service.testimonial.author}, {service.testimonial.role}
              </div>
            </div>

            {/* Pricing */}
            <div className={styles.enhancedPricing}>
              <div className={styles.priceDisplay}>
                <span className={styles.priceLabel}>From</span>
                <span className={styles.mainPrice}>£{service.pricing.from}</span>
                <span className={styles.priceUnit}>/{service.pricing.unit}</span>
              </div>
              {service.pricing.discount && (
                <div className={styles.discount}>
                  Save {service.pricing.discount.value}% on {service.pricing.discount.condition} bookings
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={styles.serviceActions}>
              {service.isLive ? (
                <>
                  <button
                    className={styles.primaryAction}
                    onClick={() => handleBooking(service.id)}
                  >
                    Book Now
                  </button>
                  <button
                    className={styles.secondaryAction}
                    onClick={() => setExpandedService(
                      expandedService === service.id ? null : service.id
                    )}
                  >
                    View Details
                  </button>
                  {showComparison && (
                    <button
                      className={`${styles.compareAction} ${
                        selectedForComparison.includes(service.id) ? styles.selected : ''
                      }`}
                      onClick={() => handleComparisonToggle(service.id)}
                      disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(service.id)}
                    >
                      {selectedForComparison.includes(service.id) ? 'Remove' : 'Compare'}
                    </button>
                  )}
                </>
              ) : (
                <button className={styles.disabledAction} disabled>
                  Get Early Access
                </button>
              )}
            </div>

            {/* Expanded Details */}
            {expandedService === service.id && (
              <div className={styles.expandedDetails}>
                <div className={styles.detailsContent}>
                  <h4>Complete Service Details</h4>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailSection}>
                      <h5>Officer Qualifications</h5>
                      <ul>
                        <li>Military/Police Background</li>
                        <li>Certified First Aid Training</li>
                        <li>Defensive Driving Course</li>
                        <li>Regular Psychological Screening</li>
                      </ul>
                    </div>
                    <div className={styles.detailSection}>
                      <h5>Vehicle Specifications</h5>
                      <ul>
                        <li>GPS Tracking System</li>
                        <li>Secure Communication</li>
                        <li>Medical First Aid Kit</li>
                        <li>Panic Button Installation</li>
                      </ul>
                    </div>
                    <div className={styles.detailSection}>
                      <h5>Coverage Areas</h5>
                      <p>Greater London, Birmingham, Manchester, Edinburgh, and major UK cities. International coverage available on request.</p>
                    </div>
                    <div className={styles.detailSection}>
                      <h5>Insurance & Certification</h5>
                      <p>£10M public liability insurance, SIA licensing, and full regulatory compliance.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>

      {/* Interactive Comparison Table */}
      {showComparison && selectedForComparison.length > 1 && (
        <div className={styles.comparisonTable}>
          <h3 className={styles.comparisonTitle}>Service Comparison</h3>
          <div className={styles.comparisonContent}>
            <div className={styles.comparisonGrid}>
              {/* Header Row */}
              <div className={styles.comparisonHeader}>
                <div className={styles.comparisonFeatureLabel}>Features</div>
                {selectedForComparison.map((serviceId) => {
                  const service = ENHANCED_SERVICES.find(s => s.id === serviceId);
                  return (
                    <div key={serviceId} className={styles.comparisonServiceHeader}>
                      <h4 className={styles.comparisonServiceName}>{service?.name}</h4>
                      <div className={styles.comparisonServicePrice}>
                        £{service?.pricing.from}/{service?.pricing.unit}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feature Comparison Rows */}
              {[
                { label: 'SIA Certification', standardValue: 'Level 2', executiveValue: 'Level 3', shadowValue: 'Level 2+', weddingValue: 'Level 2+', corporateValue: 'Level 3' },
                { label: 'Vehicle Type', standardValue: 'BMW 5 Series', executiveValue: 'Armored BMW X5', shadowValue: 'Unmarked Vehicle', weddingValue: 'Discrete Vehicle', corporateValue: 'Luxury Fleet' },
                { label: 'Response Time', standardValue: '10 minutes', executiveValue: '5 minutes', shadowValue: '8 minutes', weddingValue: 'Pre-planned', corporateValue: '5 minutes' },
                { label: 'GPS Tracking', standardValue: '✓', executiveValue: '✓', shadowValue: '✓', weddingValue: '✓', corporateValue: '✓' },
                { label: 'Security Protocols', standardValue: '✓', executiveValue: '✓ Enhanced', shadowValue: '✓ Silent', weddingValue: '✓ Discrete', corporateValue: '✓ Enhanced' },
                { label: 'Coverage Area', standardValue: 'UK Wide', executiveValue: 'International', shadowValue: 'UK Wide', weddingValue: 'Venue Based', corporateValue: 'Global' }
              ].map((feature, index) => (
                <div key={index} className={styles.comparisonRow}>
                  <div className={styles.comparisonFeature}>{feature.label}</div>
                  {selectedForComparison.map((serviceId) => {
                    const value = serviceId === 'standard' ? feature.standardValue :
                                 serviceId === 'executive' ? feature.executiveValue :
                                 serviceId === 'shadow' ? feature.shadowValue :
                                 serviceId === 'wedding' ? feature.weddingValue :
                                 serviceId === 'corporate' ? feature.corporateValue : '—';
                    return (
                      <div key={serviceId} className={styles.comparisonValue}>
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Action Row */}
              <div className={styles.comparisonActions}>
                <div className={styles.comparisonFeature}></div>
                {selectedForComparison.map((serviceId) => (
                  <div key={serviceId} className={styles.comparisonActionCell}>
                    <button
                      className={styles.comparisonBookButton}
                      onClick={() => handleBooking(serviceId)}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Recommendations */}
      {recommendedService && (
        <div className={styles.smartRecommendation}>
          <h3 className={styles.recommendationTitle}>🎯 Perfect Match for You</h3>
          <p className={styles.recommendationText}>
            Based on your profile, <strong>{ENHANCED_SERVICES.find(s => s.id === recommendedService)?.name}</strong> suits you best.
          </p>
          <div className={styles.recommendationReasons}>
            <span className={styles.reason}>✓ Matches your security needs</span>
            <span className={styles.reason}>✓ Fits your travel patterns</span>
            <span className={styles.reason}>✓ Optimal value for requirements</span>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className={styles.trustSection}>
        <div className={styles.certificationBadges}>
          <div className={styles.certBadge}>SIA Licensed</div>
          <div className={styles.certBadge}>ISO 27001</div>
          <div className={styles.certBadge}>£10M Insured</div>
          <div className={styles.certBadge}>Military Trained</div>
        </div>
        <div className={styles.liveStats}>
          <div className={styles.liveStat}>
            <span className={styles.liveNumber}>47</span>
            <span className={styles.liveLabel}>Officers on duty</span>
          </div>
          <div className={styles.liveStat}>
            <span className={styles.liveNumber}>23</span>
            <span className={styles.liveLabel}>Active routes</span>
          </div>
          <div className={styles.liveStat}>
            <span className={styles.liveNumber}>1.8min</span>
            <span className={styles.liveLabel}>Response time</span>
          </div>
        </div>
      </div>

      {/* Enhanced Testimonial Carousel */}
      <div className={styles.testimonialCarousel}>
        <h3 className={styles.carouselTitle}>What Our Clients Say</h3>
        <div className={styles.testimonialContainer}>
          {TESTIMONIALS_CAROUSEL.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`${styles.testimonialSlide} ${index === testimonialsIndex ? styles.active : ''}`}
            >
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p className={styles.testimonialQuote}>
                  "{testimonial.text}"
                </p>
                <div className={styles.testimonialClient}>
                  <div className={styles.clientInfo}>
                    <strong className={styles.clientName}>{testimonial.author}</strong>
                    <span className={styles.clientRole}>{testimonial.role}</span>
                    <span className={styles.serviceUsed}>{testimonial.service}</span>
                  </div>
                  {testimonial.verified && (
                    <span className={styles.verifiedBadge}>✓ Verified Customer</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Indicators */}
        <div className={styles.testimonialIndicators}>
          {TESTIMONIALS_CAROUSEL.map((_, index) => (
            <button
              key={index}
              className={`${styles.testimonialDot} ${index === testimonialsIndex ? styles.active : ''}`}
              onClick={() => setTestimonialsIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Pricing Calculator */}
      {showPricingCalculator && (
        <div className={styles.pricingCalculator}>
          <h3 className={styles.calculatorTitle}>Service Pricing Calculator</h3>
          <div className={styles.calculatorContent}>
            <div className={styles.calculatorControls}>
              <label>Duration: <input type="range" min="1" max="24" /> hours</label>
              <label>Service Level: <select><option>Standard</option><option>Executive</option></select></label>
            </div>
            <div className={styles.calculatorResult}>
              <span className={styles.estimatedPrice}>Estimated: £180</span>
              <span className={styles.savings}>Save 10% on monthly bookings</span>
            </div>
          </div>
        </div>
      )}

      {/* Wedding & Event Security - Moved from Dashboard */}
      <section id="event-security" className={styles.weddingSection}>
        <WeddingEventSecurity />
      </section>

    </div>
  );
}