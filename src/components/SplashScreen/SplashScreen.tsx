import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import styles from './SplashScreen.module.css';

const SecurityStatus = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const securityMessages = useMemo(() => [
    "Connecting you with licensed security professionals...",
    "Verifying SIA-certified protection officers...",
    "Preparing your secure travel experience...",
    "Setting up transparent pricing details...",
    "Confirming your protection service level...",
    "Ready to keep you safe..."
  ], []);

  useEffect(() => {
    const message = securityMessages[messageIndex];
    let charIndex = 0;
    setDisplayText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
        
        setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % securityMessages.length);
        }, 800);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [messageIndex, securityMessages]);

  return (
    <div className={styles.securityStatus}>
      <span className={styles.statusText}>{displayText}</span>
      {isTyping && <span className={styles.cursor}>|</span>}
    </div>
  );
};

export function SplashScreen() {
  const { navigateToView } = useApp();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    console.log('🚀 SplashScreen mounted, starting 4-second timer...');
    const timer = setTimeout(() => {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        console.log('⏰ Timer completed, navigating to welcome page...');
        navigateToView('welcome');
      }
    }, 4000);

    return () => {
      console.log('🧹 SplashScreen unmounting, clearing timer...');
      clearTimeout(timer);
    };
  // Run once on mount; avoid resetting timer if context updates change function identities
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.splashScreen}>
      {/* Immersive Background Effects */}
      <div className={styles.splashImmersiveBg}>
        <div className={styles.securityGrid}></div>
        {/* Security particles */}
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
        <div className={styles.securityParticle}></div>
      </div>

      <div className={styles.content}>
        {/* Premium 4D Logo with Advanced Effects */}
        <ArmoraLogo 
          size="hero" 
          variant="animated" 
          showOrbits={true} 
          className={styles.splashLogo}
        />

        {/* Spectacular "ARMORA" Text Animation */}
        <h1 className={styles.armoraTitleAnimated}>
          <div className={styles.letterContainer}>
            <span className={styles.letter} data-letter="A">A</span>
          </div>
          <div className={styles.letterContainer}>
            <span className={styles.letter} data-letter="R">R</span>
          </div>
          <div className={styles.letterContainer}>
            <span className={styles.letter} data-letter="M">M</span>
          </div>
          <div className={styles.letterContainer}>
            <span className={styles.letter} data-letter="O">O</span>
          </div>
          <div className={styles.letterContainer}>
            <span className={styles.letter} data-letter="R">R</span>
          </div>
          <div className={styles.letterContainer}>
            <span className={styles.letter} data-letter="A">A</span>
          </div>
        </h1>

        {/* Enhanced Tagline */}
        <p className={styles.taglineEnhanced}>
          Professional Close Protection Services
        </p>

        {/* Advanced Security Loading System */}
        <div className={styles.securityLoadingContainer}>
          {/* Biometric scanner effect */}
          <div className={styles.biometricScanner}>
            <div className={styles.scannerBeam}></div>
          </div>
          
          {/* Progress segments with data encryption effect */}
          <div className={styles.encryptionProgress}>
            {Array.from({ length: 30 }, (_, i) => (
              <div 
                key={i} 
                className={styles.dataBlock}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Dynamic Security Status Messages */}
        <SecurityStatus />
      </div>
    </div>
  );
}