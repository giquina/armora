import { ReactNode,  FC  } from 'react';
import { getBrandTextStyles, getTaglineStyles } from '../../styles/brandConstants';
import styles from './BrandText.module.css';

interface BrandTextProps {
  size?: 'hero' | 'large' | 'medium' | 'small';
  className?: string;
  animated?: boolean;
  children?: ReactNode;
}

interface TaglineProps {
  size?: 'primary' | 'secondary';
  className?: string;
  children: ReactNode;
}

// Main ARMORA brand text component
export const BrandText: FC<BrandTextProps> = ({
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
export const BrandTagline: FC<TaglineProps> = ({
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
export const ArmoraBrandTitle: FC<{ size?: 'hero' | 'large' | 'medium' | 'small', animated?: boolean, className?: string }> = (props) => (
  <BrandText {...props}>ARMORA</BrandText>
);

export const ArmoraTagline: FC<{ size?: 'primary' | 'secondary', className?: string }> = (props) => (
  <BrandTagline {...props}>Discrete. Professional. Always Available.</BrandTagline>
);

// Welcome page specific component
export const WelcomeTitle: FC<{ className?: string }> = ({ className = '' }) => (
  <h1 className={`${styles.welcomeTitle} ${className}`}>
    <span className={styles.welcomeHeadline}>Protection That Matches Your Standards</span>
  </h1>
);