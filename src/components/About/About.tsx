import React, { useState } from 'react';
import { SecurityProtocols } from './SecurityProtocols';
import { TeamExpertise } from './TeamExpertise';
import { MediaCredibility } from './MediaCredibility';
import styles from './About.module.css';

interface AboutProps {
  onBack?: () => void;
}

export function About({ onBack }: AboutProps) {
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      {/* Header with Back Button */}
      <header className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>About Armora Security</h1>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            ELITE SECURITY MEETS LUXURY TRANSPORT
          </h2>
          <p className={styles.heroSubtitle}>
            Over 30 Years of Private Security Excellence
          </p>
          <div className={styles.heroBadge}>
            <span className={styles.badgeIcon}>🛡️</span>
            <span className={styles.badgeText}>
              Every Driver is a SIA-Licensed Close Protection Officer
            </span>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className={styles.storySection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <div className={styles.storyContent}>
            <p className={styles.storyText}>
              Founded by a close protection specialist with over three decades in private security,
              Armora was born from recognizing a critical gap in the market - the need for genuine
              security expertise in premium transport.
            </p>
            <p className={styles.storyText}>
              After years protecting high-net-worth individuals at exclusive venues like
              <span className={styles.highlight}> Soho House Private Members' Club</span>, and being
              featured in national media for professional security services, our founder understood
              that VIP protection requires more than premium vehicles - it demands the seamless fusion
              of close protection and comprehensive security services.
            </p>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className={styles.differenceSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Why Armora Is Different</h2>
          <div className={styles.differenceGrid}>
            <div className={styles.differenceItem}>
              <span className={styles.differenceIcon}>👤</span>
              <h3 className={styles.differenceTitle}>100% CP Officers</h3>
              <p className={styles.differenceText}>
                EVERY officer is SIA certified (Level 2-3)
              </p>
            </div>
            <div className={styles.differenceItem}>
              <span className={styles.differenceIcon}>🎖️</span>
              <h3 className={styles.differenceTitle}>No "Basic" Drivers</h3>
              <p className={styles.differenceText}>
                All are Close Protection trained specialists
              </p>
            </div>
            <div className={styles.differenceItem}>
              <span className={styles.differenceIcon}>📰</span>
              <h3 className={styles.differenceTitle}>Media Featured</h3>
              <p className={styles.differenceText}>
                The Mirror and Evening Standard coverage
              </p>
            </div>
            <div className={styles.differenceItem}>
              <span className={styles.differenceIcon}>🏛️</span>
              <h3 className={styles.differenceTitle}>Elite Venues</h3>
              <p className={styles.differenceText}>
                Trusted by Soho House members
              </p>
            </div>
            <div className={styles.differenceItem}>
              <span className={styles.differenceIcon}>✅</span>
              <h3 className={styles.differenceTitle}>Proven Track Record</h3>
              <p className={styles.differenceText}>
                3,741+ secure journeys completed
              </p>
            </div>
            <div className={styles.differenceItem}>
              <span className={styles.differenceIcon}>🔒</span>
              <h3 className={styles.differenceTitle}>Total Discretion</h3>
              <p className={styles.differenceText}>
                Strict NDAs and privacy protocols
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Protocols Component */}
      <SecurityProtocols
        expandedProtocol={expandedProtocol}
        onProtocolToggle={setExpandedProtocol}
      />

      {/* Team Expertise Component */}
      <TeamExpertise />

      {/* Media Credibility Component */}
      <MediaCredibility />

      {/* Contact CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready for Professional Protection?</h2>
          <p className={styles.ctaSubtitle}>
            Experience the difference of genuine Close Protection transport
          </p>
          <div className={styles.ctaButtons}>
            <button
              className={styles.primaryButton}
              onClick={() => window.location.href = '/'}
            >
              Book Protection Services
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