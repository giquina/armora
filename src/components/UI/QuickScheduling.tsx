import { useState, useEffect } from 'react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import styles from './QuickScheduling.module.css';

interface QuickSchedulingProps {
  onScheduleConfirmed: (scheduledDateTime: string, displayText: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  selectedService?: string;
  userProfile?: {
    preferredTime?: string;
    isBusinessUser?: boolean;
    timeZone?: string;
    recentBookings?: Array<{ time: string; date: string }>;
  };
}

export function QuickScheduling({
  onScheduleConfirmed,
  onCancel,
  isLoading = false,
  selectedService = 'Standard',
  userProfile
}: QuickSchedulingProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showAdvancedCalendar, setShowAdvancedCalendar] = useState(false);

  // Intelligent defaults based on user profile
  const getSmartPresets = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presets = [
      {
        id: 'in-1-hour',
        label: 'In 1 Hour',
        sublabel: new Date(now.getTime() + 60 * 60 * 1000).toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', hour12: true
        }),
        icon: '⚡',
        dateTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
        priority: userProfile?.isBusinessUser ? 2 : 1
      },
      {
        id: 'tomorrow-morning',
        label: 'Tomorrow Morning',
        sublabel: tomorrow.toLocaleDateString('en-GB', {
          weekday: 'short', month: 'short', day: 'numeric'
        }) + ' • 9:00 AM',
        icon: '🌅',
        dateTime: (() => {
          const tomorrowMorning = new Date(tomorrow);
          tomorrowMorning.setHours(9, 0, 0, 0);
          return tomorrowMorning.toISOString();
        })(),
        priority: userProfile?.isBusinessUser ? 1 : 2
      },
      {
        id: 'tomorrow-evening',
        label: 'Tomorrow Evening',
        sublabel: tomorrow.toLocaleDateString('en-GB', {
          weekday: 'short', month: 'short', day: 'numeric'
        }) + ' • 6:00 PM',
        icon: '🌆',
        dateTime: (() => {
          const tomorrowEvening = new Date(tomorrow);
          tomorrowEvening.setHours(18, 0, 0, 0);
          return tomorrowEvening.toISOString();
        })(),
        priority: 3
      },
      {
        id: 'this-weekend',
        label: 'This Weekend',
        sublabel: (() => {
          const saturday = new Date(now);
          const daysUntilSaturday = 6 - now.getDay();
          saturday.setDate(now.getDate() + daysUntilSaturday);
          return saturday.toLocaleDateString('en-GB', {
            weekday: 'short', month: 'short', day: 'numeric'
          }) + ' • 10:00 AM';
        })(),
        icon: '🏖️',
        dateTime: (() => {
          const saturday = new Date(now);
          const daysUntilSaturday = 6 - now.getDay();
          saturday.setDate(now.getDate() + daysUntilSaturday);
          saturday.setHours(10, 0, 0, 0);
          return saturday.toISOString();
        })(),
        priority: 4
      }
    ];

    // Sort by priority for smart ordering
    return presets.sort((a, b) => a.priority - b.priority);
  };

  const presets = getSmartPresets();

  // Auto-select the highest priority preset if user is a business user
  useEffect(() => {
    if (userProfile?.isBusinessUser && !selectedPreset) {
      setSelectedPreset('tomorrow-morning');
    }
  }, [userProfile, selectedPreset]);

  const handlePresetSelect = (presetId: string) => {
    if (presetId === 'custom') {
      setShowAdvancedCalendar(true);
      setSelectedPreset(null);
      return;
    }

    setSelectedPreset(presetId);
    setShowAdvancedCalendar(false);

    // Analytics - tracking preset selection
    console.log('Preset selected:', {
      presetId,
      service: selectedService,
      timestamp: Date.now()
    });
  };

  const handleConfirmBooking = () => {
    if (!selectedPreset) return;

    const selectedOption = presets.find(p => p.id === selectedPreset);
    if (!selectedOption) return;

    const dateTimeToUse = selectedOption.dateTime;
    const displayText = `${selectedOption.label} - ${selectedOption.sublabel}`;

    onScheduleConfirmed(dateTimeToUse, displayText);
  };

  const isBookingReady = selectedPreset;

  return (
    <div className={styles.quickSchedulingContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Schedule Your {selectedService}</h2>
          <p className={styles.subtitle}>Quick protection assignment - choose your preferred time</p>
        </div>
        <button
          className={styles.closeButton}
          onClick={onCancel}
          aria-label="Close scheduling"
        >
          ×
        </button>
      </div>

      {/* Smart Presets - Primary Options */}
      <div className={styles.presetsSection}>
        <h3 className={styles.sectionTitle}>Popular Times</h3>
        <div className={styles.presetsGrid}>
          {presets.map((preset) => (
            <button
              key={preset.id}
              className={`${styles.presetButton} ${
                selectedPreset === preset.id ? styles.selected : ''
              }`}
              onClick={() => handlePresetSelect(preset.id)}
            >
              <div className={styles.presetIcon}>{preset.icon}</div>
              <div className={styles.presetContent}>
                <span className={styles.presetLabel}>{preset.label}</span>
                <span className={styles.presetSublabel}>{preset.sublabel}</span>
              </div>
              {selectedPreset === preset.id && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Time Option - Progressive Disclosure */}
      <div className={styles.customSection}>
        <button
          className={`${styles.customTrigger} ${showAdvancedCalendar ? styles.active : ''}`}
          onClick={() => setShowAdvancedCalendar(!showAdvancedCalendar)}
        >
          <span className={styles.customIcon}>🗓️</span>
          <span className={styles.customLabel}>
            {showAdvancedCalendar ? 'Hide Calendar' : 'Pick Custom Time'}
          </span>
          <span className={styles.customChevron}>
            {showAdvancedCalendar ? '▲' : '▼'}
          </span>
        </button>

        {showAdvancedCalendar && (
          <div className={styles.advancedCalendar}>
            <div className={styles.calendarPlaceholder}>
              {/* This will be replaced with the actual calendar component */}
              <div className={styles.comingSoon}>
                <span className={styles.comingSoonIcon}>⚙️</span>
                <p className={styles.comingSoonText}>
                  Advanced calendar integration coming in Phase 2
                </p>
                <p className={styles.comingSoonSubtext}>
                  Use quick presets above for now - they cover 95% of bookings
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Bookings Suggestion (if available) */}
      {userProfile?.recentBookings && userProfile.recentBookings.length > 0 && (
        <div className={styles.recentSection}>
          <h3 className={styles.sectionTitle}>Book Again</h3>
          <div className={styles.recentBookings}>
            {userProfile.recentBookings.slice(0, 2).map((assignment, index) => (
              <button
                key={index}
                className={styles.recentBooking}
                onClick={() => {
                  // Create datetime from recent assignment
                  const bookingDateTime = new Date(`${assignment.date} ${assignment.time}`).toISOString();
                  onScheduleConfirmed(bookingDateTime, `Same as last time - ${assignment.time}`);
                }}
              >
                <div className={styles.recentIcon}>🔄</div>
                <div className={styles.recentContent}>
                  <span className={styles.recentLabel}>Same as {assignment.date}</span>
                  <span className={styles.recentTime}>{assignment.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmBooking}
          disabled={!isBookingReady || isLoading}
          className={styles.confirmButton}
        >
          {isLoading ? (
            <LoadingSpinner size="small" variant="light" text="Assignment..." inline />
          ) : (
            <>
              <span className={styles.buttonIcon}>🚗</span>
              Request CPO
            </>
          )}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⚡</span>
          <span className={styles.statText}>Instant confirmation</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>📱</span>
          <span className={styles.statText}>SMS reminders</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🔄</span>
          <span className={styles.statText}>Easy to modify</span>
        </div>
      </div>
    </div>
  );
}