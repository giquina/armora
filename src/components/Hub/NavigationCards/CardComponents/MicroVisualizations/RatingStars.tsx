import React from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'small',
  showNumber = false,
  className
}) => {
  // Normalize rating to be between 0 and maxRating
  const normalizedRating = Math.min(maxRating, Math.max(0, rating));

  // Size configurations
  const sizeConfig = {
    small: { starSize: '10px', fontSize: '10px', gap: '1px' },
    medium: { starSize: '14px', fontSize: '12px', gap: '2px' },
    large: { starSize: '18px', fontSize: '14px', gap: '3px' }
  };

  const config = sizeConfig[size];

  // Generate stars
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= normalizedRating;
    const isPartial = starValue > normalizedRating && starValue - 1 < normalizedRating;
    const fillPercentage = isPartial ? ((normalizedRating % 1) * 100) : 0;

    return (
      <div
        key={index}
        style={{
          position: 'relative',
          fontSize: config.starSize,
          lineHeight: 1,
          color: isFilled ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'
        }}
      >
        ★
        {isPartial && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${fillPercentage}%`,
              overflow: 'hidden',
              color: '#FFD700'
            }}
          >
            ★
          </div>
        )}
      </div>
    );
  });

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: config.gap
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: config.gap
        }}
      >
        {stars}
      </div>

      {showNumber && (
        <span
          style={{
            fontSize: config.fontSize,
            color: 'rgba(255, 255, 255, 0.8)',
            marginLeft: '4px',
            fontWeight: 600
          }}
        >
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};