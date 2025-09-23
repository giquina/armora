// ARMORA Brand Constants - Single Source of Truth
// Based on the premium splash screen implementation

export const ARMORA_BRAND = {
  // TYPOGRAPHY - Based on splash screen "ARMORA" text
  typography: {
    brandText: {
      fontFamily: "'Arial Black', 'Helvetica', sans-serif",
      fontWeight: 900,
      letterSpacing: '0.15em', // From splash: letter-spacing: 0.15em
      textTransform: 'uppercase' as const,
      fontSize: {
        hero: '3.5rem',      // Splash page size
        large: '2.5rem',     // Welcome page primary
        medium: '1.8rem',    // Navigation/headers
        small: '1.2rem',     // Compact uses
      }
    },
    tagline: {
      fontFamily: "'Helvetica', 'Arial', sans-serif",
      fontWeight: 300,
      letterSpacing: '0.1em', // From splash: letter-spacing: 0.1em
      fontSize: {
        primary: '1.1rem',   // "Your Personal Security Protection Officer Team"
        secondary: '0.9rem'  // Secondary taglines
      }
    }
  },

  // COLORS - Exact values from splash screen CSS
  colors: {
    gold: {
      primary: '#FFD700',    // --primary-gold from logo CSS
      secondary: '#FFA500',  // --secondary-gold
      accent: '#FF8C00',     // --accent-gold
      gradient: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FF8C00)',
      gradientAnimated: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FF8C00)',
    },
    navy: {
      primary: '#1a1a2e',   // --dark-navy
      secondary: '#16213e',
      tertiary: '#1e1e3a'
    },
    background: {
      immersive: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
      gradientLight: 'radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 40%)',
      card: 'linear-gradient(135deg, #1a1a2e 0%, #1e1e3a 100%)'
    },
    text: {
      goldPrimary: 'rgba(255, 215, 0, 0.9)',
      goldSecondary: 'rgba(255, 215, 0, 0.8)',
      white: 'rgba(255, 255, 255, 0.9)',
      muted: 'rgba(255, 255, 255, 0.7)'
    },
    effects: {
      glow: 'rgba(255, 215, 0, 0.8)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      glassMorphism: 'rgba(255, 255, 255, 0.1)'
    }
  },

  // LOGO SPECIFICATIONS
  logo: {
    dimensions: {
      hero: { width: 216, height: 252 },     // 1.8x scale from base
      large: { width: 156, height: 182 },    // 1.3x scale
      medium: { width: 120, height: 140 },   // Base size from CSS
      small: { width: 84, height: 98 },      // 0.7x scale
      compact: { width: 60, height: 70 }     // Navigation size
    },
    animations: {
      float: 'logoFloat 6s ease-in-out infinite',
      orbit: {
        inner: 'orbitRotation 8s linear infinite',
        middle: 'orbitRotation 12s linear infinite reverse',
        outer: 'orbitRotation 16s linear infinite'
      },
      glow: 'letterGlow 3s ease-in-out infinite alternate',
      pulse: 'energyPulse 3s ease-in-out infinite'
    }
  },

  // TEXT EFFECTS - Matching splash screen animations
  textEffects: {
    goldGradient: {
      background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FF8C00)',
      backgroundSize: '300% 300%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'goldWave 4s ease-in-out infinite'
    },
    dropShadow: {
      filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
    },
    textGlow: {
      textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)'
    }
  },

  // SPACING - Consistent with splash screen layout
  spacing: {
    letterSpacing: {
      brand: '0.15em',     // ARMORA text
      tagline: '0.1em',    // Taglines
      normal: '0.05em'     // Body text
    },
    margins: {
      brandText: {
        bottom: '1rem'
      },
      tagline: {
        top: '0.5rem',
        bottom: '2rem'
      }
    }
  },

  // ANIMATION KEYFRAMES
  animations: {
    letterReveal: `
      @keyframes letterReveal {
        0% {
          transform: rotateY(-90deg) translateY(-50px);
          opacity: 0;
          filter: blur(10px);
        }
        50% {
          transform: rotateY(-20deg) translateY(-10px);
          opacity: 0.7;
          filter: blur(3px);
        }
        100% {
          transform: rotateY(0deg) translateY(0px);
          opacity: 1;
          filter: blur(0px);
        }
      }
    `,
    goldWave: `
      @keyframes goldWave {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `,
    letterFloat: `
      @keyframes letterFloat {
        0%, 100% { transform: translateY(0px) scale(1); }
        33% { transform: translateY(-3px) scale(1.02); }
        66% { transform: translateY(2px) scale(0.98); }
      }
    `
  }
};

// UTILITY FUNCTIONS
export const getBrandTextStyles = (size: 'hero' | 'large' | 'medium' | 'small') => ({
  fontFamily: ARMORA_BRAND.typography.brandText.fontFamily,
  fontWeight: ARMORA_BRAND.typography.brandText.fontWeight,
  letterSpacing: ARMORA_BRAND.typography.brandText.letterSpacing,
  textTransform: ARMORA_BRAND.typography.brandText.textTransform,
  fontSize: ARMORA_BRAND.typography.brandText.fontSize[size],
  ...ARMORA_BRAND.textEffects.goldGradient,
  ...ARMORA_BRAND.textEffects.dropShadow
});

export const getTaglineStyles = (size: 'primary' | 'secondary' = 'primary') => ({
  fontFamily: ARMORA_BRAND.typography.tagline.fontFamily,
  fontWeight: ARMORA_BRAND.typography.tagline.fontWeight,
  letterSpacing: ARMORA_BRAND.typography.tagline.letterSpacing,
  fontSize: ARMORA_BRAND.typography.tagline.fontSize[size],
  color: ARMORA_BRAND.colors.text.goldPrimary
});

export const getLogoProps = (variant: 'hero' | 'large' | 'medium' | 'small' | 'compact') => {
  const sizeMap = {
    hero: 'hero',
    large: 'large',
    medium: 'medium',
    small: 'small',
    compact: 'small'
  } as const;

  return {
    size: sizeMap[variant] as 'small' | 'medium' | 'large' | 'hero',
    variant: (variant === 'compact' ? 'compact' : 'full') as 'full' | 'compact' | 'minimal' | 'animated' | 'monochrome',
    showOrbits: variant !== 'compact',
    interactive: true
  };
};

// CSS CUSTOM PROPERTIES
export const BRAND_CSS_VARIABLES = `
  :root {
    --armora-gold-primary: ${ARMORA_BRAND.colors.gold.primary};
    --armora-gold-secondary: ${ARMORA_BRAND.colors.gold.secondary};
    --armora-gold-accent: ${ARMORA_BRAND.colors.gold.accent};
    --armora-navy-primary: ${ARMORA_BRAND.colors.navy.primary};
    --armora-navy-secondary: ${ARMORA_BRAND.colors.navy.secondary};

    --armora-brand-font: ${ARMORA_BRAND.typography.brandText.fontFamily};
    --armora-brand-weight: ${ARMORA_BRAND.typography.brandText.fontWeight};
    --armora-brand-spacing: ${ARMORA_BRAND.typography.brandText.letterSpacing};

    --armora-tagline-font: ${ARMORA_BRAND.typography.tagline.fontFamily};
    --armora-tagline-weight: ${ARMORA_BRAND.typography.tagline.fontWeight};
    --armora-tagline-spacing: ${ARMORA_BRAND.typography.tagline.letterSpacing};
  }
`;