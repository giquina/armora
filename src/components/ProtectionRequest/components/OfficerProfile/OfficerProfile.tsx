import styles from './OfficerProfile.module.css';

interface OfficerDetails {
  serviceLevel: string;
  equipment: string[];
  qualifications: string[];
  arrivalProcess: {
    step: string;
    description: string;
  }[];
}

const OFFICER_PROFILES: Record<string, OfficerDetails> = {
  essential: {
    serviceLevel: 'Essential Protection Officer',
    equipment: [
      'Photo ID badge & reference number',
      'Professional black attire',
      'Radio communication',
      'First aid kit',
      'Emergency contact device'
    ],
    qualifications: [
      'SIA Level 2 Licensed',
      '2+ years experience',
      'Background verified',
      'First aid certified'
    ],
    arrivalProcess: [
      { step: '1', description: 'Officer presents ID' },
      { step: '2', description: 'You verify reference number' },
      { step: '3', description: 'Confirm protection duration' },
      { step: '4', description: 'Exchange contact numbers' },
      { step: '5', description: 'Begin protection service' }
    ]
  },
  executive: {
    serviceLevel: 'Executive Protection Officer',
    equipment: [
      'Photo ID badge & reference number',
      'Professional suit attire',
      'Encrypted radio system',
      'Advanced first aid kit',
      'Threat detection equipment',
      'Secure communication device'
    ],
    qualifications: [
      'SIA Level 3 Licensed',
      '5+ years experience',
      'Ex-police/military background',
      'Advanced first aid certified',
      'Corporate protection trained'
    ],
    arrivalProcess: [
      { step: '1', description: 'Officer presents credentials' },
      { step: '2', description: 'Security briefing provided' },
      { step: '3', description: 'Venue assessment conducted' },
      { step: '4', description: 'Secure communications established' },
      { step: '5', description: 'Protection detail commences' }
    ]
  },
  shadow: {
    serviceLevel: 'Shadow Protocol Specialist',
    equipment: [
      'Covert ID & authentication',
      'Tactical civilian attire',
      'Military-grade comms',
      'Combat medical kit',
      'Counter-surveillance tools',
      'Emergency extraction gear'
    ],
    qualifications: [
      'Military/Special Forces background',
      '10+ years experience',
      'Top secret clearance',
      'Combat medical trained',
      'Counter-terrorism certified'
    ],
    arrivalProcess: [
      { step: '1', description: 'Covert authentication' },
      { step: '2', description: 'Threat assessment briefing' },
      { step: '3', description: 'Perimeter security check' },
      { step: '4', description: 'Establish extraction routes' },
      { step: '5', description: 'Begin shadow protection' }
    ]
  },
  'client-vehicle': {
    serviceLevel: 'Security Driver',
    equipment: [
      'Photo ID & driving credentials',
      'Professional driver attire',
      'Vehicle communication system',
      'Emergency roadside kit',
      'Navigation & traffic monitoring'
    ],
    qualifications: [
      'Security driving certified',
      '3+ years experience',
      'Advanced driving qualified',
      'Vehicle security trained',
      'Route planning expertise'
    ],
    arrivalProcess: [
      { step: '1', description: 'Driver presents credentials' },
      { step: '2', description: 'Vehicle security check' },
      { step: '3', description: 'Route planning discussion' },
      { step: '4', description: 'Safety features review' },
      { step: '5', description: 'Secure transit begins' }
    ]
  }
};

interface OfficerProfileProps {
  selectedService: string | null;
}

export function OfficerProfile({ selectedService }: OfficerProfileProps) {
  const profile = OFFICER_PROFILES[selectedService || 'essential'] || OFFICER_PROFILES.essential;

  const getEquipmentIcon = (item: string) => {
    const t = item.toLowerCase();
    if (t.includes('id') || t.includes('badge') || t.includes('reference')) return '🪪';
    if (t.includes('suit') || t.includes('attire') || t.includes('professional')) return '🕴️';
    if (t.includes('radio') || t.includes('comms') || t.includes('communication')) return '📻';
    if (t.includes('first aid')) return '⛑️';
    if (t.includes('threat') || t.includes('detection') || t.includes('counter')) return '🛰️';
    if (t.includes('secure') || t.includes('encrypted')) return '🔒';
    if (t.includes('emergency')) return '🚨';
    if (t.includes('navigation')) return '🧭';
    if (t.includes('driver') || t.includes('vehicle')) return '🚗';
    return '🛡️';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Protection Officer</h2>
        <p className={styles.subtitle}>{profile.serviceLevel}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionRow}>
          {/* Equipment Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Will Arrive With:</h3>
            <ul className={styles.equipmentList}>
              {profile.equipment.map((item, index) => (
                <li key={index} className={styles.equipmentItem}>
                  <span className={styles.equipmentIcon}>{getEquipmentIcon(item)}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Qualifications Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Qualifications:</h3>
            <div className={styles.qualificationGrid}>
              {profile.qualifications.map((qual, index) => (
                <div key={index} className={styles.qualificationItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span className={styles.qualificationText}>{qual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrival Process Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>What Happens on Arrival:</h3>
          <div className={styles.processSteps}>
            {profile.arrivalProcess.map((step, index) => (
              <div key={index} className={styles.processStep}>
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepDescription}>{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Notice */}
        <div className={styles.verificationNotice}>
          <div className={styles.noticeIcon}>🔒</div>
          <div className={styles.noticeContent}>
            <div className={styles.noticeTitle}>ID Verification Required</div>
            <div className={styles.noticeText}>
              All officers carry photo ID and a unique reference number.
              Always verify these before beginning service.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}