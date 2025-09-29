import { FC } from 'react';
import styles from './SIACompliance.module.css';

export const SIACompliance: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>SIA COMPLIANCE & REGULATORY STANDARDS</h1>
          <p className={styles.subtitle}>Security Industry Authority Regulated Close Protection Services</p>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </header>

        <div className={styles.siaNotice}>
          <h2>🏛️ SIA Regulated Security Company</h2>
          <p>
            Armora Security Ltd operates under the full authority and regulation of the
            <strong> Security Industry Authority (SIA)</strong>, the UK's statutory regulator
            for the private security industry.
          </p>
        </div>

        <nav className={styles.tableOfContents}>
          <h3>Compliance Overview</h3>
          <ul>
            <li><a href="#sia-authority">SIA Authority & Regulation</a></li>
            <li><a href="#officer-licensing">Officer Licensing Requirements</a></li>
            <li><a href="#training-standards">Training & Qualification Standards</a></li>
            <li><a href="#background-checks">Background Checks & Vetting</a></li>
            <li><a href="#ongoing-compliance">Ongoing Compliance Monitoring</a></li>
            <li><a href="#complaint-procedure">SIA Complaint Procedure</a></li>
            <li><a href="#regulatory-contact">Regulatory Body Contact</a></li>
          </ul>
        </nav>

        <section id="sia-authority" className={styles.section}>
          <h2>🏛️ Security Industry Authority (SIA)</h2>

          <div className={styles.authorityInfo}>
            <div className={styles.infoCard}>
              <h3>About the SIA</h3>
              <p>
                The Security Industry Authority is the organisation responsible for regulating
                the private security industry in the United Kingdom, reporting to the Home Secretary
                under the Private Security Industry Act 2001.
              </p>
              <ul>
                <li>Statutory regulatory body</li>
                <li>Established under UK law</li>
                <li>Reports to the Home Office</li>
                <li>Covers England, Wales, Scotland, and Northern Ireland</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>SIA's Role</h3>
              <ul>
                <li><strong>Licensing:</strong> Issue licenses to security operatives</li>
                <li><strong>Standards:</strong> Set and monitor industry standards</li>
                <li><strong>Compliance:</strong> Ensure regulatory compliance</li>
                <li><strong>Enforcement:</strong> Investigate breaches and take action</li>
                <li><strong>Public Protection:</strong> Protect the public from criminal activity</li>
              </ul>
            </div>
          </div>

          <div className={styles.complianceStatement}>
            <h3>🛡️ Armora's SIA Compliance</h3>
            <p>
              Armora Security Ltd operates in full compliance with all SIA regulations and requirements.
              All our Close Protection Officers hold valid, current SIA licenses and undergo continuous
              professional development to maintain the highest standards of service.
            </p>
          </div>
        </section>

        <section id="officer-licensing" className={styles.section}>
          <h2>📜 Officer Licensing Requirements</h2>

          <div className={styles.licensingGrid}>
            <div className={styles.licenseType}>
              <h3>🎖️ Close Protection License</h3>
              <div className={styles.licenseDetails}>
                <h4>Mandatory Requirements:</h4>
                <ul>
                  <li>Valid SIA Close Protection license</li>
                  <li>License must be current and not suspended</li>
                  <li>Public display of license badge during duties</li>
                  <li>Regular license renewal (typically 3 years)</li>
                </ul>

                <h4>License Verification:</h4>
                <ul>
                  <li>Real-time verification with SIA database</li>
                  <li>Ongoing monitoring of license status</li>
                  <li>Immediate action if license issues arise</li>
                  <li>Public license register available online</li>
                </ul>
              </div>
            </div>

            <div className={styles.licenseType}>
              <h3>📊 License Categories</h3>
              <div className={styles.licenseDetails}>
                <h4>SIA License Levels:</h4>
                <ul>
                  <li><strong>Level 2:</strong> Standard close protection operations</li>
                  <li><strong>Level 3:</strong> Advanced close protection and risk assessment</li>
                  <li><strong>Specialist:</strong> Additional qualifications for specific environments</li>
                </ul>

                <h4>Additional Endorsements:</h4>
                <ul>
                  <li>Armed protection (where legally applicable)</li>
                  <li>Surveillance operations</li>
                  <li>Technical security measures</li>
                  <li>Venue security integration</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.verificationProcess}>
            <h3>🔍 License Verification Process</h3>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Initial Verification</h4>
                  <p>All officers undergo comprehensive license verification before joining Armora</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Ongoing Monitoring</h4>
                  <p>Regular checks against SIA database for license status and validity</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Immediate Action</h4>
                  <p>Any license issues result in immediate suspension from duties</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="training-standards" className={styles.section}>
          <h2>🎓 Training & Qualification Standards</h2>

          <div className={styles.trainingRequirements}>
            <h3>Mandatory Training Requirements</h3>

            <div className={styles.trainingGrid}>
              <div className={styles.trainingModule}>
                <h4>🛡️ Core Close Protection</h4>
                <ul>
                  <li>140-hour minimum training course</li>
                  <li>SIA-approved training provider</li>
                  <li>Threat assessment and risk management</li>
                  <li>Personal protection techniques</li>
                  <li>Emergency response procedures</li>
                </ul>
              </div>

              <div className={styles.trainingModule}>
                <h4>🚑 First Aid & Medical</h4>
                <ul>
                  <li>Emergency First Aid at Work certification</li>
                  <li>CPR and AED training</li>
                  <li>Trauma response procedures</li>
                  <li>Medical emergency coordination</li>
                  <li>Annual refresher training</li>
                </ul>
              </div>

              <div className={styles.trainingModule}>
                <h4>📡 Communication & Technology</h4>
                <ul>
                  <li>Professional communication protocols</li>
                  <li>Emergency services coordination</li>
                  <li>Security technology operation</li>
                  <li>Surveillance and counter-surveillance</li>
                  <li>Digital security awareness</li>
                </ul>
              </div>

              <div className={styles.trainingModule}>
                <h4>⚖️ Legal & Compliance</h4>
                <ul>
                  <li>UK security law and regulations</li>
                  <li>Human rights and equality training</li>
                  <li>Data protection and privacy</li>
                  <li>Use of force legislation</li>
                  <li>Professional ethics and conduct</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.specialistTraining}>
            <h3>Specialist Training Areas</h3>
            <div className={styles.specialistAreas}>
              <div className={styles.specialistArea}>
                <h4>🏢 Corporate Protection</h4>
                <p>Executive protection, boardroom security, corporate event protection</p>
              </div>
              <div className={styles.specialistArea}>
                <h4>✈️ Travel Security</h4>
                <p>Airport procedures, international protocols, travel risk assessment</p>
              </div>
              <div className={styles.specialistArea}>
                <h4>🎯 Threat Assessment</h4>
                <p>Advanced risk analysis, threat intelligence, security planning</p>
              </div>
              <div className={styles.specialistArea}>
                <h4>🔒 Technical Security</h4>
                <p>Security systems, surveillance technology, counter-surveillance</p>
              </div>
            </div>
          </div>
        </section>

        <section id="background-checks" className={styles.section}>
          <h2>🔍 Background Checks & Vetting</h2>

          <div className={styles.vettingProcess}>
            <h3>Comprehensive Vetting Procedures</h3>

            <div className={styles.vettingLevels}>
              <div className={styles.vettingLevel}>
                <h4>🔐 Enhanced DBS Check</h4>
                <p><strong>Disclosure and Barring Service (Enhanced Level)</strong></p>
                <ul>
                  <li>Criminal record check</li>
                  <li>Cautions and warnings review</li>
                  <li>Police intelligence check</li>
                  <li>Barred lists verification</li>
                  <li>Regular re-screening (every 3 years)</li>
                </ul>
              </div>

              <div className={styles.vettingLevel}>
                <h4>📋 Identity Verification</h4>
                <p><strong>Comprehensive Identity Confirmation</strong></p>
                <ul>
                  <li>Multiple forms of identification</li>
                  <li>Address history verification</li>
                  <li>Employment history checks</li>
                  <li>Educational qualification verification</li>
                  <li>Professional references (minimum 3)</li>
                </ul>
              </div>

              <div className={styles.vettingLevel}>
                <h4>💼 Professional History</h4>
                <p><strong>Security Industry Experience</strong></p>
                <ul>
                  <li>Previous security roles verification</li>
                  <li>Military/police service confirmation</li>
                  <li>Professional conduct history</li>
                  <li>Training record verification</li>
                  <li>Character references from industry professionals</li>
                </ul>
              </div>

              <div className={styles.vettingLevel}>
                <h4>🩺 Medical & Fitness</h4>
                <p><strong>Physical and Mental Suitability</strong></p>
                <ul>
                  <li>Medical fitness assessment</li>
                  <li>Physical capability evaluation</li>
                  <li>Mental health screening</li>
                  <li>Substance abuse testing</li>
                  <li>Ongoing health monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.ongoingVetting}>
            <h3>Ongoing Vetting & Monitoring</h3>
            <ul>
              <li>Annual review of all personnel files</li>
              <li>Continuous monitoring of professional conduct</li>
              <li>Regular re-screening of background checks</li>
              <li>Incident reporting and investigation procedures</li>
              <li>Professional development tracking</li>
            </ul>
          </div>
        </section>

        <section id="ongoing-compliance" className={styles.section}>
          <h2>📊 Ongoing Compliance Monitoring</h2>

          <div className={styles.complianceFramework}>
            <h3>Compliance Management System</h3>

            <div className={styles.complianceAreas}>
              <div className={styles.complianceArea}>
                <h4>📋 Regular Audits</h4>
                <ul>
                  <li>Monthly internal compliance reviews</li>
                  <li>Quarterly external audits</li>
                  <li>Annual SIA compliance assessment</li>
                  <li>Continuous improvement programs</li>
                </ul>
              </div>

              <div className={styles.complianceArea}>
                <h4>📝 Documentation</h4>
                <ul>
                  <li>Comprehensive record keeping</li>
                  <li>Incident reporting systems</li>
                  <li>Training record maintenance</li>
                  <li>License status tracking</li>
                </ul>
              </div>

              <div className={styles.complianceArea}>
                <h4>👥 Staff Training</h4>
                <ul>
                  <li>Regular compliance training sessions</li>
                  <li>Updates on regulatory changes</li>
                  <li>Professional development programs</li>
                  <li>Best practice sharing</li>
                </ul>
              </div>

              <div className={styles.complianceArea}>
                <h4>🔍 Quality Assurance</h4>
                <ul>
                  <li>Service quality monitoring</li>
                  <li>Customer feedback integration</li>
                  <li>Performance improvement tracking</li>
                  <li>Industry benchmark comparison</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="complaint-procedure" className={styles.section}>
          <h2>📢 SIA Complaint Procedure</h2>

          <div className={styles.complaintProcess}>
            <h3>How to Make a Complaint About Our Officers</h3>

            <div className={styles.complaintSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Direct to Armora</h4>
                  <p>Contact us first at complaints@armorasecurity.com</p>
                  <p>We aim to resolve complaints within 7 days</p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Escalate to SIA</h4>
                  <p>If unsatisfied, complain directly to the SIA</p>
                  <p>They will investigate regulatory breaches</p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>SIA Investigation</h4>
                  <p>SIA will investigate and take appropriate action</p>
                  <p>This may include license suspension or revocation</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.complaintTypes}>
            <h3>Types of Complaints the SIA Handles</h3>
            <div className={styles.complaintCategories}>
              <div className={styles.category}>
                <h4>🚫 License Violations</h4>
                <ul>
                  <li>Working without a valid license</li>
                  <li>Not displaying license badge</li>
                  <li>License fraud or misrepresentation</li>
                </ul>
              </div>
              <div className={styles.category}>
                <h4>⚠️ Professional Misconduct</h4>
                <ul>
                  <li>Inappropriate behavior</li>
                  <li>Excessive use of force</li>
                  <li>Breach of professional standards</li>
                </ul>
              </div>
              <div className={styles.category}>
                <h4>🏢 Company Issues</h4>
                <ul>
                  <li>Unlicensed security provision</li>
                  <li>Poor training standards</li>
                  <li>Inadequate vetting procedures</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="regulatory-contact" className={styles.section}>
          <h2>📞 Regulatory Body Contact Information</h2>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h3>Security Industry Authority (SIA)</h3>
              <div className={styles.contactDetails}>
                <h4>🌐 Website</h4>
                <p>www.sia.homeoffice.gov.uk</p>

                <h4>📧 Email</h4>
                <p>info@sia.homeoffice.gov.uk</p>

                <h4>📞 Phone</h4>
                <p>0300 123 9998</p>

                <h4>📮 Address</h4>
                <p>
                  Security Industry Authority<br />
                  PO Box 1293<br />
                  Liverpool<br />
                  L69 1AX
                </p>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3>Online Services</h3>
              <div className={styles.contactDetails}>
                <h4>📋 License Verification</h4>
                <p>Check officer licenses online via SIA public register</p>

                <h4>📝 Make a Complaint</h4>
                <p>Online complaint form available on SIA website</p>

                <h4>📚 Industry Information</h4>
                <p>Guidance, standards, and regulatory updates</p>

                <h4>📰 News & Updates</h4>
                <p>Latest regulatory changes and industry news</p>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3>Emergency & Urgent Issues</h3>
              <div className={styles.contactDetails}>
                <h4>🚨 Serious Misconduct</h4>
                <p>For urgent safety concerns, contact SIA immediately</p>

                <h4>🚔 Criminal Activity</h4>
                <p>Report criminal behavior to police (999) first, then SIA</p>

                <h4>⚠️ Public Safety Risk</h4>
                <p>Immediate reporting required for public safety issues</p>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <h3>🛡️ Committed to Excellence</h3>
            <p>
              Armora Security Ltd is proud to operate under SIA regulation and maintains
              the highest standards of professionalism, training, and compliance in the
              UK security industry.
            </p>
            <p>
              Our commitment to regulatory compliance ensures that you receive professional,
              legal, and ethical close protection services from properly licensed and
              vetted security professionals.
            </p>
            <div className={styles.complianceLogos}>
              <p><strong>Regulated by:</strong> Security Industry Authority (SIA)</p>
              <p><strong>Compliant with:</strong> Private Security Industry Act 2001</p>
              <p><strong>Member of:</strong> British Security Industry Association (BSIA)</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SIACompliance;