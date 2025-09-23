import React, { useMemo } from 'react';
import styles from './NotificationsPanel.module.css';
import { INotificationItem } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { state, markAllNotificationsRead, markNotificationRead, navigateToView } = useApp();
  const items = (state.notifications || []) as INotificationItem[];
  const unreadCount = useMemo(() => items.filter(i => !i.isRead).length, [items]);

  const handleView = (item: INotificationItem) => {
    markNotificationRead(item.id);
    // For HQ announcements, go to hub; later can route based on item metadata
    navigateToView('hub');
    onClose();
  };

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <aside className={`${styles.panel} ${isOpen ? styles.open : ''}`} role="dialog" aria-label="Notifications">
        <div className={styles.header}>
          <div className={styles.title}>Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}</div>
          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={markAllNotificationsRead}>Mark all read</button>
            <button className={styles.iconBtn} onClick={onClose} aria-label="Close">Close</button>
          </div>
        </div>
        <div className={styles.list}>
          {items.length === 0 ? (
            <div className={styles.empty}>No notifications yet.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className={`${styles.item} ${!item.isRead ? styles.itemUnread : ''}`}>
                <div className={styles.itemHeader}>
                  <span className={`${styles.badge} ${styles[item.type]}`}>{item.type.toUpperCase()}</span>
                  <span className={styles.time}>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.message}>{item.message}</div>
                <div className={styles.actions}>
                  {item.requiresAction && (
                    <button className={styles.iconBtn} onClick={() => handleView(item)}>
                      {item.actionText || 'View'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
