import { useState, useEffect, useCallback } from 'react';
import styles from './ActivityTicker.module.css';

interface ActivityItem {
  id: string;
  text: string;
  timestamp: number;
  type: 'protection-assignment' | 'rating' | 'member' | 'completion' | 'alert';
  icon: string;
}

export function ActivityTicker() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      text: "Executive protection completed in Mayfair",
      timestamp: Date.now() - 120000, // 2 minutes ago
      type: 'completion',
      icon: '✅'
    },
    {
      id: '2',
      text: "New member joined from Chelsea",
      timestamp: Date.now() - 180000, // 3 minutes ago
      type: 'member',
      icon: '🎯'
    },
    {
      id: '3',
      text: "5★ rating from corporate client",
      timestamp: Date.now() - 240000, // 4 minutes ago
      type: 'rating',
      icon: '⭐'
    },
    {
      id: '4',
      text: "Airport transfer to Heathrow secured",
      timestamp: Date.now() - 300000, // 5 minutes ago
      type: 'protection-assignment',
      icon: '✈️'
    },
    {
      id: '5',
      text: "VIP event protection confirmed for tonight",
      timestamp: Date.now() - 420000, // 7 minutes ago
      type: 'protection-assignment',
      icon: '🎭'
    }
  ]);

  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Activity templates for generating new activities
  const activityTemplates = [
    { text: "Protection service completed in {area}", type: 'completion' as const, icon: '✅', areas: ['Mayfair', 'Kensington', 'Chelsea', 'Canary Wharf', 'City of London', 'Westminster'] },
    { text: "New premium member from {area}", type: 'member' as const, icon: '🎯', areas: ['Belgravia', 'Knightsbridge', 'Notting Hill', 'Marylebone', 'Fitzrovia', 'South Kensington'] },
    { text: "{rating}★ rating from satisfied client", type: 'rating' as const, icon: '⭐', ratings: ['5', '5', '5', '4'] },
    { text: "{service} protection assignment confirmed", type: 'protection-assignment' as const, icon: '🚗', services: ['Executive protection', 'Airport transfer', 'Corporate security', 'Event protection', 'Shopping security'] },
    { text: "Officer dispatched to {location}", type: 'protection-assignment' as const, icon: '🚨', locations: ['Central London', 'West End', 'Heathrow Airport', 'luxury hotel', 'corporate office'] },
    { text: "Security assessment completed for {client}", type: 'completion' as const, icon: '📋', clients: ['Fortune 500 company', 'luxury retailer', 'private residence', 'diplomatic mission', 'media executive'] }
  ];

  // Generate new activity
  const generateActivity = useCallback((): ActivityItem => {
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    let text = template.text;

    // Replace placeholders
    if (template.areas) {
      const area = template.areas[Math.floor(Math.random() * template.areas.length)];
      text = text.replace('{area}', area);
    }
    if (template.ratings) {
      const rating = template.ratings[Math.floor(Math.random() * template.ratings.length)];
      text = text.replace('{rating}', rating);
    }
    if (template.services) {
      const service = template.services[Math.floor(Math.random() * template.services.length)];
      text = text.replace('{service}', service);
    }
    if (template.locations) {
      const location = template.locations[Math.floor(Math.random() * template.locations.length)];
      text = text.replace('{location}', location);
    }
    if (template.clients) {
      const client = template.clients[Math.floor(Math.random() * template.clients.length)];
      text = text.replace('{client}', client);
    }

    return {
      id: `activity-${Date.now()}-${Math.random()}`,
      text,
      timestamp: Date.now(),
      type: template.type,
      icon: template.icon
    };
  }, []);

  // Add new activity periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        const newActivity = generateActivity();
        setActivities(prev => {
          const updated = [newActivity, ...prev.slice(0, 9)]; // Keep only 10 activities
          return updated;
        });
      }
    }, 15000 + Math.random() * 10000); // Random interval between 15-25 seconds

    return () => clearInterval(interval);
  }, [isPaused, generateActivity]);

  // Auto-scroll through activities
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length);
    }, 4000); // Change activity every 4 seconds

    return () => clearInterval(interval);
  }, [activities.length, isPaused]);

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'protection-assignment': return '#3b82f6';
      case 'completion': return '#22c55e';
      case 'rating': return '#f59e0b';
      case 'member': return '#8b5cf6';
      case 'alert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (activities.length === 0) return null;

  return (
    <div
      className={styles.tickerContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.tickerHeader}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span className={styles.liveLabel}>LIVE ACTIVITY</span>
        </div>
        <span className={styles.tickerStats}>
          {activities.length} recent updates
        </span>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={`${styles.marqueeTrack} ${isPaused ? styles.paused : ''}`}>
          {/* Duplicate activities for seamless loop */}
          {[...activities, ...activities].map((activity, index) => (
            <div
              key={`${activity.id}-${index}`}
              className={styles.marqueeItem}
            >
              <span
                className={styles.activityIcon}
                style={{ color: getActivityColor(activity.type) }}
              >
                {activity.icon}
              </span>
              <span className={styles.activityText}>{activity.text}</span>
              <span className={styles.activityTime}>
                ({getTimeAgo(activity.timestamp)})
              </span>
              <span className={styles.itemSeparator}>•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}