import React from 'react';
import styles from './MediaFeatures.module.css';

export function MediaFeatures() {
  return (
    <section className={styles.mediaSection}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Media & Credibility</h2>
        <p className={styles.sectionDescription}>
          Our professional standards and discrete protection services have gained recognition
          in national media while maintaining absolute client confidentiality.
        </p>

        {/* Featured In */}
        <div className={styles.featuredIn}>
          <h3 className={styles.featuredTitle}>As Featured In</h3>
          <div className={styles.mediaLogos}>
            <div className={styles.mediaLogo}>
              <span className={styles.logoText}>The Mirror</span>
              <span className={styles.logoSubtext}>National Newspaper</span>
            </div>
            <div className={styles.mediaDivider}></div>
            <div className={styles.mediaLogo}>
              <span className={styles.logoText}>Evening Standard</span>
              <span className={styles.logoSubtext}>London News</span>
            </div>
          </div>
        </div>

        {/* Media Story */}
        <div className={styles.mediaStory}>
          <div className={styles.storyCard}>
            <div className={styles.storyHeader}>
              <div className={styles.storyIcon}>📰</div>
              <div className={styles.storyInfo}>
                <h3 className={styles.storyTitle}>Professional Protection in Action</h3>
                <p className={styles.storySubtitle}>
                  Our close protection officers providing discrete security services at exclusive venues
                </p>
              </div>
            </div>

            <div className={styles.storyContent}>
              <p className={styles.storyText}>
                "Our team was featured in The Mirror for our professional approach to close protection
                at high-profile events. We maintain the highest standards of discretion while ensuring
                comprehensive security coverage."
              </p>

              <div className={styles.storyQuote}>
                <blockquote className={styles.quote}>
                  "The seamless integration of security expertise with luxury service delivery
                  sets new standards in executive protection."
                </blockquote>
                <cite className={styles.quoteAttribution}>— Security Industry Professional</cite>
              </div>
            </div>

            <div className={styles.storyFooter}>
              <a
                href="https://www.mirror.co.uk/3am/celebrity-news/louise-redknapp-spotted-mystery-man-14309794"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storyLink}
              >
                Read About Our Professional Services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Industry Recognition */}
        <div className={styles.recognition}>
          <h3 className={styles.recognitionTitle}>Industry Recognition</h3>
          <div className={styles.recognitionGrid}>
            <div className={styles.recognitionCard}>
              <div className={styles.recognitionIcon}>🏆</div>
              <h4 className={styles.recognitionLabel}>SIA Excellence</h4>
              <p className={styles.recognitionText}>
                Recognized for maintaining highest SIA licensing standards across all team members
              </p>
            </div>

            <div className={styles.recognitionCard}>
              <div className={styles.recognitionIcon}>🤝</div>
              <h4 className={styles.recognitionLabel}>Trusted Partners</h4>
              <p className={styles.recognitionText}>
                Preferred security provider for exclusive private members' clubs and venues
              </p>
            </div>

            <div className={styles.recognitionCard}>
              <div className={styles.recognitionIcon}>🎖️</div>
              <h4 className={styles.recognitionLabel}>Professional Standards</h4>
              <p className={styles.recognitionText}>
                Continuous training and development maintaining elite protection capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustIndicators}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>✅</div>
              <span className={styles.trustText}>Fully Insured & Licensed</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🔒</div>
              <span className={styles.trustText}>Strict Confidentiality Protocols</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>📋</div>
              <span className={styles.trustText}>Comprehensive Background Checks</span>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🛡️</div>
              <span className={styles.trustText}>Professional Indemnity Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}