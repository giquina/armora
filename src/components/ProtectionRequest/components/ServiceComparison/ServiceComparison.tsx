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
    officerLevel: '1 Protection Officer',
    experience: 'SIA-Licensed CPO',
    training: 'Professional close protection',
    threatAssessment: false,
    counterSurveillance: false,
    bestFor: ['Business meetings', 'Property viewings', 'Medical appointments'],
    features: [
      'Real-time GPS tracking throughout journey',
      'Secure communication with operations center',
      'Officer flexibility - inside or vehicle standby'
    ],
    badge: 'MOST BOOKED'
  },
  {
    id: 'executive',
    name: 'Executive Protection',
    shortName: 'Executive',
    icon: '',
    rate: '£75/hr + £3.50/mile',
    hourlyRate: 75,
    mileageRate: 3.50,
    responseTime: '3-5 minutes',
    officerLevel: '1-2 Protection Officers',
    experience: 'SIA Level 3 CPO',
    training: 'Enhanced executive security',
    threatAssessment: true,
    counterSurveillance: false,
    bestFor: ['VIP events', 'High-value negotiations', 'Public appearances'],
    features: [
      'Pre-event venue security assessment',
      'Dual-officer coordination protocols',
      'Premium secure vehicle fleet included'
    ]
  },
  {
    id: 'shadow',
    name: 'Shadow Protection',
    shortName: 'Shadow',
    icon: '',
    rate: '£65/hr + £3.00/mile',
    hourlyRate: 65,
    mileageRate: 3.00,
    responseTime: '5-8 minutes',
    officerLevel: '1-6 Officers (Scalable)',
    experience: 'Special Forces Trained',
    training: 'Covert layered security',
    threatAssessment: true,
    counterSurveillance: true,
    bestFor: ['HNW individuals', 'Elevated threats', 'Complete anonymity'],
    features: [
      'Counter-surveillance detection systems',
      'Encrypted team communication network',
      'Rotating officer positions for pattern avoidance'
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
    bestFor: ['Own luxury vehicle', 'Familiar comfort', 'Cost savings'],
    features: [
      'Comprehensive vehicle insurance coverage',
      'Respect for personal vehicle settings',
      'Zero mileage or fuel surcharges'
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
    'essential': 'I need professional protection for business meetings and appointments. Single officer provides security without being over the top.',
    'executive': 'Multiple officers for coordinated security at high-profile events. Advance planning gives me complete confidence.',
    'shadow': 'Invisible protection that scales with threat level. Up to 6 officers in plain clothes - nobody knows they\'re there.',
    'client-vehicle': 'I prefer using my own vehicle. Having a security-trained officer drive means no mileage charges and complete privacy.'
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
    'essential': `**Real Example: Business Meeting in Central London**

How it works:
1. Single CPO arrives at your location at agreed time
2. Security check and route briefing conducted
3. Protected travel to your destination
4. Officer accompanies you inside OR waits with vehicle (your choice)
5. Secure return journey completed

Why clients choose this:
• Affordable professional protection for daily activities
• Discrete security presence without drawing attention
• Flexibility - officer adapts to your preferences`,

    'executive': `**Real Example: High-Profile Restaurant Reservation**

How it works:
1. Advance reconnaissance of venue 24 hours prior
2. Team arrives 15 minutes early for security briefing
3. Protected travel in premium secure vehicle
4. One officer maintains vehicle security throughout
5. Second officer provides close protection inside venue
6. Coordinated secure departure with flexible routing

Why clients choose this:
• Multiple officers provide layered security coverage
• Advance planning eliminates surprises and risks
• Professional coordination impresses clients and colleagues`,

    'shadow': `**Real Example: Private Shopping in Mayfair**

How it works:
1. Lead CPO picks you up (can drive your personal vehicle)
2. Additional officers positioned strategically around 20-30m perimeter
3. Plain clothes team maintains covert monitoring via radio
4. Officers rotate positions to avoid pattern recognition
5. Zero visible security presence maintained
6. Discreet departure with advance/follow vehicles if needed

Why clients choose this:
• Completely invisible protection - nobody knows you're secured
• Scales from 1 to 6 officers based on actual threat level
• Military-grade covert operations for maximum discretion`,

    'client-vehicle': `**Real Example: Evening Gala in Your Personal Vehicle**

How it works:
1. SIA-licensed officer arrives at your location
2. Officer professionally operates YOUR vehicle
3. Expert protective driving while you relax
4. No mileage charges (you provide the vehicle)
5. Secure return to your location after event

Why clients choose this:
• Use your own luxury car with professional security driving
• Most economical option - no vehicle rental or mileage fees
• Complete privacy and familiar comfort throughout`
  };
  return scenarios[serviceId as keyof typeof scenarios] || '';
};


const getKeyBenefits = (serviceId: string): string[] => {
  const benefits = {
    'essential': ['1 Protection Officer', 'SIA-Licensed', '2-4 min response', '2-hour minimum', 'Door-to-door security', '£50/hr + £2.50/mile'],
    'executive': ['1-2 Officers (scalable)', 'Advance reconnaissance', '3-5 min response', 'Coordinated security', 'Premium vehicles', '£75/hr + £3.50/mile'],
    'shadow': ['1-6 Officers (scalable)', 'Plain clothes', '5-8 min response', 'Layered perimeter', 'Covert operations', '£65/hr + £3.00/mile'],
    'client-vehicle': ['SIA-licensed officer', 'Your vehicle', '4-6 min response', 'No mileage fees', 'Your comfort', '£55/hr only']
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
      'essential': 'Single officer for professional protection • Perfect for meetings, appointments & daily security',
      'executive': '1-2 officers with advance planning • Coordinated security for high-profile occasions',
      'shadow': '1-6 officers in plain clothes • Scalable covert protection for elevated threat levels',
      'client-vehicle': 'Security officer operates your vehicle • No mileage fees, complete privacy'
    };
    return usps[service.id as keyof typeof usps] || '';
  };


  return (
    <div className={styles.container}>
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