import React, { useState } from 'react';
import styles from './NameCollection.module.css';

interface NameCollectionProps {
  userName: string;
  onNameChange: (name: string) => void;
  className?: string;
}

export function NameCollection({ userName, onNameChange, className = '' }: NameCollectionProps) {
  const [localName, setLocalName] = useState(userName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setLocalName(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNameChange(localName.trim());
    }
  };

  return (
    <div className={`${styles.nameCollectionSection} ${className}`}>
      <div className={styles.welcomeHeader}>
        <h2>Welcome to Armora Security Transport</h2>
        <p>To personalize your security assessment, what would you like us to call you?</p>
      </div>
      
      <div className={styles.nameInputContainer}>
        <input 
          type="text"
          placeholder="Your preferred name (optional)"
          value={localName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          className={styles.nameInput}
          maxLength={50}
        />
        <div>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={() => onNameChange(localName.trim())}
            disabled={!localName.trim()}
          >
            Confirm
          </button>
        </div>
        <div className={styles.privacyNote}>
          <small>This helps us personalize your questionnaire. You can skip this if you prefer maximum privacy.</small>
        </div>
      </div>
    </div>
  );
}