import React, { useState, useEffect } from 'react';
import styles from './SevenPsAssessment.module.css';

// Seven Ps Framework Interfaces
export interface IPeopleAssessment {
  family: {
    spouse?: {
      name: string;
      requiresProtection: boolean;
      riskFactors: string[];
    };
    children?: Array<{
      name: string;
      age: number;
      school?: string;
      requiresProtection: boolean;
    }>;
    requiredFamilyProtection: boolean;
  };
  associates: {
    businessPartners: string[];
    householdStaff: string[];
    regularContacts: string[];
  };
  threats: {
    knownAdversaries: string[];
    disgruntledAssociates: string[];
    stalkers: string[];
    specificThreats: string[];
  };
}

export interface IPlacesAssessment {
  residence: {
    type: 'house' | 'apartment' | 'estate' | 'other';
    securityFeatures: string[];
    vulnerabilities: string[];
    address?: string; // Optional for privacy
  };
  workplace: {
    address: string;
    accessControl: boolean;
    securityTeam: boolean;
    threatLevel: 'low' | 'medium' | 'high';
  };
  frequentLocations: Array<{
    type: string;
    address: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  travelPatterns: {
    domestic: string[];
    international: string[];
    highRiskAreas: string[];
    predictability: 'highly_predictable' | 'somewhat_predictable' | 'unpredictable';
  };
}

export interface IPersonalityAssessment {
  riskTolerance: 'low' | 'medium' | 'high';
  complianceLevel: 'excellent' | 'good' | 'challenging';
  publicInteraction: 'minimal' | 'controlled' | 'frequent';
  socialMedia: {
    platforms: string[];
    activityLevel: 'low' | 'medium' | 'high';
    controversial: boolean;
    locationSharing: boolean;
  };
  communicationStyle: 'direct' | 'diplomatic' | 'private';
}

export interface IPrejudiceAssessment {
  businessConflicts: string[];
  ideologicalOpposition: string[];
  culturalSensitivities: string[];
  publicStances: string[];
  religiousConsiderations: string[];
  politicalAffiliations: string[];
}

export interface IPersonalHistoryAssessment {
  previousIncidents: Array<{
    date: string;
    type: 'threat' | 'harassment' | 'physical' | 'cyber' | 'stalking' | 'other';
    description: string;
    outcome: string;
    ongoing: boolean;
    reportedToPolice: boolean;
  }>;
  lawEnforcement: {
    reports: boolean;
    cooperation: 'full' | 'partial' | 'none';
    restrictions: string[];
    ongoingInvestigations: boolean;
  };
  securityHistory: {
    previousSecurityTeam?: string;
    reasonForChange?: string;
    effectiveness: 'excellent' | 'good' | 'poor' | 'na';
  };
}

export interface IPoliticalAssessment {
  publicProfile: boolean;
  controversialViews: boolean;
  activism: boolean;
  oppositionGroups: string[];
  publicOffice: boolean;
  politicalExposure: 'none' | 'local' | 'national' | 'international';
  religiousLeadership: boolean;
}

export interface ILifestyleAssessment {
  highRiskActivities: string[];
  socialActivities: {
    frequency: 'rare' | 'occasional' | 'regular' | 'frequent';
    venues: string[];
    publicEvents: boolean;
  };
  healthConsiderations: {
    mobilityIssues: boolean;
    medicalEquipment: boolean;
    regularTreatments: boolean;
    emergencyProtocols: string[];
  };
  financialProfile: {
    publicWealth: boolean;
    businessOwnership: boolean;
    highValueAssets: boolean;
    financialDisputes: boolean;
  };
  travelStyle: {
    accommodation: 'budget' | 'standard' | 'luxury' | 'exclusive';
    transportation: 'public' | 'private' | 'mixed';
    scheduleFlexibility: 'rigid' | 'flexible' | 'unpredictable';
  };
}

export interface ISevenPsAssessment {
  people: IPeopleAssessment;
  places: IPlacesAssessment;
  personality: IPersonalityAssessment;
  prejudices: IPrejudiceAssessment;
  personalHistory: IPersonalHistoryAssessment;
  political: IPoliticalAssessment;
  privateLifestyle: ILifestyleAssessment;
  completionLevel: 'basic' | 'standard' | 'comprehensive';
  riskLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  assessmentDate: string;
}

interface SevenPsAssessmentProps {
  initialData?: Partial<ISevenPsAssessment>;
  assessmentLevel: 'basic' | 'standard' | 'comprehensive';
  onComplete: (assessment: ISevenPsAssessment) => void;
  onProgressUpdate?: (progress: number) => void;
}

const ASSESSMENT_MODULES = {
  basic: ['people', 'places', 'personality'],
  standard: ['people', 'places', 'personality', 'personalHistory', 'political'],
  comprehensive: ['people', 'places', 'personality', 'prejudices', 'personalHistory', 'political', 'privateLifestyle']
};

export function SevenPsAssessment({
  initialData,
  assessmentLevel,
  onComplete,
  onProgressUpdate
}: SevenPsAssessmentProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Partial<ISevenPsAssessment>>({
    completionLevel: assessmentLevel,
    assessmentDate: new Date().toISOString(),
    ...initialData
  });

  const activeModules = ASSESSMENT_MODULES[assessmentLevel];
  const totalModules = activeModules.length;

  // Update progress
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate((currentModule / totalModules) * 100);
    }
  }, [currentModule, totalModules, onProgressUpdate]);

  const handleModuleComplete = (moduleData: any) => {
    const moduleName = activeModules[currentModule];
    const updatedData = {
      ...assessmentData,
      [moduleName]: moduleData
    };

    setAssessmentData(updatedData);

    if (currentModule < totalModules - 1) {
      setCurrentModule(currentModule + 1);
    } else {
      // Assessment complete
      onComplete(updatedData as ISevenPsAssessment);
    }
  };

  const handleBack = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  const getCurrentModuleComponent = () => {
    const moduleName = activeModules[currentModule];

    switch (moduleName) {
      case 'people':
        return (
          <PeopleModule
            data={assessmentData.people}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      case 'places':
        return (
          <PlacesModule
            data={assessmentData.places}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      case 'personality':
        return (
          <PersonalityModule
            data={assessmentData.personality}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      case 'prejudices':
        return (
          <PrejudicesModule
            data={assessmentData.prejudices}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      case 'personalHistory':
        return (
          <PersonalHistoryModule
            data={assessmentData.personalHistory}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      case 'political':
        return (
          <PoliticalModule
            data={assessmentData.political}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      case 'privateLifestyle':
        return (
          <LifestyleModule
            data={assessmentData.privateLifestyle}
            onComplete={handleModuleComplete}
            assessmentLevel={assessmentLevel}
          />
        );
      default:
        return <div>Unknown module</div>;
    }
  };

  const getModuleTitle = () => {
    const moduleName = activeModules[currentModule];
    const titles = {
      people: 'People & Relationships',
      places: 'Places & Locations',
      personality: 'Personality & Behavior',
      prejudices: 'Potential Conflicts',
      personalHistory: 'Personal History',
      political: 'Political & Religious Views',
      privateLifestyle: 'Private Lifestyle'
    };
    return titles[moduleName as keyof typeof titles] || '';
  };

  return (
    <div className={styles.container}>
      {/* Progress Header */}
      <div className={styles.progressHeader}>
        <h2 className={styles.title}>Professional Security Assessment</h2>
        <div className={styles.progressInfo}>
          <span className={styles.moduleProgress}>
            {getModuleTitle()} ({currentModule + 1} of {totalModules})
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentModule + 1) / totalModules) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Module */}
      <div className={styles.moduleContainer}>
        {getCurrentModuleComponent()}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {currentModule > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
          >
            ← Previous
          </button>
        )}

        <div className={styles.moduleIndicators}>
          {activeModules.map((module, index) => (
            <div
              key={module}
              className={`${styles.moduleIndicator} ${
                index === currentModule ? styles.active :
                index < currentModule ? styles.completed : styles.pending
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual module components (simplified for brevity)
function PeopleModule({ data, onComplete, assessmentLevel }: any) {
  const [formData, setFormData] = useState<IPeopleAssessment>(data || {
    family: { requiredFamilyProtection: false },
    associates: { businessPartners: [], householdStaff: [], regularContacts: [] },
    threats: { knownAdversaries: [], disgruntledAssociates: [], stalkers: [], specificThreats: [] }
  });

  return (
    <div className={styles.moduleContent}>
      <div className={styles.moduleHeader}>
        <h3>👥 People & Relationships Assessment</h3>
        <p>Understanding your personal and professional relationships helps identify potential vulnerabilities and protection requirements.</p>
      </div>

      {/* Family Information */}
      <section className={styles.section}>
        <h4>Family Considerations</h4>

        <div className={styles.fieldGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.family.requiredFamilyProtection}
              onChange={(e) => setFormData({
                ...formData,
                family: { ...formData.family, requiredFamilyProtection: e.target.checked }
              })}
            />
            <span>Family members require protection coordination</span>
          </label>
        </div>

        {assessmentLevel !== 'basic' && (
          <div className={styles.fieldGroup}>
            <label>Business Associates (Optional)</label>
            <textarea
              placeholder="List key business partners, colleagues, or associates who may be relevant to your security"
              rows={3}
              className={styles.textarea}
            />
          </div>
        )}
      </section>

      <div className={styles.moduleActions}>
        <button
          type="button"
          onClick={() => onComplete(formData)}
          className={styles.continueButton}
        >
          Continue to Places Assessment
        </button>
      </div>
    </div>
  );
}

function PlacesModule({ data, onComplete, assessmentLevel }: any) {
  const [formData, setFormData] = useState<IPlacesAssessment>(data || {
    residence: { type: 'house', securityFeatures: [], vulnerabilities: [] },
    workplace: { address: '', accessControl: false, securityTeam: false, threatLevel: 'low' },
    frequentLocations: [],
    travelPatterns: { domestic: [], international: [], highRiskAreas: [], predictability: 'somewhat_predictable' }
  });

  return (
    <div className={styles.moduleContent}>
      <div className={styles.moduleHeader}>
        <h3>📍 Places & Locations Assessment</h3>
        <p>Understanding your regular locations and travel patterns helps plan secure routes and identify potential risks.</p>
      </div>

      {/* Workplace Information */}
      <section className={styles.section}>
        <h4>Workplace Security</h4>

        <div className={styles.fieldGroup}>
          <label>
            <input
              type="checkbox"
              checked={formData.workplace.accessControl}
              onChange={(e) => setFormData({
                ...formData,
                workplace: { ...formData.workplace, accessControl: e.target.checked }
              })}
            />
            <span>Workplace has access control systems</span>
          </label>
        </div>

        <div className={styles.fieldGroup}>
          <label>
            <input
              type="checkbox"
              checked={formData.workplace.securityTeam}
              onChange={(e) => setFormData({
                ...formData,
                workplace: { ...formData.workplace, securityTeam: e.target.checked }
              })}
            />
            <span>Workplace has security team/personnel</span>
          </label>
        </div>
      </section>

      {/* Travel Patterns */}
      <section className={styles.section}>
        <h4>Travel Predictability</h4>

        <div className={styles.radioGroup}>
          {[
            { value: 'highly_predictable', label: 'Highly Predictable - Same routes/times daily' },
            { value: 'somewhat_predictable', label: 'Somewhat Predictable - Regular patterns with variations' },
            { value: 'unpredictable', label: 'Unpredictable - Frequently changing routes and schedules' }
          ].map(option => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="predictability"
                value={option.value}
                checked={formData.travelPatterns.predictability === option.value}
                onChange={(e) => setFormData({
                  ...formData,
                  travelPatterns: { ...formData.travelPatterns, predictability: e.target.value as any }
                })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className={styles.moduleActions}>
        <button
          type="button"
          onClick={() => onComplete(formData)}
          className={styles.continueButton}
        >
          Continue to Personality Assessment
        </button>
      </div>
    </div>
  );
}

function PersonalityModule({ data, onComplete, assessmentLevel }: any) {
  const [formData, setFormData] = useState<IPersonalityAssessment>(data || {
    riskTolerance: 'medium',
    complianceLevel: 'good',
    publicInteraction: 'controlled',
    socialMedia: { platforms: [], activityLevel: 'low', controversial: false, locationSharing: false },
    communicationStyle: 'diplomatic'
  });

  return (
    <div className={styles.moduleContent}>
      <div className={styles.moduleHeader}>
        <h3>🎭 Personality & Behavior Assessment</h3>
        <p>Understanding your behavioral preferences helps match you with compatible protection officers and security protocols.</p>
      </div>

      {/* Risk Tolerance */}
      <section className={styles.section}>
        <h4>Risk Tolerance</h4>
        <div className={styles.radioGroup}>
          {[
            { value: 'low', label: 'Low - Prefer maximum security measures' },
            { value: 'medium', label: 'Medium - Balance security with convenience' },
            { value: 'high', label: 'High - Minimal security disruption preferred' }
          ].map(option => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="riskTolerance"
                value={option.value}
                checked={formData.riskTolerance === option.value}
                onChange={(e) => setFormData({
                  ...formData,
                  riskTolerance: e.target.value as any
                })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Public Interaction */}
      <section className={styles.section}>
        <h4>Public Interaction Level</h4>
        <div className={styles.radioGroup}>
          {[
            { value: 'minimal', label: 'Minimal - Avoid public attention' },
            { value: 'controlled', label: 'Controlled - Managed public appearances' },
            { value: 'frequent', label: 'Frequent - Regular public engagement' }
          ].map(option => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="publicInteraction"
                value={option.value}
                checked={formData.publicInteraction === option.value}
                onChange={(e) => setFormData({
                  ...formData,
                  publicInteraction: e.target.value as any
                })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className={styles.moduleActions}>
        <button
          type="button"
          onClick={() => onComplete(formData)}
          className={styles.continueButton}
        >
          {assessmentLevel === 'basic' ? 'Complete Assessment' : 'Continue to History Assessment'}
        </button>
      </div>
    </div>
  );
}

// Simplified additional modules for comprehensive assessments
function PrejudicesModule({ data, onComplete }: any) { /* Implementation */ return null; }
function PersonalHistoryModule({ data, onComplete }: any) { /* Implementation */ return null; }
function PoliticalModule({ data, onComplete }: any) { /* Implementation */ return null; }
function LifestyleModule({ data, onComplete }: any) { /* Implementation */ return null; }

export default SevenPsAssessment;