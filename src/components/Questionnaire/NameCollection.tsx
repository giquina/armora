import React, { useState, useEffect, useRef } from 'react';
import styles from './NameCollection.module.css';

interface NameCollectionProps {
  userName: string;
  onNameChange: (name: string) => void;
  className?: string;
}

export function NameCollection({ userName, onNameChange, className = '' }: NameCollectionProps) {
  const [localName, setLocalName] = useState(userName);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Helper: detect mobile without relying on viewport width (DevTools can shrink width on desktop)
  const isMobile = () => {
    const ua = navigator.userAgent || '';
    const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const touchMobile = navigator.maxTouchPoints > 1 && /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    return uaMobile || touchMobile;
  };
  
  // Autofocus input on desktop only (avoid mobile keyboard popup)
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !isMobile()) {
        try {
          // Focus without scrolling the page
          inputRef.current.focus({ preventScroll: true } as any);
          // Set cursor position to the beginning for new input, or end for existing content
          const cursorPos = inputRef.current.value.length;
          inputRef.current.setSelectionRange(cursorPos, cursorPos);
        } catch (error) {
          console.log('Focus attempt failed:', error);
        }
      }
    };

    // Try immediate focus first
    focusInput();
    
    // Also try with a small delay to handle any rendering delays
    const timer = setTimeout(focusInput, 150);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setLocalName(name);
  };

  const handleInputClick = () => {
    // Ensure proper cursor positioning for both mobile and desktop
    if (inputRef.current) {
      if (!isMobile()) {
        inputRef.current.focus({ preventScroll: true } as any);
      }
      // Set cursor to appropriate position (beginning for empty, end for existing content)
      setTimeout(() => {
        if (inputRef.current) {
          const cursorPos = inputRef.current.value.length;
          inputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      }, 0);
    }
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
          ref={inputRef}
          type="text"
          placeholder="Your preferred name (optional)"
          value={localName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
          className={styles.nameInput}
          maxLength={50}
          autoComplete="given-name"
          aria-label="Your preferred name for personalization"
          autoFocus={!isMobile()}
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