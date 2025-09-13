import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import styles from './SignupForm.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
}

export function SignupForm() {
  const { navigateToView, setUser, setLoading, updateQuestionnaireData } = useApp();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  // Animation state
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score++;
    else suggestions.push('Use at least 8 characters');

    if (/[A-Z]/.test(password)) score++;
    else suggestions.push('Add uppercase letters');

    if (/[a-z]/.test(password)) score++;
    else suggestions.push('Add lowercase letters');

    if (/\d/.test(password)) score++;
    else suggestions.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else suggestions.push('Add special characters');

    const strengthLevels = [
      { label: 'Very Weak', color: '#ff4444' },
      { label: 'Weak', color: '#ff8800' },
      { label: 'Fair', color: '#ffaa00' },
      { label: 'Good', color: '#88cc00' },
      { label: 'Strong', color: '#00aa00' }
    ];

    return {
      score,
      ...strengthLevels[Math.min(score, 4)],
      suggestions: suggestions.slice(0, 2) // Show max 2 suggestions
    };
  };

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = ['acceptTerms', 'acceptMarketing'].includes(field) 
      ? e.target.checked 
      : e.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful signup
      const user = {
        id: '1',
        email: formData.email,
        name: formData.name,
        isAuthenticated: true,
        userType: 'registered' as const,
        hasCompletedQuestionnaire: false,
        hasUnlockedReward: false,
        createdAt: new Date()
      };

      setUser(user);
      navigateToView('questionnaire');
      
    } catch (error) {
      setErrors({ general: 'Account creation failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Development-only bypass function
  const handleDevSkipSignup = () => {
    console.log('🚀 [DEV] Starting signup bypass...');
    console.log('🚀 [DEV] Current environment:', process.env.NODE_ENV);
    
    // Create mock user (WITHOUT completed questionnaire to allow normal flow)
    const mockUser = {
      id: 'dev-user-signup-123',
      name: 'Dev Test User',
      email: 'dev@armora.test',
      isAuthenticated: true,
      userType: 'registered' as const,
      hasCompletedQuestionnaire: false, // Changed to false to allow questionnaire flow
      hasUnlockedReward: false,
      createdAt: new Date()
    };
    console.log('🚀 [DEV] Setting mock user:', mockUser);
    setUser(mockUser);

    // Create mock questionnaire data (same as WelcomePage skip)
    const mockQuestionnaireData = {
      step1_transportProfile: 'executive-business',
      step2_travelFrequency: 'weekly',
      step3_serviceRequirements: ['professional-security', 'premium-vehicles', 'punctuality'],
      step4_primaryCoverage: ['london', 'birmingham'],
      step5_secondaryCoverage: ['manchester'],
      step6_safetyContact: {
        name: 'Priority Contact',
        phone: '+44 7700 900000',
        relationship: 'spouse'
      },
      step7_specialRequirements: ['wheelchair-accessible'],
      step8_contactPreferences: {
        email: 'dev@armora.test',
        phone: '+44 7700 900000',
        notifications: ['booking-updates', 'driver-arrival']
      },
      step9_profileReview: true,
      completedAt: new Date(),
      recommendedService: 'executive',
      conversionAttempts: 0
    };
    console.log('🚀 [DEV] Setting questionnaire data:', mockQuestionnaireData);
    updateQuestionnaireData(mockQuestionnaireData);

    // Navigate to questionnaire (following normal signup flow)
    console.log('🚀 [DEV] Navigating to questionnaire (normal flow)...');
    navigateToView('questionnaire');
    console.log('🚀 [DEV] Navigation complete!');
  };

  // Development-only function to skip directly to dashboard
  const handleDevSkipToDashboard = () => {
    console.log('🚀 [DEV] FULL SKIP - Going directly to dashboard...');
    
    // Create mock user WITH completed questionnaire
    const mockUser = {
      id: 'dev-user-dashboard-123',
      name: 'Dashboard Test User',
      email: 'dashboard@armora.test',
      isAuthenticated: true,
      userType: 'registered' as const,
      hasCompletedQuestionnaire: true, // Set to true for dashboard access
      hasUnlockedReward: true,
      createdAt: new Date()
    };
    console.log('🚀 [DEV] Setting dashboard-ready user:', mockUser);
    setUser(mockUser);

    // Create mock questionnaire data
    const mockQuestionnaireData = {
      step1_transportProfile: 'executive-business',
      step2_travelFrequency: 'weekly',
      step3_serviceRequirements: ['professional-security', 'premium-vehicles', 'punctuality'],
      step4_primaryCoverage: ['london', 'birmingham'],
      step5_secondaryCoverage: ['manchester'],
      step6_safetyContact: {
        name: 'Priority Contact',
        phone: '+44 7700 900000',
        relationship: 'spouse'
      },
      step7_specialRequirements: ['wheelchair-accessible'],
      step8_contactPreferences: {
        email: 'dashboard@armora.test',
        phone: '+44 7700 900000',
        notifications: ['booking-updates', 'driver-arrival']
      },
      step9_profileReview: true,
      completedAt: new Date(),
      recommendedService: 'executive',
      conversionAttempts: 0
    };
    console.log('🚀 [DEV] Setting complete questionnaire data:', mockQuestionnaireData);
    updateQuestionnaireData(mockQuestionnaireData);

    // Navigate directly to dashboard
    console.log('🚀 [DEV] Navigating directly to dashboard...');
    navigateToView('dashboard');
    console.log('🚀 [DEV] Full skip complete!');
  };

  return (
    <div className={styles.signupPage}>
      <div className={`${styles.signupContainer} ${showContent ? styles.visible : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <ArmoraLogo 
            size="medium" 
            showOrbits={false}
            variant="animated"
            className={styles.logo}
          />
          <h1 className={styles.title}>Join Armora</h1>
          <p className={styles.subtitle}>Create your premium security transport account</p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.general && (
            <div className={styles.errorMessage}>
              <svg className={styles.errorIcon} viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {errors.general}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Your full name"
              disabled={isSubmitting}
              autoComplete="name"
              autoFocus
            />
            {errors.name && (
              <span className={styles.fieldError}>{errors.name}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              placeholder="+44 7700 900123"
              disabled={isSubmitting}
              autoComplete="tel"
            />
            {errors.phone && (
              <span className={styles.fieldError}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Create a strong password"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  {showPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" fill="none"/>
                  ) : (
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  )}
                </svg>
              </button>
            </div>
            
            {passwordStrength && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div 
                    className={styles.strengthProgress} 
                    style={{ 
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  />
                </div>
                <div className={styles.strengthInfo}>
                  <span 
                    className={styles.strengthLabel}
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                  {passwordStrength.suggestions.length > 0 && (
                    <ul className={styles.suggestions}>
                      {passwordStrength.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Confirm your password"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  {showConfirmPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" fill="none"/>
                  ) : (
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.fieldError}>{errors.confirmPassword}</span>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <span className={styles.checkboxText}>
                I accept the <button type="button" className={styles.link}>Terms of Service</button> and <button type="button" className={styles.link}>Privacy Policy</button>
              </span>
            </label>
            {errors.acceptTerms && (
              <span className={styles.fieldError}>{errors.acceptTerms}</span>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.acceptMarketing}
                onChange={handleInputChange('acceptMarketing')}
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <span className={styles.checkboxText}>
                Send me updates about new services and exclusive offers (optional)
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isFullWidth
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? (
              <>
                <svg className={styles.spinner} viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="31.416;0" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Development-only skip buttons */}
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.devButtonContainer}>
            <div className={styles.devButtonGrid}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔴 DEV BUTTON - NORMAL FLOW!');
                  handleDevSkipSignup();
                }}
                className={styles.devSkipButton}
              >
                📝 SKIP TO QUESTIONNAIRE
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔴 DEV BUTTON - FULL SKIP!');
                  handleDevSkipToDashboard();
                }}
                className={styles.devSkipButton}
              >
                🚀 SKIP TO DASHBOARD
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <Button
            variant="outline"
            size="md"
            isFullWidth
            onClick={() => navigateToView('login')}
            disabled={isSubmitting}
            className={styles.loginButton}
          >
            Sign In to Existing Account
          </Button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigateToView('welcome')}
            disabled={isSubmitting}
          >
            ← Back to Welcome
          </button>
        </footer>
      </div>
    </div>
  );
}