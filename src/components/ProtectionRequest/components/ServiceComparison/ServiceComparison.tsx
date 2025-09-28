import { useState, useEffect, useRef } from 'react';
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
  onServiceSelect: (service: ServiceTier) => void;
  recommendedService?: string;
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

const getServiceDescription = (serviceId: string): string => {
  const descriptions = {
    'essential': 'Your everyday protection solution. Professional, reliable, and discrete. The Nissan Leaf EV is comfortable and environmentally conscious without being flashy. Your protection officer knows all the safe routes and you feel secure without drawing attention. Perfect for daily life at just £50/hour.',
    'executive': 'When your position demands premium security. Arrive with confidence in a luxury BMW X5. Your senior protection officer has corporate experience and understands executive needs. Professional presence that commands respect while keeping you completely safe.',
    'shadow': 'Complete protection, completely invisible. No one will know you have a protection officer. Our ex-military specialists use unmarked vehicles and advanced techniques. Ultimate discretion for high-profile individuals who value their privacy above all.',
    'client-vehicle': 'Your vehicle, our expertise. Familiar comfort with professional security. Our protection officer drives your own car while providing the same level of security. No mileage charges, complete privacy, and the comfort of your familiar vehicle.'
  };
  return descriptions[serviceId as keyof typeof descriptions] || '';
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
  recommendedService
}: ServiceComparisonProps) {
  const [activeTab, setActiveTab] = useState<string>('essential');
  const [isDetailsEntering, setIsDetailsEntering] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Remove auto-selection - users must explicitly choose
  useEffect(() => {
    // No automatic service selection - user must choose
  }, []);

  const activeService = SERVICE_TIERS.find(s => s.id === activeTab) || SERVICE_TIERS[0];

  const handleTabClick = (service: ServiceTier) => {
    if (activeTab !== service.id) {
      setIsDetailsEntering(true);
      setActiveTab(service.id);
      onServiceSelect(service);

      // Reset animation after it completes
      setTimeout(() => {
        setIsDetailsEntering(false);
      }, 350);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🛡️ Request Protection Services</h2>
        <p className={styles.subtitle}>Select your protection tier</p>
      </div>

      {/* Guidance Content - Shows when no service selected */}
      {!selectedServiceId && (
        <div className={styles.guidanceContent}>
          <div className={styles.securityDetail}>
            <p className={styles.securityDescription}>Your security detail includes:</p>
            <div className={styles.securityFeatures}>
              <div className={styles.securityFeature}>• SIA-licensed protection officer</div>
              <div className={styles.securityFeature}>• Secure vehicle with professional driver</div>
              <div className={styles.securityFeature}>• Door-to-door close protection</div>
            </div>
          </div>

          <div className={styles.requirements}>
            <div className={styles.requirement}>✓ Select your protection level below</div>
            <div className={styles.requirement}>✓ Specify journey requirements</div>
            <div className={styles.requirement}>✓ Confirm your assignment</div>
          </div>

          <div className={styles.siaCompliance}>
            All officers hold valid SIA licenses
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          {SERVICE_TIERS.map((service) => (
            <button
              key={service.id}
              className={`${styles.tab} ${activeTab === service.id ? styles.activeTab : ''} ${selectedServiceId === service.id ? styles.selectedTab : ''}`}
              onClick={() => handleTabClick(service)}
              aria-pressed={activeTab === service.id}
              data-service={service.id}
            >
              {service.icon && <span className={styles.tabIcon}>{service.icon}</span>}
              <span className={styles.tabLabel}>{service.shortName}</span>
              {service.badge && (
                <span className={styles.tabBadge}>{service.badge}</span>
              )}
              {recommendedService === service.id && (
                <span className={styles.recommendedDot} aria-label="Recommended" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Service Details */}
      <div
        ref={detailsRef}
        className={`${styles.serviceDetails} ${isDetailsEntering ? styles.entering : ''}`}
      >
        <div className={styles.serviceHeader}>
          <div className={styles.serviceName}>
            {activeService.icon && <span className={styles.serviceIcon}>{activeService.icon}</span>}
            <h3>{activeService.name}</h3>
          </div>
          <div className={styles.serviceRate}>{activeService.rate}</div>
        </div>

        <div className={styles.conversationalSection}>
          <p className={styles.tagline}>"{activeService.training}"</p>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <span className={styles.benefitIcon}>•</span>
              <span className={styles.benefitText}>
                <strong>Response:</strong> {activeService.responseTime}
              </span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitIcon}>•</span>
              <span className={styles.benefitText}>
                <strong>Vehicle:</strong> {activeService.officerLevel}{activeService.id === 'essential' ? ' for discreet journeys' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>•</span>
            <span className={styles.benefitText}>
              Threat Assessment: {activeService.threatAssessment ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>•</span>
            <span className={styles.benefitText}>
              Counter-Surveillance: {activeService.counterSurveillance ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Perfect when you need:</h4>
          <div className={styles.customerQuote}>
            <em>"{getCustomerQuote(activeService.id)}"</em>
          </div>
          <div className={styles.benefitsGrid}>
            {activeService.bestFor.map((item, index) => (
              <div key={index} className={styles.benefitItem}>
                <span className={styles.benefitIcon}>•</span>
                <span className={styles.benefitText}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Why clients choose {activeService.shortName}:</h4>
          <div className={styles.conversationalFeatures}>
            <p className={styles.featureParagraph}>
              {getServiceDescription(activeService.id)}
            </p>
            <div className={styles.keyBenefits}>
              <div className={styles.benefitsGrid}>
                {getKeyBenefits(activeService.id).map((benefit, index) => (
                  <div key={index} className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>•</span>
                    <span className={styles.benefitText}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button to Select Service */}
        <div className={styles.selectButtonContainer}>
          {selectedServiceId === activeService.id ? (
            <div className={styles.selectedIndicator}>
              <span className={styles.selectedIcon}>✓</span>
              Selected Service
            </div>
          ) : (
            <button
              className={styles.selectButton}
              onClick={() => handleTabClick(activeService)}
              type="button"
            >
              Select {activeService.shortName} Secure Transport
            </button>
          )}
        </div>
      </div>


    </div>
  );
}

export { SERVICE_TIERS };