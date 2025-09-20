import React from 'react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* WARNING SECTION - CRITICAL REGULATORY NOTICE */}
      <div className={styles.warningSection}>
        <div className={styles.warningContent}>
          ⚠️ <strong>REGULATORY NOTICE:</strong> Armora provides SIA-licensed close protection services
          throughout England and Wales in compliance with Security Industry Authority
          regulations. This is NOT a taxi, private hire vehicle, or ride-hailing service.
          All protection officers hold valid SIA Close Protection licenses. Secure transport
          is provided exclusively as part of comprehensive protection services.
        </div>
      </div>

      {/* MAIN FOOTER SECTION */}
      <div className={styles.mainFooter}>
        <div className={styles.footerContent}>

          {/* Service Areas */}
          <div className={styles.serviceAreas}>
            <p className={styles.areasList}>
              London • Manchester • Birmingham • Liverpool • Leeds • Bristol • Newcastle •
              Sheffield • Nottingham • All England & Wales
            </p>
          </div>

          {/* Links Row */}
          <div className={styles.linksRow}>
            <a href="#terms" className={styles.footerLink}>Terms of Service</a>
            <span className={styles.linkSeparator}>|</span>
            <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
            <span className={styles.linkSeparator}>|</span>
            <a href="#sia" className={styles.footerLink}>SIA Compliance</a>
            <span className={styles.linkSeparator}>|</span>
            <a href="#insurance" className={styles.footerLink}>Insurance Certificate</a>
            <span className={styles.linkSeparator}>|</span>
            <a href="#gdpr" className={styles.footerLink}>GDPR</a>
            <span className={styles.linkSeparator}>|</span>
            <a href="#cookies" className={styles.footerLink}>Cookies</a>
          </div>

          {/* Company Information */}
          <div className={styles.companyInfo}>
            <div className={styles.companyRow}>
              <strong>Armora Security Ltd</strong> • London, England
            </div>
            <div className={styles.licenseRow}>
              SIA License: [Pending] • Company No: [To be registered]
            </div>
            <div className={styles.insuranceRow}>
              Public Liability Insurance: £10,000,000
            </div>
            <div className={styles.coverageRow}>
              Nationwide Coverage: England & Wales
            </div>
          </div>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <div className={styles.contactRow}>
              <strong>24/7 Protection Line:</strong> 020 XXXX XXXX
            </div>
            <div className={styles.emailRow}>
              <strong>Email:</strong> book@armora.security
            </div>
            <div className={styles.corporateRow}>
              <strong>Corporate:</strong> corporate@armora.security
            </div>
          </div>

          {/* Copyright */}
          <div className={styles.copyright}>
            © 2025 Armora Security Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}