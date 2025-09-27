import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { ViewState } from '../../types';
import styles from './HamburgerMenu.module.css';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { navigateToView, state } = useApp();
  const { user } = state;

  const handleNavigation = (view: ViewState) => {
    navigateToView(view);
    onClose();
  };

  const handleRequestProtection = () => {
    navigateToView('protection-request');
    onClose();
  };

  const menuSections = {
    quickActions: {
      title: "PRIORITY ACCESS",
      items: [
        { label: "Request Protection Now", icon: "⚡", action: handleRequestProtection },
        { label: "Important Contacts", icon: "📞", action: () => handleNavigation('account') },
        { label: "Safety Resources", icon: "🛡️", action: () => handleNavigation('hub') }
      ]
    },
    protectionServices: {
      title: "PROTECTION SERVICES",
      items: [
        { label: "Essential Protection", icon: "🚗", action: () => handleNavigation('services') },
        { label: "Executive Shield", icon: "👔", action: () => handleNavigation('services') },
        { label: "Shadow Protocol", icon: "🥷", action: () => handleNavigation('services') },
        { label: "Venue Protection", icon: "🏢", action: () => handleNavigation('services') }
      ]
    },
    account: {
      title: "MY ACCOUNT",
      items: [
        { label: "Profile Settings", icon: "⚙️", action: () => handleNavigation('account') },
        { label: "Payment Methods", icon: "💳", action: () => handleNavigation('account') },
        { label: "Subscription Plan", icon: "⭐", action: () => handleNavigation('account') },
        { label: "Protection History", icon: "📊", action: () => handleNavigation('hub') }
      ]
    },
    support: {
      title: "HELP & SUPPORT",
      items: [
        { label: "Contact Support", icon: "💬", action: () => handleNavigation('account') },
        { label: "Coverage Areas", icon: "🗺️", action: () => handleNavigation('services') },
        { label: "Safety Guidelines", icon: "📋", action: () => handleNavigation('hub') },
        { label: "About Armora", icon: "ℹ️", action: () => handleNavigation('account') }
      ]
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.menu}>
        <div className={styles.header}>
          <h3 className={styles.title}>Menu</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.preferredName || user.name || user.legalName?.first || 'User'}
              </div>
              <div className={styles.userType}>
                {user.userType === 'registered' ? 'Premium Member' :
                 user.userType === 'google' ? 'Premium Member' : 'Guest'}
              </div>
            </div>
          )}

          {Object.entries(menuSections).map(([key, section]) => (
            <div key={key} className={styles.section}>
              <h4 className={styles.sectionTitle}>{section.title}</h4>
              <div className={styles.sectionDivider}></div>
              <ul className={styles.itemList}>
                {section.items.map((item, index) => (
                  <li key={index}>
                    <button
                      className={styles.menuItem}
                      onClick={item.action}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      <span className={styles.menuArrow}>›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};