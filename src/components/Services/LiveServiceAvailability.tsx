import { useState, useEffect } from 'react';
import styles from './LiveServiceAvailability.module.css';

interface AvailabilityData {
  available: number;
  total: number;
  nextSlot: string;
  surge: boolean;
  demand: 'low' | 'medium' | 'high';
  responseTime: string;
}

interface LiveServiceAvailabilityProps {
  serviceId: string;
}

const generateAvailabilityData = (serviceId: string): AvailabilityData => {
  // Simulate different availability patterns for different services
  const patterns = {
    standard: { base: 12, max: 15, surgeChance: 0.1 },
    executive: { base: 6, max: 10, surgeChance: 0.2 },
    shadow: { base: 3, max: 6, surgeChance: 0.3 },
    event: { base: 2, max: 8, surgeChance: 0.4 },
    luxury: { base: 1, max: 3, surgeChance: 0.5 }
  };

  const pattern = patterns[serviceId as keyof typeof patterns] || patterns.standard;
  const available = Math.max(1, Math.floor(Math.random() * pattern.max) + 1);
  const surge = Math.random() < pattern.surgeChance;

  let demand: 'low' | 'medium' | 'high' = 'low';
  const availability = available / pattern.max;

  if (availability < 0.3) demand = 'high';
  else if (availability < 0.6) demand = 'medium';

  const responseTime = serviceId === 'standard' ? '10-15 min' :
                      serviceId === 'executive' ? '5-10 min' :
                      serviceId === 'shadow' ? '8-12 min' :
                      serviceId === 'event' ? '15-30 min' : '2-5 min';

  return {
    available,
    total: pattern.max,
    nextSlot: `${Math.floor(Math.random() * 25) + 5} min`,
    surge,
    demand,
    responseTime
  };
};

export function LiveServiceAvailability({ serviceId }: LiveServiceAvailabilityProps) {
  const [availability, setAvailability] = useState<AvailabilityData>(() =>
    generateAvailabilityData(serviceId)
  );

  useEffect(() => {
    // Update availability data every 30 seconds to simulate real-time
    const interval = setInterval(() => {
      setAvailability(generateAvailabilityData(serviceId));
    }, 30000);

    return () => clearInterval(interval);
  }, [serviceId]);

  const percentAvailable = (availability.available / availability.total) * 100;

  const getDemandColor = () => {
    switch (availability.demand) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const getDemandText = () => {
    switch (availability.demand) {
      case 'high': return '🔥 High Demand';
      case 'medium': return '⚡ Medium Demand';
      default: return '✅ Available';
    }
  };

  return (
    <div className={styles.availability}>
      {/* Live Indicator */}
      <div className={styles.header}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span className={styles.liveText}>LIVE</span>
        </div>

        {availability.surge && (
          <div className={styles.surge}>
            <span className={styles.surgeIcon}>⚡</span>
            <span>Peak Hours</span>
          </div>
        )}
      </div>

      {/* Availability Bar */}
      <div className={styles.availabilityBar}>
        <div
          className={styles.availableBar}
          style={{
            width: `${percentAvailable}%`,
            backgroundColor: getDemandColor()
          }}
        />
        <div className={styles.unavailableBar} />
      </div>

      {/* Availability Text */}
      <div className={styles.availabilityInfo}>
        <div className={styles.availabilityText}>
          <span className={styles.availableCount}>
            {availability.available} of {availability.total}
          </span>
          <span className={styles.availableLabel}>officers available</span>
        </div>

        <div className={styles.demandStatus} style={{ color: getDemandColor() }}>
          {getDemandText()}
        </div>
      </div>

      {/* Response Time */}
      <div className={styles.responseInfo}>
        <div className={styles.responseTime}>
          <span className={styles.responseLabel}>Response time:</span>
          <span className={styles.responseValue}>{availability.responseTime}</span>
        </div>

        <div className={styles.nextAvailable}>
          <span className={styles.nextLabel}>Next available:</span>
          <span className={styles.nextValue}>{availability.nextSlot}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        {availability.available > 0 ? (
          <button className={styles.bookNowButton} style={{ backgroundColor: getDemandColor() }}>
            📞 Request Now
          </button>
        ) : (
          <button className={styles.waitlistButton}>
            📋 Join Waitlist
          </button>
        )}

        <button className={styles.notifyButton}>
          🔔 Notify When Available
        </button>
      </div>

      {/* Last Updated */}
      <div className={styles.lastUpdated}>
        Updated {Math.floor(Math.random() * 30) + 1}s ago
      </div>
    </div>
  );
}