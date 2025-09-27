import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* MAIN FOOTER SECTION */}
      <div className={styles.mainFooter}>
        <div className={styles.footerContainer}>
          {/* TOP SECTION - 5 Column Layout */}
          <div className={styles.footerColumns}>
            {/* Column 1 - ARMORA SECURITY */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>ARMORA SECURITY</h3>
              <div className={styles.contactBlock}>
                <div className={styles.hotline}>
                  <span className={styles.phoneIcon}>📞</span>
                  <div>
                    <div className={styles.hotlineLabel}>24/7 Protection Hotline</div>
                    <div className={styles.hotlineNumber}>020 7123 4567</div>
                    <div className={styles.hotlineNote}>Available for immediate assistance</div>
                  </div>
                </div>
                <div className={styles.emails}>
                  <a href="mailto:request protection@armora.security" className={styles.emailLink}>
                    request protection@armora.security
                  </a>
                  <a href="mailto:corporate@armora.security" className={styles.emailLink}>
                    corporate@armora.security
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2 - SERVICES */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>SERVICES</h3>
              <ul className={styles.linkList}>
                <li><a href="#essential" className={styles.footerLink}>Essential Protection</a></li>
                <li><a href="#executive" className={styles.footerLink}>Executive Protection</a></li>
                <li><a href="#shadow" className={styles.footerLink}>Shadow Protection</a></li>
                <li><a href="#corporate" className={styles.footerLink}>Corporate Security</a></li>
                <li><a href="#event" className={styles.footerLink}>Event Protection</a></li>
              </ul>
            </div>

            {/* Column 3 - COMPANY */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>COMPANY</h3>
              <ul className={styles.linkList}>
                <li><a href="#about" className={styles.footerLink}>About Us</a></li>
                <li><a href="#careers" className={styles.footerLink}>Careers</a></li>
                <li><a href="#press" className={styles.footerLink}>Press</a></li>
                <li><a href="#partners" className={styles.footerLink}>Partners</a></li>
                <li><a href="#blog" className={styles.footerLink}>Blog</a></li>
              </ul>
            </div>

            {/* Column 4 - COVERAGE */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>COVERAGE</h3>
              <ul className={styles.locationList}>
                <li>London • Manchester</li>
                <li>Birmingham • Liverpool</li>
                <li>Leeds • Bristol</li>
                <li>Newcastle • Sheffield</li>
                <li className={styles.coverageNote}>+ All England & Wales</li>
              </ul>
            </div>

            {/* Column 5 - CONNECT */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>CONNECT</h3>
              <div className={styles.socialLinks}>
                <a href="https://linkedin.com" className={styles.socialIcon} aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="8" y1="11" x2="8" y2="17"/>
                    <line x1="8" y1="8" x2="8" y2="8.01"/>
                  </svg>
                </a>
                <a href="https://twitter.com" className={styles.socialIcon} aria-label="Twitter/X">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" className={styles.socialIcon} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://youtube.com" className={styles.socialIcon} aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className={styles.footerBottom}>
            {/* Legal Links */}
            <div className={styles.legalLinks}>
              <a href="#terms" className={styles.legalLink}>Terms of Service</a>
              <span className={styles.divider}>|</span>
              <a href="#privacy" className={styles.legalLink}>Privacy Policy</a>
              <span className={styles.divider}>|</span>
              <a href="#sia" className={styles.legalLink}>SIA Compliance</a>
              <span className={styles.divider}>|</span>
              <a href="#insurance" className={styles.legalLink}>Insurance</a>
              <span className={styles.divider}>|</span>
              <a href="#gdpr" className={styles.legalLink}>GDPR</a>
              <span className={styles.divider}>|</span>
              <a href="#cookies" className={styles.legalLink}>Cookies</a>
            </div>

            {/* Company Details */}
            <div className={styles.companyDetails}>
              <div className={styles.copyright}>
                © 2024 Armora Security Ltd • London, England
              </div>
              <div className={styles.credentials}>
                SIA License: [Pending] • Company No: [To be registered] • Public Liability Insurance: £10,000,000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGULATORY NOTICE - Updated styling */}
      <div className={styles.regulatoryNotice}>
        <div className={styles.regulatoryContent}>
          <span className={styles.infoIcon}>ℹ️</span>
          <span className={styles.regulatoryText}>
            <strong>REGULATORY NOTICE:</strong> Armora provides SIA-licensed close protection services throughout England and Wales in compliance with Security Industry Authority regulations. All protection officers hold valid SIA Close Protection licenses. Secure transport is provided exclusively as part of comprehensive protection services.
          </span>
        </div>
      </div>
    </footer>
  );
}