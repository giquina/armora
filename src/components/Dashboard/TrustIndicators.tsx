import React, { useState, useEffect, useRef } from 'react';
import styles from './TrustIndicators.module.css';

interface StatItem {
  value: string;
  label: string;
  countUp?: boolean;
  targetValue?: number;
}

interface AnimatedNumberProps {
  value: string;
  targetValue?: number;
  isVisible: boolean;
}

function AnimatedNumber({ value, targetValue, isVisible }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(targetValue ? 0 : value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isVisible || hasAnimated || !targetValue) return;

    let startValue = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const current = Math.floor(startValue + (targetValue - startValue) * easedProgress);

      if (value.includes(',')) {
        setDisplayValue(current.toLocaleString());
      } else {
        setDisplayValue(current.toString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setHasAnimated(true);
      }
    };

    animate();
  }, [isVisible, value, targetValue, hasAnimated]);

  return <span>{displayValue}</span>;
}

export function TrustIndicators() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats: StatItem[] = [
    {
      value: "12,847",
      label: "Protected Clients",
      countUp: true,
      targetValue: 12847
    },
    {
      value: "4.9★",
      label: "Average Rating",
      countUp: true,
      targetValue: 49 // Will be divided by 10 for display
    },
    {
      value: "100%",
      label: "SIA Licensed",
      countUp: true,
      targetValue: 100
    },
    {
      value: "<3min",
      label: "Avg Response"
    }
  ];

  const securityBadges = [
    {
      name: "SIA Licensed",
      icon: "🛡️",
      description: "Security Industry Authority"
    },
    {
      name: "ICO Registered",
      icon: "🔒",
      description: "Data Protection Compliant"
    },
    {
      name: "SSL Secured",
      icon: "🔐",
      description: "256-bit Encryption"
    },
    {
      name: "Insured",
      icon: "📋",
      description: "£2M+ Coverage"
    }
  ];

  return (
    <div ref={elementRef} className={styles.trustBanner}>
      <div className={styles.bannerHeader}>
        <h3 className={styles.bannerTitle}>Trusted by London's Elite</h3>
        <span className={styles.bannerSubtitle}>Professional security you can rely on</span>
      </div>

      <div className={styles.statsRow}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`${styles.statItem} ${isVisible ? styles.visible : ''}`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className={styles.statValue}>
              {stat.countUp && stat.targetValue ? (
                stat.label === "Average Rating" ? (
                  <>
                    <AnimatedNumber
                      value="4.9"
                      targetValue={49}
                      isVisible={isVisible}
                    />
                    <span>★</span>
                  </>
                ) : (
                  <AnimatedNumber
                    value={stat.value}
                    targetValue={stat.targetValue}
                    isVisible={isVisible}
                  />
                )
              ) : (
                <span>{stat.value}</span>
              )}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.securityBadges}>
        <div className={styles.badgesHeader}>
          <span className={styles.badgesTitle}>Security Certifications</span>
        </div>
        <div className={styles.badgesRow}>
          {securityBadges.map((badge, index) => (
            <div
              key={badge.name}
              className={`${styles.securityBadge} ${isVisible ? styles.visible : ''}`}
              style={{
                animationDelay: `${0.4 + index * 0.1}s`
              }}
              title={badge.description}
            >
              <div className={styles.badgeIcon}>{badge.icon}</div>
              <div className={styles.badgeText}>
                <span className={styles.badgeName}>{badge.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.trustFooter}>
        <div className={styles.trustPoints}>
          <div className={styles.trustPoint}>
            <span className={styles.trustIcon}>✅</span>
            <span>Background-checked officers</span>
          </div>
          <div className={styles.trustPoint}>
            <span className={styles.trustIcon}>✅</span>
            <span>24/7 operational support</span>
          </div>
          <div className={styles.trustPoint}>
            <span className={styles.trustIcon}>✅</span>
            <span>Real-time tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}