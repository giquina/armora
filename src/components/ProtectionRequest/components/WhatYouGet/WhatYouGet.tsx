import styles from './WhatYouGet.module.css';

interface Timeline {
  time: string;
  action: string;
}

interface ProtectionPlan {
  situation: string;
  service: string;
  timeline: Timeline[];
  included: string[];
  example: {
    title: string;
    description: string;
  };
}

const PROTECTION_PLANS: Record<string, Record<string, ProtectionPlan>> = {
  medical: {
    essential: {
      situation: 'Medical Appointment',
      service: 'Essential Protection',
      timeline: [
        { time: '2:00pm', action: 'Book protection' },
        { time: '2:03pm', action: 'CPO dispatched' },
        { time: '2:05pm', action: 'CPO arrives, shows ID' },
        { time: '2:10pm', action: 'Escort to appointment' },
        { time: '2:15pm', action: 'CPO waits in lobby' },
        { time: '3:15pm', action: 'Escort back to vehicle' },
        { time: '4:00pm', action: 'Service complete' }
      ],
      included: [
        'Personal escort service',
        'Waiting during appointment',
        'Safe return to vehicle',
        'Emergency contact available',
        'Basic security awareness'
      ],
      example: {
        title: 'Real Example',
        description: 'Principal attended Harley Street consultation. CPO provided discrete lobby presence, maintained visual contact with exits, escorted to parking after 90-minute appointment.'
      }
    }
  },
  business: {
    executive: {
      situation: 'Business Meeting',
      service: 'Executive Shield',
      timeline: [
        { time: '2:00pm', action: 'Book protection' },
        { time: '2:03pm', action: 'CPO dispatched' },
        { time: '2:05pm', action: 'CPO arrives, shows ID' },
        { time: '2:10pm', action: 'Venue security assessment' },
        { time: '2:15pm', action: 'Meeting begins (CPO positioned)' },
        { time: '4:15pm', action: 'Escort to next location' },
        { time: '4:15pm', action: 'Service complete' }
      ],
      included: [
        'Pre-arrival venue check',
        'Discrete positioning during meeting',
        'Threat monitoring',
        'Emergency evacuation planning',
        'Secure escort to/from venue',
        'Direct officer contact number'
      ],
      example: {
        title: 'Real Example',
        description: 'Executive visited client office in Canary Wharf. CPO conducted lobby assessment, maintained visual contact during 2-hour meeting, coordinated with building security, escorted to parking.'
      }
    }
  },
  event: {
    shadow: {
      situation: 'Public Event',
      service: 'Shadow Protocol',
      timeline: [
        { time: '6:00pm', action: 'Book protection' },
        { time: '6:05pm', action: 'Elite CPO dispatched' },
        { time: '6:10pm', action: 'CPO arrives, security brief' },
        { time: '6:15pm', action: 'Venue reconnaissance' },
        { time: '6:30pm', action: 'Secure entry to venue' },
        { time: '7:00pm', action: 'Continuous proximity protection' },
        { time: '10:00pm', action: 'Secure exit and departure' }
      ],
      included: [
        'Advanced threat assessment',
        'Counter-surveillance measures',
        'Crowd navigation expertise',
        'VIP access coordination',
        'Continuous close protection',
        'Emergency extraction capability'
      ],
      example: {
        title: 'Real Example',
        description: 'VIP attended West End premiere. Shadow Protocol officer provided covert protection, managed crowd interactions, coordinated with venue security, ensured safe transit through 500+ attendees.'
      }
    }
  },
  travel: {
    'client-vehicle': {
      situation: 'Airport Transfer',
      service: 'Client Vehicle Service',
      timeline: [
        { time: '4:00am', action: 'Book protection' },
        { time: '4:04am', action: 'Security driver dispatched' },
        { time: '4:08am', action: 'Driver arrives at residence' },
        { time: '4:10am', action: 'Vehicle security check' },
        { time: '4:15am', action: 'Secure transit begins' },
        { time: '5:30am', action: 'Airport terminal arrival' },
        { time: '5:35am', action: 'Luggage assistance & escort' }
      ],
      included: [
        'Your vehicle used',
        'Security driving techniques',
        'Route planning & monitoring',
        'Luggage handling',
        'Terminal escort service',
        'No mileage charges'
      ],
      example: {
        title: 'Real Example',
        description: 'Early morning Heathrow transfer in client\'s Range Rover. Security driver conducted vehicle check, selected secure route, assisted with check-in, ensured safe terminal entry.'
      }
    }
  },
  general: {
    essential: {
      situation: 'Shopping & Errands',
      service: 'Essential Protection',
      timeline: [
        { time: '10:00am', action: 'Book protection' },
        { time: '10:03am', action: 'CPO dispatched' },
        { time: '10:05am', action: 'CPO arrives, shows ID' },
        { time: '10:10am', action: 'Begin accompanied shopping' },
        { time: '11:30am', action: 'Multiple location escorts' },
        { time: '12:00pm', action: 'Return to residence' },
        { time: '12:05pm', action: 'Service complete' }
      ],
      included: [
        'Personal accompaniment',
        'Package carrying assistance',
        'Area security monitoring',
        'Discrete protection presence',
        'Multiple stop capability'
      ],
      example: {
        title: 'Real Example',
        description: 'Bond Street shopping with stops at Selfridges, Harrods, and private galleries. CPO managed packages, monitored surroundings, provided discrete but visible security presence.'
      }
    }
  }
};

interface WhatYouGetProps {
  situation: string | null;
  service: string | null;
}

export function WhatYouGet({ situation, service }: WhatYouGetProps) {
  // Default plan if no selection
  const defaultPlan = PROTECTION_PLANS.general.essential;

  // Get the appropriate plan based on selections
  const plan = (situation && service && PROTECTION_PLANS[situation]?.[service]) || defaultPlan;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Protection Plan</h2>
        <div className={styles.subtitle}>
          {plan.situation} with {plan.service}
        </div>
      </div>

      <div className={styles.content}>
        {/* Timeline Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Timeline</h3>
          <div className={styles.timeline}>
            {plan.timeline.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineTime}>{item.time}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineAction}>{item.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>What's Included</h3>
          <ul className={styles.includedList}>
            {plan.included.map((item, index) => (
              <li key={index} className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Real Example Section */}
        <div className={styles.exampleSection}>
          <h3 className={styles.exampleTitle}>{plan.example.title}</h3>
          <p className={styles.exampleText}>{plan.example.description}</p>
        </div>
      </div>
    </div>
  );
}