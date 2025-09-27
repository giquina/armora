import styles from './quick-actions.module.css';

interface QuickActionsProps {
  onNearestHubs: () => void;
  onAvailableOnly: () => void;
  onFavorites: () => void;
  onAll: () => void;
  activeFilter: string;
}

export function QuickActions({
  onNearestHubs,
  onAvailableOnly,
  onFavorites,
  onAll,
  activeFilter
}: QuickActionsProps) {
  const actions = [
    {
      id: 'all',
      icon: '🏢',
      label: 'All Hubs',
      onClick: onAll
    },
    {
      id: 'nearest',
      icon: '📍',
      label: 'Nearest',
      onClick: onNearestHubs
    },
    {
      id: 'available',
      icon: '✅',
      label: 'Available',
      onClick: onAvailableOnly
    },
    {
      id: 'favorites',
      icon: '❤️',
      label: 'Favorites',
      onClick: onFavorites
    }
  ];

  return (
    <div className={styles.quickActionsBar}>
      {actions.map(action => (
        <button
          key={action.id}
          className={`${styles.quickActionButton} ${
            activeFilter === action.id ? styles.active : ''
          }`}
          onClick={action.onClick}
          aria-pressed={activeFilter === action.id}
        >
          <span className={styles.quickActionIcon}>{action.icon}</span>
          <span className={styles.quickActionLabel}>{action.label}</span>
        </button>
      ))}
    </div>
  );
}