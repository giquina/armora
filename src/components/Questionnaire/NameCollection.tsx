import React, { useState, useEffect, useRef } from 'react';
import { NameConfirmationModal } from './NameConfirmationModal';
import { useApp } from '../../contexts/AppContext';
import { 
  getUserStatus, 
  getUserData, 
  saveUserData, 
  recordVisit, 
  markAssessmentStarted,
  UserStatus 
} from '../../utils/userStatus';
import styles from './NameCollection.module.css';

interface NameCollectionProps {
  userName: string;
  onNameChange: (name: string) => void;
  className?: string;
}

export function NameCollection({ userName, onNameChange, className = '' }: NameCollectionProps) {
  const { state, updateQuestionnaireData } = useApp();
  const [localName, setLocalName] = useState(userName);
  const [showModal, setShowModal] = useState(false);
  const [confirmedName, setConfirmedName] = useState('');
  const [isNameUpdate, setIsNameUpdate] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>('NEW_USER');
  const [, setUserDataState] = useState(getUserData());
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Helper: detect mobile without relying on viewport width (DevTools can shrink width on desktop)
  const isMobile = () => {
    const ua = navigator.userAgent || '';
    const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const touchMobile = navigator.maxTouchPoints > 1 && /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    return uaMobile || touchMobile;
  };
  
  // Initialize user status and record visit
  useEffect(() => {
    recordVisit();
    const status = getUserStatus();
    const data = getUserData();
    setUserStatus(status);
    setUserDataState(data);
    
    // Set initial name if user is returning
    if (data.userName && !localName) {
      setLocalName(data.userName);
      setConfirmedName(data.userName);
    }
  }, [localName]);

  // Autofocus input on desktop only (avoid mobile keyboard popup)
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !isMobile() && userStatus === 'NEW_USER') {
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
  }, [userStatus]);

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
      handleConfirmName();
    }
  };

  const handleConfirmName = () => {
    const trimmedName = localName.trim();
    
    // Validation
    if (trimmedName.length < 2) {
      alert('Name must be at least 2 characters');
      return;
    }
    
    if (trimmedName.length > 50) {
      alert('Name must be no more than 50 characters');
      return;
    }
    
    // Check if this is an update
    setIsNameUpdate(confirmedName.length > 0);
    setConfirmedName(trimmedName);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    onNameChange(confirmedName);
    
    // Store name confirmation in context
    const updatedPersonalization = {
      ...state.questionnaireData,
      firstName: confirmedName,
      nameConfirmed: true,
      nameConfirmationTimestamp: new Date().toISOString(),
      skippedNameEntry: false
    };
    
    updateQuestionnaireData(updatedPersonalization);
    
    // Update user data with new status system
    saveUserData({
      userName: confirmedName,
      skipNamePrompt: false
    });
    
    // Mark assessment as started
    markAssessmentStarted(1);
    
    // Update local state
    setUserDataState(getUserData());
    setUserStatus(getUserStatus());
    
    // Legacy localStorage for backward compatibility
    localStorage.setItem('armora_user_name', confirmedName);
    localStorage.setItem('armora_name_confirmed', 'true');
    localStorage.setItem('armora_name_confirmation_timestamp', new Date().toISOString());
    
    // Show interactive success notification
    setTimeout(() => {
      // Create notification container
      const notification = document.createElement('div');
      notification.id = 'armora-name-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: linear-gradient(135deg, #FFD700 0%, #e6c200 100%);
        color: #1a1a2e;
        border-radius: 12px;
        border: 2px solid #FFD700;
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);
        animation: slideInRightGold 0.5s ease-out;
        transition: all 0.3s ease;
      `;

      // Create notification content
      notification.innerHTML = `
        <div style="padding: 16px 20px 12px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">✓</span>
              <span style="font-weight: 700; font-size: 16px;">Name Saved Successfully</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <button id="minimize-btn" style="
                background: rgba(26, 26, 46, 0.2);
                border: none;
                border-radius: 4px;
                color: #1a1a2e;
                cursor: pointer;
                font-size: 14px;
                padding: 4px 8px;
                font-weight: 600;
              " title="Minimize">−</button>
              <button id="close-btn" style="
                background: rgba(26, 26, 46, 0.2);
                border: none;
                border-radius: 4px;
                color: #1a1a2e;
                cursor: pointer;
                font-size: 14px;
                padding: 4px 8px;
                font-weight: 600;
              " title="Close">×</button>
            </div>
          </div>
          <div style="font-size: 14px; color: rgba(26, 26, 46, 0.85); margin-bottom: 12px; line-height: 1.4;">
            Your name "${confirmedName}" has been saved and will be used throughout your security assessment.
          </div>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button id="ok-btn" style="
              flex: 1;
              background: #1a1a2e;
              color: #FFD700;
              border: 2px solid rgba(255, 215, 0, 0.3);
              border-radius: 8px;
              padding: 10px 16px;
              font-weight: 700;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.25s ease-out;
            ">Got it!</button>
          </div>
          <div id="auto-dismiss" style="
            font-size: 11px; 
            color: rgba(26, 26, 46, 0.65); 
            text-align: center; 
            margin-top: 8px;
            font-weight: 600;
          ">Auto-closes in <span id="countdown">15</span>s</div>
        </div>
      `;

      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInRightGold {
          from { 
            transform: translateX(100%) scale(0.9); 
            opacity: 0;
            filter: blur(2px);
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1;
            filter: blur(0);
          }
        }
        @keyframes minimizeNotification {
          from { 
            height: auto;
            width: 320px;
          }
          to { 
            height: 60px;
            width: 280px;
          }
        }
        @keyframes fadeOutGold {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(20px) scale(0.95); }
        }
        #armora-name-notification button:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }
        #ok-btn:hover {
          background: #252544 !important;
          border-color: #FFD700 !important;
          color: #e6c200 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(notification);

      let isMinimized = false;
      let countdownTimer = 15;
      let countdownInterval: NodeJS.Timeout;

      // Cleanup function
      const cleanupNotification = () => {
        if (countdownInterval) clearInterval(countdownInterval);
        notification.style.animation = 'fadeOutGold 0.4s ease-in';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        }, 400);
      };

      // Button event handlers
      const minimizeBtn = notification.querySelector('#minimize-btn') as HTMLButtonElement;
      const closeBtn = notification.querySelector('#close-btn') as HTMLButtonElement;
      const okBtn = notification.querySelector('#ok-btn') as HTMLButtonElement;
      const countdownSpan = notification.querySelector('#countdown') as HTMLSpanElement;

      minimizeBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
          notification.style.animation = 'minimizeNotification 0.3s ease-out forwards';
          notification.innerHTML = `
            <div style="padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">✓</span>
                <span style="font-weight: 600; font-size: 14px;">Name saved</span>
              </div>
              <button id="restore-btn" style="
                background: rgba(26, 26, 46, 0.2);
                border: none;
                border-radius: 4px;
                color: #1a1a2e;
                cursor: pointer;
                font-size: 14px;
                padding: 4px 8px;
                font-weight: 600;
              " title="Restore">+</button>
            </div>
          `;
          const restoreBtn = notification.querySelector('#restore-btn') as HTMLButtonElement;
          restoreBtn.addEventListener('click', () => window.location.reload());
        }
      });

      closeBtn.addEventListener('click', cleanupNotification);
      okBtn.addEventListener('click', cleanupNotification);

      // Countdown timer
      countdownInterval = setInterval(() => {
        countdownTimer--;
        if (countdownSpan) {
          countdownSpan.textContent = countdownTimer.toString();
        }
        if (countdownTimer <= 0) {
          cleanupNotification();
        }
      }, 1000);

      // Pause countdown on hover
      notification.addEventListener('mouseenter', () => {
        if (countdownInterval) clearInterval(countdownInterval);
      });

      notification.addEventListener('mouseleave', () => {
        if (countdownTimer > 0) {
          countdownInterval = setInterval(() => {
            countdownTimer--;
            if (countdownSpan) {
              countdownSpan.textContent = countdownTimer.toString();
            }
            if (countdownTimer <= 0) {
              cleanupNotification();
            }
          }, 1000);
        }
      });

    }, 500);
  };

  const handleModalSkip = () => {
    setShowModal(false);
    setLocalName('');
    setConfirmedName('');
    
    // Store skip information in context
    const updatedPersonalization = {
      ...state.questionnaireData,
      firstName: undefined,
      nameConfirmed: false,
      nameConfirmationTimestamp: undefined,
      skippedNameEntry: true
    };
    
    updateQuestionnaireData(updatedPersonalization);
    
    // Update user data
    saveUserData({
      userName: null,
      skipNamePrompt: true
    });
    
    // Mark assessment as started even if skipped name
    markAssessmentStarted(1);
    
    // Legacy localStorage for backward compatibility
    localStorage.removeItem('armora_user_name');
    localStorage.setItem('armora_name_confirmed', 'false');
    localStorage.setItem('armora_name_skipped', 'true');
  };

  return (
    <div className={`${styles.nameCollectionSection} ${className}`}>
      <div className={styles.welcomeHeader}>
        <h2 className={styles.welcomeTitle}>
          {userStatus === 'NEW_USER' ? 'Welcome to Armora!' : 'Welcome back!'}
        </h2>
        <p className={styles.welcomeSubtitle}>
          Let's get started with your personalized security assessment
        </p>
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
            onClick={handleConfirmName}
            disabled={!localName.trim() || localName.trim().length < 2}
          >
            Confirm
          </button>
        </div>
        <div className={styles.privacyNote}>
          <small>This helps us personalize your questionnaire. You can skip this if you prefer maximum privacy.</small>
        </div>
      </div>
      
      {/* Name Confirmation Modal */}
      <NameConfirmationModal
        name={confirmedName}
        isOpen={showModal}
        onConfirm={handleModalConfirm}
        onSkip={handleModalSkip}
        isNameUpdate={isNameUpdate}
      />
    </div>
  );
}