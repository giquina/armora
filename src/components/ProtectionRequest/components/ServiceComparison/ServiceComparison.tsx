import { useState } from 'react';
import styles from './ServiceComparison.module.css';

export interface ServiceTier {
  id: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  shortName: string;
  icon: string;
  rate: string;
  hourlyRate: number;
  mileageRate: number; // Cost per mile
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
    name: 'Essential Protection',
    shortName: 'Essential',
    icon: '',
    rate: '£50/hr + £2.50/mile',
    hourlyRate: 50,
    mileageRate: 2.50,
    responseTime: '2-4 minutes',
    officerLevel: 'Nissan Leaf EV',
    experience: 'SIA Level 2 CPO',
    training: 'Your everyday secure transport',
    threatAssessment: false,
    counterSurveillance: false,
    bestFor: ['Daily activities', 'Shopping visits', 'Medical appointments', 'Social events'],
    features: [
      'SIA Level 2 licensed Close Protection Officer',
      'Secure vehicle included (Nissan Leaf EV)',
      'Perfect for everyday journeys',
      'Discrete - looks like any executive car',
      'Most affordable protection option'
    ],
    badge: 'MOST BOOKED'
  },
  {
    id: 'executive',
    name: 'Executive Protection',
    shortName: 'Executive',
    icon: '',
    rate: '£95/hr + £2.50/mile',
    hourlyRate: 95,
    mileageRate: 2.50,
    responseTime: '3-5 minutes',
    officerLevel: 'BMW X5 SUV',
    experience: 'SIA Level 3 CPO',
    training: 'Premium security transport',
    threatAssessment: true,
    counterSurveillance: false,
    bestFor: ['Important business meetings', 'Corporate events', 'High-profile appointments', 'Airport transfers'],
    features: [
      'SIA Level 3 licensed CPO with 5+ years experience',
      'Secure premium vehicle (BMW X5 with tinted windows)',
      'Advanced threat assessment training',
      'Corporate-trained for professional presence',
      'Perfect for executives and VIPs'
    ]
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    shortName: 'Shadow',
    icon: '',
    rate: '£125/hr + £2.50/mile',
    hourlyRate: 125,
    mileageRate: 2.50,
    responseTime: '5-8 minutes',
    officerLevel: 'Unmarked Vehicle',
    experience: 'Military-Trained CPO',
    training: 'Invisible excellence',
    threatAssessment: true,
    counterSurveillance: true,
    bestFor: ['High-profile individuals', 'Sensitive meetings', 'Celebrity transport', 'Privacy-critical journeys'],
    features: [
      'Military/Special Forces trained CPO',
      'Secure unmarked vehicles that rotate regularly',
      'Counter-surveillance and threat detection expertise',
      'Covert operations - invisible protection',
      'Ultimate discretion for high-profile clients'
    ]
  },
  {
    id: 'client-vehicle',
    name: 'Client Vehicle Service',
    shortName: 'Your Car',
    icon: '',
    rate: '£55/hr',
    hourlyRate: 55,
    mileageRate: 0,
    responseTime: '4-6 minutes',
    officerLevel: 'Your Own Vehicle',
    experience: 'SIA-Licensed Driver',
    training: 'Your car, our expertise',
    threatAssessment: false,
    counterSurveillance: false,
    bestFor: ['Love your own car', 'Familiar comfort', 'No mileage costs', 'Personal vehicle preference'],
    features: [
      'SIA-licensed security-trained driver',
      'CPO drives your vehicle safely',
      'No mileage charges (you provide vehicle)',
      'Familiar comfort of your own car',
      'Most economical protection option'
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

const getSecurityClassification = (serviceId: string): string => {
  const classifications = {
    'essential': 'LEVEL 2 • EVERYDAY PROTECTION',
    'executive': 'LEVEL 3 • ENHANCED EXECUTIVE SECURITY',
    'shadow': 'TIER 1 • COVERT OPERATIONS',
    'client-vehicle': 'SIA-LICENSED • YOUR VEHICLE PROTOCOL'
  };
  return classifications[serviceId as keyof typeof classifications] || '';
};

const getRealLifeScenario = (serviceId: string): string => {
  const scenarios = {
    'essential': "You're visiting family in Kensington and need to stop at Waitrose. Your SIA Level 2 Close Protection Officer arrives in a secure Nissan Leaf EV. They provide protective transport through London, maintaining situational awareness throughout. At Waitrose, your CPO maintains visual contact while you shop, ensuring your security. Your protection detail then continues to your family's residence. You have government-licensed security for everyday life - professional, discrete, and always alert.",

    'executive': "You have a critical board meeting in Canary Wharf at 9am. Your SIA Level 3 CPO arrives at 8:15am in a secure BMW X5. They've completed advance route reconnaissance and threat assessment. During transit, you work confidently knowing your security detail is handling all protection protocols. Your CPO positions strategically near the venue, monitoring for any concerns. When your meeting concludes, your protection team is ready for immediate secure departure. This is executive-level personal security - the kind that C-suite executives and government officials rely on.",

    'shadow': "You're a high-profile individual attending a private dinner in Mayfair. Your military-trained CPO operates from an unmarked vehicle that rotates weekly. Your protection detail positions you 50 meters from the venue - no obvious security presence. Throughout the evening, your CPO maintains overwatch from a strategic position, running counter-surveillance protocols. When you're ready to depart, a discreet signal brings your security team to the entrance. To observers, you arrived independently. This is invisible protection - the same covert security used by celebrities and diplomats.",

    'client-vehicle': "You've just acquired a new Porsche Cayenne but require secure transport for tonight's charity gala. Your government-licensed security driver arrives at your Chelsea residence. They provide expert protective driving in YOUR vehicle, maintaining security protocols throughout transit to the V&A Museum. You retain the comfort and privacy of your personal vehicle while your SIA-licensed CPO handles all security and navigation. After the event, your protection detail ensures safe return to your residence. Your vehicle remains under your control with professional security at the wheel."
  };
  return scenarios[serviceId as keyof typeof scenarios] || '';
};


const getKeyBenefits = (serviceId: string): string[] => {
  const benefits = {
    'essential': ['SIA Level 2', 'Nissan Leaf EV', '2-4 min response', '2-hour minimum', 'Secure vehicle', '£50/hr + £2.50/mile'],
    'executive': ['SIA Level 3', 'BMW X5 SUV', '3-5 min response', 'Corporate trained', 'Premium security', '£95/hr + £2.50/mile'],
    'shadow': ['Military-trained', 'Unmarked vehicle', '5-8 min response', 'Counter-surveillance', 'Covert ops', '£125/hr + £2.50/mile'],
    'client-vehicle': ['SIA-licensed', 'Your vehicle', '4-6 min response', 'No mileage fees', 'Your comfort', '£55/hr only']
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
      'essential': 'Safe, reliable transport for daily life • Perfect for shopping, appointments & errands',
      'executive': 'Arrive with confidence & authority • Premium BMW for business meetings & VIP events',
      'shadow': 'Total invisibility & discretion • Elite protection for celebrities & high-profile clients',
      'client-vehicle': 'Your own car + expert security driving • Most economical, no vehicle rental fees'
    };
    return usps[service.id as keyof typeof usps] || '';
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Choose Your Protection Level</h2>
        <p className={styles.subtitle}>All officers are SIA-licensed and background-checked. We'll match you with the right CPO based on your needs and provide a secure vehicle. Pick the level that feels right for your journey.</p>
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
                <span className={styles.stat}>⏱️ 2-hour minimum</span>
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
                  {/* Real-Life Security Scenario */}
                  <div className={styles.securityScenario}>
                    <div className={styles.scenarioClassification}>
                      {getSecurityClassification(service.id)}
                    </div>
                    <div className={styles.scenarioTitle}>
                      🎬 YOUR PERSONAL SECURITY DETAIL IN ACTION
                    </div>
                    <div className={styles.scenarioText}>
                      {getRealLifeScenario(service.id)}
                    </div>
                  </div>

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