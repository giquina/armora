import { useState, useEffect } from 'react';
import { QuickActionItem } from '../../types';
import { AssignmentHistoryManager } from '../../utils/assignmentHistory';
import { useApp } from '../../contexts/AppContext';
import styles from './PersonalizedQuickActions.module.css';

interface PersonalizedQuickActionsProps {
  onActionClick?: (action: QuickActionItem) => void;
  maxActions?: number;
  showHeader?: boolean;
}

export function PersonalizedQuickActions({
  onActionClick,
  maxActions = 3,
  showHeader = true
}: PersonalizedQuickActionsProps) {
  const { navigateToView } = useApp();
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuickActions = () => {
      try {
        const actions = AssignmentHistoryManager.generatePersonalizedQuickActions();
        setQuickActions(actions.slice(0, maxActions));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading quick actions:', error);
        setQuickActions([]);
        setIsLoading(false);
      }
    };

    loadQuickActions();
  }, [maxActions]);

  const handleActionClick = (action: QuickActionItem) => {
    if (onActionClick) {
      onActionClick(action);
      return;
    }

    // Default behavior based on action type
    if (action.data) {
      // Store the protection assignment data for pre-filling the protection assignment form
      localStorage.setItem('armora_rebook_data', JSON.stringify({
        from: action.data.from,
        to: action.data.to,
        service: 'service' in action.data ? action.data.service : action.data.preferredService,
        timestamp: new Date().toISOString(),
        actionType: action.type
      }));
    }

    navigateToView('protection-request');
  };

  const getActionGradient = (action: QuickActionItem): string => {
    switch (action.type) {
      case 'recent':
        return 'linear-gradient(135deg, #3b82f6, #60a5fa)'; // Blue gradient
      case 'frequent':
        return 'linear-gradient(135deg, #ffd700, #ffa500)'; // Gold gradient
      case 'suggestion':
        return 'linear-gradient(135deg, #10b981, #34d399)'; // Green gradient
      default:
        return 'linear-gradient(135deg, #6b7280, #9ca3af)'; // Gray gradient
    }
  };

  const getActionBorderColor = (action: QuickActionItem): string => {
    switch (action.type) {
      case 'recent':
        return 'rgba(59, 130, 246, 0.3)';
      case 'frequent':
        return 'rgba(255, 215, 0, 0.3)';
      case 'suggestion':
        return 'rgba(16, 185, 129, 0.3)';
      default:
        return 'rgba(107, 114, 128, 0.3)';
    }
  };

  const getUsageIndicator = (action: QuickActionItem): string | null => {
    if (action.type === 'recent' && action.lastUsed) {
      const lastUsed = new Date(action.lastUsed);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60));

      if (diffHours < 24) {
        return diffHours < 1 ? 'Just used' : `${diffHours}h ago`;
      }

      const diffDays = Math.floor(diffHours / 24);
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    }

    if (action.type === 'frequent' && action.usageCount) {
      return `${action.usageCount}x used`;
    }

    if (action.type === 'suggestion') {
      return 'Suggested';
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className={styles.quickActions}>
        {showHeader && (
          <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
        )}
        <div className={styles.actionsList}>
          {Array.from({ length: maxActions }, (_, i) => (
            <div key={i} className={styles.actionSkeleton}>
              <div className={styles.skeletonIcon}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonSubtitle}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (quickActions.length === 0) {
    return (
      <div className={styles.quickActions}>
        {showHeader && (
          <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
        )}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🚀</div>
          <h3 className={styles.emptyTitle}>Your Quick Actions</h3>
          <p className={styles.emptyText}>
            After your first protection assignment, personalized quick actions will appear here for faster rebooking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quickActions}>
      {showHeader && (
        <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
      )}

      <div className={styles.actionsList}>
        {quickActions.map((action, index) => (
          <button
            key={action.id}
            className={styles.actionCard}
            onClick={() => handleActionClick(action)}
            style={{
              background: getActionGradient(action),
              borderColor: getActionBorderColor(action),
            }}
          >
            <div className={styles.actionIcon}>
              {action.icon}
            </div>

            <div className={styles.actionContent}>
              <h3 className={styles.actionTitle}>
                {action.title}
              </h3>
              <p className={styles.actionSubtitle}>
                {action.subtitle}
              </p>

              {action.isPersonalized && (
                <div className={styles.personalizedBadge}>
                  <span className={styles.badgeIcon}>✨</span>
                  <span className={styles.badgeText}>Personalized</span>
                </div>
              )}
            </div>

            <div className={styles.actionMeta}>
              {getUsageIndicator(action) && (
                <div className={styles.usageIndicator}>
                  {getUsageIndicator(action)}
                </div>
              )}

              <div className={styles.actionArrow}>→</div>
            </div>
          </button>
        ))}
      </div>

      {quickActions.every(action => action.isPersonalized) && (
        <div className={styles.personalizationNote}>
          <span className={styles.noteIcon}>💡</span>
          <span className={styles.noteText}>
            Actions updated based on your protection assignment patterns
          </span>
        </div>
      )}
    </div>
  );
}