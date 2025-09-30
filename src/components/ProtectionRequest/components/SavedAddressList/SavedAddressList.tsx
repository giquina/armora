import React from 'react';
import { SavedAddress } from '../../../../types';
import styles from './SavedAddressList.module.css';

interface SavedAddressListProps {
  savedAddresses: SavedAddress[];
  recentAddresses: string[];
  onSelectAddress: (address: string) => void;
  onClose: () => void;
}

export const SavedAddressList: React.FC<SavedAddressListProps> = ({
  savedAddresses,
  recentAddresses,
  onSelectAddress,
  onClose
}) => {
  // Separate saved addresses by type
  const homeAddress = savedAddresses.find(addr => addr.label === 'home');
  const workAddress = savedAddresses.find(addr => addr.label === 'work');
  const customAddresses = savedAddresses.filter(addr => addr.label === 'custom');

  const handleSelect = (address: string) => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Saved Addresses</h3>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close saved addresses"
        >
          ×
        </button>
      </div>

      <div className={styles.content}>
        {/* Home & Work */}
        {(homeAddress || workAddress) && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Quick Access</h4>
            {homeAddress && (
              <button
                className={styles.addressCard}
                onClick={() => handleSelect(homeAddress.address)}
              >
                <div className={styles.addressIcon}>🏠</div>
                <div className={styles.addressInfo}>
                  <div className={styles.addressLabel}>Home</div>
                  <div className={styles.addressText}>{homeAddress.address}</div>
                </div>
                <div className={styles.selectIcon}>→</div>
              </button>
            )}
            {workAddress && (
              <button
                className={styles.addressCard}
                onClick={() => handleSelect(workAddress.address)}
              >
                <div className={styles.addressIcon}>💼</div>
                <div className={styles.addressInfo}>
                  <div className={styles.addressLabel}>Work</div>
                  <div className={styles.addressText}>{workAddress.address}</div>
                </div>
                <div className={styles.selectIcon}>→</div>
              </button>
            )}
          </div>
        )}

        {/* Custom Saved Places */}
        {customAddresses.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Saved Places</h4>
            {customAddresses.map((address) => (
              <button
                key={address.id}
                className={styles.addressCard}
                onClick={() => handleSelect(address.address)}
              >
                <div className={styles.addressIcon}>📍</div>
                <div className={styles.addressInfo}>
                  <div className={styles.addressLabel}>{address.customLabel || 'Custom'}</div>
                  <div className={styles.addressText}>{address.address}</div>
                </div>
                <div className={styles.selectIcon}>→</div>
              </button>
            ))}
          </div>
        )}

        {/* Recent Locations */}
        {recentAddresses.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Recent</h4>
            {recentAddresses.slice(0, 5).map((address, index) => (
              <button
                key={`recent-${index}`}
                className={styles.addressCard}
                onClick={() => handleSelect(address)}
              >
                <div className={styles.addressIcon}>🕐</div>
                <div className={styles.addressInfo}>
                  <div className={styles.addressText}>{address}</div>
                </div>
                <div className={styles.selectIcon}>→</div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {savedAddresses.length === 0 && recentAddresses.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📍</div>
            <h4 className={styles.emptyTitle}>No saved addresses yet</h4>
            <p className={styles.emptyText}>
              Addresses you use will appear here for quick access next time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
