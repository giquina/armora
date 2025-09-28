import React from 'react';
import styles from './SituationSelector.module.css';

export interface Situation {
  id: 'medical' | 'business' | 'event' | 'travel' | 'general';
  icon: string;
  label: string;
  description: string;
  price: string;
  responseTime: string;
  duration: string;
  scenarios: string;
  cpoActions: string[];
  realExample: string;
  idealFor: string;
  recommended: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
}

const SITUATIONS: Situation[] = [
  {
    id: 'medical',
    icon: '🏥',
    label: 'Medical',
    description: 'Hospital visits, clinic appointments',
    price: 'from £50/hr',
    responseTime: '2-4 min',
    duration: '2-3 hours',
    scenarios: 'Hospital appointments, clinics, procedures, specialist consultations',
    cpoActions: [
      'Provides secure vehicle transport to appointment',
      'Meets you at entrance and handles check-in',
      'Remains in waiting areas for your security',
      'Escorts between departments and consultations',
      'Ensures safe journey home in secure vehicle'
    ],
    realExample: 'Client needed discrete protection AND secure transport from Chelsea to Harley Street consultation and return journey',
    idealFor: 'Vulnerable patients, elderly, those attending sensitive appointments',
    recommended: 'essential'
  },
  {
    id: 'business',
    icon: '💼',
    label: 'Business',
    description: 'Meetings, negotiations, corporate events',
    price: 'from £75/hr',
    responseTime: '3-5 min',
    duration: '2-6 hours',
    scenarios: 'Corporate meetings, negotiations, conferences, business dinners',
    cpoActions: [
      'Secure vehicle transport to business location',
      'Advance venue security assessment',
      'Discrete presence during meetings',
      'Secure handling of documents/devices',
      'Protected transit to next location in secure vehicle'
    ],
    realExample: 'CEO required protection and secure transport during hostile takeover negotiations from Mayfair to Canary Wharf',
    idealFor: 'Executives, high-net-worth individuals, sensitive business dealings',
    recommended: 'executive'
  },
  {
    id: 'event',
    icon: '🎭',
    label: 'Event',
    description: 'Concerts, theaters, public gatherings',
    price: 'from £65/hr',
    responseTime: '5-8 min',
    duration: '3-5 hours',
    scenarios: 'Premieres, galas, sporting events, concerts, award ceremonies',
    cpoActions: [
      'Secure vehicle transport to event venue',
      'Crowd management and navigation',
      'VIP entrance coordination',
      'Continuous proximity protection throughout event',
      'Protected departure and secure vehicle exit'
    ],
    realExample: 'TV personality required secure transport and protection for BAFTA awards at Royal Festival Hall',
    idealFor: 'Celebrities, public figures, VIP event attendees',
    recommended: 'shadow'
  },
  {
    id: 'travel',
    icon: '✈️',
    label: 'Travel',
    description: 'Airport transfers, station pickups',
    price: 'from £55/hr',
    responseTime: '4-6 min',
    duration: '2-3 hours',
    scenarios: 'Airport transfers, train stations, hotel check-ins, port arrivals',
    cpoActions: [
      'Secure vehicle collection from terminal/station',
      'Luggage monitoring and security assistance',
      'Fast-track assistance where possible',
      'Route planning and threat assessment during transport',
      'Door-to-door protection service in secure vehicle'
    ],
    realExample: 'International executive needed secure vehicle transport and protection from Heathrow to Mayfair hotel',
    idealFor: 'Business travelers, families, international visitors',
    recommended: 'client-vehicle'
  },
  {
    id: 'general',
    icon: '🛡️',
    label: 'General',
    description: 'Shopping, errands, daily activities',
    price: 'from £50/hr',
    responseTime: '2-4 min',
    duration: '2-4 hours',
    scenarios: 'Shopping trips, restaurant visits, errands, daily activities',
    cpoActions: [
      'Secure vehicle transport to destination',
      'Personal escort throughout activities',
      'Carries shopping/belongings if needed',
      'Monitors surroundings continuously',
      'Protected transport back to residence in secure vehicle'
    ],
    realExample: 'Client required secure transport and protection for Bond Street luxury shopping with return to Kensington',
    idealFor: 'Daily activities, personal errands, anyone needing peace of mind',
    recommended: 'essential'
  }
];

interface SituationSelectorProps {
  selectedSituation: string | null;
  onSituationSelect: (situation: Situation) => void;
}

export function SituationSelector({ selectedSituation, onSituationSelect }: SituationSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Where do you need protection and secure transport?</h2>
        <p className={styles.instruction}>Select your journey type to see recommended protection level</p>
      </div>

      <div className={styles.situationsGrid}>
        {SITUATIONS.map((situation) => {
          const isSelected = selectedSituation === situation.id;

          return (
            <div
              key={situation.id}
              className={`${styles.situationCard} ${isSelected ? styles.selected : ''}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.icon}>{situation.icon}</span>
                <div className={styles.titlePrice}>
                  <h3 className={styles.label}>{situation.label}</h3>
                  <span className={styles.price}>{situation.price}</span>
                </div>
                {isSelected && <span className={styles.checkmark}>✓</span>}
              </div>

              <div className={styles.responseInfo}>
                <span className={styles.responseTime}>Response: {situation.responseTime}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.duration}>Typical: {situation.duration}</span>
              </div>

              <div className={styles.forSection}>
                <strong>For:</strong> {situation.scenarios}
              </div>

              <div className={styles.actionsSection}>
                <div className={styles.actionsTitle}>What your CPO does:</div>
                <ul className={styles.actionsList}>
                  {situation.cpoActions.map((action, index) => (
                    <li key={index} className={styles.actionItem}>• {action}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.exampleSection}>
                <strong>Real example:</strong> {situation.realExample}
              </div>

              <div className={styles.divider}></div>

              <div className={styles.footer}>
                <div className={styles.idealFor}>
                  <strong>Ideal for:</strong> {situation.idealFor}
                </div>
                <div className={styles.badges}>
                  <div className={styles.siaLicensed}>✓ SIA Licensed</div>
                  <div className={styles.transportIncluded}>🚗 Secure Vehicle Included</div>
                </div>
              </div>

              <button
                className={`${styles.selectButton} ${isSelected ? styles.selectButtonSelected : ''}`}
                onClick={() => onSituationSelect(situation)}
                aria-label={`Select ${situation.label} protection service`}
              >
                {isSelected ? 'Selected ✓' : 'Select This Protection'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SITUATIONS };