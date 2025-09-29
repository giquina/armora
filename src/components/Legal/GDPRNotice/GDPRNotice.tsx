import { FC } from 'react';
import styles from './GDPRNotice.module.css';

export const GDPRNotice: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>GDPR COMPLIANCE NOTICE</h1>
          <p className={styles.subtitle}>Your Data Protection Rights Under UK GDPR</p>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </header>

        <div className={styles.introSection}>
          <h2>🛡️ Your Privacy Matters to Armora Security</h2>
          <p>
            As a professional close protection service, we take your privacy seriously. This notice explains your rights
            under the UK General Data Protection Regulation (GDPR) and how we protect your personal data.
          </p>
        </div>

        <nav className={styles.tableOfContents}>
          <h3>Quick Navigation</h3>
          <ul>
            <li><a href="#data-controller">Data Controller Information</a></li>
            <li><a href="#lawful-basis">Lawful Basis for Processing</a></li>
            <li><a href="#your-rights">Your GDPR Rights</a></li>
            <li><a href="#data-retention">Data Retention Periods</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
            <li><a href="#complaints">How to Complain</a></li>
            <li><a href="#contact">Contact Our DPO</a></li>
          </ul>
        </nav>

        <section id="data-controller" className={styles.section}>
          <h2>📋 Data Controller Information</h2>

          <div className={styles.controllerInfo}>
            <div className={styles.infoCard}>
              <h3>Armora Security Ltd</h3>
              <div className={styles.details}>
                <p><strong>Company Registration:</strong> [Company Number]</p>
                <p><strong>Registered Address:</strong> [Company Address]</p>
                <p><strong>ICO Registration:</strong> [ICO Number]</p>
                <p><strong>Business Type:</strong> Professional Security Services (SIA Regulated)</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Data Protection Officer</h3>
              <div className={styles.details}>
                <p><strong>Email:</strong> dpo@armorasecurity.com</p>
                <p><strong>Post:</strong> Data Protection Officer, Armora Security Ltd, [Address]</p>
                <p><strong>Response Time:</strong> Within 30 days</p>
              </div>
            </div>
          </div>
        </section>

        <section id="lawful-basis" className={styles.section}>
          <h2>⚖️ Lawful Basis for Processing Your Data</h2>

          <div className={styles.lawfulBasisGrid}>
            <div className={styles.basisCard}>
              <h4>📄 Contract Performance</h4>
              <p>Processing necessary to provide close protection services you've requested</p>
              <ul>
                <li>Service delivery and officer assignment</li>
                <li>Payment processing</li>
                <li>Communication about your protection assignments</li>
              </ul>
            </div>

            <div className={styles.basisCard}>
              <h4>🏛️ Legal Obligation</h4>
              <p>Required by law for security industry compliance</p>
              <ul>
                <li>SIA regulatory requirements</li>
                <li>Financial record keeping</li>
                <li>Tax obligations</li>
              </ul>
            </div>

            <div className={styles.basisCard}>
              <h4>⚖️ Legitimate Interests</h4>
              <p>For fraud prevention and service improvement</p>
              <ul>
                <li>Security monitoring and fraud detection</li>
                <li>Service quality improvement</li>
                <li>Business analytics (anonymized)</li>
              </ul>
            </div>

            <div className={styles.basisCard}>
              <h4>🆘 Vital Interests</h4>
              <p>To protect life and physical safety</p>
              <ul>
                <li>Emergency response coordination</li>
                <li>Threat assessment and response</li>
                <li>Critical safety communications</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="your-rights" className={styles.section}>
          <h2>🔐 Your GDPR Rights</h2>
          <p>Under UK GDPR, you have eight fundamental rights regarding your personal data:</p>

          <div className={styles.rightsContainer}>
            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>📋</div>
              <h4>Right of Access</h4>
              <p>Request a copy of the personal data we hold about you</p>
              <div className={styles.rightDetails}>
                <strong>What you get:</strong>
                <ul>
                  <li>Copy of your personal data</li>
                  <li>How we use it</li>
                  <li>Who we share it with</li>
                  <li>How long we keep it</li>
                </ul>
                <strong>Response time:</strong> 30 days (free of charge)
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>✏️</div>
              <h4>Right to Rectification</h4>
              <p>Correct inaccurate or incomplete personal data</p>
              <div className={styles.rightDetails}>
                <strong>Examples:</strong>
                <ul>
                  <li>Update contact information</li>
                  <li>Correct spelling of your name</li>
                  <li>Update emergency contacts</li>
                </ul>
                <strong>Response time:</strong> 30 days
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>🗑️</div>
              <h4>Right to Erasure</h4>
              <p>Request deletion of your personal data</p>
              <div className={styles.rightDetails}>
                <strong>When applicable:</strong>
                <ul>
                  <li>Data no longer necessary</li>
                  <li>You withdraw consent</li>
                  <li>Data processed unlawfully</li>
                </ul>
                <strong>Note:</strong> May not apply if we have legal obligations to retain data
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>📤</div>
              <h4>Right to Data Portability</h4>
              <p>Receive your data in a structured, machine-readable format</p>
              <div className={styles.rightDetails}>
                <strong>Includes:</strong>
                <ul>
                  <li>Account information</li>
                  <li>Service history</li>
                  <li>Preference settings</li>
                </ul>
                <strong>Format:</strong> JSON or CSV file
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>⏸️</div>
              <h4>Right to Restriction</h4>
              <p>Limit how we process your personal data</p>
              <div className={styles.rightDetails}>
                <strong>When you can restrict:</strong>
                <ul>
                  <li>Accuracy is contested</li>
                  <li>Processing is unlawful</li>
                  <li>We no longer need the data</li>
                </ul>
                <strong>Effect:</strong> We can only store the data, not use it
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>🚫</div>
              <h4>Right to Object</h4>
              <p>Object to processing based on legitimate interests</p>
              <div className={styles.rightDetails}>
                <strong>You can object to:</strong>
                <ul>
                  <li>Marketing communications</li>
                  <li>Profiling activities</li>
                  <li>Some legitimate interest processing</li>
                </ul>
                <strong>Note:</strong> We may continue if we have compelling grounds
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>🤖</div>
              <h4>Rights Related to Automated Decision Making</h4>
              <p>Protection from automated decisions that significantly affect you</p>
              <div className={styles.rightDetails}>
                <strong>Our commitment:</strong>
                <ul>
                  <li>No fully automated decisions</li>
                  <li>Human review of all decisions</li>
                  <li>Right to explanation</li>
                </ul>
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.rightIcon}>📢</div>
              <h4>Right to Lodge a Complaint</h4>
              <p>Complain to the Information Commissioner's Office</p>
              <div className={styles.rightDetails}>
                <strong>ICO Contact:</strong>
                <ul>
                  <li>Website: ico.org.uk</li>
                  <li>Phone: 0303 123 1113</li>
                  <li>Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.exerciseRights}>
            <h3>How to Exercise Your Rights</h3>
            <div className={styles.contactOptions}>
              <div className={styles.contactOption}>
                <h4>📧 Email</h4>
                <p>privacy@armorasecurity.com</p>
                <p>Include your full name and describe your request clearly</p>
              </div>
              <div className={styles.contactOption}>
                <h4>📮 Post</h4>
                <p>Data Protection Officer<br />Armora Security Ltd<br />[Company Address]</p>
              </div>
              <div className={styles.contactOption}>
                <h4>📱 Via App</h4>
                <p>Use the "Data Rights" option in your account settings</p>
              </div>
            </div>
          </div>
        </section>

        <section id="data-retention" className={styles.section}>
          <h2>📅 Data Retention Periods</h2>

          <div className={styles.retentionTable}>
            <div className={styles.retentionHeader}>
              <h4>Data Type</h4>
              <h4>Retention Period</h4>
              <h4>Reason</h4>
            </div>

            <div className={styles.retentionRow}>
              <div>Account Information</div>
              <div>While account is active + 12 months</div>
              <div>Service provision and support</div>
            </div>

            <div className={styles.retentionRow}>
              <div>Protection Assignment Records</div>
              <div>7 years</div>
              <div>SIA regulatory requirements</div>
            </div>

            <div className={styles.retentionRow}>
              <div>Financial Records</div>
              <div>6 years</div>
              <div>Tax and accounting obligations</div>
            </div>

            <div className={styles.retentionRow}>
              <div>Location Data</div>
              <div>24 hours after service</div>
              <div>Automatic deletion for privacy</div>
            </div>

            <div className={styles.retentionRow}>
              <div>Communication Logs</div>
              <div>2 years</div>
              <div>Service quality and dispute resolution</div>
            </div>

            <div className={styles.retentionRow}>
              <div>Marketing Preferences</div>
              <div>Until consent withdrawn</div>
              <div>Marketing communications</div>
            </div>
          </div>
        </section>

        <section id="cookies" className={styles.section}>
          <h2>🍪 Cookie Policy</h2>

          <div className={styles.cookiePolicy}>
            <div className={styles.cookieNotice}>
              <h3>We Use Essential Cookies Only</h3>
              <p>Armora uses only essential cookies required for the security and functionality of our service.</p>
            </div>

            <div className={styles.cookieTypes}>
              <div className={styles.cookieType}>
                <h4>✅ Essential Cookies</h4>
                <p>Required for security and service functionality</p>
                <ul>
                  <li>Authentication and session management</li>
                  <li>Security features and fraud prevention</li>
                  <li>Service preferences and settings</li>
                </ul>
                <p><strong>Legal basis:</strong> Necessary for service provision</p>
              </div>

              <div className={styles.cookieType}>
                <h4>❌ Marketing Cookies</h4>
                <p>We do NOT use marketing or tracking cookies</p>
                <ul>
                  <li>No third-party advertising cookies</li>
                  <li>No social media tracking</li>
                  <li>No behavioral profiling cookies</li>
                </ul>
              </div>
            </div>

            <div className={styles.cookieControls}>
              <h4>Cookie Controls</h4>
              <p>You can control cookies through your browser settings:</p>
              <ul>
                <li>Block all cookies (may affect service functionality)</li>
                <li>Delete existing cookies</li>
                <li>Set cookie preferences for specific sites</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="complaints" className={styles.section}>
          <h2>📢 How to Make a Complaint</h2>

          <div className={styles.complaintProcess}>
            <h3>Step-by-Step Complaint Process</h3>

            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Contact Us First</h4>
                  <p>Email: complaints@armorasecurity.com or privacy@armorasecurity.com</p>
                  <p>We aim to resolve most issues within 7 days</p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Escalate to Our DPO</h4>
                  <p>If not satisfied, contact our Data Protection Officer</p>
                  <p>Email: dpo@armorasecurity.com</p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Contact the ICO</h4>
                  <p>If still not satisfied, complain to the Information Commissioner's Office</p>
                  <p>This is free and you can do this at any time</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.icoDetails}>
            <h3>Information Commissioner's Office (ICO)</h3>
            <div className={styles.icoContact}>
              <div>
                <h4>🌐 Online</h4>
                <p>ico.org.uk/make-a-complaint</p>
              </div>
              <div>
                <h4>📞 Phone</h4>
                <p>0303 123 1113</p>
              </div>
              <div>
                <h4>📮 Post</h4>
                <p>Information Commissioner's Office<br />
                Wycliffe House<br />
                Water Lane<br />
                Wilmslow<br />
                Cheshire SK9 5AF</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <h2>📞 Contact Information</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h4>Data Protection Officer</h4>
              <p>dpo@armorasecurity.com</p>
              <p>Responsible for GDPR compliance and data protection matters</p>
            </div>

            <div className={styles.contactCard}>
              <h4>Privacy Inquiries</h4>
              <p>privacy@armorasecurity.com</p>
              <p>General privacy questions and data rights requests</p>
            </div>

            <div className={styles.contactCard}>
              <h4>Customer Support</h4>
              <p>support@armorasecurity.com</p>
              <p>+44 (0) 20 XXXX XXXX</p>
              <p>General service and account inquiries</p>
            </div>

            <div className={styles.contactCard}>
              <h4>Complaints</h4>
              <p>complaints@armorasecurity.com</p>
              <p>Formal complaints about data handling</p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <h3>Your Privacy is Protected</h3>
            <p>
              Armora Security Ltd is committed to protecting your privacy and ensuring transparent,
              lawful processing of your personal data. We regularly review our practices to ensure
              ongoing compliance with UK GDPR requirements.
            </p>
            <p>
              <strong>Remember:</strong> You can exercise your data protection rights at any time.
              We're here to help and will respond to your requests promptly.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GDPRNotice;