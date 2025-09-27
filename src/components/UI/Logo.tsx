import { useApp } from '../../contexts/AppContext';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOrbital?: boolean;
  animated?: boolean;
  className?: string;
  clickable?: boolean;
  enhanced3D?: boolean;
}

export function Logo({ 
  size = 'md', 
  showOrbital = false, 
  animated = true,
  className = '',
  clickable = false,
  enhanced3D = false
}: LogoProps) {
  const { state, navigateToView } = useApp();
  
  const logoClasses = [
    styles.logoContainer,
    styles[size],
    animated ? styles.animated : '',
    enhanced3D ? styles.enhanced3D : '',
    clickable ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');

  // Intelligent navigation logic
  const getLogoDestination = () => {
    const user = state.user;
    const currentView = state.currentView;

    // If on splash screen, go to welcome
    if (currentView === 'splash') {
      return 'welcome';
    }

    // If not authenticated, go to welcome
    if (!user?.isAuthenticated) {
      return 'welcome';
    }

    // If authenticated but questionnaire not completed
    if (!user?.hasCompletedQuestionnaire) {
      return 'questionnaire';
    }

    // If guest user, go to dashboard with limited features
    if (user?.userType === 'guest') {
      return 'home';
    }

    // Registered user with complete profile, go to full dashboard
    return 'home';
  };

  const handleLogoClick = () => {
    if (!clickable) return;
    
    const secureDestination = getLogoDestination();
    navigateToView(secureDestination as any);
  };

  const sizeMap = {
    sm: { width: 32, height: 32, viewBox: "0 0 80 80" },
    md: { width: 48, height: 48, viewBox: "0 0 80 80" },
    lg: { width: 64, height: 64, viewBox: "0 0 80 80" },
    xl: { width: 80, height: 80, viewBox: "0 0 80 80" }
  };

  const { width, height, viewBox } = sizeMap[size];

  return (
    <div 
      className={logoClasses}
      onClick={handleLogoClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? "Navigate to main dashboard" : "Armora Security Transport Logo"}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLogoClick();
        }
      } : undefined}
    >
      {/* Enhanced 3D Background Layer */}
      {enhanced3D && (
        <div className={styles.logo3DBackground}>
          <div className={styles.shadowLayer}></div>
          <div className={styles.reflectionLayer}></div>
        </div>
      )}

      {showOrbital && (
        <div className={styles.orbitalRing}>
          <div className={styles.orbitalDot}></div>
          <div className={styles.orbitalDot}></div>
          <div className={styles.orbitalDot}></div>
        </div>
      )}
      
      <svg 
        width={width} 
        height={height} 
        viewBox={viewBox} 
        className={styles.logo}
        aria-hidden={clickable ? "true" : "false"}
      >
        <defs>
          {/* Enhanced 3D/4D Gradients */}
          <linearGradient id={`premiumGoldGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--armora-gold)" />
            <stop offset="30%" stopColor="#FFE55C" />
            <stop offset="70%" stopColor="var(--hover-gold)" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          
          <linearGradient id={`metallic3D-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.2)" />
          </linearGradient>
          
          <radialGradient id={`innerGlow-${size}`} cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
          </radialGradient>

          {/* 3D Shadow Filter */}
          <filter id={`logo3DShadow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="2" dy="6" result="offset"/>
            <feFlood floodColor="rgba(0, 0, 0, 0.3)"/>
            <feComposite in2="offset" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Holographic Light Sweep */}
          <linearGradient id={`lightSweep-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        
        {/* 3D Shield Base Layer */}
        <path
          d="M40 5 L65 15 L65 35 C65 50 55 65 40 75 C25 65 15 50 15 35 L15 15 Z"
          fill={`url(#premiumGoldGradient-${size})`}
          filter={enhanced3D ? `url(#logo3DShadow-${size})` : undefined}
          className={enhanced3D ? styles.shield3D : ''}
        />

        {/* Metallic Overlay for 3D Effect */}
        {enhanced3D && (
          <path
            d="M40 5 L65 15 L65 35 C65 50 55 65 40 75 C25 65 15 50 15 35 L15 15 Z"
            fill={`url(#metallic3D-${size})`}
            opacity="0.7"
            className={styles.metallicOverlay}
          />
        )}

        {/* Inner Glow Layer */}
        {enhanced3D && (
          <path
            d="M40 8 L62 16 L62 34 C62 47 53 60 40 70 C27 60 18 47 18 34 L18 16 Z"
            fill={`url(#innerGlow-${size})`}
            className={styles.innerGlow}
          />
        )}

        {/* Enhanced 3D 'A' Letter with Depth */}
        <g className={enhanced3D ? styles.letter3D : ''}>
          {/* Letter Shadow/Depth */}
          {enhanced3D && (
            <path
              d="M41 21 L51 51 L46 51 L44 44 L38 44 L36 51 L31 51 Z M39 38 L43 38 L41 31 Z"
              fill="rgba(0, 0, 0, 0.4)"
              className={styles.letterShadow}
            />
          )}
          
          {/* Main Letter */}
          <path
            d="M40 20 L50 50 L45 50 L43 43 L37 43 L35 50 L30 50 Z M38 37 L42 37 L40 30 Z"
            fill="var(--armora-dark)"
            className={styles.mainLetter}
          />
          
          {/* Letter Highlight */}
          {enhanced3D && (
            <path
              d="M40 20 L42 20 L44 28 L42 28 Z M38.5 37 L40.5 37 L40 33 Z"
              fill="rgba(255, 215, 0, 0.6)"
              className={styles.letterHighlight}
            />
          )}
        </g>

        {/* Holographic Light Sweep */}
        {enhanced3D && (
          <rect
            x="0" y="0" width="80" height="80"
            fill={`url(#lightSweep-${size})`}
            opacity="0"
            className={styles.lightSweep}
            clipPath="url(#shieldClip)"
          />
        )}

        {/* Clip Path for Light Effects */}
        <clipPath id="shieldClip">
          <path d="M40 5 L65 15 L65 35 C65 50 55 65 40 75 C25 65 15 50 15 35 L15 15 Z" />
        </clipPath>
      </svg>

      {/* 4D Holographic Particles */}
      {enhanced3D && (
        <div className={styles.holographicParticles}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
      )}
    </div>
  );
}