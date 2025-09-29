import { useState } from 'react';
import styles from './ServiceComparison.module.css';

export interface ServiceTier {
  id: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  shortName: string;
  icon: string;
  rate: string;
  hourlyRate: number;
  responseTime: string;
  officerLevel: string;
  experience: string;
  training: string;
  threatAssessment: boolean;
  counterSurveillance: boolean;
  bestFor: string[];
  features: string[];
  badge?: string;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'essential',
    name: 'Essential Secure Transport',
    shortName: 'Essential',
    icon: '',
    rate: '£50/hr',
    hourlyRate: 50,
    responseTime: '2-4 minutes',
    officerLevel: 'Nissan Leaf EV',
    experience: 'Professional Driver',
    training: 'Your everyday secure transport',
    threatAssessment: false,
    counterSurveillance: false,
    bestFor: ['Daily activities', 'Shopping visits', 'Medical appointments', 'Social events'],
    features: [
      'Professional officer drives you safely',
      'Clean, comfortable electric vehicle',
      'Perfect for everyday journeys',
      'Discrete - looks like any executive car',
      'Most affordable secure transport option'
    ],
    badge: 'MOST POPULAR'
  },
  {
    id: 'executive',
    name: 'Executive Secure Transport',
    shortName: 'Executive',
    icon: '',
    rate: '£75/hr',
    hourlyRate: 75,
    responseTime: '3-5 minutes',
    officerLevel: 'BMW X5 SUV',
    experience: 'Senior Protection Officer',
    training: 'Premium security transport',
    threatAssessment: true,
    counterSurveillance: false,
    bestFor: ['Important business meetings', 'Corporate events', 'High-profile appointments', 'Airport transfers'],
    features: [
      'Senior protection officer with 5+ years experience',
      'Premium BMW X5 with tinted windows',
      'Advance route planning for efficiency',
      'Professional presence that commands respect',
      'Perfect for executives and VIPs'
    ]
  },
  {
    id: 'shadow',
    name: 'Shadow Discrete Transport',
    shortName: 'Shadow',
    icon: '',
    rate: '£125/hr',
    hourlyRate: 125,
    responseTime: '5-8 minutes',
    officerLevel: 'Unmarked Vehicle',
    experience: 'Ex-Military/Special Forces',
    training: 'Invisible excellence',
    threatAssessment: true,
    counterSurveillance: true,
    bestFor: ['High-profile individuals', 'Sensitive meetings', 'Celebrity transport', 'Privacy-critical journeys'],
    features: [
      'Ex-military/special forces officers only',
      'Unmarked vehicles that change regularly',
      'Counter-surveillance trained professionals',
      'No one will know you have protection',
      'Ultimate discretion and invisibility'
    ]
  },
  {
    id: 'client-vehicle',
    name: 'Your Vehicle Secure Transport',
    shortName: 'Your Car',
    icon: '',
    rate: '£55/hr',
    hourlyRate: 55,
    responseTime: '4-6 minutes',
    officerLevel: 'Your Own Vehicle',
    experience: 'Security Driver',
    training: 'Your car, our expertise',
    threatAssessment: false,
    counterSurveillance: false,
    bestFor: ['Love your own car', 'Familiar comfort', 'No mileage costs', 'Personal vehicle preference'],
    features: [
      'Protection officer drives your vehicle',
      'Your car stays with you',
      'No mileage charges on rental vehicles',
      'Familiar comfort of your own car',
      'Most economical secure transport option'
    ]
  }
];

interface ServiceComparisonProps {
  selectedServiceId: string | null;
  onServiceSelect: (service: ServiceTier | null) => void;
  recommendedService?: string;
  preselectedServiceId?: string;
  source?: 'home' | 'services' | 'toolbar' | 'hamburger';
}

const getCustomerQuote = (serviceId: string): string => {
  const quotes = {
    'essential': 'I need safe transport for daily activities - shopping, appointments, visiting friends. Nothing flashy, just reliable protection.',
    'executive': 'I need to arrive with authority. My safety and image matter equally. This is for important meetings and high-profile events.',
    'shadow': 'I don\'t want anyone knowing I have protection. Complete discretion is essential. Blend in, stay safe.',
    'client-vehicle': 'I love my car and want to use it, but I need professional security driving. Best of both worlds.'
  };
  return quotes[serviceId as keyof typeof quotes] || '';
};


const getKeyBenefits = (serviceId: string): string[] => {
  const benefits = {
    'essential': ['SIA licensed', 'Nissan Leaf EV', '2-4 min response', '2hr minimum', 'Discrete service', '£50/hour'],
    'executive': ['SIA Level 3', 'BMW X5 SUV', '3-5 min response', 'Corporate trained', 'Premium image', '£75/hour'],
    'shadow': ['Ex-military', 'Unmarked vehicle', '5-8 min response', 'Counter-surveillance', 'Invisible protection', '£125/hour'],
    'client-vehicle': ['Your car used', 'Security driver', '4-6 min response', 'No mileage fees', 'Complete privacy', '£55/hour']
  };
  return benefits[serviceId as keyof typeof benefits] || [];
};

export function ServiceComparison({
  selectedServiceId,
  onServiceSelect,
  recommendedService,
  preselectedServiceId,
  source
}: ServiceComparisonProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleServiceSelect = (service: ServiceTier) => {
    // If this service is already selected, deselect it (pass null)
    // Otherwise, select this service
    if (selectedServiceId === service.id) {
      onServiceSelect(null);
    } else {
      onServiceSelect(service);
    }
  };

  const getUniqueSellingPoint = (service: ServiceTier): string => {
    const usps = {
      'essential': 'Eco-friendly EV • No frills protection • Most affordable',
      'executive': 'BMW luxury • Threat assessment • Corporate presence',
      'shadow': 'Unmarked vehicle • Counter-surveillance • Invisible protection',
      'client-vehicle': 'Use your vehicle • No mileage charges • Complete privacy'
    };
    return usps[service.id as keyof typeof usps] || '';
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🛡️ Request Protection Services</h2>
        <p className={styles.subtitle}>Select your protection tier</p>
      </div>


      {/* Collapsible Service Cards */}
      <div className={styles.serviceCards}>
        {SERVICE_TIERS.map((service) => {
          const isSelected = selectedServiceId === service.id;
          const isExpanded = expandedCard === service.id;
          const isPreselected = preselectedServiceId === service.id;

          return (
            <div
              key={service.id}
              className={`${styles.serviceCard} ${isSelected ? styles.selectedCard : ''} ${isExpanded ? styles.expandedCard : styles.collapsedCard}`}
            >
              {/* Collapsed View - Always Visible */}
              <div className={styles.cardHeader}>
                <div className={styles.serviceTitleSection}>
                  <div className={styles.serviceNamePrice}>
                    <h3 className={styles.serviceName}>
                      {service.shortName}
                      {service.badge && <span className={styles.popularBadge}>{service.badge}</span>}
                      {isPreselected && <span className={styles.preselectedBadge}>Selected from {source === 'home' ? 'Home' : 'Services'}</span>}
                    </h3>
                    <span className={styles.servicePrice}>{service.rate}</span>
                  </div>
                  <div className={styles.uniqueSellingPoint}>{getUniqueSellingPoint(service)}</div>
                </div>
                {isSelected && <span className={styles.selectedCheckmark}>✓</span>}
              </div>

              <div className={styles.quickStats}>
                <span className={styles.stat}>⚡ {service.responseTime}</span>
                <span className={styles.statSeparator}>•</span>
                <span className={styles.stat}>🚗 {service.officerLevel}</span>
                <span className={styles.statSeparator}>•</span>
                <span className={styles.stat}>⏱️ 2hr min</span>
              </div>

              {/* Action Buttons - Always Visible */}
              <div className={styles.cardActions}>
                <button
                  className={`${styles.selectButton} ${isSelected ? styles.selectedButton : ''}`}
                  onClick={() => handleServiceSelect(service)}
                  aria-label={isSelected ? `Deselect ${service.shortName} protection service` : `Select ${service.shortName} protection service`}
                >
                  {isSelected ? 'Selected ✓' : 'Select'}
                </button>
                <button
                  className={styles.detailsButton}
                  onClick={() => toggleExpand(service.id)}
                >
                  {isExpanded ? 'Less ↑' : 'Why? ↓'}
                </button>
              </div>

              {/* Expanded Content - Conditionally Visible */}
              {isExpanded && (
                <div className={styles.expandedContent}>
                  <div className={styles.customerQuoteSection}>
                    <div className={styles.quoteLabel}>Customer says:</div>
                    <div className={styles.customerQuote}>"{getCustomerQuote(service.id)}"</div>
                  </div>

                  <div className={styles.featureGrid}>
                    <div className={styles.featureColumn}>
                      <h4 className={styles.featureTitle}>What you get:</h4>
                      <ul className={styles.featureList}>
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className={styles.featureItem}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.featureColumn}>
                      <h4 className={styles.featureTitle}>Best for:</h4>
                      <ul className={styles.featureList}>
                        {service.bestFor.slice(0, 3).map((use, index) => (
                          <li key={index} className={styles.featureItem}>• {use}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.keyBenefits}>
                    {getKeyBenefits(service.id).map((benefit, index) => (
                      <span key={index} className={styles.benefitBadge}>{benefit}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>



    </div>
  );
}

export { SERVICE_TIERS };