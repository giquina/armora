import { FC, useState, useEffect } from 'react';
import styles from './SocialProofEngine.module.css';

interface SocialProofEngineProps {
  className?: string;
}

const SocialProofEngine: FC<SocialProofEngineProps> = ({ className }) => {
  const [currentStat, setCurrentStat] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Live statistics that update
  const liveStats = [
    { number: '127', label: 'Fortune 500 CEOs trust us today', icon: '🏆' },
    { number: '99.8%', label: 'Incident-free service record', icon: '🛡️' },
    { number: '12', label: 'SIA-certified protection officers available now', icon: '👨‍💼' },
    { number: '8 min', label: 'Average response time', icon: '⏱️' },
    { number: '2,847', label: 'Executive assignments completed this month', icon: '🚗' }
  ];

  // Executive testimonials
  const testimonials = [
    {
      quote: "Armora's discrete security transport has been essential for our board meetings.",
      name: "Corporate Executive",
      company: "FTSE 100 Company",
      initials: "M.J."
    },
    {
      quote: "The professional standards and reliability exceed expectations every time.",
      name: "Investment Director", 
      company: "Private Equity Firm",
      initials: "S.R."
    },
    {
      quote: "Their attention to confidentiality and security protocols is unmatched.",
      name: "Government Advisor",
      company: "UK Government",
      initials: "D.K."
    }
  ];

  // Rotate statistics
  useEffect(() => {
    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % liveStats.length);
    }, 3000);
    return () => clearInterval(statInterval);
  }, [liveStats.length]);

  // Rotate testimonials
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  return (
    <div className={`${styles.socialProofEngine} ${className || ''}`}>
      {/* Live Statistics */}
      <div className={styles.liveStats}>
        <div className={styles.statDisplay}>
          <span className={styles.statIcon}>{liveStats[currentStat].icon}</span>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{liveStats[currentStat].number}</span>
            <span className={styles.statLabel}>{liveStats[currentStat].label}</span>
          </div>
        </div>
        
        <div className={styles.statIndicators}>
          {liveStats.map((_, index) => (
            <div 
              key={index} 
              className={`${styles.statDot} ${index === currentStat ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Executive Testimonials */}
      <div className={styles.testimonialCarousel}>
        <div className={styles.testimonialSlide}>
          <div className={styles.quoteIcon}>"</div>
          <p className={styles.testimonialText}>
            {testimonials[testimonialIndex].quote}
          </p>
          <div className={styles.testimonialAuthor}>
            <div className={styles.authorInitials}>
              {testimonials[testimonialIndex].initials}
            </div>
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>{testimonials[testimonialIndex].name}</div>
              <div className={styles.authorCompany}>{testimonials[testimonialIndex].company}</div>
            </div>
          </div>
        </div>
        
        <div className={styles.testimonialIndicators}>
          {testimonials.map((_, index) => (
            <div 
              key={index} 
              className={`${styles.testimonialDot} ${index === testimonialIndex ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className={styles.trustBadges}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>🏛️</span>
          <span className={styles.badgeText}>Government Approved</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>🔒</span>
          <span className={styles.badgeText}>ISO 27001</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>✅</span>
          <span className={styles.badgeText}>SIA Licensed</span>
        </div>
      </div>
    </div>
  );
};

export default SocialProofEngine;