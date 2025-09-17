import React from 'react';
import styles from './MediaCredibility.module.css';

interface MediaMention {
  outlet: string;
  title: string;
  description: string;
  url: string;
  date: string;
  logo?: string;
}

const mediaFeatures: MediaMention[] = [
  {
    outlet: 'The Mirror',
    title: 'Professional Security Services at Premier Venues',
    description: 'Featuring our discrete close protection officers providing security at exclusive locations',
    url: 'https://www.mirror.co.uk/3am/celebrity-news/louise-redknapp-spotted-mystery-man-14309794',
    date: 'March 2019'
  },
  {
    outlet: 'Evening Standard',
    title: 'VIP Protection Services in London',
    description: 'Coverage of professional security operations in the capital',
    url: '#',
    date: '2019'
  }
];

const clientTestimonials = [
  {
    text: "My high-profile case attracted unwanted attention - I needed drivers trained in threat assessment. Their evasive driving techniques and security protocols gave me confidence during a difficult period.",
    client: "Legal Counsel",
    location: "Central London"
  },
  {
    text: "Confidential client meetings require discretion and security protocols regular drivers don't have. When dealing with sensitive corporate acquisitions, you need professionals who understand the risks.",
    client: "Investment Advisor",
    location: "Canary Wharf"
  },
  {
    text: "After stalking incidents, I needed transport I could trust. These aren't just drivers - they're trained security professionals who know how to handle threatening situations.",
    client: "Corporate Executive",
    location: "Confidential"
  }
];

export function MediaCredibility() {
  return (
    <section className={styles.credibilitySection}>
      <div className={styles.sectionContent}>
        {/* Media Features */}
        <div className={styles.mediaSection}>
          <h2 className={styles.sectionTitle}>As Featured In</h2>
          <p className={styles.sectionDescription}>
            Our professional security services have been recognized by leading publications
          </p>

          <div className={styles.mediaGrid}>
            {mediaFeatures.map((feature, index) => (
              <div key={index} className={styles.mediaItem}>
                <div className={styles.mediaHeader}>
                  <div className={styles.outletInfo}>
                    <h3 className={styles.outletName}>{feature.outlet}</h3>
                    <span className={styles.mediaDate}>{feature.date}</span>
                  </div>
                </div>
                <h4 className={styles.mediaTitle}>{feature.title}</h4>
                <p className={styles.mediaDescription}>{feature.description}</p>
                <a
                  href={feature.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mediaLink}
                >
                  View Coverage →
                </a>
              </div>
            ))}
          </div>

          <div className={styles.mediaNote}>
            <span className={styles.noteIcon}>📰</span>
            <p className={styles.noteText}>
              See our team providing discrete security at exclusive venues and events across London
            </p>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className={styles.testimonialsSection}>
          <h2 className={styles.sectionTitle}>Client Testimonials</h2>
          <p className={styles.sectionDescription}>
            What our clients say about working with genuine Close Protection professionals
          </p>

          <div className={styles.testimonialsGrid}>
            {clientTestimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialContent}>
                  <div className={styles.quoteIcon}>"</div>
                  <p className={styles.testimonialText}>{testimonial.text}</p>
                </div>
                <div className={styles.testimonialFooter}>
                  <div className={styles.clientInfo}>
                    <span className={styles.clientName}>{testimonial.client}</span>
                    <span className={styles.clientLocation}>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustSection}>
          <h3 className={styles.trustTitle}>Trust & Credibility Indicators</h3>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🏛️</span>
              <h4 className={styles.trustItemTitle}>Soho House Trusted</h4>
              <p className={styles.trustItemText}>
                Providing security services to members of London's most exclusive private club
              </p>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📰</span>
              <h4 className={styles.trustItemTitle}>Media Recognition</h4>
              <p className={styles.trustItemText}>
                Featured in national publications for professional security operations
              </p>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔒</span>
              <h4 className={styles.trustItemTitle}>30+ Years Experience</h4>
              <p className={styles.trustItemText}>
                Founded by close protection specialist with three decades in private security
              </p>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>✅</span>
              <h4 className={styles.trustItemTitle}>3,741+ Safe Journeys</h4>
              <p className={styles.trustItemText}>
                Proven track record of secure transport operations completed successfully
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}