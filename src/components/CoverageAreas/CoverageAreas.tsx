import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { AirportSpecialists } from './AirportSpecialists';
import { PopularRoutes } from './PopularRoutes';
import { RegionalMessaging } from './RegionalMessaging';
import styles from './CoverageAreas.module.css';

interface CoverageAreasProps {
  onBack?: () => void;
}

export function CoverageAreas({ onBack }: CoverageAreasProps) {
  const { navigateToView } = useApp();
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Detect user location for regional messaging
  useEffect(() => {
    // Simple location detection - in production, would use IP geolocation or GPS
    const detectLocation = () => {
      // Mock location detection based on time or other factors
      const locations = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol'];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      setUserLocation(randomLocation);
    };

    detectLocation();
  }, []);

  const handleAreaExpand = (areaId: string) => {
    setExpandedArea(current => current === areaId ? null : areaId);
  };

  const handleBookProtection = () => {
    navigateToView('protection-request');
  };

  const primaryAreas = [
    {
      id: 'greater-london',
      name: 'Greater London',
      subtitle: 'M25 Coverage Zone',
      description: 'Same-day protection services available',
      features: [
        '24/7 rapid response',
        'All 32 London boroughs',
        'Central London specialists',
        'Airport transfer hub',
        'Corporate protection teams'
      ],
      responseTime: '10-15 minutes',
      coverage: '100% within M25',
      specialties: ['Executive Protection', 'Diplomatic Security', 'Celebrity Transport']
    },
    {
      id: 'manchester',
      name: 'Manchester & Greater Manchester',
      subtitle: 'Northern England Hub',
      description: 'Full protection services across Greater Manchester',
      features: [
        'City centre specialists',
        'Airport Manchester coverage',
        'Corporate district teams',
        'Event security available',
        'Cheshire connections'
      ],
      responseTime: '15-20 minutes',
      coverage: '10 Greater Manchester boroughs',
      specialties: ['Business Protection', 'Event Security', 'Airport Transfers']
    },
    {
      id: 'birmingham',
      name: 'Birmingham & West Midlands',
      subtitle: 'Central England Operations',
      description: 'Comprehensive security across West Midlands',
      features: [
        'Second city specialists',
        'Industrial area coverage',
        'Birmingham Airport hub',
        'Medical transport',
        'Corporate headquarters'
      ],
      responseTime: '15-25 minutes',
      coverage: 'West Midlands metropolitan area',
      specialties: ['Corporate Security', 'Medical Transport', 'Industrial Protection']
    },
    {
      id: 'liverpool',
      name: 'Liverpool & Merseyside',
      subtitle: 'North West Coverage',
      description: 'Professional protection across Merseyside',
      features: [
        'Port city specialists',
        'Cultural district teams',
        'John Lennon Airport',
        'Maritime security',
        'Entertainment venues'
      ],
      responseTime: '15-25 minutes',
      coverage: 'Merseyside metropolitan area',
      specialties: ['Entertainment Security', 'Maritime Protection', 'Cultural Events']
    },
    {
      id: 'bristol',
      name: 'Bristol & South West',
      subtitle: 'South West Operations',
      description: 'Premium protection for South West England',
      features: [
        'Tech corridor coverage',
        'Bristol Airport specialists',
        'Rural estate protection',
        'Coastal security',
        'University area teams'
      ],
      responseTime: '20-30 minutes',
      coverage: 'Bristol and surrounding areas',
      specialties: ['Tech Executive Protection', 'Estate Security', 'University Safety']
    }
  ];

  const extendedCoverage = [
    'All England & Wales locations',
    'Scotland (special arrangements)',
    'Airport transfers nationwide',
    'Event security anywhere in UK',
    'Corporate protection tours',
    'Holiday home security',
    'Wedding protection services',
    'Festival and concert security'
  ];

  return (
    <div className={styles.container}>
      {/* Header with Back Button */}
      <header className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>Armora Nationwide Coverage</h1>
      </header>

      {/* Regional Messaging Component */}
      <RegionalMessaging userLocation={userLocation} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            PROFESSIONAL PROTECTION ACROSS THE UK
          </h2>
          <p className={styles.heroSubtitle}>
            SIA-Licensed Close Protection Officers Available Nationwide
          </p>
          <div className={styles.heroBadge}>
            <span className={styles.badgeIcon}>🇬🇧</span>
            <span className={styles.badgeText}>
              Covering All Major UK Cities and Regions
            </span>
          </div>
        </div>
      </section>

      {/* Primary Operations Section */}
      <section className={styles.primarySection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Primary Operations - Same Day Service</h2>
          <p className={styles.sectionSubtitle}>
            Rapid response protection available in our core coverage areas
          </p>

          <div className={styles.areasGrid}>
            {primaryAreas.map((area) => (
              <div key={area.id} className={styles.areaCard}>
                <div className={styles.areaHeader}>
                  <div className={styles.areaInfo}>
                    <h3 className={styles.areaName}>{area.name}</h3>
                    <p className={styles.areaSubtitle}>{area.subtitle}</p>
                    <p className={styles.areaDescription}>{area.description}</p>
                  </div>
                  <button
                    className={styles.expandButton}
                    onClick={() => handleAreaExpand(area.id)}
                  >
                    {expandedArea === area.id ? '−' : '+'}
                  </button>
                </div>

                <div className={styles.areaStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>⚡</span>
                    <span className={styles.statLabel}>Response</span>
                    <span className={styles.statValue}>{area.responseTime}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>📍</span>
                    <span className={styles.statLabel}>Coverage</span>
                    <span className={styles.statValue}>{area.coverage}</span>
                  </div>
                </div>

                {expandedArea === area.id && (
                  <div className={styles.expandedContent}>
                    <div className={styles.featuresList}>
                      <h4 className={styles.featuresTitle}>Service Features:</h4>
                      <ul className={styles.features}>
                        {area.features.map((feature, index) => (
                          <li key={index} className={styles.feature}>
                            <span className={styles.featureIcon}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.specialtiesList}>
                      <h4 className={styles.specialtiesTitle}>Protection Specialties:</h4>
                      <div className={styles.specialtyTags}>
                        {area.specialties.map((specialty, index) => (
                          <span key={index} className={styles.specialtyTag}>
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      className={styles.bookButton}
                      onClick={handleBookProtection}
                    >
                      Request CPO in {area.name.split('&')[0].trim()}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Coverage Section */}
      <section className={styles.extendedSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Extended Coverage - Advanced Assignment</h2>
          <p className={styles.sectionSubtitle}>
            Professional protection services available with advance notice
          </p>

          <div className={styles.extendedGrid}>
            {extendedCoverage.map((service, index) => (
              <div key={index} className={styles.extendedItem}>
                <span className={styles.extendedIcon}>🛡️</span>
                <span className={styles.extendedText}>{service}</span>
              </div>
            ))}
          </div>

          <div className={styles.extendedNote}>
            <p className={styles.noteText}>
              <strong>Not sure if we cover your area?</strong>
              <br />
              Contact our operations center for confirmation and special arrangements.
            </p>
            <div className={styles.noteButtons}>
              <button
                className={styles.contactButton}
                onClick={() => window.location.href = 'tel:+442071234567'}
              >
                Call Operations: 020 7123 4567
              </button>
              <button
                className={styles.quoteButton}
                onClick={handleBookProtection}
              >
                Request Coverage Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Airport Specialists Component */}
      <AirportSpecialists />

      {/* Popular Routes Component */}
      <PopularRoutes />

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready for Professional Protection?</h2>
          <p className={styles.ctaSubtitle}>
            Experience nationwide security coverage with SIA-licensed officers
          </p>
          <div className={styles.ctaButtons}>
            <button
              className={styles.primaryButton}
              onClick={handleBookProtection}
            >
              Request CPO Services
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => window.location.href = 'tel:+442071234567'}
            >
              Call Operations Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}