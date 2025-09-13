// Seasonal Theming System for Armora Security Transport
// Monthly background themes while maintaining professional VIP standards

export interface SeasonalTheme {
  month: number;
  name: string;
  particles: {
    color: string;
    secondaryColor?: string;
    count: number;
    speed: number;
    direction: 'up' | 'down' | 'float' | 'drift';
    shape: 'circle' | 'snowflake' | 'leaf' | 'sparkle';
    size: { min: number; max: number };
  };
  atmosphere: {
    gradient: string;
    overlay?: string;
    glow?: string;
  };
  animation: {
    intensity: 'gentle' | 'moderate' | 'active';
    pattern: 'random' | 'structured' | 'organic';
  };
}

export const monthlyThemes: SeasonalTheme[] = [
  {
    month: 1, // January - Winter Frost
    name: 'Winter Frost',
    particles: {
      color: 'rgba(255, 255, 255, 0.8)',
      secondaryColor: 'rgba(255, 215, 0, 0.3)',
      count: 15,
      speed: 0.5,
      direction: 'down',
      shape: 'snowflake',
      size: { min: 3, max: 8 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 1) 70%, rgba(15, 15, 35, 1) 100%)',
      overlay: 'rgba(255, 255, 255, 0.03)',
      glow: 'rgba(255, 255, 255, 0.1)'
    },
    animation: {
      intensity: 'gentle',
      pattern: 'structured'
    }
  },
  {
    month: 2, // February - Rose Gold Romance
    name: 'Rose Gold',
    particles: {
      color: 'rgba(255, 182, 193, 0.6)',
      secondaryColor: 'rgba(255, 215, 0, 0.4)',
      count: 12,
      speed: 0.3,
      direction: 'float',
      shape: 'sparkle',
      size: { min: 2, max: 6 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(35, 26, 35, 1) 70%, rgba(20, 15, 25, 1) 100%)',
      overlay: 'rgba(255, 182, 193, 0.02)',
      glow: 'rgba(255, 215, 0, 0.1)'
    },
    animation: {
      intensity: 'gentle',
      pattern: 'organic'
    }
  },
  {
    month: 3, // March - Spring Awakening
    name: 'Spring Gold',
    particles: {
      color: 'rgba(144, 238, 144, 0.5)',
      secondaryColor: 'rgba(255, 215, 0, 0.6)',
      count: 14,
      speed: 0.4,
      direction: 'up',
      shape: 'circle',
      size: { min: 2, max: 5 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(26, 35, 26, 1) 70%, rgba(15, 25, 15, 1) 100%)',
      overlay: 'rgba(144, 238, 144, 0.02)',
      glow: 'rgba(255, 215, 0, 0.1)'
    },
    animation: {
      intensity: 'moderate',
      pattern: 'organic'
    }
  },
  {
    month: 4, // April - Light Pastel
    name: 'Pastel Gold',
    particles: {
      color: 'rgba(255, 215, 0, 0.5)',
      secondaryColor: 'rgba(255, 255, 255, 0.3)',
      count: 13,
      speed: 0.3,
      direction: 'drift',
      shape: 'circle',
      size: { min: 2, max: 4 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(30, 30, 50, 1) 70%, rgba(20, 20, 40, 1) 100%)',
      overlay: 'rgba(255, 255, 255, 0.02)',
      glow: 'rgba(255, 215, 0, 0.08)'
    },
    animation: {
      intensity: 'gentle',
      pattern: 'random'
    }
  },
  {
    month: 5, // May - Bright Spring
    name: 'Bright Gold',
    particles: {
      color: 'rgba(255, 215, 0, 0.6)',
      secondaryColor: 'rgba(144, 238, 144, 0.3)',
      count: 16,
      speed: 0.5,
      direction: 'float',
      shape: 'sparkle',
      size: { min: 3, max: 6 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(26, 30, 35, 1) 70%, rgba(15, 20, 25, 1) 100%)',
      overlay: 'rgba(144, 238, 144, 0.02)',
      glow: 'rgba(255, 215, 0, 0.12)'
    },
    animation: {
      intensity: 'moderate',
      pattern: 'organic'
    }
  },
  {
    month: 6, // June - Summer Energy
    name: 'Summer Gold',
    particles: {
      color: 'rgba(255, 215, 0, 0.7)',
      secondaryColor: 'rgba(135, 206, 250, 0.4)',
      count: 18,
      speed: 0.6,
      direction: 'drift',
      shape: 'circle',
      size: { min: 3, max: 7 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(26, 35, 46, 1) 70%, rgba(15, 25, 36, 1) 100%)',
      overlay: 'rgba(135, 206, 250, 0.03)',
      glow: 'rgba(255, 215, 0, 0.15)'
    },
    animation: {
      intensity: 'active',
      pattern: 'random'
    }
  },
  {
    month: 7, // July - Golden Hour
    name: 'Golden Hour',
    particles: {
      color: 'rgba(255, 165, 0, 0.7)',
      secondaryColor: 'rgba(255, 215, 0, 0.8)',
      count: 20,
      speed: 0.7,
      direction: 'float',
      shape: 'sparkle',
      size: { min: 4, max: 8 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(35, 30, 25, 1) 70%, rgba(25, 20, 15, 1) 100%)',
      overlay: 'rgba(255, 165, 0, 0.03)',
      glow: 'rgba(255, 215, 0, 0.18)'
    },
    animation: {
      intensity: 'active',
      pattern: 'organic'
    }
  },
  {
    month: 8, // August - Warm Amber
    name: 'Warm Amber',
    particles: {
      color: 'rgba(255, 191, 0, 0.8)',
      secondaryColor: 'rgba(255, 140, 0, 0.5)',
      count: 17,
      speed: 0.6,
      direction: 'drift',
      shape: 'circle',
      size: { min: 3, max: 7 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(35, 30, 26, 1) 70%, rgba(25, 20, 16, 1) 100%)',
      overlay: 'rgba(255, 191, 0, 0.03)',
      glow: 'rgba(255, 215, 0, 0.15)'
    },
    animation: {
      intensity: 'moderate',
      pattern: 'random'
    }
  },
  {
    month: 9, // September - Autumn Amber
    name: 'Autumn Amber',
    particles: {
      color: 'rgba(218, 165, 32, 0.7)',
      secondaryColor: 'rgba(255, 215, 0, 0.5)',
      count: 15,
      speed: 0.4,
      direction: 'down',
      shape: 'leaf',
      size: { min: 3, max: 6 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(35, 28, 20, 1) 70%, rgba(25, 18, 10, 1) 100%)',
      overlay: 'rgba(218, 165, 32, 0.03)',
      glow: 'rgba(255, 215, 0, 0.12)'
    },
    animation: {
      intensity: 'moderate',
      pattern: 'structured'
    }
  },
  {
    month: 10, // October - Deep Autumn
    name: 'Deep Autumn',
    particles: {
      color: 'rgba(255, 140, 0, 0.6)',
      secondaryColor: 'rgba(255, 215, 0, 0.4)',
      count: 16,
      speed: 0.5,
      direction: 'down',
      shape: 'leaf',
      size: { min: 4, max: 8 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(40, 25, 15, 1) 70%, rgba(30, 15, 5, 1) 100%)',
      overlay: 'rgba(255, 140, 0, 0.03)',
      glow: 'rgba(255, 215, 0, 0.10)'
    },
    animation: {
      intensity: 'moderate',
      pattern: 'organic'
    }
  },
  {
    month: 11, // November - Bronze Gold
    name: 'Bronze Gold',
    particles: {
      color: 'rgba(205, 127, 50, 0.6)',
      secondaryColor: 'rgba(255, 215, 0, 0.3)',
      count: 12,
      speed: 0.3,
      direction: 'down',
      shape: 'leaf',
      size: { min: 3, max: 5 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(35, 25, 20, 1) 70%, rgba(25, 15, 10, 1) 100%)',
      overlay: 'rgba(205, 127, 50, 0.02)',
      glow: 'rgba(255, 215, 0, 0.08)'
    },
    animation: {
      intensity: 'gentle',
      pattern: 'structured'
    }
  },
  {
    month: 12, // December - Winter Silver
    name: 'Winter Silver',
    particles: {
      color: 'rgba(192, 192, 192, 0.8)',
      secondaryColor: 'rgba(255, 255, 255, 0.6)',
      count: 18,
      speed: 0.4,
      direction: 'down',
      shape: 'snowflake',
      size: { min: 4, max: 10 }
    },
    atmosphere: {
      gradient: 'radial-gradient(ellipse at center, rgba(26, 26, 46, 0.95) 0%, rgba(30, 30, 40, 1) 70%, rgba(20, 20, 30, 1) 100%)',
      overlay: 'rgba(255, 255, 255, 0.04)',
      glow: 'rgba(192, 192, 192, 0.1)'
    },
    animation: {
      intensity: 'moderate',
      pattern: 'structured'
    }
  }
];

// Get current theme based on month
export const getCurrentTheme = (): SeasonalTheme => {
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  return monthlyThemes.find(theme => theme.month === currentMonth) || monthlyThemes[0];
};

// Get theme by specific month (for testing or preview)
export const getThemeByMonth = (month: number): SeasonalTheme => {
  return monthlyThemes.find(theme => theme.month === month) || monthlyThemes[0];
};

// Theme transition helper
export const getThemeTransition = (fromTheme: SeasonalTheme, toTheme: SeasonalTheme) => {
  return {
    duration: 2000, // 2 second transition
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['background', 'opacity', 'transform']
  };
};

// Particle animation patterns
export const getAnimationKeyframes = (theme: SeasonalTheme) => {
  const { particles } = theme;
  
  switch (particles.direction) {
    case 'up':
      return {
        from: { transform: 'translateY(100vh) translateX(var(--x)) scale(0)', opacity: 0 },
        to: { transform: 'translateY(-100vh) translateX(var(--x)) scale(1)', opacity: 1 }
      };
    case 'down':
      return {
        from: { transform: 'translateY(-100vh) translateX(var(--x)) scale(0)', opacity: 0 },
        to: { transform: 'translateY(100vh) translateX(var(--x)) scale(1)', opacity: 1 }
      };
    case 'float':
      return {
        '0%': { transform: 'translateY(0) translateX(var(--x)) scale(1)', opacity: 0.8 },
        '50%': { transform: 'translateY(-20px) translateX(calc(var(--x) + 10px)) scale(1.1)', opacity: 1 },
        '100%': { transform: 'translateY(0) translateX(var(--x)) scale(1)', opacity: 0.8 }
      };
    case 'drift':
    default:
      return {
        '0%': { transform: 'translateY(var(--y)) translateX(var(--x)) rotate(0deg)', opacity: 0.6 },
        '50%': { transform: 'translateY(calc(var(--y) - 30px)) translateX(calc(var(--x) + 15px)) rotate(180deg)', opacity: 1 },
        '100%': { transform: 'translateY(var(--y)) translateX(calc(var(--x) + 30px)) rotate(360deg)', opacity: 0.6 }
      };
  }
};