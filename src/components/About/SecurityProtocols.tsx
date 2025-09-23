import React from 'react';
import styles from './SecurityProtocols.module.css';

interface Protocol {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

const securityProtocols: Protocol[] = [
  {
    id: 'route-planning',
    title: 'Advance Route Planning',
    description: 'Multiple route options prepared for every journey',
    icon: '🗺️',
    details: [
      'Primary and alternative routes mapped in advance',
      'Real-time traffic and road condition monitoring',
      'Security checkpoint locations identified',
      'Local service proximity assessments',
      'Venue-specific approach strategies'
    ]
  },
  {
    id: 'threat-assessment',
    title: 'Threat Assessment',
    description: 'Real-time evaluation of potential risks',
    icon: '🎯',
    details: [
      'Pre-journey intelligence gathering',
      'Area-specific risk analysis',
      'Weather and environmental factors',
      'Event-related security considerations',
      'Ongoing threat level monitoring'
    ]
  },
  {
    id: 'counter-surveillance',
    title: 'Counter-Surveillance',
    description: 'Techniques to identify and avoid unwanted attention',
    icon: '👁️',
    details: [
      'Surveillance detection procedures',
      'Anti-surveillance driving techniques',
      'Variable timing and routing',
      'Communication security protocols',
      'Digital footprint minimization'
    ]
  },
  {
    id: 'secure-communications',
    title: 'Secure Communications',
    description: 'Encrypted channels for client privacy',
    icon: '📡',
    details: [
      'End-to-end encrypted messaging',
      'Secure voice communication systems',
      'Security alert protocols',
      'Client privacy protection',
      'Operation coordination channels'
    ]
  },
  {
    id: 'incident-response',
    title: 'Incident Response',
    description: 'Medical training and crisis management protocols',
    icon: '🚨',
    details: [
      'First aid and medical incident response',
      'Evacuation procedures and safe havens',
      'Security services coordination',
      'Crisis communication protocols',
      'Incident documentation and reporting'
    ]
  },
  {
    id: 'defensive-driving',
    title: 'Defensive Driving',
    description: 'Evasive maneuvers and protective positioning',
    icon: '🚗',
    details: [
      'Advanced defensive driving techniques',
      'Evasive maneuver training',
      'Protective convoy positioning',
      'High-speed security driving',
      'Vehicle inspection and security checks'
    ]
  },
  {
    id: 'venue-liaison',
    title: 'Venue Security Liaison',
    description: 'Coordination with secureDestination security teams',
    icon: '🏢',
    details: [
      'Pre-arrival security coordination',
      'Venue security team communication',
      'Access control procedures',
      'Departure coordination protocols',
      'Security handover procedures'
    ]
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality Protocols',
    description: 'Strict NDAs and privacy measures',
    icon: '🤫',
    details: [
      'Comprehensive non-disclosure agreements',
      'Client information protection',
      'Conversation confidentiality',
      'Digital data security',
      'Staff vetting and security clearance'
    ]
  }
];

interface SecurityProtocolsProps {
  expandedProtocol: string | null;
  onProtocolToggle: (protocolId: string | null) => void;
}

export function SecurityProtocols({ expandedProtocol, onProtocolToggle }: SecurityProtocolsProps) {
  const toggleProtocol = (protocolId: string) => {
    onProtocolToggle(expandedProtocol === protocolId ? null : protocolId);
  };

  return (
    <section className={styles.protocolsSection}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Security Protocols We Implement</h2>
        <p className={styles.sectionDescription}>
          Every journey is protected by comprehensive security measures developed through
          three decades of close protection experience.
        </p>

        <div className={styles.protocolsGrid}>
          {securityProtocols.map((protocol) => (
            <div
              key={protocol.id}
              className={`${styles.protocolCard} ${
                expandedProtocol === protocol.id ? styles.expanded : ''
              }`}
            >
              <div
                className={styles.protocolHeader}
                onClick={() => toggleProtocol(protocol.id)}
              >
                <div className={styles.protocolIcon}>{protocol.icon}</div>
                <div className={styles.protocolInfo}>
                  <h3 className={styles.protocolTitle}>{protocol.title}</h3>
                  <p className={styles.protocolDescription}>{protocol.description}</p>
                </div>
                <div className={styles.expandIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={expandedProtocol === protocol.id ? styles.rotated : ''}
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>

              {expandedProtocol === protocol.id && (
                <div className={styles.protocolDetails}>
                  <ul className={styles.detailsList}>
                    {protocol.details.map((detail, index) => (
                      <li key={index} className={styles.detailItem}>
                        <span className={styles.detailBullet}>•</span>
                        <span className={styles.detailText}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.protocolsFooter}>
          <div className={styles.footerContent}>
            <h3 className={styles.footerTitle}>Comprehensive Protection</h3>
            <p className={styles.footerText}>
              Our security protocols are continuously updated to address emerging threats
              and incorporate the latest close protection techniques. Every team member
              receives ongoing training to maintain the highest standards of professional security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}