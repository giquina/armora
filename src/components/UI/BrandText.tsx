import React from 'react';
import { getBrandTextStyles, getTaglineStyles } from '../../styles/brandConstants';
import styles from './BrandText.module.css';

interface BrandTextProps {
  size?: 'hero' | 'large' | 'medium' | 'small';
  className?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

interface TaglineProps {
  size?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

// Main ARMORA brand text component
export const BrandText: React.FC<BrandTextProps> = ({
  size = 'medium',
  className = '',
  animated = false,
  children = 'ARMORA'
}) => {
  const brandStyles = getBrandTextStyles(size);

  return (
    <span
      className={`${styles.brandText} ${animated ? styles.animated : ''} ${className}`}
      style={brandStyles}
    >
      {children}
    </span>
  );
};

// Tagline component with consistent styling
export const BrandTagline: React.FC<TaglineProps> = ({
  size = 'primary',
  className = '',
  children
}) => {
  const taglineStyles = getTaglineStyles(size);

  return (
    <span
      className={`${styles.brandTagline} ${className}`}
      style={taglineStyles}
    >
      {children}
    </span>
  );
};

// Pre-configured components for common use cases
export const ArmoraBrandTitle: React.FC<{ size?: 'hero' | 'large' | 'medium' | 'small', animated?: boolean, className?: string }> = (props) => (
  <BrandText {...props}>ARMORA</BrandText>
);

export const ArmoraTagline: React.FC<{ size?: 'primary' | 'secondary', className?: string }> = (props) => (
  <BrandTagline {...props}>Your Personal Security Driver Team</BrandTagline>
);

// Welcome page specific component
export const WelcomeTitle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <h1 className={`${styles.welcomeTitle} ${className}`}>
    <span className={styles.welcomePrefix}>Welcome to </span>
    <BrandText size="large" animated={true}>ARMORA</BrandText>
  </h1>
);