import React, { useState, useEffect } from 'react';
import { ServiceLevel, PersonalizationData } from '../../types';
import styles from './DynamicRecommendation.module.css';

interface DynamicRecommendationProps {
  recommendedService: string;
  services: ServiceLevel[];
  questionnaireData: PersonalizationData;
  userType?: 'registered' | 'google' | 'guest' | null;
  isFirstTime?: boolean;
}

interface TrustMetrics {
  rating: number;
  totalTrips: number;
  activeClients: number;
  reviewCount: number;
}

export function DynamicRecommendation({
  recommendedService,
  services,
  questionnaireData,
  userType = 'registered',
  isFirstTime = false
}: DynamicRecommendationProps) {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [availableDrivers, setAvailableDrivers] = useState(3);
  const [isHighDemand, setIsHighDemand] = useState(false);

  // Dynamic headlines that rotate
  const headlines = [
    { icon: '🛡️', text: 'Your Safety, Our Priority - Recommended Protection Level' },
    { icon: '⭐', text: 'Tailored Security - Chosen For Your Peace of Mind' },
    { icon: '🎯', text: 'Smart Choice Alert - Your Ideal Protection Package' },
    { icon: '🏆', text: 'VIP Protection Made Accessible - Perfect For You' }
  ];

  // Trust metrics (in real app, these would come from API)
  const trustMetrics: TrustMetrics = {
    rating: 4.8,
    totalTrips: 15847,
    activeClients: 3200,
    reviewCount: 2847
  };

  // Determine time of day for contextual messaging
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    // Simulate dynamic availability and demand
    const drivers = Math.floor(Math.random() * 5) + 2; // 2-6 drivers
    setAvailableDrivers(drivers);
    setIsHighDemand(drivers <= 3);
  }, []);

  // Rotate headlines every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Get recommended service details
  const service = services.find(s => s.id === recommendedService);
  if (!service) return null;

  // Dynamic personalized messaging based on context
  const getPersonalizedMessage = () => {
    if (timeOfDay === 'night') {
      return '🌙 Enhanced night-time security protocols active in your area';
    }
    if (isFirstTime) {
      return '🎉 Welcome! Our most trusted service level for new clients';
    }
    if (userType === 'registered' || userType === 'google') {
      return '👑 Welcome back! Your preferred security level ready';
    }
    if (isHighDemand) {
      return '🛡️ High demand detected - enhanced security recommended';
    }
    return '✨ Professional protection tailored to your security profile';
  };

  // Service-specific value propositions with updated vehicle specs
  const getValuePropositions = () => {
    const baseProps = [
      'SIA Level 2 security-certified drivers',
      'Eco-friendly Nissan Leaf EV fleet (discreet)',
      'Real-time safety monitoring & GPS tracking',
      '24/7 response protocols',
      'Background-checked security professionals'
    ];

    if (service.id === 'executive') {
      return [
        'SIA Level 3 certified security drivers',
        'BMW 5 Series with security modifications',
        'Advanced threat assessment training',
        'Priority safety response team',
        'Executive protection protocols'
      ];
    }

    if (service.id === 'shadow') {
      return [
        'Special Forces trained protection officers',
        'Protected BMW X5 tactical specifications',
        'Counter-surveillance expertise',
        'Tactical route planning & assessment',
        'Government-level security protocols'
      ];
    }

    return baseProps;
  };

  // Pricing psychology messaging
  const getPricingMessage = () => {
    const hourlyRate = service.hourlyRate;
    if (hourlyRate <= 45) {
      return `£${hourlyRate}/hour - Professional security at taxi prices`;
    }
    if (hourlyRate <= 65) {
      return `£${hourlyRate}/hour - Premium protection worth every penny`;
    }
    return `£${hourlyRate}/hour - Elite security investment for your peace of mind`;
  };

  // Smart recommendation reasoning
  const getRecommendationReason = () => {
    if (service.socialProof?.selectionRate) {
      return `${service.socialProof.selectionRate}% of clients with similar profiles choose this level`;
    }
    return 'This matches your stated security preferences perfectly';
  };

  const currentHeadline = headlines[currentHeadlineIndex];

  return (
    <div className={styles.recommendationSection}>
      <div className={styles.recommendationCard}>
        {/* Dynamic Header */}
        <div className={styles.header}>
          <span className={styles.headerIcon}>{currentHeadline.icon}</span>
          <h3 className={styles.title}>{currentHeadline.text}</h3>
        </div>

        {/* Personalized Message */}
        <div className={styles.personalizedMessage}>
          <p className={styles.messageText}>{getPersonalizedMessage()}</p>
        </div>

        {/* Main Recommendation */}
        <div className={styles.mainRecommendation}>
          <div className={styles.serviceHighlight}>
            <span className={styles.serviceName}>{service.name}</span>
            {service.isPopular && <span className={styles.popularBadge}>Most Popular</span>}
          </div>
          <p className={styles.recommendationText}>
            Professional security transport designed for peace of mind.
            Our <strong>SIA Level 2 certified drivers</strong> provide discreet protection
            in eco-friendly <strong>Nissan Leaf EVs</strong>, combining safety with
            environmental responsibility at accessible <strong>£45/hour</strong> pricing.
          </p>
        </div>

        {/* Value Propositions */}
        <div className={styles.valuePropositions}>
          {getValuePropositions().slice(0, 4).map((prop, index) => (
            <div key={index} className={styles.valueProp}>
              <span className={styles.checkIcon}>✅</span>
              <span className={styles.propText}>{prop}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className={styles.socialProof}>
          <div className={styles.trustIndicator}>
            <span className={styles.rating}>⭐ {trustMetrics.rating}/5 stars</span>
            <span className={styles.divider}>•</span>
            <span className={styles.trips}>🛡️ {trustMetrics.totalTrips.toLocaleString()}+ safe trips</span>
          </div>
          <div className={styles.trustIndicator}>
            <span className={styles.clients}>👥 Trusted by {trustMetrics.activeClients.toLocaleString()}+ clients</span>
            <span className={styles.divider}>•</span>
            <span className={styles.reviews}>📝 {trustMetrics.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>

        {/* Smart Recommendation Reason */}
        <div className={styles.recommendationReason}>
          <span className={styles.reasonIcon}>🧠</span>
          <span className={styles.reasonText}>{getRecommendationReason()}</span>
        </div>

        {/* Urgency & Availability */}
        <div className={styles.urgencySection}>
          <div className={styles.availability}>
            <span className={styles.availabilityIcon}>⚡</span>
            <span className={styles.availabilityText}>
              {availableDrivers} professional drivers nearby
            </span>
          </div>
          {isHighDemand && (
            <div className={styles.urgencyAlert}>
              <span className={styles.urgencyIcon}>🔥</span>
              <span className={styles.urgencyText}>
                High demand area - book within 15 minutes for guaranteed service
              </span>
            </div>
          )}
        </div>

        {/* Pricing Psychology */}
        <div className={styles.pricingSection}>
          <div className={styles.pricingMessage}>
            <span className={styles.priceIcon}>💰</span>
            <span className={styles.priceText}>{getPricingMessage()}</span>
          </div>
        </div>

        {/* Accessibility Message */}
        <div className={styles.accessibilityMessage}>
          <p className={styles.accessibilityText}>
            <strong>Security shouldn't be a premium - it's a right.</strong> {service.name} makes
            professional security transport accessible to everyone, whether you're a business executive,
            student, or anyone who values their safety and environmental responsibility.
          </p>
        </div>

        {/* Risk-Free Guarantees */}
        <div className={styles.guarantees}>
          <div className={styles.guarantee}>
            <span className={styles.guaranteeIcon}>✅</span>
            <span className={styles.guaranteeText}>100% Safe Arrival Guarantee</span>
          </div>
          <div className={styles.guarantee}>
            <span className={styles.guaranteeIcon}>✅</span>
            <span className={styles.guaranteeText}>No-questions-asked cancellation policy</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <button className={styles.primaryCta}>
            <span className={styles.ctaIcon}>🛡️</span>
            Secure Your Journey Now
          </button>
          <p className={styles.ctaSubtext}>Your safety investment pays for itself</p>
        </div>
      </div>
    </div>
  );
}