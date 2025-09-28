import { useState, useEffect } from 'react';
import { IEnhancedEmergencyInfo } from '../../types';
import styles from './EnhancedEmergencyContacts.module.css';

interface EnhancedEmergencyContactsProps {
  value?: IEnhancedEmergencyInfo;
  onChange: (value: IEnhancedEmergencyInfo) => void;
  isVisible: boolean;
  onComplete: () => void;
}

const BLOOD_TYPES = [
  { value: 'A+', label: 'A+', icon: '🅰️' },
  { value: 'A-', label: 'A-', icon: '🅰️' },
  { value: 'B+', label: 'B+', icon: '🅱️' },
  { value: 'B-', label: 'B-', icon: '🅱️' },
  { value: 'AB+', label: 'AB+', icon: '🆎' },
  { value: 'AB-', label: 'AB-', icon: '🆎' },
  { value: 'O+', label: 'O+', icon: '⭕' },
  { value: 'O-', label: 'O-', icon: '⭕' },
  { value: 'Unknown', label: 'Unknown', icon: '❓' }
] as const;

const RELATIONSHIP_OPTIONS = [
  'Spouse/Partner',
  'Parent',
  'Sibling',
  'Child',
  'Family Member',
  'Business Partner',
  'Assistant/PA',
  'Legal Representative',
  'Friend',
  'Colleague',
  'Other'
];

export function EnhancedEmergencyContacts({
  value,
  onChange,
  isVisible,
  onComplete
}: EnhancedEmergencyContactsProps) {
  const [formData, setFormData] = useState<IEnhancedEmergencyInfo>({
    nextOfKin: {
      name: '',
      relationship: '',
      primaryPhone: '',
      secondaryPhone: '',
      address: '',
      canMakeDecisions: false,
    },
    medicalEmergency: {
      bloodType: undefined,
      criticalAllergies: [],
      currentMedications: [],
      medicalConditions: [],
      emergencyProcedures: [],
      primaryPhysician: undefined,
    },
    secondaryContact: {
      name: '',
      relationship: '',
      phone: '',
      role: 'backup',
    },
    dataConsent: {
      medicalDataConsent: false,
      emergencyContactConsent: false,
      dataProcessingConsent: false,
      consentTimestamp: new Date().toISOString(),
    },
    privacyLevel: 'standard',
    encryptionLevel: 'standard',
  });

  const [showMedicalSection, setShowMedicalSection] = useState(false);
  const [showPhysicianDetails, setShowPhysicianDetails] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newProcedure, setNewProcedure] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data from props
  useEffect(() => {
    if (value) {
      setFormData(value);
      setShowMedicalSection(
        !!value.medicalEmergency.bloodType ||
        value.medicalEmergency.criticalAllergies?.length > 0 ||
        value.medicalEmergency.currentMedications?.length > 0 ||
        value.medicalEmergency.medicalConditions?.length > 0
      );
      setShowPhysicianDetails(!!value.medicalEmergency.primaryPhysician);
    }
  }, [value]);

  // Update parent component when form data changes
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const validateField = (field: string, fieldValue: string): string => {
    switch (field) {
      case 'nextOfKin.name':
        return fieldValue.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'nextOfKin.primaryPhone':
        const phoneRegex = /^(\+44\s?7\d{3}\s?\d{6}|07\d{3}\s?\d{6}|\+44\s?\d{2,4}\s?\d{6,8})$/;
        return !phoneRegex.test(fieldValue.replace(/\s/g, '')) ? 'Please enter a valid UK phone number' : '';
      case 'nextOfKin.address':
        return fieldValue.trim().length < 10 ? 'Please provide a complete address' : '';
      default:
        return '';
    }
  };

  const updateNestedField = (path: string, newValue: any) => {
    const pathArray = path.split('.');
    setFormData(prev => {
      const updated = { ...prev };
      let current: any = updated;

      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }

      current[pathArray[pathArray.length - 1]] = newValue;

      return updated;
    });

    // Clear any existing error for this field
    if (errors[path]) {
      setErrors(prev => ({ ...prev, [path]: '' }));
    }
  };

  const validateRequiredFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate next of kin (required fields)
    if (!formData.nextOfKin.name.trim()) {
      newErrors['nextOfKin.name'] = 'Next of kin name is required';
    } else {
      const nameError = validateField('nextOfKin.name', formData.nextOfKin.name);
      if (nameError) newErrors['nextOfKin.name'] = nameError;
    }

    if (!formData.nextOfKin.primaryPhone.trim()) {
      newErrors['nextOfKin.primaryPhone'] = 'Primary phone number is required';
    } else {
      const phoneError = validateField('nextOfKin.primaryPhone', formData.nextOfKin.primaryPhone);
      if (phoneError) newErrors['nextOfKin.primaryPhone'] = phoneError;
    }

    if (!formData.nextOfKin.relationship) {
      newErrors['nextOfKin.relationship'] = 'Relationship is required';
    }

    // Validate consent requirements
    if (!formData.dataConsent.emergencyContactConsent) {
      newErrors['dataConsent.emergencyContactConsent'] = 'Emergency contact consent is required';
    }

    if (showMedicalSection && !formData.dataConsent.medicalDataConsent) {
      newErrors['dataConsent.medicalDataConsent'] = 'Medical data consent is required when providing medical information';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addArrayItem = (arrayPath: string, item: string, setterFunction: (value: string) => void) => {
    if (item.trim()) {
      const pathArray = arrayPath.split('.');
      setFormData(prev => {
        const updated = { ...prev };
        let current: any = updated;

        for (let i = 0; i < pathArray.length - 1; i++) {
          current = current[pathArray[i]];
        }

        const currentArray = current[pathArray[pathArray.length - 1]] || [];
        current[pathArray[pathArray.length - 1]] = [...currentArray, item.trim()];

        return updated;
      });
      setterFunction('');
    }
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    const pathArray = arrayPath.split('.');
    setFormData(prev => {
      const updated = { ...prev };
      let current: any = updated;

      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }

      const currentArray = current[pathArray[pathArray.length - 1]] || [];
      current[pathArray[pathArray.length - 1]] = currentArray.filter((_: any, i: number) => i !== index);

      return updated;
    });
  };

  const handleSubmit = () => {
    if (validateRequiredFields()) {
      // Update consent timestamp
      updateNestedField('dataConsent.consentTimestamp', new Date().toISOString());
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.icon}>🚨</span>
          Enhanced Emergency Contact Information
        </h3>
        <p className={styles.subtitle}>
          Comprehensive emergency contact and medical information for your safety
        </p>
      </div>

      {/* Data Protection Notice */}
      <div className={styles.dataProtectionNotice}>
        <div className={styles.noticeHeader}>
          <span className={styles.lockIcon}>🔒</span>
          <h4>Data Protection & Privacy</h4>
        </div>
        <p>
          This information is classified as special category personal data under GDPR.
          We use field-level encryption and strict access controls to protect your privacy.
        </p>
      </div>

      {/* Next of Kin Section */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>👤</span>
          Primary Emergency Contact (Next of Kin)
        </h4>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.nextOfKin.name}
            onChange={(e) => updateNestedField('nextOfKin.name', e.target.value)}
            onBlur={(e) => {
              const error = validateField('nextOfKin.name', e.target.value);
              if (error) setErrors(prev => ({ ...prev, 'nextOfKin.name': error }));
            }}
            className={`${styles.input} ${errors['nextOfKin.name'] ? styles.inputError : ''}`}
            placeholder="Enter full legal name"
          />
          {errors['nextOfKin.name'] && (
            <span className={styles.errorMessage}>{errors['nextOfKin.name']}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Relationship <span className={styles.required}>*</span>
          </label>
          <select
            value={formData.nextOfKin.relationship}
            onChange={(e) => updateNestedField('nextOfKin.relationship', e.target.value)}
            className={`${styles.select} ${errors['nextOfKin.relationship'] ? styles.inputError : ''}`}
          >
            <option value="">Select relationship</option>
            {RELATIONSHIP_OPTIONS.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
          {errors['nextOfKin.relationship'] && (
            <span className={styles.errorMessage}>{errors['nextOfKin.relationship']}</span>
          )}
        </div>

        <div className={styles.phoneRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Primary Phone <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              value={formData.nextOfKin.primaryPhone}
              onChange={(e) => updateNestedField('nextOfKin.primaryPhone', e.target.value)}
              onBlur={(e) => {
                const error = validateField('nextOfKin.primaryPhone', e.target.value);
                if (error) setErrors(prev => ({ ...prev, 'nextOfKin.primaryPhone': error }));
              }}
              className={`${styles.input} ${errors['nextOfKin.primaryPhone'] ? styles.inputError : ''}`}
              placeholder="+44 7XXX XXXXXX"
            />
            {errors['nextOfKin.primaryPhone'] && (
              <span className={styles.errorMessage}>{errors['nextOfKin.primaryPhone']}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Secondary Phone</label>
            <input
              type="tel"
              value={formData.nextOfKin.secondaryPhone}
              onChange={(e) => updateNestedField('nextOfKin.secondaryPhone', e.target.value)}
              className={styles.input}
              placeholder="+44 20 XXXX XXXX"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Address</label>
          <textarea
            value={formData.nextOfKin.address}
            onChange={(e) => updateNestedField('nextOfKin.address', e.target.value)}
            className={styles.textarea}
            placeholder="Full address including postcode"
            rows={3}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.nextOfKin.canMakeDecisions}
              onChange={(e) => updateNestedField('nextOfKin.canMakeDecisions', e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              Authorized to make medical and legal decisions on my behalf
            </span>
          </label>
        </div>
      </section>

      {/* Progressive Disclosure for Medical Information */}
      <section className={styles.section}>
        <div className={styles.medicalToggle}>
          <button
            type="button"
            onClick={() => setShowMedicalSection(!showMedicalSection)}
            className={styles.toggleButton}
          >
            <span className={styles.medicalIcon}>🏥</span>
            Medical Emergency Information (Optional)
            <span className={styles.toggleIcon}>{showMedicalSection ? '▼' : '▶'}</span>
          </button>
          <p className={styles.toggleDescription}>
            Provide critical medical information for emergency situations
          </p>
        </div>

        {showMedicalSection && (
          <div className={styles.medicalSection}>
            {/* Blood Type Selector */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Blood Type</label>
              <div className={styles.bloodTypeGrid}>
                {BLOOD_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateNestedField('medicalEmergency.bloodType', type.value)}
                    className={`${styles.bloodTypeButton} ${
                      formData.medicalEmergency.bloodType === type.value ? styles.selected : ''
                    }`}
                  >
                    <span className={styles.bloodTypeIcon}>{type.icon}</span>
                    <span className={styles.bloodTypeLabel}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Critical Allergies */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Critical Allergies</label>
              <div className={styles.addItemContainer}>
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className={styles.input}
                  placeholder="Enter allergy (e.g., Penicillin, Nuts)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('medicalEmergency.criticalAllergies', newAllergy, setNewAllergy);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('medicalEmergency.criticalAllergies', newAllergy, setNewAllergy)}
                  className={styles.addButton}
                  disabled={!newAllergy.trim()}
                >
                  Add
                </button>
              </div>
              <div className={styles.itemList}>
                {formData.medicalEmergency.criticalAllergies?.map((allergy, index) => (
                  <div key={index} className={styles.listItem}>
                    <span>{allergy}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('medicalEmergency.criticalAllergies', index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Current Medications</label>
              <div className={styles.addItemContainer}>
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  className={styles.input}
                  placeholder="Enter medication name and dosage"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('medicalEmergency.currentMedications', newMedication, setNewMedication);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('medicalEmergency.currentMedications', newMedication, setNewMedication)}
                  className={styles.addButton}
                  disabled={!newMedication.trim()}
                >
                  Add
                </button>
              </div>
              <div className={styles.itemList}>
                {formData.medicalEmergency.currentMedications?.map((medication, index) => (
                  <div key={index} className={styles.listItem}>
                    <span>{medication}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('medicalEmergency.currentMedications', index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Relevant Medical Conditions</label>
              <div className={styles.addItemContainer}>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className={styles.input}
                  placeholder="Enter medical condition"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('medicalEmergency.medicalConditions', newCondition, setNewCondition);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addArrayItem('medicalEmergency.medicalConditions', newCondition, setNewCondition)}
                  className={styles.addButton}
                  disabled={!newCondition.trim()}
                >
                  Add
                </button>
              </div>
              <div className={styles.itemList}>
                {formData.medicalEmergency.medicalConditions?.map((condition, index) => (
                  <div key={index} className={styles.listItem}>
                    <span>{condition}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('medicalEmergency.medicalConditions', index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Physician */}
            <div className={styles.physicianToggle}>
              <button
                type="button"
                onClick={() => setShowPhysicianDetails(!showPhysicianDetails)}
                className={styles.toggleButton}
              >
                Primary Physician Details (Optional)
                <span className={styles.toggleIcon}>{showPhysicianDetails ? '▼' : '▶'}</span>
              </button>
            </div>

            {showPhysicianDetails && (
              <div className={styles.physicianDetails}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Physician Name</label>
                  <input
                    type="text"
                    value={formData.medicalEmergency.primaryPhysician?.name || ''}
                    onChange={(e) => updateNestedField('medicalEmergency.primaryPhysician', {
                      ...formData.medicalEmergency.primaryPhysician,
                      name: e.target.value
                    })}
                    className={styles.input}
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Physician Phone</label>
                  <input
                    type="tel"
                    value={formData.medicalEmergency.primaryPhysician?.phone || ''}
                    onChange={(e) => updateNestedField('medicalEmergency.primaryPhysician', {
                      ...formData.medicalEmergency.primaryPhysician,
                      phone: e.target.value
                    })}
                    className={styles.input}
                    placeholder="+44 20 XXXX XXXX"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hospital/Practice</label>
                  <input
                    type="text"
                    value={formData.medicalEmergency.primaryPhysician?.hospital || ''}
                    onChange={(e) => updateNestedField('medicalEmergency.primaryPhysician', {
                      ...formData.medicalEmergency.primaryPhysician,
                      hospital: e.target.value
                    })}
                    className={styles.input}
                    placeholder="Hospital or practice name"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Special Notes</label>
                  <textarea
                    value={formData.medicalEmergency.primaryPhysician?.specialNotes || ''}
                    onChange={(e) => updateNestedField('medicalEmergency.primaryPhysician', {
                      ...formData.medicalEmergency.primaryPhysician,
                      specialNotes: e.target.value
                    })}
                    className={styles.textarea}
                    placeholder="Any special instructions or notes"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Secondary Contact */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>👥</span>
          Secondary Contact (Optional)
        </h4>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={formData.secondaryContact.name}
            onChange={(e) => updateNestedField('secondaryContact.name', e.target.value)}
            className={styles.input}
            placeholder="Secondary contact name"
          />
        </div>

        <div className={styles.phoneRoleRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone</label>
            <input
              type="tel"
              value={formData.secondaryContact.phone}
              onChange={(e) => updateNestedField('secondaryContact.phone', e.target.value)}
              className={styles.input}
              placeholder="+44 XXXX XXXXXX"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Role</label>
            <select
              value={formData.secondaryContact.role}
              onChange={(e) => updateNestedField('secondaryContact.role', e.target.value)}
              className={styles.select}
            >
              <option value="backup">Backup Contact</option>
              <option value="business">Business Contact</option>
              <option value="family">Family Contact</option>
              <option value="legal">Legal Contact</option>
            </select>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Relationship</label>
          <input
            type="text"
            value={formData.secondaryContact.relationship}
            onChange={(e) => updateNestedField('secondaryContact.relationship', e.target.value)}
            className={styles.input}
            placeholder="Relationship to you"
          />
        </div>
      </section>

      {/* Consent Section */}
      <section className={styles.consentSection}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📋</span>
          Data Processing Consent
        </h4>

        <div className={styles.consentGroup}>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              checked={formData.dataConsent.emergencyContactConsent}
              onChange={(e) => updateNestedField('dataConsent.emergencyContactConsent', e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.consentText}>
              <strong>Emergency Contact Consent</strong> <span className={styles.required}>*</span>
              <br />
              I consent to Armora storing and processing my emergency contact information for safety purposes.
            </span>
          </label>
          {errors['dataConsent.emergencyContactConsent'] && (
            <span className={styles.errorMessage}>{errors['dataConsent.emergencyContactConsent']}</span>
          )}
        </div>

        {showMedicalSection && (
          <div className={styles.consentGroup}>
            <label className={styles.consentLabel}>
              <input
                type="checkbox"
                checked={formData.dataConsent.medicalDataConsent}
                onChange={(e) => updateNestedField('dataConsent.medicalDataConsent', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.consentText}>
                <strong>Medical Data Consent</strong> <span className={styles.required}>*</span>
                <br />
                I consent to Armora processing my medical information as special category personal data under GDPR for emergency purposes only.
              </span>
            </label>
            {errors['dataConsent.medicalDataConsent'] && (
              <span className={styles.errorMessage}>{errors['dataConsent.medicalDataConsent']}</span>
            )}
          </div>
        )}

        <div className={styles.consentGroup}>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              checked={formData.dataConsent.dataProcessingConsent}
              onChange={(e) => updateNestedField('dataConsent.dataProcessingConsent', e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.consentText}>
              <strong>Enhanced Security Processing</strong>
              <br />
              I consent to enhanced encryption and security measures for this information.
            </span>
          </label>
        </div>
      </section>

      {/* Privacy Level Settings */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🛡️</span>
          Privacy & Security Level
        </h4>

        <div className={styles.privacyOptions}>
          <label className={styles.privacyOption}>
            <input
              type="radio"
              name="privacyLevel"
              value="minimal"
              checked={formData.privacyLevel === 'minimal'}
              onChange={(e) => updateNestedField('privacyLevel', e.target.value)}
              className={styles.radio}
            />
            <div className={styles.privacyContent}>
              <strong>Minimal</strong>
              <span>Basic emergency contact only</span>
            </div>
          </label>

          <label className={styles.privacyOption}>
            <input
              type="radio"
              name="privacyLevel"
              value="standard"
              checked={formData.privacyLevel === 'standard'}
              onChange={(e) => updateNestedField('privacyLevel', e.target.value)}
              className={styles.radio}
            />
            <div className={styles.privacyContent}>
              <strong>Standard</strong>
              <span>Emergency contacts with optional medical information</span>
            </div>
          </label>

          <label className={styles.privacyOption}>
            <input
              type="radio"
              name="privacyLevel"
              value="comprehensive"
              checked={formData.privacyLevel === 'comprehensive'}
              onChange={(e) => updateNestedField('privacyLevel', e.target.value)}
              className={styles.radio}
            />
            <div className={styles.privacyContent}>
              <strong>Comprehensive</strong>
              <span>Full emergency contact and medical information</span>
            </div>
          </label>
        </div>
      </section>

      {/* Submit Button */}
      <div className={styles.submitSection}>
        <button
          type="button"
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={!formData.dataConsent.emergencyContactConsent}
        >
          Save Emergency Contact Information
        </button>

        <p className={styles.submitNote}>
          <span className={styles.lockIcon}>🔒</span>
          All information is encrypted using AES-256 encryption and stored securely in compliance with GDPR regulations.
        </p>
      </div>
    </div>
  );
}

export default EnhancedEmergencyContacts;