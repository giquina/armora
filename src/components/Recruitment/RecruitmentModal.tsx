import { useState, useEffect } from 'react';
import styles from './RecruitmentModal.module.css';

interface RecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationData {
  fullName: string;
  phoneNumber: string;
  email: string;
  siaLicense: string;
  privateHireLicense: string;
  experience: string;
  location: string;
}

export function RecruitmentModal({ isOpen, onClose }: RecruitmentModalProps) {
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    siaLicense: '',
    privateHireLicense: '',
    experience: '',
    location: ''
  });

  const [errors, setErrors] = useState<Partial<ApplicationData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        siaLicense: '',
        privateHireLicense: '',
        experience: '',
        location: ''
      });
      setErrors({});
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateSIALicense = (license: string): boolean => {
    // Remove any spaces or non-digits
    const cleanLicense = license.replace(/\D/g, '');
    return cleanLicense.length === 15;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.siaLicense.trim()) {
      newErrors.siaLicense = 'SIA license number is required';
    } else if (!validateSIALicense(formData.siaLicense)) {
      newErrors.siaLicense = 'SIA license must be 15 digits';
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ApplicationData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store application in localStorage
      const applications = JSON.parse(localStorage.getItem('armora_recruitment_applications') || '[]');

      // Determine priority status for dual license holders
      const hasBothLicenses = formData.privateHireLicense === 'tfl' || formData.privateHireLicense === 'council';
      const priorityStatus = hasBothLicenses ? 'high_priority' : 'standard';

      const newApplication = {
        ...formData,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        priorityStatus,
        hasBothLicenses,
        estimatedRate: hasBothLicenses ? '£65-85/hour' : '£45-75/hour'
      };

      // Sort applications - high priority first
      applications.push(newApplication);
      applications.sort((a: any, b: any) => {
        if (a.priorityStatus === 'high_priority' && b.priorityStatus !== 'high_priority') return -1;
        if (b.priorityStatus === 'high_priority' && a.priorityStatus !== 'high_priority') return 1;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });

      localStorage.setItem('armora_recruitment_applications', JSON.stringify(applications));

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Become an Armora Security Chauffeur</h2>
          <p className={styles.subtitle}>SIA Licensed Close Protection Officers</p>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {isSubmitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h3>Application Received!</h3>
              <p>
                {formData.privateHireLicense === 'tfl' || formData.privateHireLicense === 'council'
                  ? "🌟 PRIORITY APPLICATION: With both SIA and Private Hire licenses, you're eligible for higher rates (£65-85/hour) and priority consideration! Our recruitment team will contact you within 24 hours."
                  : "Our recruitment team will review and contact qualified candidates within 48 hours."
                }
              </p>
              <button className={styles.successButton} onClick={handleClose}>
                Close
              </button>
            </div>
          ) : (
            <>
              <div className={styles.highlights}>
                <div className={styles.earnings}>
                  <h3>Earnings: £45-75 per hour</h3>
                  <p className={styles.dualLicenseRate}>🌟 With both licenses: £65-85 per hour</p>
                </div>

                <div className={styles.requirements}>
                  <h4>Requirements:</h4>
                  <ul>
                    <li>Valid SIA Close Protection License</li>
                    <li>Clean UK driving license</li>
                    <li>2+ years security experience</li>
                    <li>Right to work in UK</li>
                    <li>Professional appearance</li>
                  </ul>
                  <div className={styles.priorityNote}>
                    <strong>🌟 PRIORITY HIRING:</strong> Candidates with both SIA Close Protection License AND Private Hire Vehicle License (TfL or council-issued) receive priority consideration and higher rates!
                  </div>
                </div>

                <div className={styles.benefits}>
                  <h4>Benefits:</h4>
                  <ul>
                    <li>Competitive rates: £45-75/hour</li>
                    <li>Choose your schedule</li>
                    <li>Drive premium vehicles</li>
                    <li>Work with high-profile clients</li>
                    <li>Ongoing training provided</li>
                  </ul>
                </div>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? styles.error : ''}
                    required
                  />
                  {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={errors.phoneNumber ? styles.error : ''}
                    required
                  />
                  {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? styles.error : ''}
                    required
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="siaLicense">SIA License Number * (15 digits)</label>
                  <input
                    type="text"
                    id="siaLicense"
                    name="siaLicense"
                    value={formData.siaLicense}
                    onChange={handleInputChange}
                    placeholder="123456789012345"
                    maxLength={20}
                    className={errors.siaLicense ? styles.error : ''}
                    required
                  />
                  {errors.siaLicense && <span className={styles.errorText}>{errors.siaLicense}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="privateHireLicense">
                    Private Hire Vehicle License (Optional - Priority Hiring)
                    <span className={styles.priorityLabel}>🌟 Higher rates & priority</span>
                  </label>
                  <select
                    id="privateHireLicense"
                    name="privateHireLicense"
                    value={formData.privateHireLicense}
                    onChange={handleInputChange}
                    className={errors.privateHireLicense ? styles.error : ''}
                  >
                    <option value="">Select license status</option>
                    <option value="none">No Private Hire License</option>
                    <option value="tfl">Transport for London (TfL) Private Hire License</option>
                    <option value="council">Council-issued Private Hire License</option>
                    <option value="applying">Currently applying for Private Hire License</option>
                  </select>
                  {errors.privateHireLicense && <span className={styles.errorText}>{errors.privateHireLicense}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="experience">Years of Experience *</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={errors.experience ? styles.error : ''}
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="2-3">2-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.experience && <span className={styles.errorText}>{errors.experience}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">Current Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., London, Manchester, Birmingham"
                    className={errors.location ? styles.error : ''}
                    required
                  />
                  {errors.location && <span className={styles.errorText}>{errors.location}</span>}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>

              <div className={styles.referral}>
                <h4>Know an SIA officer? Refer them and earn £500</h4>
                <button
                  type="button"
                  className={styles.shareButton}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Join Armora Security Team',
                        text: 'Armora is hiring SIA licensed close protection officers. Earn £45-75/hour with flexible schedules and premium vehicles.',
                        url: window.location.href
                      });
                    } else {
                      // Fallback to clipboard
                      navigator.clipboard.writeText('Armora is hiring SIA licensed close protection officers. Earn £45-75/hour with flexible schedules and premium vehicles. Apply now!');
                    }
                  }}
                >
                  Share Opportunity
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}