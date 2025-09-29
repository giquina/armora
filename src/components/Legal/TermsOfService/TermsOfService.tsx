import { FC } from 'react';
import styles from './TermsOfService.module.css';

export const TermsOfService: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>ARMORA PROTECTION SERVICES - TERMS OF SERVICE</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </header>

        <div className={styles.criticalNotice}>
          <h2>⚠️ CRITICAL: WE ARE NOT A TAXI SERVICE</h2>
          <div className={styles.noticeContent}>
            <p><strong>Armora Security Ltd provides professional close protection services via SIA-licensed officers.</strong></p>
            <p><strong>WE ARE NOT A TRANSPORTATION COMPANY. WE DO NOT PROVIDE TAXI OR RIDE-HAILING SERVICES.</strong></p>
            <p>Our Close Protection Officers (CPOs) provide personal security and protection services, not transportation.</p>
          </div>
        </div>

        <nav className={styles.tableOfContents}>
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#acceptance">1. Acceptance of Terms</a></li>
            <li><a href="#service-description">2. Service Description</a></li>
            <li><a href="#not-taxi">3. NOT A TAXI SERVICE</a></li>
            <li><a href="#eligibility">4. Eligibility & Registration</a></li>
            <li><a href="#service-requirements">5. Service Requirements</a></li>
            <li><a href="#pricing">6. Pricing & Payment</a></li>
            <li><a href="#cancellation">7. Cancellation Policy</a></li>
            <li><a href="#officer-standards">8. Officer Standards</a></li>
            <li><a href="#user-responsibilities">9. User Responsibilities</a></li>
            <li><a href="#liability">10. Liability & Insurance</a></li>
            <li><a href="#disputes">11. Dispute Resolution</a></li>
            <li><a href="#termination">12. Termination</a></li>
            <li><a href="#governing-law">13. Governing Law</a></li>
          </ul>
        </nav>

        <section id="acceptance" className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Armora Security Ltd's services, you agree to be bound by these Terms of Service
            and all applicable laws and regulations. If you do not agree with these terms, you are prohibited
            from using our services.
          </p>
          <div className={styles.agreement}>
            <p><strong>By using our services, you acknowledge that:</strong></p>
            <ul>
              <li>You understand we provide professional security services, NOT transportation</li>
              <li>You have read and agree to these Terms of Service</li>
              <li>You have read and agree to our Privacy Policy</li>
              <li>You are at least 18 years old and legally capable of entering contracts</li>
            </ul>
          </div>
        </section>

        <section id="service-description" className={styles.section}>
          <h2>2. Service Description</h2>

          <div className={styles.serviceDetails}>
            <h3>🛡️ Professional Close Protection Services</h3>
            <p>Armora provides:</p>
            <ul>
              <li><strong>Personal Protection:</strong> SIA-licensed Close Protection Officers for individual security</li>
              <li><strong>Risk Assessment:</strong> Professional threat evaluation and mitigation</li>
              <li><strong>Security Coordination:</strong> Real-time protection management and emergency response</li>
              <li><strong>Executive Protection:</strong> Specialized security for high-profile individuals</li>
            </ul>
          </div>

          <div className={styles.serviceTypes}>
            <h3>Service Tiers:</h3>
            <div className={styles.tierList}>
              <div className={styles.tier}>
                <h4>Essential Protection (£65/hour)</h4>
                <p>SIA Level 2 licensed officers for standard protection assignments</p>
              </div>
              <div className={styles.tier}>
                <h4>Executive Shield (£95/hour)</h4>
                <p>SIA Level 3 licensed officers with corporate protection specialization</p>
              </div>
              <div className={styles.tier}>
                <h4>Shadow Protocol (£125/hour)</h4>
                <p>Special Forces trained protection specialists for high-risk situations</p>
              </div>
              <div className={styles.tier}>
                <h4>Client Vehicle Service (£55/hour)</h4>
                <p>Security-trained CPO for protection using your vehicle</p>
              </div>
            </div>
          </div>
        </section>

        <section id="not-taxi" className={styles.section}>
          <h2>3. NOT A TAXI SERVICE</h2>

          <div className={styles.emphasisBox}>
            <h3>🚫 IMPORTANT CLARIFICATION</h3>
            <p><strong>Armora Security Ltd is a SECURITY COMPANY, not a transport provider.</strong></p>

            <div className={styles.clarificationGrid}>
              <div className={styles.clarificationItem}>
                <h4>❌ We Do NOT Provide:</h4>
                <ul>
                  <li>Taxi services</li>
                  <li>Ride-hailing services</li>
                  <li>Private hire transportation</li>
                  <li>Courier services</li>
                  <li>General transportation</li>
                </ul>
              </div>
              <div className={styles.clarificationItem}>
                <h4>✅ We DO Provide:</h4>
                <ul>
                  <li>Personal protection services</li>
                  <li>Close protection officers</li>
                  <li>Security assessments</li>
                  <li>Executive protection</li>
                  <li>Risk mitigation</li>
                </ul>
              </div>
            </div>

            <p className={styles.regulation}>
              <strong>Regulatory Compliance:</strong> Armora operates under SIA (Security Industry Authority) regulations,
              not TfL (Transport for London) or other transportation regulatory bodies.
            </p>
          </div>
        </section>

        <section id="eligibility" className={styles.section}>
          <h2>4. Eligibility & Registration</h2>

          <div className={styles.eligibilityRequirements}>
            <h3>Eligibility Requirements:</h3>
            <ul>
              <li>Must be 18 years or older</li>
              <li>Provide valid identification</li>
              <li>Complete security questionnaire</li>
              <li>Provide emergency contact information</li>
              <li>Agree to background verification if required</li>
            </ul>
          </div>

          <div className={styles.registrationTypes}>
            <h4>Account Types:</h4>
            <div className={styles.accountTypes}>
              <div className={styles.accountType}>
                <h5>Principal Account</h5>
                <p>Individual requiring protection services</p>
              </div>
              <div className={styles.accountType}>
                <h5>Corporate Account</h5>
                <p>Business accounts for executive protection</p>
              </div>
              <div className={styles.accountType}>
                <h5>Guest Access</h5>
                <p>Limited access for quote requests only</p>
              </div>
            </div>
          </div>
        </section>

        <section id="service-requirements" className={styles.section}>
          <h2>5. Service Requirements</h2>

          <div className={styles.requirements}>
            <div className={styles.requirement}>
              <h4>⏰ Minimum Service Duration</h4>
              <p><strong>2-hour minimum</strong> for all protection assignments</p>
              <p>This ensures adequate time for proper security assessment and implementation</p>
            </div>

            <div className={styles.requirement}>
              <h4>📍 Service Areas</h4>
              <p>England & Wales with specialized coverage for:</p>
              <ul>
                <li>London and Greater London</li>
                <li>Major airports (Heathrow, Gatwick, Stansted, Luton)</li>
                <li>Financial districts and business centers</li>
                <li>Event venues and private residences</li>
              </ul>
            </div>

            <div className={styles.requirement}>
              <h4>🕐 Advance Booking</h4>
              <p>Standard bookings: 2-hour advance notice</p>
              <p>Emergency protection: Subject to officer availability</p>
              <p>Specialized assignments: 24-48 hours advance notice</p>
            </div>
          </div>
        </section>

        <section id="pricing" className={styles.section}>
          <h2>6. Pricing & Payment</h2>

          <div className={styles.pricingStructure}>
            <h3>Service Fees Structure:</h3>

            <div className={styles.feeStructure}>
              <div className={styles.feeItem}>
                <h4>Hourly Rates</h4>
                <p>Based on service tier and officer qualifications</p>
              </div>
              <div className={styles.feeItem}>
                <h4>2-Hour Minimum</h4>
                <p>All protection assignments have a 2-hour minimum charge</p>
              </div>
              <div className={styles.feeItem}>
                <h4>Premium Rates</h4>
                <p>Bank holidays, overnight (11 PM - 6 AM): +50%</p>
              </div>
              <div className={styles.feeItem}>
                <h4>Travel Costs</h4>
                <p>Included within service areas; additional charges may apply for remote locations</p>
              </div>
            </div>

            <div className={styles.paymentTerms}>
              <h4>Payment Terms:</h4>
              <ul>
                <li>Payment required at booking confirmation</li>
                <li>Accepted methods: Credit/debit cards via Stripe</li>
                <li>No cash payments accepted</li>
                <li>VAT included in all quoted prices</li>
                <li>Invoices provided for corporate accounts</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="cancellation" className={styles.section}>
          <h2>7. Cancellation Policy</h2>

          <div className={styles.cancellationGrid}>
            <div className={styles.cancellationRule}>
              <h4>24+ Hours Notice</h4>
              <p>Full refund less 5% processing fee</p>
            </div>
            <div className={styles.cancellationRule}>
              <h4>2-24 Hours Notice</h4>
              <p>50% charge of total service fee</p>
            </div>
            <div className={styles.cancellationRule}>
              <h4>Less than 2 Hours</h4>
              <p>100% charge of total service fee</p>
            </div>
            <div className={styles.cancellationRule}>
              <h4>No Show</h4>
              <p>100% charge plus potential additional fees</p>
            </div>
          </div>

          <div className={styles.emergencyCancellation}>
            <h4>Emergency Cancellations:</h4>
            <p>Medical emergencies, police incidents, or force majeure events may qualify for exception consideration.</p>
          </div>
        </section>

        <section id="officer-standards" className={styles.section}>
          <h2>8. Officer Standards & Qualifications</h2>

          <div className={styles.standards}>
            <h3>🎓 Mandatory Qualifications:</h3>
            <ul>
              <li><strong>SIA License:</strong> Valid Close Protection license from Security Industry Authority</li>
              <li><strong>Background Checks:</strong> Enhanced DBS (Disclosure and Barring Service) clearance</li>
              <li><strong>Training:</strong> Certified close protection training from approved providers</li>
              <li><strong>First Aid:</strong> Current first aid and emergency response certification</li>
              <li><strong>Professional Standards:</strong> Ongoing training and assessment</li>
            </ul>

            <h3>🔍 Verification Process:</h3>
            <ul>
              <li>SIA license verification with regulatory authority</li>
              <li>Identity and eligibility confirmation</li>
              <li>Reference checks from previous security roles</li>
              <li>Regular performance assessments</li>
              <li>Continued professional development requirements</li>
            </ul>
          </div>
        </section>

        <section id="user-responsibilities" className={styles.section}>
          <h2>9. User Responsibilities</h2>

          <div className={styles.responsibilities}>
            <h3>Principal Responsibilities:</h3>
            <ul>
              <li><strong>Accurate Information:</strong> Provide truthful and complete information</li>
              <li><strong>Security Cooperation:</strong> Follow officer instructions and security protocols</li>
              <li><strong>Lawful Conduct:</strong> Engage only in legal activities during protection assignments</li>
              <li><strong>Threat Disclosure:</strong> Inform us of any known threats or risks</li>
              <li><strong>Payment:</strong> Ensure prompt payment of service fees</li>
              <li><strong>Professional Conduct:</strong> Treat officers with respect and professionalism</li>
            </ul>

            <h3>Prohibited Activities:</h3>
            <ul>
              <li>Requesting officers to engage in illegal activities</li>
              <li>Using services for non-security purposes</li>
              <li>Harassment or inappropriate conduct toward officers</li>
              <li>Providing false information about threats or requirements</li>
              <li>Attempting to recruit officers for other purposes</li>
            </ul>
          </div>
        </section>

        <section id="liability" className={styles.section}>
          <h2>10. Liability & Insurance</h2>

          <div className={styles.liability}>
            <h3>Insurance Coverage:</h3>
            <ul>
              <li><strong>Professional Indemnity:</strong> £2,000,000 coverage</li>
              <li><strong>Public Liability:</strong> £5,000,000 coverage</li>
              <li><strong>Employer's Liability:</strong> £10,000,000 coverage</li>
            </ul>

            <h3>Limitation of Liability:</h3>
            <div className={styles.limitationBox}>
              <p>
                Armora's liability is limited to the service fees paid for the specific assignment.
                We provide professional security services but cannot guarantee prevention of all incidents.
              </p>
              <p>
                <strong>We are not liable for:</strong>
              </p>
              <ul>
                <li>Acts of third parties beyond our reasonable control</li>
                <li>Principal's failure to follow security instructions</li>
                <li>Incidents occurring outside the scope of assignment</li>
                <li>Pre-existing or undisclosed threats</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="disputes" className={styles.section}>
          <h2>11. Dispute Resolution</h2>

          <div className={styles.disputeProcess}>
            <h3>Resolution Process:</h3>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <h4>Step 1: Direct Communication</h4>
                <p>Contact our support team at support@armorasecurity.com</p>
              </div>
              <div className={styles.step}>
                <h4>Step 2: Formal Complaint</h4>
                <p>Submit written complaint with details and evidence</p>
              </div>
              <div className={styles.step}>
                <h4>Step 3: Management Review</h4>
                <p>Senior management assessment within 14 days</p>
              </div>
              <div className={styles.step}>
                <h4>Step 4: Alternative Dispute Resolution</h4>
                <p>Mediation or arbitration if required</p>
              </div>
            </div>
          </div>
        </section>

        <section id="termination" className={styles.section}>
          <h2>12. Termination</h2>

          <div className={styles.termination}>
            <h3>Account Termination:</h3>
            <p>Either party may terminate the service relationship with appropriate notice:</p>
            <ul>
              <li><strong>User Termination:</strong> Account closure available at any time</li>
              <li><strong>Service Termination:</strong> For breach of terms, illegal activities, or safety concerns</li>
              <li><strong>Data Retention:</strong> Personal data handled according to Privacy Policy</li>
            </ul>
          </div>
        </section>

        <section id="governing-law" className={styles.section}>
          <h2>13. Governing Law</h2>

          <div className={styles.governingLaw}>
            <p>
              These Terms of Service are governed by English law and subject to the exclusive
              jurisdiction of the courts of England and Wales.
            </p>

            <h3>Regulatory Compliance:</h3>
            <ul>
              <li><strong>SIA:</strong> Security Industry Authority regulations</li>
              <li><strong>GDPR:</strong> General Data Protection Regulation</li>
              <li><strong>Companies House:</strong> UK company registration requirements</li>
              <li><strong>ICO:</strong> Information Commissioner's Office guidelines</li>
            </ul>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.contactInfo}>
            <h3>Contact Information</h3>
            <div className={styles.contactDetails}>
              <div>
                <h4>General Inquiries</h4>
                <p>support@armorasecurity.com</p>
                <p>+44 (0) 20 XXXX XXXX</p>
              </div>
              <div>
                <h4>Legal Department</h4>
                <p>legal@armorasecurity.com</p>
              </div>
              <div>
                <h4>Complaints</h4>
                <p>complaints@armorasecurity.com</p>
              </div>
            </div>
          </div>

          <div className={styles.finalNotice}>
            <p>
              <strong>Armora Security Ltd - Professional Close Protection Services</strong>
            </p>
            <p>
              We are a security company regulated by the SIA, not a transportation provider.
              By using our services, you acknowledge this distinction.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;