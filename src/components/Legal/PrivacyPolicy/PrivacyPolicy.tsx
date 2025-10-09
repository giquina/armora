import { FC } from 'react';
import { useApp } from '../../../contexts/AppContext';
import styles from './PrivacyPolicy.module.css';

export const PrivacyPolicy: FC = () => {
  const { navigateToView } = useApp();

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigateToView('home')}>
        ← Back
      </button>

      <div className={styles.content}>
        <header className={styles.header}>
          <h1>ARMORA PROTECTION SERVICES PRIVACY POLICY</h1>
          <p className={styles.lastUpdated}>Last updated: October 2025</p>
        </header>

        <div className={styles.importantNotice}>
          <h2>🛡️ IMPORTANT: We Provide Professional Close Protection, NOT Taxi Services</h2>
          <p>
            Armora operates as a professional security company providing SIA-licensed Close Protection Officers (CPOs)
            for personal protection services. We are NOT a taxi company and do not provide transportation services.
          </p>
        </div>

        <nav className={styles.tableOfContents}>
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#data-controller">1. Data Controller</a></li>
            <li><a href="#data-collection">2. What Data We Collect</a></li>
            <li><a href="#data-use">3. How We Use Your Data</a></li>
            <li><a href="#legal-basis">4. Legal Basis for Processing</a></li>
            <li><a href="#data-sharing">5. Data Sharing & Third-Party Services</a></li>
            <li><a href="#data-retention">6. Data Retention</a></li>
            <li><a href="#your-rights">7. Your GDPR Rights</a></li>
            <li><a href="#security">8. Data Security</a></li>
            <li><a href="#sia-data">9. SIA License Verification</a></li>
            <li><a href="#contact">10. Contact Information</a></li>
          </ul>
        </nav>

        <section id="data-controller" className={styles.section}>
          <h2>1. Data Controller</h2>
          <p>
            <strong>Giquina Management Holdings Ltd</strong> (trading as Armora) is the data controller responsible for your personal data.
          </p>
          <div className={styles.contactDetails}>
            <p><strong>Company:</strong> Giquina Management Holdings Ltd</p>
            <p><strong>Trading As:</strong> Armora Security Transport & Armora CPO Console</p>
            <p><strong>Email:</strong> privacy@armora.security</p>
            <p><strong>Data Protection Officer:</strong> dpo@armora.security</p>
            <p><strong>ICO Registration:</strong> [Pending Registration]</p>
          </div>
        </section>

        <section id="data-collection" className={styles.section}>
          <h2>2. What Data We Collect</h2>

          <div className={styles.subsection}>
            <h3>Personal Information:</h3>
            <ul>
              <li>Full name and preferred name</li>
              <li>Email address and phone number</li>
              <li>Emergency contact details</li>
              <li>Profile photograph (optional)</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <h3>Protection Service Data:</h3>
            <ul>
              <li><strong>Location data:</strong> Used exclusively for CPO assignment and protection coordination</li>
              <li>Protection requirements and risk assessment</li>
              <li>Service history and protection assignments</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>SIA license information (for CPO Console users only)</li>
              <li>Real-time GPS coordinates during active assignments</li>
            </ul>
          </div>

          <div className={styles.subsection}>
            <h3>Technical Data:</h3>
            <ul>
              <li>Device information and browser type</li>
              <li>IP address and general location</li>
              <li>App usage analytics (anonymized)</li>
              <li>Security logs for fraud prevention</li>
            </ul>
          </div>
        </section>

        <section id="data-use" className={styles.section}>
          <h2>3. How We Use Your Data</h2>

          <div className={styles.purposeList}>
            <div className={styles.purpose}>
              <h4>🛡️ Protection Service Delivery</h4>
              <p>Assigning qualified CPOs, coordinating protection details, and ensuring your safety</p>
            </div>

            <div className={styles.purpose}>
              <h4>📍 Officer Assignment</h4>
              <p>Location data is used ONLY to assign the nearest available SIA-licensed officer</p>
            </div>

            <div className={styles.purpose}>
              <h4>🔐 Security & Compliance</h4>
              <p>Fraud prevention, regulatory compliance, and maintaining service standards</p>
            </div>

            <div className={styles.purpose}>
              <h4>📞 Emergency Response</h4>
              <p>Contacting emergency services or designated contacts during protection assignments</p>
            </div>
          </div>
        </section>

        <section id="legal-basis" className={styles.section}>
          <h2>4. Legal Basis for Processing</h2>
          <ul className={styles.legalBasisList}>
            <li><strong>Contract Performance:</strong> Processing necessary to provide protection services</li>
            <li><strong>Legitimate Interests:</strong> Fraud prevention and service improvement</li>
            <li><strong>Legal Obligation:</strong> Compliance with SIA regulations and security requirements</li>
            <li><strong>Vital Interests:</strong> Emergency response and safety coordination</li>
          </ul>
        </section>

        <section id="data-sharing" className={styles.section}>
          <h2>5. Data Sharing & Third-Party Services</h2>
          <div className={styles.noSharing}>
            <h3>🚫 We DO NOT Sell Your Data</h3>
            <p>Your personal data is never sold, rented, or shared with marketing companies.</p>
          </div>

          <div className={styles.limitedSharing}>
            <h4>Essential Third-Party Service Providers:</h4>
            <ul>
              <li><strong>Supabase (Backend & Authentication):</strong> Secure cloud database for user accounts, authentication, and protection assignment records. Data hosted in EU regions compliant with GDPR.</li>
              <li><strong>Stripe (Payment Processing):</strong> PCI-DSS compliant payment processor handling card transactions. Only necessary payment data is shared.</li>
              <li><strong>Google Maps API (Location Services):</strong> Geocoding and mapping services for address lookup and route display. Location data is anonymized where possible.</li>
              <li><strong>Firebase Cloud Messaging:</strong> Push notifications for protection assignment updates and emergency alerts. Device tokens only, no personal data.</li>
              <li><strong>Assigned CPOs:</strong> Receive only necessary information (name, phone, pickup location) for your protection.</li>
              <li><strong>Emergency Services:</strong> Only contacted in genuine emergency situations with your consent or vital interest.</li>
              <li><strong>SIA Authority:</strong> CPO license verification and compliance checks when legally required.</li>
            </ul>

            <p><strong>Data Processing Agreements:</strong> All third-party processors have signed Data Processing Agreements (DPAs) and are GDPR-compliant.</p>
          </div>
        </section>

        <section id="data-retention" className={styles.section}>
          <h2>6. Data Retention</h2>
          <div className={styles.retentionTable}>
            <div className={styles.retentionItem}>
              <h4>Active Account Data</h4>
              <p>Retained while your account is active</p>
            </div>
            <div className={styles.retentionItem}>
              <h4>Protection Assignment Records</h4>
              <p>7 years (regulatory requirement)</p>
            </div>
            <div className={styles.retentionItem}>
              <h4>Location Data</h4>
              <p>Automatically deleted 24 hours after service completion</p>
            </div>
            <div className={styles.retentionItem}>
              <h4>Payment Records</h4>
              <p>6 years (tax and accounting requirements)</p>
            </div>
          </div>
        </section>

        <section id="your-rights" className={styles.section}>
          <h2>7. Your GDPR Rights</h2>
          <p>Under GDPR, you have the following rights:</p>

          <div className={styles.rightsGrid}>
            <div className={styles.right}>
              <h4>📋 Right of Access</h4>
              <p>Request a copy of your personal data</p>
            </div>
            <div className={styles.right}>
              <h4>✏️ Right to Rectification</h4>
              <p>Correct inaccurate or incomplete data</p>
            </div>
            <div className={styles.right}>
              <h4>🗑️ Right to Erasure</h4>
              <p>Request deletion of your data</p>
            </div>
            <div className={styles.right}>
              <h4>📤 Right to Data Portability</h4>
              <p>Receive your data in a portable format</p>
            </div>
            <div className={styles.right}>
              <h4>⏸️ Right to Restriction</h4>
              <p>Limit how we use your data</p>
            </div>
            <div className={styles.right}>
              <h4>🚫 Right to Object</h4>
              <p>Object to certain types of processing</p>
            </div>
            <div className={styles.right}>
              <h4>🤖 Automated Decision Making</h4>
              <p>Right not to be subject to automated decisions</p>
            </div>
            <div className={styles.right}>
              <h4>📢 Right to Complain</h4>
              <p>Lodge a complaint with the ICO</p>
            </div>
          </div>

          <div className={styles.exerciseRights}>
            <h4>How to Exercise Your Rights:</h4>
            <p>Email: <strong>privacy@armora.security</strong></p>
            <p>We will respond within 30 days of receiving your request.</p>
          </div>
        </section>

        <section id="security" className={styles.section}>
          <h2>8. Data Security</h2>
          <ul>
            <li>End-to-end encryption for sensitive communications</li>
            <li>Secure data centers with ISO 27001 certification</li>
            <li>Regular security audits and penetration testing</li>
            <li>Multi-factor authentication for all staff access</li>
            <li>Automatic data anonymization where possible</li>
          </ul>
        </section>

        <section id="sia-data" className={styles.section}>
          <h2>9. SIA License Verification Data (CPO Console)</h2>
          <p>
            For Close Protection Officers using the <strong>Armora CPO Console</strong> app, we process additional professional information:
          </p>
          <ul>
            <li><strong>SIA license numbers and expiry dates:</strong> Verified against SIA public register</li>
            <li><strong>Verification status:</strong> Confirmation of active license with Security Industry Authority</li>
            <li><strong>Training certificates:</strong> Close Protection qualifications and specialist training</li>
            <li><strong>Background check confirmations:</strong> DBS/Security clearance status</li>
            <li><strong>Professional insurance:</strong> Public liability and professional indemnity details</li>
            <li><strong>Assignment history:</strong> Performance ratings and service records</li>
          </ul>
          <p>
            This data is processed under our legal obligation to comply with SIA regulations (Private Security Industry Act 2001)
            and is retained for the duration of the officer's engagement plus 7 years as required by law.
          </p>
          <p><strong>CPO Rights:</strong> Officers have the same GDPR rights as Principals and can request access to their professional records at any time.</p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>10. Contact Information & Complaints</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <h4>Privacy Inquiries</h4>
              <p>privacy@armora.security</p>
              <p>Response time: 30 days maximum</p>
            </div>
            <div className={styles.contactItem}>
              <h4>Data Protection Officer</h4>
              <p>dpo@armora.security</p>
              <p>For GDPR rights requests</p>
            </div>
            <div className={styles.contactItem}>
              <h4>ICO Complaint</h4>
              <p>ico.org.uk</p>
              <p>0303 123 1113</p>
              <p>Right to lodge complaint with UK Information Commissioner's Office</p>
            </div>
            <div className={styles.contactItem}>
              <h4>General Support</h4>
              <p>support@armora.security</p>
              <p>24/7 emergency support</p>
            </div>
          </div>

          <div className={styles.exerciseRights}>
            <h4>🇬🇧 UK GDPR Compliance</h4>
            <p>This policy is compliant with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            <p><strong>Company Registration:</strong> Giquina Management Holdings Ltd</p>
            <p><strong>Apps Covered:</strong> Armora Security Transport (Principal app) & Armora CPO Console (Officer app)</p>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            This privacy policy applies to both <strong>Armora Security Transport</strong> (Principal app) and
            <strong> Armora CPO Console</strong> (Close Protection Officer app), operated by Giquina Management Holdings Ltd.
          </p>
          <p>
            We are committed to protecting your privacy, handling your data responsibly, and maintaining full compliance with UK GDPR.
          </p>
          <p>
            <strong>Important:</strong> Armora provides professional close protection services via SIA-licensed officers.
            We are not a taxi or private hire vehicle service.
          </p>
          <p className={styles.lastUpdated}>
            <strong>Policy Version:</strong> 1.0.0 | <strong>Last Updated:</strong> October 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
