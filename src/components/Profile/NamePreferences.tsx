import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { User } from '../../types';
import { parseFullName, getTitleOptions, getDisplayOptions, getDisplayName } from '../../utils/nameUtils';
import { Button } from '../UI/Button';
import styles from './NamePreferences.module.css';

export function NamePreferences() {
  const { state, setUser } = useApp();
  const { user } = state;

  const [formData, setFormData] = useState({
    preferredName: user?.preferredName || '',
    title: user?.title || 'Mr.' as User['title'],
    nameDisplay: user?.nameDisplay || 'preferred' as User['nameDisplay'],
    legalFirst: user?.legalName?.first || '',
    legalLast: user?.legalName?.last || ''
  });

  const [previewName, setPreviewName] = useState('');
  const [isModified, setIsModified] = useState(false);

  // Parse existing name if no legal name is set
  useEffect(() => {
    if (!user?.legalName && user?.name) {
      const parsed = parseFullName(user.name);
      setFormData(prev => ({
        ...prev,
        legalFirst: parsed.first,
        legalLast: parsed.last
      }));
    }
  }, [user]);

  // Update preview when form changes
  useEffect(() => {
    const mockUser: User = {
      ...user!,
      preferredName: formData.preferredName,
      title: formData.title,
      nameDisplay: formData.nameDisplay,
      legalName: {
        first: formData.legalFirst,
        last: formData.legalLast
      }
    };
    setPreviewName(getDisplayName(mockUser));
  }, [formData, user]);

  // Check if form is modified
  useEffect(() => {
    const isChanged =
      formData.preferredName !== (user?.preferredName || '') ||
      formData.title !== (user?.title || 'Mr.') ||
      formData.nameDisplay !== (user?.nameDisplay || 'preferred') ||
      formData.legalFirst !== (user?.legalName?.first || '') ||
      formData.legalLast !== (user?.legalName?.last || '');
    setIsModified(isChanged);
  }, [formData, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!user || !setUser) return;

    const updatedUser: User = {
      ...user,
      preferredName: formData.preferredName,
      title: formData.title,
      nameDisplay: formData.nameDisplay,
      legalName: {
        first: formData.legalFirst,
        last: formData.legalLast
      }
    };

    setUser(updatedUser);
    setIsModified(false);
  };

  const titleOptions = getTitleOptions();
  const displayOptions = getDisplayOptions();

  if (!user) return null;

  return (
    <div className={styles.namePreferences}>
      <div className={styles.header}>
        <h2 className={styles.title}>Name Preferences</h2>
        <p className={styles.subtitle}>
          Choose how you'd like to be addressed throughout the app
        </p>
      </div>

      <div className={styles.previewCard}>
        <div className={styles.previewLabel}>Current Display:</div>
        <div className={styles.previewName}>Welcome back, {previewName}</div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Legal Name</h3>
        <div className={styles.nameFields}>
          <div className={styles.field}>
            <label className={styles.label}>First Name(s)</label>
            <input
              type="text"
              className={styles.input}
              value={formData.legalFirst}
              onChange={(e) => handleInputChange('legalFirst', e.target.value)}
              placeholder="Enter your legal first name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Last Name</label>
            <input
              type="text"
              className={styles.input}
              value={formData.legalLast}
              onChange={(e) => handleInputChange('legalLast', e.target.value)}
              placeholder="Enter your legal last name"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Display Preferences</h3>

        <div className={styles.field}>
          <label className={styles.label}>Preferred Name (Optional)</label>
          <input
            type="text"
            className={styles.input}
            value={formData.preferredName}
            onChange={(e) => handleInputChange('preferredName', e.target.value)}
            placeholder="e.g., Mo, Ali, or your nickname"
          />
          <p className={styles.fieldHelp}>
            What should we call you? This could be a nickname or shortened version of your name.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <select
            className={styles.select}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          >
            {titleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>How should we address you?</label>
          <div className={styles.radioGroup}>
            {displayOptions.map(option => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="nameDisplay"
                  value={option.value}
                  checked={formData.nameDisplay === option.value}
                  onChange={(e) => handleInputChange('nameDisplay', e.target.value)}
                  className={styles.radio}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioLabel}>{option.label}</div>
                  <div className={styles.radioDescription}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={!isModified}
          isFullWidth
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}