import { useState } from 'react';
import styles from './AirportSpecialists.module.css';

export function AirportSpecialists() {
  const [expandedAirport, setExpandedAirport] = useState<string | null>(null);

  const londonAirports = [
    {
      id: 'heathrow',
      code: 'LHR',
      name: 'Heathrow',
      coverage: '24/7 coverage',
      responseTime: '10-15 minutes',
      specialties: ['Terminal specialists', 'VIP meet & greet', 'Diplomatic protection'],
      features: ['All 5 terminals', 'Fast track security', 'Aircraft side Commencement Point', 'Private lounges']
    },
    {
      id: 'gatwick',
      code: 'LGW',
      name: 'Gatwick',
      coverage: '24/7 coverage',
      responseTime: '15-20 minutes',
      specialties: ['North/South terminals', 'Executive protection', 'Celebrity transport'],
      features: ['Both terminals', 'Premium lounges', 'Aircraft transfers', 'Arrival assistance']
    },
    {
      id: 'stansted',
      code: 'STN',
      name: 'Stansted',
      coverage: 'On demand',
      responseTime: '20-30 minutes',
      specialties: ['Business aviation', 'Private jet services', 'Corporate transport'],
      features: ['Main terminal', 'Private aviation', 'Executive lounges', 'Fast clearance']
    },
    {
      id: 'luton',
      code: 'LTN',
      name: 'Luton',
      coverage: 'On demand',
      responseTime: '25-35 minutes',
      specialties: ['Charter flights', 'Business travel', 'Executive services'],
      features: ['Terminal coverage', 'Private services', 'Business lounges', 'Rapid departure']
    },
    {
      id: 'london-city',
      code: 'LCY',
      name: 'London City',
      coverage: 'On demand',
      responseTime: '15-25 minutes',
      specialties: ['Business aviation', 'Executive protection', 'Financial district'],
      features: ['Single terminal', 'Business focus', 'Canary Wharf link', 'Executive services']
    }
  ];

  const regionalAirports = [
    { code: 'MAN', name: 'Manchester', region: 'North West' },
    { code: 'BHX', name: 'Birmingham', region: 'West Midlands' },
    { code: 'BRS', name: 'Bristol', region: 'South West' },
    { code: 'LBA', name: 'Leeds Bradford', region: 'Yorkshire' },
    { code: 'NCL', name: 'Newcastle', region: 'North East' },
    { code: 'EDI', name: 'Edinburgh', region: 'Scotland' },
    { code: 'GLA', name: 'Glasgow', region: 'Scotland' },
    { code: 'CWL', name: 'Cardiff', region: 'Wales' },
    { code: 'BFS', name: 'Belfast International', region: 'Northern Ireland' },
    { code: 'LPL', name: 'Liverpool', region: 'North West' },
    { code: 'EXT', name: 'Exeter', region: 'South West' },
    { code: 'NQY', name: 'Newquay Cornwall', region: 'South West' }
  ];

  const handleAirportExpand = (airportId: string) => {
    setExpandedAirport(current => current === airportId ? null : airportId);
  };

  return (
    <section className={styles.airportsSection}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Airport Protection Services</h2>
        <p className={styles.sectionSubtitle}>
          Specialized airport security and executive transport nationwide
        </p>

        {/* London Airports - Premium Coverage */}
        <div className={styles.londonSection}>
          <h3 className={styles.subsectionTitle}>
            <span className={styles.subsectionIcon}>✈️</span>
            London Airports - Premium Coverage
          </h3>

          <div className={styles.airportsGrid}>
            {londonAirports.map((airport) => (
              <div key={airport.id} className={styles.airportCard}>
                <div className={styles.airportHeader}>
                  <div className={styles.airportInfo}>
                    <div className={styles.airportCode}>{airport.code}</div>
                    <h4 className={styles.airportName}>{airport.name}</h4>
                    <p className={styles.airportCoverage}>{airport.coverage}</p>
                  </div>
                  <button
                    className={styles.expandButton}
                    onClick={() => handleAirportExpand(airport.id)}
                  >
                    {expandedAirport === airport.id ? '−' : '+'}
                  </button>
                </div>

                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>⚡</span>
                    <span className={styles.statValue}>{airport.responseTime}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>🛡️</span>
                    <span className={styles.statValue}>SIA Level 3</span>
                  </div>
                </div>

                {expandedAirport === airport.id && (
                  <div className={styles.expandedContent}>
                    <div className={styles.specialtiesSection}>
                      <h5 className={styles.expandedTitle}>Protection Specialties:</h5>
                      <div className={styles.specialtyList}>
                        {airport.specialties.map((specialty, index) => (
                          <span key={index} className={styles.specialtyTag}>
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.featuresSection}>
                      <h5 className={styles.expandedTitle}>Terminal Services:</h5>
                      <ul className={styles.featuresList}>
                        {airport.features.map((feature, index) => (
                          <li key={index} className={styles.featureItem}>
                            <span className={styles.featureIcon}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className={styles.bookAirportButton}>
                      Request {airport.name} CPO
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Regional Airports */}
        <div className={styles.regionalSection}>
          <h3 className={styles.subsectionTitle}>
            <span className={styles.subsectionIcon}>🇬🇧</span>
            Regional Airports - Nationwide Coverage
          </h3>

          <div className={styles.regionalGrid}>
            {regionalAirports.map((airport, index) => (
              <div key={index} className={styles.regionalAirport}>
                <div className={styles.regionalCode}>{airport.code}</div>
                <div className={styles.regionalInfo}>
                  <div className={styles.regionalName}>{airport.name}</div>
                  <div className={styles.regionalRegion}>{airport.region}</div>
                </div>
                <div className={styles.regionalStatus}>
                  <span className={styles.statusIcon}>✓</span>
                  <span className={styles.statusText}>Available</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.regionalNote}>
            <p className={styles.noteText}>
              <strong>All UK airports covered</strong> with advance protection assignment.
              <br />
              Specialized teams available for private jet and corporate aviation.
            </p>
          </div>
        </div>

        {/* Airport Services Features */}
        <div className={styles.servicesSection}>
          <h3 className={styles.subsectionTitle}>
            <span className={styles.subsectionIcon}>🎯</span>
            Specialized Airport Services
          </h3>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>🎖️</span>
              <h4 className={styles.serviceTitle}>VIP Meet & Greet</h4>
              <p className={styles.serviceDescription}>
                Aircraft-side Commencement Point with fast-track clearance and lounge access
              </p>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>🛂</span>
              <h4 className={styles.serviceTitle}>Diplomatic Protection</h4>
              <p className={styles.serviceDescription}>
                Government-cleared officers for diplomatic and official travel
              </p>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>✈️</span>
              <h4 className={styles.serviceTitle}>Private Aviation</h4>
              <p className={styles.serviceDescription}>
                Specialized services for private jets and charter flights
              </p>
            </div>
            <div className={styles.serviceItem}>
              <span className={styles.serviceIcon}>🏢</span>
              <h4 className={styles.serviceTitle}>Corporate Groups</h4>
              <p className={styles.serviceDescription}>
                Multi-Principal protection for executive teams and delegations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}